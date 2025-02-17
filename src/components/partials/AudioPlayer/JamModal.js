import React from 'react';
import styles from './MobileAudioPlayer.module.scss';
import { IoChevronDown } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

const JamModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { toggleJam } = useAudioPlayer();

  const handleModalClick = (e) => {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation();
  };

  const handleClose = () => {
    toggleJam(false);
    onClose();
  };

  return (
    <div className={styles.modal} onClick={handleModalClick}>
      <div className={styles.modalHeader}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label={t('common.closeSidebar')}
        >
          <IoChevronDown />
        </button>
        <span className={styles.headerTitle}>{t('jamSession.title')}</span>
        <div style={{ width: '24px' }} /> {/* Placeholder for alignment */}
      </div>
      <div className={styles.modalContent}>
        <div className={styles.jamContent}>
          <h2>{t('jamSession.subtitle')}</h2>
          <button className={styles.startJamButton}>
            {t('jamSession.startSession')}
          </button>
          <button className={styles.joinSessionButton}>
            {t('jamSession.joinExisting')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JamModal;
