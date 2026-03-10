import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Particles } from '../components/Particles';

export const EnvironmentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loopFrame = frame % 300;

  // Sensor readings with subtle animation
  const temp = (24.7 + Math.sin(frame * 0.02) * 0.3).toFixed(1);
  const humidity = Math.round(68 + Math.sin(frame * 0.015 + 1) * 2);
  const co2 = Math.round(820 + Math.sin(frame * 0.025 + 2) * 15);
  const vpd = (1.12 + Math.sin(frame * 0.018 + 3) * 0.08).toFixed(2);

  // Airflow animation
  const flowOffset = (frame * 0.6) % 80;

  // Status flicker
  const isOptimal = loopFrame < 200 || loopFrame > 260;
  const statusText = isOptimal ? 'CLIMATE OPTIMAL' : 'ADJUSTING HVAC';
  const statusColor = isOptimal ? '#10b981' : '#f59e0b';

  // Zone highlight sweep
  const zoneHighlight = interpolate(loopFrame, [0, 100, 200, 300], [0, 1, 2, 0], {
    extrapolateRight: 'clamp',
  });
  const activeZone = Math.floor(zoneHighlight);

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Fan rotation
  const fanAngle = frame * 4;

  // Vent flap animation (opens and closes)
  const ventFlap = interpolate(loopFrame, [200, 230, 260, 290], [0, 12, 12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={400} height={220} viewBox="0 0 400 220">
        <defs>
          <linearGradient id="envBg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0e14" />
            <stop offset="100%" stopColor="#0d1a10" />
          </linearGradient>
          <linearGradient id="heatZone1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="heatZone2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="heatZone3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.04} />
          </linearGradient>
        </defs>

        <rect width={400} height={220} fill="url(#envBg2)" />

        {/* ===== GREENHOUSE STRUCTURE (full width) ===== */}
        {/* Peaked roof */}
        <path d="M15,32 L200,6 L385,32" fill="none" stroke="#2a3a2e" strokeWidth={1.8} />
        {/* Walls */}
        <line x1={15} y1={32} x2={15} y2={168} stroke="#2a3a2e" strokeWidth={1.8} />
        <line x1={385} y1={32} x2={385} y2={168} stroke="#2a3a2e" strokeWidth={1.8} />
        {/* Floor */}
        <line x1={15} y1={168} x2={385} y2={168} stroke="#2a3a2e" strokeWidth={1.8} />
        {/* Cross beam */}
        <line x1={15} y1={32} x2={385} y2={32} stroke="#2a3a2e" strokeWidth={0.8} opacity={0.4} />
        {/* Roof panes */}
        {[75, 140, 200, 260, 325].map((rx) => {
          const ry = interpolate(rx, [15, 200, 385], [32, 6, 32]);
          return <line key={rx} x1={rx} y1={ry} x2={rx} y2={32} stroke="#2a3a2e" strokeWidth={0.5} opacity={0.3} />;
        })}

        {/* ===== 3 CLIMATE ZONES ===== */}
        {[0, 1, 2].map((z) => {
          const zx = 17 + z * 123;
          const zw = 120;
          const isActive = activeZone === z;
          const zoneOpacity = isActive ? 0.9 : 0.45;
          const gradId = `heatZone${z + 1}`;

          return (
            <g key={z} opacity={zoneOpacity}>
              {/* Zone heat fill */}
              <rect x={zx} y={33} width={zw} height={134} fill={`url(#${gradId})`} />

              {/* Zone divider lines */}
              {z < 2 && (
                <line x1={zx + zw + 1} y1={32} x2={zx + zw + 1} y2={168} stroke="#2a3a2e" strokeWidth={0.8} strokeDasharray="4 3" opacity={0.3} />
              )}

              {/* Zone label at top */}
              <rect x={zx + zw / 2 - 18} y={35} width={36} height={12} rx={2} fill="rgba(0,0,0,0.5)" stroke={isActive ? '#00d4ff' : 'rgba(255,255,255,0.08)'} strokeWidth={0.5} />
              <text x={zx + zw / 2} y={44} fill={isActive ? '#00d4ff' : '#64748b'} fontSize={6.5} fontFamily="monospace" textAnchor="middle">
                {`ZONE ${String.fromCharCode(65 + z)}`}
              </text>

              {/* Temperature reading per zone */}
              {isActive && (
                <g>
                  <rect x={zx + zw / 2 - 22} y={52} width={44} height={16} rx={2} fill="rgba(0,0,0,0.6)" stroke="rgba(0,212,255,0.2)" strokeWidth={0.5} />
                  <text x={zx + zw / 2} y={63} fill="#f59e0b" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    {(parseFloat(temp) + z * 0.4 - 0.4).toFixed(1)}°C
                  </text>
                </g>
              )}

              {/* Small plants inside each zone */}
              {[0, 1, 2].map((p) => {
                const px = zx + 20 + p * 35;
                return (
                  <g key={p} transform={`translate(${px}, 160)`}>
                    <rect x={-1} y={-12} width={2} height={12} fill="#1a5520" opacity={0.5} />
                    <ellipse cx={0} cy={-14} rx={9} ry={5} fill="#22662a" opacity={0.35} />
                    <circle cx={4} cy={-10} r={2} fill="#e63946" opacity={0.3} />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* ===== GROW LIGHT BAR ===== */}
        <rect x={60} y={33} width={130} height={3} rx={1} fill="#bb44ee" opacity={interpolate(Math.sin(frame * 0.12), [-1, 1], [0.3, 0.55])} />
        <rect x={210} y={33} width={130} height={3} rx={1} fill="#bb44ee" opacity={interpolate(Math.sin(frame * 0.12 + 1), [-1, 1], [0.3, 0.55])} />

        {/* ===== AIRFLOW ARROWS ===== */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const baseX = ((i * 70 - flowOffset) % 400 + 400) % 400;
          const y = 75 + i * 12 + Math.sin(frame * 0.04 + i) * 3;
          if (y > 160 || y < 38 || baseX < 20 || baseX > 375) return null;
          const arrowOp = interpolate(baseX, [20, 60, 340, 375], [0, 0.2, 0.2, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <g key={i} opacity={arrowOp}>
              <line x1={baseX} y1={y} x2={baseX + 18} y2={y} stroke="#00d4ff" strokeWidth={0.6} />
              <path d={`M${baseX + 18},${y} L${baseX + 14},${y - 2} M${baseX + 18},${y} L${baseX + 14},${y + 2}`} fill="none" stroke="#00d4ff" strokeWidth={0.6} />
            </g>
          );
        })}

        {/* ===== CEILING FAN ===== */}
        <g transform={`translate(200, 26)`}>
          <circle cx={0} cy={0} r={4} fill="#1a2520" stroke="#2a3a2e" strokeWidth={0.8} />
          <g transform={`rotate(${fanAngle})`}>
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1={0} y1={0} x2={Math.cos(a * Math.PI / 180) * 10} y2={Math.sin(a * Math.PI / 180) * 10} stroke="#4a6a5e" strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
            ))}
          </g>
        </g>

        {/* ===== ROOF VENT (opens during HVAC adjust) ===== */}
        <g transform={`translate(300, 20)`}>
          <line x1={0} y1={0} x2={20} y2={0} stroke="#2a3a2e" strokeWidth={1.5} />
          <line x1={0} y1={0} x2={Math.cos(-ventFlap * Math.PI / 180) * 20} y2={Math.sin(-ventFlap * Math.PI / 180) * 20} stroke={ventFlap > 0 ? '#f59e0b' : '#2a3a2e'} strokeWidth={1.5} />
          {ventFlap > 2 && (
            <text x={10} y={-8} fill="#f59e0b" fontSize={5} fontFamily="monospace" textAnchor="middle" opacity={0.6}>
              VENT
            </text>
          )}
        </g>

        {/* ===== SENSOR NODES ===== */}
        {[
          { x: 50, y: 90, color: '#f59e0b' },
          { x: 200, y: 110, color: '#10b981' },
          { x: 350, y: 95, color: '#3b82f6' },
        ].map((node, i) => {
          const pulse = interpolate(Math.sin(frame * 0.15 + i * 2.5), [-1, 1], [0.5, 1]);
          return (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r={10} fill={node.color} opacity={0.03 * pulse} />
              <circle cx={node.x} cy={node.y} r={4} fill={node.color} opacity={0.15 * pulse} />
              <circle cx={node.x} cy={node.y} r={2} fill={node.color} opacity={0.7 * pulse} />
              {/* Rings */}
              <circle cx={node.x} cy={node.y} r={7 + pulse * 3} fill="none" stroke={node.color} strokeWidth={0.3} opacity={0.15 * (1 - pulse)} />
            </g>
          );
        })}

        {/* ===== RIGHT SIDE SENSOR PANEL ===== */}
        {/* Compact floating readings at right edge */}
        {[
          { y: 38, label: `${temp}°C`, icon: 'T', color: '#f59e0b', val: parseFloat(temp), min: 20, max: 30 },
          { y: 68, label: `${humidity}%`, icon: 'H', color: '#3b82f6', val: humidity, min: 50, max: 90 },
          { y: 98, label: `${co2}`, icon: 'C', color: '#8b5cf6', val: co2, min: 600, max: 1000 },
          { y: 128, label: `${vpd}`, icon: 'V', color: '#10b981', val: parseFloat(vpd), min: 0.8, max: 1.4 },
        ].map((s, i) => {
          const pct = interpolate(s.val, [s.min, s.max], [0, 38], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <g key={i} transform="translate(0, 0)">
              {/* Floating badge */}
              <rect x={-2} y={s.y} width={12} height={12} rx={2} fill="rgba(0,0,0,0.5)" stroke={`${s.color}55`} strokeWidth={0.5} />
              <text x={4} y={s.y + 9} fill={s.color} fontSize={7} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {s.icon}
              </text>
            </g>
          );
        })}

        <Particles count={3} type="dust" />

        {/* ===== BOTTOM STATUS BAR ===== */}
        <rect x={0} y={196} width={400} height={24} fill="rgba(0,0,0,0.7)" />
        <line x1={0} y1={196} x2={400} y2={196} stroke={statusColor} strokeWidth={0.5} opacity={0.3} />

        <circle cx={10} cy={208} r={3} fill={statusColor} opacity={interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 1])} />
        <text x={20} y={212} fill={statusColor} fontSize={8} fontFamily="monospace">
          {statusText}
        </text>

        {/* Sensor values in status bar */}
        <text x={180} y={212} fill="#f59e0b" fontSize={7} fontFamily="monospace" opacity={0.7}>
          {temp}°C
        </text>
        <text x={225} y={212} fill="#3b82f6" fontSize={7} fontFamily="monospace" opacity={0.7}>
          {humidity}%RH
        </text>
        <text x={275} y={212} fill="#8b5cf6" fontSize={7} fontFamily="monospace" opacity={0.7}>
          {co2}ppm
        </text>
        <text x={325} y={212} fill="#10b981" fontSize={7} fontFamily="monospace" opacity={0.7}>
          VPD {vpd}
        </text>

        <text x={390} y={212} fill="#00d4ff" fontSize={7} fontFamily="monospace" textAnchor="end" opacity={0.4}>
          GH-04
        </text>
      </svg>
    </AbsoluteFill>
  );
};
