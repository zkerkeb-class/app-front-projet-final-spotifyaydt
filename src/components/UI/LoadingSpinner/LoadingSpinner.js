import React from 'react';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
  return (
    <div className={styles.spinner_container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
