import styles from './ArtistCard.module.scss';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const ArtistCard = ({ artist, onClick, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onPlayPause();
  };

  return (
    <button
      className={styles.artist_card}
      onClick={onClick}
      aria-label={t('common.artist')}
    >
      <div className={styles.artist_image}>
        <img
          src={artist.image}
          alt={t('common.artistPhoto', { name: artist.name })}
          className={styles.artist_photo}
        />
        <button
          className={styles.play_pause_button}
          onClick={handlePlayPause}
          aria-label={
            isPlaying
              ? t('common.pauseArtist', { name: artist.name })
              : t('common.playArtist', { name: artist.name })
          }
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className={styles.artist_info}>
        <h3 className={styles.artist_name}>{artist.name}</h3>
        <p className={styles.artist_followers}>
          {t('common.followerCount', { count: artist.followers })}
        </p>
      </div>
    </button>
  );
};

export default ArtistCard;
