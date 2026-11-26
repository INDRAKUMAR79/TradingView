import React, { useState } from 'react';
import { X, Star, CandlestickChart, LineChart } from 'lucide-react';
import { Instrument, TimeframeKey } from '../data/marketsData';
import { TickerAvatar } from './TickerAvatar';
import { InteractiveChart } from './InteractiveChart';

interface InstrumentModalProps {
  instrument: Instrument | null;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
  onClose: () => void;
}

const TIMEFRAMES: TimeframeKey[] = ['1D', '5D', '1M', '3M', '1Y', '5Y', 'ALL'];

function fmt(val: number): string {
  const dec = val < 10 ? 4 : 2;
  return val.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export const InstrumentModal: React.FC<InstrumentModalProps> = ({
  instrument,
  isStarred,
  onToggleStar,
  onClose,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1D');
  const [chartMode, setChartMode] = useState<'area' | 'candles'>('area');

  if (!instrument) return null;

  const isPositive = instrument.changePercent >= 0;
  const points = instrument.seriesByTimeframe[timeframe] || instrument.seriesByTimeframe['1D'];

  const ratingColor = instrument.technicalRating.includes('Buy')
    ? 'bg-[#E6F5F2] text-[#089981]'
    : instrument.technicalRating.includes('Sell')
    ? 'bg-[#FEECEF] text-[#F23645]'
    : 'bg-gray-100 text-gray-700';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <TickerAvatar symbol={instrument.shortLabel || instrument.symbol} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-gray-950 truncate">
                  {instrument.name}
                </h2>
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-gray-500">
                  {instrument.symbol}
                </span>
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  {instrument.exchange}
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="font-mono text-2xl font-bold text-gray-950 tabular-nums">
                  {instrument.currency === 'USD' ? '$' : ''}
                  {fmt(instrument.price)}
                </span>
                <span
                  className={`text-xs font-mono font-semibold tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {fmt(instrument.change)} ({isPositive ? '+' : ''}
                  {instrument.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleStar(instrument.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                isStarred
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star className="w-3.5 h-3.5" fill={isStarred ? 'currentColor' : 'none'} />
              <span>{isStarred ? 'Watchlisted' : 'Watchlist'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close chart modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart Controls + Canvas */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-0.5 bg-gray-100 rounded-lg p-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    timeframe === tf
                      ? 'bg-white text-gray-950 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setChartMode('area')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  chartMode === 'area'
                    ? 'bg-white text-gray-950 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Area</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('candles')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  chartMode === 'candles'
                    ? 'bg-white text-gray-950 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <CandlestickChart className="w-3.5 h-3.5" />
                <span>Candles</span>
              </button>
            </div>
          </div>

          <div className="bg-[#F8F9FB] border border-gray-200/80 rounded-2xl p-4">
            <InteractiveChart
              points={points}
              prevClose={instrument.prevClose}
              isPositive={isPositive}
              height={260}
              mode={chartMode}
              currency={instrument.currency}
            />
          </div>

          {/* Key Stats & Technical Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Market Statistics
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-400">Day&apos;s Range</div>
                  <div className="font-mono font-semibold text-gray-900 mt-0.5 tabular-nums">
                    {instrument.dayRange}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">52 Wk Range</div>
                  <div className="font-mono font-semibold text-gray-900 mt-0.5 tabular-nums">
                    {instrument.week52Range}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Previous Close</div>
                  <div className="font-mono font-semibold text-gray-900 mt-0.5 tabular-nums">
                    {fmt(instrument.prevClose)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Volume / Cap</div>
                  <div className="font-mono font-semibold text-gray-900 mt-0.5 tabular-nums">
                    {instrument.volume} {instrument.marketCap ? `· ${instrument.marketCap}` : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Technical Analysis
                </h4>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${ratingColor}`}>
                  {instrument.technicalRating}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-400">RSI (14)</div>
                  <div className="font-mono font-semibold text-gray-900 mt-0.5 tabular-nums">
                    {instrument.rsi.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">MACD (12, 26)</div>
                  <div className="font-mono font-semibold text-gray-900 mt-0.5 tabular-nums">
                    {instrument.macd}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
