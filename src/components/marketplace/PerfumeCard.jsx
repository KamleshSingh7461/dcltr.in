import React, { useState } from 'react';
import { Heart, ShieldCheck, Eye } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export default function PerfumeCard({ perfume, index = 0 }) {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
    setActiveModal,
    setProductForOffer,
    formatPrice
  } = useMarketplace();

  const [imgLoaded, setImgLoaded] = useState(false);
  const isSaved = wishlist.includes(perfume.id);
  const pricePerMl = (perfume.price / perfume.remainingMl).toFixed(2);
  const retailPricePerMl = (perfume.retailMsrp / perfume.originalCapacityMl).toFixed(2);
  const savingsPercent = Math.round(((retailPricePerMl - pricePerMl) / retailPricePerMl) * 100);

  // Stagger classes
  const staggerClass = index < 9 ? `stagger-${index + 1}` : '';

  const handleCardClick = () => {
    setSelectedProduct(perfume);
    setActiveModal('productDetail');
  };

  const handleMakeOffer = (e) => {
    e.stopPropagation();
    setProductForOffer(perfume);
    setActiveModal('makeOffer');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(perfume);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(perfume.id);
  };

  // Packaging label
  const isTester = Boolean(perfume.isTester);
  const hasBox = Boolean(perfume.hasOriginalBox);
  const packagingLabel = isTester
    ? (hasBox ? 'Retail Tester with box' : 'Retail Tester without box')
    : (hasBox ? 'Retail with box' : 'Retail without box');

  // Fill tier
  const fill = perfume.fillPercentage ?? Math.round((perfume.remainingMl / perfume.originalCapacityMl) * 100);
  let partialTier = `${fill}% Full`;
  if (perfume.isSealed || fill === 100) partialTier = '100% Sealed';
  else if (fill <= 30) partialTier = `Low Partial (${fill}%)`;
  else if (fill <= 70) partialTier = `Mid Partial (${fill}%)`;
  else partialTier = `High Partial (${fill}%)`;

  // Fill bar color
  const fillColor = fill >= 70 ? '#22c55e' : fill >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div
      onClick={handleCardClick}
      className={`pro-card animate-slide-up ${staggerClass} rounded-lg sm:rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group relative bg-white select-none border border-ink-100 sm:border-0`}
    >
      {/* ── Portrait Image ───────────────────────────────────────────── */}
      <div className="relative aspect-[4/5] bg-ink-50 overflow-hidden flex items-center justify-center border-b border-ink-100 sm:border-b-[1.5px]">

        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}

        <img
          src={perfume.image}
          alt={perfume.title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Hover quick-action overlay (desktop only) */}
        <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end pb-3 px-3 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedProduct(perfume); setActiveModal('productDetail'); }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-ink-950 text-xs font-bold transition-all hover:bg-white"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Wishlist */}
        <div className="absolute top-1 right-1 sm:top-3 sm:right-3 z-20">
          <button
            onClick={handleToggleWishlist}
            className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full backdrop-blur-md shadow-sm border sm:border-[1.5px] flex items-center justify-center transition-all hover:scale-110 ${
              isSaved ? 'bg-ink-950 border-ink-950 text-white' : 'bg-white/90 border-ink-100 text-ink-400 hover:text-ink-950'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Batch Pill */}
        <div className="absolute top-1 left-1 sm:top-3 sm:left-3 z-20">
          <span className="px-1 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-ink-100 sm:border-[1.5px] text-[7.5px] sm:text-[10px] font-bold text-ink-950 font-mono leading-none flex items-center">
            <span className="hidden sm:inline text-ink-400 font-semibold mr-1">BATCH:</span>
            #{perfume.batchCode}
            {perfume.productionYear && <span className="hidden sm:inline text-ink-800 ml-1">({perfume.productionYear})</span>}
          </span>
        </div>

        {/* Escrow badge */}
        <div className="hidden sm:block absolute bottom-3 right-3 z-20">
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
            style={{ background: 'rgba(212,175,55,0.9)', color: '#08080B' }}
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            ESCROW
          </span>
        </div>

        {/* Savings ribbon */}
        {savingsPercent > 0 && (
          <div className="absolute bottom-1 left-1 sm:bottom-3 sm:left-3 z-20">
            <span className="px-1 sm:px-2 py-0.5 rounded sm:rounded-full bg-ink-950 text-white text-[7.5px] sm:text-[10px] font-bold font-mono leading-none">
              -{savingsPercent}%
            </span>
          </div>
        )}
      </div>

      {/* ── Fill Level Bar Strip ──────────────────────────────────────── */}
      <div className="bg-ink-50 border-b border-ink-100 sm:border-b-[1.5px] px-1.5 sm:px-3.5 py-1 sm:py-2">
        <div className="flex items-center justify-between text-[8px] sm:text-[11px] font-semibold mb-0.5 sm:mb-1.5 leading-none">
          <span className="text-ink-700 truncate max-w-[40px] sm:max-w-[140px]" title={packagingLabel}>
            <strong className="text-ink-950 hidden sm:inline">{packagingLabel}</strong>
            <span className="sm:hidden text-ink-700 font-bold">{fill}%</span>
          </span>
          <span className="text-ink-700 font-bold font-mono shrink-0">
            {perfume.remainingMl}ml
          </span>
        </div>
        {/* Visual fill bar */}
        <div className="h-1 sm:h-1.5 rounded-full bg-ink-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(fill, 100)}%`, background: fillColor }}
          />
        </div>
        <div className="hidden sm:block text-[10px] text-ink-500 mt-1 font-medium">{partialTier}</div>
      </div>

      {/* ── Info Body ─────────────────────────────────────────────────── */}
      <div className="p-1.5 sm:p-4 flex-1 flex flex-col justify-between space-y-1 sm:space-y-3">

        <div>
          <div className="text-[7.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-ink-800 truncate leading-none">
            {perfume.brand}
          </div>
          <h3 className="font-display text-[9.5px] sm:text-base font-bold text-ink-950 group-hover:text-ink-700 transition-colors truncate mt-0.5 leading-tight">
            {perfume.name}
          </h3>
          <p className="hidden sm:block text-xs text-ink-500 line-clamp-1 font-medium mt-0.5">
            {perfume.concentration} · {packagingLabel}
          </p>
        </div>

        {/* Accord pills */}
        <div className="hidden sm:flex flex-wrap gap-1">
          {perfume.accords?.slice(0, 3).map((accord, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-ink-50 text-ink-600 font-medium">
              {accord}
            </span>
          ))}
          {perfume.location && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border-[1.5px] border-ink-100 text-ink-600 font-medium ml-auto">
              {perfume.location.split(',')[0]}
            </span>
          )}
        </div>

        {/* Seller trust */}
        <div className="hidden sm:flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-ink-100">
          <div className="flex items-center gap-1.5">
            <img
              src={perfume.seller.avatar}
              alt={perfume.seller.name}
              className="w-4 h-4 rounded-full object-cover border border-ink-100"
            />
            <span className="font-medium text-ink-800 text-[11px] truncate max-w-[110px]">{perfume.seller.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-ink-700">
            <span className="text-ink-950">★</span>
            <span>{perfume.seller.rating}</span>
            <span className="text-ink-400 font-normal">({perfume.seller.salesCount} sold)</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-1 sm:pt-2 border-t border-ink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[9.5px] sm:text-lg font-bold text-ink-950 font-mono tracking-tight leading-none">
                {formatPrice(perfume.price)}
              </span>
              {perfume.retailMsrp && (
                <span className="hidden sm:inline text-xs text-ink-400 line-through font-mono">
                  {formatPrice(perfume.retailMsrp)}
                </span>
              )}
            </div>
            {savingsPercent > 0 && (
              <div className="hidden sm:block text-[10px] font-semibold text-emerald-700 font-mono">
                Save {savingsPercent}% vs Retail
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
            <button
              onClick={handleMakeOffer}
              className="hidden sm:block px-3 py-1.5 rounded-lg bg-white hover:bg-ink-50 text-ink-800 text-[11px] font-bold border-[1.5px] border-ink-200 hover:border-ink-400 transition-all"
              title="Make Offer"
            >
              Offer
            </button>
            <button
              onClick={handleAddToCart}
              className="btn-pop w-full sm:w-auto px-1 sm:px-3.5 py-0.5 sm:py-1.5 rounded sm:rounded-lg bg-ink-950 hover:bg-ink-800 text-white text-[8px] sm:text-[11px] font-bold shadow-none sm:shadow-pop transition-colors text-center leading-tight"
              title="Buy Now"
            >
              Buy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
