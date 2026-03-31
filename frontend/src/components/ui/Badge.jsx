import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ children, variant = 'default', size = 'medium', icon: Icon }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'easy':
        return styles.easy;
      case 'medium':
        return styles.medium;
      case 'hard':
        return styles.hard;
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      default:
        return styles.default;
    }
  };

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

  return (
    <span className={`${styles.badge} ${getVariantClass()} ${getSizeClass()}`}>
      {Icon && <Icon className={styles.icon} />}
      {children}
    </span>
  );
};

export default Badge;
