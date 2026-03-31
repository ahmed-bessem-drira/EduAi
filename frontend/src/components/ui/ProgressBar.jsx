import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress = 0, showLabel = true, size = 'medium', color = 'primary' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'secondary':
        return styles.secondary;
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      default:
        return styles.primary;
    }
  };

  return (
    <div className={`${styles.progressContainer} ${getSizeClass()}`}>
      {showLabel && (
        <div className={styles.progressLabel}>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}
      <div className={`${styles.progressBar} ${getColorClass()}`}>
        <div 
          className={styles.progressFill}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
