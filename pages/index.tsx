'use client';
import React, { useEffect, useState } from 'react';
import Login from '@/components/login';
import signin from '@/assets/signin.png';
import VoiceRecorder from '../components/VoiceRecorder';

const HomePage: React.FC = () => {
  const [hasResponses, setHasResponses] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkQuizResponses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.name) {
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        const response = await fetch(`/api/check-quiz-responses?userName=${user.name}`);
        const data = await response.json();
        
        setHasResponses(data.hasResponses);
      } catch (error) {
        console.error('Error al verificar respuestas:', error);
      } finally {
        setLoading(false);
      }
    };

    checkQuizResponses();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Componente de botón reutilizable
  function Button({ href, children, variant = "default" }: { href: string; children: React.ReactNode; variant?: "default" | "outline"; }) {
    const baseClasses = "px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-full transition-colors duration-300 shadow-lg";
    const variantClasses = {
      default: "bg-white text-black hover:bg-gray-200",
      outline: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black"
    };

    return (
      <a 
        href={href} 
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {children}
      </a>
    );
  }

  return (
    <div className="bg-[rgb(193,255,186)] text-gray-900 min-h-screen flex flex-col">
      <header className="bg-[rgb(168,222,162)] flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Asistente Médico para Diabéticos</h1>
        <div className="flex space-x-4">
          {isLoggedIn && (
            <Button href="/Bitacora" variant="outline">
              Mi Bitácora
            </Button>
          )}
          <Login />
        </div>
      </header>
      
      <main className="flex flex-col items-start p-8">
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold mb-4">¡Bienvenido a tu Asistente Integral para el Manejo de la Diabetes!</h2>
          <p className="mb-2">Nuestra aplicación está aquí para facilitar tu día a día, ofreciéndote herramientas prácticas y personalizadas para cuidar tu salud.</p>
          <h3 className="font-semibold">¿Qué puedes hacer con esta app?</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Descubre si eres propenso a desarrollar diabetes o confirma tu estado actual.</li>
            <li>Realiza autoevaluaciones rápidas con nuestros quizzes interactivos.</li>
            <li>Lleva una bitácora detallada de tus indicadores y sistemas, visualizando todo en gráficos con fecha y hora.</li>
            <li>Genera planes personalizados de alimentación y actividades diarias adaptados a tus necesidades.</li>
            <li>Crea reportes profesionales para tu médico con toda la información clave sobre tu salud.</li>
          </ul>
          <p className="font-semibold">Tu salud, en tus manos. Mejora tu calidad de vida con el apoyo de esta herramienta completa, confiable y diseñada pensando en ti.</p>
        </div>
      </main>

      {/* Mostrar VoiceRecorder integrado en la página principal */}
      {hasResponses && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Asistente de Voz para Recetas
          </h2>
          <VoiceRecorder />
        </div>
      )}
    </div>

  );
};

export default HomePage;
