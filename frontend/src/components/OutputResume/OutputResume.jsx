import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Download, Copy } from 'lucide-react';
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

  const copyToClipboard = () => {
    const text = `
${resume.introduction}

Points Clés:
${resume.points_cles.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Définitions:
${resume.definitions.map((def) => `${def.terme}: ${def.definition}`).join('\n')}

Conclusion:
${resume.conclusion}
    `.trim();
    
    navigator.clipboard.writeText(text);
  };

  const downloadPDF = () => {
    // This would integrate with the downloadPDF utility
    console.log('Download PDF functionality');
  };

  if (!resume) return null;

  return (
    <section className={styles.outputResume}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <BookOpen className={styles.titleIcon} />
            Résumé du Cours
          </h2>
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={copyToClipboard}>
              <Copy className={styles.actionIcon} />
              Copier
            </button>
            <button className={styles.actionButton} onClick={downloadPDF}>
              <Download className={styles.actionIcon} />
              PDF
            </button>
          </div>
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
              {resume.points_cles.map((point, index) => (
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
              {resume.definitions.map((definition, index) => (
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
              <CheckCircle className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Conclusion</h3>
            </div>
            <p className={styles.sectionText}>{resume.conclusion}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutputResume;
