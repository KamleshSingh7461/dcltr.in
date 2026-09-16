import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import PerfumeCard from './PerfumeCard';

function SkeletonCard() {
  return (
    <div className="rounded-lg sm:rounded-2xl overflow-hidden border border-ink-100 sm:border-[1.5px]">
      <div className="aspect-[4/5] animate-shimmer" />
      <div className="p-1.5 sm:p-4 space-y-1 sm:space-y-3">
        <div className="h-2 sm:h-3 rounded-full animate-shimmer w-1/3" />
        <div className="h-2.5 sm:h-4 rounded-full animate-shimmer w-3/4" />
        <div className="h-2 sm:h-3 rounded-full animate-shimmer w-1/2 hidden sm:block" />
        <div className="pt-1 sm:pt-2 border-t border-ink-100 flex items-center justify-between">
          <div className="h-3 sm:h-5 rounded-full animate-shimmer w-8 sm:w-20" />
          <div className="h-4 sm:h-7 w-6 sm:w-12 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function PerfumeGrid() {
  const {
    filteredPerfumes,
    filters,
    setFilters,
    initialFilterState,
    setActiveModal,
    setMobileFiltersOpen,
    isLoading,
  } = useMarketplace();

  const sortOptions = [
    { value: 'newest',           label: 'Recently Listed' },
    { value: 'price_asc',        label: 'Price: Low to High' },
    { value: 'price_desc',       label: 'Price: High to Low' },
    { value: 'price_per_ml_asc', label: 'Best Value (₹/ml)' },
    { value: 'ml_desc',          label: 'Highest Fill %' },
  ];

  const activeFilterCount = [
    filters.brand !== 'all',
    filters.fillPreset !== 'all',
    Boolean(filters.packaging) && filters.packaging !== 'all',
    filters.accord !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="flex-1 w-full min-w-0 space-y-4 sm:space-y-6">

      {/* ── Sort / Filter Header Bar ───────────────────────────────── */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-[1.5px] border-ink-100 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"
            title="Live listings"
          />
          <span className="text-sm font-bold text-ink-950">
            {isLoading ? '…' : filteredPerfumes.length}{' '}
            {filteredPerfumes.length === 1 ? 'Fragrance' : 'Fragrances'}
          </span>

          {filters.fillPreset !== 'all' && (
            <span className="hidden sm:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-ink-50 border border-ink-200 text-ink-800 font-bold font-mono">
              Fill: {
                filters.fillPreset === 'low_partial'  ? 'Low Partial (0-30%)' :
                filters.fillPreset === 'mid_partial'  ? 'Mid Partial (31-70%)' :
                filters.fillPreset === 'high_partial' ? 'High Partial (71-99%)' :
                filters.fillPreset
              }
            </span>
          )}
          {filters.packaging && filters.packaging !== 'all' && (
            <span className="hidden sm:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-ink-100 border border-ink-200 text-ink-900 font-bold">
              {
                filters.packaging === 'retail_with_box'     ? 'Retail with box' :
                filters.packaging === 'retail_without_box'  ? 'Retail without box' :
                filters.packaging === 'tester_with_box'     ? 'Tester with box' :
                filters.packaging === 'tester_without_box'  ? 'Tester without box' :
                filters.packaging
              }
            </span>
          )}
          {filters.brand !== 'all' && (
            <span className="hidden sm:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-ink-950 text-white font-bold">
              {filters.brand}
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(initialFilterState)}
              className="hidden sm:inline-flex text-[11px] px-2.5 py-0.5 rounded-full border border-ink-200 text-ink-500 hover:text-ink-900 hover:border-ink-400 transition-all font-semibold"
            >
              Clear all ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border-[1.5px] border-ink-100 bg-ink-50 text-ink-800 font-bold text-xs hover:bg-ink-100 transition-all"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-ink-950 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="flex-1 sm:flex-none bg-ink-50 border-[1.5px] border-transparent text-ink-800 text-xs font-semibold rounded-lg px-3 py-2 sm:py-1.5 focus:border-ink-950 focus:bg-white focus:outline-none cursor-pointer transition-colors"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Product Grid / Skeletons / Empty ──────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-2 xl:grid-cols-3 gap-1.5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredPerfumes.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-2 xl:grid-cols-3 gap-1.5 sm:gap-6">
          {filteredPerfumes.map((perfume, idx) => (
            <PerfumeCard key={perfume.id} perfume={perfume} index={idx} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-8 sm:p-14 text-center border-2 border-dashed border-ink-200 space-y-5">
          <div className="text-5xl">🫙</div>
          <div>
            <div className="font-display text-sm font-bold text-ink-800 uppercase tracking-wider">
              No Fragrances Match Your Filters
            </div>
            <p className="text-xs text-ink-500 max-w-md mx-auto leading-relaxed font-medium mt-2">
              Try adjusting your fill level, price range, or fragrance house to discover other authenticated pre-loved bottles.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => setFilters(initialFilterState)}
              className="px-5 py-2.5 rounded-full bg-ink-100 hover:bg-ink-200 text-ink-700 text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setActiveModal('sellWizard')}
              className="btn-pop px-5 py-2.5 rounded-full bg-ink-950 hover:bg-ink-800 text-white text-xs font-bold transition-colors shadow-pop"
            >
              + List a Fragrance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
