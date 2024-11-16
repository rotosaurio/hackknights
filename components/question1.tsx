'use client';
import React from 'react';

const Question1: React.FC<{ onClose: () => void; onConfirm: () => void }> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-white text-center">¿Tienes diabetes?</h1>
        <div className="flex justify-between space-x-4">
          <button
            onClick={onConfirm}
            className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full transition duration-300"
          >
            Sí
          </button>
          <button
            onClick={onClose}
            className="w-full bg-[rgb(193,255,186)] hover:bg-green-300 text-black py-2 rounded-full transition duration-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question1;
