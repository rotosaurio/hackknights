const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    minHeight: '100vh'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#C1FFBA',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '1rem',
    textAlign: 'center' as const,
    marginBottom: '2rem',
    color: '#e0e0e0'
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  label: {
    fontSize: '1rem',
    color: '#C1FFBA'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #404040',
    backgroundColor: '#2a2a2a',
    color: 'white',
    fontSize: '1rem'
  },
  select: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #404040',
    backgroundColor: '#2a2a2a',
    color: 'white',
    fontSize: '1rem'
  },
  button: {
    padding: '1rem',
    backgroundColor: '#C1FFBA',
    color: 'black',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s'
  },
  error: {
    color: '#ff6b6b',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  }
};

export default styles;
