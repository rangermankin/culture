import React, { useMemo } from 'react';
import { bookOrder } from '../data/books';
import { questions } from '../data/questions';

// Concept labels for each axis (what the axis actually measures)
const LABELS = {
  cp:  ['Pragmatism', ''],
  pg:  ['Mastery', ''],
  uw:  ['Identity', ''],
  ex:  ['Wonder', ''],
  inv: ['Influence', ''],
  ltw: ['Memory', ''],
  mat: ['Growth', ''],
  sd:  ['Justice', ''],
  ths: ['Transcendence', ''],
};

// Quadrant groupings
// div: fractional axis index of the leading divider line
// mid: fractional axis index of the quadrant label midpoint
const QUADRANTS = [
  { label: 'Self',      sub: 'The examined individual',          div: -0.5, mid: 0.5 },
  { label: 'Legacy',    sub: 'Time, endings, what persists',     div:  1.5, mid: 2.5 },
  { label: 'Ethics',    sub: 'Power, agency, consequence',       div:  3.5, mid: 5.0 },
  { label: 'Encounter', sub: 'The unknown, the vast, the other', div:  6.5, mid: 7.5 },
];

// Precompute the theoretical max score per book
// (sum, across all questions, of the highest weight that book gets in any single answer)
const MAX_SCORES = (() => {
  const maxes = Object.fromEntries(bookOrder.map((k) => [k, 0]));
  questions.forEach((q) => {
    const qMax = Object.fromEntries(bookOrder.map((k) => [k, 0]));
    q.options.forEach((opt) => {
      Object.entries(opt.weights).forEach(([key, val]) => {
        if (qMax[key] !== undefined) {
          qMax[key] = Math.max(qMax[key], val);
        }
      });
    });
    bookOrder.forEach((k) => {
      maxes[k] += qMax[k];
    });
  });
  return maxes;
})();

// Typical users score ~55% of the theoretical max on their top axis.
// Scaling by this factor makes the polygon fill most of the chart.
const SCALE_FACTOR = 0.55;

const N = bookOrder.length; // 9
const CX = 180;
const CY = 180;
const R = 95;        // radius of chart area
const LABEL_R = 127; // where axis labels sit
const DIV_R = 145;   // quadrant divider lines extend to here
const QUAD_R = 158;  // quadrant category labels sit here

function angle(i) {
  // Start from top (−π/2), go clockwise; accepts fractional indices
  return -Math.PI / 2 + (i * 2 * Math.PI) / N;
}

function polarToXY(r, i) {
  const a = angle(i);
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function polygonPoints(scores) {
  return bookOrder
    .map((key, i) => {
      const max = (MAX_SCORES[key] || 1) * SCALE_FACTOR;
      const ratio = Math.min(scores[key] / max, 1);
      return polarToXY(ratio * R, i).join(',');
    })
    .join(' ');
}

function gridPoints(ratio) {
  return bookOrder.map((_, i) => polarToXY(ratio * R, i).join(',')).join(' ');
}

function textAnchor(i) {
  const a = angle(i);
  const cos = Math.cos(a);
  if (cos > 0.15) return 'start';
  if (cos < -0.15) return 'end';
  return 'middle';
}

// Inward-facing anchor for quadrant labels at large radius to prevent overflow
function quadTextAnchor(fi) {
  const cos = Math.cos(angle(fi));
  if (cos > 0.15) return 'end';
  if (cos < -0.15) return 'start';
  return 'middle';
}

export default function RadarChart({ scores }) {
  const filled = useMemo(() => polygonPoints(scores), [scores]);
  const hasAnyScore = bookOrder.some((k) => scores[k] > 0);

  return (
    <div className="radar-wrap">
      <p className="radar-heading">Personality map</p>
      <svg
        viewBox="0 0 360 360"
        className="radar-svg"
        aria-label="Radar chart showing personality scores across 9 Culture novels"
      >
        {/* Quadrant divider lines — from center, past outer ring and axis labels */}
        {QUADRANTS.map((q) => {
          const [x2, y2] = polarToXY(DIV_R, q.div);
          return (
            <line
              key={`qdiv-${q.label}`}
              x1={CX}
              y1={CY}
              x2={x2}
              y2={y2}
              stroke="var(--border)"
              strokeWidth={1.5}
              opacity={0.7}
            />
          );
        })}

        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={gridPoints(ratio)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={ratio === 1 ? 1.5 : 1}
            opacity={ratio === 1 ? 0.7 : 0.45}
          />
        ))}

        {/* Axis spokes */}
        {bookOrder.map((_, i) => {
          const [x, y] = polarToXY(R, i);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}

        {/* Filled score polygon */}
        {hasAnyScore && (
          <polygon
            points={filled}
            fill="var(--accent-blue)"
            fillOpacity={0.18}
            stroke="var(--accent-blue)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        )}

        {/* Dot at each axis tip */}
        {bookOrder.map((key, i) => {
          const max = (MAX_SCORES[key] || 1) * SCALE_FACTOR;
          const ratio = Math.min(scores[key] / max, 1);
          if (ratio === 0) return null;
          const [x, y] = polarToXY(ratio * R, i);
          return (
            <circle
              key={key}
              cx={x}
              cy={y}
              r={3.5}
              fill="var(--accent-blue)"
              opacity={0.9}
            />
          );
        })}

        {/* Axis labels */}
        {bookOrder.map((key, i) => {
          const [lx, ly] = polarToXY(LABEL_R, i);
          const anchor = textAnchor(i);
          const lines = LABELS[key];
          const lineH = 13;
          const baseY = lines[1] ? ly - lineH / 2 : ly;

          return (
            <text
              key={key}
              x={lx}
              y={baseY}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="10"
              fontFamily="var(--font-body)"
              fill="var(--text-secondary)"
              fontWeight="500"
            >
              <tspan x={lx} dy="0">{lines[0]}</tspan>
              {lines[1] && (
                <tspan x={lx} dy={lineH}>{lines[1]}</tspan>
              )}
            </text>
          );
        })}

        {/* Quadrant category labels */}
        {QUADRANTS.map((q) => {
          const [lx, ly] = polarToXY(QUAD_R, q.mid);
          const anchor = quadTextAnchor(q.mid);
          return (
            <text
              key={`qlabel-${q.label}`}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontFamily="var(--font-body)"
              fill="var(--text-secondary)"
            >
              <tspan x={lx} dy="-5" fontSize="9" fontWeight="600">{q.label}</tspan>
              <tspan x={lx} dy="13" fontSize="7.5" opacity="0.7">{q.sub}</tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
