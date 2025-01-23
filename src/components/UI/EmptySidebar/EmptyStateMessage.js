import React from 'react';
import styles from './EmptyStateMessage.module.scss';

const EmptyStateMessage = () => {
  return (
    <div className={styles.emptyStateContainer}>
      <h2>Create your first playlist</h2>
      <p>It's easy, we'll help you</p>
      <button className={styles.createButton}>Create a playlist</button>
    </div>
  );
};

export default EmptyStateMessage;
