import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Particles } from '../components/Particles';

export const PruningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loopFrame = frame % 300;

  // Arm extension phases: approach (0-80), hold (80-140), cut (140-160), retract (160-240), idle (240-300)
  const armExtension = interpolate(
    loopFrame,
    [0, 80, 140, 150, 200, 260, 300],
    [0, 0.85, 0.9, 0.92, 0.5, 0, 0],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  // Arm wobble
  const wobble = Math.sin(frame * 0.3) * 1.2 * armExtension;

  // End effector position (scissors approach target)
  const armStartX = -20;
  const armStartY = 240;
  const armMidX = interpolate(armExtension, [0, 1], [30, 150]);
  const armMidY = interpolate(armExtension, [0, 1], [200, 120]) + wobble;
  const armEndX = interpolate(armExtension, [0, 1], [50, 210]);
  const armEndY = interpolate(armExtension, [0, 1], [180, 85]) + wobble;

  // Cut animation
  const cutHappened = loopFrame >= 150;
  const branchFall = cutHappened
    ? interpolate(loopFrame, [150, 200], [0, 40], { extrapolateRight: 'clamp' })
    : 0;
  const branchFadeOut = cutHappened
    ? interpolate(loopFrame, [150, 210], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Dotted cut line appears before cut
  const cutLineOpacity = interpolate(loopFrame, [80, 100, 145, 155], [0, 0.8, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scissors open/close animation
  const scissorsAngle = interpolate(
    loopFrame,
    [80, 100, 140, 150],
    [15, 12, 12, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Status text
  const statusText =
    loopFrame < 80
      ? 'TARGETING'
      : loopFrame < 140
        ? 'CUT POINT OPTIMIZED'
        : loopFrame < 200
          ? 'PRUNE COMPLETE'
          : 'RETRACTING';
  const statusColor =
    loopFrame < 80
      ? '#00d4ff'
      : loopFrame < 140
        ? '#f59e0b'
        : loopFrame < 200
          ? '#10b981'
          : '#00d4ff';

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={400} height={220} viewBox="0 0 400 220">
        <defs>
          <linearGradient id="prBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="50%" stopColor="#0d2010" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect width={400} height={220} fill="url(#prBg)" />

        {/* Grow light glow at top */}
        <rect x={80} y={0} width={200} height={4} rx={2} fill="#bb44ee" opacity={0.5} />
        <rect x={0} y={0} width={400} height={40} fill="url(#growGlow)" opacity={0.15} />

        {/* Close-up plant - large, centered */}
        <g transform="translate(220, 100)">
          {/* Main stem */}
          <line x1={0} y1={50} x2={0} y2={-20} stroke="#1a5520" strokeWidth={3} />
          <line x1={0} y1={-10} x2={-30} y2={-40} stroke="#1a5520" strokeWidth={2} />
          <line x1={0} y1={-5} x2={35} y2={-30} stroke="#1a5520" strokeWidth={2} />
          <line x1={0} y1={10} x2={-40} y2={-5} stroke="#1a5520" strokeWidth={2} />

          {/* Healthy leaves */}
          <ellipse cx={-40} cy={-45} rx={18} ry={10} fill="#28773a" stroke="#32884a" strokeWidth={0.5} transform="rotate(-20, -40, -45)" />
          <ellipse cx={40} cy={-35} rx={16} ry={9} fill="#22662a" stroke="#2a7a32" strokeWidth={0.5} transform="rotate(15, 40, -35)" />
          <ellipse cx={-50} cy={-10} rx={15} ry={8} fill="#28773a" stroke="#32884a" strokeWidth={0.5} transform="rotate(-10, -50, -10)" />
          <ellipse cx={10} cy={-30} rx={14} ry={8} fill="#1e5c24" stroke="#2a7a32" strokeWidth={0.5} transform="rotate(10, 10, -30)" />

          {/* Strawberries */}
          <circle cx={-20} cy={10} r={6} fill="#e63946" />
          <circle cx={-20} cy={10} r={2.5} fill="#ff6b6b" opacity={0.5} />
          <circle cx={30} cy={5} r={5} fill="#e63946" />
          <circle cx={30} cy={5} r={2} fill="#ff6b6b" opacity={0.5} />

          {/* Dead/brown branch (the target) */}
          <g transform={`translate(0, ${branchFall})`} opacity={branchFadeOut}>
            <line x1={0} y1={5} x2={55} y2={-15} stroke="#5a4020" strokeWidth={2.5} />
            <ellipse cx={55} cy={-20} rx={14} ry={7} fill="#6a5030" stroke="#5a4020" strokeWidth={0.5} transform="rotate(10, 55, -20)" />
            <ellipse cx={45} cy={-10} rx={10} ry={6} fill="#7a6035" stroke="#6a5030" strokeWidth={0.5} transform="rotate(-5, 45, -10)" />
            {/* Brown spots on dead leaves */}
            <circle cx={52} cy={-18} r={3} fill="#4a3018" opacity={0.6} />
            <circle cx={48} cy={-12} r={2} fill="#4a3018" opacity={0.5} />
          </g>

          {/* Dotted cut line */}
          {cutLineOpacity > 0 && (
            <g opacity={cutLineOpacity}>
              <line
                x1={10}
                y1={-2}
                x2={10}
                y2={12}
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="2 2"
              />
              {/* Cut point indicator */}
              <circle cx={10} cy={5} r={4} fill="none" stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2 2" />
              <text x={18} y={2} fill="#f59e0b" fontSize={6} fontFamily="monospace" opacity={0.8}>
                CUT
              </text>
            </g>
          )}
        </g>

        {/* Robot arm with scissors end-effector */}
        {armExtension > 0.01 && (
          <g opacity={interpolate(armExtension, [0, 0.05, 1], [0, 0.7, 0.8])}>
            {/* Upper arm */}
            <line
              x1={armStartX}
              y1={armStartY}
              x2={armMidX}
              y2={armMidY}
              stroke="#5b8fd4"
              strokeWidth={6}
              strokeLinecap="round"
            />
            {/* Forearm */}
            <line
              x1={armMidX}
              y1={armMidY}
              x2={armEndX}
              y2={armEndY}
              stroke="#8899aa"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Joint */}
            <circle cx={armMidX} cy={armMidY} r={4} fill="#4a7ec3" stroke="#3a6eb3" strokeWidth={0.8} />

            {/* Scissors end-effector */}
            <g transform={`translate(${armEndX}, ${armEndY}) rotate(-30)`}>
              {/* Pivot */}
              <circle cx={0} cy={0} r={3} fill="#5b8fd4" stroke="#4a7ec3" strokeWidth={1} />
              {/* Top blade */}
              <g transform={`rotate(${-scissorsAngle})`}>
                <path d="M0,0 L18,-2 L20,0 L18,2 L0,0" fill="#8899aa" stroke="#6a7a8a" strokeWidth={0.5} />
              </g>
              {/* Bottom blade */}
              <g transform={`rotate(${scissorsAngle})`}>
                <path d="M0,0 L18,2 L20,0 L18,-2 L0,0" fill="#7a8a9a" stroke="#6a7a8a" strokeWidth={0.5} />
              </g>
              {/* LED glow */}
              <circle
                cx={0}
                cy={0}
                r={6}
                fill="none"
                stroke="#00d4ff"
                strokeWidth={0.8}
                opacity={interpolate(Math.sin(frame * 0.4), [-1, 1], [0.2, 0.6])}
              />
            </g>
          </g>
        )}

        {/* Floor */}
        <rect x={0} y={175} width={400} height={45} fill="#080e0a" opacity={0.5} />

        <Particles count={4} type="dust" />

        {/* Status bar */}
        <rect x={0} y={196} width={400} height={24} fill="rgba(0,0,0,0.7)" />
        <line x1={0} y1={196} x2={400} y2={196} stroke={statusColor} strokeWidth={0.5} opacity={0.3} />

        {/* Status indicator dot */}
        <circle
          cx={10}
          cy={208}
          r={3}
          fill={statusColor}
          opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.4, 1])}
        />

        <text x={20} y={212} fill={statusColor} fontSize={8} fontFamily="monospace">
          {statusText}
        </text>

        {/* Right side: operation ID */}
        <text x={390} y={212} fill="#00d4ff" fontSize={7} fontFamily="monospace" textAnchor="end" opacity={0.4}>
          OP-PRN-0042
        </text>
      </svg>
    </AbsoluteFill>
  );
};
