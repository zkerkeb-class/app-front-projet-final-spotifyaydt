import styles from './PlaylistCard.module.scss';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const PlaylistCard = ({ playlist, onClick, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onPlayPause();
  };

  return (
    <button
      className={styles.playlist_card}
      onClick={onClick}
      aria-label={t('common.playlist')}
    >
      <div className={styles.playlist_image}>
        <img
          src={playlist.image}
          alt={t('common.playlistCover', { title: playlist.title })}
          className={styles.playlist_artwork}
        />
        <button
          className={styles.play_pause_button}
          onClick={handlePlayPause}
          aria-label={
            isPlaying
              ? t('common.pausePlaylist', { title: playlist.title })
              : t('common.playPlaylist', { title: playlist.title })
          }
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className={styles.playlist_info}>
        <h3 className={styles.playlist_title}>{playlist.title}</h3>
        <p className={styles.playlist_description}>{playlist.description}</p>
      </div>
    </button>
  );
};

export default PlaylistCard;
