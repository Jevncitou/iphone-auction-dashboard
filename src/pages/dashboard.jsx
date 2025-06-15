import { useState, useEffect } from 'react';
import models from '../data/models.json';
import Header from '../components/Header';
import ProductModal from '../components/ProductModal';
import ProductCard from '../components/productcard';

export default function Dashboard() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <Header />
        <div style={styles.loading}>Loading products...</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.grid}>
        {models.map((model) => (
          <div
            key={model.name}
            style={styles.card}
            onClick={() => setSelected(model)}
          >
            <img
              src={`/assets/${model.image}`}
              alt={model.name}
              style={styles.image}
              onError={(e) => {
                console.log(`Failed to load image for ${model.name}`);
                e.target.src = '/assets/default.png';
                e.target.onerror = null; // Prevent infinite loops
              }}
            />
            <span style={styles.label}>{model.name}</span>
          </div>
        ))}
      </div>

      {selected && (
        <ProductModal model={selected} onClose={() => setSelected(null)} />
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
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    color: '#f2f2f2',
    fontSize: '1.2rem'
  },
};