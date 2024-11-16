'use client';
import React, { useState, useEffect } from 'react';
import Login from '@/components/login';
import SignIn from '@/components/signin';
import FAQSlider from '@/components/FAQSlider';
import Question1 from '@/components/question1';

const HomePage: React.FC = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [isQuestion1Open, setIsQuestion1Open] = useState(false);

  const toggleSignInModal = () => {
    setIsSignInOpen(!isSignInOpen);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleOpenQuestion1 = () => {
    setIsSignInOpen(false); // Cierra el modal de SignIn
    setIsQuestion1Open(true); // Abre el modal de Question1
  };

  const handleDiabeticResponse = async (isDiabetic: boolean) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      if (!user.name || !token) {
        throw new Error('Información de usuario no disponible');
      }

      console.log('Enviando actualización:', { userName: user.name, isDiabetic });

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
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al actualizar el usuario');
      }

      const data = await res.json();
      console.log('Respuesta exitosa:', data);
      
      const updatedUser = { ...user, isDiabetic: data.user.isDiabetic };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      window.location.href = isDiabetic ? '/quizzdiabetes' : '/quizznodiabetes';

    } catch (error) {
      console.error('Error en handleDiabeticResponse:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      <header className="flex justify-between items-center w-full p-4 bg-white shadow">
        <div className="flex items-center">
          <img src="/path/to/your/image.png" alt="Logo" className="h-10 mr-4" />
          <h1 className="text-2xl font-bold">Asistente Médico para Diabéticos</h1>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-8">
        {isSignInOpen ? (
          <SignIn onClose={toggleSignInModal} onOpenQuestion1={handleOpenQuestion1} />
        ) : isLoggedIn ? (
          isQuestion1Open ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Question1 onDiabeticResponse={handleDiabeticResponse} onClose={() => setIsQuestion1Open(false)} />
            </div>
          ) : (
            <Login onClose={toggleSignInModal} onLoginSuccess={handleLoginSuccess} />
          )
        ) : (
          <Login onClose={toggleSignInModal} onLoginSuccess={handleLoginSuccess} />
        )}

        <div className="mt-3 flex items-center">
          <p className="mr-2">No tienes cuenta</p>
          <button
            onClick={toggleSignInModal}
            className="bg-green-500 text-white py-2 px-4 rounded-full transition duration-300"
          >
            Crear cuenta
          </button>
        </div>

        <FAQSlider />

        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[500px]">
  <h2 className="text-center text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
  <ul className="space-y-6">
    <li>
      <p className="font-semibold">
        ¿Cómo registro mis datos de salud, como niveles de glucosa o presión arterial?
      </p>
      <p className="text-gray-700">
        Ingresa a la sección de Bitácora de Indicadores y selecciona el botón "Añadir nuevo registro". Allí podrás introducir tus niveles de glucosa, presión arterial, o cualquier otro indicador con la fecha y hora correspondiente.
      </p>
    </li>
    <li>
      <p className="font-semibold">
        ¿Cómo funciona el plan personalizado de alimentación y actividades?
      </p>
      <p className="text-gray-700">
        Al completar tu perfil y responder preguntas sobre tus hábitos alimenticios y nivel de actividad física, la aplicación generará un plan adaptado a tus necesidades específicas. Puedes encontrarlo en la sección Mi Plan Diario.
      </p>
    </li>
    <li>
      <p className="font-semibold">¿Cómo puedo generar un reporte para mi médico?</p>
      <p className="text-gray-700">
        En la sección Reportes Médicos, selecciona el rango de fechas que deseas incluir y los datos relevantes (glucosa, presión arterial, actividades, etc.). La aplicación generará un resumen en formato PDF que podrás descargar o compartir directamente con tu médico.
      </p>
    </li>
    <li>
      <p className="font-semibold">¿Cómo se visualizan los datos en gráficos?</p>
      <p className="text-gray-700">
        Los gráficos están disponibles en la sección Bitácora de Indicadores. Ahí puedes seleccionar el tipo de indicador (glucosa, presión, peso, etc.) y ver tendencias a lo largo del tiempo.
      </p>
    </li>
  </ul>
</div>

      </main>
    </div>
  );
};

export default HomePage;
