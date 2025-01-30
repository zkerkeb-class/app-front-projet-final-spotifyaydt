import React from 'react';
import style from './Sidebar.module.scss';
import { IoClose } from 'react-icons/io5';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { IoMdAddCircleOutline } from 'react-icons/io';
import {
  BsThreeDotsVertical,
  BsLaptop,
  BsQuestionCircle,
} from 'react-icons/bs';
import { FiSmartphone, FiTablet } from 'react-icons/fi';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

import WaveformAnimation from '../../UI/WaveformAnimation/WaveformAnimation';

const SideBar = () => {
  const {
    displayPlay,
    displayQueue,
    displayDevices,
    displayJam,
    currentTrack,
    currentTracks,
    currentTrackIndex,
    isPlaying,
    togglePlayPause,
    closeSidebar,
    handlePlay,
    currentDevice,
    availableDevices,
    selectDevice,
    setDisplayPlay,
    setDisplayQueue,
    toggleJam,
  } = useAudioPlayer();

  const navigate = useNavigate();

  // Don't render if nothing to display
  if (!displayPlay && !displayQueue && !displayDevices && !displayJam) {
    return null;
  }

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (currentTrack) {
      togglePlayPause();
    }
  };

  const handleTrackClick = (e, track, index) => {
    e.stopPropagation(); // Prevent event bubbling
    if (track) {
      handlePlay({
        track,
        tracks: currentTracks,
        action: 'play',
      });
    }
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation(); // Prevent track click when clicking options
    // Handle options click here
  };

  const handleClose = () => {
    closeSidebar();
  };

  const handleArtistClick = (e) => {
    e.stopPropagation();
    if (currentTrack?.artistId) {
      navigate(`/artist/${currentTrack.artistId}`);
    }
  };

  const handleAlbumClick = (e) => {
    e.stopPropagation();
    if (currentTrack?.albumId) {
      navigate(`/album/${currentTrack.albumId}`);
    }
  };

  const handleOpenQueue = (e) => {
    e.stopPropagation();
    setDisplayPlay(false);
    setDisplayQueue(true);
  };

  const getCurrentTitle = () => {
    if (displayPlay) return 'Now Playing';
    if (displayQueue) return 'Queue';
    if (displayDevices) return 'Connect to a device';
    if (displayJam) return 'Jam with friends';
    return '';
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <FiSmartphone size={20} />;
      case 'tablet':
        return <FiTablet size={20} />;
      case 'desktop':
      default:
        return <BsLaptop size={20} />;
    }
  };

  const renderQueueContent = () => {
    if (!currentTracks || currentTracks.length === 0) {
      return (
        <div className={style.empty_queue}>
          <p>No tracks in queue</p>
        </div>
      );
    }

    return (
      <div className={style.queue_content}>
        {/* Current Track Section */}
        {currentTrack && (
          <div className={style.current_section}>
            <h2 className={style.section_title}>Title playing</h2>
            <div className={style.queue_track_item}>
              <div className={style.track_info_container}>
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={style.track_cover}
                />
                <div className={style.track_details}>
                  <span className={style.track_title}>
                    {currentTrack.title}
                  </span>
                  <span className={style.track_artist}>
                    {currentTrack.artist}
                  </span>
                </div>
              </div>
              <button
                className={style.track_options}
                onClick={handleOptionsClick}
                aria-label="Track options"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          </div>
        )}

        {/* Next Up Section */}
        {currentTracks.length > currentTrackIndex + 1 && (
          <div className={style.next_section}>
            <h2 className={style.section_title}>Up Next</h2>
            <div className={style.queue_tracks_list}>
              {currentTracks
                .slice(currentTrackIndex + 1)
                .map((track, index) => (
                  <div key={track.id} className={style.queue_track_item}>
                    <div
                      className={style.track_info_container}
                      onClick={(e) =>
                        handleTrackClick(
                          e,
                          track,
                          currentTrackIndex + 1 + index
                        )
                      }
                    >
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className={style.track_cover}
                      />
                      <div className={style.track_details}>
                        <span className={style.track_title}>{track.title}</span>
                        <span className={style.track_artist}>
                          {track.artist}
                        </span>
                      </div>
                    </div>
                    <button
                      className={style.track_options}
                      onClick={handleOptionsClick}
                      aria-label="Track options"
                    >
                      <BsThreeDotsVertical />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDevicesContent = () => {
    return (
      <div className={style.devices_content}>
        <div className={style.current_device}>
          <div className={style.device_status_indicator}>
            <div className={style.indicator_bar}></div>
            <span>Appareil actuel</span>
          </div>
          <div
            className={`${style.device_item} ${currentDevice.isActive ? style.active : ''}`}
          >
            <div className={style.device_info}>
              {currentDevice.isActive && isPlaying ? (
                <WaveformAnimation className={style.waveform} />
              ) : (
                getDeviceIcon(currentDevice.type)
              )}
              <div className={style.device_details}>
                <span className={style.device_name}>Web Player</span>
                <span className={style.device_type}>
                  {currentDevice.browserInfo}
                </span>
              </div>
            </div>
          </div>
          <button className={style.launch_jam_button} onClick={toggleJam}>
            <HiMiniUserGroup size={20} />
            Lancer un Jam
          </button>
        </div>

        {availableDevices.length > 0 && (
          <div className={style.other_devices}>
            <h2 className={style.section_title}>Select another device</h2>
            <div className={style.devices_list}>
              {availableDevices.map((device) => (
                <div
                  key={device.id}
                  className={`${style.device_item} ${device.isActive ? style.active : ''}`}
                  onClick={() => selectDevice(device.id)}
                >
                  <div className={style.device_info}>
                    {device.isActive && isPlaying ? (
                      <WaveformAnimation className={style.waveform} />
                    ) : (
                      getDeviceIcon(device.type)
                    )}
                    <span className={style.device_name}>{device.name}</span>
                  </div>
                  <HiOutlineExternalLink className={style.connect_icon} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={style.devices_footer}>
          <div
            className={style.help_text}
            onClick={handleHelpClick}
            role="button"
            tabIndex={0}
          >
            <BsQuestionCircle size={16} />
            <span>You don't see your device ?</span>
          </div>
        </div>
      </div>
    );
  };

  const renderJamContent = () => {
    return (
      <div className={style.jam_content}>
        <div className={style.jam_header}>
          <h2 className={style.section_title}>Start a Jam Session</h2>
          <p className={style.jam_description}>
            Listen to music together with your friends in real-time
          </p>
        </div>
        <div className={style.jam_actions}>
          <button className={style.create_session_button}>
            Create a new session
          </button>
          <button className={style.join_session_button}>
            Join existing session
          </button>
        </div>
      </div>
    );
  };

  const handleHelpClick = () => {
    toggleJam();
  };

  return (
    <div className={style.sidebar}>
      <header className={style.wrapper}>
        <div className={style.header}>
          <div className={style.header__title}>
            <h1 className={style.header__title__text}>{getCurrentTitle()}</h1>
          </div>
          <button
            className={style.header__button}
            onClick={handleClose}
            aria-label="Close sidebar"
          >
            <IoClose />
          </button>
        </div>
      </header>

      <div className={style.content}>
        {displayPlay && currentTrack && (
          <>
            <div className={style.track_info}>
              <div className={style.cover}>
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={style.cover_image}
                />
                <button
                  className={style.play_button}
                  onClick={handlePlayClick}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
              </div>
              <div className={style.details}>
                <h2 className={style.title}>{currentTrack.title}</h2>
                <p
                  className={style.artist}
                  onClick={handleArtistClick}
                  role="link"
                  tabIndex={0}
                >
                  {currentTrack.artist}
                </p>
                <p
                  className={style.album}
                  onClick={handleAlbumClick}
                  role="link"
                  tabIndex={0}
                >
                  {currentTrack.album}
                </p>
                <button className={style.add_button}>
                  <IoMdAddCircleOutline />
                  Add to Library
                </button>
              </div>
            </div>

            {currentTracks.length > currentTrackIndex + 1 && (
              <div className={style.next_up_section}>
                <div className={style.next_up_header}>
                  <h2 className={style.section_title}>Up Next</h2>
                  <button
                    className={style.open_queue_button}
                    onClick={handleOpenQueue}
                  >
                    Open Queue
                  </button>
                </div>
                <div className={style.next_track_preview}>
                  {currentTracks[currentTrackIndex + 1] && (
                    <div
                      className={style.queue_track_item}
                      onClick={(e) =>
                        handleTrackClick(
                          e,
                          currentTracks[currentTrackIndex + 1],
                          currentTrackIndex + 1
                        )
                      }
                    >
                      <div className={style.track_info_container}>
                        <img
                          src={currentTracks[currentTrackIndex + 1].coverUrl}
                          alt={currentTracks[currentTrackIndex + 1].title}
                          className={style.track_cover}
                        />
                        <div className={style.track_details}>
                          <span className={style.track_title}>
                            {currentTracks[currentTrackIndex + 1].title}
                          </span>
                          <span className={style.track_artist}>
                            {currentTracks[currentTrackIndex + 1].artist}
                          </span>
                        </div>
                      </div>
                      <button
                        className={style.track_options}
                        onClick={handleOptionsClick}
                        aria-label="Track options"
                      >
                        <BsThreeDotsVertical />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {displayQueue && renderQueueContent()}
        {displayDevices && renderDevicesContent()}
        {displayJam && renderJamContent()}
      </div>
    </div>
  );
};

export default SideBar;
