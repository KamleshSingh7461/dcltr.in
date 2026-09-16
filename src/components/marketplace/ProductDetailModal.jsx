import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import BottleLevelIndicator from '../ui/BottleLevelIndicator';
import OlfactoryPyramid from '../ui/OlfactoryPyramid';
import PerformanceRadar from '../ui/PerformanceRadar';
import ReviewSection from '../reviews/ReviewSection';

export default function ProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    activeModal,
    setActiveModal,
    addToCart,
    wishlist,
    toggleWishlist,
    setProductForOffer,
    formatPrice
  } = useMarketplace();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useBodyScrollLock(activeModal === 'productDetail' && Boolean(selectedProduct));

  if (activeModal !== 'productDetail' || !selectedProduct) return null;

  const isSaved = wishlist.includes(selectedProduct.id);
  const pricePerMl = (selectedProduct.price / selectedProduct.remainingMl).toFixed(2);
  const retailPerMl = (selectedProduct.retailMsrp / selectedProduct.originalCapacityMl).toFixed(2);
  const savingsPercent = Math.round(((retailPerMl - pricePerMl) / retailPerMl) * 100);

  const images = selectedProduct.verificationImages || [selectedProduct.image];

  const handleClose = () => {
    setActiveModal(null);
    setSelectedProduct(null);
    setActiveImageIndex(0);
  };

  const handleMakeOffer = () => {
    setProductForOffer(selectedProduct);
    setActiveModal('makeOffer');
  };

  const handleDirectBuy = () => {
    addToCart(selectedProduct);
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-white text-ink-950 shadow-pop-lg my-6 border-[1.5px] border-ink-950 max-h-[calc(100vh-3rem)] flex flex-col">

        {/* Top-Right Action Cluster */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
              isSaved ? 'bg-ink-950 border-ink-950 text-white' : 'bg-white/90 border-ink-200 text-ink-500 hover:text-ink-950'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/90 border-[1.5px] border-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-950 hover:border-ink-950 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1">

          {/* Left Column: Multi-photo Gallery & Bottle Fill Details */}
          <div className="lg:col-span-6 bg-ink-50 p-6 sm:p-8 border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-ink-100 flex flex-col justify-between space-y-6 overflow-y-auto">

            {/* Gallery: Thumbnail strip on left + Main photo */}
            <div className="flex gap-4">

              {images.length > 1 && (
                <div className="flex flex-col gap-2 shrink-0">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-ink-950' : 'border-ink-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Photo Chamber */}
              <div className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-white border-[1.5px] border-ink-100 flex items-center justify-center">
                <img
                  src={images[activeImageIndex] || selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />

                {/* Batch Code Stamp Tag */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border-[1.5px] border-ink-950 rounded-full px-3 py-1 text-xs font-bold text-ink-950 flex items-center gap-1.5 font-mono">
                  <span className="text-ink-400 font-medium">BATCH:</span>
                  <span>#{selectedProduct.batchCode}</span>
                  {selectedProduct.productionYear && <span className="text-ink-600">({selectedProduct.productionYear})</span>}
                </div>

                {/* Escrow Seal Badge */}
                <div className="absolute bottom-3 right-3 bg-ink-950 rounded-full px-3 py-1 text-[11px] font-bold text-white">
                  48H ESCROW INSPECTION
                </div>
              </div>

            </div>

            {/* Fill Level Inspection — bottle graphic + numeric readout */}
            <div className="bg-white rounded-xl p-4 border-[1.5px] border-ink-100 flex items-center gap-4">
              <BottleLevelIndicator
                remainingMl={selectedProduct.remainingMl}
                originalCapacityMl={selectedProduct.originalCapacityMl}
                juiceColor={selectedProduct.juiceColor || '#0A0A0C'}
                hasCap={selectedProduct.hasCap !== false}
                isSealed={selectedProduct.isSealed}
                size="sm"
                showLabels={false}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">Remaining Liquid</div>
                <div className="text-lg font-extrabold text-ink-950 font-mono">
                  {selectedProduct.remainingMl} ML <span className="text-xs text-ink-400 font-normal">/ {selectedProduct.originalCapacityMl} ML</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-ink-950 text-white font-bold text-[11px] font-mono">
                    {selectedProduct.fillPercentage}% Full
                  </span>
                  <span className="text-[11px] text-ink-500 font-semibold">
                    Backlit Meniscus Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Trust & Verification Card */}
            <div className="p-4 rounded-xl bg-white border-[1.5px] border-ink-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedProduct.seller.avatar}
                  alt={selectedProduct.seller.name}
                  className="w-11 h-11 rounded-full object-cover border-[1.5px] border-ink-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink-950 flex items-center gap-1.5 truncate">
                    {selectedProduct.seller.name}
                    {selectedProduct.seller.isVerifiedSeller && (
                      <span className="px-1.5 py-0.5 rounded bg-ink-950 text-white text-[10px] font-bold shrink-0">
                        ID Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-500">
                    {selectedProduct.seller.salesCount} Verified Sales • {selectedProduct.seller.responseRate} Response
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-ink-950 flex items-center gap-1 justify-end">
                  <span>★</span>
                  <span>{selectedProduct.seller.rating}</span>
                </div>
                <div className="text-[10px] text-ink-400">Since {selectedProduct.seller.memberSince}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Title, Specifications, Actions & Reviews */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 overflow-y-auto">

            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-3 pr-16">
                <span className="text-xs uppercase font-extrabold tracking-wider text-ink-500">
                  {selectedProduct.brand} • {selectedProduct.concentration}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-ink-200 text-ink-600 shrink-0">
                  {selectedProduct.location}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-950 mt-1 tracking-tight">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-ink-400 mt-1 font-medium">
                {selectedProduct.title}
              </p>
            </div>

            {/* Price & Action Box */}
            <div className="p-5 rounded-xl border-[1.5px] border-ink-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <div className="font-display text-3xl font-bold text-ink-950 font-mono tracking-tight">
                    {formatPrice(selectedProduct.price)}
                  </div>
                  {selectedProduct.retailMsrp && (
                    <span className="text-xs text-ink-400 line-through font-mono">
                      Orig. {formatPrice(selectedProduct.retailMsrp)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink-600 font-medium mt-1 font-mono">
                  {formatPrice(Number(pricePerMl))}/ml
                  {savingsPercent > 0 && <span className="text-emerald-700 ml-1.5 font-bold">({savingsPercent}% below retail)</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {selectedProduct.acceptsOffers && (
                  <button
                    onClick={handleMakeOffer}
                    className="px-4 py-2.5 rounded-lg bg-white hover:bg-ink-50 text-ink-950 border-[1.5px] border-ink-950 text-xs font-bold transition-all"
                  >
                    Make Offer
                  </button>
                )}
                <button
                  onClick={handleDirectBuy}
                  className="btn-pop px-6 py-2.5 rounded-lg bg-ink-950 hover:bg-ink-800 text-white text-xs font-bold shadow-pop transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ink-950">
                Fragrance Specifications &amp; Condition
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-ink-50">
                  <div className="text-ink-400 text-[10px] uppercase font-bold">Full Capacity</div>
                  <div className="font-bold text-ink-950 mt-0.5 font-mono">{selectedProduct.originalCapacityMl} ML</div>
                </div>

                <div className="p-3 rounded-lg bg-ink-50">
                  <div className="text-ink-400 text-[10px] uppercase font-bold">Fill Bracket</div>
                  <div className="font-bold text-ink-950 mt-0.5 font-mono">
                    {
                      (selectedProduct.fillPercentage <= 30) ? `Low Partial (${selectedProduct.fillPercentage}%)` :
                      (selectedProduct.fillPercentage <= 70) ? `Mid Partial (${selectedProduct.fillPercentage}%)` :
                      (selectedProduct.fillPercentage < 100) ? `High Partial (${selectedProduct.fillPercentage}%)` :
                      '100% Sealed New'
                    }
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-ink-50">
                  <div className="text-ink-400 text-[10px] uppercase font-bold">Packaging &amp; Presentation</div>
                  <div className="font-bold text-ink-950 mt-0.5">
                    {
                      Boolean(selectedProduct.isTester)
                        ? (Boolean(selectedProduct.hasOriginalBox) ? 'Retail Tester with box' : 'Retail Tester without box')
                        : (Boolean(selectedProduct.hasOriginalBox) ? 'Retail with box' : 'Retail without box')
                    }
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-ink-50">
                  <div className="text-ink-400 text-[10px] uppercase font-bold">Batch Code Provenance</div>
                  <div className="font-bold text-ink-950 mt-0.5 font-mono">#{selectedProduct.batchCode} ({selectedProduct.productionYear || 'Verified'})</div>
                </div>
              </div>
            </div>

            {/* Seller Story & Storage Notes */}
            <div className="space-y-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ink-950">
                Seller Storage &amp; Provenance Notes
              </h4>
              <p className="text-xs text-ink-700 bg-ink-50 p-4 rounded-xl leading-relaxed">
                "{selectedProduct.description}"
              </p>
            </div>

            {/* Olfactory Pyramid */}
            <OlfactoryPyramid
              topNotes={selectedProduct.topNotes}
              heartNotes={selectedProduct.heartNotes}
              baseNotes={selectedProduct.baseNotes}
              accords={selectedProduct.accords}
              concentration={selectedProduct.concentration}
            />

            {/* Performance Radar */}
            <PerformanceRadar
              longevityHours={selectedProduct.longevityHoursAvg || 10}
              sillage={selectedProduct.sillageAvg || 'Moderate-Heavy'}
              bestSeasons={['Fall', 'Winter', 'Spring']}
            />

            {/* Escrow Guarantee Box */}
            <div className="p-4 rounded-xl border-[1.5px] border-ink-950 text-xs text-ink-800 leading-relaxed">
              <strong className="font-bold text-ink-950">100% Escrow Buyer Protection:</strong> Funds are held safely until you receive your bottle and complete your 48-hour inspection to verify scent authenticity, batch stamp, and liquid level.
            </div>

            {/* Community Reviews & Scent Citations */}
            <ReviewSection
              perfumeId={selectedProduct.id}
              masterId={selectedProduct.masterId}
              batchCode={selectedProduct.batchCode}
            />

          </div>

        </div>

      </div>
    </div>
  );
}
