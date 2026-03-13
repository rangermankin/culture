import React, { useMemo } from 'react';
import { bookOrder } from '../data/books';
import { questions } from '../data/questions';

const AXIS_ORDER = ['pg', 'uw', 'ltw', 'ths', 'cp', 'inv', 'sd', 'ex', 'mat'];

const LABELS = {
  pg: ['Player of', 'Games'],
  uw: ['Use of', 'Weapons'],
  ltw: ['Look to', 'Windward'],
  ths: ['Hydrogen', 'Sonata'],
  cp: ['Consider', 'Phlebas'],
  inv: ['Inversions', ''],
  sd: ['Surface', 'Detail'],
  ex: ['Excession', ''],
  mat: ['Matter', ''],
};

const SECTIONS = [
  {
    key: 'self',
    title: 'Self',
    subtitle: 'The examined individual',
    books: ['pg', 'uw'],
    fill: '#EDF3FC',
    stroke: '#3A6FBF',
  },
  {
    key: 'legacy',
    title: 'Legacy',
    subtitle: 'Time, endings, what persists',
    books: ['ltw', 'ths'],
    fill: '#F1EEF9',
    stroke: '#7A5AAF',
  },
  {
    key: 'ethics',
    title: 'Ethics',
    subtitle: 'Power, agency, consequence',
    books: ['cp', 'inv', 'sd'],
    fill: '#FBEFE8',
    stroke: '#C25B3A',
  },
  {
    key: 'encounter',
    title: 'Encounter',
    subtitle: 'The unknown, the vast, the other',
    books: ['ex', 'mat'],
    fill: '#ECF7F2',
    stroke: '#5A9A50',
  },
];

// Precompute the theoretical max score per book
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

const N = AXIS_ORDER.length;
const CX = 190;
const CY = 180;
const R = 105;
const LABEL_R = R + 30;
const SECTION_LABEL_R = R + 68;

function angle(i) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / N;
}

function polarToXY(r, i) {
  const a = angle(i);
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function polarToXYAngle(r, a) {
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function polygonPoints(scores) {
  return AXIS_ORDER
    .map((key, i) => {
      const max = MAX_SCORES[key] || 1;
      const ratio = Math.min((scores[key] || 0) / max, 1);
      return polarToXY(ratio * R, i).join(',');
    })
    .join(' ');
}

function gridPoints(ratio) {
  return AXIS_ORDER.map((_, i) => polarToXY(ratio * R, i).join(',')).join(' ');
}

function textAnchorForAngle(a) {
  const cos = Math.cos(a);
  if (cos > 0.15) return 'start';
  if (cos < -0.15) return 'end';
  return 'middle';
}

function textAnchor(i) {
  return textAnchorForAngle(angle(i));
}

function sectionPath(startIndex, endIndex) {
  const startAngle = angle(startIndex) - Math.PI / N;
  const endAngle = angle(endIndex) + Math.PI / N;

  const [x1, y1] = polarToXYAngle(R, startAngle);
  const [x2, y2] = polarToXYAngle(R, endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${CX} ${CY}`,
    `L ${x1} ${y1}`,
    `A ${R} ${R} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z',
  ].join(' ');
}

function sectionLabelPosition(startIndex, endIndex) {
  const startAngle = angle(startIndex) - Math.PI / N;
  const endAngle = angle(endIndex) + Math.PI / N;
  const midAngle = (startAngle + endAngle) / 2;
  const [x, y] = polarToXYAngle(SECTION_LABEL_R, midAngle);
  return { x, y, midAngle };
}

export default function RadarChart({ scores }) {
  const filled = useMemo(() => polygonPoints(scores), [scores]);
  const hasAnyScore = AXIS_ORDER.some((k) => (scores[k] || 0) > 0);

  const sectionMeta = useMemo(() => {
    return SECTIONS.map((section) => {
      const startIndex = AXIS_ORDER.indexOf(section.books[0]);
      const endIndex = AXIS_ORDER.indexOf(section.books[section.books.length - 1]);
      return {
        ...section,
        startIndex,
        endIndex,
        path: sectionPath(startIndex, endIndex),
        labelPos: sectionLabelPosition(startIndex, endIndex),
      };
    });
  }, []);

  return (
    <div className="radar-wrap">
      <p className="radar-heading">Personality map</p>
      <svg
        viewBox="0 0 380 380"
        className="radar-svg"
        aria-label="Radar chart showing personality scores across 9 Culture novels"
      >
        {/* Section backgrounds */}
        {sectionMeta.map((section) => (
          <path
            key={section.key}
            d={section.path}
            fill={section.fill}
            stroke={section.stroke}
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={gridPoints(ratio)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={ratio === 1 ? 1.5 : 1}
            opacity={ratio === 1 ? 0.8 : 0.55}
          />
        ))}

        {/* Axis spokes */}
        {AXIS_ORDER.map((_, i) => {
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
              opacity={0.6}
            />
          );
        })}

        {/* Section boundary spokes */}
        {sectionMeta.map((section) => {
          const boundaryAngle = angle(section.startIndex) - Math.PI / N;
          const [x, y] = polarToXYAngle(R, boundaryAngle);
          return (
            <line
              key={`${section.key}-boundary`}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke={section.stroke}
              strokeWidth={1.25}
              opacity={0.65}
            />
          );
        })}

        {/* Filled score polygon */}
        {hasAnyScore && (
          <polygon
            points={filled}
            fill="var(--accent-blue)"
            fillOpacity={0.2}
            stroke="var(--accent-blue)"
            strokeWidth={2.25}
            strokeLinejoin="round"
          />
        )}

        {/* Axis dots */}
        {AXIS_ORDER.map((key, i) => {
          const max = MAX_SCORES[key] || 1;
          const ratio = Math.min((scores[key] || 0) / max, 1);
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
        {AXIS_ORDER.map((key, i) => {
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
              {lines[1] && <tspan x={lx} dy={lineH}>{lines[1]}</tspan>}
            </text>
          );
        })}

        {/* Section labels */}
        {sectionMeta.map((section) => {
          const { x, y, midAngle } = section.labelPos;
          const anchor = textAnchorForAngle(midAngle);

          return (
            <text
              key={`${section.key}-label`}
              x={x}
              y={y}
              textAnchor={anchor}
              fontFamily="var(--font-body)"
              dominantBaseline="middle"
            >
              <tspan
                x={x}
                dy="0"
                fontSize="12"
                fontWeight="700"
                fill={section.stroke}
              >
                {section.title}
              </tspan>
              <tspan
                x={x}
                dy="14"
                fontSize="9.5"
                fontWeight="500"
                fill="var(--text-muted)"
              >
                {section.subtitle}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
