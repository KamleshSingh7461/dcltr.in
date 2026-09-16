import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const BRANDS = [
  'all',
  'Amouage',
  'Creed',
  'Roja Parfums',
  'Clive Christian',
  'Xerjoff',
  'Maison Francis Kurkdjian',
  'Tom Ford',
  'Parfums de Marly',
  'Le Labo',
  'Kilian Paris',
  'Dior',
  'Nishane'
];

const ACCORDS = ['all', 'Woody', 'Amber', 'Warm Spicy', 'Vanilla', 'Citrus', 'Leather', 'Iris', 'Tobacco'];

const FILL_PRESETS = [
  { id: 'all', label: 'All Fill Levels', range: 'Any volume' },
  { id: 'low_partial', label: 'Low Partial (0-30%)', range: 'Discovery & remnants' },
  { id: 'mid_partial', label: 'Mid Partial (31-70%)', range: 'Optimal value partials' },
  { id: 'high_partial', label: 'High Partial (71-99%)', range: 'Nearly full / top-tier' },
];

const PACKAGING_OPTIONS = [
  { id: 'all', label: 'All Presentations' },
  { id: 'retail_with_box', label: 'Retail with box' },
  { id: 'retail_without_box', label: 'Retail without box' },
  { id: 'tester_with_box', label: 'Retail Tester with box' },
  { id: 'tester_without_box', label: 'Retail Tester without box' },
];

// Shared filter body, reused by both the desktop sidebar and the mobile drawer.
function FilterControls() {
  const { filters, setFilters } = useMarketplace();

  return (
    <>
      {/* 1. Fill Level & Partials (Low, Mid, High) */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-ink-800 uppercase tracking-wider block">
          Fill Level &amp; Partials
        </label>

        <div className="space-y-1.5">
          {FILL_PRESETS.map(preset => {
            const isActive = filters.fillPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setFilters(prev => ({ ...prev, fillPreset: preset.id }))}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all border-[1.5px] text-xs ${
                  isActive
                    ? 'bg-ink-950 text-white border-ink-950 font-bold shadow-pop'
                    : 'bg-ink-50/70 border-transparent text-ink-700 hover:bg-ink-100 hover:border-ink-200'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">{preset.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-ink-400'}`}>
                    {preset.range}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Exact ML Slider */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-ink-600 mb-1 font-medium">
            <span>Max Capacity Limit:</span>
            <span className="text-ink-950 font-bold font-mono">{filters.maxMl} ML</span>
          </div>
          <input
            type="range"
            min="10"
            max="250"
            step="5"
            value={filters.maxMl}
            onChange={(e) => setFilters(prev => ({ ...prev, maxMl: Number(e.target.value) }))}
            className="w-full accent-ink-950 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ink-400 mt-0.5 font-mono">
            <span>10 ML</span>
            <span>100 ML</span>
            <span>250 ML</span>
          </div>
        </div>
      </div>

      {/* 2. Presentation & Packaging Filters */}
      <div className="pt-4 border-t border-ink-100 space-y-2.5">
        <label className="text-xs font-bold text-ink-800 uppercase tracking-wider block">
          Packaging &amp; Presentation
        </label>

        <div className="space-y-1.5">
          {PACKAGING_OPTIONS.map(pkg => {
            const isActive = (filters.packaging || 'all') === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setFilters(prev => ({ ...prev, packaging: pkg.id }))}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all border-[1.5px] text-xs ${
                  isActive
                    ? 'bg-ink-950 text-white border-ink-950 font-bold shadow-pop'
                    : 'bg-ink-50/70 border-transparent text-ink-700 hover:bg-ink-100 hover:border-ink-200'
                }`}
              >
                <span className="font-semibold">{pkg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fragrance House / Brand */}
      <div className="pt-4 border-t border-ink-100 space-y-2">
        <label className="text-xs font-bold text-ink-800 uppercase tracking-wider block">
          Brand / Fragrance House
        </label>
        <select
          value={filters.brand}
          onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
          className="w-full bg-ink-50 border-[1.5px] border-transparent rounded-xl px-3 py-2 text-xs text-ink-950 font-medium focus:border-ink-950 focus:bg-white focus:outline-none cursor-pointer transition-colors"
        >
          {BRANDS.map(b => (
            <option key={b} value={b}>
              {b === 'all' ? 'All Fragrance Houses' : b}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Scent Family Accords */}
      <div className="pt-4 border-t border-ink-100 space-y-2">
        <label className="text-xs font-bold text-ink-800 uppercase tracking-wider block">
          Olfactory Accords
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ACCORDS.map(accord => (
            <button
              key={accord}
              onClick={() => setFilters(prev => ({ ...prev, accord }))}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border-[1.5px] ${
                filters.accord === accord
                  ? 'bg-ink-950 text-white border-ink-950 font-bold'
                  : 'bg-ink-50 border-transparent text-ink-600 hover:bg-ink-100'
              }`}
            >
              {accord === 'all' ? 'All Accords' : accord}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Escrow Guarantee Card */}
      <div className="p-3.5 rounded-2xl bg-ink-50 border-[1.5px] border-ink-100 space-y-1 text-xs">
        <div className="font-display font-bold text-ink-800">48-Hour Inspection Escrow</div>
        <p className="text-[11px] text-ink-900/80 leading-relaxed">
          Every transaction on dcltr.in is protected. Inspect the fluid line and batch codes before funds release.
        </p>
      </div>
    </>
  );
}

export default function FilterSidebar() {
  const { initialFilterState, setFilters, mobileFiltersOpen, setMobileFiltersOpen } = useMarketplace();

  useBodyScrollLock(mobileFiltersOpen);

  const handleReset = () => setFilters(initialFilterState);

  return (
    <>
      {/* Desktop Sidebar (lg and up) */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-6">
        <div className="bg-white rounded-2xl p-5 border-[1.5px] border-ink-100 sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink-100">
            <h3 className="font-display text-xs font-bold text-ink-950 uppercase tracking-wider">Marketplace Filters</h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-ink-400 hover:text-ink-800 transition-colors"
            >
              Reset
            </button>
          </div>
          <FilterControls />
        </div>
      </aside>

      {/* Mobile Filter Drawer (below lg) */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-ink-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border-[1.5px] border-ink-100 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 shrink-0">
              <h3 className="font-display text-sm font-bold text-ink-950 uppercase tracking-wider">Filters</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-ink-400 hover:text-ink-800 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center text-ink-500 hover:text-ink-950 transition-all"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-6 overflow-y-auto">
              <FilterControls />
            </div>

            <div className="p-4 border-t border-ink-100 shrink-0">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-pop w-full py-3 rounded-full bg-ink-950 hover:bg-ink-800 text-white font-bold text-xs shadow-pop transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
