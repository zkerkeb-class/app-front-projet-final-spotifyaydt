import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import style from './RecentSection.module.scss';
import RecentCardSkeleton from '../../skeleton/RecentCardSkeleton/RecentCardSkeletonSkeleton';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import WaveformAnimation from '../WaveformAnimation/WaveformAnimation';

const RecentTrackItem = memo(({ track }) => {
  const { handlePlay, isPlaying, currentTrack } = useAudioPlayer();

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
      <img
        className={style.recent__grid__item__thumbnail}
        src={track.coverUrl}
        alt={track.title}
        loading="lazy"
      />
      <div className={style.recent__grid__item__content}>
        <div
          className={`${style.recent__grid__item__content__title} ${isThisPlaying ? style.green : ''}`}
        >
          {track.title}
        </div>
        <button
          className={`${style.recent__grid__item__content__play} ${isThisPlaying ? style.visible : ''}`}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`
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
    coverUrl: PropTypes.string.isRequired,
  }).isRequired,
};

const RecentSection = ({ tracks, isLoading }) => {
  if (isLoading) {
    return <RecentCardSkeleton />;
  }

  return (
    <div className={style.recent}>
      <div className={style.recent__header}>
        <h2 className={style.recent__header__title}>Recently Played</h2>
      </div>
      <div className={style.recent__grid}>
        {tracks?.map((track) => (
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
      coverUrl: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
};

RecentSection.defaultProps = {
  tracks: [],
  isLoading: false,
};

export default memo(RecentSection);
