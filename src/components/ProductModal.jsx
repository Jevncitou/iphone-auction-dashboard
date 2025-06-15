// src/components/ProductModal.jsx
export default function ProductModal({ model, onClose }) {
  if (!model) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{model.name}</h2>

        <iframe
          src={`/charts/${model.chart}`}
          width="1000"
          height="600"
          style={styles.chart}
          title={`${model.name} Chart`}
        />

        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#222',
    padding: 24,
    borderRadius: 12,
    maxWidth: '95%',
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    marginBottom: 20,
  },
  chart: {
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(255,255,255,0.1)',
  },
  closeButton: {
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 500,
  },
};
