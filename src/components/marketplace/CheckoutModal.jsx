import React, { useState } from 'react';
import {
  X, ChevronRight, ChevronLeft, MapPin, CreditCard, ShieldCheck,
  CheckCircle, Package, Truck, Clock, Copy, Tag, Smartphone, Building2, Lock,
  ExternalLink
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const IN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi (NCT)','Chandigarh','Puducherry','Jammu & Kashmir','Ladakh'
];

const PROMO_CODES = {
  'DCLTR10':  { discount: 0.10, label: '10% off' },
  'WELCOME50':{ discount: 50, flat: true, label: '₹50 flat off' },
};

const STEPS = ['Review', 'Address', 'Payment', 'Confirm'];

// ─── Step indicator — clean dots, no numbered circles ───────────────────────
function StepIndicator({ current }) {
  return (
    <div className="flex items-center mb-7">
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`transition-all duration-300 ${
                done
                  ? 'w-5 h-5 rounded-full bg-ink-950 flex items-center justify-center'
                  : active
                  ? 'w-5 h-5 rounded-full border-2 border-ink-950 bg-white'
                  : 'w-3 h-3 rounded-full bg-gray-200'
              }`}>
                {done && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                active ? 'text-ink-950' : done ? 'text-ink-400' : 'text-gray-300'
              }`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-all ${done ? 'bg-ink-950' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Shared input class ──────────────────────────────────────────────────────
const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:border-ink-950 focus:bg-white focus:outline-none transition-colors';

// ─── Step 1: Order Review ────────────────────────────────────────────────────
function StepReview({ items, formatPrice, subtotal, total, promoCode, setPromoCode,
  promoApplied, applyPromo, promoDiscount, onNext }) {
  return (
    <div className="space-y-5">
      {/* Items */}
      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <img src={item.image} alt={item.name}
              className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{item.brand}</div>
              <div className="text-xs font-bold text-gray-900 truncate">{item.name}</div>
              <div className="text-[10px] text-gray-400 font-mono">{item.fillPercentage}% · {item.remainingMl}ml</div>
            </div>
            <span className="font-extrabold text-gray-900 font-mono text-xs shrink-0">{formatPrice(item.price)}</span>
          </div>
        ))}
      </div>

      {/* Promo */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Promo code</label>
        {promoApplied ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1">{promoCode} — {PROMO_CODES[promoCode]?.label}</span>
            <button onClick={() => { setPromoCode(''); applyPromo(''); }}
              className="text-emerald-500 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())}
              placeholder="e.g. DCLTR10"
              className={inp + ' flex-1 font-mono uppercase'} />
            <button onClick={() => applyPromo(promoCode)}
              className="px-4 py-2 rounded-xl bg-ink-950 text-white text-xs font-bold hover:bg-black transition-colors">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Escrow note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-900 leading-snug">
          Your money doesn't move until you're happy. Once it arrives, you have 48 hours to check the bottle — then release payment. Not satisfied? Open a dispute.
        </p>
      </div>

      {/* Price summary */}
      <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs font-medium text-gray-500">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-bold text-emerald-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span>Platform fee</span>
          <span className="font-bold text-emerald-600">Free (buyer)</span>
        </div>
        {promoApplied && promoDiscount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Promo</span>
            <span className="font-mono">−{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="font-mono">{formatPrice(total)}</span>
        </div>
      </div>

      <button onClick={onNext}
        className="w-full py-3.5 rounded-2xl bg-ink-950 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step 2: Delivery Address ────────────────────────────────────────────────
function StepAddress({ address, setAddress, onNext, onBack }) {
  const handleSubmit = e => { e.preventDefault(); onNext(); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Delivery address</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Full name *</label>
          <input required className={inp} placeholder="As on ID" value={address.fullName}
            onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Mobile *</label>
          <input required type="tel" className={inp} placeholder="+91 98765 43210" value={address.phone}
            onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">PIN code *</label>
          <input required maxLength={6} className={inp + ' font-mono'} placeholder="110001" value={address.zip}
            onChange={e => setAddress(a => ({ ...a, zip: e.target.value.replace(/\D/,'').slice(0,6) }))} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Flat / Street *</label>
          <input required className={inp} placeholder="14B, MG Road, Opp. Metro Station" value={address.street}
            onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">City *</label>
          <input required className={inp} placeholder="Mumbai" value={address.city}
            onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">State *</label>
          <select required value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
            className={inp + ' font-medium'}>
            <option value="">— Select state —</option>
            {IN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Landmark</label>
          <input className={inp} placeholder="Optional" value={address.landmark || ''}
            onChange={e => setAddress(a => ({ ...a, landmark: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Address type</label>
          <select value={address.type || 'Home'} onChange={e => setAddress(a => ({ ...a, type: e.target.value }))}
            className={inp + ' font-medium'}>
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-gray-200 text-gray-500 text-xs font-bold hover:border-gray-800 hover:text-gray-900 transition-all">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button type="submit"
          className="flex-1 py-3 rounded-2xl bg-ink-950 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 3: Payment method (no raw card entry — Easebuzz handles that) ──────
function StepPayment({ paymentMethod, setPaymentMethod, upiId, setUpiId, onNext, onBack }) {
  const methods = [
    { id: 'upi',        icon: <Smartphone className="w-5 h-5" />, label: 'UPI',         sub: 'GPay · PhonePe · Paytm',       hosted: false },
    { id: 'card',       icon: <CreditCard  className="w-5 h-5" />, label: 'Card',        sub: 'Debit · Credit · RuPay',        hosted: true  },
    { id: 'netbanking', icon: <Building2   className="w-5 h-5" />, label: 'Net Banking', sub: 'HDFC · SBI · ICICI · Axis',     hosted: true  },
  ];
  const selected = methods.find(m => m.id === paymentMethod);
  const handleSubmit = e => { e.preventDefault(); onNext(); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payment method</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {methods.map(m => (
          <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
            className={`relative p-3 rounded-xl border-2 text-left flex flex-col gap-1.5 transition-all ${
              paymentMethod === m.id ? 'border-ink-950 bg-ink-950 text-white shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-400 text-gray-700'
            }`}>
            {m.hosted && (
              <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold px-1 py-0.5 rounded ${
                paymentMethod === m.id ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-600'
              }`}>
                {m.id === 'card' ? 'Easebuzz' : 'Redirect'}
              </span>
            )}
            <div className={paymentMethod === m.id ? 'text-white' : 'text-gray-500'}>{m.icon}</div>
            <div className="text-[11px] font-extrabold leading-tight">{m.label}</div>
            <div className={`text-[9px] leading-tight ${paymentMethod === m.id ? 'text-gray-300' : 'text-gray-400'}`}>{m.sub}</div>
          </button>
        ))}
      </div>

      {paymentMethod === 'upi' && (
        <div className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Your UPI ID *</label>
            <input required value={upiId} onChange={e => setUpiId(e.target.value)}
              className={inp + ' font-mono'} placeholder="yourname@okhdfcbank" />
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
            <div className="text-[10px] font-extrabold text-blue-800 flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> What happens
            </div>
            <div className="text-[10px] text-blue-700 space-y-0.5">
              <p>① Easebuzz sends a collect request to your UPI app</p>
              <p>② You approve — funds go into escrow</p>
              <p>③ You come back here to track delivery</p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-gray-900">Secure card entry — Easebuzz</div>
              <div className="text-[10px] text-gray-400">PCI-DSS Level 1 · 256-bit SSL</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Card details go directly into Easebuzz's encrypted page — never ours. You'll be redirected when you click Pay.
          </p>
          <div className="flex items-center gap-1.5">
            {['VISA','MC','RuPay','Amex'].map(n => (
              <div key={n} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-500">{n}</div>
            ))}
          </div>
        </div>
      )}

      {paymentMethod === 'netbanking' && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-gray-900">Net banking redirect</div>
              <div className="text-[10px] text-gray-400">Powered by Easebuzz · 50+ banks</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Pick your bank on Easebuzz's page, then log into your bank's own portal to approve. Returns here when done.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['HDFC','SBI','ICICI','Axis','Kotak','PNB','Yes'].map(b => (
              <div key={b} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-500">{b}</div>
            ))}
            <div className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-400">+50</div>
          </div>
        </div>
      )}

      {selected?.hosted && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800">
          <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>After reviewing your order, you'll be redirected to <strong>Easebuzz</strong> to pay, then brought back here.</span>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-gray-200 text-gray-500 text-xs font-bold hover:border-gray-800 transition-all">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button type="submit"
          className="flex-1 py-3 rounded-2xl bg-ink-950 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">
          Review order <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 4: Confirm ─────────────────────────────────────────────────────────
function StepConfirm({ items, address, paymentMethod, upiId, total, formatPrice, isProcessing, onPlace, onBack }) {
  const methodLabel = {
    upi: `UPI — ${upiId || 'your app'}`,
    card: 'Card (via Easebuzz)',
    netbanking: 'Net Banking (via Easebuzz)',
  }[paymentMethod] || paymentMethod;

  return (
    <div className="space-y-4">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Confirm order</span>

      <div className="space-y-2 text-xs">
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Items</div>
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-700 font-medium truncate max-w-[180px]">{item.brand} — {item.name}</span>
              <span className="font-mono font-bold text-gray-900 ml-2 shrink-0">{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Deliver to</div>
          <p className="text-gray-800 font-medium leading-relaxed">
            {address.fullName}<br />
            {address.street}{address.landmark ? `, ${address.landmark}` : ''}<br />
            {address.city}, {address.state} — {address.zip}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{address.phone} · {address.type || 'Home'}</p>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pay with</div>
          <p className="text-gray-800 font-medium">{methodLabel}</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-900 leading-snug">
          Your payment goes into escrow — the seller gets nothing until you've checked the bottle and given the go-ahead. You have 48 hours after delivery.
        </p>
      </div>

      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-sm font-extrabold text-gray-900">Total</span>
        <span className="text-lg font-extrabold text-gray-900 font-mono">{formatPrice(total)}</span>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onBack} disabled={isProcessing}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-gray-200 text-gray-500 text-xs font-bold hover:border-gray-800 transition-all disabled:opacity-40">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button onClick={onPlace} disabled={isProcessing}
          className="flex-1 py-3.5 rounded-2xl bg-ink-950 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {isProcessing ? (
            <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Locking funds in escrow...</>
          ) : (
            <><Lock className="w-3.5 h-3.5" /> Pay {formatPrice(total)} — held in escrow</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Success screen ──────────────────────────────────────────────────────────
function OrderSuccess({ order, formatPrice, onClose, onViewOrders }) {
  const [copied, setCopied] = useState(false);
  const copyId = () => {
    navigator.clipboard.writeText(order.id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-2 space-y-5 text-center">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-2xl bg-ink-950 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-gray-900">You're all set 🎉</h3>
        <p className="text-xs text-gray-400 mt-1">Payment locked in escrow. The seller can't touch it until you're happy.</p>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 mx-auto">
        <span className="text-[10px] font-bold text-gray-400">Order</span>
        <span className="font-mono font-extrabold text-gray-900 text-xs">#{order.id}</span>
        <button onClick={copyId} className="text-gray-400 hover:text-gray-700 transition-colors">
          {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="text-left space-y-2 px-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Here's what happens next</p>
        {[
          { icon: <Package className="w-3.5 h-3.5" />, color: 'text-amber-600 bg-amber-50',  title: 'Seller packs',         sub: 'Tamper-evident seal + weight photo — within 24h.' },
          { icon: <Truck   className="w-3.5 h-3.5" />, color: 'text-blue-600 bg-blue-50',    title: 'Ships to you',         sub: "Tracking number sent the moment it leaves their hands." },
          { icon: <Clock   className="w-3.5 h-3.5" />, color: 'text-purple-600 bg-purple-50',title: 'Your 48-hour check',   sub: "Batch code, liquid level — happy? Release. Not? Dispute." },
          { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-emerald-600 bg-emerald-50', title: 'Done',          sub: "Money goes to the seller. Drop a review." },
        ].map(s => (
          <div key={s.title} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
            <div className={`w-6 h-6 rounded-lg ${s.color} flex items-center justify-center shrink-0 mt-0.5`}>{s.icon}</div>
            <div>
              <div className="text-xs font-bold text-gray-900">{s.title}</div>
              <div className="text-[10px] text-gray-400 leading-snug">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onViewOrders}
          className="flex-1 py-3 rounded-2xl border-2 border-ink-950 text-ink-950 font-bold text-xs hover:bg-gray-50 transition-colors">
          Track order
        </button>
        <button onClick={onClose}
          className="flex-1 py-3 rounded-2xl bg-ink-950 hover:bg-black text-white font-bold text-xs transition-colors">
          Keep browsing
        </button>
      </div>
    </div>
  );
}

// ─── Main checkout modal ─────────────────────────────────────────────────────
export default function CheckoutModal() {
  const { cart, activeModal, setActiveModal, checkoutEscrow, selectedProduct, formatPrice, platformSettings } = useMarketplace();
  const { isAuthenticated, currentUser, setActivePage } = useAuth();

  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [address, setAddress] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '', city: '', state: '', zip: '', landmark: '', type: 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState(currentUser?.upiId || '');

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useBodyScrollLock(activeModal === 'checkout');

  if (activeModal !== 'checkout') return null;

  const itemsToCheckout = cart.length > 0 ? cart : (selectedProduct ? [selectedProduct] : []);
  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.price, 0);
  const total = Math.max(0, subtotal - promoDiscount);

  const applyPromo = code => {
    if (!code) { setPromoApplied(false); setPromoDiscount(0); return; }
    const promo = PROMO_CODES[code];
    if (!promo) { alert('Invalid promo code. Try DCLTR10 or WELCOME50.'); return; }
    setPromoApplied(true);
    setPromoDiscount(promo.flat ? promo.discount / 85 : subtotal * promo.discount);
  };

  const handleClose = () => { setActiveModal(null); setStep(0); setCompletedOrder(null); };

  const handlePlace = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        perfumeId: itemsToCheckout.length === 1 ? itemsToCheckout[0].id : undefined,
        itemIds: itemsToCheckout.map(i => i.id),
        perfumeTitle: itemsToCheckout.length === 1
          ? itemsToCheckout[0].title
          : `${itemsToCheckout.length} Fragrance Lots`,
        sellerId: itemsToCheckout[0]?.seller?.id,
        sellerName: itemsToCheckout[0]?.seller?.name,
        subtotal, totalAmount: total,
        shippingAddress: address,
        paymentMethod,
        promoCode: promoApplied ? promoCode : null,
      };
      await checkoutEscrow(payload);
      setCompletedOrder({ id: `ord-${Math.floor(1000 + Math.random() * 9000)}`, ...payload });
    } finally {
      setIsProcessing(false);
    }
  };

  // Auth wall
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
        <div className="w-full sm:max-w-sm bg-white sm:rounded-3xl rounded-t-3xl p-7 text-center space-y-5 shadow-2xl relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-ink-950 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Sign in to checkout</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Free to join. Your money stays in escrow until you're satisfied.
            </p>
          </div>
          <button onClick={() => { handleClose(); setActivePage('login'); }}
            className="w-full py-3 rounded-2xl bg-ink-950 hover:bg-black text-white font-bold text-sm transition-colors">
            Sign in or create account
          </button>
          <button onClick={handleClose} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative w-full sm:max-w-2xl flex flex-col sm:flex-row bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl sm:my-8">

        {/* Dark left strip — desktop only */}
        {!completedOrder && (
          <div className="hidden sm:flex sm:w-44 shrink-0 bg-ink-950 flex-col justify-between p-6">
            <div className="space-y-6">
              <div className="text-white font-extrabold text-base tracking-tight">
                dcltr<span className="text-ink-400">.in</span>
              </div>
              <div className="space-y-3">
                {[
                  { dot: 'bg-emerald-400', text: 'Escrow protected'  },
                  { dot: 'bg-blue-400',    text: 'Easebuzz payments' },
                  { dot: 'bg-amber-400',   text: '48h to inspect'    },
                  { dot: 'bg-purple-400',  text: 'Dispute support'   },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.dot}`} />
                    <span className="text-[11px] text-ink-300 font-medium">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-ink-500 leading-relaxed">
              Your money moves<br />only when you say so.
            </p>
          </div>
        )}

        {/* Right content panel */}
        <div className="flex-1 p-6 sm:p-7 overflow-y-auto max-h-[92vh] sm:max-h-[85vh]">

          {!completedOrder && (
            <button onClick={handleClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-300 hover:text-gray-800 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
          )}

          {completedOrder ? (
            <OrderSuccess
              order={completedOrder}
              formatPrice={formatPrice}
              onClose={handleClose}
              onViewOrders={() => { handleClose(); setActivePage('account'); }}
            />
          ) : (
            <>
              <p className="sm:hidden text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-4">dcltr.in checkout</p>
              <StepIndicator current={step} />

              {step === 0 && (
                <StepReview
                  items={itemsToCheckout} formatPrice={formatPrice}
                  subtotal={subtotal} total={total}
                  promoCode={promoCode} setPromoCode={setPromoCode}
                  promoApplied={promoApplied} applyPromo={applyPromo} promoDiscount={promoDiscount}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && (
                <StepAddress address={address} setAddress={setAddress} onNext={() => setStep(2)} onBack={() => setStep(0)} />
              )}
              {step === 2 && (
                <StepPayment
                  paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                  upiId={upiId} setUpiId={setUpiId}
                  onNext={() => setStep(3)} onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepConfirm
                  items={itemsToCheckout} address={address}
                  paymentMethod={paymentMethod} upiId={upiId}
                  total={total} formatPrice={formatPrice}
                  isProcessing={isProcessing} onPlace={handlePlace} onBack={() => setStep(2)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
