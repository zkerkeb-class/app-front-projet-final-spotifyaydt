import React, { useRef, useCallback, memo } from 'react';
import styles from './HorizontalScroll.module.scss';

const HorizontalScroll = ({ title, children }) => {
  const scrollContainerRef = useRef(null);

  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      container.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }, []);

  const handleScroll = useCallback(
    (direction) => {
      requestAnimationFrame(() => scroll(direction));
    },
    [scroll]
  );

  return (
    <div className={styles.scrollSection}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.controls}>
          <button
            onClick={() => handleScroll('left')}
            className={styles.controlButton}
            aria-label="Scroll left"
          >
            ◀
          </button>
          <button
            onClick={() => handleScroll('right')}
            className={styles.controlButton}
            aria-label="Scroll right"
          >
            ▶
          </button>
        </div>
      </div>
      <div
        className={styles.scrollContainer}
        ref={scrollContainerRef}
        role="region"
        aria-label="Scrollable content"
      >
        {children}
      </div>
    </div>
  );
};

export default memo(HorizontalScroll);
