import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from 'react-icons/lu';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const seekTimeoutRef = useRef(null);
  const volumeTimeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewTime, setPreviewTime] = useState(null);
  const [previewVolume, setPreviewVolume] = useState(null);
  const [duration, setDuration] = useState(0);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatTrack, setRepeatTrack] = useState(false);
  const [repeatPlaylist, setRepeatPlaylist] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [displayPlay, setDisplayPlay] = useState(false);
  const [displayLyrics, setDisplayLyrics] = useState(false);
  const [displayQueue, setDisplayQueue] = useState(false);
  const [displayDevices, setDisplayDevices] = useState(false);
  const [displayMini, setDisplayMini] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleVolumeChange = () => setVolume(audio.volume);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [volume]);

  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
    if (repeatTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current.currentTime = 0;
            setIsPlaying(true);
          })
          .catch((error) => console.error('Playback failed:', error));
      }
    }
  }, [repeatTrack]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = isPlaying ? audio.pause() : audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => console.error('Playback failed:', error));
    }
  }, [isPlaying]);

  const togglePrevious = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime -= 10;
  };

  const toggleNext = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime += 10;
  };

  const getVolumeIcon = useCallback(() => {
    const currentVolume = previewVolume !== null ? previewVolume : volume;
    if (currentVolume === 0) return <LuVolumeX />;
    if (currentVolume <= 0.25) return <LuVolume />;
    if (currentVolume <= 0.5) return <LuVolume1 />;
    return <LuVolume2 />;
  }, [volume, previewVolume]);

  const calculateVolume = useCallback((e, element) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return Math.round((x / rect.width) * 100) / 100; // Round to 2 decimal places
  }, []);

  const handleVolumeClick = useCallback(
    (e) => {
      if (!volumeBarRef.current || !audioRef.current) return;

      const newVolume = calculateVolume(e, volumeBarRef.current);
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
    },
    [calculateVolume]
  );

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (volume > 0) {
      setLastVolume(volume);
      setPreviousVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
      setPreviewVolume(0);
    } else {
      const newVolume = lastVolume || 0.5;
      setVolume(newVolume);
      setPreviousVolume(newVolume);
      audioRef.current.volume = newVolume;
      setPreviewVolume(newVolume);
    }
  }, [volume, lastVolume]);

  const handleVolumeKeyDown = useCallback(
    (e) => {
      if (!audioRef.current) return;

      let newVolume = volume;
      const step = 0.05; // 5% volume change

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault();
          newVolume = Math.min(1, volume + step);
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault();
          newVolume = Math.max(0, volume - step);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (e.ctrlKey) {
            toggleMute();
            return;
          }
          break;
        default:
          return;
      }

      setVolume(newVolume);
      audioRef.current.volume = newVolume;
    },
    [volume, toggleMute]
  );

  const handleVolumeStart = useCallback((e) => {
    e.preventDefault();
    setIsAdjustingVolume(true);
    handleVolumeUpdate(e);
  }, []);

  const handleVolumeUpdate = useCallback(
    (e) => {
      if (!volumeBarRef.current || !audioRef.current) return;

      const newVolume = calculateVolume(e, volumeBarRef.current);
      setPreviewVolume(newVolume);

      // Clear existing timeout
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }

      // Set new timeout for actual volume change
      volumeTimeoutRef.current = setTimeout(() => {
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
      }, 16); // Approximately 60fps
    },
    [calculateVolume]
  );

  const handleVolumeEnd = useCallback(
    (e) => {
      e.preventDefault();
      if (!volumeBarRef.current || !audioRef.current) return;

      const newVolume = calculateVolume(e, volumeBarRef.current);
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
      setPreviewVolume(null);
      setIsAdjustingVolume(false);
    },
    [calculateVolume]
  );

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const calculateSeekTime = useCallback(
    (e, element) => {
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      return (x / rect.width) * duration;
    },
    [duration]
  );

  const handleSeekStart = useCallback(
    (e) => {
      if (!audioRef.current) return;
      setIsDragging(true);
      setWasPlaying(isPlaying);
      if (isPlaying) {
        audioRef.current.pause();
      }
      handleSeekUpdate(e);
    },
    [isPlaying]
  );

  const handleSeekUpdate = useCallback(
    (e) => {
      if (!progressBarRef.current) return;
      const newTime = calculateSeekTime(e, progressBarRef.current);
      setPreviewTime(newTime);

      // Clear existing timeout
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }

      // Set new timeout for actual seek
      seekTimeoutRef.current = setTimeout(() => {
        if (isDragging) {
          setCurrentTime(newTime);
        }
      }, 16); // Approximately 60fps
    },
    [calculateSeekTime, isDragging]
  );

  const handleSeekEnd = useCallback(
    (e) => {
      if (!audioRef.current || !progressBarRef.current) return;

      const newTime = calculateSeekTime(e, progressBarRef.current);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPreviewTime(null);
      setIsDragging(false);

      if (wasPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) =>
            console.error('Playback failed:', error)
          );
        }
        setIsPlaying(true);
      }
    },
    [calculateSeekTime, wasPlaying]
  );

  const handleSeek = useCallback(
    (e) => {
      if (!audioRef.current || !progressBarRef.current) return;

      const newTime = calculateSeekTime(e, progressBarRef.current);
      const wasPlayingBeforeSeek = !audioRef.current.paused;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPreviewTime(null);

      if (wasPlayingBeforeSeek) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) =>
            console.error('Playback failed:', error)
          );
        }
      }
    },
    [calculateSeekTime]
  );

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleShuffle = () => {
    setShuffleOn(!shuffleOn);
  };

  const toggleRepeat = () => {
    setClickCount((prevCount) => (prevCount + 1) % 3);

    if (clickCount === 0) {
      setRepeatTrack(false);
      setRepeatPlaylist(true);
    } else if (clickCount === 1) {
      setRepeatTrack(true);
      setRepeatPlaylist(false);
    } else {
      setRepeatTrack(false);
      setRepeatPlaylist(false);
    }
  };

  const toggleDisplayPlay = () => {
    setDisplayPlay(!displayPlay);
  };

  const toggleLyrics = () => {
    setDisplayLyrics(!displayLyrics);
  };

  const toggleQueue = () => {
    setDisplayQueue(!displayQueue);
  };

  const toggleDevices = () => {
    setDisplayDevices(!displayDevices);
  };

  const toggleMini = () => {
    setDisplayMini(!displayMini);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        audioRef,
        progressBarRef,
        isPlaying,
        togglePlayPause,
        updateTime,
        currentTime,
        previewTime,
        duration,
        handleSeek,
        handleSeekStart,
        handleSeekUpdate,
        handleSeekEnd,
        isDragging,
        isBuffering,
        formatTime,
        volume,
        handleVolumeStart,
        handleVolumeUpdate,
        handleVolumeEnd,
        handleVolumeClick,
        handleVolumeKeyDown,
        toggleMute,
        getVolumeIcon,
        previousVolume,
        shuffleOn,
        toggleShuffle,
        repeatTrack,
        repeatPlaylist,
        toggleRepeat,
        displayPlay,
        toggleDisplayPlay,
        displayLyrics,
        toggleLyrics,
        displayQueue,
        toggleQueue,
        displayDevices,
        toggleDevices,
        displayMini,
        toggleMini,
        volumeBarRef,
        isAdjustingVolume,
        previewVolume,
        volumeTimeoutRef,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
