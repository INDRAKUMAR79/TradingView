import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Globe,
  User,
  Star,
  BarChart3,
  LayoutGrid,
  Calendar,
  TrendingUp,
  Layers,
  Check,
} from 'lucide-react';
import { MarketCategory } from '../data/marketsData';

export type TopSectionView = 'markets' | 'community' | 'brokers';

interface HeaderProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  activeSection: TopSectionView;
  onSelectSection: (section: TopSectionView) => void;
  onOpenSearch: () => void;
  onOpenHeatmap: () => void;
  onOpenSpecialOffer: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
}

const SUB_CATEGORIES: MarketCategory[] = [
  'Indices',
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures & commodities',
  'Forex & currencies',
  'Bonds',
  'ETFs',
  'Economy',
];

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'JP', label: '日本語' },
  { code: 'ES', label: 'Español' },
];

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  activeSection,
  onSelectSection,
  onOpenSearch,
  onOpenHeatmap,
  onOpenSpecialOffer,
  onOpenWatchlist,
  watchlistCount,
}) => {
  const [openMenu, setOpenMenu] = useState<'products' | 'more' | 'lang' | null>(null);
  const [selectedLang, setSelectedLang] = useState('EN');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200" ref={menuRef}>
      {/* Primary Top Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={() => {
              onSelectSection('markets');
              onSelectCategory('Indices');
            }}
            className="flex items-center gap-2 shrink-0 group focus:outline-none"
            aria-label="MarketView Home"
          >
            {/* Geometric Chart Glyph */}
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none" className="shrink-0">
              <path d="M2 15.5V4.5H6.5V15.5H2Z" fill="#131722" />
              <circle cx="11.5" cy="6.5" r="2.3" fill="#131722" />
              <path d="M12.5 15.5L18.5 4.5H23.2L17.2 15.5H12.5Z" fill="#131722" />
            </svg>
          </button>

          {/* Search Pill Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center justify-between gap-3 w-56 lg:w-64 px-3 py-1.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB]/80 transition-colors text-left text-xs text-gray-500 border border-transparent focus:border-blue-500"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="truncate">Search (Ctrl+K)</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-500 bg-white border border-gray-200 rounded shadow-2xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Center: Primary Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-700">
          {/* Products Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'products' ? null : 'products')}
              className="flex items-center gap-1 py-1.5 hover:text-gray-950 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {openMenu === 'products' && (
              <div className="absolute left-0 top-full mt-2 w-60 rounded-xl bg-white border border-gray-200 shadow-lg p-1.5 z-50">
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('Indices');
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs"
                >
                  <TrendingUp className="w-4 h-4 text-[#2962FF]" />
                  <div>
                    <div className="font-semibold text-gray-900">Supercharts</div>
                    <div className="text-[11px] text-gray-500">Interactive market charting</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('US stocks');
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs"
                >
                  <BarChart3 className="w-4 h-4 text-[#089981]" />
                  <div>
                    <div className="font-semibold text-gray-900">Stock Screener</div>
                    <div className="text-[11px] text-gray-500">Filter 500+ US equities</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenHeatmap();
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs"
                >
                  <LayoutGrid className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Market Heatmaps</div>
                    <div className="text-[11px] text-gray-500">Sector & market cap treemap</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('Economy');
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs"
                >
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Economic Calendar</div>
                    <div className="text-[11px] text-gray-500">Global macro releases</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectSection('community')}
            className={`py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'community' ? 'text-[#2962FF] font-semibold' : 'hover:text-gray-950'
            }`}
          >
            Community
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('markets')}
            className={`py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'markets' ? 'text-[#2962FF] font-semibold' : 'hover:text-gray-950'
            }`}
          >
            Markets
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('brokers')}
            className={`py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'brokers' ? 'text-[#2962FF] font-semibold' : 'hover:text-gray-950'
            }`}
          >
            Brokers
          </button>

          {/* More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'more' ? null : 'more')}
              className="flex items-center gap-1 py-1.5 hover:text-gray-950 transition-colors whitespace-nowrap shrink-0"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {openMenu === 'more' && (
              <div className="absolute left-0 top-full mt-2 w-52 rounded-xl bg-white border border-gray-200 shadow-lg p-1.5 z-50">
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('Bonds');
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs font-medium text-gray-800"
                >
                  <Layers className="w-3.5 h-3.5 text-gray-500" />
                  <span>Treasury Yield Curve</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('ETFs');
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs font-medium text-gray-800"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                  <span>Global ETFs</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenWatchlist();
                    setOpenMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-xs font-medium text-gray-800"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>My Watchlist ({watchlistCount})</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Language, Account/Watchlist, Special Offer */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Search instruments"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>{selectedLang}</span>
            </button>
            {openMenu === 'lang' && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-white border border-gray-200 shadow-lg p-1 z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(l.code);
                      setOpenMenu(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-gray-50 text-xs text-gray-700"
                  >
                    <span>{l.label}</span>
                    {selectedLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account / Watchlist button */}
          <button
            type="button"
            onClick={onOpenWatchlist}
            className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            title="Watchlist & Profile"
            aria-label="Open Watchlist and Profile"
          >
            <User className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#2962FF]" />
            )}
          </button>

          {/* Special Offer CTA */}
          <button
            type="button"
            onClick={onOpenSpecialOffer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#EA580C] hover:brightness-105 text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            <span>Special Offer</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-bold">
              Up to 80%
            </span>
          </button>
        </div>
      </div>

      {/* Secondary Category Tab Bar (shown in Markets section) */}
      {activeSection === 'markets' && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
            {SUB_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`relative py-2.5 text-[13px] whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-gray-950 font-semibold'
                      : 'text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  {category}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2962FF] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
