import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from 'react-icons/lu';
import { mockTracks } from '../constant/mockData';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const seekTimeoutRef = useRef(null);
  const volumeTimeoutRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
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
  const [shuffleQueue, setShuffleQueue] = useState([]);
  const [shuffleQueueIndex, setShuffleQueueIndex] = useState(0);
  const [shuffleHistory, setShuffleHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const createShuffleQueue = useCallback(() => {
    const indices = Array.from({ length: mockTracks.length }, (_, i) => i);
    const currentIndex = indices.indexOf(currentTrackIndex);
    if (currentIndex > -1) {
      indices.splice(currentIndex, 1);
    }
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.unshift(currentTrackIndex);
    setShuffleQueue(indices);
    setShuffleQueueIndex(0);
    setShuffleHistory([]);
  }, [currentTrackIndex]);

  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);

    if (repeatTrack) {
      // Single track repeat - just restart the current track
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current.currentTime = 0;
            setIsPlaying(true);
          })
          .catch((error) => console.error('Playback failed:', error));
      }
    } else if (shuffleOn) {
      // Shuffle is on
      if (shuffleQueueIndex >= shuffleQueue.length - 1) {
        // Reached end of shuffle queue
        if (repeatPlaylist) {
          // Create new shuffle queue and continue playing
          createShuffleQueue();
          setCurrentTrackIndex(shuffleQueue[0]);
          setIsPlaying(true);
        }
        // If repeat playlist is off, playback stops (current state)
      } else {
        // Continue with next track in shuffle queue
        setShuffleQueueIndex((prev) => prev + 1);
        setCurrentTrackIndex(shuffleQueue[shuffleQueueIndex + 1]);
        setIsPlaying(true);
      }
    } else {
      // Normal sequential play
      const nextIndex = (currentTrackIndex + 1) % mockTracks.length;
      if (nextIndex === 0 && !repeatPlaylist) {
        // Reached end of playlist and repeat is off
        return; // Stop playback
      }
      // Either repeat is on or we're not at the end yet
      setCurrentTrackIndex(nextIndex);
      setIsPlaying(true);
    }
  }, [
    repeatTrack,
    shuffleOn,
    shuffleQueue,
    shuffleQueueIndex,
    repeatPlaylist,
    currentTrackIndex,
    createShuffleQueue,
  ]);

  const playNextTrack = useCallback(() => {
    // If repeat track is on, switch to repeat playlist
    if (repeatTrack) {
      setRepeatTrack(false);
      setRepeatPlaylist(true);
      setClickCount(1); // Set to repeat playlist state
    }

    if (shuffleOn) {
      if (shuffleQueueIndex >= shuffleQueue.length - 1) {
        if (repeatPlaylist) {
          // Add current track to history before creating new queue
          setShuffleHistory((prev) => [...prev, currentTrackIndex]);
          createShuffleQueue();
          setCurrentTrackIndex(shuffleQueue[0]);
          setIsPlaying(true);
        } else {
          return;
        }
      } else {
        // Add current track to history before moving to next
        setShuffleHistory((prev) => [...prev, currentTrackIndex]);
        setShuffleQueueIndex((prev) => prev + 1);
        setCurrentTrackIndex(shuffleQueue[shuffleQueueIndex + 1]);
        setIsPlaying(true);
      }
    } else {
      // Normal sequential play logic remains the same
      if (currentTrackIndex === mockTracks.length - 1) {
        if (repeatPlaylist) {
          setCurrentTrackIndex(0);
          setIsPlaying(true);
        } else {
          return;
        }
      } else {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setIsPlaying(true);
      }
    }
  }, [
    currentTrackIndex,
    shuffleOn,
    shuffleQueue,
    shuffleQueueIndex,
    repeatPlaylist,
    createShuffleQueue,
    repeatTrack,
  ]);

  const playPreviousTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If repeat track is on, switch to repeat playlist
    if (repeatTrack) {
      setRepeatTrack(false);
      setRepeatPlaylist(true);
      setClickCount(1); // Set to repeat playlist state
    }

    if (shuffleOn) {
      if (audio.currentTime <= 3) {
        // Within first 3 seconds, try to go to previous track
        if (shuffleHistory.length > 0) {
          // Get the last track from history
          const previousTrack = shuffleHistory[shuffleHistory.length - 1];
          // Remove it from history
          setShuffleHistory((prev) => prev.slice(0, -1));
          // Play it
          setCurrentTrackIndex(previousTrack);
          setIsPlaying(true);
        } else {
          // If no history, restart current track
          audio.currentTime = 0;
          setIsPlaying(true);
        }
      } else {
        // After 3 seconds, restart current track
        audio.currentTime = 0;
        setIsPlaying(true);
      }
    } else {
      // Normal sequential play
      if (audio.currentTime <= 3) {
        if (currentTrackIndex === 0) {
          if (repeatPlaylist) {
            // Go to last track
            setCurrentTrackIndex(mockTracks.length - 1);
            setIsPlaying(true);
          } else {
            // At first track and no repeat - restart current track
            audio.currentTime = 0;
            setIsPlaying(true);
          }
        } else {
          // Not at first track, go to previous
          setCurrentTrackIndex(currentTrackIndex - 1);
          setIsPlaying(true);
        }
      } else {
        // After 3 seconds, restart current track
        audio.currentTime = 0;
        setIsPlaying(true);
      }
    }
  }, [
    currentTrackIndex,
    shuffleOn,
    shuffleHistory,
    repeatPlaylist,
    repeatTrack,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = mockTracks[currentTrackIndex].audio;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => console.error('Playback failed:', error));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
  }, [volume, handleAudioEnd]);

  useEffect(() => {
    if (shuffleOn) {
      createShuffleQueue();
    }
  }, [shuffleOn, createShuffleQueue]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = isPlaying ? audio.pause() : audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => console.error('Playback failed:', error));
    }
  }, [isPlaying]);

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
    return Math.round((x / rect.width) * 100) / 100;
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
      const step = 0.05;

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

      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }

      volumeTimeoutRef.current = setTimeout(() => {
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
      }, 16);
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

      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }

      seekTimeoutRef.current = setTimeout(() => {
        if (isDragging) {
          setCurrentTime(newTime);
        }
      }, 16);
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

  const toggleShuffle = useCallback(() => {
    setShuffleOn((prev) => !prev);
  }, []);

  const toggleRepeat = () => {
    setClickCount((prevCount) => (prevCount + 1) % 3);

    switch (clickCount) {
      case 0:
        setRepeatTrack(false);
        setRepeatPlaylist(true);
        break;
      case 1:
        setRepeatTrack(true);
        setRepeatPlaylist(false);
        break;
      case 2:
        setRepeatTrack(false);
        setRepeatPlaylist(false);
        break;
      default:
        setRepeatTrack(false);
        setRepeatPlaylist(false);
    }
  };

  const toggleDisplayPlay = () => {
    if (!displayPlay) {
      setDisplayQueue(false);
      setDisplayDevices(false);
    }
    setDisplayPlay(!displayPlay);
  };

  const toggleLyrics = () => {
    setDisplayLyrics(!displayLyrics);
  };

  const toggleQueue = () => {
    if (!displayQueue) {
      setDisplayPlay(false);
      setDisplayDevices(false);
    }
    setDisplayQueue(!displayQueue);
  };

  const toggleDevices = () => {
    if (!displayDevices) {
      setDisplayPlay(false);
      setDisplayQueue(false);
    }
    setDisplayDevices(!displayDevices);
  };

  const toggleMini = () => {
    setDisplayMini(!displayMini);
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

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
        currentTrackIndex,
        playNextTrack,
        playPreviousTrack,
        isFullscreen,
        toggleFullscreen,
        closeFullscreen,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
