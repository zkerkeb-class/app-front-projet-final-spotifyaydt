import React, { useState } from 'react';
import styles from './Tooltip.module.scss';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.tooltip_container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>{content}</div>
      )}
    </div>
  );
};

export default Tooltip;
