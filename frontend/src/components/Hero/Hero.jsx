import React from 'react';
import { ArrowDown, Brain, FileText, MessageCircle, Zap } from 'lucide-react';
import styles from './Hero.module.css';

const Hero = () => {
  const scrollToTool = () => {
    const element = document.getElementById('tool');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.gradientMesh}></div>
        <div className={styles.particles}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Transformez vos cours en intelligence
          </h1>
          <p className={styles.subtitle}>
            Analysez vos documents pédagogiques avec l'IA et obtenez des résumés structurés, 
            des quiz interactifs et des questions d'évaluation personnalisées.
          </p>
          
          <button className={styles.ctaButton} onClick={scrollToTool}>
            <span>Commencer</span>
            <Zap className={styles.ctaIcon} />
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <FileText className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statNumber}>20</span>
              <span className={styles.statLabel}>QCM</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <MessageCircle className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statNumber}>10</span>
              <span className={styles.statLabel}>Questions</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <Brain className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statNumber}>AI</span>
              <span className={styles.statLabel}>Groq</span>
            </div>
          </div>
        </div>
      </div>

      <button className={styles.scrollIndicator} onClick={scrollToTool}>
        <ArrowDown className={styles.scrollIcon} />
      </button>
    </section>
  );
};

export default Hero;
