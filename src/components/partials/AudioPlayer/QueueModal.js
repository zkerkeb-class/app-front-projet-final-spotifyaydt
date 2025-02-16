import React from 'react';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import styles from './QueueModal.module.scss';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';
import { IoChevronDown, IoEllipsisHorizontal } from 'react-icons/io5';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { IoPauseCircle, IoPlayCircle } from 'react-icons/io5';

const QueueModal = ({ onClose }) => {
  const {
    currentTrack,
    currentTracks,
    currentTrackIndex,
    isPlaying,
    handlePlay,
    togglePlayPause,
  } = useAudioPlayer();
  const { t } = useTranslation();

  const upcomingTracks = currentTracks.slice(currentTrackIndex + 1);

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const handleTrackClick = (track, index) => {
    handlePlay({
      track,
      tracks: currentTracks,
      action: 'play',
    });
  };

  const TrackItem = ({ track, isCurrentTrack = false }) => (
    <div
      className={styles.trackItem}
      onClick={() => !isCurrentTrack && handleTrackClick(track)}
    >
      <div className={styles.trackArtwork}>
        {track.coverUrl ? (
          <OptimizedImage
            src={track.coverUrl}
            alt={t('common.coverArt', { title: track.title })}
            className={styles.coverImage}
            sizes="48px"
            loading="lazy"
          />
        ) : (
          <div className={styles.fallback}>
            <BsMusicNoteBeamed />
          </div>
        )}
      </div>
      <div className={styles.trackInfo}>
        <span
          className={`${styles.trackTitle} ${isCurrentTrack ? styles.playing : ''}`}
        >
          {track.title}
        </span>
        <span className={styles.trackArtist}>{getArtistName(track)}</span>
      </div>
      {isCurrentTrack && (
        <button
          className={styles.playButton}
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          {isPlaying ? <IoPauseCircle /> : <IoPlayCircle />}
        </button>
      )}
      <button className={styles.menuButton}>
        <IoEllipsisHorizontal />
      </button>
    </div>
  );

  return (
    <div className={styles.queueModal}>
      <div className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <IoChevronDown />
        </button>
        <span className={styles.headerTitle}>{t('player.queue')}</span>
        <div className={styles.placeholder} />
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('player.nowPlaying')}</h3>
          {currentTrack && (
            <TrackItem track={currentTrack} isCurrentTrack={true} />
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('player.upNext')}</h3>
          {upcomingTracks.length > 0 ? (
            upcomingTracks.map((track, index) => (
              <TrackItem key={track._id} track={track} />
            ))
          ) : (
            <p className={styles.emptyMessage}>{t('player.emptyQueue')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueModal;
