import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ type = 'spinner', size = 'medium', text = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };

  if (type === 'skeleton') {
    return (
      <div className={`${styles.skeleton} ${getSizeClass()}`}>
        <div className={styles.skeletonLine}></div>
        <div className={styles.skeletonLine}></div>
        <div className={styles.skeletonLine}></div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`${styles.pulse} ${getSizeClass()}`}>
        <div className={styles.pulseDot}></div>
        {text && <span className={styles.pulseText}>{text}</span>}
      </div>
    );
  }

  return (
    <div className={`${styles.loader} ${getSizeClass()}`}>
      <div className={styles.spinner}></div>
      {text && <span className={styles.loaderText}>{text}</span>}
    </div>
  );
};

export default Loader;
