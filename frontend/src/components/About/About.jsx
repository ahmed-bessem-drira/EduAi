import React from 'react';
import { Brain, Lightbulb, Target } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  const scrollToSummarize = () => {
    const element = document.getElementById('summarize');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>À Propos d'EduAI</h2>
          <div className={styles.divider}></div>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Brain className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Intelligence Artificielle</h3>
            <p className={styles.cardText}>
              EduAI utilise des modèles de langage avancés pour analyser vos contenus pédagogiques avec une précision inégalée.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Lightbulb className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Synthèse Intelligente</h3>
            <p className={styles.cardText}>
              Transformez des heures de lecture en résumés concis, capturant l'essentiel de chaque concept pour un apprentissage accéléré.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Target className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Évaluation Ciblée</h3>
            <p className={styles.cardText}>
              Testez vos connaissances instantanément avec des quiz et des questions générés automatiquement à partir de vos propres cours.
            </p>
          </div>
        </div>

        <div className={styles.mission}>
          <p>
            Notre mission est de démocratiser l'accès à des outils d'apprentissage haute performance, 
            permettant à chaque étudiant de maximiser son potentiel grâce à la synergie entre 
            l'éducation et l'intelligence artificielle.
          </p>
          <button className={styles.ctaButton} onClick={scrollToSummarize}>
            Commençons à résumer
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
