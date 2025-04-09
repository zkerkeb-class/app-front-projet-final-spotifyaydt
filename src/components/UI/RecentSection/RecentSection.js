import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import style from './RecentSection.module.scss';
import RecentCardSkeleton from '../../skeleton/RecentCardSkeleton/RecentCardSkeletonSkeleton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';

const RecentTrackItem = memo(({ track }) => {
  const { handlePlay, isPlaying, currentTrack } = useAudioPlayer();
  const { t } = useTranslation();

  // Helper function to safely get artist name
  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  // Check if this specific track is currently playing
  const isThisPlaying = isPlaying && currentTrack?.id === track.id;

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();
      handlePlay({
        track,
        tracks: [track], // Single track mode
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [track, handlePlay, isThisPlaying]
  );

  return (
    <div className={style.recent__grid__item}>
      {track.coverImage ? (
        <OptimizedImage
          src={track.coverImage}
          alt={t('common.coverArt', { title: track.title })}
          className={style.recent__grid__item__thumbnail}
          sizes="(max-width: 768px) 48px, 64px"
          loading="lazy"
        />
      ) : (
        <div className={style.recent__grid__item__fallback}>
          <CardFallbackIcon />
        </div>
      )}
      <div className={style.recent__grid__item__content}>
        <div
          className={`${style.recent__grid__item__content__title} ${isThisPlaying ? style.green : ''}`}
        >
          <span className={style.recent__grid__item__content__title__text}>
            {track.title}
          </span>
          <span className={style.recent__grid__item__content__artist}>
            {getArtistName(track)}
          </span>
        </div>
        <button
          className={`${style.recent__grid__item__content__play} ${isThisPlaying ? style.visible : ''}`}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pause', { title: track.title })
              : t('common.play', { title: track.title })
          }
        >
          {isThisPlaying ? (
            <>
              <FaPause className={style.pause_icon} />
            </>
          ) : (
            <FaPlay />
          )}
        </button>
      </div>
    </div>
  );
});

RecentTrackItem.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
    artist: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const RecentSection = ({ tracks, isLoading, onPlay }) => {
  const [recentTracks, setRecentTracks] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setRecentTracks(tracks.slice(0, 8)); // Keep only the last 8 tracks
  }, [tracks]);

  if (isLoading) {
    return <RecentCardSkeleton />;
  }

  if (recentTracks.length === 0) {
    return null; // Do not render anything if there are no recent tracks
  }

  return (
    <div className={style.recent}>
      <div className={style.recent__header}>
        <h2 className={style.recent__header__title}>
          {t('common.recentlyPlayed')}
        </h2>
      </div>
      <div className={style.recent__grid}>
        {recentTracks.map((track) => (
          <RecentTrackItem key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

RecentSection.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      coverImage: PropTypes.string.isRequired,
      artist: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  onPlay: PropTypes.func,
};

RecentSection.defaultProps = {
  tracks: [],
  isLoading: false,
  onPlay: () => {},
};

export default memo(RecentSection);
