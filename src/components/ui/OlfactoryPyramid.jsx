import React, { useState } from 'react';

/**
 * Olfactory Pyramid — clean tiered breakdown of Top, Heart, and Base notes
 */
export default function OlfactoryPyramid({
  topNotes = [],
  heartNotes = [],
  baseNotes = [],
  accords = [],
  concentration = 'Eau de Parfum'
}) {
  const [activeTier, setActiveTier] = useState(null);

  const tiers = [
    { id: 'top', num: '01', label: 'Top Notes', sub: 'Opening', time: '15–30 Mins', notes: topNotes, fallback: 'Citrus, Spices, Aldehydes' },
    { id: 'heart', num: '02', label: 'Heart Notes', sub: 'Core Theme', time: '2–5 Hours', notes: heartNotes, fallback: 'Floral Accords, Resins, Woods' },
    { id: 'base', num: '03', label: 'Base Notes', sub: 'Drydown', time: '8–24+ Hours', notes: baseNotes, fallback: 'Ambergris, Vanilla, Sandalwood, Musk' },
  ];

  return (
    <div className="w-full rounded-xl border-[1.5px] border-ink-100 p-4 sm:p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-ink-100 pb-3">
        <span className="font-display font-bold tracking-tight uppercase text-xs text-ink-950">
          Olfactory Architecture
        </span>
        <span className="px-2 py-0.5 rounded-full border border-ink-200 text-ink-600 text-[10px] font-bold uppercase tracking-wider font-mono">
          {concentration}
        </span>
      </div>

      {/* Main Accords */}
      {accords.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] uppercase font-bold tracking-widest text-ink-400 mb-1.5">
            Key Accords
          </div>
          <div className="flex flex-wrap gap-1.5">
            {accords.map((accord, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-ink-950 text-white"
              >
                {accord}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pyramid Tiers */}
      <div className="space-y-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            onMouseEnter={() => setActiveTier(tier.id)}
            onMouseLeave={() => setActiveTier(null)}
            className={`p-3 rounded-lg border-[1.5px] transition-all duration-200 ${
              activeTier === tier.id ? 'bg-ink-950 border-ink-950' : 'bg-white border-ink-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold tracking-wider uppercase font-mono ${activeTier === tier.id ? 'text-white' : 'text-ink-950'}`}>
                {tier.num}. {tier.label} <span className="font-medium normal-case text-[9px]">({tier.sub})</span>
              </span>
              <span className={`text-[9px] font-mono ${activeTier === tier.id ? 'text-white/50' : 'text-ink-400'}`}>{tier.time}</span>
            </div>
            <p className={`text-xs leading-relaxed ${activeTier === tier.id ? 'text-white/80' : 'text-ink-600'}`}>
              {tier.notes.join(' • ') || tier.fallback}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
