import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Silk-smooth loading sequence
    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500); // fade out duration
      return () => clearTimeout(removeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-out select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient subtle backdrop glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-100/80 via-white to-white pointer-events-none" />

      <div className="relative flex flex-col items-center z-10 space-y-6 px-4">
        {/* Animated Brand Flacon / Logo Container */}
        <div className="relative">
          {/* Subtle ambient halo */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/25 via-neutral-200/35 to-amber-200/25 rounded-3xl blur-xl animate-pulse" />

          {/* Logo with gentle pulse & pop */}
          <div className="relative p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-neutral-100 shadow-sm animate-pop-in">
            <img
              src={logoImg}
              alt="dcltr.in"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-700 hover:scale-105"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
            />
          </div>
        </div>

        {/* Minimal High-Fashion Progress Line */}
        <div className="w-40 sm:w-52 h-1 bg-neutral-100 rounded-full overflow-hidden relative shadow-inner">
          <div className="h-full bg-ink-950 rounded-full animate-loader-bar" />
        </div>

        {/* Brand Tagline */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-widest uppercase text-neutral-400 font-bold animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>The Verified Secondary Fragrance Marketplace</span>
        </div>
      </div>
    </div>
  );
}
