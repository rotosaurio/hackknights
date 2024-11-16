'use client';
import React, { useState } from 'react';

const SignIn: React.FC<{ onClose: () => void; onOpenQuestion1: () => void }> = ({ onClose, onOpenQuestion1 }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDiabeticQuestion, setShowDiabeticQuestion] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Enviar datos a la API de signup
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error en el registro');
      }

      // Si el registro es exitoso, guarda el usuario y cierra el modal
      const userData = await res.json();
      localStorage.setItem('user', JSON.stringify(userData)); // Guardar el usuario en localStorage

      // Cerrar el modal de SignIn y abrir el modal de Question1
      onClose(); // Cierra el modal de SignIn
      onOpenQuestion1(); // Abre el modal de Question1

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al registrar el usuario');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="relative shadow-lg p-6 bg-white rounded-lg max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Cuenta</h1>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full transition duration-300"
          >
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
