import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Plant } from '../components/Plant';
import { Particles } from '../components/Particles';

export const PestDetectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loopFrame = frame % 300;

  // Thermal scan sweep left to right
  const scanX = interpolate(loopFrame, [0, 200, 220], [-30, 430, 430], {
    extrapolateRight: 'clamp',
  });

  // Camera slow pan
  const scroll = interpolate(loopFrame, [0, 300], [0, 40], {
    extrapolateRight: 'clamp',
  });

  // Detection happens after scan passes diseased plant
  const detected = loopFrame > 100;
  const alertOpacity = interpolate(loopFrame, [100, 120, 270, 295], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alertPulse = detected
    ? interpolate(Math.sin(frame * 0.25), [-1, 1], [0.6, 1])
    : 0;

  // Zoom into infected area
  const zoomScale = interpolate(loopFrame, [100, 150, 250, 290], [1, 1.15, 1.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Plants data
  const plants = [
    { x: 55, y: 72, healthy: true },
    { x: 125, y: 70, healthy: true },
    { x: 200, y: 74, healthy: false }, // INFECTED
    { x: 275, y: 71, healthy: true },
    { x: 345, y: 73, healthy: true },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={400} height={220} viewBox="0 0 400 220">
        <defs>
          <linearGradient id="pdBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="40%" stopColor="#0d1f10" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="thermalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0} />
            <stop offset="30%" stopColor="#ef4444" stopOpacity={0.06} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.12} />
            <stop offset="70%" stopColor="#ef4444" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pdGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect width={400} height={220} fill="url(#pdBg)" />

        <g transform={`translate(${200 - 200 * zoomScale}, ${95 - 95 * zoomScale}) scale(${zoomScale})`}>
          {/* Ceiling */}
          <rect x={0} y={0} width={400} height={8} fill="#111a14" opacity={0.9} />

          {/* Grow lights */}
          <g transform={`translate(${-scroll * 0.3}, 0)`}>
            {[0, 1, 2].map((i) => {
              const lx = i * 150 - 10;
              const flicker = interpolate(
                Math.sin(frame * 0.15 + i),
                [-1, 1],
                [0.4, 0.7]
              );
              return (
                <g key={i}>
                  <rect x={lx} y={9} width={70} height={3} rx={1} fill="#bb44ee" opacity={flicker} />
                  <polygon
                    points={`${lx + 8},12 ${lx + 62},12 ${lx + 74},50 ${lx - 4},50`}
                    fill="url(#pdGlow)"
                    opacity={0.05}
                  />
                </g>
              );
            })}
          </g>

          {/* Shelf */}
          <g transform={`translate(${-scroll}, 0)`}>
            <rect x={10} y={60} width={400} height={3} rx={1} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.3} />
            {[20, 90, 160, 230, 310, 380].map((sx) => (
              <rect key={sx} x={sx} y={60} width={2} height={110} fill="#2a3a2e" opacity={0.3} />
            ))}

            {/* Plants */}
            {plants.map((p, i) => (
              <g key={i}>
                {p.healthy ? (
                  <Plant x={p.x} y={p.y} scale={0.5} variant={i} />
                ) : (
                  // Diseased plant
                  <g transform={`translate(${p.x}, ${p.y})`}>
                    <ellipse cx={0} cy={5} rx={16} ry={8} fill="#2a3a1a" opacity={0.4} />
                    {/* Wilting yellowed leaves */}
                    <path d="M-10,0 Q-7,-14 -3,-7 Q0,-18 3,-8 Q7,-15 10,0" fill="#8a7a30" stroke="#9a8a35" strokeWidth={0.4} />
                    <path d="M-14,3 Q-10,-4 -5,0" fill="#7a6a25" opacity={0.7} />
                    <path d="M14,3 Q10,-4 5,0" fill="#7a6a25" opacity={0.7} />
                    {/* Brown spots */}
                    <circle cx={-5} cy={-8} r={2} fill="#5a4020" opacity={0.7} />
                    <circle cx={4} cy={-10} r={1.8} fill="#5a4020" opacity={0.6} />
                    <circle cx={1} cy={-5} r={1.5} fill="#6a5030" opacity={0.5} />
                    {/* Drooping strawberry */}
                    <circle cx={-8} cy={4} r={3} fill="#994444" opacity={0.6} />
                  </g>
                )}
              </g>
            ))}

            {/* Thermal overlay scan band */}
            <rect
              x={scanX - 25}
              y={20}
              width={50}
              height={150}
              fill="url(#thermalGrad)"
              opacity={loopFrame < 200 ? 0.8 : 0}
            />

            {/* Thermal hotspot on diseased plant after scan */}
            {detected && (
              <g opacity={alertOpacity}>
                <ellipse cx={200} cy={70} rx={25} ry={18} fill="#ef4444" opacity={0.06 * alertPulse} />
                <ellipse cx={200} cy={70} rx={18} ry={12} fill="#f59e0b" opacity={0.08 * alertPulse} />
              </g>
            )}

            {/* Detection box on diseased plant */}
            {detected && (
              <g opacity={alertOpacity}>
                <rect
                  x={200 - 24}
                  y={74 - 28}
                  width={48}
                  height={42}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={1.2}
                  strokeDasharray="4 2"
                  rx={2}
                  opacity={alertPulse}
                />
                {/* Corner brackets */}
                {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], ci) => {
                  const bx = 200 - 24 + (dx > 0 ? 42 : 0);
                  const by = 74 - 28 + (dy > 0 ? 36 : 0);
                  return (
                    <path
                      key={ci}
                      d={`M${bx + dx * 0},${by + dy * 6} L${bx + dx * 6},${by} L${bx + dx * 0},${by}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth={1.8}
                    />
                  );
                })}

                {/* Label */}
                <rect x={200 + 26} y={74 - 26} width={52} height={14} rx={2} fill="rgba(0,0,0,0.7)" stroke="rgba(239,68,68,0.5)" strokeWidth={0.5} />
                <text x={200 + 52} y={74 - 16} fill="#ef4444" fontSize={7} fontFamily="monospace" textAnchor="middle">
                  INFECTED
                </text>

                {/* Confidence bar */}
                <rect x={200 + 26} y={74 - 8} width={52} height={10} rx={2} fill="rgba(0,0,0,0.7)" stroke="rgba(239,68,68,0.3)" strokeWidth={0.5} />
                <text x={200 + 52} y={74 - 0.5} fill="#f59e0b" fontSize={6} fontFamily="monospace" textAnchor="middle">
                  97.3% CONF
                </text>
              </g>
            )}

            {/* Healthy plant checks after scan */}
            {plants.filter(p => p.healthy).map((p, i) => {
              const checkAppear = scanX > p.x + 10;
              if (!checkAppear) return null;
              const checkOp = interpolate(scanX - (p.x + 10), [0, 40], [0, 0.7], { extrapolateRight: 'clamp' });
              return (
                <g key={`check-${i}`} opacity={checkOp}>
                  <circle cx={p.x} cy={p.y - 22} r={6} fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth={0.6} />
                  <path d={`M${p.x - 3},${p.y - 22} L${p.x - 1},${p.y - 20} L${p.x + 3},${p.y - 25}`} fill="none" stroke="#10b981" strokeWidth={1.2} />
                </g>
              );
            })}
          </g>

          {/* Floor */}
          <rect x={0} y={155} width={400} height={40} fill="#080e0a" opacity={0.5} />
        </g>

        {/* Warning border flash */}
        {detected && (
          <rect
            x={0}
            y={0}
            width={400}
            height={220}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            opacity={alertPulse * alertOpacity * 0.3}
          />
        )}

        <Particles count={4} type="dust" />

        {/* Status bar */}
        <rect x={0} y={196} width={400} height={24} fill="rgba(0,0,0,0.7)" />
        <line x1={0} y1={196} x2={400} y2={196} stroke={detected ? '#ef4444' : '#00d4ff'} strokeWidth={0.5} opacity={0.3} />

        {/* Status dot */}
        <circle
          cx={10}
          cy={208}
          r={3}
          fill={detected ? '#ef4444' : '#00d4ff'}
          opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.4, 1])}
        />

        <text x={20} y={212} fill={detected ? '#ef4444' : '#00d4ff'} fontSize={8} fontFamily="monospace">
          {loopFrame < 100 ? 'THERMAL SCAN' : loopFrame < 270 ? 'PATHOGEN DETECTED' : 'SCAN RESUMING'}
        </text>

        <text x={390} y={212} fill="#00d4ff" fontSize={7} fontFamily="monospace" textAnchor="end" opacity={0.4}>
          MULTISPECTRAL
        </text>
      </svg>
    </AbsoluteFill>
  );
};
