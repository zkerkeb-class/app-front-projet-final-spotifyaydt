import React from 'react';
import style from './RecentCard.module.scss';

const RecentCardSkeleton = () => {
  return (
    <div className={style.featured_grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={style.featured_grid_item}>
          <div className={style.featured_grid_thumbnail} />
          <div className={style.featured_grid_content}>
            <div className={style.featured_grid_title} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentCardSkeleton;
