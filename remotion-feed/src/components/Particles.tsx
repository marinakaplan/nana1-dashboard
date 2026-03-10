import React from 'react';
import { useCurrentFrame } from 'remotion';

interface Props {
  count?: number;
  type?: 'pollen' | 'dust';
}

// Seeded pseudo-random
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const Particles: React.FC<Props> = ({ count = 20, type = 'pollen' }) => {
  const frame = useCurrentFrame();

  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const baseX = seededRandom(i * 7.1) * 800;
        const baseY = seededRandom(i * 3.3 + 50) * 300 + 30;
        const speed = seededRandom(i * 1.7 + 100) * 0.3 + 0.1;
        const size = seededRandom(i * 2.1 + 200) * 1.5 + 0.5;
        const phase = seededRandom(i * 5.5 + 300) * Math.PI * 2;

        const x = baseX + Math.sin(frame * speed * 0.08 + phase) * 15;
        const y = baseY + Math.cos(frame * speed * 0.05 + phase) * 10 - frame * speed * 0.3;
        const wrappedY = ((y % 350) + 380) % 380;
        const opacity = seededRandom(i * 4.4 + 400) * 0.3 + 0.1;

        const color = type === 'pollen' ? '#ffee88' : '#aabbcc';

        return (
          <circle key={i} cx={x} cy={wrappedY} r={size} fill={color} opacity={opacity} />
        );
      })}
    </g>
  );
};
