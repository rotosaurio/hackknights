'use client';
import React, { useState } from 'react';
import SignIn from './singup';

const Login: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Cerrar modal y redireccionar
      toggleModal();
      window.location.href = '/dashboard'; // O donde quieras redireccionar después del login

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  };

  return (
    <>
      <button onClick={toggleModal} className="btn">Iniciar sesión</button>

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
    </>
  );
};

export default Login;