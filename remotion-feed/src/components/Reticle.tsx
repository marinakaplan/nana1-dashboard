import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface Props {
  x: number;
  y: number;
  size: number;
  locked?: boolean;
  label?: string;
}

export const Reticle: React.FC<Props> = ({ x, y, size, locked = false, label }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.8, 1.2]);
  const rotation = locked ? 0 : frame * 0.5;
  const color = locked ? '#10b981' : '#00d4ff';

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer ring */}
      <circle
        cx={0}
        cy={0}
        r={size * pulse}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.6}
        strokeDasharray={locked ? 'none' : '8 4'}
        transform={`rotate(${rotation})`}
      />
      {/* Inner ring */}
      <circle
        cx={0}
        cy={0}
        r={size * 0.5}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        opacity={0.4}
      />
      {/* Crosshairs */}
      <line x1={0} y1={-size - 5} x2={0} y2={-size + 5} stroke={color} strokeWidth={1} opacity={0.6} />
      <line x1={0} y1={size - 5} x2={0} y2={size + 5} stroke={color} strokeWidth={1} opacity={0.6} />
      <line x1={-size - 5} y1={0} x2={-size + 5} y2={0} stroke={color} strokeWidth={1} opacity={0.6} />
      <line x1={size - 5} y1={0} x2={size + 5} y2={0} stroke={color} strokeWidth={1} opacity={0.6} />
      {/* Corner brackets */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], i) => (
        <path
          key={i}
          d={`M${dx * size * 0.7},${dy * size * 0.9} L${dx * size * 0.9},${dy * size * 0.9} L${dx * size * 0.9},${dy * size * 0.7}`}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.8}
        />
      ))}
      {/* Center dot */}
      <circle cx={0} cy={0} r={2} fill={color} opacity={locked ? 1 : 0.6}>
        {!locked && (
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Label */}
      {label && (
        <g transform={`translate(${size + 10}, -8)`}>
          <rect x={0} y={-2} width={label.length * 7 + 12} height={16} rx={2} fill="rgba(0,212,255,0.12)" stroke={`${color}55`} strokeWidth={0.5} />
          <text x={6} y={10} fill={color} fontSize={9} fontFamily="monospace">{label}</text>
        </g>
      )}
    </g>
  );
};
