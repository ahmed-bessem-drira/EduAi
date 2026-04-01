import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../ui/Badge';
import styles from './OutputResume.module.css';

const OutputResume = ({ resume, language = 'fr' }) => {
  const [expandedDefinitions, setExpandedDefinitions] = useState(new Set());

  const toggleDefinition = (index) => {
    const newExpanded = new Set(expandedDefinitions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDefinitions(newExpanded);
  };


  if (!resume) return null;

  return (
    <section className={styles.outputResume}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Résumé du Cours</h2>
          <div className={styles.divider}></div>
        </div>

        <div className={styles.content}>
          <div className={`${styles.section} ${styles.fadeIn}`}>
            <div className={styles.sectionHeader}>
              <BookOpen className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Introduction</h3>
            </div>
            <p className={styles.sectionText}>{resume.introduction}</p>
          </div>

          <div className={`${styles.section} ${styles.fadeIn}`} style={{ animationDelay: '0.1s' }}>
            <div className={styles.sectionHeader}>
              <CheckCircle className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Points Clés</h3>
            </div>
            <ul className={styles.pointsList}>
              {resume.points_cles?.map((point, index) => (
                <li key={index} className={styles.pointItem}>
                  <CheckCircle className={styles.pointIcon} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.section} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.sectionHeader}>
              <BookOpen className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Définitions</h3>
            </div>
            <div className={styles.definitionsList}>
              {resume.definitions?.map((definition, index) => (
                <div key={index} className={styles.definitionItem}>
                  <button
                    className={styles.definitionToggle}
                    onClick={() => toggleDefinition(index)}
                  >
                    <span className={styles.definitionTerm}>{definition.terme}</span>
                    {expandedDefinitions.has(index) ? (
                      <ChevronUp className={styles.toggleIcon} />
                    ) : (
                      <ChevronDown className={styles.toggleIcon} />
                    )}
                  </button>
                  {expandedDefinitions.has(index) && (
                    <div className={styles.definitionContent}>
                      <p>{definition.definition}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.section} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.sectionHeader}>
              <BookOpen className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Explications Étape par Étape</h3>
            </div>
            <div>
              {resume.explications_etapes?.map((etape, index) => (
                <div key={index} style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                  <h4 style={{ fontWeight: 600, color: '#2563eb', marginBottom: '8px', fontSize: '1.05rem' }}>{index + 1}. {etape.etape}</h4>
                  <p style={{ marginBottom: '10px', lineHeight: 1.6, color: '#334155' }}>{etape.explication}</p>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>EXEMPLE</strong>
                    <span style={{ fontStyle: 'italic', color: '#10b981', fontSize: '14px' }}>{etape.exemple}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.section} ${styles.fadeIn}`} style={{ animationDelay: '0.4s' }}>
            <div className={styles.sectionHeader}>
              <CheckCircle className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Points À Retenir</h3>
            </div>
            <ul className={styles.pointsList}>
              {resume.points_a_retenir?.map((point, index) => (
                <li key={index} className={styles.pointItem}>
                  <CheckCircle className={styles.pointIcon} style={{ color: '#8b5cf6' }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.section} ${styles.fadeIn}`} style={{ animationDelay: '0.5s' }}>
            <div className={styles.sectionHeader}>
              <CheckCircle className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Conclusion Générale</h3>
            </div>
            <p className={styles.sectionText}>{resume.conclusion}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutputResume;
