import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialPerfumes } from '../data/initialPerfumes.js';
import { initialMasterCatalog } from '../data/initialMasterCatalog.js';
import { initialReviews } from '../data/initialReviews.js';
import { apiService } from '../services/api.js';

const MarketplaceContext = createContext();

export function MarketplaceProvider({ children }) {
  // Main Data States with LocalStorage Persistence
  const [perfumes, setPerfumes] = useState(() => {
    const saved = localStorage.getItem('dcltr_perfumes');
    return saved ? JSON.parse(saved) : initialPerfumes;
  });

  const [masterCatalog, setMasterCatalog] = useState(() => {
    const saved = localStorage.getItem('dcltr_master_catalog');
    return saved ? JSON.parse(saved) : initialMasterCatalog;
  });

  const [reviews, setReviews] = useState(() => {
    const REVIEWS_VERSION = 'v2';
    const savedVersion = localStorage.getItem('dcltr_reviews_version');
    const saved = localStorage.getItem('dcltr_reviews');
    if (saved && savedVersion === REVIEWS_VERSION) return JSON.parse(saved);
    // Wipe stale cache and load fresh seeds
    localStorage.removeItem('dcltr_reviews');
    localStorage.setItem('dcltr_reviews_version', REVIEWS_VERSION);
    return initialReviews;
  });

  const [pendingModeration, setPendingModeration] = useState(() => {
    const saved = localStorage.getItem('dcltr_pending_moderation');
    return saved ? JSON.parse(saved) : [
      {
        id: 'perf-pending-1',
        masterId: 'master-1',
        title: 'Creed Aventus 2017 Vintage 17V01 - 35ml Flacon Remnant',
        brand: 'Creed',
        name: 'Aventus',
        concentration: 'Eau de Parfum',
        originalCapacityMl: 100,
        remainingMl: 35,
        fillPercentage: 35,
        condition: 'Mid Partial (31-70%)',
        conditionBadge: '35ml (35% Full)',
        isSealed: false,
        isTester: false,
        hasOriginalBox: true,
        presentation: 'Retail with box',
        price: 210,
        retailMsrp: 495,
        batchCode: '17V01',
        productionYear: 2017,
        hasCap: true,
        juiceColor: '#F5C45B',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        verificationImages: [
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'
        ],
        seller: {
          id: 'seller-new-88',
          name: 'VintageNose_Alex',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          rating: 4.85,
          salesCount: 12,
          isVerifiedSeller: true,
          memberSince: '2024',
          responseRate: '95%'
        },
        authenticityStatus: 'Pending Verification',
        escrowProtected: true,
        accords: ['Fruity', 'Smoky', 'Woody'],
        topNotes: ['Pineapple', 'Bergamot'],
        heartNotes: ['Birch', 'Patchouli'],
        baseNotes: ['Ambergris', 'Musk'],
        description: 'Rare 2017 holy grail batch. Clear smoke and vanilla notes. Etched batch on base matches box sticker.',
        location: 'Mumbai, India',
        shippingCost: 8,
        createdAt: new Date().toISOString(),
        acceptsOffers: true,
        minimumOffer: 180,
        moderationStatus: 'pending',
        meniscusVerified: true,
        weightGrams: 312
      }
    ];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('dcltr_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('dcltr_wishlist');
    return saved ? JSON.parse(saved) : ['perf-1', 'perf-8'];
  });

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('dcltr_offers');
    return saved ? JSON.parse(saved) : [
      {
        id: 'off-1',
        perfumeId: 'perf-1',
        perfumeTitle: 'Creed Aventus - Rare 2019 Batch (19P11)',
        buyerId: 'user-buyer-current',
        buyerName: 'Vikram Mehta (Collector)',
        buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        sellerId: 'seller-you',
        sellerName: 'You (Collector)',
        originalPrice: 185,
        offerAmount: 170,
        message: 'Can pay immediately with Escrow protection. Beautiful 2019 batch!',
        status: 'pending',
        counterAmount: null,
        createdAt: '2026-09-14T08:00:00Z'
      }
    ];
  });

  // Anti-Scam Escrow Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('dcltr_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-8831',
        perfumeId: 'perf-4',
        perfumeTitle: 'Xerjoff 1861 Naxos - 75ml Partial in Velvet Box',
        perfumeBrand: 'Xerjoff',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
        buyerId: 'buyer-rohit-42',
        buyerName: 'Rohit Sharma (Bengaluru)',
        buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        sellerId: 'seller-you',
        sellerName: 'You (Collector)',
        price: 180,
        shippingCost: 12,
        platformFeePercent: 8,
        platformFeeAmount: 14.4,
        sellerNetPayout: 177.6,
        totalAmount: 192,
        status: 'escrow_held', // 'escrow_held' | 'shipped_with_proof' | 'delivered_inspecting' | 'completed_released' | 'disputed' | 'refunded_to_buyer'
        createdAt: '2026-09-13T19:30:00Z',
        inspectionWindowHours: 48,
        preShipmentProof: null,
        disputeData: null
      },
      {
        id: 'ord-7729',
        perfumeId: 'perf-5',
        perfumeTitle: 'Parfums de Marly Layton - 110ml / 125ml Flacon',
        perfumeBrand: 'Parfums de Marly',
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
        buyerId: 'buyer-aditi-19',
        buyerName: 'Aditi Varma (Delhi)',
        buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        sellerId: 'seller-101',
        sellerName: 'NicheVault_NYC',
        price: 215,
        shippingCost: 0,
        platformFeePercent: 8,
        platformFeeAmount: 17.2,
        sellerNetPayout: 197.8,
        totalAmount: 215,
        status: 'delivered_inspecting',
        createdAt: '2026-09-12T10:00:00Z',
        deliveredAt: '2026-09-14T06:00:00Z',
        inspectionWindowHours: 48,
        preShipmentProof: {
          courier: 'Delhivery Express',
          trackingNumber: 'DL-9842109284',
          weightGrams: 485,
          tamperSealId: 'DCLTR-SEC-8891',
          shippedAt: '2026-09-12T14:30:00Z'
        },
        disputeData: null
      },
      {
        id: 'ord-6610',
        perfumeId: 'perf-2',
        perfumeTitle: 'Maison Francis Kurkdjian - Baccarat Rouge 540 Extrait',
        perfumeBrand: 'Maison Francis Kurkdjian',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        buyerId: 'buyer-karan-88',
        buyerName: 'Karan Singhania (Mumbai)',
        buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        sellerId: 'seller-102',
        sellerName: 'AromaConnoisseur',
        price: 110,
        shippingCost: 8,
        platformFeePercent: 8,
        platformFeeAmount: 8.8,
        sellerNetPayout: 109.2,
        totalAmount: 118,
        status: 'disputed',
        createdAt: '2026-09-11T12:00:00Z',
        inspectionWindowHours: 48,
        preShipmentProof: {
          courier: 'Blue Dart Air',
          trackingNumber: 'BD-33918204',
          weightGrams: 240,
          tamperSealId: 'DCLTR-SEC-4412',
          shippedAt: '2026-09-11T16:00:00Z'
        },
        disputeData: {
          issue: 'Suspected Atomizer Tampering / Level Discrepancy',
          buyerEvidenceNotes: 'Meniscus line appears lower than 20ml and atomizer collar has scratches.',
          buyerMeasuredWeight: 215,
          sellerPreShipWeight: 240,
          filedAt: '2026-09-13T18:00:00Z',
          status: 'under_admin_review'
        }
      }
    ];
  });

  // User Management & KYC Tiers
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('dcltr_users');
    return saved ? JSON.parse(saved) : [
      {
        id: 'seller-you',
        name: 'You (Collector)',
        email: 'owner@dcltr.in',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        kycStatus: 'verified', // 'verified' | 'pending' | 'unverified'
        trustTier: 'Tier 2 (Verified Fragrance Collector)',
        isBlacklisted: false,
        salesCount: 14,
        rating: 4.95,
        walletBalance: 355.2, // Ready for bank withdrawal in USD base
        escrowLocked: 177.6,  // Locked in active escrow orders
        joinedDate: '2024-01-15'
      },
      {
        id: 'seller-101',
        name: 'NicheVault_NYC',
        email: 'vault@nichefragrances.com',
        phone: '+1 212 555 0192',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        kycStatus: 'verified',
        trustTier: 'Tier 3 (Master Vault Seller)',
        isBlacklisted: false,
        salesCount: 142,
        rating: 4.98,
        walletBalance: 1240.0,
        escrowLocked: 197.8,
        joinedDate: '2021-06-10'
      },
      {
        id: 'seller-102',
        name: 'AromaConnoisseur',
        email: 'aroma@connoisseur.uk',
        phone: '+44 20 7946 0912',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        kycStatus: 'verified',
        trustTier: 'Tier 2 (Verified Fragrance Collector)',
        isBlacklisted: false,
        salesCount: 88,
        rating: 4.95,
        walletBalance: 820.0,
        escrowLocked: 109.2,
        joinedDate: '2022-03-22'
      },
      {
        id: 'seller-suspect-99',
        name: 'DiscountDecant_Shadow',
        email: 'cheapclones@tempmail.com',
        phone: '+91 99999 00000',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        kycStatus: 'rejected',
        trustTier: 'Flagged / Restricted Account',
        isBlacklisted: true,
        blacklistReason: 'Attempted to list diluted clone batch in genuine flacon.',
        salesCount: 0,
        rating: 1.0,
        walletBalance: 0,
        escrowLocked: 0,
        joinedDate: '2026-09-01'
      }
    ];
  });

  // Active Role switcher: 'buyer' | 'seller' | 'admin'
  const [currentRole, setCurrentRole] = useState('buyer');

  // ========== NEW: Platform Settings (Admin Editable) ==========
  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem('dcltr_platform_settings');
    return saved ? JSON.parse(saved) : {
      feeType: 'flat', // 'flat' (Flat 100 INR) | 'percentage'
      flatFeeAmount: 100, // Flat ₹100 INR per order
      commissionPercent: 0,
      paymentGateway: 'Easebuzz',
      escrowWindowHours: 48,
      minListingPriceUSD: 5,
      maxListingPriceUSD: 10000,
      allowNewRegistrations: true,
      maintenanceMode: false,
      allowedCategories: ['Eau de Parfum', 'Eau de Toilette', 'Extrait de Parfum', 'Eau de Cologne', 'Parfum'],
      requireKycForSelling: true,
      autoApproveVerifiedSellers: false,
      updatedAt: new Date().toISOString()
    };
  });

  // ========== NEW: Payout Requests (Seller → Admin Approval) ==========
  const [payoutRequests, setPayoutRequests] = useState(() => {
    const saved = localStorage.getItem('dcltr_payout_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'payout-demo-1',
        sellerId: 'seller-101',
        sellerName: 'NicheVault_NYC',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        amount: 450,
        method: 'UPI',
        accountDetails: 'nichevault@okhdfcbank',
        status: 'pending', // 'pending' | 'approved' | 'rejected'
        requestedAt: '2026-09-14T06:30:00Z',
        processedAt: null,
        adminNotes: null
      },
      {
        id: 'payout-demo-2',
        sellerId: 'seller-102',
        sellerName: 'AromaConnoisseur',
        sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        amount: 280,
        method: 'NEFT',
        accountDetails: 'HDFC A/C XXXX4412',
        status: 'pending',
        requestedAt: '2026-09-13T18:00:00Z',
        processedAt: null,
        adminNotes: null
      }
    ];
  });

  // ========== NEW: Activity / Audit Log ==========
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('dcltr_activity_log');
    return saved ? JSON.parse(saved) : [
      { id: 'log-1', action: 'listing_approved', details: 'Approved listing: Creed Aventus 2017 Vintage', actor: 'Master Admin', timestamp: '2026-09-13T10:30:00Z', category: 'moderation' },
      { id: 'log-2', action: 'user_blacklisted', details: 'Blacklisted DiscountDecant_Shadow for clone fraud', actor: 'Master Admin', timestamp: '2026-09-12T15:00:00Z', category: 'security' },
      { id: 'log-3', action: 'dispute_resolved', details: 'Dispute #ord-6610 resolved: Buyer refund', actor: 'Master Admin', timestamp: '2026-09-11T20:00:00Z', category: 'disputes' },
      { id: 'log-4', action: 'payout_approved', details: 'Payout ₹38,250 approved for NicheVault_NYC', actor: 'Master Admin', timestamp: '2026-09-11T14:00:00Z', category: 'payouts' },
      { id: 'log-5', action: 'settings_updated', details: 'Commission rate updated from 10% to 8%', actor: 'Master Admin', timestamp: '2026-09-10T09:00:00Z', category: 'settings' },
      { id: 'log-6', action: 'kyc_verified', details: 'KYC approved for AromaConnoisseur (PAN verified)', actor: 'Master Admin', timestamp: '2026-09-09T11:30:00Z', category: 'kyc' },
      { id: 'log-7', action: 'listing_rejected', details: 'Rejected suspicious Amouage listing — batch code invalid', actor: 'Master Admin', timestamp: '2026-09-08T16:45:00Z', category: 'moderation' },
      { id: 'log-8', action: 'escrow_released', details: 'Escrow released for order #ord-5501 (₹18,700 to seller)', actor: 'System (48h auto)', timestamp: '2026-09-07T12:00:00Z', category: 'escrow' }
    ];
  });

  // Currency Exchange Engine (Permanent Default: INR)
  const currencyRates = {
    INR: { code: 'INR', symbol: '₹', rate: 85.0, flag: 'IN' },
    USD: { code: 'USD', symbol: '$', rate: 1.0, flag: 'US' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, flag: 'EU' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79, flag: 'UK' },
    AED: { code: 'AED', symbol: 'AED ', rate: 3.67, flag: 'UAE' },
  };
  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem('dcltr_currency') || 'INR';
  });

  const formatPrice = (amountInUSD) => {
    if (!amountInUSD && amountInUSD !== 0) return '₹0';
    const curr = currencyRates[activeCurrency] || currencyRates.INR;
    const converted = amountInUSD * curr.rate;
    if (curr.code === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  };

  // Filters State
  const initialFilterState = {
    search: '',
    brand: 'all',
    packaging: 'all', // 'all' | 'retail_with_box' | 'retail_without_box' | 'tester_with_box' | 'tester_without_box'
    fillPreset: 'all', // 'all' | 'low_partial' | 'mid_partial' | 'high_partial'
    minMl: 0,
    maxMl: 250,
    minPrice: 0,
    maxPrice: 600,
    accord: 'all',
    onlyOffersAccepted: false,
    onlySealed: false,
    sortBy: 'newest'
  };
  const [filters, setFilters] = useState(initialFilterState);

  // Active UI Modals
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForOffer, setProductForOffer] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('dcltr_perfumes', JSON.stringify(perfumes)); }, [perfumes]);
  useEffect(() => { localStorage.setItem('dcltr_master_catalog', JSON.stringify(masterCatalog)); }, [masterCatalog]);
  useEffect(() => { localStorage.setItem('dcltr_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('dcltr_pending_moderation', JSON.stringify(pendingModeration)); }, [pendingModeration]);
  useEffect(() => { localStorage.setItem('dcltr_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('dcltr_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('dcltr_offers', JSON.stringify(offers)); }, [offers]);
  useEffect(() => { localStorage.setItem('dcltr_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('dcltr_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('dcltr_currency', activeCurrency); }, [activeCurrency]);
  useEffect(() => { localStorage.setItem('dcltr_platform_settings', JSON.stringify(platformSettings)); }, [platformSettings]);
  useEffect(() => { localStorage.setItem('dcltr_payout_requests', JSON.stringify(payoutRequests)); }, [payoutRequests]);
  useEffect(() => { localStorage.setItem('dcltr_activity_log', JSON.stringify(activityLog)); }, [activityLog]);

  // Toast Helper
  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // 1. Cart Management
  const addToCart = (product) => {
    if (cart.some(item => item.id === product.id)) {
      showToast('Already in Cart', `${product.name} is already in your shopping cart.`, 'info');
      return;
    }
    setCart(prev => [...prev, product]);
    showToast('Added to Cart', `${product.title} has been added to your cart.`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Removed', 'Perfume removed from cart.', 'info');
  };

  const clearCart = () => setCart([]);

  // 2. Wishlist Management
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Vault', 'Item removed from your saved list.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Vault', 'Added to your private collection wishlist.', 'gold');
        return [...prev, productId];
      }
    });
  };

  // 3. Make Offer Flow
  const submitOffer = async (offerData) => {
    const newOffer = {
      id: `off-${Date.now()}`,
      perfumeId: offerData.perfumeId,
      perfumeTitle: offerData.perfumeTitle,
      buyerId: 'user-buyer-current',
      buyerName: 'You (Collector)',
      buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      sellerId: offerData.sellerId || 'seller-you',
      sellerName: offerData.sellerName || 'Niche Vault',
      originalPrice: offerData.originalPrice,
      offerAmount: Number(offerData.offerAmount),
      message: offerData.message || 'Direct collector offer submitted via Escrow.',
      status: 'pending',
      counterAmount: null,
      createdAt: new Date().toISOString()
    };

    setOffers(prev => [newOffer, ...prev]);
    await apiService.submitOffer(newOffer);
    showToast('Offer Submitted!', `Your offer of ${formatPrice(offerData.offerAmount)} was transmitted to the seller.`, 'gold');
  };

  const updateOfferStatus = async (offerId, newStatus, counterPrice = null) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: newStatus,
          counterAmount: counterPrice ? Number(counterPrice) : o.counterAmount
        };
      }
      return o;
    }));

    if (newStatus === 'accepted') {
      showToast('Offer Accepted', 'Buyer will be notified to deposit escrow funds.', 'success');
    } else if (newStatus === 'countered') {
      showToast('Counter-Offer Sent', `Countered at ${formatPrice(counterPrice)}.`, 'info');
    } else {
      showToast('Offer Declined', 'Offer has been politely declined.', 'info');
    }
  };

  // 4. Seller Creates Listing
  const createListing = async (listingData) => {
    const newListing = {
      id: `perf-pending-${Date.now()}`,
      ...listingData,
      createdAt: new Date().toISOString(),
      moderationStatus: 'pending'
    };

    setPendingModeration(prev => [newListing, ...prev]);
    await apiService.createListing(newListing);

    showToast('Listing Queued for Verification', 'Our authenticity lab will vet batch codes and fluid line within 2 hours.', 'gold');
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    } catch (e) {}
  };

  // 5. Admin Moderation Actions
  const approveListing = async (listingId, moderatorNotes = 'Batch code and liquid level verified.') => {
    const item = pendingModeration.find(p => p.id === listingId);
    if (!item) return;

    const approvedItem = {
      ...item,
      id: `perf-${Date.now()}`,
      authenticityStatus: 'Verified Authentic (Admin Vetted)',
      moderationStatus: 'approved',
      moderatorNotes
    };

    setPendingModeration(prev => prev.filter(p => p.id !== listingId));
    setPerfumes(prev => [approvedItem, ...prev]);
    await apiService.moderateListing(listingId, 'approve', moderatorNotes);

    showToast('Listing Approved!', `${item.title} is now published LIVE!`, 'success');
  };

  const rejectListing = async (listingId, reason = 'Batch code mismatch or unclear fluid level') => {
    setPendingModeration(prev => prev.filter(p => p.id !== listingId));
    await apiService.moderateListing(listingId, 'reject', reason);
    showToast('Listing Rejected', `Item rejected: ${reason}`, 'error');
  };

  // 6. Escrow Checkout (uses Flat ₹100 INR platform fee with Easebuzz)
  const checkoutEscrow = async (orderPayload) => {
    const price = Number(orderPayload.price || orderPayload.totalAmount);
    const platformFee = platformSettings.feeType === 'percentage'
      ? Number((price * platformSettings.commissionPercent / 100).toFixed(2))
      : Number((platformSettings.flatFeeAmount !== undefined ? platformSettings.flatFeeAmount : 100).toFixed(2));
    const sellerNet = Math.max(0, Number((price - platformFee).toFixed(2)));

    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderPayload,
      buyerId: 'user-buyer-current',
      buyerName: 'You (Jean-Paul)',
      buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      sellerId: orderPayload.sellerId || 'seller-101',
      sellerName: orderPayload.sellerName || 'NicheVault_NYC',
      price: price,
      paymentGateway: 'Easebuzz',
      platformFeeType: platformSettings.feeType || 'flat',
      platformFeeAmount: platformFee,
      sellerNetPayout: sellerNet,
      status: 'escrow_held',
      createdAt: new Date().toISOString(),
      inspectionWindowHours: platformSettings.escrowWindowHours,
      preShipmentProof: null,
      disputeData: null
    };

    setOrders(prev => [newOrder, ...prev]);

    // Remove bought item from live marketplace
    if (orderPayload.perfumeId) {
      setPerfumes(prev => prev.filter(p => p.id !== orderPayload.perfumeId));
    }
    if (orderPayload.itemIds) {
      setPerfumes(prev => prev.filter(p => !orderPayload.itemIds.includes(p.id)));
      setCart([]);
    }

    await apiService.checkoutEscrow(newOrder);

    showToast('Escrow Payment Secured!', `Funds of ${formatPrice(orderPayload.totalAmount)} are safely held in Easebuzz Escrow Vault.`, 'gold');
    try {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // 7. Seller Fulfills Order (Courier Dispatch & Proof)
  const fulfillOrder = (orderId, { courier, trackingNumber, weightGrams, tamperSealId }) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'shipped_with_proof',
          courier: courier || 'Delhivery Surface',
          trackingNumber: trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
          preShipmentProof: {
            courier,
            trackingNumber,
            weightGrams: Number(weightGrams),
            tamperSealId,
            shippedAt: new Date().toISOString()
          }
        };
      }
      return o;
    }));
    showToast('Shipping Dispatched', `Courier manifest #${trackingNumber} recorded via ${courier}. Buyer notified!`, 'success');
  };

  // 8. Confirm Delivery & Trigger 48h Inspection Window
  const markOrderDelivered = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered_inspecting',
          deliveredAt: new Date().toISOString()
        };
      }
      return o;
    }));
    showToast('Delivered to Buyer', '48-Hour buyer inspection escrow timer initiated.', 'info');
  };

  // 9. Release Escrow Payment to Seller (48h Window Passed or Buyer Approves)
  const releaseEscrowPayment = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'completed_released',
          fundsReleasedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    const netPayout = order.sellerNetPayout || Math.max(0, order.price - (order.platformFeeAmount || 100));

    // Release funds into seller's wallet balance
    setUsers(prev => prev.map(u => {
      if (u.id === order.sellerId) {
        return {
          ...u,
          walletBalance: u.walletBalance + netPayout,
          escrowLocked: Math.max(0, u.escrowLocked - netPayout),
          salesCount: u.salesCount + 1
        };
      }
      return u;
    }));

    showToast('Escrow Funds Released', `Net payout of ${formatPrice(netPayout)} transferred via Easebuzz Wire! Platform fee (${formatPrice(order.platformFeeAmount || 100)}) retained.`, 'success');
  };

  // 10. Open Dispute (Buyer Flags Issue)
  const openDispute = (orderId, disputePayload) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'disputed',
          disputeData: {
            issue: disputePayload.issue,
            buyerEvidenceNotes: disputePayload.notes,
            buyerMeasuredWeight: Number(disputePayload.weightGrams || 0),
            filedAt: new Date().toISOString(),
            status: 'under_admin_review'
          }
        };
      }
      return o;
    }));
    showToast('Dispute Opened', 'Escrow funds frozen. Platform Admin arbitration desk assigned.', 'error');
  };

  // 11. Admin Resolves Dispute (Anti-Scam Arbitration)
  const resolveDispute = (orderId, verdict, adminNotes) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (verdict === 'release_to_seller') {
      setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: 'completed_released', 
        disputeData: { ...o.disputeData, status: 'resolved_seller_favor', adminNotes } 
      } : o));
      showToast('Dispute Resolved (Seller Favor)', `Funds released to seller. Evidence verified. Note: ${adminNotes}`, 'success');
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: 'refunded_to_buyer', 
        disputeData: { ...o.disputeData, status: 'resolved_buyer_refund', adminNotes } 
      } : o));
      showToast('Dispute Resolved (Buyer Refund)', `Escrow refunded in full to buyer. Note: ${adminNotes}`, 'info');
    }
  };

  // 12. Seller Requests Payout (Goes to Admin Approval Queue)
  const requestPayout = (sellerId, amount, method, accountDetails) => {
    const seller = users.find(u => u.id === sellerId);
    const newRequest = {
      id: `payout-${Date.now()}`,
      sellerId,
      sellerName: seller?.name || 'Unknown Seller',
      sellerAvatar: seller?.avatar || '',
      amount: Number(amount),
      method,
      accountDetails,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      processedAt: null,
      adminNotes: null
    };
    setPayoutRequests(prev => [newRequest, ...prev]);
    showToast('Payout Requested', `Your withdrawal of ${formatPrice(amount)} has been submitted for admin approval.`, 'info');
  };

  // Legacy: direct withdrawal (kept for backwards compat but now routes to request)
  const withdrawSellerFunds = (amount, methodDetails) => {
    requestPayout('seller-you', amount, methodDetails.type, methodDetails.account);
  };

  // 13. Admin Approves / Rejects Payout
  const approvePayoutRequest = (payoutId, adminNotes = 'Approved by admin') => {
    const req = payoutRequests.find(p => p.id === payoutId);
    if (!req) return;
    setPayoutRequests(prev => prev.map(p => p.id === payoutId ? { ...p, status: 'approved', processedAt: new Date().toISOString(), adminNotes } : p));
    // Deduct from seller wallet
    setUsers(prev => prev.map(u => {
      if (u.id === req.sellerId) {
        return { ...u, walletBalance: Math.max(0, u.walletBalance - req.amount) };
      }
      return u;
    }));
    addActivityLog('payout_approved', `Approved payout of ${formatPrice(req.amount)} for ${req.sellerName} via ${req.method}`, 'payouts');
    showToast('Payout Approved', `${formatPrice(req.amount)} approved for ${req.sellerName}.`, 'success');
  };

  const rejectPayoutRequest = (payoutId, adminNotes = 'Rejected by admin') => {
    setPayoutRequests(prev => prev.map(p => p.id === payoutId ? { ...p, status: 'rejected', processedAt: new Date().toISOString(), adminNotes } : p));
    const req = payoutRequests.find(p => p.id === payoutId);
    addActivityLog('payout_rejected', `Rejected payout of ${formatPrice(req?.amount)} for ${req?.sellerName}: ${adminNotes}`, 'payouts');
    showToast('Payout Rejected', `Withdrawal request rejected.`, 'error');
  };

  // 14. Blacklist Scammer / KYC Verification (with audit logging)
  const toggleUserBlacklist = (userId, reason = 'Violated authenticity policies') => {
    const user = users.find(u => u.id === userId);
    const nextStatus = !user?.isBlacklisted;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isBlacklisted: nextStatus,
          blacklistReason: nextStatus ? reason : null
        };
      }
      return u;
    }));
    addActivityLog(
      nextStatus ? 'user_blacklisted' : 'user_unblacklisted',
      `${nextStatus ? 'Blacklisted' : 'Removed blacklist for'} ${user?.name}: ${reason}`,
      'security'
    );
    showToast('User Status Updated', `Account status modified by Admin.`, 'info');
  };

  const verifyUserKyc = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          kycStatus: 'verified',
          trustTier: 'Tier 2 (Verified Fragrance Collector)'
        };
      }
      return u;
    }));
    addActivityLog('kyc_verified', `KYC approved for ${user?.name}`, 'kyc');
    showToast('KYC Approved', 'User identity verified with Government ID.', 'success');
  };

  // 15. Seller Updates Item Price or Removes Listing
  const updateListingPrice = (perfumeId, newPrice) => {
    setPerfumes(prev => prev.map(p => p.id === perfumeId ? { ...p, price: Number(newPrice) } : p));
    showToast('Price Updated', `Listing price updated to ${formatPrice(newPrice)}.`, 'success');
  };

  const deleteListing = (perfumeId) => {
    setPerfumes(prev => prev.filter(p => p.id !== perfumeId));
    showToast('Listing Removed', 'Item delisted from active marketplace.', 'info');
  };

  // 16. Admin Force-Delist Any Product
  const forceDelistProduct = (perfumeId, reason = 'Removed by admin') => {
    const product = perfumes.find(p => p.id === perfumeId);
    setPerfumes(prev => prev.filter(p => p.id !== perfumeId));
    addActivityLog('listing_force_delisted', `Force-delisted "${product?.name || product?.title || perfumeId}": ${reason}`, 'moderation');
    showToast('Listing Force-Delisted', `Product removed from marketplace by admin.`, 'error');
  };

  // 17. Admin Updates Platform Settings
  const updatePlatformSettings = (newSettings) => {
    const changes = Object.keys(newSettings).filter(k => platformSettings[k] !== newSettings[k]).map(k => `${k}: ${platformSettings[k]} → ${newSettings[k]}`).join(', ');
    setPlatformSettings(prev => ({ ...prev, ...newSettings, updatedAt: new Date().toISOString() }));
    if (changes) addActivityLog('settings_updated', `Platform settings updated: ${changes}`, 'settings');
    showToast('Settings Saved', 'Platform configuration updated successfully.', 'success');
  };

  // 18. Activity Log Helper
  const addActivityLog = (action, details, category = 'general') => {
    setActivityLog(prev => [{
      id: `log-${Date.now()}`,
      action,
      details,
      actor: 'Master Admin',
      timestamp: new Date().toISOString(),
      category
    }, ...prev]);
  };

  // 15. Reviews
  const addReview = async (reviewPayload) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      ...reviewPayload,
      author: 'You (Verified Collector)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      date: new Date().toISOString().split('T')[0],
      likes: 1,
      verifiedPurchase: true
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Review Published', 'Your olfactory performance rating has been recorded.', 'success');
  };

  // Compute Platform Financials (Owner Metrics) — uses dynamic commission
  const feeRate = platformSettings.commissionPercent / 100;
  const platformGMV = orders.reduce((acc, o) => acc + (o.price || 0), 0);
  const platformCommissionEarned = orders
    .filter(o => o.status === 'completed_released')
    .reduce((acc, o) => acc + (o.platformFeeAmount || (o.price * feeRate)), 0);
  const totalEscrowHeld = orders
    .filter(o => ['escrow_held', 'shipped_with_proof', 'delivered_inspecting', 'disputed'].includes(o.status))
    .reduce((acc, o) => acc + (o.totalAmount || o.price), 0);
  const activeDisputesCount = orders.filter(o => o.status === 'disputed').length;
  const pendingPayoutsCount = payoutRequests.filter(p => p.status === 'pending').length;
  const totalPendingPayoutAmount = payoutRequests.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);

  // Compute Filtered Perfumes
  const filteredPerfumes = perfumes.filter(p => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchText = (
        p.title.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.batchCode?.toLowerCase().includes(q) ||
        p.accords?.some(a => a.toLowerCase().includes(q)) ||
        p.topNotes?.some(n => n.toLowerCase().includes(q)) ||
        p.heartNotes?.some(n => n.toLowerCase().includes(q)) ||
        p.baseNotes?.some(n => n.toLowerCase().includes(q))
      );
      if (!matchText) return false;
    }

    if (filters.brand !== 'all' && p.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    if (filters.packaging && filters.packaging !== 'all') {
      const isTester = Boolean(p.isTester);
      const hasBox = Boolean(p.hasOriginalBox);
      if (filters.packaging === 'retail_with_box' && (isTester || !hasBox)) return false;
      if (filters.packaging === 'retail_without_box' && (isTester || hasBox)) return false;
      if (filters.packaging === 'tester_with_box' && (!isTester || !hasBox)) return false;
      if (filters.packaging === 'tester_without_box' && (!isTester || hasBox)) return false;
    }

    if (filters.fillPreset !== 'all') {
      const fill = p.fillPercentage ?? Math.round((p.remainingMl / p.originalCapacityMl) * 100);
      if (filters.fillPreset === 'low_partial' && !(fill >= 0 && fill <= 30)) return false;
      if (filters.fillPreset === 'mid_partial' && !(fill >= 31 && fill <= 70)) return false;
      if (filters.fillPreset === 'high_partial' && !(fill >= 71 && fill <= 99)) return false;
    }

    if (p.remainingMl < filters.minMl || p.remainingMl > filters.maxMl) {
      return false;
    }

    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }

    if (filters.accord !== 'all' && !p.accords?.map(a => a.toLowerCase()).includes(filters.accord.toLowerCase())) {
      return false;
    }

    if (filters.onlyOffersAccepted && !p.acceptsOffers) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price_asc') return a.price - b.price;
    if (filters.sortBy === 'price_desc') return b.price - a.price;
    if (filters.sortBy === 'ml_desc') return b.remainingMl - a.remainingMl;
    if (filters.sortBy === 'price_per_ml_asc') {
      return (a.price / a.remainingMl) - (b.price / b.remainingMl);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <MarketplaceContext.Provider
      value={{
        perfumes,
        filteredPerfumes,
        masterCatalog,
        reviews,
        pendingModeration,
        cart,
        wishlist,
        offers,
        orders,
        users,
        currentRole,
        setCurrentRole,
        activeCurrency,
        setActiveCurrency,
        formatPrice,
        filters,
        setFilters,
        initialFilterState,
        activeModal,
        setActiveModal,
        mobileFiltersOpen,
        setMobileFiltersOpen,
        selectedProduct,
        setSelectedProduct,
        productForOffer,
        setProductForOffer,
        toast,
        setToast,
        showToast,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        submitOffer,
        updateOfferStatus,
        createListing,
        approveListing,
        rejectListing,
        checkoutEscrow,
        fulfillOrder,
        markOrderDelivered,
        releaseEscrowPayment,
        openDispute,
        resolveDispute,
        withdrawSellerFunds,
        requestPayout,
        approvePayoutRequest,
        rejectPayoutRequest,
        toggleUserBlacklist,
        verifyUserKyc,
        updateListingPrice,
        deleteListing,
        forceDelistProduct,
        updatePlatformSettings,
        addActivityLog,
        addReview,
        platformGMV,
        platformCommissionEarned,
        totalEscrowHeld,
        activeDisputesCount,
        platformSettings,
        payoutRequests,
        activityLog,
        pendingPayoutsCount,
        totalPendingPayoutAmount,
        isLoading: false,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
