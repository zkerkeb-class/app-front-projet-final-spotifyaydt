import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './Footer.module.scss';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <span>{t('common.copyright', { year: new Date().getFullYear() })}</span>
      </div>
    </div>
  );
};

export default Footer;
