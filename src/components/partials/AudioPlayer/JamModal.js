import React, { useState } from 'react';
import styles from '../Jam/Jam.module.scss';
import { IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const JamModal = ({ onClose, onJoinSession }) => {
  const { t } = useTranslation();
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinSession = () => {
    if (sessionCode.trim().length === 8) {
      onJoinSession(sessionCode.trim());
      onClose();
    } else {
      setError(t('jamSession.invalidCode'));
    }
  };

  return (
    <div className={styles.invite__overlay} onClick={onClose}>
      <div
        className={styles.invite__modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.invite__header}>
          <h3>{t('jamSession.joinExisting')}</h3>
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className={styles.invite__content}>
          <div className={styles.invite__section}>
            <h4>{t('jamSession.enterCode')}</h4>
            <div className={styles.invite__code}>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => {
                  setSessionCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder={t('jamSession.enterCode')}
                maxLength={8}
                className={styles.code_input}
              />
              <button
                onClick={handleJoinSession}
                className={styles.join_button}
              >
                {t('jamSession.joinButton')}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JamModal;
