import React from 'react';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}

export const Shelf: React.FC<Props> = ({ x, y, width, height, opacity = 1 }) => (
  <g opacity={opacity}>
    {/* Main shelf surface */}
    <rect x={x} y={y} width={width} height={6} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
    {/* Shelf lip/edge */}
    <rect x={x} y={y + 6} width={width} height={2} fill="#1e2e22" />
    {/* Support brackets */}
    <rect x={x + 10} y={y} width={4} height={height} fill="#2a3a2e" />
    <rect x={x + width - 14} y={y} width={4} height={height} fill="#2a3a2e" />
    {/* Cross support */}
    <line
      x1={x + 14}
      y1={y + height * 0.3}
      x2={x + width - 14}
      y2={y + height * 0.3}
      stroke="#1e2e22"
      strokeWidth={1}
      opacity={0.5}
    />
  </g>
);
