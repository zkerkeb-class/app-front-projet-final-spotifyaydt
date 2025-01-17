import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';

import { LuVolume, LuVolume1, LuVolume2 } from 'react-icons/lu';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const getVolumeIcon = () => {
    if (volume <= 0) return <LuVolume />;
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

  return (
    <AudioPlayerContext.Provider
      value={{
        audioRef,
        isPlaying,
        togglePlayPause,
        volume,
        handleVolume,
        toggleMute,
        getVolumeIcon,
        previousVolume,
        updateTime,
        currentTime,
        duration,
        handleSeek,
        formatTime,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
