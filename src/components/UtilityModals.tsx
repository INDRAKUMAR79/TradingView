import React from 'react';
import { X, Star, Check, Sparkles } from 'lucide-react';
import { Instrument } from '../data/marketsData';
import { TickerAvatar } from './TickerAvatar';

interface WatchlistModalProps {
  isOpen: boolean;
  instruments: Instrument[];
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onClose: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  instruments,
  watchlistIds,
  onToggleWatchlist,
  onSelectInstrument,
  onClose,
}) => {
  if (!isOpen) return null;

  const saved = instruments.filter((i) => watchlistIds.includes(i.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
            <h2 className="font-display text-base font-bold text-gray-950">
              My Watchlist ({saved.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {saved.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="text-sm font-semibold text-gray-700">Your watchlist is empty</p>
              <p className="text-xs text-gray-400 mt-1">
                Click any instrument or star icon in the US Stocks Screener to track it here.
              </p>
            </div>
          ) : (
            saved.map((inst) => {
              const pos = inst.changePercent >= 0;
              const dec = inst.price < 10 ? 4 : 2;
              return (
                <div
                  key={inst.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectInstrument(inst);
                    }}
                    className="flex items-center gap-3 text-left min-w-0 flex-1"
                  >
                    <TickerAvatar symbol={inst.shortLabel || inst.symbol} size="md" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-950 truncate">{inst.symbol}</div>
                      <div className="text-[11px] text-gray-400 truncate">{inst.name}</div>
                    </div>
                  </button>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-gray-950 tabular-nums">
                        {inst.price.toLocaleString('en-US', {
                          minimumFractionDigits: dec,
                          maximumFractionDigits: dec,
                        })}
                      </div>
                      <div
                        className={`text-[11px] font-mono font-semibold tabular-nums ${
                          pos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {pos ? '+' : ''}
                        {inst.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleWatchlist(inst.id)}
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50"
                      title="Remove from watchlist"
                    >
                      <Star className="w-4 h-4" fill="currentColor" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

interface SpecialOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecialOfferModal: React.FC<SpecialOfferModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = React.useState<'Essential' | 'Plus' | 'Premium'>('Plus');

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Essential' as const,
      price: '$12.95',
      discount: '60% OFF',
      features: ['2 charts per tab', '5 indicators per chart', '20 active price alerts', 'Ad-free experience'],
    },
    {
      name: 'Plus' as const,
      price: '$24.95',
      discount: '70% OFF',
      features: ['4 charts per tab', '10 indicators per chart', '100 active price alerts', 'Intraday exotic charts'],
    },
    {
      name: 'Premium' as const,
      price: '$39.95',
      discount: '80% OFF',
      features: ['8 charts per tab', '25 indicators per chart', '400 active price alerts', 'Second-based intervals'],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-gradient-to-r from-[#131722] to-[#1E293B] text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#EA580C] text-[10px] font-bold uppercase mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Limited Time Event</span>
            </div>
            <h2 className="font-display text-xl font-bold">Save up to 80% on MarketView Pro Plans</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8F9FB]">
          {plans.map((p) => {
            const active = selectedPlan === p.name;
            return (
              <div
                key={p.name}
                onClick={() => setSelectedPlan(p.name)}
                className={`rounded-2xl p-5 bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                  active ? 'border-[#2962FF] ring-2 ring-[#2962FF]/15' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-gray-950">{p.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#FEECEF] text-[#F23645] text-[10px] font-bold">
                      {p.discount}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-mono text-2xl font-extrabold text-gray-950">{p.price}</span>
                    <span className="text-xs text-gray-400">/mo</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-gray-600">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#089981] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className={`mt-5 w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#2962FF] text-white hover:bg-[#1E4ED8]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Select {p.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
