import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function MyListingsModal() {
  const { 
    activeModal, 
    setActiveModal, 
    offers, 
    updateOfferStatus, 
    perfumes, 
    pendingModeration,
    orders,
    fulfillOrder,
    withdrawSellerFunds,
    updateListingPrice,
    deleteListing,
    users,
    formatPrice
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'inventory' | 'offers' | 'fulfillment' | 'reputation'
  
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('UPI'); // 'UPI' | 'NEFT'
  const [accountDetails, setAccountDetails] = useState('collector@okhdfcbank');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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

  useBodyScrollLock(activeModal === 'myListings');

  if (activeModal !== 'myListings') return null;

  const currentUser = users.find(u => u.id === 'seller-you') || users[0];
  const myLiveListings = perfumes.filter(p => p.seller?.id === 'seller-you' || p.seller?.name.includes('You'));
  const myPendingOrders = orders.filter(o => o.sellerId === 'seller-you' || o.status === 'escrow_held');

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    withdrawSellerFunds(Number(withdrawAmount), { type: withdrawMethod, account: accountDetails });
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleFulfillmentSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderId || !trackingNumber) return;
    fulfillOrder(selectedOrderId, {
      courier: courierName,
      trackingNumber,
      weightGrams: Number(weightGrams),
      tamperSealId
    });
    setSelectedOrderId(null);
    setTrackingNumber('');
  };

  const handlePriceSave = (perfumeId) => {
    if (newPriceVal && Number(newPriceVal) > 0) {
      updateListingPrice(perfumeId, Number(newPriceVal));
    }
    setEditingPerfumeId(null);
  };

  const handleCounterSubmit = (offerId) => {
    if (counterPriceVal && Number(counterPriceVal) > 0) {
      updateOfferStatus(offerId, 'countered', Number(counterPriceVal));
    }
    setCounteringOfferId(null);
    setCounterPriceVal('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl p-6 sm:p-8 bg-white text-gray-900 shadow-2xl my-6 border border-gray-100 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Seller Command Center & Vault Wallet
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider font-mono">
                {currentUser.trustTier}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Manage inventory, fulfill orders with pre-shipment weight verification, and withdraw escrow payouts.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveModal('sellWizard');
            }}
            className="hidden sm:flex items-center px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
          >
            List Another Flacon
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 py-3 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold">
          {[
            { id: 'overview', label: 'Overview & Wallet', count: null },
            { id: 'inventory', label: 'Inventory & Listings', count: perfumes.length },
            { id: 'offers', label: 'Buyer Offers', count: offers.length },
            { id: 'fulfillment', label: 'Shipping & Fulfillment', count: myPendingOrders.length, alert: myPendingOrders.length > 0 },
            { id: 'reputation', label: 'Trust & Reputation', count: null }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm font-extrabold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    tab.alert 
                      ? 'bg-amber-500 text-white font-mono' 
                      : isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">

          {/* TAB 1: OVERVIEW & WALLET */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Wallet Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Available for Payout */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-md relative overflow-hidden">
                  <div className="text-xs text-gray-300 font-medium">
                    Available for Payout
                  </div>
                  <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
                    {formatPrice(currentUser.walletBalance)}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                    Instant UPI / NEFT Settlement
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="mt-4 w-full py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs shadow-sm transition-all"
                  >
                    Withdraw Funds
                  </button>
                </div>

                {/* Locked in 48h Escrow */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="text-xs text-amber-900 font-bold">
                    Locked in 48-Hour Escrow
                  </div>
                  <div className="text-3xl font-black text-amber-900 font-mono mt-2 tracking-tight">
                    {formatPrice(currentUser.escrowLocked)}
                  </div>
                  <div className="text-[11px] text-amber-800 mt-1 font-medium">
                    Funds auto-release upon buyer inspection delivery.
                  </div>
                </div>

                {/* Total Lifetime Sales */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-600 font-bold">
                    Completed Sales
                  </div>
                  <div className="text-3xl font-black text-gray-950 font-mono mt-2 tracking-tight">
                    {currentUser.salesCount} Flacons
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium">
                    Seller Trust Rating: <strong className="text-amber-600">★ {currentUser.rating}</strong> (100% Authentic)
                  </div>
                </div>

              </div>

              {/* Withdrawal Modal Dialog */}
              {showWithdrawModal && (
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-300 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">
                      Withdraw Payout to Bank Account
                    </h4>
                    <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-900">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleWithdrawSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Amount (USD Base)</label>
                      <input
                        type="number"
                        max={currentUser.walletBalance}
                        min="10"
                        placeholder="Max available"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-mono font-bold focus:border-gray-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Method</label>
                      <select
                        value={withdrawMethod}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:border-gray-900 focus:outline-none"
                      >
                        <option value="UPI">UPI (Instant VPA)</option>
                        <option value="NEFT">Bank Account (NEFT/IMPS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">UPI ID / Account Number</label>
                      <input
                        type="text"
                        value={accountDetails}
                        onChange={(e) => setAccountDetails(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-mono focus:border-gray-900 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowWithdrawModal(false)}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold shadow-sm"
                      >
                        Confirm Instant Transfer
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Seller Security Guidelines */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
                <div className="font-extrabold text-amber-950">
                  How Sellers Are Protected from Buyer Return Scams
                </div>
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  Before dispatching any luxury flacon, always input the <strong>bottle weight in grams</strong> on your weighing scale and affix our <strong>Tamper-Evident Security Seal Tag</strong>. If a buyer ever claims the bottle was diluted or empty, our Admin Arbitration team cross-references your recorded dispatch weight to dismiss false return claims.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: INVENTORY & LISTINGS */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Your Active Marketplace Flacons ({perfumes.length})
                </h3>
              </div>

              <div className="space-y-3">
                {perfumes.map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-700">{p.brand}</div>
                        <div className="text-sm font-bold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          #{p.batchCode} • {p.remainingMl}ml / {p.originalCapacityMl}ml ({p.fillPercentage}% full) • {p.presentation}
                        </div>
                        <div className="text-xs font-mono font-bold text-gray-950 mt-1">
                          Current Price: {formatPrice(p.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {editingPerfumeId === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="New USD Price"
                            value={newPriceVal}
                            onChange={(e) => setNewPriceVal(e.target.value)}
                            className="w-24 bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                          />
                          <button
                            onClick={() => handlePriceSave(p.id)}
                            className="px-3 py-1 rounded-lg bg-gray-900 text-white text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPerfumeId(p.id);
                            setNewPriceVal(p.price);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all"
                        >
                          Edit Price
                        </button>
                      )}

                      <button
                        onClick={() => deleteListing(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                        title="Remove Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BUYER OFFERS */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Incoming Peer-to-Peer Offers ({offers.length})
                </h3>
              </div>

              {offers.length > 0 ? (
                offers.map(offer => (
                  <div
                    key={offer.id}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{offer.perfumeTitle}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          offer.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : offer.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : offer.status === 'countered'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {offer.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        Collector: <strong>{offer.buyerName}</strong> • Original Ask: <span className="line-through">{formatPrice(offer.originalPrice)}</span> → Offer: <strong className="text-gray-950 font-bold">{formatPrice(offer.offerAmount)}</strong>
                      </div>
                      {offer.counterAmount && (
                        <div className="text-xs text-blue-700 font-bold mt-0.5 font-mono">
                          Your Counter-Offer: {formatPrice(offer.counterAmount)}
                        </div>
                      )}
                      {offer.message && (
                        <div className="text-xs text-gray-600 mt-1.5 bg-white p-2 rounded-xl border border-gray-200 italic">
                          "{offer.message}"
                        </div>
                      )}
                    </div>

                    {offer.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {counteringOfferId === offer.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              placeholder="Counter USD"
                              value={counterPriceVal}
                              onChange={(e) => setCounterPriceVal(e.target.value)}
                              className="w-24 bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                            />
                            <button
                              onClick={() => handleCounterSubmit(offer.id)}
                              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold"
                            >
                              Send
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => {
                                setCounteringOfferId(offer.id);
                                setCounterPriceVal(offer.offerAmount + 10);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-blue-700 hover:bg-blue-50 text-xs font-bold"
                            >
                              Counter
                            </button>
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'accepted')}
                              className="px-4 py-1.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-sm"
                            >
                              Accept
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No active offers received yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHIPPING & FULFILLMENT */}
          {activeTab === 'fulfillment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Order Fulfillment & Pre-Shipment Manifest
                </h3>
                <span className="text-xs text-gray-500">
                  Log parcel weight and tamper seal tag before dispatching.
                </span>
              </div>

              {/* Active Orders List */}
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-3">
                        <img src={order.image} alt={order.perfumeTitle} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                        <div>
                          <span className="font-bold text-gray-900 text-xs">{order.perfumeTitle}</span>
                          <div className="text-xs text-gray-500 font-mono">
                            Order #{order.id} • Buyer: {order.buyerName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'escrow_held' ? 'bg-amber-100 text-amber-900' :
                          order.status === 'shipped_with_proof' ? 'bg-blue-100 text-blue-900' :
                          order.status === 'delivered_inspecting' ? 'bg-purple-100 text-purple-900' :
                          'bg-emerald-100 text-emerald-900'
                        }`}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <div className="text-xs font-mono font-bold text-gray-900 mt-1">
                          Net Payout: {formatPrice(order.sellerNetPayout || order.price * 0.92)}
                        </div>
                      </div>
                    </div>

                    {order.status === 'escrow_held' && (
                      <div>
                        {selectedOrderId === order.id ? (
                          <form onSubmit={handleFulfillmentSubmit} className="p-4 rounded-xl bg-white border border-gray-300 space-y-3 text-xs">
                            <div className="font-bold text-gray-900">Enter Courier Manifest & Weight Proof</div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Courier Service</label>
                                <select
                                  value={courierName}
                                  onChange={(e) => setCourierName(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-sans font-bold"
                                >
                                  <option value="Delhivery Express">Delhivery Express</option>
                                  <option value="Blue Dart Air">Blue Dart Air</option>
                                  <option value="DTDC Premium">DTDC Premium</option>
                                  <option value="UPS Express">UPS Express</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tracking Number</label>
                                <input
                                  type="text"
                                  placeholder="e.g. DL-992019482"
                                  value={trackingNumber}
                                  onChange={(e) => setTrackingNumber(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Scale Weight (Grams)</label>
                                <input
                                  type="number"
                                  value={weightGrams}
                                  onChange={(e) => setWeightGrams(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tamper Seal Tag #</label>
                                <input
                                  type="text"
                                  value={tamperSealId}
                                  onChange={(e) => setTamperSealId(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold"
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderId(null)}
                                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 font-bold"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 rounded-lg bg-gray-900 text-white font-bold"
                              >
                                Confirm Shipment & Lock Weight
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            className="w-full py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Upload Courier Tracking & Weight Proof
                          </button>
                        )}
                      </div>
                    )}

                    {order.preShipmentProof && (
                      <div className="p-3 rounded-xl bg-white border border-gray-200 text-xs font-mono space-y-1">
                        <div className="text-[11px] font-bold text-emerald-800">
                          Pre-Shipment Proof Verified & Locked
                        </div>
                        <div className="text-gray-600 text-[11px]">
                          Courier: <strong>{order.preShipmentProof.courier}</strong> ({order.preShipmentProof.trackingNumber}) • Weight: <strong>{order.preShipmentProof.weightGrams}g</strong> • Tamper Tag: <strong>{order.preShipmentProof.tamperSealId}</strong>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRUST & REPUTATION */}
          {activeTab === 'reputation' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={currentUser.avatar} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border border-gray-200" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-gray-900">{currentUser.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        KYC VERIFIED
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      Seller Level: {currentUser.trustTier} • Member Since {currentUser.joinedDate}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1 justify-end">
                    <span>★</span>
                    <span>{currentUser.rating}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">100% Positive Feedback</div>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-gray-900">Aadhaar / Govt ID Verified</div>
                  <p className="text-[11px] text-gray-500">Full identity and bank verification authenticated.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-gray-900">Zero Weight Discrepancy</div>
                  <p className="text-[11px] text-gray-500">100% match on logged pre-shipment weights.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-gray-900">Fast 24-Hour Dispatch</div>
                  <p className="text-[11px] text-gray-500">Average courier handoff within 18 hours.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
