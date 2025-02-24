import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  'https://back-end-projet-final-spotifyaydt.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    console.log('Attempting to connect to socket server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      path: '/socket.io', // Make sure this matches your backend configuration
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Socket successfully connected with ID:', this.socket.id);
      this.socket.emit('client_ready', { timestamp: Date.now() });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        description: error.description,
        type: error.type,
        url: SOCKET_URL,
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected. Reason:', reason);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Attempting to reconnect:', attemptNumber);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect after all attempts');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Debug: Log all incoming events
    this.socket.onAny((event, ...args) => {
      console.log('Socket event received:', {
        event,
        args,
        timestamp: new Date().toISOString(),
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Jam Session Events
  joinSession(sessionId, userData) {
    if (!this.socket) {
      console.error('No socket connection available');
      return;
    }
    console.log('Emitting join_session:', { sessionId, userData });
    this.socket.emit('join_session', { sessionId, userData }, (response) => {
      console.log('Join session response received:', response);
      if (response.success) {
        // Emit a local session_joined event with the server response
        this.socket.emit('session_joined', {
          session: response.session,
          currentUser: userData,
          participants: response.participants,
        });
      } else {
        console.error('Failed to join session:', response.error);
      }
    });
  }

  leaveSession(sessionId, userData) {
    if (!this.socket) {
      console.error('No socket connection available');
      return;
    }
    console.log('Emitting leave_session:', { sessionId, userData });
    this.socket.emit('leave_session', { sessionId, userData }, (response) => {
      // Add acknowledgment callback
      console.log('Leave session acknowledgment received:', response);
    });
  }

  // Track state synchronization
  updateTrackState(sessionId, trackState) {
    if (!this.socket) {
      console.error('No socket connection available');
      return;
    }
    const payload = {
      sessionId,
      ...trackState,
      timestamp: Date.now(),
    };
    console.log('Emitting track_state_update:', payload);
    this.socket.emit('track_state_update', payload);

    // Debug: Listen for acknowledgment
    this.socket.once('track_state_update_ack', (response) => {
      console.log('Track state update acknowledged:', response);
    });
  }

  // Event Listeners
  onSessionJoined(callback) {
    this.addListener('session_joined', (data) => {
      console.log('Session joined event received:', {
        session: data.session,
        currentUser: data.currentUser,
        participantsCount: data.participants?.length,
        timestamp: new Date().toISOString(),
        socketId: this.socket?.id,
      });
      callback(data);
    });
  }

  onSessionLeft(callback) {
    this.addListener('session_left', (data) => {
      console.log('Session left event received:', data);
      callback(data);
    });
  }

  onParticipantJoined(callback) {
    this.addListener('participant_joined', (data) => {
      console.log('Participant joined event received:', {
        eventData: data,
        timestamp: new Date().toISOString(),
        socketId: this.socket?.id,
      });
      if (!data || !data.participant) {
        console.error('Invalid participant data received:', data);
        return;
      }
      callback(data);
    });
  }

  onParticipantLeft(callback) {
    this.addListener('participant_left', (data) => {
      console.log('Participant left event received:', {
        eventData: data,
        timestamp: new Date().toISOString(),
        socketId: this.socket?.id,
      });
      callback(data);
    });
  }

  onTrackStateUpdated(callback) {
    this.addListener('track_state_update', (data) => {
      console.log('Track state update event received:', data);
      callback(data);
    });
  }

  // Helper methods
  addListener(event, callback) {
    if (!this.socket) {
      console.error('Cannot add listener - no socket connection');
      return;
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
      this.socket.on(event, (...args) => {
        console.log(`Handling ${event} event:`, args);
        const callbacks = this.listeners.get(event);
        callbacks.forEach((cb) => {
          try {
            cb(...args);
          } catch (error) {
            console.error(`Error in ${event} listener:`, error);
          }
        });
      });
    }

    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (!this.socket || !this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    callbacks.delete(callback);

    if (callbacks.size === 0) {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }
}

export const socketService = new SocketService();
