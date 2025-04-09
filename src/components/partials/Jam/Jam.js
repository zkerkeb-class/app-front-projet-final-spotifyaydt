import React, { useEffect, useState } from 'react';
import { useJam } from '../../../contexts/JamContext';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { IoClose } from 'react-icons/io5';
import { FaUserFriends, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { BsMusicNoteList } from 'react-icons/bs';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { TbPlugConnected, TbPlugConnectedX } from 'react-icons/tb';
import ParticipantList from './ParticipantList';
import Queue from './Queue';
import InviteModal from './InviteModal';
import JamModal from '../AudioPlayer/JamModal';
import Tooltip from '../../UI/Tooltip/Tooltip';
import styles from './Jam.module.scss';
import { useTranslation } from 'react-i18next';

const JamContent = ({ onClose }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const {
    jamSession,
    participants,
    isHost,
    isConnected,
    queue,
    currentTrack,
    user,
    createJamSession,
    joinJamSession,
    leaveJamSession,
    addTrack,
    controlTrack,
  } = useJam();

  const { t } = useTranslation();

  // Initialize session if none exists and not trying to join
  useEffect(() => {
    if (!jamSession && !showJoinModal) {
      createJamSession();
    }
  }, [jamSession, createJamSession, showJoinModal]);

  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase() || '?';
  };

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const handleLeaveSession = () => {
    leaveJamSession();
    onClose();
  };

  const handleInviteClick = () => {
    setShowInviteModal(true);
  };

  const handleJoinClick = () => {
    setShowJoinModal(true);
  };

  const handleJoinSession = (sessionId) => {
    joinJamSession(sessionId);
    setShowJoinModal(false);
  };

  const handleAddTrack = (track) => {
    addTrack(track);
  };

  const handleControlTrack = (action) => {
    controlTrack(action);
  };

  const ConnectionStatus = () => (
    <div className={styles.connection_status}>
      {isConnected ? (
        <Tooltip content={t('jamSession.connected')}>
          <TbPlugConnected className={styles.connected} />
        </Tooltip>
      ) : (
        <Tooltip content={t('jamSession.disconnected')}>
          <TbPlugConnectedX className={styles.disconnected} />
        </Tooltip>
      )}
    </div>
  );

  const activeParticipants = participants.filter((p) => p.status === 'active');

  return (
    <div className={styles.jam}>
      <div className={styles.jam__header}>
        <div className={styles.jam__header__title}>
          <h2>{t('jamSession.title')}</h2>
          <span>{t('jamSession.subtitle')}</span>
          {jamSession && (
            <div className={styles.jam__header__session}>
              <span className={styles.jam__header__session__id}>
                {t('jamSession.sessionCode')}:{' '}
                {jamSession.id.slice(0, 8).toUpperCase()}
              </span>
              <ConnectionStatus />
            </div>
          )}
        </div>
        <div className={styles.jam__header__actions}>
          <Tooltip content={t('jamSession.help')}>
            <button
              className={styles.help_button}
              onClick={() => setShowHelp(!showHelp)}
              aria-label={t('jamSession.help')}
            >
              <IoHelpCircleOutline />
            </button>
          </Tooltip>
          <button
            className={styles.jam__header__close}
            onClick={onClose}
            aria-label={t('common.closeSidebar')}
          >
            <IoClose />
          </button>
        </div>
      </div>

      {showHelp && (
        <div className={styles.help_panel}>
          <h3>{t('jamSession.helpTitle')}</h3>
          <ul>
            <li>{t('jamSession.helpHost')}</li>
            <li>{t('jamSession.helpJoin')}</li>
            <li>{t('jamSession.helpControls')}</li>
            <li>{t('jamSession.helpSync')}</li>
            <li>{t('jamSession.helpNewWindow')}</li>
          </ul>
        </div>
      )}

      <div className={styles.jam__content}>
        <div className={styles.jam__content__status}>
          <div className={styles.current_user}>
            <div className={styles.avatar}>{getInitial(user.name)}</div>
            <div className={styles.user_info}>
              <span className={styles.label}>{t('jamSession.you')}</span>
              <span className={styles.name}>{user.name}</span>
              {isHost && (
                <span className={styles.host_badge}>
                  {t('jamSession.host')}
                </span>
              )}
            </div>
          </div>

          <div className={styles.jam__content__status__participants}>
            <div className={styles.jam__content__status__participants__header}>
              <FaUserFriends />
              <span>
                {t('jamSession.participants')} ({activeParticipants.length})
              </span>
            </div>
            <ParticipantList
              participants={participants}
              currentUserId={user.id}
            />
          </div>
        </div>

        <div className={styles.jam__content__queue}>
          <div className={styles.jam__content__queue__header}>
            <BsMusicNoteList />
            <span>{t('player.queue')}</span>
          </div>
          <Queue
            queue={queue}
            onAddTrack={handleAddTrack}
            onControlTrack={handleControlTrack}
            isHost={isHost}
          />
        </div>

        {currentTrack && (
          <div className={styles.jam__content__now_playing}>
            <h3>{t('player.nowPlaying')}</h3>
            <div className={styles.jam__content__now_playing__track}>
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className={styles.jam__content__now_playing__track__cover}
              />
              <div className={styles.jam__content__now_playing__track__info}>
                <span className={styles.title}>{currentTrack.title}</span>
                <span className={styles.artist}>
                  {getArtistName(currentTrack)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.jam__footer}>
        <button
          className={styles.jam__footer__invite}
          onClick={handleInviteClick}
        >
          {t('jamSession.inviteFriends')}
        </button>
        <button className={styles.jam__footer__join} onClick={handleJoinClick}>
          {t('jamSession.joinExisting')}
        </button>
        <Tooltip content={t('jamSession.leaveSession')}>
          <button
            className={styles.jam__footer__leave}
            onClick={handleLeaveSession}
            aria-label={t('jamSession.leaveSession')}
          >
            <FaSignOutAlt />
          </button>
        </Tooltip>
      </div>

      {showInviteModal && (
        <InviteModal
          jamSession={jamSession}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {showJoinModal && (
        <JamModal
          onClose={() => setShowJoinModal(false)}
          onJoinSession={handleJoinSession}
        />
      )}
    </div>
  );
};

const Jam = (props) => {
  return <JamContent {...props} />;
};

export default Jam;
