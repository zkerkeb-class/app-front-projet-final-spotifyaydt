import React, { createContext, useContext, useState, useCallback } from 'react';
import { useJam } from './JamContext';
import { useAudioPlayer } from './AudioPlayerContext';

const QueueContext = createContext();

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

export const QueueProvider = ({ children }) => {
  const { isHost } = useJam();
  const { currentTrack, handlePlay } = useAudioPlayer();
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  // Add a track to the queue
  const addToQueue = useCallback((track) => {
    setQueue((prev) => [
      ...prev,
      { ...track, addedAt: new Date().toISOString() },
    ]);
  }, []);

  // Add multiple tracks to the queue
  const addTracksToQueue = useCallback((tracks) => {
    const tracksWithTimestamp = tracks.map((track) => ({
      ...track,
      addedAt: new Date().toISOString(),
    }));
    setQueue((prev) => [...prev, ...tracksWithTimestamp]);
  }, []);

  // Remove a track from the queue
  const removeFromQueue = useCallback((trackId) => {
    setQueue((prev) => prev.filter((track) => track.id !== trackId));
  }, []);

  // Move a track in the queue (reordering)
  const moveTrack = useCallback((fromIndex, toIndex) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      const [movedTrack] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedTrack);
      return newQueue;
    });
  }, []);

  // Clear the entire queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Play next track in queue
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    const nextTrack = queue[0];
    const newQueue = queue.slice(1);

    if (currentTrack) {
      setHistory((prev) => [...prev, currentTrack]);
    }

    handlePlay({
      track: nextTrack,
      tracks: [nextTrack, ...newQueue],
      action: 'play',
    });

    setQueue(newQueue);
  }, [queue, currentTrack, handlePlay]);

  // Play previous track from history
  const playPrevious = useCallback(() => {
    if (history.length === 0) return;

    const previousTrack = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    if (currentTrack) {
      setQueue((prev) => [currentTrack, ...prev]);
    }

    handlePlay({
      track: previousTrack,
      tracks: [previousTrack, ...queue],
      action: 'play',
    });

    setHistory(newHistory);
  }, [history, currentTrack, queue, handlePlay]);

  // Skip to a specific track in the queue
  const skipToTrack = useCallback(
    (trackId) => {
      const trackIndex = queue.findIndex((track) => track.id === trackId);
      if (trackIndex === -1) return;

      const tracksToPlay = queue.slice(trackIndex);
      const tracksForHistory = queue.slice(0, trackIndex);

      if (currentTrack) {
        setHistory((prev) => [...prev, currentTrack, ...tracksForHistory]);
      } else {
        setHistory((prev) => [...prev, ...tracksForHistory]);
      }

      handlePlay({
        track: tracksToPlay[0],
        tracks: tracksToPlay,
        action: 'play',
      });

      setQueue(tracksToPlay.slice(1));
    },
    [queue, currentTrack, handlePlay]
  );

  return (
    <QueueContext.Provider
      value={{
        queue,
        history,
        addToQueue,
        addTracksToQueue,
        removeFromQueue,
        moveTrack,
        clearQueue,
        playNext,
        playPrevious,
        skipToTrack,
        isHost,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};
