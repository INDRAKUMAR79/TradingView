import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowRight,
  Star,
  LayoutGrid,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
} from 'lucide-react';
import {
  Instrument,
  MarketCategory,
  BONDS_DATA,
  US_YIELD_CURVE,
  ETFS_DATA,
  ECONOMIC_CALENDAR,
  ADDITIONAL_WORLD_INDICES,
  WORLD_INDICES_PANEL,
} from '../data/marketsData';
import { TickerAvatar } from './TickerAvatar';
import { Sparkline } from './Sparkline';
import { CountryFlag } from './CountryFlag';

interface MarketScreensProps {
  category: MarketCategory;
  usStocks: Instrument[];
  cryptoAssets: Instrument[];
  commoditiesForex: Instrument[];
  majorIndices: Instrument[];
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenHeatmap: (tab?: 'stocks' | 'crypto') => void;
}

function fmt(val: number, dec?: number): string {
  const d = dec ?? (val < 10 ? 4 : 2);
  return val.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export const MarketScreens: React.FC<MarketScreensProps> = ({
  category,
  usStocks,
  cryptoAssets,
  commoditiesForex,
  majorIndices,
  watchlistIds,
  onToggleWatchlist,
  onSelectInstrument,
  onOpenHeatmap,
}) => {
  // US Stocks Screener state
  const [stockQuery, setStockQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [sortField, setSortField] = useState<'price' | 'changePercent'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  // World Stocks Region filter
  const [regionFilter, setRegionFilter] = useState<'All' | 'Americas' | 'Europe' | 'Asia-Pacific'>('All');

  // Economy Calendar filters
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH IMPACT' | 'MED IMPACT' | 'LOW IMPACT'>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');

  // FX Converter state
  const [fxAmount, setFxAmount] = useState<string>('1000');
  const [fxPairId, setFxPairId] = useState<string>('eurusd');

  const sectors = useMemo(
    () => ['All', ...Array.from(new Set(usStocks.map((s) => s.sector || 'Other')))],
    [usStocks]
  );

  const filteredStocks = useMemo(() => {
    return usStocks
      .filter((s) => {
        const matchSector = sectorFilter === 'All' || s.sector === sectorFilter;
        const q = stockQuery.trim().toLowerCase();
        const matchQuery =
          !q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        return matchSector && matchQuery;
      })
      .sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortAsc ? diff : -diff;
      });
  }, [usStocks, sectorFilter, stockQuery, sortField, sortAsc]);

  // 1. US STOCKS SCREEN
  if (category === 'US stocks') {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-[#089981] uppercase tracking-wider mb-1">
              NASDAQ • NYSE • AMEX
            </div>
            <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
              US Stocks Screener
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Screen real-time quotes, valuation ratios, technical ratings, and 7-day trends across US equities.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenHeatmap('stocks')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-900 self-start md:self-auto"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#2962FF]" />
            <span>Open S&amp;P 500 Heatmap</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={stockQuery}
              onChange={(e) => setStockQuery(e.target.value)}
              placeholder="Filter ticker or company (e.g. NVDA, Apple)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:outline-none focus:border-[#2962FF]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSectorFilter(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  sectorFilter === sec
                    ? 'bg-[#131722] text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-950'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Screener Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 pl-6 pr-3 w-8"></th>
                  <th className="py-3.5 px-3">TICKER / COMPANY</th>
                  <th className="py-3.5 px-3">SECTOR</th>
                  <th className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === 'price') setSortAsc(!sortAsc);
                        else {
                          setSortField('price');
                          setSortAsc(false);
                        }
                      }}
                      className="inline-flex items-center gap-1 hover:text-gray-700"
                    >
                      <span>PRICE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === 'changePercent') setSortAsc(!sortAsc);
                        else {
                          setSortField('changePercent');
                          setSortAsc(false);
                        }
                      }}
                      className="inline-flex items-center gap-1 hover:text-gray-700"
                    >
                      <span>CHANGE %</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-3 text-right">VOLUME</th>
                  <th className="py-3.5 px-3 text-right">MKT CAP</th>
                  <th className="py-3.5 px-3 text-right">P/E</th>
                  <th className="py-3.5 px-3">RATING</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">TREND (7D)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {filteredStocks.map((stock) => {
                  const pos = stock.changePercent >= 0;
                  const starred = watchlistIds.includes(stock.id);
                  const ratingColor =
                    stock.technicalRating.includes('Buy')
                      ? 'text-[#089981]'
                      : stock.technicalRating.includes('Sell')
                      ? 'text-[#F23645]'
                      : 'text-gray-500';
                  return (
                    <tr
                      key={stock.id}
                      onClick={() => onSelectInstrument(stock)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onToggleWatchlist(stock.id)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            starred ? 'text-amber-500' : 'text-gray-300 hover:text-gray-500'
                          }`}
                          aria-label="Toggle watchlist"
                        >
                          <Star className="w-3.5 h-3.5" fill={starred ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <TickerAvatar symbol={stock.symbol} size="md" />
                          <div>
                            <div className="font-bold text-gray-950">{stock.symbol}</div>
                            <div className="text-[11px] text-gray-400">{stock.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-gray-600">{stock.sector}</td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950 tabular-nums">
                        ${fmt(stock.price)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold tabular-nums ${
                            pos ? 'bg-[#E6F5F2] text-[#089981]' : 'bg-[#FEECEF] text-[#F23645]'
                          }`}
                        >
                          {pos ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-gray-600 tabular-nums">
                        {stock.volume}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-gray-600 tabular-nums">
                        {stock.marketCap}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-gray-600 tabular-nums">
                        {stock.peRatio}
                      </td>
                      <td className={`py-3.5 px-3 text-xs font-semibold ${ratingColor}`}>
                        {stock.technicalRating}
                      </td>
                      <td className="py-3.5 pl-3 pr-6">
                        <div className="flex justify-end">
                          <Sparkline data={stock.sparkline} isPositive={pos} width={72} height={22} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-sm text-gray-400">
                      No US stocks match &ldquo;{stockQuery}&rdquo;. Try clearing your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. WORLD STOCKS SCREEN
  if (category === 'World stocks') {
    const allWorld = [
      ...majorIndices,
      ...WORLD_INDICES_PANEL.filter((w) => !majorIndices.some((m) => m.id === w.id)),
      ...ADDITIONAL_WORLD_INDICES,
    ].filter((i) => regionFilter === 'All' || i.region === regionFilter);

    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
              World Stocks &amp; Regional Indices
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track equity benchmarks across Americas, EMEA, and Asia-Pacific trading sessions.
            </p>
          </div>
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-1 self-start">
            {(['All', 'Americas', 'Europe', 'Asia-Pacific'] as const).map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  regionFilter === reg
                    ? 'bg-[#131722] text-white'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWorld.map((idx) => {
            const pos = idx.changePercent >= 0;
            return (
              <button
                key={idx.id}
                type="button"
                onClick={() => onSelectInstrument(idx)}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 text-left transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <TickerAvatar symbol={idx.symbol} size="md" />
                    <div>
                      <div className="text-sm font-bold text-gray-950 group-hover:text-[#2962FF] transition-colors">
                        {idx.name}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {idx.exchange} · {idx.region}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold tabular-nums ${
                      pos ? 'bg-[#E6F5F2] text-[#089981]' : 'bg-[#FEECEF] text-[#F23645]'
                    }`}
                  >
                    {pos ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-xl font-bold text-gray-950 tabular-nums">
                      {fmt(idx.price)}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 font-mono tabular-nums">
                      52W: {idx.week52Range}
                    </div>
                  </div>
                  <Sparkline data={idx.sparkline} isPositive={pos} width={84} height={28} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. CRYPTO SCREEN
  if (category === 'Crypto') {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309] text-[11px] font-semibold mb-2">
              24/7 Live Digital Assets
            </div>
            <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
              Cryptocurrency Market
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Global Crypto Market Cap: <span className="font-mono font-bold text-gray-900">$3.28T</span> (+2.74%) · BTC Dominance: <span className="font-mono font-bold text-gray-900">58.5%</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenHeatmap('crypto')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-900 self-start"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#2962FF]" />
            <span>Crypto Heatmap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptoAssets.map((coin) => {
            const pos = coin.changePercent >= 0;
            const dec = coin.price < 10 ? 3 : 2;
            return (
              <button
                key={coin.id}
                type="button"
                onClick={() => onSelectInstrument(coin)}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 text-left transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <TickerAvatar symbol={coin.shortLabel || coin.symbol} size="md" />
                    <div>
                      <div className="text-sm font-bold text-gray-950 group-hover:text-[#2962FF] transition-colors">
                        {coin.name}
                      </div>
                      <div className="text-[11px] text-gray-400">{coin.symbol}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold tabular-nums ${
                      pos ? 'bg-[#E6F5F2] text-[#089981]' : 'bg-[#FEECEF] text-[#F23645]'
                    }`}
                  >
                    {pos ? '+' : ''}
                    {coin.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-xl font-bold text-gray-950 tabular-nums">
                      ${fmt(coin.price, dec)}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Vol: {coin.volume} · Cap: {coin.marketCap}
                    </div>
                  </div>
                  <Sparkline data={coin.sparkline} isPositive={pos} width={84} height={28} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. FUTURES & COMMODITIES SCREEN
  if (category === 'Futures & commodities') {
    const futures = commoditiesForex.filter((c) => c.category === 'Futures & commodities');
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
            Futures &amp; Commodities
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Continuous front-month contracts across precious metals, crude oil, and natural gas.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 pl-6 pr-4">CONTRACT</th>
                  <th className="py-3.5 px-4 text-right">LAST</th>
                  <th className="py-3.5 px-4 text-right">CHANGE</th>
                  <th className="py-3.5 px-4 text-right">CHANGE %</th>
                  <th className="py-3.5 px-4 text-right">DAY&apos;S RANGE</th>
                  <th className="py-3.5 px-4 text-right">VOLUME</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">TREND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {futures.map((item) => {
                  const pos = item.changePercent >= 0;
                  const dec = item.symbol === 'NG1!' ? 3 : 2;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectInstrument(item)}
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <TickerAvatar symbol={item.symbol} size="md" />
                          <div>
                            <div className="font-bold text-gray-950">{item.name}</div>
                            <div className="text-[11px] text-gray-400">{item.exchange}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950 tabular-nums">
                        {fmt(item.price, dec)}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-medium tabular-nums ${
                          pos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {pos ? '+' : ''}
                        {item.change.toFixed(dec)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-mono font-semibold tabular-nums ${
                            pos ? 'bg-[#E6F5F2] text-[#089981]' : 'bg-[#FEECEF] text-[#F23645]'
                          }`}
                        >
                          {pos ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-gray-500 tabular-nums">
                        {item.dayRange}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600 tabular-nums">
                        {item.volume}
                      </td>
                      <td className="py-3.5 pl-4 pr-6">
                        <div className="flex justify-end">
                          <Sparkline data={item.sparkline} isPositive={pos} width={78} height={24} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 5. FOREX & CURRENCIES SCREEN
  if (category === 'Forex & currencies') {
    const fxPairs = commoditiesForex.filter((c) => c.category === 'Forex & currencies');
    const selectedFx = fxPairs.find((f) => f.id === fxPairId) || fxPairs[0];
    const amtNum = parseFloat(fxAmount) || 0;
    const converted = amtNum * selectedFx.price;

    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
            Forex &amp; Global Currencies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Major spot FX pairs, currency conversion calculator, and technical signals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 pl-6 pr-4">PAIR</th>
                  <th className="py-3.5 px-4 text-right">RATE</th>
                  <th className="py-3.5 px-4 text-right">CHANGE %</th>
                  <th className="py-3.5 px-4">SIGNAL</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">TREND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {fxPairs.map((pair) => {
                  const pos = pair.changePercent >= 0;
                  const dec = pair.symbol === 'USDJPY' ? 2 : 4;
                  return (
                    <tr
                      key={pair.id}
                      onClick={() => onSelectInstrument(pair)}
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <TickerAvatar symbol={pair.symbol} size="md" />
                          <div>
                            <div className="font-bold text-gray-950">{pair.name}</div>
                            <div className="text-[11px] text-gray-400">{pair.exchange}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950 tabular-nums">
                        {fmt(pair.price, dec)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-mono font-semibold tabular-nums ${
                            pos ? 'bg-[#E6F5F2] text-[#089981]' : 'bg-[#FEECEF] text-[#F23645]'
                          }`}
                        >
                          {pos ? '+' : ''}
                          {pair.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                        {pair.technicalRating}
                      </td>
                      <td className="py-3.5 pl-4 pr-6">
                        <div className="flex justify-end">
                          <Sparkline data={pair.sparkline} isPositive={pos} width={78} height={24} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Instant Currency Converter Card */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-display text-base font-bold text-gray-950">Spot Rate Converter</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Pair</label>
                <select
                  value={fxPairId}
                  onChange={(e) => setFxPairId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#2962FF]"
                >
                  {fxPairs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({fmt(p.price, p.symbol === 'USDJPY' ? 2 : 4)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Amount</label>
                <input
                  type="number"
                  value={fxAmount}
                  onChange={(e) => setFxAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#2962FF]"
                />
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-gray-200">
                <div className="text-[11px] text-gray-500">Converted Value</div>
                <div className="mt-0.5 font-mono text-xl font-bold text-gray-950 tabular-nums">
                  {converted.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                  <span className="text-xs font-sans font-semibold text-gray-500">
                    {selectedFx.symbol.slice(3)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. BONDS & YIELD CURVE SCREEN
  if (category === 'Bonds') {
    const maxYield = Math.max(...US_YIELD_CURVE.map((y) => y.yield)) + 0.3;
    const minYield = Math.min(...US_YIELD_CURVE.map((y) => y.yield)) - 0.3;

    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
            Global Sovereign Bonds &amp; Yields
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Benchmark government bond yields, basis-point moves, and the U.S. Treasury yield curve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* US Treasury Yield Curve Card */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-gray-950">
                US Treasury Yield Curve
              </h3>
              <span className="text-[11px] font-mono font-semibold text-[#089981]">
                2s10s Spread: +12.8 bps
              </span>
            </div>

            <div className="pt-2">
              <svg viewBox="0 0 360 190" className="w-full h-auto">
                {[0.2, 0.5, 0.8].map((r) => (
                  <line key={r} x1="20" y1={20 + r * 130} x2="340" y2={20 + r * 130} stroke="#F3F4F6" />
                ))}
                {(() => {
                  const pts = US_YIELD_CURVE.map((pt, i) => {
                    const x = 28 + (i / (US_YIELD_CURVE.length - 1)) * 304;
                    const y = 20 + (1 - (pt.yield - minYield) / (maxYield - minYield)) * 130;
                    return { x, y, ...pt };
                  });
                  const pathD = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  return (
                    <>
                      <path d={pathD} fill="none" stroke="#2962FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {pts.map((p) => (
                        <g key={p.tenor}>
                          <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#2962FF" strokeWidth="2" />
                          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#111827" fontFamily="JetBrains Mono, monospace">
                            {p.yield.toFixed(2)}%
                          </text>
                          <text x={p.x} y="175" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">
                            {p.tenor}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Sovereign Yields Table */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 pl-6 pr-4">BOND</th>
                  <th className="py-3.5 px-4 text-right">YIELD</th>
                  <th className="py-3.5 px-4 text-right">CHG (BPS)</th>
                  <th className="py-3.5 px-4 text-right">COUPON</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">PRICE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {BONDS_DATA.map((b) => {
                  const pos = b.changeBps >= 0;
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <CountryFlag code={b.countryCode} />
                          <div>
                            <div className="font-bold text-gray-950">{b.name}</div>
                            <div className="text-[11px] text-gray-400">
                              {b.symbol} · {b.maturity}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950 tabular-nums">
                        {b.yield.toFixed(3)}%
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${
                          pos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {pos ? '+' : ''}
                        {b.changeBps.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600 tabular-nums">
                        {b.coupon}
                      </td>
                      <td className="py-3.5 pl-4 pr-6 text-right font-mono text-gray-600 tabular-nums">
                        {b.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 7. ETFs SCREEN
  if (category === 'ETFs') {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
            Exchange-Traded Funds (ETFs)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Most liquid equity, digital asset, commodity, and fixed-income funds by assets under management.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 pl-6 pr-4">ETF / ISSUER</th>
                  <th className="py-3.5 px-4">ASSET CLASS</th>
                  <th className="py-3.5 px-4 text-right">PRICE</th>
                  <th className="py-3.5 px-4 text-right">CHANGE %</th>
                  <th className="py-3.5 px-4 text-right">AUM</th>
                  <th className="py-3.5 px-4 text-right">EXP. RATIO</th>
                  <th className="py-3.5 px-4 text-right">DIV. YIELD</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">TREND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {ETFS_DATA.map((etf) => {
                  const pos = etf.changePercent >= 0;
                  return (
                    <tr key={etf.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <TickerAvatar symbol={etf.symbol} size="md" />
                          <div>
                            <div className="font-bold text-gray-950">{etf.symbol}</div>
                            <div className="text-[11px] text-gray-400">
                              {etf.name} · {etf.issuer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{etf.assetClass}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950 tabular-nums">
                        ${etf.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-mono font-semibold tabular-nums ${
                            pos ? 'bg-[#E6F5F2] text-[#089981]' : 'bg-[#FEECEF] text-[#F23645]'
                          }`}
                        >
                          {pos ? '+' : ''}
                          {etf.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-700 tabular-nums">
                        {etf.aum}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600 tabular-nums">
                        {etf.expenseRatio}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600 tabular-nums">
                        {etf.dividendYield}
                      </td>
                      <td className="py-3.5 pl-4 pr-6">
                        <div className="flex justify-end">
                          <Sparkline data={etf.sparkline} isPositive={pos} width={76} height={24} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 8. ECONOMY / FULL ECONOMIC CALENDAR SCREEN
  const events = ECONOMIC_CALENDAR.filter((ev) => {
    const matchImpact = impactFilter === 'ALL' || ev.impact === impactFilter;
    const matchCountry = countryFilter === 'ALL' || ev.countryCode === countryFilter;
    return matchImpact && matchCountry;
  });

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
            Global Economic Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Macroeconomic indicators, central bank policy decisions, and inflation releases.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'HIGH IMPACT', 'MED IMPACT', 'LOW IMPACT'] as const).map((imp) => (
            <button
              key={imp}
              type="button"
              onClick={() => setImpactFilter(imp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                impactFilter === imp
                  ? 'bg-[#131722] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-950'
              }`}
            >
              {imp === 'ALL' ? 'All Impact' : imp}
            </button>
          ))}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700"
          >
            <option value="ALL">All Countries</option>
            <option value="US">United States</option>
            <option value="EU">Eurozone</option>
            <option value="JP">Japan</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="CA">Canada</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => {
          const impactStyle =
            ev.impact === 'HIGH IMPACT'
              ? 'bg-[#FEECEF] text-[#E11D48]'
              : ev.impact === 'MED IMPACT'
              ? 'bg-[#FEF3C7] text-[#D97706]'
              : 'bg-gray-100 text-gray-600';
          return (
            <div
              key={ev.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CountryFlag code={ev.countryCode} />
                    <span className="text-xs font-semibold text-gray-700 font-mono tabular-nums">
                      {ev.time} {ev.timezone}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${impactStyle}`}>
                    {ev.impact}
                  </span>
                </div>
                <h3 className="mt-3.5 text-sm font-bold text-gray-950">{ev.title}</h3>
                <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{ev.description}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] font-medium text-gray-400">Actual</div>
                  <div className="mt-0.5 text-xs font-bold text-gray-900 font-mono tabular-nums">
                    {ev.actual}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-gray-400">Forecast</div>
                  <div className="mt-0.5 text-xs font-medium text-gray-600 font-mono tabular-nums">
                    {ev.forecast}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-gray-400">Prior</div>
                  <div className="mt-0.5 text-xs font-medium text-gray-600 font-mono tabular-nums">
                    {ev.prior}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Community & Brokers views for the top navigation items
export const CommunityView: React.FC<{ onSelectInstrumentBySymbol: (sym: string) => void }> = ({
  onSelectInstrumentBySymbol,
}) => {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const ideas = [
    {
      id: 'idea1',
      symbol: 'SPX',
      title: 'S&P 500 Breakout Above 5,950 Resistance — Momentum Targets 6,050',
      author: 'MacroQuant_Desk',
      bias: 'Long',
      timeframe: '4H',
      summary:
        'Breadth expansion across industrials and semiconductors confirms the breakout from the two-week consolidation range.',
      likes: 418,
      comments: 34,
    },
    {
      id: 'idea2',
      symbol: 'NVDA',
      title: 'NVDA Holding Rising 21-EMA Support Ahead of Cloud Capex Cycle',
      author: 'SiliconTape',
      bias: 'Long',
      timeframe: '1D',
      summary:
        'Institutional accumulation volume remains elevated above $140 support with RSI resetting cleanly below overbought.',
      likes: 312,
      comments: 27,
    },
    {
      id: 'idea3',
      symbol: 'BTC',
      title: 'Bitcoin Consolidating Under $100K Psychological Magnet',
      author: 'OnChainPulse',
      bias: 'Long',
      timeframe: '1D',
      summary:
        'Spot ETF inflows remain net positive while funding rates cool off, setting up a healthy higher-low structure.',
      likes: 649,
      comments: 82,
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
          Community Trade Ideas &amp; Scripts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Published technical setups, macro commentary, and Pine Script™ indicators from verified analysts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ideas.map((idea) => {
          const liked = likedIds.includes(idea.id);
          return (
            <div
              key={idea.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => onSelectInstrumentBySymbol(idea.symbol)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#2962FF] hover:underline"
                  >
                    <TickerAvatar symbol={idea.symbol} size="sm" />
                    <span>{idea.symbol} · {idea.timeframe}</span>
                  </button>
                  <span className="px-2 py-0.5 rounded bg-[#E6F5F2] text-[#089981] text-[10px] font-bold uppercase">
                    {idea.bias}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-gray-950 leading-snug">
                  {idea.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{idea.summary}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-gray-700">@{idea.author}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setLikedIds((prev) =>
                        prev.includes(idea.id) ? prev.filter((x) => x !== idea.id) : [...prev, idea.id]
                      )
                    }
                    className={`inline-flex items-center gap-1 font-mono ${
                      liked ? 'text-[#2962FF] font-semibold' : 'hover:text-gray-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{idea.likes + (liked ? 1 : 0)}</span>
                  </button>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{idea.comments}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BrokersView: React.FC = () => {
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null);
  const brokers = [
    { name: 'Interactive Brokers', rating: '4.9', assets: 'Stocks, Futures, Options, FX', minDeposit: '$0', badge: 'Institutional Grade' },
    { name: 'Charles Schwab', rating: '4.8', assets: 'US Equities, ETFs, Bonds', minDeposit: '$0', badge: 'Zero Commission' },
    { name: 'CME Direct Access', rating: '4.7', assets: 'Index & Commodity Futures', minDeposit: '$500', badge: 'Low Latency' },
    { name: 'OANDA Global', rating: '4.6', assets: 'Forex, Metals, Indices', minDeposit: '$0', badge: 'Tight Spreads' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gray-950 tracking-tight">
          Verified Brokerage Integrations
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Connect your preferred brokerage account to place orders directly from MarketView charts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brokers.map((b) => {
          const isConnected = connectedBroker === b.name;
          return (
            <div
              key={b.name}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-gray-950">{b.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-gray-600">
                    {b.badge}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">{b.assets}</div>
                <div className="mt-2 flex items-center gap-4 text-[11px] font-mono text-gray-600">
                  <span>Rating: ★ {b.rating}</span>
                  <span>Min: {b.minDeposit}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConnectedBroker(isConnected ? null : b.name)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  isConnected
                    ? 'bg-[#E6F5F2] text-[#089981]'
                    : 'bg-[#131722] text-white hover:bg-gray-800'
                }`}
              >
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <span>Connect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
