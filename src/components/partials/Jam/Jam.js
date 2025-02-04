import React, { useEffect, useState } from 'react';
import { useJam } from '../../../contexts/JamContext';
import { QueueProvider } from '../../../contexts/QueueContext';
import { IoClose } from 'react-icons/io5';
import { FaUserFriends } from 'react-icons/fa';
import { BsMusicNoteList } from 'react-icons/bs';
import ParticipantList from './ParticipantList';
import Queue from './Queue';
import InviteModal from './InviteModal';
import styles from './Jam.module.scss';

const JamContent = ({ onClose }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { jamSession, participants, isHost, createJamSession } = useJam();

  useEffect(() => {
    if (!jamSession) {
      createJamSession();
    }
  }, [jamSession, createJamSession]);

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const activeParticipants = participants.filter((p) => p.status === 'active');

  const handleInviteClick = () => {
    setShowInviteModal(true);
  };

  return (
    <div className={styles.jam}>
      <div className={styles.jam__header}>
        <div className={styles.jam__header__title}>
          <h2>Jam Session</h2>
          <span>Listen together in real-time</span>
        </div>
        <button
          className={styles.jam__header__close}
          onClick={onClose}
          aria-label="Close Jam session"
        >
          <IoClose />
        </button>
      </div>

      <div className={styles.jam__content}>
        <div className={styles.jam__content__status}>
          {isHost && (
            <div className={styles.jam__content__status__host}>
              <div className={styles.jam__content__status__host__avatar}>
                <div className={styles.avatar}>{getInitial('You')}</div>
              </div>
              <div className={styles.jam__content__status__host__info}>
                <span className={styles.label}>Host</span>
                <span className={styles.name}>You</span>
              </div>
            </div>
          )}

          <div className={styles.jam__content__status__participants}>
            <div className={styles.jam__content__status__participants__header}>
              <FaUserFriends />
              <span>Participants ({activeParticipants.length})</span>
            </div>
            <ParticipantList participants={participants} />
          </div>
        </div>

        <div className={styles.jam__content__queue}>
          <div className={styles.jam__content__queue__header}>
            <BsMusicNoteList />
            <span>Queue</span>
          </div>
          <Queue />
        </div>
      </div>

      <div className={styles.jam__footer}>
        <button
          className={styles.jam__footer__invite}
          onClick={handleInviteClick}
        >
          Invite Friends
        </button>
        <button className={styles.jam__footer__add}>Add Songs</button>
      </div>

      {showInviteModal && jamSession && (
        <InviteModal
          jamSession={jamSession}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

const Jam = (props) => (
  <QueueProvider>
    <JamContent {...props} />
  </QueueProvider>
);

export default Jam;
