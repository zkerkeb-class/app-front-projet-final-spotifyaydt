import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import styles from './FullscreenView.module.scss';
import { mockTracks } from '../../../constant/mockData';
import { IoShuffle } from 'react-icons/io5';
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from 'react-icons/io5';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';
import { LuMinimize2 } from 'react-icons/lu';
import { FaSpotify } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';
import { IoClose } from 'react-icons/io5';

const FullscreenView = () => {
  const {
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    handleSeek,
    formatTime,
    closeFullscreen,
    audioRef,
    shuffleOn,
    toggleShuffle,
    repeatTrack,
    repeatPlaylist,
    toggleRepeat,
    playNextTrack,
    playPreviousTrack,
    volume,
    previewVolume,
    volumeBarRef,
    isAdjustingVolume,
    handleVolumeStart,
    handleVolumeUpdate,
    handleVolumeEnd,
    handleVolumeClick,
    handleVolumeKeyDown,
    toggleMute,
    getVolumeIcon,
    handleSeekStart,
    handleSeekEnd,
    isAdjustingProgress,
    progressBarRef,
    previewTime,
    currentTrack,
    toggleFullscreen,
  } = useAudioPlayer();

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const getAlbumName = (track) => {
    if (!track?.album) return t('common.unknownAlbum');
    if (typeof track.album === 'string') return track.album;
    return track.album.title || t('common.unknownAlbum');
  };

  const handleClose = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        await document.webkitExitFullscreen();
      } else if (document.msFullscreenElement) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.warn('Error exiting fullscreen:', error);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }

    setIsAudioInitialized(false);
    closeFullscreen();
  };

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        if (document.fullscreenEnabled) {
          await container.requestFullscreen();
        } else if (document.webkitFullscreenEnabled) {
          await container.webkitRequestFullscreen();
        } else if (document.msFullscreenEnabled) {
          await container.msRequestFullscreen();
        }
      } catch (error) {
        console.warn('Failed to enter fullscreen:', error);
      }
    };

    // Small delay to ensure component is mounted
    const timeoutId = setTimeout(() => {
      enterFullscreen();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );

      if (!isFullscreen) {
        handleClose();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    let cleanupFunction = () => {};

    const initializeAudio = async () => {
      try {
        // Create audio context only when needed
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        // Resume context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Create analyzer
        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
        }

        // Clean up any existing connections
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
          sourceNodeRef.current = null;
        }

        // Create new source node
        try {
          sourceNodeRef.current =
            audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceNodeRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
          setIsAudioInitialized(true);
        } catch (error) {
          console.warn(
            'Audio visualization disabled due to CORS restrictions:',
            error
          );
          setIsAudioInitialized(false);
          return;
        }

        cleanupFunction = () => {
          if (sourceNodeRef.current) {
            sourceNodeRef.current.disconnect();
          }
          if (analyserRef.current) {
            analyserRef.current.disconnect();
          }
        };
      } catch (error) {
        console.error('Error initializing audio:', error);
        setIsAudioInitialized(false);
      }
    };

    initializeAudio();

    return () => {
      cleanupFunction();
    };
  }, [audioRef.current, currentTrack]);

  useEffect(() => {
    if (!isAudioInitialized || !canvasRef.current || !analyserRef.current)
      return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(20, 20, 20)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, '#1DB954');
        gradient.addColorStop(1, '#1ed760');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAudioInitialized]);

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      handleVolumeUpdate(e);
    },
    [handleVolumeUpdate]
  );

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      handleVolumeEnd(e);
    },
    [handleVolumeEnd, handleMouseMove]
  );

  const initializeVolumeAdjust = useCallback(
    (e) => {
      e.preventDefault();
      handleVolumeStart(e);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleVolumeStart, handleMouseMove, handleMouseUp]
  );

  const handleProgressMove = useCallback(
    (e) => {
      if (!isAdjustingProgress) return;
      e.preventDefault();
      const progressBar = progressBarRef.current;
      if (!progressBar || !duration || !isFinite(duration)) return;

      const rect = progressBar.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const width = rect.width;
      if (width === 0) return;

      const percentage = ((x - rect.left) / width) * 100;
      const newTime = (duration * percentage) / 100;

      if (handleSeek && isFinite(newTime) && newTime >= 0) {
        handleSeek(newTime);
      }
    },
    [isAdjustingProgress, duration, handleSeek]
  );

  const handleProgressUp = useCallback(
    (e) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleProgressMove);
      document.removeEventListener('mouseup', handleProgressUp);
      if (handleSeekEnd) {
        handleSeekEnd();
      }
    },
    [handleSeekEnd, handleProgressMove]
  );

  const initializeProgressAdjust = useCallback(
    (e) => {
      e.preventDefault();
      const progressBar = progressBarRef.current;
      if (!progressBar || !duration || !isFinite(duration)) return;

      const rect = progressBar.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const width = rect.width;
      if (width === 0) return;

      const percentage = ((x - rect.left) / width) * 100;
      const newTime = (duration * percentage) / 100;

      if (!isFinite(newTime) || newTime < 0) return;

      if (handleSeekStart) {
        handleSeekStart();
      }
      if (handleSeek) {
        handleSeek(newTime);
      }
      document.addEventListener('mousemove', handleProgressMove);
      document.addEventListener('mouseup', handleProgressUp);
    },
    [
      handleSeekStart,
      handleSeek,
      handleProgressMove,
      handleProgressUp,
      duration,
    ]
  );

  const displayVolume = previewVolume !== null ? previewVolume : volume;
  const volumePercentage = Math.round(displayVolume * 100);
  const progressPercentage =
    ((previewTime !== null ? previewTime : currentTime) / duration) * 100;

  const renderVisualization = () => {
    if (!isAudioInitialized || !analyserRef.current) {
      return (
        <div className={styles.visualization}>
          <div className={styles.visualization__placeholder}>
            {t('player.visualizationUnavailable')}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.visualization}>
        <canvas ref={canvasRef} width="800" height="200" />
      </div>
    );
  };

  return (
    <div ref={containerRef} className={styles.fullscreen}>
      <button
        className={styles.close}
        onClick={handleClose}
        aria-label={t('player.exitFullscreen')}
        title={t('player.exitFullscreen')}
      >
        <IoClose />
      </button>
      <div
        className={styles.background}
        style={{
          backgroundImage: currentTrack?.coverUrl
            ? `url(${currentTrack.coverUrl})`
            : 'none',
        }}
      />
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.logo_icon}>
            <FaSpotify />
          </div>
          <span>{t('player.fullscreenTitle')}</span>
        </div>
        <div className={styles.artworkContainer}>
          <div className={styles.artwork}>
            {!imageError && currentTrack?.coverImage ? (
              <OptimizedImage
                src={currentTrack.coverImage}
                alt={t('common.coverArt', {
                  title: currentTrack?.title || t('common.unknownTitle'),
                })}
                className={styles.artwork__image}
                sizes="(max-width: 768px) 200px, 400px"
                loading="eager"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.artwork__fallback}>
                <CardFallbackIcon type="track" />
              </div>
            )}
          </div>

          <div className={styles.metadata}>
            <h1>{currentTrack?.title || t('common.unknownTitle')}</h1>
            <h2>{getArtistName(currentTrack)}</h2>
            <p className={styles.album}>
              {getAlbumName(currentTrack)} • {currentTrack?.releaseYear || ''}
            </p>
          </div>
        </div>

        {renderVisualization()}

        <div className={styles.controls}>
          <div className={styles.progressBar}>
            <span>
              {formatTime(previewTime !== null ? previewTime : currentTime)}
            </span>
            <div
              ref={progressBarRef}
              className={`${styles.progress} ${isAdjustingProgress ? styles.adjusting : ''}`}
              onClick={handleSeek}
              onMouseDown={initializeProgressAdjust}
              onKeyDown={handleVolumeKeyDown}
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progressPercentage}
              tabIndex="0"
              title={`${formatTime(previewTime !== null ? previewTime : currentTime)} of ${formatTime(duration)}`}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              >
                <div
                  className={`${styles.progressHandle} ${isAdjustingProgress ? styles.active : ''}`}
                  style={{
                    transform: `translate(${isAdjustingProgress ? '0' : '50%'}, -50%)`,
                  }}
                />
              </div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
          <div className={styles.allControls}>
            <div className={styles.leftControls}>
              <button className={styles.controlButton}>
                <IoMdAddCircleOutline />
              </button>
            </div>
            <div className={styles.mainControls}>
              <button
                className={`${styles.controlButton} ${shuffleOn ? styles.active : ''}`}
                onClick={toggleShuffle}
                aria-label={`Shuffle ${shuffleOn ? 'on' : 'off'}`}
                title={`Shuffle ${shuffleOn ? 'on' : 'off'}`}
              >
                <IoShuffle />
              </button>

              <button
                className={styles.controlButton}
                onClick={playPreviousTrack}
                aria-label="Previous track"
                title="Previous track"
              >
                <IoPlaySkipBack />
              </button>

              <button
                className={styles.playButton}
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <IoPauseCircle className={styles.playButton} />
                ) : (
                  <IoPlayCircle className={styles.playButton} />
                )}
              </button>

              <button
                className={styles.controlButton}
                onClick={playNextTrack}
                aria-label="Next track"
                title="Next track"
              >
                <IoPlaySkipForward />
              </button>

              <button
                className={`${styles.controlButton} ${repeatTrack || repeatPlaylist ? styles.active : ''}`}
                onClick={toggleRepeat}
                aria-label={t(
                  `player.repeatStates.${repeatTrack ? 'track' : repeatPlaylist ? 'playlist' : 'off'}`
                )}
                title={t(
                  `player.repeatStates.${repeatTrack ? 'track' : repeatPlaylist ? 'playlist' : 'off'}`
                )}
              >
                {repeatTrack ? <TbRepeatOnce /> : <TbRepeat />}
              </button>
            </div>

            <div className={styles.volumeControls}>
              <button
                className={styles.controlButton}
                onClick={toggleMute}
                aria-label={
                  volume === 0 ? t('player.unmute') : t('player.mute')
                }
                title={volume === 0 ? t('player.unmute') : t('player.mute')}
              >
                {getVolumeIcon()}
              </button>

              <div
                ref={volumeBarRef}
                className={`${styles.volumeBar} ${isAdjustingVolume ? styles.adjusting : ''}`}
                onClick={handleVolumeClick}
                onMouseDown={initializeVolumeAdjust}
                onKeyDown={handleVolumeKeyDown}
                role="slider"
                aria-label={t('player.volume')}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={volumePercentage}
                aria-valuetext={t('player.volumeText', {
                  volume: volumePercentage,
                  muted: volume === 0,
                })}
                tabIndex="0"
              >
                <div
                  className={styles.volumeBarProgress}
                  style={{ width: `${volumePercentage}%` }}
                >
                  <div
                    className={`${styles.volumeBarHandle} ${isAdjustingVolume ? styles.active : ''}`}
                  />
                </div>
              </div>

              <button
                className={styles.minimizeButton}
                onClick={handleClose}
                aria-label={t('player.minimizePlayer')}
                title={t('player.minimizePlayer')}
              >
                <LuMinimize2 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenView;
