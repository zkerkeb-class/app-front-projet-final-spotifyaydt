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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTracks, setCurrentTracks] = useState([]);
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
  const [activeCardId, setActiveCardId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [lastPlays, setLastPlays] = useState([]);
  const [playCounts, setPlayCounts] = useState({});

  const createShuffleQueue = useCallback(() => {
    const indices = Array.from({ length: currentTracks.length }, (_, i) => i);
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
  }, [currentTrackIndex, currentTracks.length]);

  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
    if (repeatTrack) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        setIsPlaying(true);
      }
    } else if (shuffleOn) {
      if (shuffleQueueIndex < shuffleQueue.length - 1) {
        setShuffleHistory([...shuffleHistory, currentTrackIndex]);
        setShuffleQueueIndex(shuffleQueueIndex + 1);
        setCurrentTrackIndex(shuffleQueue[shuffleQueueIndex + 1]);
        setIsPlaying(true);
      } else if (repeatPlaylist) {
        createShuffleQueue();
        setIsPlaying(true);
      }
    } else {
      if (currentTrackIndex < currentTracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setIsPlaying(true);
      } else if (repeatPlaylist) {
        setCurrentTrackIndex(0);
        setIsPlaying(true);
      }
    }
  }, [
    currentTrackIndex,
    shuffleOn,
    shuffleQueue,
    shuffleQueueIndex,
    shuffleHistory,
    repeatPlaylist,
    repeatTrack,
    currentTracks.length,
    createShuffleQueue,
  ]);

  const playNextTrack = useCallback(() => {
    if (!currentTracks.length) return;

    let nextIndex;
    let nextTrack;

    if (shuffleOn) {
      if (shuffleQueueIndex < shuffleQueue.length - 1) {
        nextIndex = shuffleQueue[shuffleQueueIndex + 1];
        setShuffleQueueIndex(shuffleQueueIndex + 1);
        setShuffleHistory([...shuffleHistory, currentTrackIndex]);
      } else if (repeatPlaylist) {
        createShuffleQueue();
        nextIndex = shuffleQueue[0];
        setShuffleQueueIndex(0);
      } else {
        return;
      }
    } else {
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= currentTracks.length) {
        if (repeatPlaylist) {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    nextTrack = currentTracks[nextIndex];
    setCurrentTrackIndex(nextIndex);
    setCurrentTrack(nextTrack);
    setActiveCardId(nextTrack.id);

    const audio = audioRef.current;
    if (audio) {
      audio.src = nextTrack.audio;
      audio.load();
      audio.play().catch((error) => {
        console.error('Playback failed:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [
    currentTrackIndex,
    currentTracks,
    shuffleOn,
    shuffleQueue,
    shuffleQueueIndex,
    shuffleHistory,
    repeatPlaylist,
    createShuffleQueue,
  ]);

  const playPreviousTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTracks.length) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error('Playback failed:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
      return;
    }

    let prevIndex;
    let prevTrack;

    if (shuffleOn) {
      if (shuffleHistory.length > 0) {
        prevIndex = shuffleHistory[shuffleHistory.length - 1];
        setShuffleHistory(shuffleHistory.slice(0, -1));
        setShuffleQueueIndex(shuffleQueueIndex - 1);
      } else if (repeatPlaylist) {
        createShuffleQueue();
        prevIndex = shuffleQueue[shuffleQueue.length - 1];
        setShuffleQueueIndex(shuffleQueue.length - 1);
      } else {
        return;
      }
    } else {
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) {
        if (repeatPlaylist) {
          prevIndex = currentTracks.length - 1;
        } else {
          return;
        }
      }
    }

    prevTrack = currentTracks[prevIndex];
    setCurrentTrackIndex(prevIndex);
    setCurrentTrack(prevTrack);
    setActiveCardId(prevTrack.id);

    audio.src = prevTrack.audio;
    audio.load();
    audio.play().catch((error) => {
      console.error('Playback failed:', error);
      setIsPlaying(false);
    });
    setIsPlaying(true);
  }, [
    currentTrackIndex,
    currentTracks,
    shuffleOn,
    shuffleHistory,
    shuffleQueueIndex,
    repeatPlaylist,
    createShuffleQueue,
    shuffleQueue,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTracks.length === 0) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentTrackIndex, currentTracks, isPlaying]);

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
      audio.removeEventListener('loadedmetadata', () =>
        setDuration(audio.duration)
      );
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
    if (!audio || currentTracks.length === 0) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Resume from current position
      audio.play().catch((error) => {
        console.error('Playback failed:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [isPlaying, currentTracks.length]);

  const handlePlay = useCallback(({ track, tracks, action = 'play' }) => {
    if (!track || !tracks.length) return;

    const trackIndex = tracks.findIndex((t) => t.id === track.id);
    if (trackIndex === -1) return;

    setCurrentTracks(tracks);
    setCurrentTrackIndex(trackIndex);
    setCurrentTrack(track);
    setActiveCardId(track.id);

    if (action === 'play') {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.audio;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    setLastPlays((prev) => {
      const updatedPlays = [track, ...prev.filter((t) => t.id !== track.id)];
      return updatedPlays.slice(0, 20); // Keep only the last 20 plays
    });

    setPlayCounts((prevCounts) => {
      const newCount = (prevCounts[track.id] || 0) + 1;
      return { ...prevCounts, [track.id]: newCount };
    });
  }, []);

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

  const handleSeekStart = useCallback(() => {
    setIsDragging(true);
    if (isPlaying) {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const handleSeek = useCallback(
    (newTime) => {
      if (!isFinite(newTime) || newTime < 0) return;

      if (isDragging) {
        setPreviewTime(newTime);
      } else {
        if (audioRef.current) {
          try {
            audioRef.current.currentTime = Math.min(
              newTime,
              audioRef.current.duration || 0
            );
          } catch (error) {
            console.error('Error setting currentTime:', error);
          }
        }
        setCurrentTime(newTime);
      }
    },
    [isDragging]
  );

  const handleSeekEnd = useCallback(() => {
    setIsDragging(false);
    if (
      audioRef.current &&
      previewTime !== null &&
      isFinite(previewTime) &&
      previewTime >= 0
    ) {
      try {
        audioRef.current.currentTime = Math.min(
          previewTime,
          audioRef.current.duration || 0
        );
        setCurrentTime(previewTime);
      } catch (error) {
        console.error('Error setting currentTime:', error);
      }
      setPreviewTime(null);
    }
    if (isPlaying) {
      audioRef.current?.play().catch((error) => {
        console.error('Playback failed:', error);
        setIsPlaying(false);
      });
    }
  }, [isPlaying, previewTime]);

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

  const mostListenedTo = Object.entries(playCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([id]) => lastPlays.find((track) => track.id === id))
    .filter(Boolean);

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
        currentTracks,
        playNextTrack,
        playPreviousTrack,
        isFullscreen,
        toggleFullscreen,
        closeFullscreen,
        handlePlay,
        activeCardId,
        currentTrack,
        setCurrentTrack,
        lastPlays,
        mostListenedTo,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;
