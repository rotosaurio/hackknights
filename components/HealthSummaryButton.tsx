import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function HealthSummaryButton() {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = (summary: string) => {
    const doc = new jsPDF();
    
    // Configurar fuente para caracteres españoles
    doc.setFont('helvetica');
    
    // Agregar título
    doc.setFontSize(20);
    doc.text('Resumen de Salud', 20, 20);
    
    // Agregar fecha
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Agregar contenido del resumen
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(summary, 170);
    doc.text(splitText, 20, 40);
    
    // Descargar PDF
    doc.save('resumen-salud.pdf');
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('/api/generate-health-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userName: user.name 
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar el resumen');
      }

      const data = await response.json();
      if (data.summary) {
        generatePDF(data.summary);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el resumen de salud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerateSummary}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-lg
        ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}
        text-white font-medium
        transition-colors duration-200
        flex items-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⭕</span>
          Generando...
        </>
      ) : (
        <>
          📋 Generar Resumen de Salud
        </>
      )}
    </button>
  );
}