import styles from './TrackCard.module.scss';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const TrackCard = ({ track, onClick, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onPlayPause();
  };

  return (
    <button
      className={styles.track_card}
      onClick={onClick}
      aria-label={t('common.track')}
    >
      <div className={styles.track_image}>
        <img
          src={track.image}
          alt={t('common.coverArt', { title: track.title })}
          className={styles.track_artwork}
        />
        <button
          className={styles.play_pause_button}
          onClick={handlePlayPause}
          aria-label={
            isPlaying
              ? t('common.pause', { title: track.title })
              : t('common.play', { title: track.title })
          }
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className={styles.track_info}>
        <h3 className={styles.track_title}>{track.title}</h3>
        <p className={styles.track_artist}>{track.artist}</p>
      </div>
    </button>
  );
};

export default TrackCard;
