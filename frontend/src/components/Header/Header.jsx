import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Mail } from 'lucide-react';
import styles from './Header.module.css';
import logoUrl from '../../assets/EduAI.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate opacity: 0 at top, 1 at 80% of viewport height
      const opacity = Math.min(Math.max(scrollY / (vh * 0.8), 0), 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`${styles.header} ${scrollOpacity > 0 ? styles.visible : ''}`}
      style={{
        opacity: scrollOpacity,
        transform: `translateY(${(1 - scrollOpacity) * -20}px)`,
        pointerEvents: scrollOpacity < 0.2 ? 'none' : 'auto'
      }}
    >
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => scrollToSection('top')}>
          <img src={logoUrl} alt="EduAI Logo" className={styles.logoImg} />
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
