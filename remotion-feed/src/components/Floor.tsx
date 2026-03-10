import React from 'react';

interface Props {
  scrollOffset?: number;
  yStart?: number;
}

export const Floor: React.FC<Props> = ({ scrollOffset = 0, yStart = 280 }) => {
  const lineSpacing = 40;

  return (
    <g>
      {/* Floor base */}
      <rect x={0} y={yStart} width={800} height={380 - yStart} fill="#080e0a" opacity={0.7} />
      <line x1={0} y1={yStart} x2={800} y2={yStart} stroke="#1a2e1d" strokeWidth={0.5} opacity={0.3} />

      {/* Perspective floor lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const rawY = yStart + 10 + i * lineSpacing + (scrollOffset % lineSpacing);
        if (rawY > 380 || rawY < yStart) return null;
        const alpha = 1 - (rawY - yStart) / (380 - yStart);
        return (
          <line
            key={i}
            x1={100 * (1 - alpha)}
            y1={rawY}
            x2={800 - 100 * (1 - alpha)}
            y2={rawY}
            stroke="#1a2e1d"
            strokeWidth={0.5}
            opacity={alpha * 0.3}
          />
        );
      })}

      {/* Center guide line */}
      <line
        x1={400}
        y1={yStart}
        x2={400}
        y2={380}
        stroke="#00d4ff"
        strokeWidth={1}
        strokeDasharray="8 6"
        opacity={0.1}
      />

      {/* Side guide lines */}
      <line x1={150} y1={yStart} x2={50} y2={380} stroke="#00d4ff" strokeWidth={0.5} strokeDasharray="4 8" opacity={0.06} />
      <line x1={650} y1={yStart} x2={750} y2={380} stroke="#00d4ff" strokeWidth={0.5} strokeDasharray="4 8" opacity={0.06} />
    </g>
  );
};
