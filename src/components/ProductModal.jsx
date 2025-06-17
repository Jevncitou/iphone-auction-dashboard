import React, { useEffect, useState } from 'react';
import Chart from './Chart';

export default function ProductModal({ model, onClose }) {
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!model) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{model.name}</h2>

        {/* Show buttons for each variant */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          {model.variants.map((variant) => (
            <button
              key={variant.name}
              onClick={() => setSelectedVariant(variant)}
              style={{
                padding: '6px 14px',
                marginBottom: '0.5rem',
                backgroundColor: '#444',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {variant.name}
            </button>
          ))}
        </div>

        {selectedVariant && (
          <>
            <h3 style={{ color: 'white', marginTop: '1rem' }}>{selectedVariant.name}</h3>

            {/* Only using one grade for now, like 'B'. You can add dropdown later */}
            {selectedVariant.grades?.length > 0 ? (
              <Chart chartFile={selectedVariant.grades.find(g => g.grade === 'B')?.chart} />
            ) : (
              <div style={{ color: "white", textAlign: "center", padding: "2rem 0" }}>
                Chart not available
              </div>
            )}
          </>
        )}

        <button onClick={onClose} style={styles.closeButton}>Close</button>
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
