import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GrowLights } from '../components/GrowLights';
import { Plant } from '../components/Plant';
import { Floor } from '../components/Floor';
import { Particles } from '../components/Particles';

export const AisleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = frame * 2.5; // pixels per frame scroll speed

  // Fade in at start
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  // Fade out at end
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <svg width={800} height={380} viewBox="0 0 800 380">
        <defs>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="aisleBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="40%" stopColor="#0d1f10" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <radialGradient id="lightAmbient" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#dd66ff" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#dd66ff" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width={800} height={380} fill="url(#aisleBg)" />
        <rect width={800} height={140} fill="url(#lightAmbient)" />

        {/* Ceiling */}
        <rect x={0} y={0} width={800} height={16} fill="#111a14" opacity={0.9} />
        <line x1={0} y1={16} x2={800} y2={16} stroke="#1a2e1d" strokeWidth={1} opacity={0.4} />

        {/* Grow lights */}
        <GrowLights scrollOffset={scroll} />

        {/* Shelf structures (left and right sides) */}
        {/* Left shelf frame */}
        <rect x={0} y={55} width={15} height={230} fill="#1e2e22" opacity={0.6} />
        <rect x={0} y={55} width={180} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
        <rect x={0} y={150} width={180} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />

        {/* Right shelf frame */}
        <rect x={785} y={55} width={15} height={230} fill="#1e2e22" opacity={0.6} />
        <rect x={620} y={55} width={180} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />
        <rect x={620} y={150} width={180} height={5} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />

        {/* Shelf support verticals */}
        {[40, 100, 160].map((x) => (
          <rect key={`l${x}`} x={x} y={55} width={3} height={230} fill="#2a3a2e" opacity={0.5} />
        ))}
        {[640, 700, 760].map((x) => (
          <rect key={`r${x}`} x={x} y={55} width={3} height={230} fill="#2a3a2e" opacity={0.5} />
        ))}

        {/* Plants on left shelves (top row) */}
        {[0, 1, 2].map((i) => {
          const baseX = 30 + i * 60;
          const offsetY = Math.sin(scroll * 0.02 + i) * 2;
          return <Plant key={`lt${i}`} x={baseX} y={45 + offsetY} scale={0.7} variant={i} />;
        })}
        {/* Plants on left shelves (bottom row) */}
        {[0, 1, 2].map((i) => {
          const baseX = 30 + i * 60;
          return <Plant key={`lb${i}`} x={baseX} y={140} scale={0.8} variant={i + 3} />;
        })}

        {/* Plants on right shelves (top row) */}
        {[0, 1, 2].map((i) => {
          const baseX = 650 + i * 55;
          return <Plant key={`rt${i}`} x={baseX} y={45} scale={0.7} variant={i + 5} />;
        })}
        {/* Plants on right shelves (bottom row) */}
        {[0, 1, 2].map((i) => {
          const baseX = 650 + i * 55;
          return <Plant key={`rb${i}`} x={baseX} y={140} scale={0.8} variant={i + 8} />;
        })}

        {/* Center aisle — plants in distance (perspective) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const depth = i / 4;
          const scale = interpolate(depth, [0, 1], [0.9, 0.3]);
          const y = interpolate(depth, [0, 1], [230, 65]);
          const xSpread = interpolate(depth, [0, 1], [180, 50]);
          const alpha = interpolate(depth, [0, 1], [0.9, 0.3]);
          const scrollY = (scroll * (1 - depth * 0.7)) % 300;
          const adjustedY = y - scrollY * 0.1;

          return (
            <g key={`cp${i}`} opacity={alpha}>
              {/* Left side plant at depth */}
              <Plant x={200 + xSpread} y={adjustedY} scale={scale * 0.6} variant={i * 2} />
              {/* Right side plant at depth */}
              <Plant x={600 - xSpread} y={adjustedY} scale={scale * 0.6} variant={i * 2 + 1} />
            </g>
          );
        })}

        <Floor scrollOffset={scroll} />
        <Particles count={15} type="pollen" />

        {/* Depth haze */}
        <rect x={200} y={30} width={400} height={180} fill="#0d1f10" opacity={
          interpolate(frame, [0, 240], [0.3, 0.15])
        } />
      </svg>
    </AbsoluteFill>
  );
};
