import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';

const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  UNSTABLE: 'unstable',
};

const useJamSocket = (sessionId, user) => {
  const [connectionState, setConnectionState] = useState(
    CONNECTION_STATES.DISCONNECTED
  );
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    if (!sessionId || !user) return;

    let mounted = true;
    setConnectionState(CONNECTION_STATES.CONNECTING);

    // Connect socket if not already connected
    if (!socketService.socket?.connected) {
      socketService.connect();
    }

    const handleConnect = () => {
      if (!mounted) return;
      setIsConnected(true);
      setConnectionState(CONNECTION_STATES.CONNECTED);

      // Add self to participants when connected
      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === user.id);
        if (!exists) {
          return [
            ...prev,
            { ...user, status: 'active', socketId: socketService.socket.id },
          ];
        }
        return prev;
      });

      // Join the jam session - ensure sessionId is properly formatted
      const formattedSessionId = sessionId.toUpperCase();

      socketService.socket?.emit('join-jam', {
        sessionId: formattedSessionId,
        user: {
          ...user,
          socketId: socketService.socket.id,
          status: 'active',
          joinedAt: Date.now(),
        },
      });
    };

    const handleDisconnect = () => {
      if (!mounted) return;
      setIsConnected(false);
      setConnectionState(CONNECTION_STATES.DISCONNECTED);

      // Update self status to inactive
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === user.id
            ? { ...p, status: 'inactive', leftAt: Date.now() }
            : p
        )
      );
    };

    const handleSyncPlaylist = (data) => {
      if (!mounted) return;

      if (data.queue) {
        setQueue(data.queue);
      }
      if (data.currentTrack) {
        setCurrentTrack(data.currentTrack);
      }
      if (data.elapsedTime) {
        setElapsedTime(data.elapsedTime);
      }
      // Update participants based on listeners
      if (data.listeners) {
        setParticipants((prev) => {
          const updated = [...prev];
          data.listeners.forEach((socketId) => {
            const participantIndex = updated.findIndex(
              (p) => p.socketId === socketId
            );
            if (participantIndex === -1) {
              updated.push({
                id: socketId,
                name: `User-${socketId.slice(0, 4)}`,
                status: 'active',
                socketId,
                joinedAt: Date.now(),
              });
            } else {
              updated[participantIndex].status = 'active';
            }
          });
          // Remove participants that are no longer in the listeners array
          return updated.filter(
            (p) => data.listeners.includes(p.socketId) || p.id === user.id
          );
        });
      }
    };

    const handleUpdatePlaylist = (updatedQueue) => {
      if (!mounted) return;
      setQueue(updatedQueue);
    };

    const handlePlayTrack = (data) => {
      if (!mounted) return;
      if (data.track) {
        setCurrentTrack(data.track);
      }
      if (data.startTime) {
        const elapsed = (Date.now() - data.startTime) / 1000;
        setElapsedTime(elapsed);
      }
    };

    const handlePauseTrack = () => {
      if (!mounted) return;
      // Handle pause state in your audio player
    };

    const handleSyncTime = (data) => {
      if (!mounted) return;
      if (data.elapsedTime) {
        setElapsedTime(data.elapsedTime);
      }
    };

    const handleError = (error) => {
      if (!mounted) return;
      console.error('Socket error:', error);
      // If there's a session error, reset connection state
      if (error.message?.includes('session')) {
        setConnectionState(CONNECTION_STATES.DISCONNECTED);
        setIsConnected(false);
      }
    };

    // Add event listeners
    socketService.socket?.on('connect', handleConnect);
    socketService.socket?.on('disconnect', handleDisconnect);
    socketService.socket?.on('sync-playlist', handleSyncPlaylist);
    socketService.socket?.on('update-playlist', handleUpdatePlaylist);
    socketService.socket?.on('play-track', handlePlayTrack);
    socketService.socket?.on('pause-track', handlePauseTrack);
    socketService.socket?.on('sync-time', handleSyncTime);
    socketService.socket?.on('error', handleError);

    // Set initial connection state and join if already connected
    if (socketService.socket?.connected) {
      handleConnect();
    }

    // Cleanup function
    return () => {
      mounted = false;

      // Remove event listeners
      socketService.socket?.off('connect', handleConnect);
      socketService.socket?.off('disconnect', handleDisconnect);
      socketService.socket?.off('sync-playlist', handleSyncPlaylist);
      socketService.socket?.off('update-playlist', handleUpdatePlaylist);
      socketService.socket?.off('play-track', handlePlayTrack);
      socketService.socket?.off('pause-track', handlePauseTrack);
      socketService.socket?.off('sync-time', handleSyncTime);
      socketService.socket?.off('error', handleError);
    };
  }, [sessionId, user]);

  const addTrack = useCallback(
    (track) => {
      if (!sessionId || !isConnected || !socketService.socket?.connected)
        return;

      socketService.socket.emit('add-track', {
        sessionId: sessionId.toUpperCase(),
        trackId: track._id,
      });
    },
    [sessionId, isConnected]
  );

  const controlTrack = useCallback(
    (action) => {
      if (!sessionId || !isConnected || !socketService.socket?.connected)
        return;

      socketService.socket.emit('control-track', {
        sessionId: sessionId.toUpperCase(),
        action: action.type.toLowerCase(),
      });
    },
    [sessionId, isConnected]
  );

  const updateTrackState = useCallback(
    (trackState) => {
      if (!sessionId || !isConnected || !socketService.socket?.connected)
        return;

      // Convert the track state update to a control action
      if (trackState.isPlaying) {
        controlTrack({ type: 'play' });
      } else {
        controlTrack({ type: 'pause' });
      }

      // Update local state
      if (trackState.track) {
        setCurrentTrack(trackState.track);
      }
      if (typeof trackState.currentTime === 'number') {
        setElapsedTime(trackState.currentTime);
      }
    },
    [sessionId, isConnected, controlTrack]
  );

  return {
    connectionState,
    queue,
    currentTrack,
    elapsedTime,
    isConnected,
    participants,
    addTrack,
    controlTrack,
    updateTrackState,
  };
};

export { useJamSocket as default, CONNECTION_STATES };
