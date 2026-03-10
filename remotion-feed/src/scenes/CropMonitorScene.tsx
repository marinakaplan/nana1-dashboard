import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Plant } from '../components/Plant';
import { GrowLights } from '../components/GrowLights';
import { Floor } from '../components/Floor';
import { Particles } from '../components/Particles';

export const CropMonitorScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Looping scan line sweeps left to right over 300 frames
  const scanX = interpolate(frame % 300, [0, 280, 300], [-20, 420, 420], {
    extrapolateRight: 'clamp',
  });

  // Camera slowly pans right along the row
  const scroll = interpolate(frame % 300, [0, 300], [0, 80], {
    extrapolateRight: 'clamp',
  });

  // Plant data for detection boxes
  const plants = [
    { x: 60, y: 72, health: 97, status: 'healthy' as const },
    { x: 140, y: 70, health: 94, status: 'healthy' as const },
    { x: 220, y: 74, health: 100, status: 'healthy' as const },
    { x: 300, y: 71, health: 82, status: 'warning' as const },
    { x: 370, y: 73, health: 96, status: 'healthy' as const },
  ];

  // Counter for plants analyzed
  const plantCount = Math.floor(
    interpolate(frame % 300, [0, 260], [832, 862], { extrapolateRight: 'clamp' })
  );

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={400} height={220} viewBox="0 0 400 220">
        <defs>
          <linearGradient id="cmBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="40%" stopColor="#0d1f10" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="cmScanGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity={0} />
            <stop offset="40%" stopColor="#00d4ff" stopOpacity={0.15} />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity={0.4} />
            <stop offset="60%" stopColor="#00d4ff" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect width={400} height={220} fill="url(#cmBg)" />

        {/* Ceiling */}
        <rect x={0} y={0} width={400} height={8} fill="#111a14" opacity={0.9} />

        {/* Grow lights (scaled for small card) */}
        <g transform={`translate(${-scroll * 0.5}, 0)`}>
          {[0, 1, 2].map((i) => {
            const lx = i * 160 - 20;
            const flicker = interpolate(
              Math.sin(frame * 0.15 + i),
              [-1, 1],
              [0.5, 0.8]
            );
            return (
              <g key={i}>
                <rect x={lx} y={9} width={80} height={3} rx={1} fill="#bb44ee" opacity={flicker} />
                <polygon
                  points={`${lx + 10},12 ${lx + 70},12 ${lx + 85},55 ${lx - 5},55`}
                  fill="url(#growGlow)"
                  opacity={0.06}
                />
              </g>
            );
          })}
        </g>

        {/* Shelf structure */}
        <g transform={`translate(${-scroll}, 0)`}>
          <rect x={20} y={60} width={420} height={3} rx={1} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.3} />
          {[30, 110, 190, 270, 350, 420].map((sx) => (
            <rect key={sx} x={sx} y={60} width={2} height={110} fill="#2a3a2e" opacity={0.4} />
          ))}

          {/* Plants on shelf */}
          {plants.map((p, i) => (
            <Plant key={i} x={p.x} y={p.y} scale={0.5} variant={i} />
          ))}

          {/* Detection boxes appear as scan line passes */}
          {plants.map((p, i) => {
            const boxAppear = scanX - (-scroll) > p.x - 15;
            if (!boxAppear) return null;

            const boxOpacity = interpolate(
              scanX - (-scroll) - (p.x - 15),
              [0, 30],
              [0, 0.8],
              { extrapolateRight: 'clamp' }
            );

            const boxColor = p.status === 'healthy' ? '#10b981' : '#f59e0b';

            return (
              <g key={`box-${i}`} opacity={boxOpacity}>
                {/* Detection rectangle */}
                <rect
                  x={p.x - 22}
                  y={p.y - 28}
                  width={44}
                  height={40}
                  fill="none"
                  stroke={boxColor}
                  strokeWidth={1}
                  strokeDasharray={p.status === 'warning' ? '3 2' : 'none'}
                  rx={2}
                />
                {/* Corner brackets */}
                {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], ci) => (
                  <path
                    key={ci}
                    d={`M${p.x - 22 + (dx > 0 ? 38 : 0) + dx * 0},${p.y - 28 + (dy > 0 ? 34 : 0) + dy * 6} L${p.x - 22 + (dx > 0 ? 44 : 0)},${p.y - 28 + (dy > 0 ? 40 : 0)} L${p.x - 22 + (dx > 0 ? 38 : 6)},${p.y - 28 + (dy > 0 ? 40 : 0)}`}
                    fill="none"
                    stroke={boxColor}
                    strokeWidth={1.5}
                  />
                ))}
                {/* Health percentage label */}
                <rect
                  x={p.x + 24}
                  y={p.y - 24}
                  width={30}
                  height={12}
                  rx={1}
                  fill="rgba(0,0,0,0.6)"
                  stroke={`${boxColor}66`}
                  strokeWidth={0.5}
                />
                <text
                  x={p.x + 39}
                  y={p.y - 15}
                  fill={boxColor}
                  fontSize={7}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.health}%
                </text>
              </g>
            );
          })}
        </g>

        {/* Horizontal scan line (vertical band sweeping left to right) */}
        <rect
          x={scanX - 10}
          y={20}
          width={20}
          height={160}
          fill="url(#cmScanGrad)"
          opacity={frame % 300 < 280 ? 0.7 : 0}
        />

        {/* Floor */}
        <rect x={0} y={155} width={400} height={65} fill="#080e0a" opacity={0.6} />
        <line x1={0} y1={155} x2={400} y2={155} stroke="#1a2e1d" strokeWidth={0.5} opacity={0.3} />

        {/* Ambient particles */}
        <Particles count={5} type="dust" />

        {/* Bottom status bar */}
        <rect x={0} y={196} width={400} height={24} fill="rgba(0,0,0,0.7)" />
        <line x1={0} y1={196} x2={400} y2={196} stroke="#00d4ff" strokeWidth={0.5} opacity={0.2} />

        {/* Left label */}
        <text x={10} y={211} fill="#00d4ff" fontSize={8} fontFamily="monospace" opacity={0.7}>
          SCANNING
        </text>

        {/* Separator dots */}
        <text x={70} y={211} fill="#00d4ff" fontSize={8} fontFamily="monospace" opacity={0.3}>
          //
        </text>

        {/* Plant count */}
        <text x={85} y={211} fill="#00d4ff" fontSize={8} fontFamily="monospace" opacity={0.7}>
          {plantCount} PLANTS ANALYZED
        </text>

        {/* Progress bar on the right */}
        <rect x={280} y={203} width={100} height={4} rx={2} fill="rgba(0,212,255,0.1)" />
        <rect
          x={280}
          y={203}
          width={interpolate(frame % 300, [0, 280], [0, 100], { extrapolateRight: 'clamp' })}
          height={4}
          rx={2}
          fill="#00d4ff"
          opacity={0.5}
        />

        {/* Pulsing dot next to SCANNING */}
        <circle
          cx={62}
          cy={208}
          r={2}
          fill="#00d4ff"
          opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.3, 1])}
        />
      </svg>
    </AbsoluteFill>
  );
};
