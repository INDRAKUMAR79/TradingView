import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Instrument } from '../data/marketsData';
import { TickerAvatar } from './TickerAvatar';

interface SearchCommandModalProps {
  isOpen: boolean;
  instruments: Instrument[];
  onSelect: (instrument: Instrument) => void;
  onClose: () => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  isOpen,
  instruments,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return instruments
      .filter((inst) => {
        const matchCat =
          filterCat === 'All' ||
          (filterCat === 'Stocks' && inst.category === 'US stocks') ||
          (filterCat === 'Indices' && (inst.category === 'Indices' || inst.category === 'World stocks')) ||
          (filterCat === 'Crypto' && inst.category === 'Crypto') ||
          (filterCat === 'Forex & Futures' &&
            (inst.category === 'Forex & currencies' || inst.category === 'Futures & commodities'));
        const matchQ =
          !q ||
          inst.symbol.toLowerCase().includes(q) ||
          inst.name.toLowerCase().includes(q) ||
          inst.exchange.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .slice(0, 10);
  }, [instruments, query, filterCat]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Row */}
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, index, crypto, or FX pair..."
            className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Stocks', 'Indices', 'Crypto', 'Forex & Futures'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCat === cat
                  ? 'bg-[#131722] text-white'
                  : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {results.map((inst) => {
            const pos = inst.changePercent >= 0;
            const dec = inst.price < 10 ? 4 : 2;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => {
                  onSelect(inst);
                  onClose();
                }}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TickerAvatar symbol={inst.shortLabel || inst.symbol} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-950">{inst.symbol}</span>
                      <span className="text-xs text-gray-500 truncate">{inst.name}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {inst.exchange} · {inst.category}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
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
              </button>
            );
          })}
          {results.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No matching instruments found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
