'use client';
import React from 'react';

interface Question1Props {
  onDiabeticResponse: (isDiabetic: boolean) => void;
  onClose: () => void;
}

const Question1: React.FC<Question1Props> = ({ onDiabeticResponse, onClose }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">¿Eres diabético?</h2>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            onDiabeticResponse(true);
            window.location.href = '/quizzdiabetes';
          }}
          className="px-6 py-2 bg-[#C1FFBA] text-black rounded-full hover:bg-green-400 transition-colors"
        >
          Sí, tengo diabetes
        </button>
        <button
          onClick={() => {
            onDiabeticResponse(false);
            window.location.href = '/quizznodiabetes';
          }}
          className="px-6 py-2 bg-[#C1FFBA] text-black rounded-full hover:bg-green-400 transition-colors"
        >
          No, no tengo diabetes
        </button>
      </div>
    </div>
  );
};

export default Question1;