import React, { useState } from 'react';
import style from './RecentSection.module.scss';

import RecentCardSkeleton from '../../skeleton/RecentCardSkeleton/RecentCardSkeletonSkeleton';

import { FaPlay } from 'react-icons/fa6';

const mockData = {
  tracks: Array(8)
    .fill(null)
    .map((_, i) => ({
      id: i,
      type: 'track',
      title: `Top Track ${i + 1}`,
      artist: `Artist ${i + 1}`,
      coverUrl: `https://picsum.photos/200?random=${i}`,
    })),
};

const RecentSection = () => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <RecentCardSkeleton />;
  }
  return (
    <div className={style.recent}>
      <div className={style.recent__header}>
        <h2 className={style.recent__header__title}>Recently Played</h2>
      </div>
      <div className={style.recent__grid}>
        {mockData.tracks.map((track) => (
          <div className={style.recent__grid__item}>
            <img
              className={style.recent__grid__item__thumbnail}
              src={track.coverUrl}
              alt={track.title}
            />
            <div className={style.recent__grid__item__content}>
              <div className={style.recent__grid__item__content__title}>
                {track.title}
              </div>
              <button className={style.recent__grid__item__content__play}>
                <FaPlay />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSection;
