import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function BuyerAccountPage() {
  const { 
    orders, 
    releaseEscrowPayment, 
    openDispute, 
    wishlist, 
    perfumes, 
    formatPrice,
    addToCart
  } = useMarketplace();

  const { currentUser, setActivePage, accountTab: activeTab, setAccountTab: setActiveTab, logout } = useAuth();
  const [disputeOrderId, setDisputeOrderId] = useState(null);
  const [disputeIssue, setDisputeIssue] = useState('Fluid meniscus level less than stated');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeWeight, setDisputeWeight] = useState('');

  const savedPerfumes = perfumes.filter(p => wishlist.includes(p.id));

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeOrderId) return;
    openDispute(disputeOrderId, {
      issue: disputeIssue,
      notes: disputeNotes,
      weightGrams: disputeWeight
    });
    setDisputeOrderId(null);
    setDisputeNotes('');
    setDisputeWeight('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* User Account Header */}
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
              alt="Avatar" 
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900">{currentUser?.name || 'Verified Member'}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase font-mono">
                  48H ESCROW PROTECTED BUYER
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {currentUser?.email || ''} {currentUser?.phone ? `• ${currentUser.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('home')}
              className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold transition-all"
            >
              Browse Flacons
            </button>
            <button
              onClick={() => { logout(); setActivePage('home'); }}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-gray-900 text-white font-extrabold shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Escrow Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'wishlist' ? 'bg-gray-900 text-white font-extrabold shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Saved Vault ({savedPerfumes.length})
          </button>
        </div>

        {/* Tab 1: Escrow Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Dispute Dialog */}
            {disputeOrderId && (
              <div className="p-6 rounded-3xl bg-red-50 border border-red-200 space-y-4 animate-fade-in shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-red-900 font-bold text-sm">
                    File Escrow Dispute & Freeze Funds
                  </div>
                  <button onClick={() => setDisputeOrderId(null)} className="text-gray-400 hover:text-gray-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleDisputeSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Reason for Dispute</label>
                    <select
                      value={disputeIssue}
                      onChange={(e) => setDisputeIssue(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:border-gray-900 focus:outline-none"
                    >
                      <option value="Fluid meniscus level less than stated">Fluid meniscus level is lower than listed</option>
                      <option value="Suspected formulation / juice alteration">Suspected formulation alteration or clone scent</option>
                      <option value="Atomizer / bottle physical defect">Atomizer broken or missing cap</option>
                      <option value="Batch code stamp mismatch">Batch code stamp on base does not match</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Measured Scale Weight on Arrival (Grams)</label>
                    <input
                      type="number"
                      placeholder="e.g. 215g"
                      value={disputeWeight}
                      onChange={(e) => setDisputeWeight(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-mono font-bold focus:border-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Detailed Inspection Notes</label>
                    <textarea
                      rows="3"
                      placeholder="Describe the discrepancy clearly for Admin arbitration..."
                      value={disputeNotes}
                      onChange={(e) => setDisputeNotes(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-gray-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDisputeOrderId(null)}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                    >
                      Submit Dispute to Admin Desk
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders List */}
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3.5">
                      <img src={order.image} alt={order.perfumeTitle} className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{order.perfumeTitle}</h4>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          Order #{order.id} • Seller: <strong>{order.sellerName}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'escrow_held' ? 'bg-amber-100 text-amber-900' :
                        order.status === 'shipped_with_proof' ? 'bg-blue-100 text-blue-900' :
                        order.status === 'delivered_inspecting' ? 'bg-purple-100 text-purple-900' :
                        order.status === 'disputed' ? 'bg-red-100 text-red-900' :
                        'bg-emerald-100 text-emerald-900'
                      }`}>
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <div className="text-sm font-black text-gray-900 font-mono mt-1">
                        {formatPrice(order.totalAmount || order.price)}
                      </div>
                    </div>
                  </div>

                  {/* 48-Hour Escrow Protection Notice & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-900">48-Hour Inspection Guarantee</div>
                      <p className="text-[11px] text-gray-500">
                        {order.status === 'completed_released'
                          ? 'Inspection completed. Escrow funds released to seller.'
                          : order.status === 'disputed'
                          ? 'Escrow frozen. Admin arbitration desk is reviewing evidence.'
                          : 'Inspect fluid meniscus, nozzle, and batch stamp upon delivery.'}
                      </p>
                    </div>

                    {order.status !== 'completed_released' && order.status !== 'disputed' && order.status !== 'refunded_to_buyer' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setDisputeOrderId(order.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                        >
                          Report Issue / Dispute
                        </button>
                        <button
                          onClick={() => releaseEscrowPayment(order.id)}
                          className="px-4 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Approve & Release Funds
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {savedPerfumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPerfumes.map(p => (
                  <div key={p.id} className="p-4 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-700">{p.brand}</div>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</h4>
                        <div className="text-xs font-mono font-bold text-gray-950 mt-1">{formatPrice(p.price)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Add to Cart (Escrow Protected)
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs font-medium bg-white rounded-3xl border border-dashed border-gray-200">
                Your wishlist is empty. Save flacons while browsing.
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
