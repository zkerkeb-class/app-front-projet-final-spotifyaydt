import React, { memo } from 'react';
import PropTypes from 'prop-types';
import style from './RecentSection.module.scss';
import RecentCardSkeleton from '../../skeleton/RecentCardSkeleton/RecentCardSkeletonSkeleton';
import { FaPlay } from 'react-icons/fa6';

const RecentTrackItem = memo(({ track, onPlay }) => {
  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) onPlay(track);
  };

  return (
    <div className={style.recent__grid__item}>
      <img
        className={style.recent__grid__item__thumbnail}
        src={track.coverUrl}
        alt={track.title}
        loading="lazy"
      />
      <div className={style.recent__grid__item__content}>
        <div className={style.recent__grid__item__content__title}>
          {track.title}
        </div>
        <button
          className={style.recent__grid__item__content__play}
          onClick={handlePlay}
          aria-label={`Play ${track.title}`}
        >
          <FaPlay />
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
  onPlay: PropTypes.func,
};

const RecentSection = ({ tracks, isLoading, onPlay }) => {
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
          <RecentTrackItem key={track.id} track={track} onPlay={onPlay} />
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
};

export default memo(RecentSection);
