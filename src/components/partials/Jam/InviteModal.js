import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import {
  IoClose,
  IoCopy,
  IoCheckmark,
  IoLink,
  IoQrCode,
} from 'react-icons/io5';
import styles from './Jam.module.scss';

const InviteModal = ({ jamSession, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const sessionCode = jamSession?.id?.slice(0, 8).toUpperCase();
  const inviteLink = `${window.location.origin}/jam/${jamSession?.id}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.invite__overlay} onClick={onClose}>
      <div
        className={styles.invite__modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.invite__header}>
          <h3>{t('jamSession.shareOptions.title')}</h3>
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className={styles.invite__content}>
          <div className={styles.invite__section}>
            <h4>{t('jamSession.sessionCode')}</h4>
            <div className={styles.invite__code}>
              <span>{sessionCode}</span>
              <button onClick={() => handleCopy(sessionCode)}>
                {copied ? <IoCheckmark size={20} /> : <IoCopy size={20} />}
              </button>
            </div>
            <p className={styles.invite__hint}>{t('jamSession.shareCode')}</p>
          </div>

          <div className={styles.invite__section}>
            <h4>{t('jamSession.shareOptions.copyLink')}</h4>
            <div className={styles.invite__link}>
              <IoLink size={20} />
              <span>{inviteLink}</span>
              <button onClick={() => handleCopy(inviteLink)}>
                {copied ? <IoCheckmark size={20} /> : <IoCopy size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.invite__section}>
            <h4>{t('jamSession.shareOptions.showQR')}</h4>
            <div className={styles.invite__qr}>
              <QRCodeSVG
                value={inviteLink}
                size={200}
                level="H"
                includeMargin={true}
                bgColor="var(--background-base)"
                fgColor="var(--text-primary)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
