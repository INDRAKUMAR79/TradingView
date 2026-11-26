import React, { useState, useMemo } from 'react';
import {
  Instrument,
  TimeframeKey,
  MarketCategory,
  MACRO_BENCHMARKS,
  WORLD_INDICES_PANEL,
  ECONOMIC_CALENDAR,
} from '../data/marketsData';
import { TickerAvatar } from './TickerAvatar';
import { Sparkline } from './Sparkline';
import { InteractiveChart } from './InteractiveChart';
import { CountryFlag } from './CountryFlag';

interface IndicesOverviewProps {
  indices: Instrument[];
  usStocks: Instrument[];
  cryptoAssets: Instrument[];
  commoditiesForex: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onSelectCategory: (category: MarketCategory) => void;
  onOpenHeatmap: (tab?: 'stocks' | 'crypto') => void;
}

type MoverFilter = 'Highest Volume' | 'Most Volatile' | 'Top Gainers' | 'Top Losers';
const TIMEFRAMES: TimeframeKey[] = ['1D', '5D', '1M', '3M', '1Y', '5Y', 'ALL'];

function formatPrice(val: number, decimals?: number): string {
  const dec = decimals ?? (val < 10 ? 4 : 2);
  return val.toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

export const IndicesOverview: React.FC<IndicesOverviewProps> = ({
  indices,
  usStocks,
  cryptoAssets,
  commoditiesForex,
  onSelectInstrument,
  onSelectCategory,
  onOpenHeatmap,
}) => {
  const [selectedIndexId, setSelectedIndexId] = useState<string>('spx');
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1D');
  const [moverFilter, setMoverFilter] = useState<MoverFilter>('Highest Volume');

  const activeIndex = useMemo(
    () => indices.find((idx) => idx.id === selectedIndexId) || indices[0],
    [indices, selectedIndexId]
  );

  const chartPoints = activeIndex.seriesByTimeframe[timeframe] || activeIndex.seriesByTimeframe['1D'];
  const isPositive = activeIndex.changePercent >= 0;

  // Filtered top 5 stocks for the Market Movers table
  const displayedStocks = useMemo(() => {
    const list = [...usStocks];
    if (moverFilter === 'Highest Volume') {
      // Preserve NVDA, AAPL, TSLA, AMZN, MSFT order from screenshot
      const preferredOrder = ['nvda', 'aapl', 'tsla', 'amzn', 'msft'];
      return list
        .filter((s) => preferredOrder.includes(s.id))
        .sort((a, b) => preferredOrder.indexOf(a.id) - preferredOrder.indexOf(b.id));
    }
    if (moverFilter === 'Most Volatile') {
      return list.sort((a, b) => (b.volatility ?? 0) - (a.volatility ?? 0)).slice(0, 5);
    }
    if (moverFilter === 'Top Gainers') {
      return list.sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    }
    return list.sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  }, [usStocks, moverFilter]);

  const topCrypto = cryptoAssets.slice(0, 4);
  const topCommoditiesForex = commoditiesForex.slice(0, 5);
  const todayEvents = ECONOMIC_CALENDAR.slice(0, 3);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-6 space-y-10">
      {/* Hero Header & Macro Strip */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F5F2] text-[#089981] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
              US Markets Open
            </span>
            <span className="text-[11px] font-medium text-gray-500 tracking-wide">
              NYSE • NASDAQ • CME
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-[36px] font-extrabold tracking-tight text-gray-950 leading-tight">
            Markets, everywhere
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-2xl">
            Real-time quotes, technical analysis, and sentiment across 1,350,000+ financial instruments.
          </p>
        </div>

        {/* Macro Benchmark Strip (VIX | 10Y Yield | DXY) */}
        <div className="inline-flex flex-wrap items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 gap-4 self-start lg:self-end shadow-2xs">
          {MACRO_BENCHMARKS.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <div className="h-4 w-px bg-gray-200 hidden sm:block" />}
              <button
                type="button"
                onClick={() => onSelectInstrument(item.instrument)}
                className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
              >
                <span className="font-semibold text-gray-600">{item.label}</span>
                <span className="font-mono font-bold text-gray-900 tabular-nums">{item.value}</span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    item.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {item.change}
                </span>
              </button>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Major Indices Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl font-bold text-gray-950 tracking-tight">
              Major Indices
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-600">
              Global Benchmark
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('World stocks')}
            className="text-xs font-semibold text-[#2962FF] hover:text-[#1E4ED8] transition-colors whitespace-nowrap"
          >
            Explore all indices ›
          </button>
        </div>

        {/* Index Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {indices.map((idx) => {
            const active = idx.id === activeIndex.id;
            const pos = idx.changePercent >= 0;
            return (
              <button
                key={idx.id}
                type="button"
                onClick={() => setSelectedIndexId(idx.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border ${
                  active
                    ? 'bg-[#131722] text-white border-[#131722]'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{idx.shortLabel || idx.name}</span>
                <span
                  className={`font-mono tabular-nums ${
                    active
                      ? pos
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                      : pos
                      ? 'text-[#089981]'
                      : 'text-[#F23645]'
                  }`}
                >
                  {pos ? '+' : ''}
                  {idx.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Chart + World Indices 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Featured Index Chart Card */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <TickerAvatar symbol={activeIndex.symbol} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectInstrument(activeIndex)}
                        className="font-display text-lg font-bold text-gray-950 hover:text-[#2962FF] transition-colors text-left"
                      >
                        {activeIndex.name}
                      </button>
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-gray-500 uppercase">
                        {activeIndex.symbol}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                      <span className="font-display text-2xl font-extrabold text-gray-950 tabular-nums">
                        {formatPrice(activeIndex.price)}
                      </span>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {formatPrice(activeIndex.change)} ({isPositive ? '+' : ''}
                        {activeIndex.changePercent.toFixed(2)}%)
                      </span>
                      <span className="text-[11px] font-medium text-gray-400">
                        {activeIndex.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeframe Switcher */}
                <div className="inline-flex items-center gap-0.5 bg-gray-50 border border-gray-200/80 rounded-lg p-1 self-start">
                  {TIMEFRAMES.map((tf) => {
                    const isTfActive = timeframe === tf;
                    return (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          isTfActive
                            ? 'bg-white text-gray-950 shadow-2xs border border-gray-200/80'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {tf}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive SVG Area Chart */}
              <div className="my-2">
                <InteractiveChart
                  points={chartPoints}
                  prevClose={activeIndex.prevClose}
                  isPositive={isPositive}
                  height={285}
                  currency={activeIndex.currency}
                />
              </div>
            </div>

            {/* Bottom 4-Metric Strip */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[11px] text-gray-400 font-medium">Day&apos;s Range</div>
                <div className="mt-0.5 text-xs font-semibold text-gray-900 font-mono tabular-nums">
                  {activeIndex.dayRange}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 font-medium">52 Wk Range</div>
                <div className="mt-0.5 text-xs font-semibold text-gray-900 font-mono tabular-nums">
                  {activeIndex.week52Range}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 font-medium">Previous Close</div>
                <div className="mt-0.5 text-xs font-semibold text-gray-900 font-mono tabular-nums">
                  {formatPrice(activeIndex.prevClose)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 font-medium">Volume</div>
                <div className="mt-0.5 text-xs font-semibold text-gray-900 font-mono tabular-nums">
                  {activeIndex.volume}
                </div>
              </div>
            </div>
          </div>

          {/* Right: World Indices Panel */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                  WORLD INDICES
                </h3>
                <button
                  type="button"
                  onClick={() => onSelectCategory('World stocks')}
                  className="text-xs font-semibold text-[#2962FF] hover:text-[#1E4ED8] transition-colors"
                >
                  View table
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {WORLD_INDICES_PANEL.map((item) => {
                  const pos = item.changePercent >= 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (indices.some((m) => m.id === item.id)) {
                          setSelectedIndexId(item.id);
                        } else {
                          onSelectInstrument(item);
                        }
                      }}
                      className="w-full py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 hover:bg-gray-50/70 -mx-2 px-2 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <TickerAvatar symbol={item.symbol} size="md" />
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-gray-900 truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate">
                            {item.exchange}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[13px] font-mono font-bold text-gray-900 tabular-nums">
                          {formatPrice(item.price)}
                        </div>
                        <div
                          className={`text-[11px] font-mono font-semibold tabular-nums ${
                            pos ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {pos ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenHeatmap('stocks')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-900 transition-colors"
            >
              Open Global Heatmap
            </button>
          </div>
        </div>
      </section>

      {/* US Stocks Market Movers Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-950 tracking-tight">
              US Stocks Market Movers
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time volume, market capitalization, and highest trending leaders
            </p>
          </div>

          <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-1 self-start md:self-auto overflow-x-auto max-w-full">
            {(['Highest Volume', 'Most Volatile', 'Top Gainers', 'Top Losers'] as MoverFilter[]).map(
              (tab) => {
                const active = moverFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMoverFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#131722] text-white'
                        : 'text-gray-600 hover:text-gray-950'
                    }`}
                  >
                    {tab}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Market Movers Table Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 pl-6 pr-4">TICKER / COMPANY</th>
                  <th className="py-3.5 px-4 text-right">LAST PRICE</th>
                  <th className="py-3.5 px-4 text-right">CHANGE $</th>
                  <th className="py-3.5 px-4 text-right">CHANGE %</th>
                  <th className="py-3.5 px-4 text-right">VOLUME</th>
                  <th className="py-3.5 px-4 text-right">MARKET CAP</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">TREND (7D)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {displayedStocks.map((stock) => {
                  const pos = stock.changePercent >= 0;
                  return (
                    <tr
                      key={stock.id}
                      onClick={() => onSelectInstrument(stock)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <TickerAvatar symbol={stock.symbol} size="md" />
                          <div>
                            <div className="font-bold text-gray-950 group-hover:text-[#2962FF] transition-colors">
                              {stock.symbol}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950 tabular-nums">
                        ${formatPrice(stock.price)}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-medium tabular-nums ${
                          pos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {pos ? '+' : ''}
                        {stock.change.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold tabular-nums ${
                            pos
                              ? 'bg-[#E6F5F2] text-[#089981]'
                              : 'bg-[#FEECEF] text-[#F23645]'
                          }`}
                        >
                          {pos ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600 tabular-nums">
                        {stock.volume}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600 tabular-nums">
                        {stock.marketCap}
                      </td>
                      <td className="py-3.5 pl-4 pr-6">
                        <div className="flex justify-end">
                          <Sparkline data={stock.sparkline} isPositive={pos} width={78} height={24} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 py-3 text-center bg-gray-50/40">
            <button
              type="button"
              onClick={() => onSelectCategory('US stocks')}
              className="text-xs font-semibold text-[#2962FF] hover:text-[#1E4ED8] transition-colors"
            >
              See all 500+ US stocks in screener →
            </button>
          </div>
        </div>
      </section>

      {/* Crypto Market & Commodities / Forex Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Crypto Market (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl font-bold text-gray-950 tracking-tight">
                Crypto Market
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309] text-[11px] font-semibold">
                24/7 Live
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenHeatmap('crypto')}
              className="text-xs font-semibold text-[#2962FF] hover:text-[#1E4ED8] transition-colors"
            >
              Heatmap
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topCrypto.map((coin) => {
              const pos = coin.changePercent >= 0;
              const priceDecimals = coin.price < 10 ? 3 : 2;
              return (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => onSelectInstrument(coin)}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 text-left transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <TickerAvatar symbol={coin.shortLabel || coin.symbol} size="md" />
                      <div>
                        <div className="text-sm font-bold text-gray-950 group-hover:text-[#2962FF] transition-colors">
                          {coin.name}
                        </div>
                        <div className="text-[11px] font-medium text-gray-400">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold tabular-nums ${
                        pos
                          ? 'bg-[#E6F5F2] text-[#089981]'
                          : 'bg-[#FEECEF] text-[#F23645]'
                      }`}
                    >
                      {pos ? '+' : ''}
                      {coin.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-2">
                    <div>
                      <div className="font-mono text-xl font-bold text-gray-950 tracking-tight tabular-nums">
                        ${formatPrice(coin.price, priceDecimals)}
                      </div>
                      <div className="mt-1 text-[11px] text-gray-400">
                        Vol: {coin.volume} • Cap: {coin.marketCap}
                      </div>
                    </div>
                    <Sparkline data={coin.sparkline} isPositive={pos} width={76} height={28} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Commodities & Forex (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-gray-950 tracking-tight">
              Commodities &amp; Forex
            </h2>
            <button
              type="button"
              onClick={() => onSelectCategory('Futures & commodities')}
              className="text-xs font-semibold text-[#2962FF] hover:text-[#1E4ED8] transition-colors"
            >
              All Futures
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-2 divide-y divide-gray-100">
            {topCommoditiesForex.map((asset) => {
              const pos = asset.changePercent >= 0;
              const dec = asset.price < 5 ? (asset.symbol === 'NG1!' ? 3 : 4) : 2;
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelectInstrument(asset)}
                  className="w-full py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 -mx-2 px-2 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <TickerAvatar symbol={asset.symbol} size="md" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-gray-950 truncate">
                        {asset.name}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {asset.exchange}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-mono font-bold text-gray-950 tabular-nums">
                      {formatPrice(asset.price, dec)}
                    </div>
                    <div
                      className={`text-[11px] font-mono font-semibold tabular-nums ${
                        pos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {pos ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Economic Calendar Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-950 tracking-tight">
              Upcoming Economic Calendar
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              High-impact macroeconomic releases scheduled for today
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('Economy')}
            className="text-xs font-semibold text-[#2962FF] hover:text-[#1E4ED8] transition-colors whitespace-nowrap"
          >
            Full calendar →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayEvents.map((ev) => {
            const impactStyle =
              ev.impact === 'HIGH IMPACT'
                ? 'bg-[#FEECEF] text-[#E11D48]'
                : ev.impact === 'MED IMPACT'
                ? 'bg-[#FEF3C7] text-[#D97706]'
                : 'bg-gray-100 text-gray-600';
            return (
              <div
                key={ev.id}
                onClick={() => onSelectCategory('Economy')}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CountryFlag code={ev.countryCode} />
                      <span className="text-xs font-semibold text-gray-700 font-mono tabular-nums">
                        {ev.time} {ev.timezone}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${impactStyle}`}
                    >
                      {ev.impact}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-gray-950">
                    {ev.title}
                  </h3>
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
      </section>
    </div>
  );
};
