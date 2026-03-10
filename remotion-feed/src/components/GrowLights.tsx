import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface Props {
  scrollOffset?: number;
}

export const GrowLights: React.FC<Props> = ({ scrollOffset = 0 }) => {
  const frame = useCurrentFrame();
  const flicker = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 0.85]);
  const spacing = 220;

  return (
    <g>
      {/* Grow light bars */}
      {[-1, 0, 1, 2, 3, 4].map((i) => {
        const x = (i * spacing + (scrollOffset % spacing) + spacing) % (spacing * 5) - spacing;
        return (
          <g key={i}>
            {/* LED bar */}
            <rect x={x} y={18} width={160} height={5} rx={2} fill="#bb44ee" opacity={flicker} />
            {/* Glow cone */}
            <polygon
              points={`${x + 20},23 ${x + 140},23 ${x + 180},120 ${x - 20},120`}
              fill="url(#growGlow)"
              opacity={0.08}
            />
            {/* Individual LEDs */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
              <circle
                key={j}
                cx={x + 15 + j * 20}
                cy={20}
                r={2}
                fill="#dd66ff"
                opacity={interpolate(
                  Math.sin(frame * 0.2 + j * 0.5 + i),
                  [-1, 1],
                  [0.4, 1]
                )}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};
