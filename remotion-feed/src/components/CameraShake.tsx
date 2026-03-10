import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';

interface Props {
  intensity: number;
  children: React.ReactNode;
}

export const CameraShake: React.FC<Props> = ({ intensity, children }) => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame * 0.37) * intensity + Math.sin(frame * 0.83) * intensity * 0.5;
  const y = Math.cos(frame * 0.29) * intensity + Math.cos(frame * 0.67) * intensity * 0.5;

  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
