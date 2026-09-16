import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function AddReviewModal({ perfumeId, masterId, defaultBatch, onClose }) {
  const { addReview, showToast } = useMarketplace();

  useBodyScrollLock(true);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [batchCode, setBatchCode] = useState(defaultBatch || '');
  const [longevity, setLongevity] = useState(10);
  const [sillage, setSillage] = useState('Heavy');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('Missing Details', 'Please provide a title and appraisal notes.', 'error');
      return;
    }

    addReview({
      perfumeId,
      masterId,
      rating,
      title,
      content,
      batchCodeReviewed: batchCode,
      longevityRating: longevity,
      sillageRating: sillage,
      verifiedPurchase: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl p-6 border-[1.5px] border-ink-950 bg-white text-ink-950 shadow-pop-lg">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center text-ink-500 hover:text-ink-950 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="text-[10px] uppercase text-ink-400 tracking-widest font-bold">Collector Appraisal</div>
          <h3 className="font-display text-xl font-bold text-ink-950">Record Olfactory Performance</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          {/* Star Rating */}
          <div>
            <label className="block text-[10px] uppercase text-ink-500 font-bold mb-1">Overall Formulation Score</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-ink-950 text-ink-950' : 'text-ink-200'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase text-ink-500 font-bold mb-1">Appraisal Headline</label>
            <input
              type="text"
              placeholder="e.g. Rare 2019 formulation with deep birch drydown"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-ink-50 border-[1.5px] border-transparent rounded-lg px-3 py-2 text-xs text-ink-950 focus:border-ink-950 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Longevity Slider */}
          <div>
            <div className="flex justify-between text-xs text-ink-700 mb-1">
              <span className="font-bold text-[10px] uppercase">Skin Life Longevity</span>
              <span className="text-ink-950 font-bold">{longevity} Hours</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={longevity}
              onChange={(e) => setLongevity(Number(e.target.value))}
              className="w-full accent-ink-950"
            />
          </div>

          {/* Sillage Selector */}
          <div>
            <label className="block text-[10px] uppercase text-ink-500 font-bold mb-1">Sillage Projection</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Intimate', 'Moderate', 'Heavy', 'Beast Mode'].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSillage(opt)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold uppercase border-[1.5px] transition-all ${
                    sillage === opt
                      ? 'bg-ink-950 text-white border-ink-950'
                      : 'bg-ink-50 border-transparent text-ink-500 hover:text-ink-950'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Code */}
          <div>
            <label className="block text-[10px] uppercase text-ink-500 font-bold mb-1">Batch Code Tested</label>
            <input
              type="text"
              placeholder="e.g. 19P11, A93"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
              className="w-full bg-ink-50 border-[1.5px] border-transparent rounded-lg px-3 py-2 text-xs uppercase text-ink-950 font-mono focus:border-ink-950 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[10px] uppercase text-ink-500 font-bold mb-1">Detailed Olfactory Breakdown</label>
            <textarea
              rows={3}
              placeholder="Detail the opening, transitions, projection radius, and formulation differences..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-ink-50 border-[1.5px] border-transparent rounded-lg p-3 text-xs text-ink-950 focus:border-ink-950 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-ink-50 text-ink-700 text-xs font-bold hover:bg-ink-100 uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-pop px-5 py-2 rounded-lg bg-ink-950 hover:bg-ink-800 text-white text-xs font-bold uppercase tracking-wider shadow-pop transition-colors"
            >
              Publish Appraisal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
