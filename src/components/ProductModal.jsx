import React, { useEffect, useState } from 'react';

export default function ProductModal({ model, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [chartError, setChartError] = useState(false);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!model) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{model.name}</h2>

        {isLoading && <div style={styles.loading}>Loading chart data...</div>}
        {chartError && <div style={styles.error}>Failed to load chart</div>}
        
        <iframe
          src={`/charts/${model.chart}`}
          width="1000"
          height="600"
          style={{
            ...styles.chart,
            display: isLoading || chartError ? 'none' : 'block'
          }}
          title={`${model.name} Chart`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setChartError(true);
          }}
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
    maxHeight: '90vh',
    overflowY: 'auto',
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
    maxWidth: '100%',
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
  loading: {
    color: '#fff',
    padding: '40px 0',
    fontSize: '1.2rem',
  },
  error: {
    color: '#ff6b6b',
    padding: '40px 0',
    fontSize: '1.2rem',
  }
};