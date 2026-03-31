import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'info', duration = 5000, onClose, isVisible }) => {
  const [shouldShow, setShouldShow] = useState(isVisible);

  useEffect(() => {
    setShouldShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (shouldShow && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [shouldShow, duration]);

  const handleClose = () => {
    setShouldShow(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <AlertCircle className={styles.icon} />;
      default:
        return <Info className={styles.icon} />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      default:
        return styles.info;
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`${styles.toast} ${getTypeClass()}`}>
      <div className={styles.content}>
        {getIcon()}
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        <X className={styles.closeIcon} />
      </button>
    </div>
  );
};

export default Toast;
