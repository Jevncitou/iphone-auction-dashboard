// src/pages/dashboard.jsx
import { useState } from 'react';
import models from '../data/models.json';
import Header from '../components/Header';

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (model) => setSelected(model);
  const handleClose = () => setSelected(null);

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.grid}>
        {models.map((model) => (
          <div key={model.name} style={styles.card} onClick={() => handleSelect(model)}>
            <img
              src={`/images/iPhone_Generic.png`} // Loaded from /public/images
              alt={model.name}
              style={styles.image}
              onError={(e) => {
                if (e.target.src !== '/images/iPhone_Generic.png') {
                  e.target.src = '/images/iPhone_Generic.png';
                }
              }}
            />
            <span style={styles.label}>{model.name}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{selected.name}</h2>

            <iframe
              src={`/charts/${selected.chart}`}
              width="1000"
              height="600"
              style={styles.chart}
              title={`${selected.name} Chart`}
            />

            <button style={styles.closeBtn} onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: '#1a1a1a',
    minHeight: '100vh',
    paddingBottom: '3rem',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '2rem',
  },
  card: {
    width: 160,
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    cursor: 'pointer',
    textAlign: 'center',
    color: '#f2f2f2',
    transition: 'transform 0.2s ease-in-out',
  },
  image: {
    width: '100%',
    height: 120,
    objectFit: 'contain',
    marginBottom: 10,
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'block',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '95%',
    textAlign: 'center',
  },
  modalTitle: {
    color: '#fff',
    marginBottom: '20px',
    fontSize: '1.5rem',
  },
  chart: {
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(255,255,255,0.1)',
  },
  closeBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 500,
  },
};
