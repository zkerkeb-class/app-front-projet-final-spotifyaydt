import React from 'react';
import AudioPlayer from './AudioPlayer';
import { AudioPlayerProvider } from '../../../contexts/AudioPlayerContext';

const App = () => {
  return (
    <AudioPlayerProvider>
      <AudioPlayer />
    </AudioPlayerProvider>
  );
};

export default App;
