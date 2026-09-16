import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export default function SellerDashboardPage() {
  const { 
    offers, updateOfferStatus, perfumes, orders, fulfillOrder, requestPayout,
    updateListingPrice, deleteListing, users, formatPrice, setActiveModal,
    payoutRequests, platformSettings, reviews
  } = useMarketplace();

  const { currentUser, switchSubdomain, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('UPI');
  const [accountDetails, setAccountDetails] = useState('collector@okhdfcbank');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  // Fulfillment Form State
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [courierName, setCourierName] = useState('Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [weightGrams, setWeightGrams] = useState('320');
  const [tamperSealId, setTamperSealId] = useState('DCLTR-SEC-7741');

  // Price Editing State
  const [editingPerfumeId, setEditingPerfumeId] = useState(null);
  const [newPriceVal, setNewPriceVal] = useState('');

  // Counter Offer State
  const [counteringOfferId, setCounteringOfferId] = useState(null);
  const [counterPriceVal, setCounterPriceVal] = useState('');

  // Settings State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Collector',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+91 98765 43210',
    upiId: currentUser?.upiId || 'collector@okhdfcbank',
    bankAccount: 'HDFC Bank A/C XXXX1234',
    ifsc: 'HDFC0001234',
    businessName: 'dcltr Verified Seller',
    city: 'Mumbai',
    notifyOffers: true,
    notifyOrders: true,
    notifyPayouts: true
  });

  const sellerData = currentUser || users[0];
  const sellerPendingOrders = orders.filter(o => o.sellerId === 'seller-you' || o.status === 'escrow_held');
  const sellerCompletedOrders = orders.filter(o => ['completed_released', 'refunded_to_buyer'].includes(o.status));
  const sellerDisputedOrders = orders.filter(o => o.status === 'disputed' || (o.disputeData && ['completed_released', 'refunded_to_buyer'].includes(o.status)));
  const myPayoutRequests = payoutRequests.filter(p => p.sellerId === 'seller-you' || p.sellerId === sellerData?.id);
  const allMyPayouts = payoutRequests; // In real app, filter by seller ID

  // Revenue stats
  const totalRevenue = orders.filter(o => o.status === 'completed_released').reduce((acc, o) => acc + (o.sellerNetPayout || o.price * 0.92), 0);
  const thisMonthRevenue = totalRevenue * 0.4; // Simulated
  const lastMonthRevenue = totalRevenue * 0.35; // Simulated

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    requestPayout(sellerData.id || 'seller-you', Number(withdrawAmount), withdrawMethod, accountDetails);
    setShowWithdrawForm(false);
    setWithdrawAmount('');
  };

  const handleFulfillmentSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderId || !trackingNumber) return;
    fulfillOrder(selectedOrderId, { courier: courierName, trackingNumber, weightGrams: Number(weightGrams), tamperSealId });
    setSelectedOrderId(null);
    setTrackingNumber('');
  };

  const handlePriceSave = (perfumeId) => {
    if (newPriceVal && Number(newPriceVal) > 0) updateListingPrice(perfumeId, Number(newPriceVal));
    setEditingPerfumeId(null);
  };

  const handleCounterSubmit = (offerId) => {
    if (counterPriceVal && Number(counterPriceVal) > 0) updateOfferStatus(offerId, 'countered', Number(counterPriceVal));
    setCounteringOfferId(null);
    setCounterPriceVal('');
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Wallet' },
    { id: 'inventory', label: 'Inventory & Listings', count: perfumes.length },
    { id: 'offers', label: 'Collector Offers', count: offers.filter(o => o.status === 'pending').length, alert: offers.some(o => o.status === 'pending') },
    { id: 'fulfillment', label: 'Fulfillment', count: sellerPendingOrders.length, alert: sellerPendingOrders.length > 0 },
    { id: 'payouts', label: 'Bank Payouts' },
    { id: 'reputation', label: 'Trust & Reputation' },
    { id: 'sales', label: 'Sales History' },
    { id: 'disputes', label: 'Disputes & Returns', count: sellerDisputedOrders.length },
    { id: 'settings', label: 'Settings & Profile' }
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-[#111827]">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shrink-0 hidden md:flex flex-col justify-between p-5 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <img src={logoImg} alt="dcltr.in" className="h-12 object-contain" />
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 font-mono">SELLER COMMAND</div>
              <div className="text-xs font-bold text-gray-900">seller.dcltr.in</div>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isActive ? 'bg-gray-900 text-white font-extrabold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      tab.alert ? 'bg-amber-500 text-white' : isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>{tab.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-2.5">
            <img src={sellerData.avatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-200" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-gray-900 truncate">{sellerData.name}</div>
              <div className="text-[10px] text-amber-700 font-bold font-mono">★ {sellerData.rating} Verified</div>
            </div>
          </div>
          <button onClick={() => switchSubdomain('marketplace')} className="w-full py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 flex items-center justify-center gap-1.5 transition-all">
            ← View Storefront
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">

        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
          <header className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight capitalize truncate">
                {tabs.find(t => t.id === activeTab)?.label || activeTab}
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 font-medium">
                Manage your fragrance collection with verified meniscus and scale-weight protection.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Flat ₹{platformSettings.flatFeeAmount || 100} Platform Fee (0% Commission)
              </span>
              <button onClick={() => setActiveModal('sellWizard')} className="px-3.5 sm:px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap">
                + List New
              </button>
            </div>
          </header>

          {/* Mobile Tab Bar (hidden md and up, where the sidebar takes over) */}
          <nav className="md:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-none">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      tab.alert ? 'bg-amber-500 text-white' : isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>{tab.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">

          {/* ==================== TAB 1: OVERVIEW & WALLET ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg relative overflow-hidden">
                  <div className="text-xs text-gray-300 font-medium">Available Balance</div>
                  <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">{formatPrice(sellerData.walletBalance)}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                    Requires admin approval to withdraw
                  </div>
                  <button onClick={() => setShowWithdrawForm(true)} className="mt-4 w-full py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs shadow-sm transition-all">
                    Request Withdrawal
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200">
                  <div className="text-xs text-amber-900 font-bold">Locked in {platformSettings.escrowWindowHours}h Escrow</div>
                  <div className="text-3xl font-black text-amber-900 font-mono mt-2 tracking-tight">{formatPrice(sellerData.escrowLocked)}</div>
                  <div className="text-[11px] text-amber-800 mt-1 font-medium">Auto-release after buyer inspection.</div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-600 font-bold">Completed Sales</div>
                  <div className="text-3xl font-black text-gray-950 font-mono mt-2 tracking-tight">{sellerData.salesCount} Bottles</div>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium">
                    Trust Rating: <strong className="text-amber-600">★ {sellerData.rating}</strong>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-lg font-black text-gray-900 font-mono">{perfumes.length}</div>
                  <div className="text-[10px] text-gray-500 font-bold">Active Listings</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-lg font-black text-gray-900 font-mono">{offers.filter(o => o.status === 'pending').length}</div>
                  <div className="text-[10px] text-gray-500 font-bold">Pending Offers</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-lg font-black text-gray-900 font-mono">{sellerPendingOrders.length}</div>
                  <div className="text-[10px] text-gray-500 font-bold">Orders to Ship</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-lg font-black text-amber-700 font-mono">{formatPrice(totalRevenue)}</div>
                  <div className="text-[10px] text-gray-500 font-bold">Total Revenue</div>
                </div>
              </div>

              {/* Withdrawal Form */}
              {showWithdrawForm && (
                <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">Request Payout (Admin Approval Required)</h4>
                    <button onClick={() => setShowWithdrawForm(false)} className="text-gray-400 hover:text-gray-900 text-xs font-bold">✕</button>
                  </div>
                  <form onSubmit={handleWithdrawSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Amount</label>
                      <input type="number" max={sellerData.walletBalance} min="10" placeholder="Amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-mono font-bold focus:border-gray-900 focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Method</label>
                      <select value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:border-gray-900 focus:outline-none">
                        <option value="UPI">UPI (Instant)</option>
                        <option value="NEFT">Bank NEFT / IMPS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">UPI ID / Bank Account</label>
                      <input type="text" value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-mono focus:border-gray-900 focus:outline-none" required />
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowWithdrawForm(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold shadow-sm">Submit Payout Request</button>
                    </div>
                  </form>
                  <div className="text-[10px] text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    All withdrawals require admin approval before bank transfer. You will be notified once processed.
                  </div>
                </div>
              )}

              {/* Anti-Fraud Protection */}
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
                <div className="font-extrabold text-amber-950">
                  Seller Protection Against Buyer Swap Scams
                </div>
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  Before dispatching, log your parcel's <strong>scale weight (±1g)</strong> and affix the <strong>Tamper-Evident Seal Tag</strong>. In disputes, admin cross-checks your recorded dispatch weight to dismiss fraudulent return claims.
                </p>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: INVENTORY ==================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Active Listings ({perfumes.length})</h3>
              </div>
              <div className="space-y-3">
                {perfumes.map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-700">{p.brand}</div>
                        <div className="text-sm font-bold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">Batch: #{p.batchCode} • {p.remainingMl}ml / {p.originalCapacityMl}ml ({p.fillPercentage}%) • {p.presentation}</div>
                        <div className="text-xs font-mono font-bold text-gray-950 mt-1">Ask: {formatPrice(p.price)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {editingPerfumeId === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <input type="number" placeholder="Price" value={newPriceVal} onChange={(e) => setNewPriceVal(e.target.value)} className="w-24 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs font-mono font-bold" />
                          <button onClick={() => handlePriceSave(p.id)} className="px-3 py-1 rounded-lg bg-gray-900 text-white text-xs font-bold">Save</button>
                          <button onClick={() => setEditingPerfumeId(null)} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingPerfumeId(p.id); setNewPriceVal(p.price); }} className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-all">
                          Edit
                        </button>
                      )}
                      <button onClick={() => deleteListing(p.id)} className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 text-red-600 text-xs font-bold transition-all" title="Remove">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {perfumes.length === 0 && (
                  <div className="text-center py-16 text-gray-400 text-xs font-medium bg-white rounded-2xl border border-dashed border-gray-200">
                    No active listings. Click "+ List New" to add your first fragrance.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: OFFERS ==================== */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Buyer Offers ({offers.length})</h3>
              {offers.length > 0 ? (
                offers.map(offer => (
                  <div key={offer.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{offer.perfumeTitle}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          offer.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          offer.status === 'countered' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>{offer.status.toUpperCase()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {offer.buyerName} • Ask: <span className="line-through">{formatPrice(offer.originalPrice)}</span> → Offer: <strong className="text-gray-950">{formatPrice(offer.offerAmount)}</strong>
                      </div>
                      {offer.counterAmount && <div className="text-xs text-blue-700 font-bold mt-0.5 font-mono">Your Counter: {formatPrice(offer.counterAmount)}</div>}
                      {offer.message && <div className="text-xs text-gray-600 mt-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200 italic">"{offer.message}"</div>}
                    </div>
                    {offer.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {counteringOfferId === offer.id ? (
                          <div className="flex items-center gap-1.5">
                            <input type="number" placeholder="Counter" value={counterPriceVal} onChange={(e) => setCounterPriceVal(e.target.value)} className="w-24 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs font-mono font-bold" />
                            <button onClick={() => handleCounterSubmit(offer.id)} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">Send</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => updateOfferStatus(offer.id, 'rejected')} className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold">Decline</button>
                            <button onClick={() => { setCounteringOfferId(offer.id); setCounterPriceVal(offer.offerAmount + 10); }} className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">Counter</button>
                            <button onClick={() => updateOfferStatus(offer.id, 'accepted')} className="px-4 py-1.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-sm">Accept</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 text-xs font-medium bg-white rounded-2xl border border-dashed border-gray-200">No buyer offers yet.</div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: FULFILLMENT ==================== */}
          {activeTab === 'fulfillment' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Order Manifests & Weight Tracking</h3>
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <img src={order.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                        <div>
                          <span className="font-bold text-gray-900 text-xs">{order.perfumeTitle}</span>
                          <div className="text-xs text-gray-500 font-mono">#{order.id} • Buyer: {order.buyerName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'escrow_held' ? 'bg-amber-100 text-amber-900' :
                          order.status === 'shipped_with_proof' ? 'bg-blue-100 text-blue-900' :
                          order.status === 'delivered_inspecting' ? 'bg-purple-100 text-purple-900' :
                          order.status === 'completed_released' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-red-100 text-red-900'
                        }`}>{order.status.replace(/_/g, ' ').toUpperCase()}</span>
                        <div className="text-xs font-mono font-bold text-gray-900 mt-1">Net: {formatPrice(order.sellerNetPayout || order.price * (1 - platformSettings.commissionPercent / 100))}</div>
                      </div>
                    </div>

                    {order.status === 'escrow_held' && (
                      <div>
                        {selectedOrderId === order.id ? (
                          <form onSubmit={handleFulfillmentSubmit} className="p-4 rounded-xl bg-gray-50 border border-gray-300 space-y-3 text-xs">
                            <div className="font-bold text-gray-900">Courier Manifest & Weight Proof</div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Courier</label>
                                <select value={courierName} onChange={(e) => setCourierName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-sans font-bold">
                                  <option>Delhivery Express</option><option>Blue Dart Air</option><option>DTDC Premium</option><option>UPS Express</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tracking #</label>
                                <input type="text" placeholder="DL-992019482" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold" required />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Weight (g)</label>
                                <input type="number" value={weightGrams} onChange={(e) => setWeightGrams(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold" required />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Seal Tag #</label>
                                <input type="text" value={tamperSealId} onChange={(e) => setTamperSealId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold" required />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <button type="button" onClick={() => setSelectedOrderId(null)} className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 font-bold">Cancel</button>
                              <button type="submit" className="px-4 py-1.5 rounded-lg bg-gray-900 text-white font-bold">Confirm Shipment</button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setSelectedOrderId(order.id)} className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm">
                            Upload Courier Tracking & Weight
                          </button>
                        )}
                      </div>
                    )}

                    {order.preShipmentProof && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-mono space-y-1">
                        <div className="text-[11px] font-bold text-emerald-800">
                          Pre-Shipment Proof Verified
                        </div>
                        <div className="text-gray-700 text-[11px]">
                          {order.preShipmentProof.courier} ({order.preShipmentProof.trackingNumber}) • {order.preShipmentProof.weightGrams}g • Seal: {order.preShipmentProof.tamperSealId}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 5: BANK PAYOUTS ==================== */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Payout History & Requests</h3>
                <button onClick={() => setShowWithdrawForm(true)} className="px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm">
                  + Request New Payout
                </button>
              </div>

              {/* Payout Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 font-bold">Available for Withdrawal</div>
                  <div className="text-2xl font-black text-gray-900 font-mono mt-1">{formatPrice(sellerData.walletBalance)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-xs text-amber-800 font-bold">Pending Approval</div>
                  <div className="text-2xl font-black text-amber-900 font-mono mt-1">{formatPrice(allMyPayouts.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0))}</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-bold">Total Paid Out</div>
                  <div className="text-2xl font-black text-emerald-900 font-mono mt-1">{formatPrice(allMyPayouts.filter(p => p.status === 'approved').reduce((a, p) => a + p.amount, 0))}</div>
                </div>
              </div>

              {/* Payout Requests Table */}
              {allMyPayouts.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-bold bg-gray-50">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Method</th>
                        <th className="text-left py-3 px-4">Account</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Processed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allMyPayouts.map(req => (
                        <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="py-3 px-4 text-gray-600 font-mono">{formatDate(req.requestedAt)}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{req.method}</td>
                          <td className="py-3 px-4 text-gray-600 font-mono">{req.accountDetails}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">{formatPrice(req.amount)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>{req.status.toUpperCase()}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 font-mono">{req.processedAt ? formatDate(req.processedAt) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs font-medium bg-white rounded-2xl border border-dashed border-gray-200">
                  No payout requests yet.
                </div>
              )}

              {/* Inline Withdrawal Form */}
              {showWithdrawForm && (
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-md space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">New Payout Request</h4>
                  <form onSubmit={handleWithdrawSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Amount</label>
                      <input type="number" max={sellerData.walletBalance} min="10" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-mono font-bold focus:border-gray-900 focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Method</label>
                      <select value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-semibold">
                        <option value="UPI">UPI (Instant)</option><option value="NEFT">Bank NEFT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Account</label>
                      <input type="text" value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-mono focus:border-gray-900 focus:outline-none" required />
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2">
                      <button type="button" onClick={() => setShowWithdrawForm(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 rounded-xl bg-gray-900 text-white font-bold">Submit Request</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 6: TRUST & REPUTATION ==================== */}
          {activeTab === 'reputation' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={sellerData.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border border-gray-200" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-gray-900">{sellerData.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">KYC VERIFIED</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">Level: {sellerData.trustTier}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{sellerData.salesCount} sales • Zero disputes • Joined: {sellerData.joinedDate || '2024'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-amber-500 font-mono flex items-center gap-1 justify-end">★ {sellerData.rating}</div>
                  <div className="text-xs text-gray-400 font-medium">100% Authenticity Score</div>
                </div>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-2xl font-black text-emerald-600">100%</div>
                  <div className="text-[10px] text-gray-500 font-bold">Authenticity Rate</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-2xl font-black text-blue-600">0</div>
                  <div className="text-[10px] text-gray-500 font-bold">Disputes Against</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-2xl font-black text-gray-900">{'<'}2h</div>
                  <div className="text-[10px] text-gray-500 font-bold">Avg Response Time</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
                  <div className="text-2xl font-black text-amber-600">{'<'}24h</div>
                  <div className="text-[10px] text-gray-500 font-bold">Avg Ship Time</div>
                </div>
              </div>

              {/* Buyer Reviews */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Buyer Reviews</h4>
                {reviews && reviews.length > 0 ? (
                  reviews.slice(0, 5).map(rev => (
                    <div key={rev.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{rev.author}</span>
                        <span className="text-xs text-amber-600 font-mono font-bold">★ {rev.rating}/5</span>
                      </div>
                      <p className="text-xs text-gray-600 italic">"{rev.review}"</p>
                      <div className="text-[10px] text-gray-400">{rev.date} {rev.verifiedPurchase && <span className="text-emerald-600 font-bold ml-1">✓ Verified Purchase</span>}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No reviews yet.</p>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 7: SALES HISTORY ==================== */}
          {activeTab === 'sales' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Complete Sales Log ({sellerCompletedOrders.length + sellerPendingOrders.length})</h3>
                <div className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Revenue: {formatPrice(totalRevenue)}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl bg-white border border-gray-200 shadow-sm">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold bg-gray-50">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Order</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Buyer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Sale Price</th>
                      <th className="text-right py-3 px-4">Platform Fee (Flat ₹{platformSettings.flatFeeAmount || 100})</th>
                      <th className="text-right py-3 px-4">Net Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => (
                      <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 text-gray-500 font-mono">{formatDate(o.createdAt)}</td>
                        <td className="py-3 px-4 font-mono text-gray-600">{o.id}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium truncate max-w-[180px]">{o.perfumeTitle}</td>
                        <td className="py-3 px-4 text-gray-600">{o.buyerName}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'completed_released' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'disputed' ? 'bg-red-100 text-red-800' :
                            o.status === 'refunded_to_buyer' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>{o.status.replace(/_/g, ' ').toUpperCase()}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-gray-900">{formatPrice(o.price)}</td>
                        <td className="py-3 px-4 text-right font-mono text-red-600">-{formatPrice(o.platformFeeAmount || platformSettings.flatFeeAmount || 100)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{formatPrice(o.sellerNetPayout || Math.max(0, o.price - (platformSettings.flatFeeAmount || 100)))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB 8: DISPUTES & RETURNS ==================== */}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Disputes Filed Against You ({sellerDisputedOrders.length})</h3>

              {sellerDisputedOrders.length > 0 ? (
                sellerDisputedOrders.map(order => (
                  <div key={order.id} className={`p-5 rounded-2xl border space-y-3 ${order.status === 'disputed' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{order.perfumeTitle}</span>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">#{order.id} • Buyer: {order.buyerName}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'disputed' ? 'bg-red-200 text-red-800' :
                          order.status === 'refunded_to_buyer' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status === 'disputed' ? 'UNDER REVIEW' : order.disputeData?.status === 'resolved_buyer_refund' ? 'BUYER REFUNDED' : 'RESOLVED (YOUR FAVOR)'}
                        </span>
                        <div className="text-xs font-mono font-bold text-gray-900 mt-1">{formatPrice(order.totalAmount || order.price)}</div>
                      </div>
                    </div>

                    {order.disputeData && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                          <div className="font-bold text-gray-900">Your Pre-Ship Record</div>
                          <div className="text-gray-600 font-mono text-[11px]">
                            Weight: <strong>{order.preShipmentProof?.weightGrams || '—'}g</strong> • Seal: <strong>{order.preShipmentProof?.tamperSealId || '—'}</strong>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1">
                          <div className="font-bold text-red-800">Buyer's Claim</div>
                          <div className="text-red-700 text-[11px]">
                            Issue: <strong>{order.disputeData.issue}</strong>
                          </div>
                          <div className="text-red-600 text-[11px] italic">"{order.disputeData.buyerEvidenceNotes}"</div>
                        </div>
                      </div>
                    )}

                    {order.disputeData?.adminNotes && (
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                        <span className="font-bold text-gray-700">Admin Verdict: </span>
                        <span className="text-gray-600">{order.disputeData.adminNotes}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 text-xs font-medium bg-white rounded-2xl border border-dashed border-gray-200">
                  No disputes filed against you. Keep up the excellent work!
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 9: SETTINGS & PROFILE ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Seller Profile & Account Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Personal Info</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Display Name</label>
                      <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-bold focus:border-gray-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Email</label>
                      <input type="email" value={profileForm.email} onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-mono focus:border-gray-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Phone</label>
                      <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-mono focus:border-gray-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">City</label>
                      <input type="text" value={profileForm.city} onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Payout Settings */}
                <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Payout Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">UPI ID</label>
                      <input type="text" value={profileForm.upiId} onChange={(e) => setProfileForm(prev => ({ ...prev, upiId: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-mono focus:border-gray-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Bank Account</label>
                      <input type="text" value={profileForm.bankAccount} onChange={(e) => setProfileForm(prev => ({ ...prev, bankAccount: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-mono focus:border-gray-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">IFSC Code</label>
                      <input type="text" value={profileForm.ifsc} onChange={(e) => setProfileForm(prev => ({ ...prev, ifsc: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-mono focus:border-gray-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Business Name</label>
                      <input type="text" value={profileForm.businessName} onChange={(e) => setProfileForm(prev => ({ ...prev, businessName: e.target.value }))} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Notification Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'notifyOffers', label: 'New Offers', desc: 'When a buyer sends an offer on your listing' },
                    { key: 'notifyOrders', label: 'Order Updates', desc: 'Escrow held, delivered, released, disputed' },
                    { key: 'notifyPayouts', label: 'Payout Status', desc: 'When your withdrawal is approved/rejected' }
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <div className="text-xs font-bold text-gray-900">{pref.label}</div>
                        <div className="text-[10px] text-gray-500">{pref.desc}</div>
                      </div>
                      <button
                        onClick={() => setProfileForm(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                        className={`w-11 h-6 rounded-full transition-all relative ${profileForm[pref.key] ? 'bg-gray-900' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${profileForm[pref.key] ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-lg transition-all">
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
