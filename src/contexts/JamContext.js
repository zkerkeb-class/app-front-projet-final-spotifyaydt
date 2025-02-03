import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const JamContext = createContext();

export const useJam = () => {
  const context = useContext(JamContext);
  if (!context) {
    throw new Error('useJam must be used within a JamProvider');
  }
  return context;
};

export const JamProvider = ({ children }) => {
  const [jamSession, setJamSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);

  // Create a new jam session
  const createJamSession = useCallback(() => {
    const sessionId = uuidv4();
    const newSession = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      hostId: uuidv4(), // This would be the user's ID in a real app
    };
    setJamSession(newSession);
    setIsHost(true);

    // Add host as first participant
    const hostParticipant = {
      id: newSession.hostId,
      name: 'You',
      isHost: true,
      avatar: null,
      joinedAt: new Date().toISOString(),
      status: 'active',
    };
    setParticipants([hostParticipant]);
  }, []);

  // Join an existing jam session
  const joinJamSession = useCallback((sessionId, userName) => {
    const participantId = uuidv4();
    const newParticipant = {
      id: participantId,
      name: userName,
      isHost: false,
      avatar: null,
      joinedAt: new Date().toISOString(),
      status: 'active',
    };
    setParticipants((prev) => [...prev, newParticipant]);
  }, []);

  // Leave the jam session
  const leaveJamSession = useCallback(
    (participantId) => {
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
      if (jamSession?.hostId === participantId) {
        setJamSession(null);
        setIsHost(false);
        setParticipants([]);
      }
    },
    [jamSession]
  );

  // Update participant status
  const updateParticipantStatus = useCallback((participantId, status) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, status } : p))
    );
  }, []);

  // Remove a participant (host only)
  const removeParticipant = useCallback(
    (participantId) => {
      if (!isHost) return;
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    },
    [isHost]
  );

  return (
    <JamContext.Provider
      value={{
        jamSession,
        participants,
        isHost,
        createJamSession,
        joinJamSession,
        leaveJamSession,
        updateParticipantStatus,
        removeParticipant,
      }}
    >
      {children}
    </JamContext.Provider>
  );
};
