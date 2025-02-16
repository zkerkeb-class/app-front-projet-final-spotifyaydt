import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';

import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from 'react-icons/lu';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const { t } = useTranslation();
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
  const [displayJam, setDisplayJam] = useState(false);
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
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState({
    name: t('audioPlayer.devices.browser'),
    type: 'desktop',
    id: 'current',
    isActive: true,
  });

  const [availableDevices, setAvailableDevices] = useState([
    {
      name: window.navigator.userAgent.includes('Windows')
        ? 'DESKTOP-' + Math.random().toString(36).substr(2, 6).toUpperCase()
        : t('audioPlayer.devices.thisDevice') +
          '-' +
          Math.random().toString(36).substr(2, 6).toUpperCase(),
      type: 'desktop',
      id: 'device1',
      isActive: false,
    },
  ]);

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
    const audio = audioRef.current;
    if (!audio) return;

    if (repeatTrack) {
      // For single track repeat
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error('Failed to replay track:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else if (shuffleOn) {
      // For shuffle mode
      if (shuffleQueueIndex < shuffleQueue.length - 1) {
        setShuffleHistory([...shuffleHistory, currentTrackIndex]);
        setShuffleQueueIndex(shuffleQueueIndex + 1);
        const nextIndex = shuffleQueue[shuffleQueueIndex + 1];
        setCurrentTrackIndex(nextIndex);
        const nextTrack = currentTracks[nextIndex];
        setCurrentTrack(nextTrack);
        setActiveCardId(nextTrack._id);
        audio.src = nextTrack.audioUrl;
        audio.load();
        audio.play().catch((error) => {
          console.error('Failed to play next shuffled track:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else if (repeatPlaylist) {
        createShuffleQueue();
        const nextIndex = shuffleQueue[0];
        setCurrentTrackIndex(nextIndex);
        const nextTrack = currentTracks[nextIndex];
        setCurrentTrack(nextTrack);
        setActiveCardId(nextTrack._id);
        audio.src = nextTrack.audioUrl;
        audio.load();
        audio.play().catch((error) => {
          console.error(
            'Failed to play first track in shuffled playlist:',
            error
          );
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      // For normal sequential playback
      if (currentTrackIndex < currentTracks.length - 1) {
        const nextIndex = currentTrackIndex + 1;
        setCurrentTrackIndex(nextIndex);
        const nextTrack = currentTracks[nextIndex];
        setCurrentTrack(nextTrack);
        setActiveCardId(nextTrack._id);
        audio.src = nextTrack.audioUrl;
        audio.load();
        audio.play().catch((error) => {
          console.error('Failed to play next track:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else if (repeatPlaylist) {
        setCurrentTrackIndex(0);
        const nextTrack = currentTracks[0];
        setCurrentTrack(nextTrack);
        setActiveCardId(nextTrack._id);
        audio.src = nextTrack.audioUrl;
        audio.load();
        audio.play().catch((error) => {
          console.error('Failed to play first track in playlist:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  }, [
    currentTrackIndex,
    currentTracks,
    shuffleOn,
    shuffleQueue,
    shuffleQueueIndex,
    shuffleHistory,
    repeatPlaylist,
    repeatTrack,
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
    setActiveCardId(nextTrack._id);

    const audio = audioRef.current;
    if (audio) {
      audio.src = nextTrack.audioUrl;
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
    setActiveCardId(prevTrack._id);

    audio.src = prevTrack.audioUrl;
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
    const handleTimeUpdate = () => {
      if (audio && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', () => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', () => {
        if (audio && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      });
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

  const handlePlay = useCallback(
    ({ track, tracks, action = 'play' }) => {
      if (!track || !tracks.length) return;

      const trackIndex = tracks.findIndex((t) => t._id === track._id);
      if (trackIndex === -1) return;

      setCurrentTracks(tracks);
      setCurrentTrackIndex(trackIndex);
      setCurrentTrack(track);
      setActiveCardId(track._id);

      if (action === 'play') {
        setIsPlaying(true);
        if (!isRightSidebarVisible) {
          setDisplayPlay(true);
          setDisplayQueue(false);
          setDisplayDevices(false);
          setIsRightSidebarVisible(true);
        }
        if (audioRef.current) {
          audioRef.current.src = track.audioUrl;
          audioRef.current.play();
        }
      } else {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }

      setLastPlays((prev) => {
        const updatedPlays = [
          track,
          ...prev.filter((t) => t._id !== track._id),
        ];
        return updatedPlays.slice(0, 20); // Keep only the last 20 plays
      });

      setPlayCounts((prevCounts) => {
        const newCount = (prevCounts[track._id] || 0) + 1;
        return { ...prevCounts, [track._id]: newCount };
      });
    },
    [isRightSidebarVisible]
  );

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

  const updateTime = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.currentTime)) {
      setCurrentTime(audio.currentTime);
    }
  }, []);

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
      setDisplayJam(false);
      setIsRightSidebarVisible(true);
    } else {
      setIsRightSidebarVisible(false);
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
      setDisplayJam(false);
      setIsRightSidebarVisible(true);
    } else {
      setDisplayPlay(true);
    }
    setDisplayQueue(!displayQueue);
  };

  const toggleDevices = () => {
    if (!displayDevices) {
      setDisplayPlay(false);
      setDisplayQueue(false);
      setDisplayJam(false);
      setIsRightSidebarVisible(true);
    } else {
      setDisplayPlay(true);
    }
    setDisplayDevices(!displayDevices);
  };

  const toggleJam = () => {
    if (!displayJam) {
      setDisplayPlay(false);
      setDisplayQueue(false);
      setDisplayDevices(false);
      setIsRightSidebarVisible(true);
    } else {
      setDisplayPlay(true);
    }
    setDisplayJam(!displayJam);
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

  const closeSidebar = () => {
    setDisplayPlay(false);
    setDisplayQueue(false);
    setDisplayDevices(false);
    setDisplayJam(false);
    setIsRightSidebarVisible(false);
  };

  const mostListenedTo = Object.entries(playCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([id]) => lastPlays.find((track) => track._id === id))
    .filter(Boolean);

  // Effect to handle sidebar visibility based on display states
  useEffect(() => {
    if (displayPlay || displayQueue || displayDevices) {
      setIsRightSidebarVisible(true);
    }
  }, [displayPlay, displayQueue, displayDevices]);

  // Add this useEffect to detect the current device
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      let deviceType = 'desktop';
      let deviceName = t('audioPlayer.devices.browser');
      let browserInfo = '';

      // Detect browser
      if (userAgent.includes('edg/')) {
        browserInfo = `(Microsoft Edge)`;
      } else if (userAgent.includes('chrome/')) {
        browserInfo = `(Google Chrome)`;
      } else if (userAgent.includes('firefox/')) {
        browserInfo = `(Firefox)`;
      } else if (
        userAgent.includes('safari/') &&
        !userAgent.includes('chrome/')
      ) {
        browserInfo = `(Safari)`;
      } else if (userAgent.includes('opr/') || userAgent.includes('opera/')) {
        browserInfo = `(Opera)`;
      }

      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        deviceType = 'tablet';
        deviceName = t('audioPlayer.devices.tablet');
      } else if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          userAgent
        )
      ) {
        deviceType = 'mobile';
        deviceName = t('audioPlayer.devices.mobile');
      } else if (window.navigator.userAgent.includes('Windows')) {
        deviceName =
          'DESKTOP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      }

      setCurrentDevice({
        name: deviceName,
        type: deviceType,
        id: 'current',
        isActive: true,
        browserInfo: browserInfo,
      });
    };

    detectDevice();
  }, [t]);

  // Add function to handle device selection
  const selectDevice = useCallback((deviceId) => {
    setAvailableDevices((prev) =>
      prev.map((device) => ({
        ...device,
        isActive: device.id === deviceId,
      }))
    );

    if (deviceId === 'current') {
      setCurrentDevice((prev) => ({ ...prev, isActive: true }));
    } else {
      setCurrentDevice((prev) => ({ ...prev, isActive: false }));
    }
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
        setDisplayPlay,
        toggleDisplayPlay,
        displayLyrics,
        toggleLyrics,
        displayQueue,
        setDisplayQueue,
        toggleQueue,
        displayDevices,
        toggleDevices,
        displayJam,
        toggleJam,
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
        isRightSidebarVisible,
        setIsRightSidebarVisible,
        closeSidebar,
        currentDevice,
        availableDevices,
        selectDevice,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;
