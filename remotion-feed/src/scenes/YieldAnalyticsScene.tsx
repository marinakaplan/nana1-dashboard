import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const YieldAnalyticsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loopFrame = frame % 300;

  // Bar chart data (yield by zone)
  const zones = [
    { label: 'A', value: 82, color: '#10b981' },
    { label: 'B', value: 68, color: '#3b82f6' },
    { label: 'C', value: 91, color: '#10b981' },
    { label: 'D', value: 55, color: '#f59e0b' },
  ];

  // Bars grow in at the start
  const barGrow = interpolate(loopFrame, [10, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Animated fruit counter
  const fruitCount = Math.floor(
    interpolate(loopFrame, [20, 180], [0, 1247], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    })
  );
  const fruitCountStr = fruitCount.toLocaleString();

  // Sparkline data (growth trend)
  const sparklinePoints = [
    12, 15, 14, 18, 22, 20, 25, 28, 32, 30,
    35, 38, 36, 42, 45, 48, 52, 55, 58, 62,
  ];
  const maxSpark = Math.max(...sparklinePoints);

  // Sparkline draw-in animation
  const sparkDraw = interpolate(loopFrame, [30, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Pie chart data (health distribution)
  const pieData = [
    { pct: 0.72, color: '#10b981', label: 'Healthy' },
    { pct: 0.18, color: '#f59e0b', label: 'Fair' },
    { pct: 0.10, color: '#ef4444', label: 'Poor' },
  ];

  // Harvest readiness indicators
  const readiness = [
    { label: 'Ready', color: '#10b981', count: 847 },
    { label: '3 days', color: '#f59e0b', count: 312 },
    { label: '1 week', color: '#ef4444', count: 88 },
  ];

  // Pie chart animation
  const pieGrow = interpolate(loopFrame, [50, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Helper to generate pie chart arc path
  const pieArc = (startAngle: number, endAngle: number, cx: number, cy: number, r: number) => {
    const start = {
      x: cx + r * Math.cos(startAngle),
      y: cy + r * Math.sin(startAngle),
    };
    const end = {
      x: cx + r * Math.cos(endAngle),
      y: cy + r * Math.sin(endAngle),
    };
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${largeArc} 1 ${end.x},${end.y} Z`;
  };

  // Bar chart dimensions
  const barAreaX = 15;
  const barAreaY = 30;
  const barAreaW = 120;
  const barAreaH = 80;
  const barWidth = 20;
  const barGap = 10;

  // Sparkline area
  const sparkX = 155;
  const sparkY = 30;
  const sparkW = 90;
  const sparkH = 35;

  // Pie chart area
  const pieCX = 310;
  const pieCY = 55;
  const pieR = 25;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={400} height={220} viewBox="0 0 400 220">
        <defs>
          <linearGradient id="yaBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0e14" />
            <stop offset="100%" stopColor="#0a1210" />
          </linearGradient>
        </defs>

        <rect width={400} height={220} fill="url(#yaBg)" />

        {/* Top header line */}
        <line x1={10} y1={18} x2={390} y2={18} stroke="rgba(0,212,255,0.1)" strokeWidth={0.5} />
        <text x={15} y={14} fill="#00d4ff" fontSize={7} fontFamily="monospace" opacity={0.5}>
          YIELD ANALYTICS
        </text>
        <text x={390} y={14} fill="#00d4ff" fontSize={6} fontFamily="monospace" textAnchor="end" opacity={0.3}>
          REAL-TIME
        </text>

        {/* === BAR CHART: Yield by Zone === */}
        {/* Y-axis */}
        <line x1={barAreaX} y1={barAreaY} x2={barAreaX} y2={barAreaY + barAreaH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const gy = barAreaY + barAreaH - (v / 100) * barAreaH;
          return (
            <g key={v}>
              <line x1={barAreaX} y1={gy} x2={barAreaX + barAreaW} y2={gy} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
              {v > 0 && (
                <text x={barAreaX - 2} y={gy + 3} fill="#00d4ff" fontSize={5} fontFamily="monospace" textAnchor="end" opacity={0.3}>
                  {v}
                </text>
              )}
            </g>
          );
        })}

        {/* Bars */}
        {zones.map((zone, i) => {
          const bx = barAreaX + 8 + i * (barWidth + barGap);
          const barH = (zone.value / 100) * barAreaH * barGrow;
          const by = barAreaY + barAreaH - barH;

          return (
            <g key={i}>
              {/* Bar glow */}
              <rect x={bx - 1} y={by - 1} width={barWidth + 2} height={barH + 2} fill={zone.color} opacity={0.08} rx={2} />
              {/* Bar */}
              <rect x={bx} y={by} width={barWidth} height={barH} fill={zone.color} opacity={0.6} rx={1} />
              {/* Bar top highlight */}
              <rect x={bx} y={by} width={barWidth} height={2} fill={zone.color} opacity={0.9} rx={1} />
              {/* Zone label */}
              <text
                x={bx + barWidth / 2}
                y={barAreaY + barAreaH + 10}
                fill="#00d4ff"
                fontSize={6}
                fontFamily="monospace"
                textAnchor="middle"
                opacity={0.5}
              >
                {zone.label}
              </text>
              {/* Value on top */}
              {barGrow > 0.5 && (
                <text
                  x={bx + barWidth / 2}
                  y={by - 3}
                  fill={zone.color}
                  fontSize={6}
                  fontFamily="monospace"
                  textAnchor="middle"
                  opacity={barGrow}
                >
                  {zone.value}
                </text>
              )}
            </g>
          );
        })}

        {/* Bar chart label */}
        <text x={barAreaX + barAreaW / 2} y={barAreaY + barAreaH + 20} fill="#00d4ff" fontSize={5} fontFamily="monospace" textAnchor="middle" opacity={0.3}>
          YIELD/ZONE
        </text>

        {/* === SPARKLINE: Growth Trend === */}
        <text x={sparkX} y={sparkY - 5} fill="#00d4ff" fontSize={6} fontFamily="monospace" opacity={0.4}>
          GROWTH TREND
        </text>

        {/* Sparkline background */}
        <rect x={sparkX} y={sparkY} width={sparkW} height={sparkH} fill="rgba(255,255,255,0.02)" rx={2} />

        {/* Sparkline path */}
        {(() => {
          const visibleCount = Math.floor(sparklinePoints.length * sparkDraw);
          if (visibleCount < 2) return null;

          const points = sparklinePoints.slice(0, visibleCount).map((v, i) => {
            const px = sparkX + 4 + (i / (sparklinePoints.length - 1)) * (sparkW - 8);
            const py = sparkY + sparkH - 4 - (v / maxSpark) * (sparkH - 8);
            return `${px},${py}`;
          });

          // Area fill
          const firstX = sparkX + 4;
          const lastX = sparkX + 4 + ((visibleCount - 1) / (sparklinePoints.length - 1)) * (sparkW - 8);
          const areaPath = `M${firstX},${sparkY + sparkH - 4} L${points.join(' L')} L${lastX},${sparkY + sparkH - 4} Z`;

          return (
            <g>
              <path d={areaPath} fill="#10b981" opacity={0.08} />
              <polyline
                points={points.join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth={1.5}
                opacity={0.7}
              />
              {/* Current point dot */}
              {visibleCount > 0 && (() => {
                const lastPt = points[points.length - 1].split(',');
                return (
                  <circle
                    cx={Number(lastPt[0])}
                    cy={Number(lastPt[1])}
                    r={2}
                    fill="#10b981"
                    opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1])}
                  />
                );
              })()}
            </g>
          );
        })()}

        {/* === FRUIT COUNTER === */}
        <rect x={155} y={72} width={90} height={22} rx={3} fill="rgba(0,0,0,0.4)" stroke="rgba(0,212,255,0.15)" strokeWidth={0.5} />
        <text x={200} y={80} fill="#00d4ff" fontSize={5} fontFamily="monospace" textAnchor="middle" opacity={0.5}>
          FRUITS DETECTED
        </text>
        <text x={200} y={90} fill="#00d4ff" fontSize={10} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          {fruitCountStr}
        </text>

        {/* === PIE CHART: Health Distribution === */}
        <text x={pieCX} y={pieCY - pieR - 5} fill="#00d4ff" fontSize={6} fontFamily="monospace" textAnchor="middle" opacity={0.4}>
          HEALTH
        </text>

        {/* Pie slices */}
        {(() => {
          let currentAngle = -Math.PI / 2;
          return pieData.map((slice, i) => {
            const sliceAngle = slice.pct * Math.PI * 2 * pieGrow;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle = endAngle;

            if (sliceAngle < 0.01) return null;

            return (
              <path
                key={i}
                d={pieArc(startAngle, endAngle, pieCX, pieCY, pieR)}
                fill={slice.color}
                opacity={0.5}
                stroke="#0a0e14"
                strokeWidth={1}
              />
            );
          });
        })()}

        {/* Pie center hole (donut) */}
        <circle cx={pieCX} cy={pieCY} r={pieR * 0.55} fill="#0a0e14" />
        <text x={pieCX} y={pieCY + 3} fill="#10b981" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          {Math.round(72 * pieGrow)}%
        </text>

        {/* Pie legend */}
        {pieData.map((slice, i) => (
          <g key={i} transform={`translate(${pieCX + pieR + 8}, ${pieCY - 15 + i * 12})`}>
            <circle cx={0} cy={0} r={2.5} fill={slice.color} opacity={0.7} />
            <text x={6} y={3} fill={slice.color} fontSize={5} fontFamily="monospace" opacity={0.6}>
              {slice.label}
            </text>
          </g>
        ))}

        {/* === HARVEST READINESS INDICATORS === */}
        <line x1={10} y1={130} x2={390} y2={130} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />

        <text x={15} y={145} fill="#00d4ff" fontSize={6} fontFamily="monospace" opacity={0.4}>
          HARVEST READINESS
        </text>

        {readiness.map((r, i) => {
          const rx = 15 + i * 75;
          const ry = 155;
          const countAnim = Math.floor(
            interpolate(loopFrame, [40 + i * 20, 140 + i * 20], [0, r.count], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            })
          );

          return (
            <g key={i}>
              {/* Indicator circle */}
              <circle cx={rx + 4} cy={ry + 2} r={4} fill={r.color} opacity={0.6} />
              <circle cx={rx + 4} cy={ry + 2} r={2} fill={r.color} opacity={0.9} />
              {/* Label */}
              <text x={rx + 12} y={ry + 5} fill={r.color} fontSize={7} fontFamily="monospace">
                {countAnim}
              </text>
              <text x={rx + 12} y={ry + 14} fill={r.color} fontSize={5} fontFamily="monospace" opacity={0.4}>
                {r.label}
              </text>
            </g>
          );
        })}

        {/* === HARVEST WINDOW PREDICTION === */}
        <rect x={250} y={148} width={140} height={28} rx={3} fill="rgba(0,0,0,0.4)" stroke="rgba(16,185,129,0.2)" strokeWidth={0.5} />

        {/* Pulsing icon */}
        <circle
          cx={265}
          cy={162}
          r={4}
          fill="none"
          stroke="#10b981"
          strokeWidth={1}
          opacity={interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 0.8])}
        />
        <circle cx={265} cy={162} r={1.5} fill="#10b981" opacity={0.8} />

        <text x={275} y={159} fill="#10b981" fontSize={5} fontFamily="monospace" opacity={0.5}>
          HARVEST WINDOW
        </text>
        <text x={275} y={170} fill="#10b981" fontSize={10} fontFamily="monospace" fontWeight="bold">
          48H
        </text>
        <text x={305} y={170} fill="#10b981" fontSize={6} fontFamily="monospace" opacity={0.4}>
          PREDICTED
        </text>

        {/* Bottom status bar */}
        <rect x={0} y={196} width={400} height={24} fill="rgba(0,0,0,0.7)" />
        <line x1={0} y1={196} x2={400} y2={196} stroke="#00d4ff" strokeWidth={0.5} opacity={0.2} />

        <circle
          cx={10}
          cy={208}
          r={3}
          fill="#10b981"
          opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.4, 1])}
        />
        <text x={20} y={212} fill="#10b981" fontSize={8} fontFamily="monospace">
          ANALYTICS LIVE
        </text>
        <text x={120} y={212} fill="#10b981" fontSize={8} fontFamily="monospace" opacity={0.3}>
          //
        </text>
        <text x={135} y={212} fill="#00d4ff" fontSize={8} fontFamily="monospace">
          {fruitCountStr} DETECTED
        </text>

        <text x={390} y={212} fill="#00d4ff" fontSize={7} fontFamily="monospace" textAnchor="end" opacity={0.4}>
          GH-04
        </text>
      </svg>
    </AbsoluteFill>
  );
};
