import React from 'react';
import ReactDOM from 'react-dom/client';
import { Player } from '@remotion/player';
import { LiveFeed } from './LiveFeed';

const App: React.FC = () => {
  return (
    <Player
      component={LiveFeed}
      compositionWidth={800}
      compositionHeight={380}
      durationInFrames={1200}
      fps={30}
      loop
      autoPlay
      style={{ width: '100%', height: '100%' }}
      controls={false}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
