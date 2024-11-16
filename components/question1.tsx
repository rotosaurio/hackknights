'use client';
import React from 'react';

interface Question1Props {
  onDiabeticResponse: (isDiabetic: boolean) => void;
}

const Question1: React.FC<Question1Props> = ({ onDiabeticResponse }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Información Importante
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          Para brindarte la mejor experiencia, necesitamos saber:
          ¿Has sido diagnosticado con diabetes?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onDiabeticResponse(true)}
            className="px-6 py-2 bg-[#C1FFBA] text-black rounded-full hover:bg-green-400 transition-colors"
          >
            Sí, tengo diabetes
          </button>
          <button
            onClick={() => onDiabeticResponse(false)}
            className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors"
          >
            No tengo diabetes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question1;