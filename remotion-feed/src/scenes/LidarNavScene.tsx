import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

// Seeded pseudo-random for consistent point cloud
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const LidarNavScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loopFrame = frame % 300;

  // Rotating scan beam angle (full 360 over ~120 frames, repeats)
  const scanAngle = ((frame * 3) % 360) * (Math.PI / 180);

  // Robot position (center-bottom area)
  const robotX = 200;
  const robotY = 155;

  // Destination
  const destX = 320;
  const destY = 40;

  // Robot pulse
  const robotPulse = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1]);

  // Path waypoints
  const waypoints = [
    { x: 200, y: 155 },
    { x: 210, y: 130 },
    { x: 230, y: 100 },
    { x: 260, y: 75 },
    { x: 290, y: 55 },
    { x: 320, y: 40 },
  ];

  // Path dash offset for animation
  const pathDashOffset = -frame * 0.5;

  // Obstacle shelf rectangles (dense point clusters)
  const obstacles = [
    { x: 60, y: 40, w: 80, h: 25 },
    { x: 280, y: 100, w: 70, h: 20 },
    { x: 50, y: 120, w: 90, h: 20 },
    { x: 320, y: 140, w: 60, h: 25 },
    { x: 140, y: 60, w: 50, h: 15 },
  ];

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Generate point cloud dots from scan
  const pointCloudDots: Array<{ x: number; y: number; opacity: number; inObstacle: boolean }> = [];

  // Generate scan ray points
  for (let ray = 0; ray < 120; ray++) {
    const angle = ((frame * 3 + ray * 3) % 360) * (Math.PI / 180);
    // Only show points that the beam has recently swept
    const angleDiff = ((scanAngle - angle) * 180 / Math.PI + 360) % 360;
    if (angleDiff > 90) continue; // Only show recently scanned area

    const maxDist = 130;
    const dist = seededRandom(ray * 7.3) * maxDist * 0.6 + maxDist * 0.3;
    const px = robotX + Math.cos(angle) * dist;
    const py = robotY + Math.sin(angle) * dist;

    if (px < 10 || px > 390 || py < 10 || py > 185) continue;

    // Check if near an obstacle
    let inObstacle = false;
    for (const obs of obstacles) {
      if (px >= obs.x - 5 && px <= obs.x + obs.w + 5 && py >= obs.y - 5 && py <= obs.y + obs.h + 5) {
        inObstacle = true;
        break;
      }
    }

    const age = angleDiff / 90;
    pointCloudDots.push({
      x: px + seededRandom(ray * 2.1) * 4 - 2,
      y: py + seededRandom(ray * 3.7) * 4 - 2,
      opacity: (1 - age) * 0.6,
      inObstacle,
    });
  }

  // Dense obstacle point clouds
  for (const obs of obstacles) {
    for (let p = 0; p < 15; p++) {
      const px = obs.x + seededRandom(p * 5.1 + obs.x) * obs.w;
      const py = obs.y + seededRandom(p * 3.3 + obs.y) * obs.h;
      // Check if beam has scanned this area
      const angleToPt = Math.atan2(py - robotY, px - robotX);
      const angleDiff = ((scanAngle - angleToPt) * 180 / Math.PI + 360) % 360;
      if (angleDiff < 120) {
        pointCloudDots.push({
          x: px,
          y: py,
          opacity: Math.max(0, 0.7 - angleDiff / 200),
          inObstacle: true,
        });
      }
    }
  }

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={400} height={220} viewBox="0 0 400 220">
        <defs>
          <radialGradient id="lidarBg" cx="50%" cy="75%" r="60%">
            <stop offset="0%" stopColor="#0a1510" />
            <stop offset="100%" stopColor="#060a08" />
          </radialGradient>
          <radialGradient id="scanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect width={400} height={220} fill="url(#lidarBg)" />

        {/* Grid lines (subtle radar grid) */}
        {[40, 80, 120].map((r) => (
          <circle
            key={r}
            cx={robotX}
            cy={robotY}
            r={r}
            fill="none"
            stroke="#10b981"
            strokeWidth={0.3}
            opacity={0.12}
          />
        ))}
        {/* Radial grid lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={robotX}
              y1={robotY}
              x2={robotX + Math.cos(rad) * 140}
              y2={robotY + Math.sin(rad) * 140}
              stroke="#10b981"
              strokeWidth={0.2}
              opacity={0.08}
            />
          );
        })}

        {/* Scan beam (rotating wedge) */}
        {(() => {
          const beamLen = 150;
          const beamSpread = 0.15; // radians
          const x1 = robotX + Math.cos(scanAngle - beamSpread) * beamLen;
          const y1 = robotY + Math.sin(scanAngle - beamSpread) * beamLen;
          const x2 = robotX + Math.cos(scanAngle + beamSpread) * beamLen;
          const y2 = robotY + Math.sin(scanAngle + beamSpread) * beamLen;
          return (
            <polygon
              points={`${robotX},${robotY} ${x1},${y1} ${x2},${y2}`}
              fill="#10b981"
              opacity={0.08}
            />
          );
        })()}

        {/* Scan line (main beam) */}
        <line
          x1={robotX}
          y1={robotY}
          x2={robotX + Math.cos(scanAngle) * 150}
          y2={robotY + Math.sin(scanAngle) * 150}
          stroke="#10b981"
          strokeWidth={1}
          opacity={0.3}
        />

        {/* Point cloud dots */}
        {pointCloudDots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.inObstacle ? 1.5 : 1}
            fill={dot.inObstacle ? '#f59e0b' : '#10b981'}
            opacity={dot.opacity}
          />
        ))}

        {/* Obstacle outlines (detected rectangles) */}
        {obstacles.map((obs, i) => {
          // Only show if beam has swept across
          const centerAngle = Math.atan2(obs.y + obs.h / 2 - robotY, obs.x + obs.w / 2 - robotX);
          const angleDiff = ((scanAngle - centerAngle) * 180 / Math.PI + 360) % 360;
          const visible = angleDiff < 180;
          if (!visible) return null;

          return (
            <rect
              key={i}
              x={obs.x}
              y={obs.y}
              width={obs.w}
              height={obs.h}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={0.5}
              strokeDasharray="3 3"
              opacity={0.25}
              rx={1}
            />
          );
        })}

        {/* Planned path (cyan dashed line) */}
        <path
          d={`M${waypoints.map((w) => `${w.x},${w.y}`).join(' L')}`}
          fill="none"
          stroke="#00d4ff"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          strokeDashoffset={pathDashOffset}
          opacity={0.6}
        />

        {/* Waypoint markers */}
        {waypoints.slice(1, -1).map((wp, i) => (
          <g key={i}>
            <circle cx={wp.x} cy={wp.y} r={3} fill="none" stroke="#00d4ff" strokeWidth={0.8} opacity={0.5} />
            <circle cx={wp.x} cy={wp.y} r={1} fill="#00d4ff" opacity={0.7} />
          </g>
        ))}

        {/* Destination marker */}
        <g>
          <circle cx={destX} cy={destY} r={6} fill="none" stroke="#00d4ff" strokeWidth={1} opacity={0.6}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={destX} cy={destY} r={2} fill="#00d4ff" opacity={0.8} />
          <text x={destX + 10} y={destY + 3} fill="#00d4ff" fontSize={6} fontFamily="monospace" opacity={0.6}>
            DEST
          </text>
        </g>

        {/* Robot position indicator (pulsing dot) */}
        <circle cx={robotX} cy={robotY} r={8} fill="#10b981" opacity={0.05 * robotPulse} />
        <circle cx={robotX} cy={robotY} r={5} fill="#10b981" opacity={0.1 * robotPulse} />
        <circle cx={robotX} cy={robotY} r={3} fill="#10b981" opacity={robotPulse * 0.8} />
        <circle cx={robotX} cy={robotY} r={1.5} fill="#ffffff" opacity={0.9} />

        {/* Robot direction indicator */}
        <line
          x1={robotX}
          y1={robotY}
          x2={robotX + (waypoints[1].x - robotX) * 0.3}
          y2={robotY + (waypoints[1].y - robotY) * 0.3}
          stroke="#10b981"
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Bottom status bar */}
        <rect x={0} y={196} width={400} height={24} fill="rgba(0,0,0,0.8)" />
        <line x1={0} y1={196} x2={400} y2={196} stroke="#10b981" strokeWidth={0.5} opacity={0.3} />

        {/* SLAM label */}
        <circle
          cx={10}
          cy={208}
          r={3}
          fill="#10b981"
          opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.4, 1])}
        />
        <text x={20} y={212} fill="#10b981" fontSize={8} fontFamily="monospace">
          SLAM ACTIVE
        </text>
        <text x={110} y={212} fill="#10b981" fontSize={8} fontFamily="monospace" opacity={0.3}>
          //
        </text>
        <text x={125} y={212} fill="#00d4ff" fontSize={8} fontFamily="monospace">
          PATH OPTIMIZED
        </text>

        {/* Right side: distance remaining */}
        <text x={390} y={212} fill="#00d4ff" fontSize={7} fontFamily="monospace" textAnchor="end" opacity={0.4}>
          {(3.2 - interpolate(loopFrame, [0, 300], [0, 1.8], { extrapolateRight: 'clamp' })).toFixed(1)}m
        </text>
      </svg>
    </AbsoluteFill>
  );
};
