import type { Metrics } from '@/types';

interface RadarChartProps {
  metrics: Metrics;
  size?: number;
}

export function RadarChart({ metrics, size = 200 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;

  const labels = [
    { key: 'coverageRate', name: '覆盖率', max: 100 },
    { key: 'waitTime', name: '等待时长', max: 60 },
    { key: 'wasteRate', name: '浪费率', max: 100 },
    { key: 'workPressure', name: '人力压力', max: 100 },
  ];

  const normalizedValues = [
    metrics.coverageRate / 100,
    (60 - metrics.waitTime) / 60,
    (100 - metrics.wasteRate) / 100,
    (100 - metrics.workPressure) / 100,
  ];

  const angles = labels.map((_, i) => (Math.PI * 2 * i) / labels.length - Math.PI / 2);

  const getPoint = (angle: number, value: number) => {
    const r = radius * value;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = angles.map((angle, i) => getPoint(angle, normalizedValues[i]));
  const dataPath = dataPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + ' Z';

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} className="overflow-visible">
      <defs>
        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF8C42" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {gridLevels.map((level, i) => {
        const points = angles
          .map((angle) => {
            const p = getPoint(angle, level);
            return `${p.x},${p.y}`;
          })
          .join(' ');
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {angles.map((angle, i) => {
        const outer = getPoint(angle, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={outer.x}
            y2={outer.y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      <path d={dataPath} fill="url(#radarGradient)" stroke="#FF8C42" strokeWidth="2" />

      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#FF8C42"
          stroke="white"
          strokeWidth="2"
        />
      ))}

      {labels.map((label, i) => {
        const labelPos = getPoint(angles[i], 1.18);
        return (
          <text
            key={i}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600 font-medium"
          >
            {label.name}
          </text>
        );
      })}
    </svg>
  );
}
