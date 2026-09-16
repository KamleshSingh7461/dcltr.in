import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function AdminModal() {
  const { 
    activeModal, 
    setActiveModal, 
    pendingModeration, 
    approveListing, 
    rejectListing, 
    orders,
    releaseEscrowPayment,
    resolveDispute,
    users,
    toggleUserBlacklist,
    verifyUserKyc,
    formatPrice,
    platformGMV,
    platformCommissionEarned,
    totalEscrowHeld,
    activeDisputesCount
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState('vault'); // 'vault' | 'moderation' | 'escrow' | 'disputes' | 'users'
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminVerdictNotes, setAdminVerdictNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useBodyScrollLock(activeModal === 'admin');

  if (activeModal !== 'admin') return null;

  const disputedOrders = orders.filter(o => o.status === 'disputed');

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
        <div className="pb-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Admin Safety & Escrow Command Center
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider font-mono">
              LIVE SECURE VAULT
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Marketplace owner controls: 48-Hour escrow locks, pre-listing authenticity vetting, dispute arbitration, and anti-fraud blacklisting.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 py-3 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold">
          {[
            { id: 'vault', label: '1. Financial & Escrow Vault', count: null },
            { id: 'moderation', label: '2. Moderation Queue', count: pendingModeration.length },
            { id: 'escrow', label: '3. Escrow Orders', count: orders.length },
            { id: 'disputes', label: '4. Dispute Desk', count: activeDisputesCount, alert: activeDisputesCount > 0 },
            { id: 'users', label: '5. KYC & Anti-Fraud', count: users.filter(u => u.isBlacklisted).length }
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
                      ? 'bg-red-500 text-white animate-pulse' 
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

          {/* TAB 1: FINANCIAL & ESCROW VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              
              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-gray-500 text-xs font-bold">Total GMV (Transacted)</div>
                  <div className="text-2xl font-black text-gray-950 font-mono mt-2">
                    {formatPrice(platformGMV)}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">All marketplace volume</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="text-amber-900 text-xs font-bold">Owner Commission (8%)</div>
                  <div className="text-2xl font-black text-amber-900 font-mono mt-2">
                    {formatPrice(platformCommissionEarned)}
                  </div>
                  <div className="text-[10px] text-amber-700 mt-1 font-semibold">Net platform profit settled</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <div className="text-purple-900 text-xs font-bold">Locked in Escrow Vault</div>
                  <div className="text-2xl font-black text-purple-900 font-mono mt-2">
                    {formatPrice(totalEscrowHeld)}
                  </div>
                  <div className="text-[10px] text-purple-700 mt-1 font-semibold">Awaiting 48h buyer inspection</div>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200">
                  <div className="text-red-900 text-xs font-bold">Active Disputes</div>
                  <div className="text-2xl font-black text-red-900 font-mono mt-2">
                    {activeDisputesCount}
                  </div>
                  <div className="text-[10px] text-red-700 mt-1 font-semibold">Funds frozen for arbitration</div>
                </div>

              </div>

              {/* Owner Protection Architecture Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white space-y-3 shadow-md">
                <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  How We Protect Marketplace Owners Against Fraud & Counterfeits
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="font-bold text-white mb-1">1. Zero Direct Payouts</div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Sellers never receive buyer funds until the 48-hour inspection period passes without disputes.
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="font-bold text-white mb-1">2. Gram-Weight & Tamper Seals</div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Sellers log the exact weight (±1g) and serial security seal before dispatch, preventing swap-and-return fraud.
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="font-bold text-white mb-1">3. Automated 8% Retainage</div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Your platform fee is automatically deducted at the moment escrow is released.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MODERATION QUEUE */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Pending Flacon Authenticity Submissions ({pendingModeration.length})
                </h3>
                <span className="text-xs text-gray-500">
                  Verify batch code stamps, nozzle crimp, and fluid meniscus before publishing.
                </span>
              </div>

              {pendingModeration.length > 0 ? (
                pendingModeration.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold text-amber-700">{item.brand}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-gray-800">
                            {item.presentation}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-600 font-mono">
                          Batch: <strong className="text-gray-900">#{item.batchCode}</strong> ({item.productionYear || 'Verified'}) • Volume: <strong>{item.remainingMl}ml / {item.originalCapacityMl}ml ({item.fillPercentage}% full)</strong>
                        </div>
                        <div className="text-xs text-gray-500">
                          Seller: <strong className="text-gray-800">{item.seller?.name}</strong> • Ask Price: <strong className="text-gray-950 font-mono">{formatPrice(item.price)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => rejectListing(item.id, 'Batch code etched incorrectly or fluid level unclear')}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveListing(item.id)}
                        className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Approve & Publish
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  Moderation queue is empty. All listings have been vetted and are live.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ESCROW ORDERS & PAYOUTS */}
          {activeTab === 'escrow' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Live Escrow Vault Transactions ({orders.length})
                </h3>
              </div>

              <div className="space-y-3">
                {orders.map(order => {
                  const statusColors = {
                    escrow_held: 'bg-amber-100 text-amber-900 border-amber-200',
                    shipped_with_proof: 'bg-blue-100 text-blue-900 border-blue-200',
                    delivered_inspecting: 'bg-purple-100 text-purple-900 border-purple-200',
                    completed_released: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                    disputed: 'bg-red-100 text-red-900 border-red-200',
                    refunded_to_buyer: 'bg-gray-100 text-gray-800 border-gray-200'
                  };

                  return (
                    <div key={order.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img src={order.image} alt="Fragrance" className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xs">{order.perfumeTitle}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                              {order.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">
                            Buyer: {order.buyerName} → Seller: {order.sellerName}
                          </div>
                          <div className="text-xs font-mono font-bold text-gray-900 mt-1">
                            Total Paid: {formatPrice(order.totalAmount || order.price)} • Platform Fee (8%): <span className="text-amber-800">{formatPrice(order.platformFeeAmount || order.price * 0.08)}</span> • Seller Payout: <span className="text-emerald-700">{formatPrice(order.sellerNetPayout || order.price * 0.92)}</span>
                          </div>
                          {order.preShipmentProof && (
                            <div className="text-[11px] text-gray-600 mt-1 font-mono">
                              Tracked: {order.preShipmentProof.courier} ({order.preShipmentProof.trackingNumber}) • Weight: {order.preShipmentProof.weightGrams}g • Seal: {order.preShipmentProof.tamperSealId}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {order.status !== 'completed_released' && order.status !== 'refunded_to_buyer' && (
                          <button
                            onClick={() => releaseEscrowPayment(order.id)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Force Escrow Release
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DISPUTE RESOLUTION DESK */}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Dispute Evidence Arbitration Desk ({disputedOrders.length})
                </h3>
                <span className="text-xs text-gray-500">
                  Compare buyer weight in grams vs seller dispatch manifest.
                </span>
              </div>

              {disputedOrders.length > 0 ? (
                disputedOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-red-100 pb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 font-mono">
                          DISPUTE CASE #{order.id}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 mt-0.5">{order.perfumeTitle}</h4>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <div className="text-gray-500">Disputed Amount</div>
                        <div className="text-base font-black text-gray-900">{formatPrice(order.totalAmount || order.price)}</div>
                      </div>
                    </div>

                    {/* Side-by-Side Evidence Arbitration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Seller Evidence */}
                      <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2">
                        <div className="font-bold text-gray-900 text-xs">Seller Pre-Shipment Manifest</div>
                        <div className="text-gray-600 space-y-1 text-[11px] font-mono">
                          <div>Courier: <strong>{order.preShipmentProof?.courier || 'Delhivery Express'}</strong></div>
                          <div>Tracking: <strong>{order.preShipmentProof?.trackingNumber || 'DL-9842109284'}</strong></div>
                          <div>Logged Scale Weight: <strong className="text-emerald-700">{order.preShipmentProof?.weightGrams || 240} grams</strong></div>
                          <div>Tamper Seal Tag: <strong>{order.preShipmentProof?.tamperSealId || 'DCLTR-SEC-4412'}</strong></div>
                        </div>
                      </div>

                      {/* Buyer Claim */}
                      <div className="p-3.5 rounded-xl bg-white border border-red-200 space-y-2">
                        <div className="font-bold text-red-900 text-xs">Buyer Inspection Claim</div>
                        <div className="text-gray-600 space-y-1 text-[11px]">
                          <div>Issue: <strong className="text-red-800">{order.disputeData?.issue || 'Volume mismatch'}</strong></div>
                          <div>Claimed Weight: <strong className="text-red-700 font-mono">{order.disputeData?.buyerMeasuredWeight || 215} grams</strong></div>
                          <div className="bg-red-50 p-2 rounded-lg text-gray-700 italic">
                            "{order.disputeData?.buyerEvidenceNotes || 'Atomizer collar appears scratched.'}"
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Admin Verdict Execution */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-red-100">
                      <input
                        type="text"
                        placeholder="Enter official arbitration decision notes..."
                        value={adminVerdictNotes}
                        onChange={(e) => setAdminVerdictNotes(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-gray-900 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => resolveDispute(order.id, 'refund_buyer', adminVerdictNotes || 'Weight discrepancy verified.')}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          Refund Buyer (Full Escrow)
                        </button>
                        <button
                          onClick={() => resolveDispute(order.id, 'release_to_seller', adminVerdictNotes || 'Pre-ship proof matched.')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          Release to Seller (Dismiss)
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  Zero active disputes. All transactions settled smoothly.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SELLER KYC & ANTI-FRAUD BLACKLIST */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Seller KYC Verification & Fraud Blacklist Directory ({users.length})
                </h3>
              </div>

              <div className="space-y-3">
                {users.map(u => (
                  <div
                    key={u.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      u.isBlacklisted 
                        ? 'bg-red-50/70 border-red-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-xs">{u.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.isBlacklisted
                              ? 'bg-red-600 text-white'
                              : u.kycStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {u.isBlacklisted ? 'BLACKLISTED' : u.trustTier}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 font-mono">
                          {u.email} • {u.phone} • {u.salesCount} Completed Sales (★ {u.rating})
                        </div>
                        {u.blacklistReason && (
                          <div className="text-[11px] text-red-700 mt-1 font-semibold">
                            Reason: {u.blacklistReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {u.kycStatus !== 'verified' && !u.isBlacklisted && (
                        <button
                          onClick={() => verifyUserKyc(u.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Approve KYC
                        </button>
                      )}
                      <button
                        onClick={() => toggleUserBlacklist(u.id, 'Fraudulent behavior / attempted clone sale')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          u.isBlacklisted
                            ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                            : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {u.isBlacklisted ? 'Remove Blacklist' : 'Ban & Blacklist Account'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
