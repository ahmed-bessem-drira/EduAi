import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    const container = containerRef.current;
    if (!container) return;
    
    canvasRef.current = canvas;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationFrameId;
    let width, height;

    // Existing particle logic ... (no changes to classes or animation)
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const goldColor = '#d9a441';

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = goldColor;
        ctx.fill();
      }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(217, 164, 65, ${1 - dist / connectionDistance})`;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (container && canvas) {
        container.removeChild(canvas);
      }
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('dahmedbessem@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={styles.heroSection}>
      <div ref={containerRef} className={styles.canvasContainer} />

      <div className={styles.headerArea}>
        <div className={styles.centerLogo}>
          <h1 className={styles.logoText}>EduAI.</h1>
        </div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Là où le savoir devient<br />intelligence et le savoir<br />devient réussite
        </h1>
        <button className={styles.ctaModern} onClick={scrollToAbout}>
          Commencer l'expérience
        </button>
      </div>

      <div className={styles.contactInfo}>
        <p className={styles.contactHeading}>+ Contact Direct</p>
        <span className={styles.contactEmail} onClick={handleCopyEmail}>
          {isCopied ? 'Transmission envoyée au presse-papiers' : 'dahmedbessem@gmail.com'}
        </span>
      </div>

      <div className={styles.footerLinks}>
        <span className={styles.footerLink}>Intelligence Fluide</span>
        <span className={styles.footerLink}>Formes Étudiantes</span>
        <span className={styles.footerLink}>Savoir Interactif</span>
        <span className={styles.footerLink}>Études de Mouvement</span>
      </div>

      <div className={styles.coordinates}>
        <p>État EduAI • Actif</p>
        <p>Là où la conscience coule</p>
      </div>
    </section>
  );
};

export default Hero;
