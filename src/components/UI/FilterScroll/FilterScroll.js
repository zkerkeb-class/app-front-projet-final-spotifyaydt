import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FilterScroll.module.scss';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const FilterScroll = ({ children }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    checkScroll();
  };

  return (
    <div className={styles.filterScroll}>
      {showLeftArrow && (
        <button
          className={`${styles.scrollButton} ${styles.leftButton}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <IoChevronBack />
        </button>
      )}
      <div
        className={styles.scrollContainer}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className={styles.scrollContent}>{children}</div>
      </div>
      {showRightArrow && (
        <button
          className={`${styles.scrollButton} ${styles.rightButton}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <IoChevronForward />
        </button>
      )}
    </div>
  );
};

FilterScroll.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterScroll;
