import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Plus, X, LogIn } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

function NavIconButton({ icon: Icon, label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200 cursor-pointer shrink-0 touch-manipulation select-none active:scale-95 ${
        active
          ? 'bg-ink-950 border-ink-950 text-white'
          : 'bg-white border-ink-200 text-ink-600 hover:text-ink-950 hover:border-ink-950'
      }`}
    >
      <Icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] pointer-events-none ${active ? 'fill-white' : ''}`} strokeWidth={2} />
      {count > 0 && (
        <span className="pointer-events-none absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-ink-950 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const { cart, wishlist, filters, setFilters, setActiveModal, initialFilterState } = useMarketplace();
  const { switchSubdomain, currentUser, isAuthenticated, setActivePage, setAccountTab, logout } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const goHome = () => {
    if (setActiveModal) setActiveModal(null);
    if (switchSubdomain) switchSubdomain('marketplace');
    if (setActivePage) setActivePage('home');
    setFilters(initialFilterState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAccount = (tab) => {
    if (!isAuthenticated || !currentUser) {
      setActivePage('login');
      return;
    }
    setAccountTab(tab);
    setActivePage('account');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-ink-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center gap-2 sm:gap-6">

          {/* Brand Logo */}
          <button
            type="button"
            onClick={goHome}
            className="flex items-center cursor-pointer select-none shrink-0 touch-manipulation active:opacity-75 focus:outline-none"
            aria-label="dcltr.in home"
          >
            <img
              src={logoImg}
              alt="dcltr.in"
              className="h-8 sm:h-11 md:h-13 w-auto object-contain pointer-events-none"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
            />
          </button>

          {/* Desktop Search */}
          <div className="flex-1 min-w-0 max-w-xl relative hidden md:block">
            <div className="group flex items-center w-full rounded-full bg-ink-50 border-[1.5px] border-transparent hover:border-ink-300 focus-within:border-ink-950 focus-within:bg-white transition-all duration-200 px-4 py-2.5">
              <Search className="w-4 h-4 text-ink-400 group-focus-within:text-ink-950 mr-2.5 shrink-0 transition-colors" />
              <input
                type="text"
                placeholder="Search perfumes, brands, notes or batch codes..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="bg-transparent border-none outline-none text-xs text-ink-950 placeholder-ink-400 w-full font-medium"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  aria-label="Clear search"
                  className="text-ink-400 hover:text-ink-800 ml-2 shrink-0 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right cluster — kept minimal on mobile to avoid overflow clipping */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">

            {/* Mobile search toggle (hidden on desktop) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center border-[1.5px] transition-all touch-manipulation active:scale-95 shrink-0 ${
                mobileSearchOpen
                  ? 'bg-ink-950 border-ink-950 text-white'
                  : 'bg-white border-ink-200 text-ink-600'
              }`}
            >
              {mobileSearchOpen
                ? <X className="w-4 h-4 pointer-events-none" />
                : <Search className="w-4 h-4 pointer-events-none" />}
            </button>

            {/* Wishlist */}
            <NavIconButton
              icon={Heart}
              label="Saved Fragrances"
              count={wishlist.length}
              active={wishlist.length > 0}
              onClick={() => openAccount('wishlist')}
            />

            {/* Cart */}
            <NavIconButton
              icon={ShoppingBag}
              label="Cart"
              count={cart.length}
              onClick={() => setActiveModal('cart')}
            />

            {/* Profile — hidden on mobile (< sm) to prevent overflow clipping */}
            <div className="hidden sm:flex items-center gap-2 border-l border-ink-100 pl-2">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openAccount('orders')}
                    title="My Account & Orders"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border-[1.5px] border-ink-200 hover:border-ink-950 bg-white hover:bg-ink-50 transition-all"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-ink-100 shrink-0"
                    />
                    <span className="text-xs font-bold text-ink-950 max-w-[90px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    title="Logout"
                    className="text-[11px] font-bold text-ink-400 hover:text-ink-950 px-2 py-1 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActivePage('login')}
                  title="Sign In"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border-[1.5px] border-ink-200 hover:border-ink-950 bg-white hover:bg-ink-50 text-xs font-bold text-ink-700 hover:text-ink-950 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
            </div>

            {/* Profile icon fallback on mobile only */}
            <button
              type="button"
              onClick={() => openAccount('orders')}
              title="My Account"
              aria-label="My Account"
              className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center border-[1.5px] border-ink-200 bg-white text-ink-600 overflow-hidden touch-manipulation active:scale-95 shrink-0"
            >
              {isAuthenticated && currentUser
                ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover pointer-events-none" />
                : <User className="w-4 h-4 pointer-events-none" />
              }
            </button>

            {/* List a Fragrance CTA (+ button on mobile) */}
            <button
              type="button"
              onClick={() => setActiveModal('sellWizard')}
              title="List a Fragrance"
              aria-label="List a Fragrance"
              className="btn-pop flex items-center justify-center gap-1 sm:gap-1.5 w-9 h-9 sm:w-auto px-0 sm:px-4 py-0 sm:py-2.5 rounded-lg bg-ink-950 hover:bg-ink-800 text-white font-bold text-xs shadow-pop transition-all shrink-0 touch-manipulation active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 pointer-events-none" strokeWidth={2.75} />
              <span className="hidden sm:inline pointer-events-none">List a Fragrance</span>
            </button>

          </div>
        </div>

        {/* Mobile Search bar — expands below header row */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 animate-fade-in">
            <div className="flex items-center w-full rounded-full bg-ink-50 border-[1.5px] border-ink-950 px-4 py-2.5">
              <Search className="w-4 h-4 text-ink-400 mr-2.5 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search perfumes, brands, notes..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="bg-transparent border-none outline-none text-xs text-ink-950 placeholder-ink-400 w-full font-medium"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  aria-label="Clear search"
                  className="text-ink-400 hover:text-ink-800 ml-2 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
