import React, { useState, useRef, useMemo } from 'react';
import { ChartPoint } from '../data/marketsData';

interface InteractiveChartProps {
  points: ChartPoint[];
  prevClose: number;
  isPositive: boolean;
  height?: number;
  mode?: 'area' | 'candles';
  showRightBadge?: boolean;
  currency?: string;
}

function formatAxisPrice(val: number): string {
  if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (val >= 10) return val.toFixed(2);
  return val.toFixed(4);
}

// Catmull-Rom smooth SVG path generator
function buildSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;
  if (coords.length === 2) return `M ${coords[0].x} ${coords[0].y} L ${coords[1].x} ${coords[1].y}`;

  let d = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(i - 1, 0)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(i + 2, coords.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  points,
  prevClose,
  isPositive,
  height = 290,
  mode = 'area',
  showRightBadge = true,
  currency = '',
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 760;
  const padLeft = 8;
  const padRight = showRightBadge ? 64 : 14;
  const padTop = 18;
  const padBottom = 18;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const strokeColor = isPositive ? '#089981' : '#F23645';
  const gradientId = useMemo(
    () => `chart-grad-${isPositive ? 'pos' : 'neg'}-${Math.random().toString(36).slice(2, 7)}`,
    [isPositive]
  );

  const { minVal, maxVal, coords, prevCloseY, areaPath, linePath } = useMemo(() => {
    if (!points || points.length === 0) {
      return { minVal: 0, maxVal: 1, coords: [], prevCloseY: plotH / 2, areaPath: '', linePath: '' };
    }
    const vals = points.flatMap((p) => (mode === 'candles' ? [p.low, p.high] : [p.value]));
    const rawMin = Math.min(...vals, prevClose);
    const rawMax = Math.max(...vals, prevClose);
    const pad = (rawMax - rawMin) * 0.14 || 1;
    const minV = rawMin - pad;
    const maxV = rawMax + pad;
    const span = maxV - minV || 1;

    const toY = (v: number) => padTop + (1 - (v - minV) / span) * plotH;
    const pts = points.map((p, i) => ({
      x: padLeft + (i / Math.max(points.length - 1, 1)) * plotW,
      y: toY(p.value),
      point: p,
    }));

    const line = buildSmoothPath(pts);
    const area =
      pts.length > 0
        ? `${line} L ${pts[pts.length - 1].x.toFixed(2)} ${(padTop + plotH).toFixed(2)} L ${pts[0].x.toFixed(2)} ${(padTop + plotH).toFixed(2)} Z`
        : '';

    return {
      minVal: minV,
      maxVal: maxV,
      coords: pts,
      prevCloseY: toY(prevClose),
      areaPath: area,
      linePath: line,
    };
  }, [points, prevClose, plotW, plotH, mode]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || coords.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < coords.length; i++) {
      const dist = Math.abs(coords[i].x - relX);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setHoverIdx(closest);
  };

  const activeCoord = hoverIdx !== null ? coords[hoverIdx] : null;
  const lastCoord = coords[coords.length - 1];
  const span = maxVal - minVal || 1;
  const toY = (v: number) => padTop + (1 - (v - minVal) / span) * plotH;

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
            <stop offset="70%" stopColor={strokeColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle horizontal reference gridlines */}
        {[0.25, 0.5, 0.75].map((ratio) => {
          const gy = padTop + plotH * ratio;
          return (
            <line
              key={ratio}
              x1={padLeft}
              y1={gy}
              x2={padLeft + plotW}
              y2={gy}
              stroke="#F3F4F6"
              strokeWidth="1"
            />
          );
        })}

        {/* Previous close dotted baseline */}
        <line
          x1={padLeft}
          y1={prevCloseY}
          x2={padLeft + plotW}
          y2={prevCloseY}
          stroke={strokeColor}
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {mode === 'area' ? (
          <>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          // Candlestick bars
          <g>
            {coords.map((c, idx) => {
              const p = c.point;
              const up = p.close >= p.open;
              const col = up ? '#089981' : '#F23645';
              const yHigh = toY(p.high);
              const yLow = toY(p.low);
              const yOpen = toY(p.open);
              const yClose = toY(p.close);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyH = Math.max(Math.abs(yClose - yOpen), 2.5);
              const candleW = Math.max(4, Math.min(14, plotW / coords.length - 4));
              return (
                <g key={idx}>
                  <line x1={c.x} y1={yHigh} x2={c.x} y2={yLow} stroke={col} strokeWidth="1.4" />
                  <rect
                    x={c.x - candleW / 2}
                    y={bodyTop}
                    width={candleW}
                    height={bodyH}
                    rx="1.2"
                    fill={col}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Right edge live price badge */}
        {showRightBadge && lastCoord && (
          <g transform={`translate(${padLeft + plotW + 4}, ${lastCoord.y - 10})`}>
            <rect width="58" height="20" rx="4" fill={strokeColor} />
            <text
              x="29"
              y="13.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              {formatAxisPrice(lastCoord.point.value)}
            </text>
          </g>
        )}

        {/* Hover crosshair & active point */}
        {activeCoord && (
          <g>
            <line
              x1={activeCoord.x}
              y1={padTop}
              x2={activeCoord.x}
              y2={padTop + plotH}
              stroke="#9CA3AF"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={padLeft}
              y1={activeCoord.y}
              x2={padLeft + plotW}
              y2={activeCoord.y}
              stroke="#9CA3AF"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={activeCoord.x} cy={activeCoord.y} r="6" fill={strokeColor} fillOpacity="0.22" />
            <circle cx={activeCoord.x} cy={activeCoord.y} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      {/* Floating hover tooltip */}
      {activeCoord && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-lg border border-gray-200 bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm text-xs"
          style={{
            left: `${Math.min(Math.max((activeCoord.x / width) * 100, 12), 72)}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-semibold text-gray-900 tabular-nums">
              {currency === 'USD' ? '$' : ''}
              {formatAxisPrice(activeCoord.point.value)}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 font-medium">{activeCoord.point.time}</span>
          </div>
          {mode === 'candles' && (
            <div className="mt-0.5 flex items-center gap-2 text-[10px] font-mono text-gray-500 tabular-nums">
              <span>O {formatAxisPrice(activeCoord.point.open)}</span>
              <span>H {formatAxisPrice(activeCoord.point.high)}</span>
              <span>L {formatAxisPrice(activeCoord.point.low)}</span>
              <span>C {formatAxisPrice(activeCoord.point.close)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
