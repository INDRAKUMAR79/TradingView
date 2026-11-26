import React from 'react';

interface CountryFlagProps {
  code: 'US' | 'EU' | 'JP' | 'UK' | 'CN' | 'DE' | 'CA' | 'FR' | 'IT';
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ code }) => {
  if (code === 'US') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
        <rect width="16" height="12" fill="#FFFFFF" />
        <rect y="0" width="16" height="1.5" fill="#B22234" />
        <rect y="3" width="16" height="1.5" fill="#B22234" />
        <rect y="6" width="16" height="1.5" fill="#B22234" />
        <rect y="9" width="16" height="1.5" fill="#B22234" />
        <rect width="7.5" height="6.5" fill="#3C3B6E" />
      </svg>
    );
  }
  if (code === 'EU') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
        <rect width="16" height="12" fill="#003399" />
        <circle cx="8" cy="6" r="3" fill="none" stroke="#FFCC00" strokeWidth="1" strokeDasharray="1 1.3" />
      </svg>
    );
  }
  if (code === 'JP') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
        <rect width="16" height="12" fill="#FFFFFF" />
        <circle cx="8" cy="6" r="3.2" fill="#BC002D" />
      </svg>
    );
  }
  if (code === 'UK') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
        <rect width="16" height="12" fill="#012169" />
        <path d="M0 0L16 12M16 0L0 12" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M8 0V12M0 6H16" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M8 0V12M0 6H16" stroke="#C8102E" strokeWidth="1.6" />
      </svg>
    );
  }
  if (code === 'DE') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
        <rect y="0" width="16" height="4" fill="#111827" />
        <rect y="4" width="16" height="4" fill="#DD0000" />
        <rect y="8" width="16" height="4" fill="#FFCE00" />
      </svg>
    );
  }
  if (code === 'CA') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
        <rect width="16" height="12" fill="#FFFFFF" />
        <rect x="0" width="4" height="12" fill="#FF0000" />
        <rect x="12" width="4" height="12" fill="#FF0000" />
        <circle cx="8" cy="6" r="2" fill="#FF0000" />
      </svg>
    );
  }
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] border border-gray-200 shrink-0">
      <rect width="16" height="12" fill="#E5E7EB" />
    </svg>
  );
};
