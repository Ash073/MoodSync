import React from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>MoodSync</div>
      <ul className={styles.navLinks}>
        <li>🎧</li>
        <li>🎵</li>
        <li>🔊</li>
        <li>🎼</li>
        <li className={styles.active}>Explore 🎶</li>
      </ul>
    </nav>
  );
};

export default Navbar;
