'use client';
import React, { useState } from 'react';

const SignIn: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear la cuenta');
      }

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Cerrar modal o redireccionar
      onClose();
      window.location.href = '/dashboard'; // O donde quieras redireccionar después del registro

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la cuenta');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-[rgb(139,184,135)] bg-opacity-90 p-8 rounded-lg shadow-md w-96">
        <h1 className="bg-[rgb(139,184,135)] text-3xl font-bold mb-6 text-white">Crear Cuenta</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <button
            type="submit"
            className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full transition duration-300"
          >
            Crear Cuenta
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;