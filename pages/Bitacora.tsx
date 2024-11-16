import React, { useState } from 'react';

type DiabetesEntry = {
  fecha: string;
  glucosa: string;
  medicamentos: string;
  nivelActividad: string;
  comidasPorDia: string;
  desafios: string;
};

const DiabetesTracker: React.FC = () => {
  const [entries, setEntries] = useState<DiabetesEntry[]>([]);
  const [formData, setFormData] = useState<DiabetesEntry>({
    fecha: '',
    glucosa: '',
    medicamentos: '',
    nivelActividad: '',
    comidasPorDia: '',
    desafios: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (name: keyof DiabetesEntry, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.glucosa ||
      !formData.medicamentos ||
      !formData.nivelActividad ||
      !formData.comidasPorDia ||
      !formData.desafios
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newEntry: DiabetesEntry = {
      ...formData,
      fecha: new Date().toLocaleDateString(), // Fecha actual
    };

    setEntries([newEntry, ...entries]); // Añadir la nueva entrada al historial
    setFormData({
      fecha: '',
      glucosa: '',
      medicamentos: '',
      nivelActividad: '',
      comidasPorDia: '',
      desafios: '',
    }); // Limpiar el formulario
    setShowForm(false); // Ocultar el formulario
  };

  const filteredEntries = searchQuery
    ? entries.filter((entry) => entry.fecha.includes(searchQuery))
    : entries;

  return (
    <div style={styles.container}>
      <h1>Registro de Salud para la Diabetes</h1>

      {/* Botón para abrir el formulario */}
      <button onClick={() => setShowForm(!showForm)} style={styles.toggleButton}>
        {showForm ? 'Cerrar Formulario' : 'Agregar Entrada'}
      </button>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="glucosa" style={styles.label}>
              Nivel de Glucosa (mg/dL)
            </label>
            <input
              type="text"
              id="glucosa"
              value={formData.glucosa}
              onChange={(e) => handleInputChange('glucosa', e.target.value)}
              placeholder="Ej. 120"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="medicamentos" style={styles.label}>
              Medicamentos
            </label>
            <input
              type="text"
              id="medicamentos"
              value={formData.medicamentos}
              onChange={(e) => handleInputChange('medicamentos', e.target.value)}
              placeholder="Ej. Insulina"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="nivelActividad" style={styles.label}>
              Nivel de Actividad
            </label>
            <input
              type="text"
              id="nivelActividad"
              value={formData.nivelActividad}
              onChange={(e) => handleInputChange('nivelActividad', e.target.value)}
              placeholder="Ej. Moderadamente activo"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="comidasPorDia" style={styles.label}>
              Comidas por Día
            </label>
            <input
              type="text"
              id="comidasPorDia"
              value={formData.comidasPorDia}
              onChange={(e) => handleInputChange('comidasPorDia', e.target.value)}
              placeholder="Ej. 3 comidas principales"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="desafios" style={styles.label}>
              Desafíos
            </label>
            <input
              type="text"
              id="desafios"
              value={formData.desafios}
              onChange={(e) => handleInputChange('desafios', e.target.value)}
              placeholder="Ej. Dificultad para seguir dieta"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Registrar Entrada
          </button>
        </form>
      )}

      {/* Barra de búsqueda */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por fecha (Ej. 15/11/2024)"
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      {/* Historial */}
      <h2>Historial de Entradas</h2>
      <HistoryTable entries={filteredEntries} />
    </div>
  );
};

const HistoryTable: React.FC<{ entries: DiabetesEntry[] }> = ({ entries }) => {
  if (entries.length === 0) {
    return <p>No hay entradas registradas.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Fecha</th>
          <th style={styles.tableHeader}>Glucosa</th>
          <th style={styles.tableHeader}>Medicamentos</th>
          <th style={styles.tableHeader}>Actividad</th>
          <th style={styles.tableHeader}>Comidas</th>
          <th style={styles.tableHeader}>Desafíos</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index} style={styles.tableRow}>
            <td style={styles.tableCell}>{entry.fecha}</td>
            <td style={styles.tableCell}>{entry.glucosa} mg/dL</td>
            <td style={styles.tableCell}>{entry.medicamentos}</td>
            <td style={styles.tableCell}>{entry.nivelActividad}</td>
            <td style={styles.tableCell}>{entry.comidasPorDia}</td>
            <td style={styles.tableCell}>{entry.desafios}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  },
  field: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  toggleButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as 'collapse',
  },
  tableHeader: {
    textAlign: 'center' as 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px',
    border: '1px solid #ddd',
  },
  tableCell: {
    textAlign: 'center' as 'center',
    padding: '8px',
    border: '1px solid #ddd',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
};

export default DiabetesTracker;
