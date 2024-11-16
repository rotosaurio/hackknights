'use client';
import React, { useState, useEffect } from 'react';
import SignIn from './singup';
import Question1 from './question1';

const Login: React.FC<{ onClose: () => void; onLoginSuccess: () => void }> = ({ onClose, onLoginSuccess }) => {
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
      onLoginSuccess();

      // Verificar si el usuario ya tiene respuestas
      const checkRes = await fetch(`/api/check-quiz-responses?userName=${data.user.name}`);
      const checkData = await checkRes.json();

      if (checkData.hasResponses) {
        onClose();
        window.location.href = '/Bitacora';
      } else {
        if (data.user.isDiabetic === undefined) {
          setShowQuestion1(true);
        } else {
          onClose();
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
        throw new Error(errorData.error || 'Error al actualizar el usuario');
      }

      const data = await res.json();
      const updatedUser = { ...user, isDiabetic: data.user.isDiabetic };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      onClose();
      window.location.href = isDiabetic ? '/quizzdiabetes' : '/quizznodiabetes';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el usuario');
    }
  };

  return (
    <div className="relative shadow-lg p-6 bg-white rounded-lg max-w-md mx-auto mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full transition duration-300"
        >
          Iniciar Sesión
        </button>
      </form>
      {showQuestion1 && (
        <Question1 
          onDiabeticResponse={handleDiabeticResponse} 
          onClose={() => setShowQuestion1(false)}
        />
      )}
    </div>
  );
};

export default Login;