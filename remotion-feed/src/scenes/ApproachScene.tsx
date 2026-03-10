import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Plant } from '../components/Plant';
import { GrowLights } from '../components/GrowLights';
import { Floor } from '../components/Floor';
import { Particles } from '../components/Particles';
import { Reticle } from '../components/Reticle';

export const ApproachScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Zoom effect — plants get bigger as robot approaches
  const zoom = interpolate(frame, [0, 150, 180], [1, 1.6, 1.6], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Camera tilts slightly up as we approach
  const tiltY = interpolate(frame, [0, 150], [0, -20], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: 'clamp' });

  // Reticle appears mid-approach
  const reticleOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reticleSize = interpolate(frame, [60, 120, 150], [40, 28, 24], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <svg width={800} height={380} viewBox="0 0 800 380">
        <defs>
          <linearGradient id="approachBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="40%" stopColor="#0d1f10" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="spotGlow" cx="50%" cy="40%" r="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect width={800} height={380} fill="url(#approachBg)" />

        <g transform={`translate(${400 - 400 * zoom}, ${190 + tiltY - 190 * zoom}) scale(${zoom})`}>
          {/* Ceiling */}
          <rect x={0} y={0} width={800} height={16} fill="#111a14" opacity={0.9} />

          <GrowLights scrollOffset={0} />

          {/* Shelf structure */}
          <rect x={40} y={55} width={720} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
          <rect x={40} y={150} width={720} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
          {[50, 200, 360, 520, 680, 750].map((x) => (
            <rect key={x} x={x} y={55} width={3} height={200} fill="#2a3a2e" opacity={0.5} />
          ))}

          {/* Top row plants */}
          {[100, 240, 400, 560, 710].map((x, i) => (
            <Plant key={`t${i}`} x={x} y={45} scale={0.8} variant={i} />
          ))}

          {/* Bottom row plants (main focus) */}
          {[100, 240, 400, 560, 710].map((x, i) => (
            <Plant key={`b${i}`} x={x} y={140} scale={0.9} variant={i + 5} />
          ))}

          <Floor yStart={260} />
        </g>

        {/* Spotlight on target */}
        <rect width={800} height={380} fill="url(#spotGlow)" />

        {/* Targeting reticle on center plant */}
        <g opacity={reticleOpacity}>
          <Reticle x={400} y={interpolate(zoom, [1, 1.6], [140, 115])} size={reticleSize} label="SCANNING" />
        </g>

        <Particles count={12} type="pollen" />
      </svg>
    </AbsoluteFill>
  );
};
