import React from 'react';

/**
 * Architectural Flacon Level Indicator — monochrome chassis, true-color liquid.
 */
export default function BottleLevelIndicator({
  remainingMl = 50,
  originalCapacityMl = 100,
  juiceColor = '#0A0A0C',
  hasCap = true,
  isSealed = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabels = true,
  interactive = false,
  onLevelChange = null
}) {
  const fillPercentage = Math.min(100, Math.max(0, Math.round((remainingMl / originalCapacityMl) * 100)));

  const dims = {
    sm: { width: 38, height: 60, capW: 16, capH: 12, neckW: 8, neckH: 4, labelText: 'text-[9px]' },
    md: { width: 62, height: 96, capW: 24, capH: 18, neckW: 12, neckH: 6, labelText: 'text-[11px]' },
    lg: { width: 94, height: 148, capW: 36, capH: 26, neckW: 16, neckH: 8, labelText: 'text-xs' }
  }[size] || { width: 62, height: 96, capW: 24, capH: 18, neckW: 12, neckH: 6, labelText: 'text-[11px]' };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Flacon Silhouette */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: `${dims.width}px` }}
      >
        {/* Stopper / Cap */}
        {hasCap ? (
          <div
            className="relative shadow-lg overflow-hidden"
            style={{
              width: `${dims.capW}px`,
              height: `${dims.capH}px`,
              background: 'linear-gradient(135deg, #4D4D57 0%, #232328 55%, #0A0A0C 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12" />
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-black/60" />
          </div>
        ) : (
          <div
            className="bg-ink-400 border border-ink-600 flex items-center justify-center"
            style={{ width: `${dims.neckW}px`, height: `${dims.neckH + 2}px` }}
          >
            <div className="w-1.5 h-1 bg-ink-100 rounded-full" />
          </div>
        )}

        {/* Neck */}
        <div
          className="bg-ink-800 border-x border-white/10"
          style={{ width: `${dims.neckW}px`, height: `${dims.neckH}px` }}
        />

        {/* Flacon Chamber */}
        <div
          className="relative overflow-hidden border border-ink-950"
          style={{
            width: `${dims.width}px`,
            height: `${dims.height}px`,
            background: '#151518',
            boxShadow: '0 12px 30px -8px rgba(0,0,0,0.5)'
          }}
        >
          {/* Inner Dip Tube */}
          <div className="absolute top-0 bottom-1 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent z-10 pointer-events-none" />

          {/* Liquid Reservoir */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-end">
            <div
              className="w-full relative transition-all duration-500 ease-out"
              style={{
                height: `${fillPercentage}%`,
                background: `linear-gradient(180deg, ${juiceColor}CC 0%, ${juiceColor} 100%)`,
              }}
            >
              {fillPercentage > 0 && fillPercentage < 100 && (
                <div
                  className="absolute -top-[1.5px] inset-x-0 h-[2px] bg-white/50"
                  style={{ filter: 'drop-shadow(0 -1px 2px rgba(255,255,255,0.4))' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-white/5 to-black/25 pointer-events-none" />
            </div>
          </div>

          {/* Measurement Markers */}
          {size !== 'sm' && (
            <div className="absolute right-1 top-2 bottom-3 flex flex-col justify-between py-1 pointer-events-none opacity-40">
              <div className="w-1.5 h-[1px] bg-white/70" />
              <div className="w-1 h-[1px] bg-white/40" />
              <div className="w-1.5 h-[1px] bg-white/70" />
              <div className="w-1 h-[1px] bg-white/40" />
              <div className="w-1.5 h-[1px] bg-white/70" />
            </div>
          )}

          <div className="absolute inset-y-0 left-0 w-[1.5px] bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[1.5px] bg-black/60 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 pointer-events-none" />

          {isSealed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-white text-ink-950 text-[8px] font-mono font-bold tracking-widest px-1 py-0.5 uppercase border border-ink-950">
                SEALED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Numerical Indicators */}
      {showLabels && (
        <div className="mt-2.5 text-center">
          <div className={`font-mono font-bold tracking-tight ${dims.labelText} text-ink-950`}>
            {remainingMl} ML
            <span className="text-ink-300 mx-1">/</span>
            <span className="text-ink-400 font-medium">{originalCapacityMl} ML</span>
          </div>
          <div className="text-[10px] text-ink-500 font-mono tracking-wider mt-0.5">
            {fillPercentage}% FILL
            {!hasCap && <span className="text-ink-400 ml-1">(NO CAP)</span>}
          </div>
        </div>
      )}

      {interactive && onLevelChange && (
        <div className="w-full mt-3 px-1">
          <input
            type="range"
            min="1"
            max={originalCapacityMl}
            value={remainingMl}
            onChange={(e) => onLevelChange(Number(e.target.value))}
            className="w-full accent-ink-950"
          />
        </div>
      )}
    </div>
  );
}
