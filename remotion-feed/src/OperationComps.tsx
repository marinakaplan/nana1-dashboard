import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CropMonitorScene } from './scenes/CropMonitorScene';
import { PruningScene } from './scenes/PruningScene';
import { EnvironmentScene } from './scenes/EnvironmentScene';
import { LidarNavScene } from './scenes/LidarNavScene';
import { YieldAnalyticsScene } from './scenes/YieldAnalyticsScene';
import { PestDetectionScene } from './scenes/PestDetectionScene';

const scenes: Record<string, React.FC> = {
  'crop-monitor': CropMonitorScene,
  'pruning': PruningScene,
  'environment': EnvironmentScene,
  'lidar-nav': LidarNavScene,
  'yield-analytics': YieldAnalyticsScene,
  'pest-detection': PestDetectionScene,
};

export const OperationComp: React.FC<{ scene: string }> = ({ scene }) => {
  const Scene = scenes[scene] || CropMonitorScene;
  return (
    <AbsoluteFill style={{ background: '#0a0e14' }}>
      <Scene />
    </AbsoluteFill>
  );
};

export const getSceneNames = () => Object.keys(scenes);
