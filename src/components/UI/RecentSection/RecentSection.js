import React, { memo, useCallback, useEffect, useState } from 'react';
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

const RecentSection = ({ tracks, isLoading, onPlay }) => {
  const [recentTracks, setRecentTracks] = useState([]);

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
        <h2 className={style.recent__header__title}>Recently Played</h2>
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
      coverUrl: PropTypes.string.isRequired,
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
