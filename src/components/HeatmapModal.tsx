import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HEATMAP_BLOCKS, Instrument } from '../data/marketsData';

interface HeatmapModalProps {
  isOpen: boolean;
  initialTab?: 'stocks' | 'crypto';
  cryptoAssets: Instrument[];
  usStocks: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onClose: () => void;
}

export const HeatmapModal: React.FC<HeatmapModalProps> = ({
  isOpen,
  initialTab = 'stocks',
  cryptoAssets,
  usStocks,
  onSelectInstrument,
  onClose,
}) => {
  const [tab, setTab] = useState<'stocks' | 'crypto'>(initialTab);

  if (!isOpen) return null;

  const getTileColor = (pct: number) => {
    if (pct >= 3) return 'bg-[#057A66] text-white';
    if (pct >= 1) return 'bg-[#089981] text-white';
    if (pct >= 0) return 'bg-[#34D399]/85 text-gray-950';
    if (pct <= -2) return 'bg-[#D92638] text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg font-bold text-gray-950">
              Global Market Heatmap
            </h2>
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setTab('stocks')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  tab === 'stocks' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-500'
                }`}
              >
                US Equities
              </button>
              <button
                type="button"
                onClick={() => setTab('crypto')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  tab === 'crypto' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-500'
                }`}
              >
                Crypto Assets
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            aria-label="Close heatmap"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 bg-[#F8F9FB]">
          {tab === 'stocks' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 auto-rows-[96px] gap-2">
              {HEATMAP_BLOCKS.map((blk) => {
                const spanCls =
                  blk.marketCapWeight >= 4
                    ? 'col-span-2 row-span-2'
                    : blk.marketCapWeight === 3
                    ? 'col-span-2 row-span-1'
                    : blk.marketCapWeight === 2
                    ? 'col-span-2 sm:col-span-1 row-span-2'
                    : 'col-span-1 row-span-1';

                const matched = usStocks.find((s) => s.symbol === blk.symbol);
                const livePct = matched ? matched.changePercent : blk.changePercent;

                return (
                  <button
                    key={blk.symbol}
                    type="button"
                    onClick={() => {
                      if (matched) {
                        onClose();
                        onSelectInstrument(matched);
                      }
                    }}
                    className={`${spanCls} ${getTileColor(
                      livePct
                    )} rounded-xl p-3 flex flex-col justify-between text-left hover:brightness-105 transition-all`}
                  >
                    <div>
                      <div className="font-display font-extrabold text-sm leading-none">
                        {blk.symbol}
                      </div>
                      <div className="text-[10px] opacity-85 mt-1 truncate">{blk.sector}</div>
                    </div>
                    <div className="font-mono font-bold text-sm tabular-nums">
                      {livePct >= 0 ? '+' : ''}
                      {livePct.toFixed(2)}%
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[118px] gap-2.5">
              {cryptoAssets.map((coin, i) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectInstrument(coin);
                  }}
                  className={`${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''} ${getTileColor(
                    coin.changePercent
                  )} rounded-xl p-4 flex flex-col justify-between text-left hover:brightness-105 transition-all`}
                >
                  <div>
                    <div className="font-display font-extrabold text-base">{coin.shortLabel}</div>
                    <div className="text-xs opacity-85">{coin.name}</div>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono font-bold text-base tabular-nums">
                      {coin.changePercent >= 0 ? '+' : ''}
                      {coin.changePercent.toFixed(2)}%
                    </span>
                    <span className="font-mono text-xs opacity-90">{coin.marketCap}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
