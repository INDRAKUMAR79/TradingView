import React from 'react';
import { MarketCategory } from '../data/marketsData';
import { TopSectionView } from './Header';

interface FooterProps {
  onSelectCategory: (cat: MarketCategory) => void;
  onSelectSection: (sec: TopSectionView) => void;
  onOpenHeatmap: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectSection,
  onOpenHeatmap,
}) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-14">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Column 1: Products */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3.5">Products</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('Indices');
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Supercharts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSection('community')}
                  className="hover:text-gray-900 transition-colors"
                >
                  Pine Script™
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('US stocks');
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Stock Screener
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('Crypto');
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Crypto Screener
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('markets');
                    onSelectCategory('Economy');
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Economic Calendar
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3.5">Company</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <button type="button" onClick={() => onSelectSection('markets')} className="hover:text-gray-900 transition-colors">
                  About us
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenHeatmap} className="hover:text-gray-900 transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('brokers')} className="hover:text-gray-900 transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('community')} className="hover:text-gray-900 transition-colors">
                  Wall of Love
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('markets')} className="hover:text-gray-900 transition-colors">
                  Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3.5">Community</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <button type="button" onClick={() => onSelectSection('community')} className="hover:text-gray-900 transition-colors">
                  Refer a friend
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('community')} className="hover:text-gray-900 transition-colors">
                  Ideas &amp; Scripts
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('community')} className="hover:text-gray-900 transition-colors">
                  House Rules
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('community')} className="hover:text-gray-900 transition-colors">
                  Moderators
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: For Business */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3.5">For Business</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <button type="button" onClick={() => onSelectSection('brokers')} className="hover:text-gray-900 transition-colors">
                  Charting Solutions
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('brokers')} className="hover:text-gray-900 transition-colors">
                  Lightweight Charts
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('brokers')} className="hover:text-gray-900 transition-colors">
                  Brokerage Integration
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectSection('brokers')} className="hover:text-gray-900 transition-colors">
                  Partner Program
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Brand Block */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="15" viewBox="0 0 26 20" fill="none">
                <path d="M2 15.5V4.5H6.5V15.5H2Z" fill="#131722" />
                <circle cx="11.5" cy="6.5" r="2.3" fill="#131722" />
                <path d="M12.5 15.5L18.5 4.5H23.2L17.2 15.5H12.5Z" fill="#131722" />
              </svg>
              <span className="font-display font-bold text-sm text-gray-900">MarketView</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Look first / Then leap. Market data provided by worldwide leading exchanges.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <span>© 2026 MarketView, Inc. All financial rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-gray-600">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-gray-600">
              Terms of Service
            </a>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-gray-600">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
