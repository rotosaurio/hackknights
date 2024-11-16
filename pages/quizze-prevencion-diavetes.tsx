import React, { useState } from 'react';

type ResponseState = {
  [key: string]: string | number;
};

const Quiz: React.FC = () => {
  const [responses, setResponses] = useState<ResponseState>({});
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string | number) => {
    if (typeof value === 'number' && value < 0) {
      // Si el valor es negativo, mostramos un error y no actualizamos el estado
      setError('Por favor, ingresa un valor positivo.');
      return;
    } else {
      // Si el valor es válido, actualizamos el estado
      setError(null);
    }

    setResponses({ ...responses, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('User Responses:', responses);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Encuesta de Prevención de Diabetes</h1>
        <p style={styles.description}>
          ¡Bienvenido! Si deseas tomar medidas para prevenir la diabetes, necesitamos recopilar información importante sobre tu salud y estilo de vida.
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
          <label htmlFor="altura" style={styles.label}>2. Altura (en cm)</label>
          <input
            type="number"
            id="altura"
            name="altura"
            style={styles.input}
            placeholder="¿Cuál es tu altura?"
            onChange={(e) => handleInputChange('altura', e.target.value)}
            required
            min="0"
          />
        </div>

        {/* Peso */}
        <div style={styles.field}>
          <label htmlFor="peso" style={styles.label}>3. Peso (en kg)</label>
          <input
            type="number"
            id="peso"
            name="peso"
            style={styles.input}
            placeholder="¿Cuánto pesas?"
            onChange={(e) => handleInputChange('peso', e.target.value)}
            required
            min="0"
          />
        </div>

        {/* Pregunta de Género */}
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

        {/* Pregunta de Historia Familiar */}
        <div style={styles.field}>
          <label htmlFor="historia_familiar" style={styles.label}>5. Historia Familiar</label>
          <input
            type="text"
            id="historia_familiar"
            name="historia_familiar"
            style={styles.input}
            placeholder="¿Tienes antecedentes familiares de diabetes? (Ej. padres, hermanos)"
            onChange={(e) => handleInputChange('historia_familiar', e.target.value)}
            required
          />
        </div>

        {/* Pregunta de Nivel de Actividad */}
        <div style={styles.field}>
          <label htmlFor="nivel_actividad" style={styles.label}>6. Nivel de Actividad</label>
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

        {/* Pregunta de Restricciones Dietéticas */}
        <div style={styles.field}>
          <label htmlFor="restricciones_dieteticas" style={styles.label}>7. Preferencias o Restricciones Dietéticas</label>
          <input
            type="text"
            id="restricciones_dieteticas"
            name="restricciones_dieteticas"
            style={styles.input}
            placeholder="¿Sigues alguna dieta específica o tienes alguna restricción alimentaria?"
            onChange={(e) => handleInputChange('restricciones_dieteticas', e.target.value)}
            required
          />
        </div>

        {/* Pregunta de Consumo de Azúcar */}
        <div style={styles.field}>
          <label htmlFor="consumo_azucar" style={styles.label}>8. Consumo de Azúcar</label>
          <select
            id="consumo_azucar"
            name="consumo_azucar"
            style={styles.select}
            onChange={(e) => handleInputChange('consumo_azucar', e.target.value)}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Bajo">Bajo (Ej. rara vez comes dulces o bebidas azucaradas)</option>
            <option value="Moderado">Moderado (Ej. dulces o bebidas azucaradas ocasionales)</option>
            <option value="Alto">Alto (Ej. dulces o bebidas azucaradas frecuentes)</option>
          </select>
        </div>

        {/* Pregunta de Patrones de Comida */}
        <div style={styles.field}>
          <label htmlFor="patrones_comida" style={styles.label}>9. Patrones de Comida</label>
          <input
            type="text"
            id="patrones_comida"
            name="patrones_comida"
            style={styles.input}
            placeholder="¿Cuántas comidas sueles hacer al día?"
            onChange={(e) => handleInputChange('patrones_comida', e.target.value)}
            required
          />
        </div>

        {/* Pregunta de Niveles de Estrés */}
        <div style={styles.field}>
          <label htmlFor="niveles_estres" style={styles.label}>10. Niveles de Estrés</label>
          <select
            id="niveles_estres"
            name="niveles_estres"
            style={styles.select}
            onChange={(e) => handleInputChange('niveles_estres', e.target.value)}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Rara vez">Rara vez</option>
            <option value="A veces">A veces</option>
            <option value="A menudo">A menudo</option>
            <option value="Siempre">Siempre</option>
          </select>
        </div>

        {/* Pregunta de Patrones de Sueño */}
        <div style={styles.field}>
          <label htmlFor="patrones_sueno" style={styles.label}>11. Patrones de Sueño</label>
          <select
            id="patrones_sueno"
            name="patrones_sueno"
            style={styles.select}
            onChange={(e) => handleInputChange('patrones_sueno', e.target.value)}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Menos de 5 horas">Menos de 5 horas</option>
            <option value="5-6 horas">5-6 horas</option>
            <option value="7-8 horas">7-8 horas</option>
            <option value="Más de 8 horas">Más de 8 horas</option>
          </select>
        </div>

        {/* Pregunta de Desafíos Actuales */}
        <div style={styles.field}>
          <label htmlFor="desafios" style={styles.label}>12. Desafíos Actuales</label>
          <input
            type="text"
            id="desafios"
            name="desafios"
            style={styles.input}
            placeholder="¿Hay algo con lo que tengas dificultades?"
            onChange={(e) => handleInputChange('desafios', e.target.value)}
            required
          />
        </div>

        {/* Mensaje de Error */}
        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>Enviar</button>
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
    textAlign: 'center' as 'center',  // Cambié la propiedad textAlign para que sea de tipo literal
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
    boxSizing: 'border-box' as 'border-box', // Asegurando que boxSizing sea un valor literal
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box' as 'border-box', // Asegurando que boxSizing sea un valor literal
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
    textAlign: 'center' as 'center',  // Cambié la propiedad textAlign para que sea de tipo literal
    marginTop: '10px',
  },
};

export default Quiz;
