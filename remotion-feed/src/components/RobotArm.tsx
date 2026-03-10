import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface Props {
  extension: number; // 0 = retracted, 1 = fully extended
  side?: 'left' | 'right';
}

export const RobotArm: React.FC<Props> = ({ extension, side = 'left' }) => {
  const frame = useCurrentFrame();
  const wobble = Math.sin(frame * 0.3) * 1.5 * extension;

  const startX = side === 'left' ? -40 : 840;
  const startY = 420;
  const midX = side === 'left'
    ? interpolate(extension, [0, 1], [60, 280])
    : interpolate(extension, [0, 1], [740, 520]);
  const midY = interpolate(extension, [0, 1], [360, 240]) + wobble;
  const endX = side === 'left'
    ? interpolate(extension, [0, 1], [100, 380])
    : interpolate(extension, [0, 1], [700, 420]);
  const endY = interpolate(extension, [0, 1], [340, 180]) + wobble;

  if (extension < 0.01) return null;

  return (
    <g opacity={interpolate(extension, [0, 0.05, 1], [0, 0.7, 0.7])}>
      {/* Upper arm */}
      <line
        x1={startX}
        y1={startY}
        x2={midX}
        y2={midY}
        stroke="#5b8fd4"
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* Forearm */}
      <line
        x1={midX}
        y1={midY}
        x2={endX}
        y2={endY}
        stroke="#8899aa"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Joint */}
      <circle cx={midX} cy={midY} r={6} fill="#4a7ec3" stroke="#3a6eb3" strokeWidth={1} />
      {/* End effector */}
      <circle cx={endX} cy={endY} r={8} fill="#5b8fd4" stroke="#4a7ec3" strokeWidth={1.5} />
      {/* LED ring */}
      <circle
        cx={endX}
        cy={endY}
        r={12}
        fill="none"
        stroke="#00d4ff"
        strokeWidth={1}
        opacity={interpolate(Math.sin(frame * 0.4), [-1, 1], [0.3, 0.8])}
      />
      {/* Tool tip glow */}
      <circle
        cx={endX}
        cy={endY}
        r={3}
        fill="#00d4ff"
        opacity={interpolate(Math.sin(frame * 0.5), [-1, 1], [0.4, 1])}
      />
    </g>
  );
};
