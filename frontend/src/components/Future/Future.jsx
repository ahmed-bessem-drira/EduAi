import React from 'react';
import { Layers, Zap, DownloadCloud, Users, ArrowRight } from 'lucide-react';
import styles from './Future.module.css';

const features = [
  {
    icon: <Layers className={styles.icon} size={24} />,
    title: "Support Multi-fichiers",
    description: "Analysez et recoupez les informations de dizaines de PDFs en même temps pour générer des synthèses globales interconnectées."
  },
  {
    icon: <Zap className={styles.icon} size={24} />,
    title: "Génération de Flashcards",
    description: "Exportez les définitions et points clés automatiquement sous forme de cartes d'apprentissage (Anki/Quizlet) pour des révisions actives."
  },
  {
    icon: <DownloadCloud className={styles.icon} size={24} />,
    title: "Export PPT & EPUB",
    description: "Téléchargez le cours généré sous la forme d'un diaporama PowerPoint interactif ou optimisé pour votre liseuse Kindle."
  },
  {
    icon: <Users className={styles.icon} size={24} />,
    title: "Espace Collaboratif",
    description: "Travaillez en groupe restreint : générez, modifiez et partagez des résumés avec votre classe en temps réel."
  }
];

const Future = () => {
  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="future" className={styles.futureSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Perspectives pour le futur</h2>
          <p className={styles.subtitle}>
            Notre intelligence artificielle s'améliore continuellement. Voici les prochaines pépites qui viendront révolutionner votre apprentissage.
          </p>
        </div>
        
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <button 
            className="btn-primary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            onClick={scrollToContact}
          >
            Proposer une amélioration
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Future;
