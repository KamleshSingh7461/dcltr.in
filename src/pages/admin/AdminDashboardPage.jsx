import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export default function AdminDashboardPage() {
  const { 
    pendingModeration, approveListing, rejectListing, orders, releaseEscrowPayment,
    resolveDispute, users, toggleUserBlacklist, verifyUserKyc, formatPrice,
    platformGMV, platformCommissionEarned, totalEscrowHeld, activeDisputesCount,
    perfumes, forceDelistProduct, platformSettings, updatePlatformSettings,
    payoutRequests, approvePayoutRequest, rejectPayoutRequest, activityLog,
    pendingPayoutsCount, totalPendingPayoutAmount
  } = useMarketplace();

  const { currentUser, switchSubdomain, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('vault');
  const [adminVerdictNotes, setAdminVerdictNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');
  const [delistReason, setDelistReason] = useState('');
  const [payoutRejectReason, setPayoutRejectReason] = useState('');

  // Platform Settings local form state
  const [settingsForm, setSettingsForm] = useState({ ...platformSettings });

  const disputedOrders = orders.filter(o => o.status === 'disputed');
  const resolvedDisputes = orders.filter(o => ['refunded_to_buyer', 'completed_released'].includes(o.status) && o.disputeData);

  // Commission ledger: all orders with their fee info
  const commissionLedger = orders.filter(o => o.platformFeeAmount > 0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (o.perfumeTitle?.toLowerCase().includes(q) || o.buyerName?.toLowerCase().includes(q) || o.sellerName?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q));
    }
    return true;
  });

  // Filtered activity log
  const filteredLog = activityLog.filter(log => {
    if (logCategoryFilter !== 'all' && log.category !== logCategoryFilter) return false;
    return true;
  });

  // Filtered listings for All Listings tab
  const filteredListings = perfumes.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.title?.toLowerCase().includes(q) || p.batchCode?.toLowerCase().includes(q);
  });

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const tabs = [
    { id: 'vault', label: 'Financial Vault' },
    { id: 'moderation', label: 'Moderation Queue', count: pendingModeration.length },
    { id: 'escrow', label: 'Escrow Orders', count: orders.length },
    { id: 'disputes', label: 'Dispute Desk', count: activeDisputesCount, alert: activeDisputesCount > 0 },
    { id: 'users', label: 'KYC & Blacklist', count: users.filter(u => u.isBlacklisted).length },
    { id: 'listings', label: 'All Listings', count: perfumes.length },
    { id: 'commission', label: 'Commission Ledger' },
    { id: 'payouts', label: 'Payout Approvals', count: pendingPayoutsCount, alert: pendingPayoutsCount > 0 },
    { id: 'settings', label: 'Platform Settings' },
    { id: 'activitylog', label: 'Activity Log' }
  ];

  const handleSettingsSave = () => {
    updatePlatformSettings({
      commissionPercent: Number(settingsForm.commissionPercent),
      escrowWindowHours: Number(settingsForm.escrowWindowHours),
      minListingPriceUSD: Number(settingsForm.minListingPriceUSD),
      maxListingPriceUSD: Number(settingsForm.maxListingPriceUSD),
      allowNewRegistrations: settingsForm.allowNewRegistrations,
      maintenanceMode: settingsForm.maintenanceMode,
      requireKycForSelling: settingsForm.requireKycForSelling,
      autoApproveVerifiedSellers: settingsForm.autoApproveVerifiedSellers
    });
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex bg-[#0E0E11] text-white">
      
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#141418] border-r border-gray-800 shrink-0 hidden md:flex flex-col justify-between p-5 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-black shadow-md text-xs">
              A
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">ADMIN VAULT</div>
              <div className="text-xs font-bold text-white">admin.dcltr.in</div>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white font-extrabold shadow-md shadow-amber-500/20'
                      : 'text-gray-400 hover:bg-gray-800/80 hover:text-white'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      tab.alert ? 'bg-red-500 text-white animate-pulse' : isActive ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <img src={currentUser?.avatar || ''} alt="Admin" className="w-9 h-9 rounded-xl object-cover border border-gray-700" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Master Owner'}</div>
              <div className="text-[10px] text-amber-400 font-mono font-bold">2FA Verified</div>
            </div>
          </div>
          <button
            onClick={() => switchSubdomain('marketplace')}
            className="w-full py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-bold border border-gray-800 flex items-center justify-center gap-1.5 transition-all"
          >
            ← Storefront (dcltr.in)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0E0E11]">
        
        <div className="sticky top-0 z-30 bg-[#141418] border-b border-gray-800 shadow-md">
          <header className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight capitalize truncate">
                {tabs.find(t => t.id === activeTab)?.label || activeTab}
              </h1>
              <p className="hidden sm:block text-xs text-gray-400 font-medium">
                Complete marketplace control center — escrow, moderation, payouts, settings.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                ● LIVE
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono whitespace-nowrap">
                {platformSettings.commissionPercent}% FEE
              </span>
            </div>
          </header>

          {/* Mobile Tab Bar (hidden md and up, where the sidebar takes over) */}
          <nav className="md:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-none">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-[#18181D] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      tab.alert ? 'bg-red-500 text-white' : isActive ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">

          {/* ==================== TAB 1: FINANCIAL VAULT ==================== */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#18181D] border border-gray-800">
                  <div className="text-gray-400 text-xs font-bold">Total GMV Transacted</div>
                  <div className="text-2xl font-black text-white font-mono mt-2">{formatPrice(platformGMV)}</div>
                  <div className="text-[10px] text-gray-500 mt-1">All orders (lifetime)</div>
                </div>

                <div className="p-5 rounded-3xl bg-[#1A1812] border border-amber-500/30">
                  <div className="text-amber-400 text-xs font-bold">Platform Fee Revenue (Flat ₹{platformSettings.flatFeeAmount || 100}/order)</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-2">{formatPrice(platformCommissionEarned)}</div>
                  <div className="text-[10px] text-amber-500/80 mt-1 font-semibold">Settled via Easebuzz Wire</div>
                </div>

                <div className="p-5 rounded-3xl bg-[#1B1424] border border-purple-500/30">
                  <div className="text-purple-400 text-xs font-bold">Locked in Escrow</div>
                  <div className="text-2xl font-black text-purple-300 font-mono mt-2">{formatPrice(totalEscrowHeld)}</div>
                  <div className="text-[10px] text-purple-400/80 mt-1">Under {platformSettings.escrowWindowHours}h inspection</div>
                </div>

                <div className="p-5 rounded-3xl bg-[#241416] border border-red-500/30">
                  <div className="text-red-400 text-xs font-bold">Active Disputes</div>
                  <div className="text-2xl font-black text-red-400 font-mono mt-2">{activeDisputesCount}</div>
                  <div className="text-[10px] text-red-400/80 mt-1">Arbitration desk</div>
                </div>
              </div>

              {/* Quick Stats Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#18181D] border border-gray-800">
                  <div className="text-lg font-black text-white font-mono">{orders.length}</div>
                  <div className="text-[10px] text-gray-400 font-bold">Total Orders</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#18181D] border border-gray-800">
                  <div className="text-lg font-black text-white font-mono">{users.length}</div>
                  <div className="text-[10px] text-gray-400 font-bold">Registered Sellers</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#18181D] border border-gray-800">
                  <div className="text-lg font-black text-white font-mono">{perfumes.length}</div>
                  <div className="text-[10px] text-gray-400 font-bold">Live Listings</div>
                </div>
              </div>

              {/* Revenue Breakdown Table */}
              <div className="p-6 rounded-3xl bg-[#18181D] border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Breakdown by Order</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-bold">
                        <th className="text-left py-2 px-2">Order ID</th>
                        <th className="text-left py-2 px-2">Product</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-right py-2 px-2">Order Value</th>
                        <th className="text-right py-2 px-2">Commission</th>
                        <th className="text-right py-2 px-2">Seller Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map(o => (
                        <tr key={o.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="py-2.5 px-2 font-mono text-gray-300">{o.id}</td>
                          <td className="py-2.5 px-2 text-white font-medium truncate max-w-[200px]">{o.perfumeTitle}</td>
                          <td className="py-2.5 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === 'completed_released' ? 'bg-emerald-500/20 text-emerald-400' :
                              o.status === 'disputed' ? 'bg-red-500/20 text-red-400' :
                              o.status === 'refunded_to_buyer' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>{o.status.replace(/_/g, ' ').toUpperCase()}</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-white">{formatPrice(o.price)}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-amber-400">{formatPrice(o.platformFeeAmount || platformSettings.flatFeeAmount || 100)}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-emerald-400">{formatPrice(o.sellerNetPayout || Math.max(0, o.price - (platformSettings.flatFeeAmount || 100)))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Anti-Scam Architecture */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#18181F] to-[#121217] border border-gray-800 space-y-4 shadow-xl">
                <div className="text-amber-400 font-black text-xs uppercase tracking-wider">
                  Owner Anti-Scam Architecture
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                  <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <div className="font-bold text-white">1. Zero Direct Payouts</div>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      All seller withdrawals require admin approval. Funds held in escrow until buyer inspection passes.
                    </p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <div className="font-bold text-white">2. Weight & Tamper Seals</div>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Sellers log parcel scale weight (±1g) and tamper seal before dispatch, preventing swap fraud.
                    </p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <div className="font-bold text-white">3. Dynamic {platformSettings.commissionPercent}% Retainage</div>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Platform fee auto-deducted at escrow release. Commission rate adjustable from Settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: MODERATION QUEUE ==================== */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Pending Submissions ({pendingModeration.length})
                </h3>
                <div className="flex items-center gap-2 bg-[#18181D] border border-gray-800 rounded-xl px-3 py-1.5">
                  <input type="text" placeholder="Search pending..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs text-white w-40" />
                </div>
              </div>

              {pendingModeration.length > 0 ? (
                pendingModeration.filter(item => !searchQuery || item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.brand?.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                  <div key={item.id} className="p-5 rounded-3xl bg-[#18181D] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-gray-700 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold text-amber-400">{item.brand}</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px] font-bold text-gray-300">{item.presentation}</span>
                        </div>
                        <div className="text-sm font-bold text-white">{item.name}</div>
                        <div className="text-xs text-gray-400 font-mono">
                          Batch: <strong className="text-white">#{item.batchCode}</strong> ({item.productionYear || 'Verified'}) • Volume: <strong>{item.remainingMl}ml / {item.originalCapacityMl}ml ({item.fillPercentage}%)</strong>
                        </div>
                        <div className="text-xs text-gray-400">
                          Seller: <strong className="text-gray-300">{item.seller?.name}</strong> • Ask: <strong className="text-amber-400 font-mono">{formatPrice(item.price)}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button onClick={() => rejectListing(item.id, 'Batch code mismatch or unclear fluid level')} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-red-950 text-red-400 border border-gray-700 text-xs font-bold transition-all">
                        Reject
                      </button>
                      <button onClick={() => approveListing(item.id)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition-all shadow-md">
                        Approve & Publish
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500 text-xs font-medium bg-[#18181D] rounded-3xl border border-dashed border-gray-800">
                  Moderation queue is clear. All listings verified.
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: ESCROW ORDERS ==================== */}
          {activeTab === 'escrow' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Escrow Orders ({filteredOrders.length})</h3>
                <div className="flex items-center gap-2">
                  <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="bg-[#18181D] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold">
                    <option value="all">All Status</option>
                    <option value="escrow_held">Escrow Held</option>
                    <option value="shipped_with_proof">Shipped</option>
                    <option value="delivered_inspecting">Inspecting</option>
                    <option value="completed_released">Completed</option>
                    <option value="disputed">Disputed</option>
                    <option value="refunded_to_buyer">Refunded</option>
                  </select>
                  <div className="flex items-center gap-2 bg-[#18181D] border border-gray-800 rounded-xl px-3 py-1.5">
                    <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs text-white w-32" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-3xl bg-[#18181D] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <img src={order.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-700 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs">{order.perfumeTitle}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'completed_released' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'disputed' ? 'bg-red-500/20 text-red-400' :
                            order.status === 'refunded_to_buyer' ? 'bg-blue-500/20 text-blue-400' :
                            order.status === 'escrow_held' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-purple-500/20 text-purple-400'
                          } font-mono`}>{order.status.replace(/_/g, ' ').toUpperCase()}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">#{order.id} • {order.buyerName} → {order.sellerName}</div>
                        <div className="text-xs font-mono font-bold text-white mt-1">
                          Total: {formatPrice(order.totalAmount || order.price)} • Fee ({order.platformFeePercent || platformSettings.commissionPercent}%): <span className="text-amber-400">{formatPrice(order.platformFeeAmount || order.price * platformSettings.commissionPercent / 100)}</span> • Seller: <span className="text-emerald-400">{formatPrice(order.sellerNetPayout || order.price * (1 - platformSettings.commissionPercent / 100))}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{formatDate(order.createdAt)}</div>
                        {order.preShipmentProof && (
                          <div className="text-[11px] text-gray-400 mt-1 font-mono">
                            {order.preShipmentProof.courier} ({order.preShipmentProof.trackingNumber}) • {order.preShipmentProof.weightGrams}g • Seal: {order.preShipmentProof.tamperSealId}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {!['completed_released', 'refunded_to_buyer'].includes(order.status) && (
                        <button onClick={() => releaseEscrowPayment(order.id)} className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm">
                          Force Release
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 4: DISPUTE DESK ==================== */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              {/* Active Disputes */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Disputes ({disputedOrders.length})</h3>
                {disputedOrders.length > 0 ? (
                  disputedOrders.map(order => (
                    <div key={order.id} className="p-6 rounded-3xl bg-[#1C1215] border border-red-500/30 space-y-4">
                      <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400 font-mono">DISPUTE #{order.id}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{order.perfumeTitle}</h4>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-gray-400">Frozen Amount</div>
                          <div className="text-base font-black text-white">{formatPrice(order.totalAmount || order.price)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-2xl bg-[#141418] border border-gray-800 space-y-2">
                          <div className="font-bold text-white">Seller Pre-Ship Manifest</div>
                          <div className="text-gray-300 space-y-1 text-[11px] font-mono">
                            <div>Courier: <strong>{order.preShipmentProof?.courier || 'N/A'}</strong></div>
                            <div>Tracking: <strong>{order.preShipmentProof?.trackingNumber || 'N/A'}</strong></div>
                            <div>Weight: <strong className="text-emerald-400">{order.preShipmentProof?.weightGrams || 0}g</strong></div>
                            <div>Seal: <strong>{order.preShipmentProof?.tamperSealId || 'N/A'}</strong></div>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#141418] border border-red-500/30 space-y-2">
                          <div className="font-bold text-red-300">Buyer Claim</div>
                          <div className="text-gray-300 space-y-1 text-[11px]">
                            <div>Issue: <strong className="text-red-400">{order.disputeData?.issue || 'Volume mismatch'}</strong></div>
                            <div>Buyer Weight: <strong className="text-red-400 font-mono">{order.disputeData?.buyerMeasuredWeight || 0}g</strong></div>
                            <div className="bg-red-950/40 p-2.5 rounded-xl border border-red-500/20 text-gray-300 italic">"{order.disputeData?.buyerEvidenceNotes || 'No notes'}"</div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-red-500/20">
                        <input type="text" placeholder="Arbitration reasoning..." value={adminVerdictNotes} onChange={(e) => setAdminVerdictNotes(e.target.value)} className="flex-1 bg-[#141418] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none" />
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => resolveDispute(order.id, 'refund_buyer', adminVerdictNotes || 'Weight discrepancy verified.')} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold">
                            Refund Buyer
                          </button>
                          <button onClick={() => resolveDispute(order.id, 'release_to_seller', adminVerdictNotes || 'Pre-ship proof matched.')} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                            Release to Seller
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-xs font-medium bg-[#18181D] rounded-3xl border border-dashed border-gray-800">
                    Zero active disputes.
                  </div>
                )}
              </div>

              {/* Resolved Disputes History */}
              {resolvedDisputes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Resolved History ({resolvedDisputes.length})</h3>
                  {resolvedDisputes.map(o => (
                    <div key={o.id} className="p-4 rounded-2xl bg-[#18181D] border border-gray-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{o.perfumeTitle}</span>
                        <span className="ml-2 text-gray-500 font-mono">#{o.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-gray-400">{formatPrice(o.totalAmount || o.price)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === 'refunded_to_buyer' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {o.status === 'refunded_to_buyer' ? 'BUYER REFUND' : 'SELLER RELEASED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 5: KYC & BLACKLIST ==================== */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Seller Directory ({users.length})</h3>
                <div className="flex items-center gap-2 bg-[#18181D] border border-gray-800 rounded-xl px-3 py-1.5">
                  <input type="text" placeholder="Search sellers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs text-white w-40" />
                </div>
              </div>

              <div className="space-y-3">
                {filteredUsers.map(u => (
                  <div key={u.id} className={`p-4 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${u.isBlacklisted ? 'bg-red-950/20 border-red-500/40' : 'bg-[#18181D] border-gray-800'}`}>
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-xl object-cover border border-gray-700" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs">{u.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlacklisted ? 'bg-red-600 text-white' : u.kycStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {u.isBlacklisted ? 'BLACKLISTED' : u.kycStatus === 'verified' ? 'KYC VERIFIED' : 'PENDING KYC'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">{u.email} • {u.phone} • {u.salesCount} Sales (★ {u.rating})</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Wallet: {formatPrice(u.walletBalance)} • Escrow: {formatPrice(u.escrowLocked)} • Joined: {u.joinedDate}</div>
                        {u.blacklistReason && <div className="text-[11px] text-red-400 mt-1 font-semibold">Reason: {u.blacklistReason}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {u.kycStatus !== 'verified' && !u.isBlacklisted && (
                        <button onClick={() => verifyUserKyc(u.id)} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Approve KYC</button>
                      )}
                      <button
                        onClick={() => toggleUserBlacklist(u.id, 'Fraudulent behavior / clone sale')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${u.isBlacklisted ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-red-950/40 border-red-500/30 text-red-400 hover:bg-red-900/50'}`}
                      >
                        {u.isBlacklisted ? 'Remove Ban' : 'Ban & Blacklist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 6: ALL LISTINGS ==================== */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Marketplace Listings ({perfumes.length})</h3>
                <div className="flex items-center gap-2 bg-[#18181D] border border-gray-800 rounded-xl px-3 py-1.5">
                  <input type="text" placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs text-white w-40" />
                </div>
              </div>

              <div className="space-y-3">
                {filteredListings.map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#18181D] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-gray-700 shrink-0" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-400">{p.brand}</div>
                        <div className="text-sm font-bold text-white">{p.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                          Batch: #{p.batchCode} • {p.remainingMl}ml / {p.originalCapacityMl}ml ({p.fillPercentage}%) • {p.presentation}
                        </div>
                        <div className="text-xs font-mono mt-1">
                          <span className="text-amber-400 font-bold">{formatPrice(p.price)}</span>
                          <span className="text-gray-500 ml-2">Seller: {p.seller?.name || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button onClick={() => forceDelistProduct(p.id, 'Admin review - suspicious listing')} className="px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 text-xs font-bold transition-all">
                        Force Delist
                      </button>
                    </div>
                  </div>
                ))}
                {filteredListings.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-xs font-medium bg-[#18181D] rounded-3xl border border-dashed border-gray-800">
                    No listings match your search.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 7: COMMISSION LEDGER ==================== */}
          {activeTab === 'commission' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Commission Ledger ({commissionLedger.length} entries)</h3>
                <div className="text-xs font-mono text-amber-400 font-bold">
                  Total Earned: {formatPrice(platformCommissionEarned)}
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl bg-[#18181D] border border-gray-800">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 font-bold">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Order</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Seller</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Order Value</th>
                      <th className="text-right py-3 px-4">Fee Rate</th>
                      <th className="text-right py-3 px-4">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionLedger.map(o => (
                      <tr key={o.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="py-3 px-4 text-gray-400 font-mono">{formatDate(o.createdAt)}</td>
                        <td className="py-3 px-4 font-mono text-gray-300">{o.id}</td>
                        <td className="py-3 px-4 text-white font-medium truncate max-w-[180px]">{o.perfumeTitle}</td>
                        <td className="py-3 px-4 text-gray-300">{o.sellerName}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === 'completed_released' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {o.status === 'completed_released' ? 'SETTLED' : 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-white">{formatPrice(o.price)}</td>
                        <td className="py-3 px-4 text-right font-mono text-gray-400">Flat ₹{o.platformFeeAmount || platformSettings.flatFeeAmount || 100}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">{formatPrice(o.platformFeeAmount || platformSettings.flatFeeAmount || 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB 8: PAYOUT APPROVALS ==================== */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Seller Payout Requests ({pendingPayoutsCount} Pending)
                </h3>
                <div className="text-xs font-mono text-amber-400 font-bold">
                  Pending Total: {formatPrice(totalPendingPayoutAmount)}
                </div>
              </div>

              {/* Pending Payouts */}
              {payoutRequests.filter(p => p.status === 'pending').length > 0 ? (
                payoutRequests.filter(p => p.status === 'pending').map(req => (
                  <div key={req.id} className="p-5 rounded-3xl bg-[#1A1812] border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={req.sellerAvatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-700" />
                        <div>
                          <div className="font-bold text-white text-sm">{req.sellerName}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {req.method}: {req.accountDetails} • Requested: {formatDate(req.requestedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-amber-400 font-mono">{formatPrice(req.amount)}</div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">PENDING APPROVAL</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                      <input type="text" placeholder="Admin notes (optional)..." value={payoutRejectReason} onChange={(e) => setPayoutRejectReason(e.target.value)} className="flex-1 bg-[#141418] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none" />
                      <button onClick={() => rejectPayoutRequest(req.id, payoutRejectReason || 'Insufficient verification')} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold">
                        Reject
                      </button>
                      <button onClick={() => approvePayoutRequest(req.id, payoutRejectReason || 'Approved by admin')} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                        Approve & Transfer
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 text-xs font-medium bg-[#18181D] rounded-3xl border border-dashed border-gray-800">
                  No pending payout requests.
                </div>
              )}

              {/* Processed Payouts History */}
              {payoutRequests.filter(p => p.status !== 'pending').length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Processed History</h4>
                  {payoutRequests.filter(p => p.status !== 'pending').map(req => (
                    <div key={req.id} className="p-4 rounded-2xl bg-[#18181D] border border-gray-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={req.sellerAvatar} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-700" />
                        <div>
                          <span className="font-bold text-white">{req.sellerName}</span>
                          <span className="text-gray-500 ml-2 font-mono">{req.method}: {req.accountDetails}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-white font-bold">{formatPrice(req.amount)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {req.status.toUpperCase()}
                        </span>
                        <span className="text-gray-500 font-mono">{formatDate(req.processedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 9: PLATFORM SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Settings */}
                <div className="p-6 rounded-3xl bg-[#18181D] border border-gray-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Financial Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Platform Retainage Fee (Flat INR)</label>
                      <input type="number" min="0" max="1000" step="10" value={settingsForm.flatFeeAmount !== undefined ? settingsForm.flatFeeAmount : 100} onChange={(e) => setSettingsForm(prev => ({ ...prev, flatFeeAmount: Number(e.target.value) }))} className="w-full bg-[#0E0E11] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono font-bold focus:border-amber-500 focus:outline-none" />
                      <p className="text-[10px] text-gray-500 mt-1">Flat amount retained per order via Easebuzz Wire split</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Escrow Window (Hours)</label>
                      <input type="number" min="12" max="168" value={settingsForm.escrowWindowHours} onChange={(e) => setSettingsForm(prev => ({ ...prev, escrowWindowHours: e.target.value }))} className="w-full bg-[#0E0E11] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono font-bold focus:border-amber-500 focus:outline-none" />
                      <p className="text-[10px] text-gray-500 mt-1">Buyer inspection period before auto-release</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Min Listing Price (USD base)</label>
                      <input type="number" min="1" value={settingsForm.minListingPriceUSD} onChange={(e) => setSettingsForm(prev => ({ ...prev, minListingPriceUSD: e.target.value }))} className="w-full bg-[#0E0E11] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono font-bold focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Max Listing Price (USD base)</label>
                      <input type="number" min="100" value={settingsForm.maxListingPriceUSD} onChange={(e) => setSettingsForm(prev => ({ ...prev, maxListingPriceUSD: e.target.value }))} className="w-full bg-[#0E0E11] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono font-bold focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Access & Security Settings */}
                <div className="p-6 rounded-3xl bg-[#18181D] border border-gray-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Access & Security</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'allowNewRegistrations', label: 'Allow New Registrations', desc: 'Open/close signup for new sellers' },
                      { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disables marketplace for all users' },
                      { key: 'requireKycForSelling', label: 'Require KYC for Selling', desc: 'Sellers must verify ID before listing' },
                      { key: 'autoApproveVerifiedSellers', label: 'Auto-Approve Verified Sellers', desc: 'Skip moderation queue for Tier 2+ sellers' }
                    ].map(toggle => (
                      <div key={toggle.key} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-gray-800">
                        <div>
                          <div className="text-xs font-bold text-white">{toggle.label}</div>
                          <div className="text-[10px] text-gray-500">{toggle.desc}</div>
                        </div>
                        <button
                          onClick={() => setSettingsForm(prev => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                          className={`w-11 h-6 rounded-full transition-all relative ${settingsForm[toggle.key] ? 'bg-amber-500' : 'bg-gray-700'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settingsForm[toggle.key] ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSettingsSave} className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg transition-all">
                  Save Platform Settings
                </button>
              </div>

              <div className="text-[10px] text-gray-600 font-mono">Last updated: {formatDate(platformSettings.updatedAt)}</div>
            </div>
          )}

          {/* ==================== TAB 10: ACTIVITY LOG ==================== */}
          {activeTab === 'activitylog' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Admin Activity Audit Trail ({filteredLog.length})</h3>
                <select value={logCategoryFilter} onChange={(e) => setLogCategoryFilter(e.target.value)} className="bg-[#18181D] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold">
                  <option value="all">All Categories</option>
                  <option value="moderation">Moderation</option>
                  <option value="security">Security</option>
                  <option value="disputes">Disputes</option>
                  <option value="payouts">Payouts</option>
                  <option value="escrow">Escrow</option>
                  <option value="settings">Settings</option>
                  <option value="kyc">KYC</option>
                </select>
              </div>

              <div className="space-y-2">
                {filteredLog.map(log => (
                  <div key={log.id} className="p-4 rounded-2xl bg-[#18181D] border border-gray-800 hover:bg-gray-800/30 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{log.action.replace(/_/g, ' ').toUpperCase()}</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px] font-bold text-gray-400">{log.category}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-0.5">{log.details}</p>
                      <div className="text-[10px] text-gray-500 mt-1 font-mono">{log.actor} • {formatDate(log.timestamp)}</div>
                    </div>
                  </div>
                ))}
                {filteredLog.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-xs font-medium bg-[#18181D] rounded-3xl border border-dashed border-gray-800">
                    No activity logs for this category.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
