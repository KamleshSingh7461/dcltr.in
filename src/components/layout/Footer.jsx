import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Droplets, Package, ArrowRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: '48-hr Escrow Window' },
  { icon: Droplets,    label: '±0.5ml Meniscus Vetting' },
  { icon: Package,     label: 'Batch Code Provenance' },
];

const HOUSES = [
  { label: 'Amouage Royal Extraits',          brand: 'Amouage' },
  { label: 'Creed Vintage Formulations',       brand: 'Creed' },
  { label: 'Roja Parfums Haute Luxe',          brand: 'Roja Parfums' },
  { label: 'Xerjoff Shooting Stars & Oud',    brand: 'Xerjoff' },
  { label: 'Tom Ford Private Blend',           brand: 'Tom Ford' },
  { label: 'Maison Francis Kurkdjian',         brand: 'Maison Francis Kurkdjian' },
];

export default function Footer() {
  const { setFilters, setActiveModal } = useMarketplace();
  const { setActivePage, switchSubdomain } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="relative overflow-hidden mt-16 bg-ink-950 text-white border-t-2 border-ink-950">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 text-xs">

        {/* ── Trust Badge Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 pb-12 border-b border-white/10">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold text-xs">{label}</div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider mt-0.5 font-mono">Collector Guarantee</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 4-Column Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Col 1: Brand */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center">
              <img
                src={logoImg}
                alt="dcltr.in"
                className="h-9 w-auto object-contain brightness-0 invert opacity-95"
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
              />
            </div>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs">
              The premier peer-to-peer exchange for authentic pre-loved fine fragrances, vintage formulations, and verified partial bottles.
            </p>
            {/* Newsletter */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Rare drops, first"
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/35 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="btn-pop px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-ink-950 hover:bg-ink-100 transition-colors shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 font-bold">
                <span>✓</span> You're on the list.
              </div>
            )}
          </div>

          {/* Col 2: Collector Guarantee */}
          <div>
            <h5 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-5">
              Collector Guarantee
            </h5>
            <ul className="space-y-3 text-white/50 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-0.5">◆</span>
                48-Hour Inspection Escrow Window
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-0.5">◆</span>
                ±0.5ml Fluid Meniscus Calibrated Vetting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-0.5">◆</span>
                Batch Code Provenance Verification
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-0.5">◆</span>
                KYC-Verified Sellers Only
              </li>
            </ul>
          </div>

          {/* Col 3: Houses */}
          <div>
            <h5 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-5">
              Curated Houses
            </h5>
            <ul className="space-y-2.5 text-xs">
              {HOUSES.map(({ label, brand }) => (
                <li key={brand}>
                  <button
                    onClick={() => setFilters(p => ({ ...p, brand }))}
                    className="text-white/50 hover:text-white transition-colors text-left font-medium"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Sell */}
          <div>
            <h5 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-5">
              Declutter Your Vanity
            </h5>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              Turn gently used fragrances into liquidity — zero listing fees, automated batch lookup.
            </p>
            <button
              onClick={() => setActiveModal('sellWizard')}
              className="btn-pop w-full py-3 rounded-xl font-bold text-xs bg-white text-ink-950 hover:bg-ink-100 shadow-[3px_3px_0_0_#ffffff30] hover:shadow-none transition-all font-display"
            >
              List a Fragrance Now
            </button>
          </div>

        </div>

        {/* ── Legal & Portal Links ───────────────────────────────────── */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { label: 'Terms & Conditions',       page: 'terms' },
              { label: 'Privacy Policy',            page: 'privacy' },
              { label: 'Refund & Cancellation',     page: 'refund-policy' },
              { label: 'Shipping Policy',           page: 'shipping-policy' },
              { label: 'Contact Us',                page: 'contact' },
            ].map(({ label, page }) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className="text-white/40 hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <button
              onClick={() => switchSubdomain('seller')}
              className="text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Seller Hub</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase font-mono">Portal</span>
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => switchSubdomain('admin')}
              className="text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Admin Console</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase font-mono">Vault</span>
            </button>
          </div>
        </div>

        {/* ── Bottom Strip ──────────────────────────────────────────── */}
        <div className="pt-5 mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-white/40">
            © 2026 dcltr.in — The Verified Secondary Fragrance Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-white/30 text-[11px]">
            <span>Escrow Protected</span>
            <span className="text-white/20">◆</span>
            <span>Batch Code Vetted</span>
            <span className="text-white/20">◆</span>
            <span>Direct Peer-to-Peer</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
