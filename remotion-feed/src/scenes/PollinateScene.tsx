import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Plant } from '../components/Plant';
import { RobotArm } from '../components/RobotArm';
import { Reticle } from '../components/Reticle';
import { Particles } from '../components/Particles';

export const PollinateScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Arm extends in, holds, retracts
  const armExtension = interpolate(
    frame,
    [0, 60, 140, 200, 240],
    [0, 0.9, 0.95, 0.3, 0],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  // Reticle locks when arm is near
  const reticleLocked = frame > 50 && frame < 160;
  const reticleOpacity = interpolate(frame, [0, 10, 200, 240], [1, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Pollen burst at contact
  const pollenBurst = frame > 80 && frame < 160;
  const pollenOpacity = interpolate(frame, [80, 90, 140, 160], [0, 0.8, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Status text
  const statusText = frame < 50 ? 'ALIGNING' : frame < 80 ? 'CONTACT' : frame < 160 ? 'POLLINATING' : 'COMPLETE';
  const statusColor = frame < 80 ? '#00d4ff' : frame < 160 ? '#10b981' : '#f59e0b';

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <svg width={800} height={380} viewBox="0 0 800 380">
        <defs>
          <linearGradient id="polBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a0a" />
            <stop offset="50%" stopColor="#0d2010" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <radialGradient id="ledRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
            <stop offset="40%" stopColor="#00d4ff" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="growGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c850ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c850ff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect width={800} height={380} fill="url(#polBg)" />

        {/* Grow lights at top (close up, zoomed) */}
        <rect x={100} y={0} width={250} height={8} rx={3} fill="#bb44ee" opacity={0.5} />
        <rect x={450} y={0} width={250} height={8} rx={3} fill="#bb44ee" opacity={0.5} />
        <rect x={0} y={0} width={800} height={60} fill="url(#growGlow)" opacity={0.3} />

        {/* Close-up shelf */}
        <rect x={0} y={50} width={800} height={6} rx={2} fill="#2a3a2e" stroke="#3a4e3f" strokeWidth={0.5} />

        {/* Plants (close up, large) */}
        <Plant x={150} y={40} scale={1.4} variant={0} />
        <Plant x={350} y={35} scale={1.6} variant={2} />
        <Plant x={550} y={38} scale={1.5} variant={4} />
        <Plant x={700} y={42} scale={1.3} variant={6} />

        {/* Central target plant — largest */}
        <g transform="translate(400, 180) scale(2.2)">
          {/* Large leaf cluster */}
          <ellipse cx={0} cy={10} rx={50} ry={25} fill="#1a5520" opacity={0.4} />
          <path d="M-30,5 Q-20,-30 -10,-15 Q0,-40 10,-20 Q20,-35 30,5" fill="#28773a" stroke="#32884a" strokeWidth={0.5} />
          <path d="M-40,10 Q-35,-8 -15,0" fill="#22662a" stroke="#2a7a32" strokeWidth={0.3} opacity={0.7} />
          <path d="M40,10 Q35,-8 15,0" fill="#22662a" stroke="#2a7a32" strokeWidth={0.3} opacity={0.7} />

          {/* Strawberries */}
          <circle cx={-20} cy={-5} r={7} fill="#e63946" />
          <circle cx={-20} cy={-5} r={3} fill="#ff6b6b" opacity={0.5} />
          <circle cx={22} cy={-8} r={6} fill="#e63946" />
          <circle cx={22} cy={-8} r={2.5} fill="#ff6b6b" opacity={0.5} />
          <circle cx={5} cy={5} r={5.5} fill="#d62839" />

          {/* Target flowers */}
          {[-8, 8].map((fx, fi) => (
            <g key={fi} transform={`translate(${fx}, -28)`}>
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse key={angle} cx={0} cy={-4} rx={3} ry={5} fill="white" opacity={0.9} transform={`rotate(${angle})`} />
              ))}
              <circle cx={0} cy={0} r={3} fill="#ffdd44" />
              <circle cx={0} cy={0} r={1.5} fill="#ffaa00" />
            </g>
          ))}
        </g>

        {/* LED ring illumination on target */}
        <circle cx={400} cy={140} r={80} fill="url(#ledRing)" opacity={
          interpolate(armExtension, [0, 0.5, 1], [0, 0.5, 1])
        } />

        {/* Reticle */}
        <g opacity={reticleOpacity}>
          <Reticle x={400} y={130} size={35} locked={reticleLocked} label={statusText} />
        </g>

        {/* Pollen particles burst */}
        {pollenBurst && (
          <g opacity={pollenOpacity}>
            {Array.from({ length: 25 }).map((_, i) => {
              const angle = (i / 25) * Math.PI * 2 + i * 0.3;
              const dist = interpolate(frame - 80, [0, 60], [5, 30 + (i % 3) * 15]);
              const px = 400 + Math.cos(angle) * dist;
              const py = 130 + Math.sin(angle) * dist - (frame - 80) * 0.2;
              const size = 1 + (i % 3) * 0.5;
              return (
                <circle key={i} cx={px} cy={py} r={size} fill="#ffee44" opacity={0.6 - i * 0.02} />
              );
            })}
          </g>
        )}

        {/* Robot arm */}
        <RobotArm extension={armExtension} side="left" />

        {/* Floor barely visible at bottom */}
        <rect x={0} y={330} width={800} height={50} fill="#080e0a" opacity={0.5} />

        <Particles count={10} type="pollen" />

        {/* Status bar at bottom */}
        <rect x={300} y={355} width={200} height={18} rx={3} fill="rgba(0,0,0,0.5)" stroke={`${statusColor}44`} strokeWidth={0.5} />
        <text x={400} y={368} fill={statusColor} fontSize={10} fontFamily="monospace" textAnchor="middle">{statusText}</text>
      </svg>
    </AbsoluteFill>
  );
};
