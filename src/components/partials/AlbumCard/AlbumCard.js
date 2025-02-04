import styles from './AlbumCard.module.scss';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const AlbumCard = ({ album, onClick, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onPlayPause();
  };

  return (
    <button
      className={styles.album_card}
      onClick={onClick}
      aria-label={t('common.album')}
    >
      <div className={styles.album_image}>
        <img
          src={album.image}
          alt={t('common.albumCover', { title: album.title })}
          className={styles.album_artwork}
        />
        <button
          className={styles.play_pause_button}
          onClick={handlePlayPause}
          aria-label={
            isPlaying
              ? t('common.pauseAlbum', { title: album.title })
              : t('common.playAlbum', { title: album.title })
          }
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className={styles.album_info}>
        <h3 className={styles.album_title}>{album.title}</h3>
        <p className={styles.album_artist}>{album.artist}</p>
      </div>
    </button>
  );
};

export default AlbumCard;
