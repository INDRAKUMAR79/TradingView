import React, { useState, useEffect, useMemo } from 'react';
import {
  MAJOR_INDICES,
  US_STOCKS,
  CRYPTO_ASSETS,
  COMMODITIES_FOREX,
  ALL_INSTRUMENTS,
  Instrument,
  MarketCategory,
} from './data/marketsData';
import { Header, TopSectionView } from './components/Header';
import { IndicesOverview } from './components/IndicesOverview';
import { MarketScreens, CommunityView, BrokersView } from './components/MarketScreens';
import { InstrumentModal } from './components/InstrumentModal';
import { HeatmapModal } from './components/HeatmapModal';
import { SearchCommandModal } from './components/SearchCommandModal';
import { WatchlistModal, SpecialOfferModal } from './components/UtilityModals';
import { Footer } from './components/Footer';

export function App() {
  const [activeSection, setActiveSection] = useState<TopSectionView>('markets');
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Indices');
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [heatmapState, setHeatmapState] = useState<{ open: boolean; tab: 'stocks' | 'crypto' }>({
    open: false,
    tab: 'stocks',
  });
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['spx', 'nvda', 'btc']);

  // Keyboard shortcuts: Ctrl+K / Cmd+K for search, Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSelectedInstrument(null);
        setHeatmapState((prev) => ({ ...prev, open: false }));
        setIsWatchlistOpen(false);
        setIsOfferOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCategory = (cat: MarketCategory) => {
    setActiveSection('markets');
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectInstrumentBySymbol = (symbol: string) => {
    const found = ALL_INSTRUMENTS.find(
      (i) => i.symbol.toLowerCase().includes(symbol.toLowerCase()) || i.id === symbol.toLowerCase()
    );
    if (found) setSelectedInstrument(found);
  };

  const allSearchable = useMemo(() => ALL_INSTRUMENTS, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] text-[#111827]">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHeatmap={() => setHeatmapState({ open: true, tab: 'stocks' })}
        onOpenSpecialOffer={() => setIsOfferOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistIds.length}
      />

      <main className="flex-1">
        {activeSection === 'community' ? (
          <CommunityView onSelectInstrumentBySymbol={handleSelectInstrumentBySymbol} />
        ) : activeSection === 'brokers' ? (
          <BrokersView />
        ) : activeCategory === 'Indices' ? (
          <IndicesOverview
            indices={MAJOR_INDICES}
            usStocks={US_STOCKS}
            cryptoAssets={CRYPTO_ASSETS}
            commoditiesForex={COMMODITIES_FOREX}
            onSelectInstrument={setSelectedInstrument}
            onSelectCategory={handleSelectCategory}
            onOpenHeatmap={(tab = 'stocks') => setHeatmapState({ open: true, tab })}
          />
        ) : (
          <MarketScreens
            category={activeCategory}
            usStocks={US_STOCKS}
            cryptoAssets={CRYPTO_ASSETS}
            commoditiesForex={COMMODITIES_FOREX}
            majorIndices={MAJOR_INDICES}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectInstrument={setSelectedInstrument}
            onOpenHeatmap={(tab = 'stocks') => setHeatmapState({ open: true, tab })}
          />
        )}
      </main>

      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectSection={setActiveSection}
        onOpenHeatmap={() => setHeatmapState({ open: true, tab: 'stocks' })}
      />

      {/* Interactive Modals */}
      <InstrumentModal
        instrument={selectedInstrument}
        isStarred={selectedInstrument ? watchlistIds.includes(selectedInstrument.id) : false}
        onToggleStar={handleToggleWatchlist}
        onClose={() => setSelectedInstrument(null)}
      />

      <HeatmapModal
        isOpen={heatmapState.open}
        initialTab={heatmapState.tab}
        cryptoAssets={CRYPTO_ASSETS}
        usStocks={US_STOCKS}
        onSelectInstrument={setSelectedInstrument}
        onClose={() => setHeatmapState((prev) => ({ ...prev, open: false }))}
      />

      <SearchCommandModal
        isOpen={isSearchOpen}
        instruments={allSearchable}
        onSelect={setSelectedInstrument}
        onClose={() => setIsSearchOpen(false)}
      />

      <WatchlistModal
        isOpen={isWatchlistOpen}
        instruments={allSearchable}
        watchlistIds={watchlistIds}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectInstrument={setSelectedInstrument}
        onClose={() => setIsWatchlistOpen(false)}
      />

      <SpecialOfferModal
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
      />
    </div>
  );
}

export default App;
