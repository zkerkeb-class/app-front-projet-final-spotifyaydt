import React from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaMusic, FaCompactDisc } from 'react-icons/fa';
import styles from './CardFallbackIcon.module.scss';

const CardFallbackIcon = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case 'artist':
        return <FaUser className={styles.icon} />;
      case 'track':
        return <FaMusic className={styles.icon} />;
      case 'album':
      case 'playlist':
        return <FaCompactDisc className={styles.icon} />;
      default:
        return <FaMusic className={styles.icon} />;
    }
  };

  return (
    <div className={`${styles.fallback_container} ${styles[type]}`}>
      {getIcon()}
    </div>
  );
};

CardFallbackIcon.propTypes = {
  type: PropTypes.oneOf(['artist', 'track', 'album', 'playlist']).isRequired,
};

export default CardFallbackIcon;
