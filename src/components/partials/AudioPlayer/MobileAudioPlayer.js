import React, { useState } from 'react';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import styles from './MobileAudioPlayer.module.scss';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import {
  IoPlayCircle,
  IoPauseCircle,
  IoChevronDown,
  IoEllipsisHorizontal,
} from 'react-icons/io5';
import { FaBluetoothB, FaLaptop, FaMobileAlt } from 'react-icons/fa';
import { BsCast } from 'react-icons/bs';
import { HiOutlineQueueList } from 'react-icons/hi2';
import { IoMdSkipForward, IoMdSkipBackward, IoMdShuffle } from 'react-icons/io';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';
import { formatTime } from '../../../utils/formatTime';
import classNames from 'classnames';
import QueueModal from './QueueModal';
import JamModal from './JamModal';

const MobileAudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    playNextTrack,
    playPreviousTrack,
    shuffleOn,
    toggleShuffle,
    repeatTrack,
    repeatPlaylist,
    toggleRepeat,
    handleSeek,
    toggleJam,
  } = useAudioPlayer();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showJam, setShowJam] = useState(false);

  if (!currentTrack) return null;

  const progressPercentage = (currentTime / duration) * 100;

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    handleSeek(newTime);
  };

  const getRepeatIcon = () => {
    if (repeatPlaylist) {
      return <TbRepeat style={{ color: 'var(--accent-color)' }} />;
    }

    if (repeatTrack) {
      return <TbRepeatOnce style={{ color: 'var(--accent-color)' }} />;
    }

    return <TbRepeat />;
  };

  const getDeviceIcon = () => {
    // Check if running in a browser
    const isBrowser =
      typeof window !== 'undefined' && typeof navigator !== 'undefined';
    if (!isBrowser)
      return { icon: <FaLaptop />, label: t('audioPlayer.devices.browser') };

    // Check if it's a mobile device
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

    // Check if it's a tablet
    const isTablet =
      /iPad|Android/i.test(navigator.userAgent) &&
      !/Mobile/i.test(navigator.userAgent);

    // Check if Bluetooth is available and connected
    const isBluetoothAvailable =
      navigator.bluetooth &&
      typeof navigator.bluetooth.getAvailability === 'function';

    if (isBluetoothAvailable && navigator.bluetooth.getAvailability()) {
      return {
        icon: <FaBluetoothB />,
        label: t('audioPlayer.devices.bluetooth'),
      };
    } else if (isTablet) {
      return {
        icon: <FaMobileAlt />,
        label: t('audioPlayer.devices.tablet'),
      };
    } else if (isMobile) {
      return {
        icon: <FaMobileAlt />,
        label: t('audioPlayer.devices.mobile'),
      };
    } else {
      return {
        icon: <FaLaptop />,
        label: t('audioPlayer.devices.browser'),
      };
    }
  };

  const deviceInfo = getDeviceIcon();

  return (
    <>
      <div
        className={`${styles.mobilePlayer} ${isExpanded ? styles.hidden : ''}`}
        onClick={() => setIsExpanded(true)}
      >
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.artwork}>
            {currentTrack.coverUrl ? (
              <OptimizedImage
                src={currentTrack.coverUrl}
                alt={t('common.coverArt', { title: currentTrack.title })}
                className={styles.coverImage}
                sizes="48px"
                loading="eager"
              />
            ) : (
              <div className={styles.fallback}>
                <BsMusicNoteBeamed />
              </div>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.title}>{currentTrack.title}</div>
            <div className={styles.artist}>{getArtistName(currentTrack)}</div>
          </div>
          <div className={styles.device}>{deviceInfo.icon}</div>
          <button
            className={styles.playButton}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? t('player.pause') : t('player.play')}
          >
            {isPlaying ? <IoPauseCircle /> : <IoPlayCircle />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedPlayer}>
          <div className={styles.header}>
            <button
              className={styles.closeButton}
              onClick={() => setIsExpanded(false)}
              aria-label={t('player.minimizePlayer')}
            >
              <IoChevronDown />
            </button>
            <span className={styles.headerTitle}>{t('player.nowPlaying')}</span>
            <button
              className={styles.menuButton}
              aria-label={t('common.trackOptions')}
            >
              <IoEllipsisHorizontal />
            </button>
          </div>

          <div className={styles.expandedContent}>
            <div className={styles.artworkLarge}>
              {currentTrack.coverUrl ? (
                <OptimizedImage
                  src={currentTrack.coverUrl}
                  alt={t('common.coverArt', { title: currentTrack.title })}
                  className={styles.coverImageLarge}
                  sizes="(max-width: 768px) 300px, 400px"
                  loading="eager"
                />
              ) : (
                <div className={styles.fallbackLarge}>
                  <BsMusicNoteBeamed />
                </div>
              )}
            </div>

            <div className={styles.trackInfo}>
              <h1 className={styles.trackTitle}>{currentTrack.title}</h1>
              <h2 className={styles.trackArtist}>
                {getArtistName(currentTrack)}
              </h2>
            </div>

            <div className={styles.progressBarLarge}>
              <div
                className={styles.progressBarContainer}
                onClick={handleProgressBarClick}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className={styles.timeInfo}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className={styles.controls}>
              <button
                className={classNames(styles.controlButton, {
                  [styles.active]: shuffleOn,
                })}
                onClick={toggleShuffle}
                aria-label={t('player.shuffle')}
              >
                <IoMdShuffle />
              </button>
              <button
                className={styles.controlButton}
                onClick={playPreviousTrack}
                aria-label={t('player.previous')}
              >
                <IoMdSkipBackward />
              </button>
              <button
                className={styles.playButtonLarge}
                onClick={togglePlayPause}
                aria-label={isPlaying ? t('player.pause') : t('player.play')}
              >
                {isPlaying ? <IoPauseCircle /> : <IoPlayCircle />}
              </button>
              <button
                className={styles.controlButton}
                onClick={playNextTrack}
                aria-label={t('player.next')}
              >
                <IoMdSkipForward />
              </button>
              <button
                className={classNames(styles.controlButton, {
                  [styles.active]: repeatTrack || repeatPlaylist,
                })}
                onClick={toggleRepeat}
                aria-label={t('player.repeat')}
              >
                {getRepeatIcon()}
              </button>
            </div>

            <div className={styles.deviceControls}>
              <button className={styles.deviceButton}>
                {deviceInfo.icon}
                <span>{deviceInfo.label}</span>
              </button>
              <button
                className={styles.queueButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQueue(true);
                  setIsExpanded(false);
                }}
                aria-label={t('player.queue')}
              >
                <HiOutlineQueueList />
              </button>
            </div>
          </div>
        </div>
      )}

      {showQueue && <QueueModal onClose={() => setShowQueue(false)} />}
      {showJam && <JamModal onClose={() => setShowJam(false)} />}
    </>
  );
};

export default MobileAudioPlayer;
