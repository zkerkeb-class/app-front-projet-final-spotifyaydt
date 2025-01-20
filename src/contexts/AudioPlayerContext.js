import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';

import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from 'react-icons/lu';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
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

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

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

  const getVolumeIcon = () => {
    if (volume === 0) return <LuVolumeX />;
    if (volume <= 0.25) return <LuVolume />;
    if (volume <= 0.5) return <LuVolume1 />;
    return <LuVolume2 />;
  };

  const handleVolume = (e) => {
    const volumeBar = e.target;
    const newVolume = e.nativeEvent.offsetX / volumeBar.offsetWidth;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    } else {
      setVolume(previousVolume);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume;
      }
    }
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const progressBar = e.target;
    const newTime =
      (e.nativeEvent.offsetX / progressBar.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

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
        isPlaying,
        togglePlayPause,
        updateTime,
        currentTime,
        duration,
        handleSeek,
        formatTime,
        volume,
        handleVolume,
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
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
