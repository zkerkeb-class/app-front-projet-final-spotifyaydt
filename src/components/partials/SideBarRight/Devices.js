import React from 'react';
import styles from './Sidebar.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { FaLaptop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';

const Devices = () => {
  const { currentDevice, availableDevices, selectDevice } = useAudioPlayer();

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <FaMobileAlt />;
      case 'tablet':
        return <FaTabletAlt />;
      default:
        return <FaLaptop />;
    }
  };

  return (
    <div className={styles.devices}>
      <div className={styles.devices__current}>
        <h3 className={styles.devices__section__title}>Appareil actuel</h3>
        <div
          className={`${styles.devices__item} ${styles.devices__item__current}`}
        >
          {getDeviceIcon(currentDevice.type)}
          <div className={styles.devices__item__info}>
            <span className={styles.devices__item__info__name}>
              {currentDevice.name}
            </span>
            <span className={styles.devices__item__info__status}>
              {currentDevice.browserInfo}
            </span>
          </div>
          <div className={styles.devices__item__status}>
            <span className={styles.devices__item__status__indicator} />
          </div>
        </div>
      </div>

      {availableDevices.length > 0 && (
        <div className={styles.devices__available}>
          <h3 className={styles.devices__section__title}>
            Appareils disponibles
          </h3>
          {availableDevices.map((device) => (
            <button
              key={device.id}
              className={styles.devices__item}
              onClick={() => selectDevice(device.id)}
            >
              {getDeviceIcon(device.type)}
              <div className={styles.devices__item__info}>
                <span className={styles.devices__item__info__name}>
                  {device.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <button className={styles.devices__footer__button}>Lancer un Jam</button>
    </div>
  );
};

export default Devices;
