import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Heart, Shield, Plus,
  Globe, Sparkles, ChevronDown, Check,
  PackageCheck, Award, Lock, SlidersHorizontal, ArrowRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import logoImg from '../../assets/logo.png';

export default function Navbar() {
  const { 
    cart, 
    wishlist,
    offers, 
    pendingModeration,
    currentRole, 
    setCurrentRole,
    activeCurrency,
    setActiveCurrency,
    currencyRates,
    filters, 
    setFilters,
    setActiveModal,
    showToast
  } = useMarketplace();

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const pendingOffersCount = offers.filter(o => o.status === 'pending').length;
  const pendingModerationCount = pendingModeration.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#EAE6DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      
      {/* 1. Sovereign Haute Parfumerie Top Strip */}
      <div className="bg-[#09090B] text-white px-4 py-1.5 text-xs border-b border-amber-950/40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] tracking-wide">
          
          {/* Trust Banner Headline */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[#D4AF37] font-semibold">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> Haute Parfumerie Private Vault & Exchange
            </span>
            <span className="hidden md:inline text-neutral-600">•</span>
            <span className="hidden md:inline text-neutral-300 font-medium">
              48-Hour Escrow Protection • ±0.5ml Meniscus Vetting • Certified Batch Registry
            </span>
          </div>

          {/* Right Controls: Currency Switcher & Persona Switcher */}
          <div className="flex items-center gap-4">
            
            {/* Global Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/50 text-neutral-200 transition-all text-[11px] font-mono"
              >
                <Globe className="w-3 h-3 text-[#D4AF37]" />
                <span>{activeCurrency} ({currencyRates[activeCurrency]?.symbol})</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 rounded-xl bg-white border border-[#EAE6DF] text-neutral-900 shadow-2xl z-50 py-1 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 font-cinzel">
                    Select Currency
                  </div>
                  {Object.values(currencyRates).map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setActiveCurrency(c.code);
                        setCurrencyDropdownOpen(false);
                        showToast('Currency Updated', `Displaying all valuations in ${c.code} (${c.symbol})`, 'info');
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors ${
                        activeCurrency === c.code ? 'text-[#09090B] font-bold bg-[#FBF8F1]' : 'text-neutral-700'
                      }`}
                    >
                      <span className="font-medium">{c.code}</span>
                      <span className="text-amber-700 font-mono text-xs">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collector Role Switcher */}
            <div className="flex items-center bg-neutral-900/90 rounded-full p-0.5 text-[10px] border border-neutral-800">
              <button
                onClick={() => { setCurrentRole('buyer'); showToast('Collector Mode', 'Browsing private vault listings.'); }}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  currentRole === 'buyer' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Collector
              </button>
              <button
                onClick={() => { setCurrentRole('seller'); showToast('Consignment Studio', 'Manage lots and private offers.'); }}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  currentRole === 'seller' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => { setCurrentRole('admin'); showToast('Vault Command', 'Vetting & moderation ledger.'); }}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all flex items-center gap-1 ${
                  currentRole === 'admin' ? 'bg-amber-400 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Vault Admin {pendingModerationCount > 0 && `(${pendingModerationCount})`}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Main Luxury Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Official Brand Logo */}
        <div 
          className="flex items-center cursor-pointer select-none py-1 shrink-0"
          onClick={() => setFilters(prev => ({ ...prev, search: '', brand: 'all', fillPreset: 'all' }))}
        >
          <img 
            src={logoImg} 
            alt="dcltr.in" 
            className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105 duration-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo.png';
            }}
          />
        </div>

        {/* Bespoke Luxury Search Bar with Concierge AI */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="flex items-center w-full rounded-full bg-[#FAF8F5] border border-[#E8E2D2] hover:border-[#D4AF37] focus-within:border-[#09090B] focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100/50 transition-all px-4 py-2 shadow-inner">
            <Search className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search vintage batches, rare houses (Amouage, Roja, Clive Christian), or notes..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-transparent border-none outline-none text-xs text-neutral-900 placeholder-neutral-400 w-full font-medium"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="text-neutral-400 hover:text-neutral-700 mr-2 text-xs font-bold"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {
                showToast('Concierge Scent Assistant', 'Searching authenticated vault formulations...', 'info');
              }}
              className="px-3.5 py-1 rounded-full bg-[#09090B] hover:bg-[#18181B] text-[#D4AF37] text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 border border-[#D4AF37]/30"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-cinzel tracking-wider">AI Concierge</span>
            </button>
          </div>
        </div>

        {/* Right Nav Action Items */}
        <div className="flex items-center gap-3">
          
          {/* 3D Flacon Studio Trigger */}
          <button
            onClick={() => setActiveModal('modelViewer')}
            className="p-2 px-3.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D2] text-neutral-800 hover:border-[#D4AF37] hover:bg-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            title="Open 3D CAD Flacon Inspector"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="hidden sm:inline font-cinzel text-[11px] tracking-wider">3D Studio</span>
          </button>
          
          {/* Admin Command Hub Pill */}
          <button
            onClick={() => setActiveModal('admin')}
            className={`p-2 px-3 rounded-full border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              currentRole === 'admin'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-[#EAE6DF] text-neutral-600 hover:bg-[#FAF8F5]'
            }`}
            title="Admin Moderation Queue"
          >
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden xl:inline font-cinzel text-[11px]">Vault Admin</span>
            {pendingModerationCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center">
                {pendingModerationCount}
              </span>
            )}
          </button>

          {/* Seller Studio / Offers Pill */}
          <button
            onClick={() => setActiveModal('myListings')}
            className="p-2 px-3.5 rounded-full bg-white border border-[#EAE6DF] text-neutral-800 hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Seller Dashboard"
          >
            <PackageCheck className="w-4 h-4 text-neutral-700" />
            <span className="hidden lg:inline text-xs font-medium">My Lots</span>
            {pendingOffersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center animate-bounce">
                {pendingOffersCount}
              </span>
            )}
          </button>

          {/* Wishlist Heart */}
          <button
            onClick={() => showToast('Watchlist', `${wishlist.length} saved fragrances in your private portfolio.`)}
            className="relative p-2.5 rounded-full bg-white border border-[#EAE6DF] text-neutral-600 hover:text-amber-600 hover:border-amber-300 transition-all"
            title="Watchlist"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-amber-600 text-amber-600' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#09090B] text-[#D4AF37] font-bold text-[10px] flex items-center justify-center border border-[#D4AF37]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            onClick={() => setActiveModal('cart')}
            className="relative p-2.5 rounded-full bg-white border border-[#EAE6DF] text-neutral-800 hover:text-amber-700 hover:border-[#D4AF37] transition-all"
            title="Vault Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#09090B] text-[#D4AF37] font-bold text-[10px] flex items-center justify-center border border-[#D4AF37]">
                {cart.length}
              </span>
            )}
          </button>

          {/* Primary Action CTA: + Consign a Flacon */}
          <button
            onClick={() => setActiveModal('sellWizard')}
            className="px-4 py-2.5 rounded-full bg-[#09090B] hover:bg-[#18181B] text-[#D4AF37] font-bold text-xs shadow-md border border-[#D4AF37]/40 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-cinzel tracking-wider">Consign Flacon</span>
          </button>

        </div>

      </div>

    </header>
  );
}
