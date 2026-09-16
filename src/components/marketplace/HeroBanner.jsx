import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, TrendingUp, Clock, Droplets, CheckCircle2, Zap } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import PerfumeBottle3D from '../3d/PerfumeBottle3D';

// ─── Live Activity Ticker Data ────────────────────────────────────────────────
const TICKER_EVENTS = [
  { type: 'sold',   text: 'Creed Aventus 19P01 — 85ml sold',   price: '₹18,400', city: 'Mumbai' },
  { type: 'listed', text: 'Amouage Interlude Man — 50ml listed', price: '₹12,800', city: 'Delhi' },
  { type: 'offer',  text: 'Offer accepted on Roja Scandal',      price: '₹22,000', city: 'Bengaluru' },
  { type: 'sold',   text: 'Tom Ford Oud Wood — sealed sold',    price: '₹9,200',  city: 'Hyderabad' },
  { type: 'listed', text: 'Xerjoff Naxos 75ml — just listed',   price: '₹14,500', city: 'Pune' },
  { type: 'sold',   text: 'MFK Baccarat Rouge 540 — 70ml sold', price: '₹16,100', city: 'Chennai' },
  { type: 'offer',  text: 'Counter-offer on Clive Christian X', price: '₹34,000', city: 'Kolkata' },
  { type: 'listed', text: 'Kilian Love Don\'t Be Shy — 50ml',    price: '₹11,200', city: 'Ahmedabad' },
  { type: 'sold',   text: 'Parfums de Marly Layton batch sold', price: '₹8,700',  city: 'Jaipur' },
  { type: 'listed', text: 'Le Labo Santal 33 — 100ml listed',   price: '₹7,900',  city: 'Surat' },
];

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Quick Category Pills ─────────────────────────────────────────────────────
const QUICK_PILLS = [
  { emoji: '✨', label: 'All Flacons',       fillPreset: 'all',         condition: 'all',    brand: 'all' },
  { emoji: '🔥', label: '~50ml Partials',    fillPreset: 'mid_partial', condition: 'all',    brand: 'all' },
  { emoji: '💎', label: 'Low Remnants',      fillPreset: 'low_partial', condition: 'all',    brand: 'all' },
  { emoji: '📦', label: 'Sealed New',        fillPreset: 'all',         condition: 'sealed', brand: 'all' },
  { emoji: '👑', label: 'Creed Batches',     fillPreset: 'all',         condition: 'all',    brand: 'Creed' },
  { emoji: '🌟', label: 'High Fill (71%+)',  fillPreset: 'high_partial',condition: 'all',    brand: 'all' },
];

// ─── Trust Stat Card ─────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, sublabel, delay, started }) {
  const count = useCountUp(value, 1800, started);
  return (
    <div
      className="animate-slide-up flex flex-col items-center text-center px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
      style={{ animationDelay: delay }}
    >
      <div className="text-gold-gradient font-cinzel text-2xl sm:text-3xl font-bold tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white text-[11px] font-semibold mt-1 leading-none">{label}</div>
      <div className="text-white/40 text-[10px] mt-0.5">{sublabel}</div>
    </div>
  );
}

