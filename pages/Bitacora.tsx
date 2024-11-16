import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrando los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Tipos de datos para las entradas de la bitácora
type DiabetesEntry = {
  fecha: string;
  glucosa: string;
  insulina: string;
  medicamentos: string;
  nivelActividad: string;
  comidasPorDia: string;
  desafios: string;
};

const Bitacora: React.FC = () => {
  const [entries, setEntries] = useState<DiabetesEntry[]>([]);
  const [formData, setFormData] = useState<DiabetesEntry>({
    fecha: '',
    glucosa: '',
    insulina: '',
    medicamentos: '',
    nivelActividad: '',
    comidasPorDia: '',
    desafios: '',
  });
  const [formVisible, setFormVisible] = useState<boolean>(false);  // Control de visibilidad del formulario
  const [timeInterval, setTimeInterval] = useState<string>('semanal'); // Estado para el intervalo de tiempo
  const [menuVisible, setMenuVisible] = useState<boolean>(false); // Estado para el menú desplegable

  const handleInputChange = (name: keyof DiabetesEntry, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.glucosa || !formData.insulina || !formData.medicamentos || !formData.nivelActividad || !formData.comidasPorDia || !formData.desafios) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newEntry: DiabetesEntry = {
      ...formData,
      fecha: new Date().toLocaleDateString(), // Fecha actual
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      fecha: '',
      glucosa: '',
      insulina: '',
      medicamentos: '',
      nivelActividad: '',
      comidasPorDia: '',
      desafios: '',
    });
    setFormVisible(false);  // Ocultar formulario después de enviar
  };

  // Función para filtrar las entradas por el intervalo de tiempo
  const filterEntriesByTimeInterval = () => {
    const now = new Date();
    let filteredEntries = entries;

    switch (timeInterval) {
      case 'semanal':
        filteredEntries = entries.filter(entry => {
          const entryDate = new Date(entry.fecha);
          const diffInDays = (now.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
          return diffInDays <= 7; // Filtra las entradas de los últimos 7 días
        });
        break;
      case 'mensual':
        filteredEntries = entries.filter(entry => {
          const entryDate = new Date(entry.fecha);
          return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'bimestral':
        filteredEntries = entries.filter(entry => {
          const entryDate = new Date(entry.fecha);
          return entryDate.getFullYear() === now.getFullYear() && (entryDate.getMonth() === now.getMonth() || entryDate.getMonth() === now.getMonth() - 1);
        });
        break;
      case 'semestral':
        filteredEntries = entries.filter(entry => {
          const entryDate = new Date(entry.fecha);
          return entryDate.getFullYear() === now.getFullYear() && (entryDate.getMonth() >= now.getMonth() - 5);
        });
        break;
      case 'anual':
        filteredEntries = entries.filter(entry => {
          const entryDate = new Date(entry.fecha);
          return entryDate.getFullYear() === now.getFullYear();
        });
        break;
      default:
        break;
    }

    return filteredEntries;
  };

  // Datos para la gráfica con el intervalo de tiempo seleccionado
  const chartData = {
    labels: filterEntriesByTimeInterval().map(entry => entry.fecha),
    datasets: [
      {
        label: 'Glucosa (mg/dL)',
        data: filterEntriesByTimeInterval().map(entry => parseFloat(entry.glucosa)),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Insulina (UI)',
        data: filterEntriesByTimeInterval().map(entry => parseFloat(entry.insulina)),
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div style={styles.container}>
      {/* Barra superior con logo y nombre */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src="logo.png" alt="Logo" style={styles.logo} />
          <h1 style={styles.pageTitle}>Mi Diario de Salud</h1>
        </div>

        {/* Menú desplegable en la esquina derecha */}
        <div style={styles.menuContainer}>
          <button onClick={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
            ☰
          </button>
          {menuVisible && (
            <div style={styles.menu}>
              <ul style={styles.menuList}>
                <li style={styles.menuItem}>Perfil</li>
                <li style={styles.menuItem}>Configuración</li>
                <li style={styles.menuItem}>Cerrar sesión</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <h2>Registro de Salud para la Diabetes</h2>

      {/* Botón para mostrar/ocultar el formulario */}
      <button 
        onClick={() => setFormVisible(!formVisible)} 
        style={styles.toggleButton}>
        {formVisible ? 'Ocultar Formulario' : 'Agregar Nueva Entrada'}
      </button>

      {/* Mostrar el formulario solo si formVisible es true */}
      {formVisible && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="glucosa" style={styles.label}>Nivel de Glucosa (mg/dL)</label>
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
            <label htmlFor="insulina" style={styles.label}>Insulina (UI)</label>
            <input
              type="text"
              id="insulina"
              value={formData.insulina}
              onChange={(e) => handleInputChange('insulina', e.target.value)}
              placeholder="Ej. 10"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="medicamentos" style={styles.label}>Medicamentos</label>
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
            <label htmlFor="nivelActividad" style={styles.label}>Nivel de Actividad</label>
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
            <label htmlFor="comidasPorDia" style={styles.label}>Comidas por Día</label>
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
            <label htmlFor="desafios" style={styles.label}>Desafíos</label>
            <input
              type="text"
              id="desafios"
              value={formData.desafios}
              onChange={(e) => handleInputChange('desafios', e.target.value)}
              placeholder="Ej. Control de azúcar"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>Agregar Registro</button>
        </form>
      )}

      {/* Opciones de intervalo de tiempo */}
      <div style={styles.splitView}>
        <div>
          <label>Intervalo de Tiempo:</label>
          <select 
            value={timeInterval} 
            onChange={(e) => setTimeInterval(e.target.value)} 
            style={styles.input}
          >
            <option value="semanal">Última Semana</option>
            <option value="mensual">Último Mes</option>
            <option value="bimestral">Últos 2 Meses</option>
            <option value="semestral">Últos 6 Meses</option>
            <option value="anual">Último Año</option>
          </select>
        </div>
      </div>

      <div style={styles.splitView}>
        <div style={styles.tableContainer}>
          <h2>Registro de Datos</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Glucosa</th>
                <th style={styles.th}>Insulina</th>
                <th style={styles.th}>Medicamentos</th>
                <th style={styles.th}>Nivel Actividad</th>
                <th style={styles.th}>Comidas</th>
                <th style={styles.th}>Desafíos</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.td}>No hay registros disponibles</td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{entry.fecha}</td>
                    <td style={styles.td}>{entry.glucosa}</td>
                    <td style={styles.td}>{entry.insulina}</td>
                    <td style={styles.td}>{entry.medicamentos}</td>
                    <td style={styles.td}>{entry.nivelActividad}</td>
                    <td style={styles.td}>{entry.comidasPorDia}</td>
                    <td style={styles.td}>{entry.desafios}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.chartContainer}>
          <h2>Gráfica de Datos</h2>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  pageTitle: {
    fontSize: '24px',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '24px',
    border: 'none',
    cursor: 'pointer',
  },
  menu: {
    position: 'absolute',
    top: '30px',
    right: '0',
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: '4px',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    zIndex: 100,
  },
  menuList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  menuItem: {
    padding: '10px 20px',
    cursor: 'pointer',
  },
  toggleButton: {
    padding: '10px 20px',
    margin: '20px 0',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
    marginBottom: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  splitView: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  tableContainer: {
    flex: 1,
    marginRight: '20px',
  },
  chartContainer: {
    flex: 1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#f4f4f4',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
};

export default Bitacora;
