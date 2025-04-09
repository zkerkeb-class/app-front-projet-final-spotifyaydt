import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Artist.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { generateGradient } from '../../utils/colorUtils';
import OptimizedImage from '../../components/UI/OptimizedImage/OptimizedImage';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import CardFallbackIcon from '../../components/UI/CardFallbackIcon/CardFallbackIcon';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';

const Artist = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, currentTrack } = useAudioPlayer();
  const { t } = useTranslation();

  const {
    data: artist,
    loading: artistLoading,
    error: artistError,
  } = useApi(() => api.artists.getById(id), [id]);

  const { data: tracks, loading: tracksLoading } = useApi(
    () => api.tracks.getAll(),
    []
  );

  const { data: albums, loading: albumsLoading } = useApi(
    () => api.albums.getAll(),
    []
  );

  const artistTracks =
    tracks?.filter((track) => {
      if (!track.artist || !artist?._id) return false;

      // If track.artist is an object with _id (MongoDB format)
      if (typeof track.artist === 'object' && track.artist._id) {
        return track.artist._id === artist._id;
      }

      // If track.artist is an array of objects
      if (Array.isArray(track.artist)) {
        return track.artist.some((a) =>
          typeof a === 'object' ? a._id === artist._id : a === artist._id
        );
      }

      // If track.artist is a string (ID)
      return track.artist === artist._id;
    }) || [];

  const artistAlbums =
    albums?.filter((album) => {
      if (!album.artist || !artist?._id) return false;

      // If album.artist is an object
      if (typeof album.artist === 'object') {
        return album.artist._id === artist._id;
      }

      // If album.artist is a string (ID)
      return album.artist === artist._id;
    }) || [];

  // Generate unique gradient for this artist
  const headerStyle = artist ? generateGradient(artist.name) : {};

  // Check if this artist's tracks are currently playing
  const isThisPlaying =
    isPlaying && currentTrack && artistTracks.includes(currentTrack);

  const handlePlayClick = useCallback(() => {
    if (!artist || artistTracks.length === 0) {
      console.warn(`No tracks found for artist: ${artist?.name}`);
      return;
    }

    handlePlay({
      track: artistTracks[0],
      tracks: artistTracks,
      action: isThisPlaying ? 'pause' : 'play',
    });
  }, [artist, artistTracks, handlePlay, isThisPlaying]);

  const handleTrackPlay = useCallback(
    (track) => {
      if (!artist) return;
      handlePlay({
        track,
        tracks: artistTracks,
        action: isPlaying && currentTrack?.id === track.id ? 'pause' : 'play',
      });
    },
    [artist, artistTracks, handlePlay, isPlaying, currentTrack]
  );

  const handleShuffle = useCallback(() => {
    if (!artist || artistTracks.length === 0) return;

    const shuffledTracks = [...artistTracks].sort(() => Math.random() - 0.5);

    handlePlay({
      track: shuffledTracks[0],
      tracks: shuffledTracks,
      action: 'play',
    });
  }, [artist, artistTracks, handlePlay]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';

    // If duration is already in MM:SS format
    if (typeof duration === 'string' && duration.includes(':')) {
      const [minutes, seconds] = duration.split(':');
      return `${minutes}:${seconds.padStart(2, '0')}`;
    }

    // If duration is in seconds (number or string)
    const totalSeconds = parseInt(duration, 10);
    if (isNaN(totalSeconds)) return '0:00';

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (artistLoading || tracksLoading || albumsLoading) {
    return <LoadingSpinner />;
  }

  if (artistError) {
    return <div>Error loading artist: {artistError}</div>;
  }

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <header className={styles.header} style={headerStyle}>
          <div className={styles.header__container}>
            {artist.imageUrl ? (
              <OptimizedImage
                src={artist.imageUrl}
                alt={t('common.artistPhoto', { name: artist.name })}
                className={styles.header__container__image}
                sizes="(max-width: 768px) 200px, 232px"
                loading="eager"
                onError={() => {
                  const img = document.querySelector(
                    `.${styles.header__container__image}`
                  );
                  if (img) img.src = '/default-artist.png';
                }}
              />
            ) : (
              <div
                className={`${styles.header__container__fallback} ${styles.header__container__image}`}
              >
                <CardFallbackIcon type="artist" />
              </div>
            )}
          </div>
          <div className={styles.header__info}>
            <span>{t('common.artist')}</span>
            <h1 className={styles.header__info__title}>{artist.name}</h1>
            <div className={styles.header__info__more}>
              <span>
                {t('common.followerCount', {
                  count: formatNumber(artist.followers),
                })}
              </span>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.main__header}>
            <div className={styles.main__header__container}>
              <button
                className={styles.main__header__container__button}
                onClick={handlePlayClick}
                aria-label={
                  isThisPlaying
                    ? t('common.pauseArtist', { name: artist.name })
                    : t('common.playArtist', { name: artist.name })
                }
              >
                {isThisPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={`${styles.main__header__container__button} ${styles.shuffle_button}`}
                onClick={handleShuffle}
                aria-label={t('common.shuffleArtist', { name: artist.name })}
              >
                <PiShuffleBold />
              </button>
            </div>
          </div>

          <div className={styles.main__content}>
            <section className={styles.popular}>
              <h2>{t('common.popularTracks')}</h2>
              {artistTracks.length > 0 ? (
                <div className={styles.tracks}>
                  {artistTracks.slice(0, 5).map((track, index) => (
                    <div
                      key={track.id}
                      className={styles.track}
                      onClick={() => handleTrackPlay(track)}
                    >
                      <div className={styles.track__info}>
                        {isPlaying &&
                        currentTrack &&
                        currentTrack.id === track.id ? (
                          <button
                            className={`${styles.track__play_icon} ${styles.visible}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrackPlay(track);
                            }}
                            aria-label={t('common.pause', {
                              title: track.title,
                            })}
                          >
                            <WaveformAnimation className={styles.waveform} />
                            <FaPause className={styles.pause_icon} />
                          </button>
                        ) : (
                          <>
                            <span className={styles.track__number}>
                              {index + 1}
                            </span>
                            <button
                              className={styles.track__play_icon}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackPlay(track);
                              }}
                              aria-label={t('common.play', {
                                title: track.title,
                              })}
                            >
                              <FaPlay />
                            </button>
                          </>
                        )}
                        {track.coverUrl ? (
                          <OptimizedImage
                            src={track.coverUrl}
                            alt={t('common.coverArt', { title: track.title })}
                            className={styles.track__image}
                            sizes="(max-width: 768px) 40px, 50px"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/default-track.png';
                            }}
                          />
                        ) : (
                          <div className={styles.track__image_fallback}>
                            <CardFallbackIcon type="track" />
                          </div>
                        )}
                        <div className={styles.track__details}>
                          {isPlaying &&
                          currentTrack &&
                          currentTrack.id === track.id ? (
                            <span
                              className={`${styles.track__title} ${styles.green}`}
                            >
                              {track.title}
                            </span>
                          ) : (
                            <span className={styles.track__title}>
                              {track.title}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={styles.track__plays}>
                        {t('track.plays', {
                          count: formatNumber(track.plays || 0),
                        })}
                      </span>
                      <span className={styles.track__duration}>
                        {formatDuration(track.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.no_content}>
                  <p>{t('artist.noTracks')}</p>
                </div>
              )}
            </section>

            <section className={styles.discography}>
              <h2>{t('artist.discography')}</h2>
              {artistAlbums.length > 0 ? (
                <HorizontalScroll title={t('artist.albums')}>
                  {artistAlbums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onPlay={handleTrackPlay}
                    />
                  ))}
                </HorizontalScroll>
              ) : (
                <div className={styles.no_content}>
                  <p>{t('artist.noAlbums')}</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Artist;
