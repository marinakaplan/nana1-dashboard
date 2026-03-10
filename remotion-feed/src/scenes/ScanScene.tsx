import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Plant } from '../components/Plant';
import { GrowLights } from '../components/GrowLights';
import { Floor } from '../components/Floor';
import { Reticle } from '../components/Reticle';
import { Particles } from '../components/Particles';

export const ScanScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Moving, then slowing to detect diseased plant, then resuming
  const scroll = interpolate(
    frame,
    [0, 60, 100, 250, 300, 330],
    [0, 150, 150, 150, 300, 500],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  // Zoom into diseased plant
  const zoom = interpolate(frame, [60, 120, 240, 280], [1, 1.3, 1.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Warning flash
  const warningFlash = frame > 80 && frame < 220;
  const warningOpacity = interpolate(frame, [80, 100, 200, 220], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const warningPulse = warningFlash
    ? interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1])
    : 0;

  // Scan line sweep
  const scanLineY = interpolate(frame, [80, 200], [40, 300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [310, 330], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <svg width={800} height={380} viewBox="0 0 800 380">
        <defs>
          <linearGradient id="scanBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="40%" stopColor="#0d1f10" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="scanLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity={0} />
            <stop offset="45%" stopColor="#00d4ff" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity={0.6} />
            <stop offset="55%" stopColor="#00d4ff" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect width={800} height={380} fill="url(#scanBg)" />

        <g transform={`translate(${400 - 400 * zoom}, ${190 - 190 * zoom}) scale(${zoom})`}>
          {/* Ceiling */}
          <rect x={0} y={0} width={800} height={16} fill="#111a14" opacity={0.9} />

          <GrowLights scrollOffset={scroll} />

          {/* Shelf */}
          <rect x={40} y={55} width={720} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
          <rect x={40} y={150} width={720} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
          {[50, 200, 360, 520, 680, 750].map((x) => (
            <rect key={x} x={x} y={55} width={3} height={200} fill="#2a3a2e" opacity={0.5} />
          ))}

          {/* Healthy plants */}
          <Plant x={120} y={45} scale={0.8} variant={0} />
          <Plant x={280} y={42} scale={0.85} variant={2} />
          <Plant x={560} y={44} scale={0.8} variant={6} />
          <Plant x={700} y={46} scale={0.75} variant={8} />

          {/* Bottom row */}
          <Plant x={120} y={140} scale={0.9} variant={1} />
          <Plant x={280} y={138} scale={0.95} variant={3} />
          <Plant x={560} y={140} scale={0.9} variant={7} />
          <Plant x={700} y={142} scale={0.85} variant={9} />

          {/* DISEASED PLANT — center focus */}
          <g transform="translate(410, 135)">
            <ellipse cx={0} cy={5} rx={30} ry={15} fill="#2a3a1a" opacity={0.4} />
            {/* Wilting, yellowed leaves */}
            <path d="M-15,0 Q-10,-20 -5,-10 Q0,-25 5,-12 Q10,-22 15,0" fill="#8a7a30" stroke="#9a8a35" strokeWidth={0.5} />
            <path d="M-22,5 Q-18,-5 -8,0" fill="#7a6a25" strokeWidth={0.3} opacity={0.7} />
            <path d="M22,5 Q18,-5 8,0" fill="#7a6a25" strokeWidth={0.3} opacity={0.7} />
            {/* Brown spots */}
            <circle cx={-8} cy={-12} r={3} fill="#5a4020" opacity={0.7} />
            <circle cx={6} cy={-15} r={2.5} fill="#5a4020" opacity={0.6} />
            <circle cx={2} cy={-8} r={2} fill="#6a5030" opacity={0.5} />
            {/* Drooping strawberry */}
            <circle cx={-12} cy={5} r={4} fill="#994444" opacity={0.7} />
          </g>

          <Floor yStart={260} />
        </g>

        {/* Scan line sweep */}
        {frame > 80 && frame < 200 && (
          <rect x={0} y={scanLineY - 15} width={800} height={30} fill="url(#scanLine)" />
        )}

        {/* Warning reticle on diseased plant */}
        {warningFlash && (
          <g opacity={warningOpacity}>
            <Reticle
              x={interpolate(zoom, [1, 1.3], [410, 400])}
              y={interpolate(zoom, [1, 1.3], [135, 120])}
              size={30}
              locked={frame > 120}
              label="ANOMALY DETECTED"
            />
          </g>
        )}

        {/* Warning border flash */}
        {warningFlash && (
          <rect
            x={0}
            y={0}
            width={800}
            height={380}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={3}
            opacity={warningPulse * warningOpacity * 0.4}
          />
        )}

        {/* Warning text */}
        {warningFlash && (
          <g opacity={warningOpacity}>
            <rect x={260} y={340} width={280} height={24} rx={3} fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth={0.5} />
            <text x={400} y={356} fill="#f59e0b" fontSize={10} fontFamily="monospace" textAnchor="middle">
              LEAF DISEASE - FLAGGING FOR REVIEW
            </text>
          </g>
        )}

        <Particles count={8} type="dust" />
      </svg>
    </AbsoluteFill>
  );
};
