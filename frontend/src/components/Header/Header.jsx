import React, { useState } from 'react';
import { Menu, X, Brain, BookOpen, Mail } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Brain className={styles.brainIcon} />
          </div>
          <span className={styles.logoText}>EduAI</span>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <button 
            className={styles.navLink}
            onClick={() => scrollToSection('tool')}
          >
            <BookOpen className={styles.navIcon} />
            <span>Outil</span>
          </button>
          <button 
            className={styles.navLink}
            onClick={() => scrollToSection('contact')}
          >
            <Mail className={styles.navIcon} />
            <span>Contact</span>
          </button>
        </nav>

        <button 
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
