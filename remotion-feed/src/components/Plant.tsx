import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface Props {
  x: number;
  y: number;
  scale?: number;
  variant?: number;
}

export const Plant: React.FC<Props> = ({ x, y, scale = 1, variant = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.04 + variant * 2) * 2 * scale;

  const leafColors = ['#22662a', '#1e5c24', '#28773a', '#1a4d1a'];
  const baseColor = leafColors[variant % leafColors.length];

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Foliage base */}
      <ellipse cx={0} cy={0} rx={28} ry={14} fill="#1a4d1a" opacity={0.4} />

      {/* Leaves */}
      <g transform={`rotate(${sway})`}>
        <path
          d={`M-15,-5 Q-10,-25 -5,-15 Q0,-30 5,-18 Q10,-28 15,-5`}
          fill={baseColor}
          stroke="#2a7a32"
          strokeWidth={0.5}
        />
        <path
          d={`M-20,0 Q-18,-12 -8,-8`}
          fill={baseColor}
          stroke="#2a7a32"
          strokeWidth={0.3}
          opacity={0.8}
        />
        <path
          d={`M20,0 Q18,-12 8,-8`}
          fill={baseColor}
          stroke="#2a7a32"
          strokeWidth={0.3}
          opacity={0.8}
        />
      </g>

      {/* Strawberries */}
      <circle cx={-12} cy={-8} r={5} fill="#e63946" />
      <circle cx={-12} cy={-8} r={2} fill="#ff6b6b" opacity={0.5} />
      <circle cx={12} cy={-10} r={4.5} fill="#e63946" />
      <circle cx={12} cy={-10} r={1.8} fill="#ff6b6b" opacity={0.5} />
      <circle cx={2} cy={-2} r={4} fill="#cc2936" opacity={0.85} />

      {/* White flower (if variant is even) */}
      {variant % 2 === 0 && (
        <g transform={`translate(${8 + sway * 0.5}, ${-18})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx={0}
              cy={-3}
              rx={2.5}
              ry={4}
              fill="white"
              opacity={0.85}
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx={0} cy={0} r={2} fill="#ffdd44" />
        </g>
      )}
    </g>
  );
};