export default function HeroBanner() {
  const { filters, setFilters, setActiveModal } = useMarketplace();
  const [started, setStarted] = useState(false);
  const heroRef = useRef(null);

  // Trigger counters when hero enters viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollToExchange = () => {
    document.getElementById('exchange-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePillClick = (pill) => {
    setFilters(prev => ({
      ...prev,
      fillPreset: pill.fillPreset,
      condition:  pill.condition,
      brand:      pill.brand,
    }));
    scrollToExchange();
  };

  // Build double-length ticker array for seamless loop
  const tickerItems = [...TICKER_EVENTS, ...TICKER_EVENTS];

  return (
    <section
      ref={heroRef}
      className="hero-grain relative w-full bg-[#08080B] overflow-hidden"
      style={{ minHeight: 'clamp(520px, 85vh, 780px)' }}
    >
      {/* ── Ambient Floating Orbs ─────────────────────────────────────── */}
      <div
        className="animate-float absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)', zIndex: 0 }}
      />
      <div
        className="animate-float-slow absolute top-1/4 right-0 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 65%)', zIndex: 0 }}
      />
      <div
        className="animate-float-med absolute bottom-0 left-1/3 w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(180,140,30,0.1) 0%, transparent 60%)', zIndex: 0 }}
      />

      {/* ── Radial vignette overlay ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(8,8,11,0.8) 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ─── LEFT: Editorial Copy ──────────────────────────────── */}
          <div className="lg:col-span-7 space-y-7">

            {/* Trust badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] dot-live" />
              <span className="font-cinzel text-[#D4AF37] text-[11px] tracking-widest font-semibold uppercase">
                Verified Secondary Market • Live
              </span>
            </div>

            {/* Headline */}
            <div className="animate-slide-up space-y-1" style={{ animationDelay: '0.08s' }}>
              <div className="font-cinzel text-[#D4AF37]/60 text-xs tracking-[0.35em] uppercase mb-3">
                The Private Vault &amp; Exchange
              </div>
              <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] font-bold text-white tracking-tight">
                Buy &amp; Sell{' '}
                <span className="text-gold-gradient">Authentic</span>
                <br />
                Pre-Loved{' '}
                <span className="relative">
                  Fragrances
                  <span
                    className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }}
                  />
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className="animate-slide-up text-white/55 text-sm sm:text-base leading-relaxed max-w-xl font-sans"
              style={{ animationDelay: '0.14s' }}
            >
              Discover rare discontinued vintage batches, verified partial bottles, and authenticated decants — all backed by{' '}
              <span className="text-[#D4AF37] font-semibold">48-hour escrow</span>{' '}
              and ±0.5ml meniscus vetting.
            </p>

            {/* CTA Buttons */}
            <div
              className="animate-slide-up flex flex-wrap items-center gap-3 pt-1"
              style={{ animationDelay: '0.18s' }}
            >
              <button
                onClick={scrollToExchange}
                className="btn-gold-pop px-6 py-3 rounded-full font-bold text-sm text-[#08080B] flex items-center gap-2 shrink-0"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #C49B2A)' }}
              >
                Browse Available Flacons
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveModal('sellWizard')}
                className="px-6 py-3 rounded-full font-bold text-sm text-white border border-white/20 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all shrink-0"
              >
                + Consign a Flacon
              </button>
            </div>

            {/* Trust Stats */}
            <div
              className="animate-slide-up grid grid-cols-3 gap-3 pt-2"
              style={{ animationDelay: '0.22s' }}
            >
              <StatCard value={30000}  suffix="+"  label="Verified Collectors" sublabel="KYC-verified" delay="0.26s" started={started} />
              <StatCard value={48}     suffix="hr" label="Escrow Window"       sublabel="Buyer protection" delay="0.30s" started={started} />
              <StatCard value={99}     suffix="%"  label="Auth Rate"          sublabel="Batch vetted" delay="0.34s" started={started} />
            </div>

          </div>

          {/* ─── RIGHT: 3D Flacon Lab Card ─────────────────────────── */}
          <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div
              className="relative rounded-3xl overflow-hidden animate-glow-pulse"
              style={{
                border: '1px solid rgba(212,175,55,0.3)',
                background: 'linear-gradient(145deg, #111115, #0E0E12)',
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b"
                style={{ borderColor: 'rgba(212,175,55,0.15)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-cinzel text-white/80 text-[11px] tracking-widest uppercase">
                    3D Flacon Lab
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
                >
                  Interactive · Rotate &amp; Spray
                </span>
              </div>

              {/* 3D Viewer */}
              <div className="relative">
                <PerfumeBottle3D
                  initialFill={70}
                  initialJuiceColor="#E59866"
                  interactiveControls={true}
                />
                {/* Radial shimmer overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, #0E0E12, transparent)' }}
                />
              </div>

              {/* Card footer */}
              <div
                className="flex items-center justify-between px-5 py-3 border-t"
                style={{ borderColor: 'rgba(212,175,55,0.15)' }}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-white/50 text-[11px]">Fluid Fill Simulator</span>
                </div>
                <span className="text-[#D4AF37] text-[11px] font-semibold font-cinzel tracking-wide">
                  Tom Ford · Lost Cherry
                </span>
              </div>

              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none" style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, transparent 60%)',
              }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none" style={{
                background: 'linear-gradient(315deg, rgba(212,175,55,0.2) 0%, transparent 60%)',
              }} />
            </div>

            {/* Feature badge row under card */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: ShieldCheck, label: 'Escrow Protected' },
                { icon: Droplets,    label: '±0.5ml Vetted'   },
                { icon: Zap,         label: 'Instant Escrow'  },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl border"
                  style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(255,255,255,0.025)' }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                  <span className="text-white/50 text-[10px] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Quick Category Pills ─────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="font-cinzel text-[10px] text-white/30 tracking-[0.3em] uppercase mb-4">
            Quick Collections
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PILLS.map((pill, idx) => {
              const isActive =
                filters.fillPreset === pill.fillPreset &&
                (filters.condition || 'all') === pill.condition &&
                filters.brand === pill.brand;
              return (
                <button
                  key={idx}
                  onClick={() => handlePillClick(pill)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive ? 'hero-pill-active' : 'hero-pill'
                  }`}
                >
                  <span>{pill.emoji}</span>
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Live Activity Ticker ─────────────────────────────────────────────── */}
      <div
        className="relative border-t mt-2"
        style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(0,0,0,0.3)', zIndex: 10 }}
      >
        <div className="marquee-wrapper py-2.5">
          <div className="flex animate-marquee gap-0" style={{ width: 'max-content' }}>
            {tickerItems.map((event, i) => (
              <div key={i} className="flex items-center gap-5 px-8 whitespace-nowrap shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                    event.type === 'sold'
                      ? 'bg-emerald-900/60 text-emerald-400'
                      : event.type === 'offer'
                      ? 'bg-amber-900/50 text-amber-400'
                      : 'bg-blue-900/50 text-blue-400'
                  }`}
                >
                  {event.type === 'sold' ? '● SOLD' : event.type === 'offer' ? '◈ OFFER' : '+ LISTED'}
                </span>
                <span className="text-white/70 text-[11px] font-medium">{event.text}</span>
                <span className="text-[#D4AF37] text-[11px] font-bold font-mono">{event.price}</span>
                <span className="text-white/30 text-[10px]">{event.city}</span>
                <span className="text-white/15 text-[10px] mx-2">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
