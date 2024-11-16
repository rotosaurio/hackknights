'use client';
import React, { useState } from 'react';
import Question1 from './question1';

const SignIn: React.FC<{ onClose: () => void; onCreateAccount: () => void }> = ({ onClose, onCreateAccount }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose(); // Cerrar modal de SignIn
    onCreateAccount(); // Abrir Question1
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-[rgb(139,184,135)] bg-opacity-90 p-8 rounded-lg shadow-md w-96">
        <h1 className="bg-[rgb(139,184,135)] text-3xl font-bold mb-6 text-white">Crear Cuenta</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
