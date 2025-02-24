import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJam } from '../contexts/JamContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const JamRoute = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { joinJamSession } = useJam();
  const { toggleJam } = useAudioPlayer();

  useEffect(() => {
    if (sessionId) {
      joinJamSession(sessionId);
      toggleJam(true);
      navigate('/'); // Redirect to home after joining
    }
  }, [sessionId, joinJamSession, toggleJam, navigate]);

  return null; // This component doesn't render anything
};

export default JamRoute;
