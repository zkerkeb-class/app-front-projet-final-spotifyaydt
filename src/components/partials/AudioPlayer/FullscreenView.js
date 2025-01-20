import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import styles from './FullscreenView.module.scss';
import { mockTracks } from '../../../constant/mockData';
import { IoShuffle } from 'react-icons/io5';
import { IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';
import { VscChromeMinimize } from 'react-icons/vsc';

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
    handleSeekUpdate,
    handleSeekEnd,
    isAdjustingProgress,
    progressBarRef,
    previewTime,
  } = useAudioPlayer();

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const currentTrack = mockTracks[currentTrackIndex];

  // Handle true fullscreen mode
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const enterFullscreen = async () => {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    };

    enterFullscreen();

    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
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

  // Initialize audio context
  useEffect(() => {
    if (!audioRef.current || !canvasRef.current || isAudioInitialized) return;

    const initializeAudio = async () => {
      try {
        // Resume audio context if it's suspended
        if (
          audioContextRef.current &&
          audioContextRef.current.state === 'suspended'
        ) {
          await audioContextRef.current.resume();
        }

        // Create new audio context if it doesn't exist
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        // Create analyzer if it doesn't exist
        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
        }

        // Create and connect source node if it doesn't exist
        if (!sourceNodeRef.current) {
          sourceNodeRef.current =
            audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceNodeRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }

        setIsAudioInitialized(true);
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initializeAudio();
  }, [audioRef, isAudioInitialized]);

  // Handle visualization
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

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      await document.webkitExitFullscreen();
    } else if (document.msFullscreenElement) {
      await document.msExitFullscreen();
    }

    // Stop the visualization but keep the audio playing
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Disconnect visualization nodes but keep the audio connection
    if (analyserRef.current) {
      sourceNodeRef.current?.disconnect(analyserRef.current);
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    // Reconnect the source directly to the destination if it exists
    if (sourceNodeRef.current && audioContextRef.current) {
      sourceNodeRef.current.connect(audioContextRef.current.destination);
    }

    setIsAudioInitialized(false);
    closeFullscreen();
  };

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

  const handleProgressMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      handleSeekUpdate(e);
    },
    [handleSeekUpdate]
  );

  const handleProgressMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleProgressMouseMove);
      document.removeEventListener('mouseup', handleProgressMouseUp);
      handleSeekEnd(e);
    },
    [handleSeekEnd, handleProgressMouseMove]
  );

  const initializeProgressAdjust = useCallback(
    (e) => {
      e.preventDefault();
      handleSeekStart(e);
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
    },
    [handleSeekStart, handleProgressMouseMove, handleProgressMouseUp]
  );

  const displayVolume = previewVolume !== null ? previewVolume : volume;
  const volumePercentage = Math.round(displayVolume * 100);
  const progressPercentage =
    ((previewTime !== null ? previewTime : currentTime) / duration) * 100;

  return (
    <div ref={containerRef} className={styles.fullscreen}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
      />

      <div className={styles.content}>
        <div className={styles.artwork}>
          <picture>
            <source srcSet={currentTrack.coverUrl} type="image/webp" />
            <source srcSet={currentTrack.coverUrl} type="image/jpeg" />
            <img
              src={currentTrack.coverUrl}
              alt={`${currentTrack.title} artwork`}
            />
          </picture>
        </div>

        <div className={styles.metadata}>
          <h1>{currentTrack.title}</h1>
          <h2>{currentTrack.artist}</h2>
          <p className={styles.album}>
            {currentTrack.album} • {currentTrack.releaseYear}
          </p>
        </div>

        <div className={styles.visualization}>
          <canvas ref={canvasRef} width="800" height="200" />
        </div>

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

          <div className={styles.mainControls}>
            <button
              className={`${styles.controlButton} ${shuffleOn ? styles.active : ''}`}
              onClick={toggleShuffle}
              aria-label={`Shuffle ${shuffleOn ? 'on' : 'off'}`}
            >
              <IoShuffle />
            </button>

            <button
              className={styles.controlButton}
              onClick={playPreviousTrack}
              aria-label="Previous track"
            >
              <IoPlaySkipBack />
            </button>

            <button
              className={styles.playButton}
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>

            <button
              className={styles.controlButton}
              onClick={playNextTrack}
              aria-label="Next track"
            >
              <IoPlaySkipForward />
            </button>

            <button
              className={`${styles.controlButton} ${repeatTrack || repeatPlaylist ? styles.active : ''}`}
              onClick={toggleRepeat}
              aria-label={`Repeat ${repeatTrack ? 'track' : repeatPlaylist ? 'playlist' : 'off'}`}
            >
              {repeatTrack ? <TbRepeatOnce /> : <TbRepeat />}
            </button>
          </div>

          <div className={styles.volumeControls}>
            <button
              className={styles.controlButton}
              onClick={toggleMute}
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
            </button>

            <div
              ref={volumeBarRef}
              className={`${styles.volumeBar} ${isAdjustingVolume ? styles.adjusting : ''}`}
              onClick={handleVolumeClick}
              onMouseDown={initializeVolumeAdjust}
              onKeyDown={handleVolumeKeyDown}
              role="slider"
              aria-label="Volume"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={volumePercentage}
              aria-valuetext={`Volume ${volumePercentage}%${volume === 0 ? ' (muted)' : ''}`}
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
              aria-label="Exit fullscreen"
            >
              <VscChromeMinimize />
            </button>
          </div>
        </div>

        <div className={styles.additionalInfo}>
          {currentTrack.explicit && (
            <span className={styles.explicit}>Explicit</span>
          )}
          <span className={styles.genre}>{currentTrack.genre}</span>
          <span className={styles.plays}>
            {currentTrack.plays.toLocaleString()} plays
          </span>
        </div>
      </div>
    </div>
  );
};

export default FullscreenView;
