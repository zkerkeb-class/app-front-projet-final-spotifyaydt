import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useAudioPlayer } from './AudioPlayerContext';
import useJamSocket from '../hooks/useJamSocket';
import { v4 as uuidv4 } from 'uuid';

const JamContext = createContext();

export const useJam = () => {
  const context = useContext(JamContext);
  if (!context) {
    throw new Error('useJam must be used within a JamProvider');
  }
  return context;
};

const generateWindowUser = () => {
  // Generate a unique window ID that persists for this window only
  const windowId = window.windowId || uuidv4();
  window.windowId = windowId;

  return {
    id: windowId,
    name: `User-${windowId.slice(0, 4)}`,
    createdAt: Date.now(),
  };
};

export const JamProvider = ({ children }) => {
  const [jamSession, setJamSession] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [user] = useState(generateWindowUser);

  const {
    queue,
    currentTrack: jamTrack,
    elapsedTime,
    isConnected,
    connectionState,
    participants,
    addTrack,
    controlTrack,
    updateTrackState,
  } = useJamSocket(jamSession?.id, user);

  const {
    currentTrack: playerTrack,
    isPlaying,
    handlePlay,
    audioRef,
  } = useAudioPlayer();

  // Create a new jam session
  const createJamSession = useCallback(() => {
    const sessionId = uuidv4();
    setJamSession({ id: sessionId, hostId: user.id });
    setIsHost(true);
  }, [user.id]);

  // Join an existing jam session
  const joinJamSession = useCallback((sessionId) => {
    setJamSession({ id: sessionId });
    setIsHost(false);
  }, []);

  // Leave the current session
  const leaveJamSession = useCallback(() => {
    if (!jamSession) return;
    setJamSession(null);
    setIsHost(false);
  }, [jamSession]);

  // Sync track state when host changes track or playback state
  useEffect(() => {
    if (isHost && jamSession && playerTrack && audioRef.current) {
      updateTrackState({
        track: playerTrack,
        currentTime: audioRef.current.currentTime,
        isPlaying,
        timestamp: Date.now(),
      });
    }
  }, [isHost, jamSession, playerTrack, isPlaying, updateTrackState]);

  // Handle track state updates from the host
  useEffect(() => {
    if (!isHost && jamTrack) {
      handlePlay({
        track: jamTrack,
        tracks: [jamTrack],
        action: 'play',
        startTime: elapsedTime,
      });
    }
  }, [isHost, jamTrack, elapsedTime, handlePlay]);

  const value = {
    jamSession,
    participants,
    isHost,
    isConnected,
    connectionState,
    queue,
    currentTrack: playerTrack,
    elapsedTime,
    user,
    createJamSession,
    joinJamSession,
    leaveJamSession,
    addTrack,
    controlTrack,
  };

  return <JamContext.Provider value={value}>{children}</JamContext.Provider>;
};

export default JamContext;
