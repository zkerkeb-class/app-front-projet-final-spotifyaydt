import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  IoClose,
  IoCopy,
  IoCheckmark,
  IoLink,
  IoQrCode,
} from 'react-icons/io5';
import { RiHashtag } from 'react-icons/ri';
import styles from './Jam.module.scss';

const InviteModal = ({ jamSession, onClose }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/jam/${jamSession.id}`;
  const inviteCode = jamSession.id.slice(0, 8).toUpperCase();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'link':
        return (
          <div className={styles.invite__content__link}>
            <div className={styles.invite__content__link__input}>
              <input type="text" value={inviteLink} readOnly />
              <CopyToClipboard text={inviteLink} onCopy={handleCopy}>
                <button>
                  {copied ? <IoCheckmark size={20} /> : <IoCopy size={20} />}
                </button>
              </CopyToClipboard>
            </div>
            <p>
              Share this link with friends to invite them to your Jam session
            </p>
          </div>
        );
      case 'code':
        return (
          <div className={styles.invite__content__code}>
            <div className={styles.invite__content__code__display}>
              <span>{inviteCode}</span>
              <CopyToClipboard text={inviteCode} onCopy={handleCopy}>
                <button>
                  {copied ? <IoCheckmark size={20} /> : <IoCopy size={20} />}
                </button>
              </CopyToClipboard>
            </div>
            <p>
              Share this code with friends to invite them to your Jam session
            </p>
          </div>
        );
      case 'qr':
        return (
          <div className={styles.invite__content__qr}>
            <div className={styles.invite__content__qr__code}>
              <QRCodeSVG
                value={inviteLink}
                size={200}
                level="H"
                includeMargin={true}
                bgColor="var(--background-base)"
                fgColor="var(--text-primary)"
              />
            </div>
            <p>Scan this QR code to join the Jam session</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.invite__overlay}>
      <div className={styles.invite__modal}>
        <div className={styles.invite__header}>
          <h3>Invite to Jam Session</h3>
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className={styles.invite__tabs}>
          <button
            className={`${styles.invite__tabs__tab} ${
              activeTab === 'link' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('link')}
          >
            <IoLink size={20} />
            <span>Link</span>
          </button>
          <button
            className={`${styles.invite__tabs__tab} ${
              activeTab === 'code' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('code')}
          >
            <RiHashtag size={20} />
            <span>Code</span>
          </button>
          <button
            className={`${styles.invite__tabs__tab} ${
              activeTab === 'qr' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('qr')}
          >
            <IoQrCode size={20} />
            <span>QR Code</span>
          </button>
        </div>

        <div className={styles.invite__content}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default InviteModal;
