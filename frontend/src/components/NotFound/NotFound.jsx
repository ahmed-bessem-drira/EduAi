import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const canvas = document.createElement('canvas');
    const container = containerRef.current;
    canvasRef.current = canvas;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationFrameId;
    let width, height;
    const goldColor = '#d9a441';

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
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
      const count = window.innerWidth < 768 ? 20 : 40;
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const drawConnections = () => {
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(217, 164, 65, ${0.4 - (dist / 150) * 0.4})`;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
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

  return (
    <section className={styles.notFoundSection}>
      <div ref={containerRef} className={styles.canvasContainer} />
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404.</h1>
        <h2 className={styles.title}>Là où l'intelligence s'est égarée</h2>
        <p className={styles.description}>
          Le savoir que vous cherchez n'existe pas ou a été déplacé.<br />
          L'état originel vous attend.
        </p>
        <Link to="/" className={styles.ctaModern}>
          Retourner à l'Intelligence
        </Link>
      </div>
      <div className={styles.coordinates}>
        <p>État EduAI • Perdu</p>
        <p>Erreur Système</p>
      </div>
    </section>
  );
};

export default NotFound;
