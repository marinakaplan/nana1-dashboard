import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { AisleScene } from './scenes/AisleScene';
import { ApproachScene } from './scenes/ApproachScene';
import { PollinateScene } from './scenes/PollinateScene';
import { NavigateScene } from './scenes/NavigateScene';
import { ScanScene } from './scenes/ScanScene';
import { Vignette } from './components/Vignette';
import { CameraShake } from './components/CameraShake';

export const LiveFeed: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0a0e14' }}>
      <CameraShake intensity={1.2}>
        {/* Scene 1: Moving through aisle (0-240) */}
        <Sequence from={0} durationInFrames={240}>
          <AisleScene />
        </Sequence>

        {/* Scene 2: Approaching shelf (240-420) */}
        <Sequence from={240} durationInFrames={180}>
          <ApproachScene />
        </Sequence>

        {/* Scene 3: Pollination (420-660) */}
        <Sequence from={420} durationInFrames={240}>
          <PollinateScene />
        </Sequence>

        {/* Scene 4: Navigate between zones (660-870) */}
        <Sequence from={660} durationInFrames={210}>
          <NavigateScene />
        </Sequence>

        {/* Scene 5: Disease detection & resume (870-1200) */}
        <Sequence from={870} durationInFrames={330}>
          <ScanScene />
        </Sequence>
      </CameraShake>

      <Vignette />
    </AbsoluteFill>
  );
};
