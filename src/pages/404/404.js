import React from 'react';
import style from './404.module.scss';

const NotFound = () => {
  return (
    <div className={style.not_found}>
      <div className={style.not_found__content}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className={style.back_home}>
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
