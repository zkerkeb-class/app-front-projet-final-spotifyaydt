import React from 'react';
import style from './Main.module.scss';

// Components
import Home from '../Home/Home';
import Footer from '../../components/partials/Footer/Footer';

const Main = () => {
  return (
    <div className={style.wrapper}>
      <Home />
      <Footer />
    </div>
  );
};

export default Main;
