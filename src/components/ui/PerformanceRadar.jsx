import React from 'react';

/**
 * Performance Gauge — longevity, sillage, and season fit at a glance
 */
export default function PerformanceRadar({
  longevityHours = 10,
  sillage = 'Heavy',
  bestSeasons = ['Fall', 'Winter', 'Spring'],
  genderLean = 'Unisex'
}) {
  const sillageMap = {
    'Intimate': { level: 25, label: 'Intimate' },
    'Moderate': { level: 50, label: 'Moderate' },
    'Heavy': { level: 75, label: 'Heavy' },
    'Beast Mode': { level: 100, label: 'Intense (Beast)' }
  };

  const sillageInfo = sillageMap[sillage] || sillageMap['Heavy'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

      {/* Longevity */}
      <div className="border-[1.5px] border-ink-100 rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-ink-400 text-[10px] uppercase font-bold">
          <span>Longevity</span>
          <span className="text-ink-950 font-bold font-mono">{longevityHours}h+</span>
        </div>
        <div className="mt-2.5">
          <div className="h-1.5 w-full bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink-950 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (longevityHours / 16) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-ink-400 mt-1 font-mono">
            <span>4h</span>
            <span>8h</span>
            <span>12h+</span>
          </div>
        </div>
      </div>

      {/* Sillage */}
      <div className="border-[1.5px] border-ink-100 rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-ink-400 text-[10px] uppercase font-bold">
          <span>Sillage / Trail</span>
          <span className="text-ink-950 font-semibold">{sillageInfo.label}</span>
        </div>
        <div className="mt-2.5">
          <div className="h-1.5 w-full bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink-950 rounded-full transition-all duration-500"
              style={{ width: `${sillageInfo.level}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-ink-400 mt-1 font-mono">
            <span>Intimate</span>
            <span>Moderate</span>
            <span>Intense</span>
          </div>
        </div>
      </div>

      {/* Seasonality */}
      <div className="border-[1.5px] border-ink-100 rounded-lg p-3 flex flex-col justify-between">
        <div className="text-ink-400 text-[10px] uppercase font-bold">
          Season & Profile
        </div>
        <div className="flex flex-wrap items-center gap-1 mt-2">
          {bestSeasons.map((season, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[9px] bg-ink-50 text-ink-700 uppercase font-semibold"
            >
              {season}
            </span>
          ))}
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-ink-950 text-white uppercase font-semibold">
            {genderLean}
          </span>
        </div>
      </div>

    </div>
  );
}
