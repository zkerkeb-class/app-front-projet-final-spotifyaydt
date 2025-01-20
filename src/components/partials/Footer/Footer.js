import React from 'react';
import style from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <span>© 2021 AYDT</span>
      </div>
    </div>
  );
};

export default Footer;
