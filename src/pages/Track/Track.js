import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './Track.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../../components/UI/OptimizedImage/OptimizedImage';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import CardFallbackIcon from '../../components/UI/CardFallbackIcon/CardFallbackIcon';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const Track = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, currentTrack, handlePause } = useAudioPlayer();
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const {
    data: track,
    loading: trackLoading,
    error: trackError,
  } = useApi(() => api.tracks.getById(id), [id]);

  const { data: albums, loading: albumsLoading } = useApi(
    () => api.albums.getAll(),
    []
  );

  const album = albums?.find(
    (a) =>
      a.title ===
      (typeof track?.album === 'object' ? track?.album?.title : track?.album)
  );

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePlayClick = useCallback(() => {
    if (track) {
      if (isPlaying && currentTrack?.id === track.id) {
        handlePause();
      } else {
        handlePlay({
          track,
          tracks: [track],
          action: 'play',
        });
      }
    }
  }, [track, isPlaying, currentTrack, handlePlay, handlePause]);

  const handleLike = useCallback(() => {
    if (track) {
      console.log('Toggle like for track:', track);
      // Implement your like logic here
    }
  }, [track]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const getAlbumTitle = (track) => {
    if (!track?.album) return t('common.unknownAlbum');
    if (typeof track.album === 'string') return track.album;
    if (track.album._id) return track.album.title || t('common.unknownAlbum');
    return track.album.title || t('common.unknownAlbum');
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (trackLoading || albumsLoading) {
    return <LoadingSpinner />;
  }

  if (trackError) {
    return <div>Error loading track: {trackError}</div>;
  }

  if (!track) {
    return <div>Track not found</div>;
  }

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <div className={style.content}>
          <div className={style.track_info}>
            <div className={style.cover}>
              {!imageError ? (
                <OptimizedImage
                  src={track.coverUrl || track.coverImage}
                  alt={t('common.coverArt', { title: track.title })}
                  className={style.cover_image}
                  sizes="(max-width: 768px) 250px, 300px"
                  loading="eager"
                  onError={handleImageError}
                />
              ) : (
                <CardFallbackIcon type="track" />
              )}
              <button
                className={style.play_button}
                onClick={handlePlayClick}
                aria-label={
                  isPlaying && currentTrack?.id === track.id
                    ? t('common.pause', { title: track.title })
                    : t('common.play', { title: track.title })
                }
              >
                {isPlaying && currentTrack?.id === track.id ? (
                  <FaPause />
                ) : (
                  <FaPlay />
                )}
              </button>
            </div>

            <div className={style.details}>
              <h1 className={style.title}>{track.title}</h1>
              <p className={style.artist}>{getArtistName(track)}</p>
              <div className={style.meta}>
                <span>{getAlbumTitle(track)}</span>
                <span>•</span>
                <span>{track.releaseYear || t('track.unknown.year')}</span>
                <span>•</span>
                <span>{formatDuration(track.duration)}</span>
              </div>

              <div className={style.stats}>
                <button
                  className={`${style.like_button} ${track.isLiked ? style.liked : ''}`}
                  onClick={handleLike}
                  aria-label={
                    track.isLiked ? t('track.unlike') : t('track.like')
                  }
                >
                  <FaHeart />
                </button>
                <span className={style.plays}>
                  {t('track.plays', { count: formatNumber(track.plays || 0) })}
                </span>
              </div>
            </div>
          </div>

          <div className={style.additional_info}>
            {track.lyrics && (
              <section className={style.lyrics}>
                <h2>{t('track.lyrics')}</h2>
                <p>{t('track.lyricsAvailable')}</p>
              </section>
            )}

            <section className={style.track_details}>
              <h2>{t('track.details')}</h2>
              <div className={style.detail_grid}>
                <div className={style.detail_item}>
                  <span className={style.label}>
                    {t('track.details_labels.album')}
                  </span>
                  <span className={style.value}>{getAlbumTitle(track)}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>
                    {t('track.details_labels.artist')}
                  </span>
                  <span className={style.value}>{getArtistName(track)}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>
                    {t('track.details_labels.genre')}
                  </span>
                  <span className={style.value}>
                    {track.genre || t('track.unknown.genre')}
                  </span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>
                    {t('track.details_labels.releaseYear')}
                  </span>
                  <span className={style.value}>
                    {track.releaseYear || t('track.unknown.year')}
                  </span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>
                    {t('track.details_labels.duration')}
                  </span>
                  <span className={style.value}>
                    {formatDuration(track.duration)}
                  </span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>
                    {t('track.details_labels.mood')}
                  </span>
                  <span className={style.value}>
                    {track.mood || t('track.unknown.mood')}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Track;
