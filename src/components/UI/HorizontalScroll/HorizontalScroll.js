import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './HorizontalScroll.module.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HorizontalScroll = ({
  title,
  children,
  rightElement,
  showShowMore = true,
  moreLink,
  itemCount = 0,
  maxItems = 20,
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftChevron(scrollLeft > 0);
    setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, [checkScrollButtons]);

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

  const handleShowMore = () => {
    if (moreLink) {
      navigate(moreLink);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {showShowMore && itemCount > maxItems && (
          <div className={styles.right_element}>
            <div className={styles.show_more} onClick={handleShowMore}>
              Show More
            </div>
          </div>
        )}
      </div>
      <div
        className={styles.scroll_wrapper}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {showLeftChevron && isHovering && (
          <button
            onClick={() => handleScroll('left')}
            className={`${styles.control_button} ${styles.left}`}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
        )}
        <div
          className={styles.scroll_container}
          ref={scrollContainerRef}
          role="region"
          aria-label="Scrollable content"
        >
          {children}
        </div>
        {showRightChevron && isHovering && (
          <button
            onClick={() => handleScroll('right')}
            className={`${styles.control_button} ${styles.right}`}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

HorizontalScroll.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  rightElement: PropTypes.node,
  showShowMore: PropTypes.bool,
  moreLink: PropTypes.string,
  itemCount: PropTypes.number,
  maxItems: PropTypes.number,
};

export default memo(HorizontalScroll);
