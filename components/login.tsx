'use client';
import React, { useState, useEffect } from 'react';
import SignIn from './singup';
import Question1 from './question1';
const Login: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [showQuestion1, setShowQuestion1] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError('');
  };

  const toggleSignInModal = () => {
    setIsSignInOpen(!isSignInOpen);
    setIsOpen(false);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUserName(data.user.name);

      // Verificar si el usuario ya tiene respuestas
      const checkRes = await fetch(`/api/check-quiz-responses?userName=${data.user.name}`);
      const checkData = await checkRes.json();

      toggleModal();

      if (checkData.hasResponses) {
        window.location.href = '/';
      } else {
        if (data.user.isDiabetic === undefined) {
          setShowQuestion1(true);
        } else {
          window.location.href = data.user.isDiabetic ? '/quizzdiabetes' : '/quizznodiabetes';
        }
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  };

  const handleDiabeticResponse = async (isDiabetic: boolean) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      if (!user.name || !token) {
        throw new Error('Información de usuario no disponible');
      }

      console.log('Enviando actualización:', { userName: user.name, isDiabetic });

      const res = await fetch('/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userName: user.name, 
          isDiabetic 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al actualizar el usuario');
      }

      const data = await res.json();
      console.log('Respuesta exitosa:', data);
      
      const updatedUser = { ...user, isDiabetic: data.user.isDiabetic };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      window.location.href = isDiabetic ? '/quizzdiabetes' : '/quizznodiabetes';

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el usuario');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserName(null);
    setShowDropdown(false);
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      {userName ? (
        <>
          <button 
            onClick={toggleDropdown}
            className="text-white font-semibold hover:text-gray-300 transition-colors"
          >
            {userName}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </>
      ) : (
        <button onClick={toggleModal} className="bg-[rgb(193,255,186)] hover:bg-green-300 text-black px-4 py-2 rounded-full transition duration-300">
          Iniciar sesión
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-[rgb(139,184,135)] bg-opacity-90 p-8 rounded-lg shadow-md w-96">
            <h1 className="bg-[rgb(139,184,135)] text-3xl font-bold mb-6 text-white">Iniciar Sesión</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full transition duration-300"
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={toggleSignInModal}
                  className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full flex items-center justify-center space-x-2 transition duration-300"
                >
                  <span className="material-icons text-black text-xl">Crear cuenta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSignInOpen && <SignIn onClose={toggleSignInModal} />}

      {showQuestion1 && (
        <Question1 onDiabeticResponse={handleDiabeticResponse} />
      )}
    </div>
  );
};

export default Login;