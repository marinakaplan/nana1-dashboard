import React from 'react';
import ReactDOM from 'react-dom/client';
import { Player } from '@remotion/player';
import { OperationComp } from './OperationComps';

// Use hash for scene routing (query params get stripped by static servers)
const scene = window.location.hash.slice(1) || 'crop-monitor';

const App: React.FC = () => {
  return (
    <Player
      component={OperationComp}
      inputProps={{ scene }}
      compositionWidth={400}
      compositionHeight={220}
      durationInFrames={300}
      fps={30}
      loop
      autoPlay
      style={{ width: '100%', height: '100%' }}
      controls={false}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
