import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GrowLights } from '../components/GrowLights';
import { Plant } from '../components/Plant';
import { Floor } from '../components/Floor';
import { Particles } from '../components/Particles';

export const NavigateScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Moving forward then turning
  const scroll = frame * 3;
  const turnAngle = interpolate(frame, [90, 180, 210], [0, -3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const turnShift = interpolate(frame, [90, 180, 210], [0, -60, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: 'clamp' });

  // Zone transition indicator
  const showZoneLabel = frame > 60 && frame < 170;
  const zoneLabelOpacity = interpolate(frame, [60, 80, 150, 170], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <svg width={800} height={380} viewBox="0 0 800 380">
        <defs>
          <linearGradient id="navBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="40%" stopColor="#0d1f10" />
            <stop offset="100%" stopColor="#080c10" />
          </linearGradient>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect width={800} height={380} fill="url(#navBg)" />

        <g transform={`translate(${turnShift}, 0) rotate(${turnAngle}, 400, 190)`}>
          {/* Ceiling */}
          <rect x={0} y={0} width={900} height={16} fill="#111a14" opacity={0.9} />
          <line x1={0} y1={16} x2={900} y2={16} stroke="#1a2e1d" strokeWidth={1} opacity={0.4} />

          {/* Ceiling beams */}
          {[0, 1, 2, 3, 4].map((i) => {
            const x = ((i * 200 - scroll * 0.5) % 1000 + 1000) % 1000 - 100;
            return (
              <rect key={i} x={x} y={0} width={8} height={16} fill="#1e2e22" opacity={0.4} />
            );
          })}

          <GrowLights scrollOffset={scroll} />

          {/* Wide open intersection area */}
          {/* Far shelves (perspective, smaller) */}
          <g opacity={0.4}>
            <rect x={50} y={80} width={120} height={4} fill="#2a3a2e" />
            <rect x={630} y={80} width={120} height={4} fill="#2a3a2e" />
            {[0, 1].map((i) => (
              <Plant key={`fl${i}`} x={80 + i * 50} y={72} scale={0.45} variant={i} />
            ))}
            {[0, 1].map((i) => (
              <Plant key={`fr${i}`} x={660 + i * 50} y={72} scale={0.45} variant={i + 3} />
            ))}
          </g>

          {/* Mid shelves */}
          <g opacity={0.6}>
            <rect x={0} y={140} width={160} height={5} fill="#2a3a2e" />
            <rect x={640} y={140} width={160} height={5} fill="#2a3a2e" />
            {[0, 1, 2].map((i) => (
              <Plant key={`ml${i}`} x={30 + i * 55} y={130} scale={0.6} variant={i + 5} />
            ))}
            {[0, 1, 2].map((i) => (
              <Plant key={`mr${i}`} x={660 + i * 50} y={130} scale={0.6} variant={i + 8} />
            ))}
          </g>

          {/* Near shelves (sides) */}
          <rect x={-20} y={200} width={200} height={6} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
          <rect x={620} y={200} width={200} height={6} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
          {[0, 1, 2].map((i) => (
            <Plant key={`nl${i}`} x={20 + i * 60} y={190} scale={0.85} variant={i + 11} />
          ))}
          {[0, 1, 2].map((i) => (
            <Plant key={`nr${i}`} x={640 + i * 55} y={190} scale={0.85} variant={i + 14} />
          ))}

          {/* Floor navigation lines */}
          <Floor scrollOffset={scroll} yStart={270} />

          {/* Yellow turn indicator on floor */}
          <line x1={300} y1={300} x2={250} y2={370} stroke="#f59e0b" strokeWidth={2} strokeDasharray="8 4" opacity={0.3} />
          <line x1={300} y1={310} x2={260} y2={370} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.2} />

          {/* Blue forward line */}
          <line x1={400} y1={280} x2={400} y2={370} stroke="#00d4ff" strokeWidth={1.5} strokeDasharray="8 6" opacity={0.15} />

          {/* Support column in intersection */}
          <rect x={385} y={100} width={30} height={170} rx={4} fill="#1a2520" stroke="#2a3a2e" strokeWidth={1} opacity={0.5} />
        </g>

        {/* Zone label */}
        {showZoneLabel && (
          <g opacity={zoneLabelOpacity}>
            <rect x={300} y={25} width={200} height={28} rx={4} fill="rgba(0,0,0,0.6)" stroke="rgba(0,212,255,0.3)" strokeWidth={0.5} />
            <text x={400} y={44} fill="#00d4ff" fontSize={11} fontFamily="monospace" textAnchor="middle">
              ZONE GH-04 → GH-05
            </text>
          </g>
        )}

        <Particles count={10} type="dust" />
      </svg>
    </AbsoluteFill>
  );
};
