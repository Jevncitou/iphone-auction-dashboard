// src/components/Header.jsx
import React from 'react';
import cubeIcon from '../assets/react.svg'; // Replace this with your logo if needed

const Header = () => {
  return (
    <header style={styles.container}>
      <img src={cubeIcon} alt="Logo" style={styles.logo} />
      <h1 style={styles.title}>Auction Dashboard</h1>
    </header>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#121212',
    borderBottom: '1px solid #2c2c2c',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#f5f5f5',
  },
};

export default Header;
