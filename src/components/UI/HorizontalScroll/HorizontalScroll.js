import React, { useRef } from 'react';
import styles from './HorizontalScroll.module.scss';

const HorizontalScroll = ({ title, children }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.scrollSection}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.controls}>
          <button
            onClick={() => scroll('left')}
            className={styles.controlButton}
            aria-label="Défiler à gauche"
          >
            ◀
          </button>
          <button
            onClick={() => scroll('right')}
            className={styles.controlButton}
            aria-label="Défiler à droite"
          >
            ▶
          </button>
        </div>
      </div>
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
