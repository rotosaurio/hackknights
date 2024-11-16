import React, { useState } from 'react';

type ResponseState = {
  [key: string]: string | number;
};

const Quiz: React.FC = () => {
  const [responses, setResponses] = useState<ResponseState>({});
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string | number) => {
    if (typeof value === 'number' && value < 0) {
      setError('Por favor, ingresa un valor positivo.');
      return;
    } else {
      setError(null);
    }

    setResponses({ ...responses, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      const res = await fetch('/api/save-quiz-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          responses,
          isDiabetic: true,
          userName: user.name
        }),
      });

      if (!res.ok) {
        throw new Error('Error al guardar las respuestas');
      }

      window.location.href = '/Bitacora';

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar las respuestas');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Encuesta de Perfil de Salud para la Diabetes</h1>
        <p style={styles.description}>
          ¡Bienvenido! Antes de comenzar a ayudarte a manejar tu salud, vamos a recopilar algunos datos importantes. Responder estas preguntas nos permitirá adaptar la aplicación a tus necesidades. Puedes responder por voz o texto, según lo que te resulte más cómodo.
        </p>

        {/* Edad */}
        <div style={styles.field}>
          <label htmlFor="edad" style={styles.label}>1. Edad</label>
          <input
            type="number"
            id="edad"
            name="edad"
            style={styles.input}
            placeholder="¿Cuántos años tienes?"
            onChange={(e) => handleInputChange('edad', e.target.value)}
            required
            min="0"
          />
        </div>

        {/* Altura */}
        <div style={styles.field}>
          <label htmlFor="altura" style={styles.label}>2. Altura</label>
          <input
            type="number"
            id="altura"
            name="altura"
            style={styles.input}
            placeholder="¿Cuál es tu altura? Puedes decirlo en pies y pulgadas, o en centímetros."
            onChange={(e) => handleInputChange('altura', e.target.value)}
            required
            min="0"
          />
        </div>

        {/* Peso */}
        <div style={styles.field}>
          <label htmlFor="peso" style={styles.label}>3. Peso</label>
          <input
            type="number"
            id="peso"
            name="peso"
            style={styles.input}
            placeholder="¿Cuál es tu peso actual? Puedes decirlo en libras o kilogramos."
            onChange={(e) => handleInputChange('peso', e.target.value)}
            required
            min="0"
          />
        </div>

        {/* Género */}
        <div style={styles.field}>
          <label htmlFor="genero" style={styles.label}>4. Género</label>
          <select
            id="genero"
            name="genero"
            style={styles.select}
            onChange={(e) => handleInputChange('genero', e.target.value)}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>

        {/* Nivel de Actividad */}
        <div style={styles.field}>
          <label htmlFor="nivel_actividad" style={styles.label}>5. Nivel de Actividad</label>
          <select
            id="nivel_actividad"
            name="nivel_actividad"
            style={styles.select}
            onChange={(e) => handleInputChange('nivel_actividad', e.target.value)}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Sedentario">Sedentario (poca o ninguna actividad física)</option>
            <option value="Ligeramente activo">Ligeramente activo (ejercicio ligero o deportes 1-3 días a la semana)</option>
            <option value="Moderadamente activo">Moderadamente activo (ejercicio moderado 3-5 días a la semana)</option>
            <option value="Muy activo">Muy activo (ejercicio intenso 6-7 días a la semana)</option>
          </select>
        </div>

        {/* Condiciones Médicas */}
        <div style={styles.field}>
          <label htmlFor="condiciones_medicas" style={styles.label}>6. Condiciones Médicas</label>
          <input
            type="text"
            id="condiciones_medicas"
            name="condiciones_medicas"
            style={styles.input}
            placeholder="¿Tienes alguna otra condición médica además de la diabetes? (Ej. hipertensión, problemas de colesterol, etc.)"
            onChange={(e) => handleInputChange('condiciones_medicas', e.target.value)}
            required
          />
        </div>

        {/* Medicamentos */}
        <div style={styles.field}>
          <label htmlFor="medicamentos" style={styles.label}>7. Medicamentos</label>
          <input
            type="text"
            id="medicamentos"
            name="medicamentos"
            style={styles.input}
            placeholder="¿Estás tomando algún medicamento para la diabetes u otras condiciones? Si es así, ¿cuáles?"
            onChange={(e) => handleInputChange('medicamentos', e.target.value)}
            required
          />
        </div>

        {/* Monitoreo de Niveles de Glucosa */}
        <div style={styles.field}>
          <label htmlFor="monitoreo_glucosa" style={styles.label}>8. Monitoreo de Niveles de Glucosa</label>
          <select
            id="monitoreo_glucosa"
            name="monitoreo_glucosa"
            style={styles.select}
            onChange={(e) => handleInputChange('monitoreo_glucosa', e.target.value)}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Diariamente">Diariamente</option>
            <option value="Semanalmente">Semanalmente</option>
            <option value="Ocasionalmente">Ocasionalmente</option>
            <option value="Nunca">Nunca</option>
          </select>
        </div>

        {/* Preferencias o Restricciones Dietéticas */}
        <div style={styles.field}>
          <label htmlFor="restricciones_dieteticas" style={styles.label}>9. Preferencias o Restricciones Dietéticas</label>
          <input
            type="text"
            id="restricciones_dieteticas"
            name="restricciones_dieteticas"
            style={styles.input}
            placeholder="¿Sigues alguna dieta específica o tienes alguna restricción alimentaria que debamos saber?"
            onChange={(e) => handleInputChange('restricciones_dieteticas', e.target.value)}
            required
          />
        </div>

        {/* Alergias */}
        <div style={styles.field}>
          <label htmlFor="alergias" style={styles.label}>10. Alergias</label>
          <input
            type="text"
            id="alergias"
            name="alergias"
            style={styles.input}
            placeholder="¿Tienes alguna alergia alimentaria?"
            onChange={(e) => handleInputChange('alergias', e.target.value)}
            required
          />
        </div>

        {/* Patrones de Comida */}
        <div style={styles.field}>
          <label htmlFor="patrones_comida" style={styles.label}>11. Patrones de Comida</label>
          <input
            type="text"
            id="patrones_comida"
            name="patrones_comida"
            style={styles.input}
            placeholder="¿Cuántas comidas sueles hacer al día? (Ej. 3 comidas principales, meriendas, etc.)"
            onChange={(e) => handleInputChange('patrones_comida', e.target.value)}
            required
          />
        </div>

        {/* Desafíos Actuales */}
        <div style={styles.field}>
          <label htmlFor="desafios" style={styles.label}>12. Desafíos Actuales</label>
          <input
            type="text"
            id="desafios"
            name="desafios"
            style={styles.input}
            placeholder="¿Hay algo con lo que tengas dificultades al manejar la diabetes? (Ej. dieta, actividad física, recordar medicamentos)"
            onChange={(e) => handleInputChange('desafios', e.target.value)}
            required
          />
        </div>

        {/* Mensaje de Error */}
        {error && <p style={styles.error}>{error}</p>}

        <button 
          type="submit" 
          style={styles.button}
          disabled={!!error}
        >
          Guardar Respuestas
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center' as 'center',
    color: '#333',
  },
  description: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box' as 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box' as 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center' as 'center',
    marginTop: '10px',
  },
};

export default Quiz;