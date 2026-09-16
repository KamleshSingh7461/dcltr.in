import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import AddReviewModal from './AddReviewModal';

export default function ReviewSection({ perfumeId, masterId, batchCode }) {
  const { reviews } = useMarketplace();
  const [isAddingReview, setIsAddingReview] = useState(false);

  const perfumeReviews = reviews.filter(
    r => r.perfumeId === perfumeId || (masterId && r.masterId === masterId)
  );

  const avgRating = perfumeReviews.length > 0
    ? (perfumeReviews.reduce((sum, r) => sum + r.rating, 0) / perfumeReviews.length).toFixed(1)
    : '5.0';

  const avgLongevity = perfumeReviews.length > 0
    ? Math.round(perfumeReviews.reduce((sum, r) => sum + (r.longevityRating || 10), 0) / perfumeReviews.length)
    : 11;

  return (
    <div className="space-y-4 pt-5 border-t-[1.5px] border-ink-100">

      {/* Reviews Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-xs font-bold tracking-wide uppercase text-ink-950">
            Collector Appraisal &amp; Batch Telemetry
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-ink-950 text-xs tracking-tight">★★★★★</span>
            <span className="font-bold text-ink-950 text-xs">{avgRating} / 5.0</span>
            <span className="text-ink-400 text-[10px]">({perfumeReviews.length} Verified Reviews)</span>
          </div>
        </div>

        <button
          onClick={() => setIsAddingReview(true)}
          className="shrink-0 px-3 py-1.5 rounded-lg border-[1.5px] border-ink-950 text-ink-950 hover:bg-ink-950 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          Submit Appraisal
        </button>
      </div>

      {/* Telemetry Bar */}
      <div className="p-3 rounded-lg bg-ink-50 flex items-center justify-between text-[11px] text-ink-600 font-mono">
        <span>Consensus Skin Life: <strong className="text-ink-950">{avgLongevity}h+</strong></span>
        <span>Sillage: <strong className="text-ink-950">Heavy / Beast</strong></span>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {perfumeReviews.map(rev => (
          <div key={rev.id} className="p-3.5 rounded-lg border-[1.5px] border-ink-100 space-y-2">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={rev.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={rev.author}
                  className="w-5 h-5 rounded-full object-cover border border-ink-100"
                />
                <span className="text-xs font-bold text-ink-950">{rev.author}</span>
                {rev.verifiedPurchase && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-ink-950 text-white rounded font-bold uppercase">
                    Verified Batch
                  </span>
                )}
              </div>
              <span className="text-[9px] text-ink-400 font-mono">{rev.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-ink-950 text-[10px] tracking-tight">{'★'.repeat(rev.rating)}</span>
              <h5 className="text-xs font-bold text-ink-950">{rev.title}</h5>
            </div>

            <p className="text-xs text-ink-600 leading-relaxed font-light">
              {rev.content}
            </p>

            {/* Batch Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[9px] font-mono">
              {rev.batchCodeReviewed && (
                <span className="px-1.5 py-0.5 rounded bg-ink-50 text-ink-700 border border-ink-100">
                  BATCH #{rev.batchCodeReviewed}
                </span>
              )}
              {rev.longevityRating && (
                <span className="px-1.5 py-0.5 rounded bg-ink-50 text-ink-700 border border-ink-100">
                  {rev.longevityRating} HRS SKIN LIFE
                </span>
              )}
              {rev.sillageRating && (
                <span className="px-1.5 py-0.5 rounded bg-ink-50 text-ink-700 border border-ink-100 uppercase">
                  {rev.sillageRating} SILLAGE
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      {isAddingReview && (
        <AddReviewModal
          perfumeId={perfumeId}
          masterId={masterId}
          defaultBatch={batchCode}
          onClose={() => setIsAddingReview(false)}
        />
      )}
    </div>
  );
}
