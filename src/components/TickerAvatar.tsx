import React from 'react';

interface TickerAvatarProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TickerAvatar: React.FC<TickerAvatarProps> = ({ symbol, size = 'md' }) => {
  const dim =
    size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-11 h-11 text-xs' : 'w-9 h-9 text-[11px]';

  const key = symbol.toUpperCase();

  // Custom brand/asset emblems matching the reference screenshot
  if (key === 'SPX' || key === 'S&P 500') {
    return (
      <div className={`${dim} rounded-full bg-[#F23645] text-white font-bold flex items-center justify-center shrink-0 tracking-tight`}>
        500
      </div>
    );
  }
  if (key === 'NDX') {
    return (
      <div className={`${dim} rounded-xl bg-[#EEF2FF] text-[#2962FF] font-bold flex items-center justify-center shrink-0`}>
        NDX
      </div>
    );
  }
  if (key === 'NI225' || key === 'N225') {
    return (
      <div className={`${dim} rounded-xl bg-[#FFF1F2] text-[#E11D48] font-bold flex items-center justify-center shrink-0`}>
        JP
      </div>
    );
  }
  if (key === 'UKX' || key === 'FTSE') {
    return (
      <div className={`${dim} rounded-xl bg-[#EFF6FF] text-[#2563EB] font-bold flex items-center justify-center shrink-0`}>
        UK
      </div>
    );
  }
  if (key === 'DAX') {
    return (
      <div className={`${dim} rounded-xl bg-[#FFFBEB] text-[#D97706] font-bold flex items-center justify-center shrink-0`}>
        DE
      </div>
    );
  }
  if (key === 'HSI') {
    return (
      <div className={`${dim} rounded-xl bg-[#FEF2F2] text-[#DC2626] font-bold flex items-center justify-center shrink-0`}>
        HK
      </div>
    );
  }
  if (key === 'NVDA') {
    return (
      <div className={`${dim} rounded-lg bg-[#163020] text-[#76B900] font-extrabold flex items-center justify-center shrink-0`}>
        NV
      </div>
    );
  }
  if (key === 'AAPL') {
    return (
      <div className={`${dim} rounded-lg bg-[#111827] text-white font-bold flex items-center justify-center shrink-0`}>
        AAPL
      </div>
    );
  }
  if (key === 'TSLA') {
    return (
      <div className={`${dim} rounded-lg bg-[#E31937] text-white font-bold flex items-center justify-center shrink-0`}>
        TSLA
      </div>
    );
  }
  if (key === 'AMZN') {
    return (
      <div className={`${dim} rounded-lg bg-[#F59E0B] text-[#111827] font-extrabold flex items-center justify-center shrink-0`}>
        AMZN
      </div>
    );
  }
  if (key === 'MSFT') {
    return (
      <div className={`${dim} rounded-lg bg-[#2563EB] text-white font-bold flex items-center justify-center shrink-0`}>
        MSFT
      </div>
    );
  }
  if (key.startsWith('BTC')) {
    return (
      <div className={`${dim} rounded-full bg-[#F7931A] text-white font-bold flex items-center justify-center shrink-0 text-sm`}>
        ₿
      </div>
    );
  }
  if (key.startsWith('ETH')) {
    return (
      <div className={`${dim} rounded-full bg-[#627EEA] text-white font-bold flex items-center justify-center shrink-0 text-sm`}>
        Ξ
      </div>
    );
  }
  if (key.startsWith('SOL')) {
    return (
      <div className={`${dim} rounded-full bg-[#7C3AED] text-white font-bold flex items-center justify-center shrink-0`}>
        SOL
      </div>
    );
  }
  if (key.startsWith('XRP')) {
    return (
      <div className={`${dim} rounded-full bg-[#111827] text-white font-bold flex items-center justify-center shrink-0 text-sm`}>
        ✕
      </div>
    );
  }
  if (key === 'GC1!' || key === 'GOLD') {
    return (
      <div className={`${dim} rounded-lg bg-[#FEF3C7] text-[#B45309] font-bold flex items-center justify-center shrink-0`}>
        Au
      </div>
    );
  }
  if (key === 'CL1!' || key === 'WTI') {
    return (
      <div className={`${dim} rounded-lg bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center shrink-0`}>
        OIL
      </div>
    );
  }
  if (key === 'EURUSD') {
    return (
      <div className={`${dim} rounded-lg bg-[#EFF6FF] text-[#1D4ED8] font-bold flex items-center justify-center shrink-0`}>
        €/$
      </div>
    );
  }
  if (key === 'USDJPY') {
    return (
      <div className={`${dim} rounded-lg bg-[#FEF3C7] text-[#B45309] font-bold flex items-center justify-center shrink-0`}>
        $/¥
      </div>
    );
  }
  if (key === 'NG1!' || key === 'NG') {
    return (
      <div className={`${dim} rounded-lg bg-[#FFEDD5] text-[#C2410C] font-bold flex items-center justify-center shrink-0`}>
        NG
      </div>
    );
  }

  // Deterministic fallback color for remaining symbols
  const palette = [
    'bg-slate-900 text-white',
    'bg-blue-600 text-white',
    'bg-emerald-600 text-white',
    'bg-indigo-600 text-white',
    'bg-rose-600 text-white',
    'bg-amber-600 text-white',
  ];
  const hash = key.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cls = palette[hash % palette.length];
  const short = key.replace(/[^A-Z0-9]/g, '').slice(0, 4);

  return (
    <div className={`${dim} rounded-lg ${cls} font-bold flex items-center justify-center shrink-0`}>
      {short}
    </div>
  );
};
