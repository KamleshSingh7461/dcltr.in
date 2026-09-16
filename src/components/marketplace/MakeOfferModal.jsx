import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function MakeOfferModal() {
  const {
    activeModal,
    setActiveModal,
    productForOffer,
    setProductForOffer,
    submitOffer,
    showToast,
    formatPrice
  } = useMarketplace();

  const isOpen = activeModal === 'makeOffer' && Boolean(productForOffer);

  const [offerAmount, setOfferAmount] = useState(
    Math.round((productForOffer?.price || 0) * 0.9)
  );
  const [message, setMessage] = useState('');

  // Reset the offer form whenever a new product is opened for offer
  useEffect(() => {
    if (productForOffer) {
      setOfferAmount(Math.round(productForOffer.price * 0.9));
      setMessage('');
    }
  }, [productForOffer]);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const minOffer = productForOffer.minimumOffer || Math.round(productForOffer.price * 0.7);
  const discountPercent = Math.round(((productForOffer.price - offerAmount) / productForOffer.price) * 100);

  const handleClose = () => {
    setActiveModal(null);
    setProductForOffer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (offerAmount < minOffer) {
      showToast('Offer Below Minimum', `The minimum offer accepted by the seller is ${formatPrice(minOffer)}.`, 'error');
      return;
    }

    submitOffer({
      perfumeId: productForOffer.id,
      perfumeTitle: productForOffer.title,
      sellerId: productForOffer.seller.id,
      sellerName: productForOffer.seller.name,
      originalPrice: productForOffer.price,
      offerAmount,
      message
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white text-gray-900 shadow-2xl border border-gray-100">
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            MAKE A PRIVATE OFFER
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Submit Your Offer to Seller
          </h2>
        </div>

        {/* Product Snapshot */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4 mb-6">
          <img
            src={productForOffer.image}
            alt={productForOffer.name}
            className="w-14 h-14 rounded-xl object-cover border border-gray-200"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-amber-700">{productForOffer.brand}</div>
            <div className="text-sm font-bold text-gray-900 truncate">{productForOffer.name}</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">
              Listed Price: <span className="font-bold text-gray-900">{formatPrice(productForOffer.price)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
              <span>Your Offer Amount:</span>
              <span className="text-amber-800 font-mono text-sm">{formatPrice(offerAmount)} ({discountPercent}% under ask)</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={offerAmount}
                min={minOffer}
                max={productForOffer.price * 1.5}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold font-mono text-gray-900 focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>Min. floor: {formatPrice(minOffer)}</span>
              <span>Asking: {formatPrice(productForOffer.price)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Optional Note to Seller
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Ready to purchase immediately."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            If accepted, your transaction is backed by 48-Hour Escrow.
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm"
            >
              Send Offer
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
