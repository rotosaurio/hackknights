'use client';
import React, { useState } from 'react';
import Question1 from './question1';
const SignIn: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDiabeticQuestion, setShowDiabeticQuestion] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setShowDiabeticQuestion(true);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el registro');
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

      window.location.href = isDiabetic ? '/quizzdiabetes' : '/quizznodiabetes';

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el usuario');
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '400px',
      position: 'relative' as const
    },
    closeButton: {
      position: 'absolute' as const,
      top: '10px',
      right: '10px',
      border: 'none',
      background: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    },
    questionContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '20px'
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer'
    },
    error: {
      color: 'red',
      textAlign: 'center' as const,
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button 
          style={styles.closeButton}
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        
        {!showDiabeticQuestion ? (
          <form onSubmit={handleSignUp} style={styles.form}>
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
          </form>
        ) : (
          <div style={styles.questionContainer}>
            <h2>¿Eres diabético?</h2>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => handleDiabeticResponse(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Sí
              </button>
              <button
                onClick={() => handleDiabeticResponse(false)}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                No
              </button>
            </div>
          </div>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;