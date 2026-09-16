import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';

const CURATED = [
  { label: 'All Fragrances',      filter: { brand: 'all', fillPreset: 'all', packaging: 'all' } },
  { label: 'Retail with Box',     filter: { brand: 'all', fillPreset: 'all', packaging: 'retail_with_box' } },
  { label: 'Without Box',         filter: { brand: 'all', fillPreset: 'all', packaging: 'retail_without_box' } },
  { label: 'Tester with Box',     filter: { brand: 'all', fillPreset: 'all', packaging: 'tester_with_box' } },
  { label: 'Tester w/o Box',      filter: { brand: 'all', fillPreset: 'all', packaging: 'tester_without_box' } },
  { label: 'Low Partial (0–30%)', filter: { brand: 'all', fillPreset: 'low_partial',  packaging: 'all' } },
  { label: 'Mid Partial (31–70%)',filter: { brand: 'all', fillPreset: 'mid_partial',  packaging: 'all' } },
  { label: 'High Partial (71%+)', filter: { brand: 'all', fillPreset: 'high_partial', packaging: 'all' } },
  { label: 'Creed',               filter: { brand: 'Creed',               fillPreset: 'all', packaging: 'all' } },
  { label: 'Tom Ford',            filter: { brand: 'Tom Ford',            fillPreset: 'all', packaging: 'all' } },
  { label: 'Roja Parfums',        filter: { brand: 'Roja Parfums',        fillPreset: 'all', packaging: 'all' } },
];

export default function CuratedPills() {
  const { filters, setFilters } = useMarketplace();

  return (
    <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CURATED.map((opt, idx) => {
        const isActive =
          filters.brand === opt.filter.brand &&
          filters.fillPreset === opt.filter.fillPreset &&
          (filters.packaging || 'all') === opt.filter.packaging;

        return (
          <button
            key={idx}
            onClick={() => setFilters(prev => ({ ...prev, ...opt.filter }))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border-[1.5px] shrink-0 ${
              isActive
                ? 'bg-ink-950 text-white border-ink-950 shadow-pop-sm'
                : 'bg-white border-ink-100 text-ink-600 hover:border-ink-950 hover:text-ink-950'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
