import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function CartDrawer() {
  const { cart, removeFromCart, activeModal, setActiveModal, formatPrice } = useMarketplace();

  useBodyScrollLock(activeModal === 'cart');

  if (activeModal !== 'cart') return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = 0; // Free insured shipping
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    setActiveModal('checkout');
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in"
    >
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl p-4 sm:p-6 text-gray-900 border-l border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-extrabold text-gray-900">Your Cart</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 font-mono">
              {cart.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="text-gray-400 hover:text-gray-900 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length > 0 ? (
            cart.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-700">{item.brand}</div>
                    <div className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      {item.fillPercentage}% full ({item.remainingMl}ml)
                    </div>
                    <div className="text-xs font-bold text-gray-900 font-mono mt-0.5">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="text-4xl">🛍️</div>
              <p className="text-ink-700 text-sm font-bold">Your cart is empty</p>
              <p className="text-ink-400 text-xs">Add a fragrance to get started</p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-2 px-5 py-2.5 rounded-full bg-ink-950 text-white text-xs font-bold hover:bg-ink-800 transition-colors"
              >
                Browse Flacons
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-gray-100 space-y-3 text-xs">
            <div className="space-y-1.5 text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Shipping:</span>
                <span className="font-bold text-emerald-700 font-mono">FREE</span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span>48h Escrow Guarantee:</span>
                <span className="font-bold font-mono">INCLUDED</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md tracking-wider"
            >
              Proceed to Escrow Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
