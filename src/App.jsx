import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import SubdomainRouter from './components/layout/SubdomainRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CuratedPills from './components/marketplace/CuratedPills';
import FilterSidebar from './components/marketplace/FilterSidebar';
import PerfumeGrid from './components/marketplace/PerfumeGrid';
import ProductDetailModal from './components/marketplace/ProductDetailModal';
import MakeOfferModal from './components/marketplace/MakeOfferModal';
import CartDrawer from './components/marketplace/CartDrawer';
import CheckoutModal from './components/marketplace/CheckoutModal';
import SellWizardModal from './components/seller/SellWizardModal';
import MyListingsModal from './components/seller/MyListingsModal';
import AdminModal from './components/admin/AdminModal';
import NotificationToast from './components/ui/NotificationToast';
import PageLoader from './components/ui/PageLoader';


function MarketplaceContent() {
  const { setActiveModal, toast, setToast } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink-950 selection:bg-ink-950 selection:text-white relative overflow-x-hidden">

      {/* 1. Header & Navigation */}
      <Navbar />


      {/* 3. Main Marketplace Content */}
      <main id="exchange-grid" className="flex-1 max-w-7xl mx-auto w-full px-2.5 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Section header */}
        <div className="mb-4 sm:mb-6 border-b-2 border-ink-950 pb-4 sm:pb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-[1.5px] border-ink-950 text-ink-950 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-950 animate-pulse" />
            Verified P2P Exchange
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-ink-950 tracking-tight leading-tight">
            Pre-Loved Fragrances
            <span className="hidden sm:inline"> &amp; Rare Partials</span>
          </h2>
        </div>

        {/* Quick Curated Collection Pills */}
        <CuratedPills />

        {/* Filter Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar />
          <PerfumeGrid />
        </div>

      </main>

      {/* 3. Premium Sell Callout */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-12">
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 text-white border-2 border-ink-950 shadow-pop-lg">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-8 lg:p-12">

            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-sans text-white text-[10px] tracking-widest uppercase font-extrabold">
                  Zero Listing Fees · 48hr Escrow Payout
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Have Gently Used Fragrances<br className="hidden sm:block" />
                <span className="text-white/60"> Sitting Unsprayed?</span>
              </h3>

              <p className="text-sm text-ink-200 leading-relaxed font-sans max-w-lg">
                List your flacons in under 2 minutes. Automated batch code lookup, meniscus photography guide, and escrow payout within 48 hours of delivery.
              </p>

              {/* Process steps */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { num: '1', label: 'Describe & Photograph' },
                  { num: '2', label: 'Batch Verification' },
                  { num: '3', label: 'Escrow Payout' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-ink-200">
                    <span className="w-5 h-5 rounded-full bg-white text-ink-950 flex items-center justify-center text-[10px] font-extrabold font-mono shrink-0">
                      {step.num}
                    </span>
                    <span>{step.label}</span>
                    {i < 2 && <span className="text-white/30 ml-1">→</span>}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModal('sellWizard')}
              className="btn-pop px-8 py-4 rounded-xl font-bold text-sm bg-white text-ink-950 hover:bg-ink-100 shadow-[4px_4px_0_0_#ffffff30] hover:shadow-none transition-all shrink-0 self-start lg:self-center font-display"
            >
              Start Consigning →
            </button>
          </div>
        </div>
      </section>


      {/* 4. Professional Footer */}
      <Footer />

    </div>
  );
}

function GlobalModals() {
  const { toast, setToast } = useMarketplace();
  return (
    <>
      <ProductDetailModal />
      <MakeOfferModal />
      <CartDrawer />
      <CheckoutModal />
      <SellWizardModal />
      <MyListingsModal />
      <AdminModal />
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        {/* Animated Brand Page Loading Screen */}
        <PageLoader />

        {/* Subdomain Router dynamically routes to Buyer, Seller, or Admin Dashboard / Auth Pages */}
        <SubdomainRouter>
          <MarketplaceContent />
        </SubdomainRouter>

        {/* Global Modals & Drawers mounted at app root so they work across all pages & subdomains */}
        <GlobalModals />
      </MarketplaceProvider>
    </AuthProvider>
  );
}
