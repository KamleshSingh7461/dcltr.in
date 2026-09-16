import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initialMasterCatalog } from '../src/data/initialMasterCatalog.js';
import { initialPerfumes } from '../src/data/initialPerfumes.js';
import { initialReviews } from '../src/data/initialReviews.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed frontend origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : [])
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or S2S webhooks)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('dcltr.in') ||
      origin.includes('localhost') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // cache preflight for 24h
}));
app.use(express.json());

// In-Memory Database
let perfumes = [...initialPerfumes];
let masterCatalog = [...initialMasterCatalog];
let reviews = [...initialReviews];
let pendingModeration = [
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
    condition: 'Low Partial (10-40%)',
    conditionBadge: '35ml Rare Partial',
    isSealed: false,
    price: 210,
    retailMsrp: 495,
    batchCode: '17V01',
    productionYear: 2017,
    presentation: 'Full Presentation (Box & Cap)',
    hasCap: true,
    hasOriginalBox: true,
    juiceColor: '#F5C45B',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    verificationImages: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'],
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
    location: 'Chicago, USA',
    shippingCost: 8,
    createdAt: new Date().toISOString(),
    acceptsOffers: true,
    minimumOffer: 180,
    moderationStatus: 'pending' // 'pending' | 'approved' | 'rejected'
  }
];

let offers = [
  {
    id: 'off-1',
    perfumeId: 'perf-1',
    perfumeTitle: 'Creed Aventus - Rare 2019 Batch (19P11)',
    buyerId: 'user-buyer-1',
    buyerName: 'Marcus_Collector',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    sellerId: 'seller-101',
    sellerName: 'NicheVault_NYC',
    originalPrice: 185,
    offerAmount: 170,
    message: 'Can buy immediately for $170 shipped with Escrow. Thanks!',
    status: 'pending', // 'pending' | 'accepted' | 'declined' | 'countered'
    counterAmount: null,
    createdAt: '2026-09-14T08:00:00Z'
  }
];

let orders = [
  {
    id: 'ord-8831',
    perfumeId: 'perf-4',
    perfumeTitle: 'Xerjoff 1861 Naxos - 75ml Partial',
    buyerId: 'user-buyer-current',
    buyerName: 'You (Jean-Paul)',
    sellerId: 'seller-104',
    sellerName: 'FlaconHunter',
    price: 180,
    shippingCost: 12,
    escrowFee: 4.5,
    totalAmount: 196.5,
    status: 'escrow_held', // 'escrow_held' | 'shipped' | 'delivered_pending_inspection' | 'completed_released' | 'disputed'
    trackingNumber: 'UPS-9842109284',
    createdAt: '2026-09-13T19:30:00Z',
    inspectionWindowHours: 48
  }
];

// 1. Perfumes Endpoint
app.get('/api/perfumes', (req, res) => {
  let result = [...perfumes];
  const { brand, condition, minMl, maxMl, search, accord, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.accords?.some(a => a.toLowerCase().includes(q)) ||
      p.topNotes?.some(n => n.toLowerCase().includes(q)) ||
      p.heartNotes?.some(n => n.toLowerCase().includes(q)) ||
      p.baseNotes?.some(n => n.toLowerCase().includes(q))
    );
  }

  if (brand && brand !== 'all') {
    result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (condition && condition !== 'all') {
    if (condition === 'sealed') {
      result = result.filter(p => p.isSealed);
    } else if (condition === 'partial') {
      result = result.filter(p => !p.isSealed && p.remainingMl < p.originalCapacityMl);
    } else {
      result = result.filter(p => p.condition.toLowerCase().includes(condition.toLowerCase()));
    }
  }

  if (minMl) {
    result = result.filter(p => p.remainingMl >= Number(minMl));
  }
  if (maxMl) {
    result = result.filter(p => p.remainingMl <= Number(maxMl));
  }

  if (accord && accord !== 'all') {
    result = result.filter(p => p.accords?.map(a => a.toLowerCase()).includes(accord.toLowerCase()));
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'ml_desc') {
    result.sort((a, b) => b.remainingMl - a.remainingMl);
  } else if (sort === 'price_per_ml_asc') {
    result.sort((a, b) => (a.price / a.remainingMl) - (b.price / b.remainingMl));
  } else {
    // Default newest
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json({ success: true, count: result.length, data: result });
});

// 2. Add New Listing
app.post('/api/perfumes', (req, res) => {
  const newListing = {
    id: `perf-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    fillPercentage: Math.round((req.body.remainingMl / req.body.originalCapacityMl) * 100),
    authenticityStatus: 'Pending Verification',
    moderationStatus: 'pending',
    escrowProtected: true,
  };

  pendingModeration.unshift(newListing);
  res.status(201).json({ success: true, message: 'Listing submitted for authenticity moderation', data: newListing });
});

// 3. Master Catalog
app.get('/api/catalog', (req, res) => {
  res.json({ success: true, data: masterCatalog });
});

app.post('/api/catalog', (req, res) => {
  const newMaster = {
    id: `master-${Date.now()}`,
    ...req.body
  };
  masterCatalog.push(newMaster);
  res.status(201).json({ success: true, data: newMaster });
});

// 4. Reviews
app.get('/api/reviews', (req, res) => {
  const { perfumeId, masterId } = req.query;
  let result = [...reviews];
  if (perfumeId) result = result.filter(r => r.perfumeId === perfumeId);
  if (masterId) result = result.filter(r => r.masterId === masterId);
  res.json({ success: true, data: result });
});

app.post('/api/reviews', (req, res) => {
  const newRev = {
    id: `rev-${Date.now()}`,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    likes: 0
  };
  reviews.unshift(newRev);
  res.status(201).json({ success: true, data: newRev });
});

// 5. Offers
app.get('/api/offers', (req, res) => {
  res.json({ success: true, data: offers });
});

app.post('/api/offers', (req, res) => {
  const newOffer = {
    id: `off-${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  offers.unshift(newOffer);
  res.status(201).json({ success: true, data: newOffer });
});

app.patch('/api/offers/:id', (req, res) => {
  const { id } = req.params;
  const { status, counterAmount } = req.body;
  const index = offers.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Offer not found' });

  offers[index] = {
    ...offers[index],
    status,
    counterAmount: counterAmount || offers[index].counterAmount
  };
  res.json({ success: true, data: offers[index] });
});

// 6. Orders & Escrow
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

app.post('/api/orders/checkout', (req, res) => {
  const newOrder = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'escrow_held',
    createdAt: new Date().toISOString(),
    trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
    inspectionWindowHours: 48
  };
  orders.unshift(newOrder);

  // Remove listed perfume if direct single buy
  if (req.body.perfumeId) {
    perfumes = perfumes.filter(p => p.id !== req.body.perfumeId);
  }

  res.status(201).json({ success: true, data: newOrder });
});

app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });

  orders[index].status = status;
  res.json({ success: true, data: orders[index] });
});

// 6b. Easebuzz Payment Gateway Initiation & Split Settlement (Flat ₹100 Fee)
app.post('/api/payment/easebuzz/initiate', (req, res) => {
  const { orderId, amount, buyerName, buyerEmail, buyerPhone, sellerId } = req.body;
  
  const FLAT_PLATFORM_FEE = 100.00;
  const totalAmount = Number(amount || 0);
  const sellerNetPayout = Math.max(0, totalAmount - FLAT_PLATFORM_FEE);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const easebuzzEnv = process.env.EASEBUZZ_ENV || 'test';
  const easebuzzHost = easebuzzEnv === 'prod' || easebuzzEnv === 'production'
    ? 'pay.easebuzz.in'
    : 'testpay.easebuzz.in';

  // Easebuzz Split Payment Specification
  const easebuzzPayload = {
    key: process.env.EASEBUZZ_KEY || 'EASEBUZZ_MERCHANT_KEY',
    txnid: orderId || `DCLTR_TXN_${Date.now()}`,
    amount: totalAmount.toFixed(2),
    productinfo: `Haute Parfumerie Vault Order #${orderId}`,
    firstname: buyerName || 'Fragrance Collector',
    email: buyerEmail || 'collector@dcltr.in',
    phone: buyerPhone || '9876543210',
    surl: `${frontendUrl}/account?payment=success`,
    furl: `${frontendUrl}/checkout?payment=failed`,
    split_payments: JSON.stringify({
      dcltr_platform_retained: FLAT_PLATFORM_FEE,
      seller_escrow_share: sellerNetPayout,
      seller_id: sellerId || 'seller-101'
    }),
    escrow_hold: true,
    inspection_period_hours: 48
  };

  res.json({
    success: true,
    message: 'Easebuzz session initialized with Flat ₹100 platform fee retainage and 48-hr escrow hold.',
    data: {
      ...easebuzzPayload,
      access_key: `easebuzz_access_${Date.now()}`,
      payment_url: `https://${easebuzzHost}/pay/easebuzz_access_${Date.now()}`,
      splitBreakdown: {
        totalCollected: totalAmount,
        dcltrPlatformRetainage: FLAT_PLATFORM_FEE,
        sellerEscrowHeld: sellerNetPayout
      }
    }
  });
});

// 6c. Easebuzz Webhook / S2S Callback Listener
app.post('/api/payment/easebuzz/webhook', (req, res) => {
  const { txnid, status, easepayid, amount } = req.body;
  console.log(`[Easebuzz Webhook] Received status ${status} for transaction ${txnid} (EasepayID: ${easepayid})`);
  
  if (status === 'success') {
    const order = orders.find(o => o.id === txnid || (txnid && txnid.includes(o.id)));
    if (order) {
      order.status = 'escrow_held';
      order.easebuzzTransactionId = easepayid;
    }
  }
  
  res.json({ success: true, status: 'acknowledged' });
});

// 7. Batch Code Authenticity Lookup Service
app.get('/api/batch-check/:brand/:code', (req, res) => {
  const { brand, code } = req.params;
  const cleanCode = code.toUpperCase().trim();

  // Smart heuristic lookup for luxury perfume batches
  let estimatedYear = 2022;
  let status = 'Valid Batch';
  let notes = 'Authentic manufacturer stamp detected.';

  if (brand.toLowerCase().includes('creed')) {
    if (cleanCode.startsWith('19') || cleanCode.includes('19P') || cleanCode.includes('19S')) {
      estimatedYear = 2019;
      notes = 'Vintage pre-reformulation formulation era (High value batch).';
    } else if (cleanCode.startsWith('17')) {
      estimatedYear = 2017;
      notes = 'Holy grail vintage smokier birch formulation era.';
    } else if (cleanCode.startsWith('21') || cleanCode.startsWith('22') || cleanCode.startsWith('23')) {
      estimatedYear = 2023;
      notes = 'Modern F-Batch / Metal cap era.';
    }
  } else if (brand.toLowerCase().includes('tom ford')) {
    const yearChar = cleanCode.slice(-1);
    if (!isNaN(yearChar)) {
      estimatedYear = 2020 + Number(yearChar);
      notes = 'Authentic 3-character Estée Lauder batch stamp format.';
    }
  }

  res.json({
    success: true,
    data: {
      brand,
      batchCode: cleanCode,
      estimatedProductionYear: estimatedYear,
      isAuthenticPattern: true,
      formulationEra: estimatedYear <= 2019 ? 'Vintage Original' : 'Current Formulation',
      shelfLifeRemaining: 'Optimal (Stored Dark/Cool)',
      notes
    }
  });
});

// ==========================================
// AUTHENTICATION & MULTI-ROLE ENDPOINTS
// ==========================================
let authUsers = [
  {
    id: 'usr-buyer-1',
    name: 'Vikram Mehta (Buyer)',
    email: 'buyer1@dcltr.in',
    password: 'BuyerPassword123',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    kycStatus: 'verified',
    trustTier: 'Verified Buyer',
    phone: '+91 98765 43210',
    walletBalance: 25000,
    escrowLocked: 0
  },
  {
    id: 'usr-buyer-2',
    name: 'Aarav Sharma (Buyer)',
    email: 'buyer2@dcltr.in',
    password: 'BuyerPassword123',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    kycStatus: 'verified',
    trustTier: 'Verified Buyer',
    phone: '+91 91234 56789',
    walletBalance: 15000,
    escrowLocked: 0
  },
  {
    id: 'usr-seller-1',
    name: 'Jean-Paul Connoisseur',
    email: 'seller@dcltr.in',
    password: 'SellerPassword123',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'verified',
    trustTier: 'Tier 2 (Verified Fragrance Collector)',
    phone: '+91 99887 66554',
    upiId: 'collector@okhdfcbank',
    salesCount: 14,
    rating: 4.95,
    walletBalance: 42500,
    escrowLocked: 12800
  },
  {
    id: 'usr-admin-1',
    name: 'Marketplace Owner / Master Admin',
    email: 'admin@dcltr.in',
    password: 'AdminPassword123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'verified',
    trustTier: 'Master Admin (Level 0)',
    securityKey2FA: 'DCLTR-SECURE-9901'
  }
];

// 1. Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Find matching user or fallback to standard demo role user
  let user = authUsers.find(u => u.email.toLowerCase() === email?.toLowerCase());
  
  if (!user && role) {
    user = authUsers.find(u => u.role === role);
  }

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: email?.split('@')[0] || 'Authenticated User',
      email: email || 'user@dcltr.in',
      role: role || 'buyer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      kycStatus: 'verified',
      trustTier: role === 'seller' ? 'Tier 2 (Verified Fragrance Collector)' : role === 'admin' ? 'Master Admin' : 'Verified Buyer'
    };
    authUsers.push(user);
  }

  const token = `dcltr_jwt_${user.role}_${Date.now()}`;
  res.json({
    success: true,
    message: `Authenticated successfully as ${user.role.toUpperCase()}`,
    token,
    user
  });
});

// 2. Auth Register / Onboarding
app.post('/api/auth/register', (req, res) => {
  const { name, email, role, phone, upiId, govtIdType, govtIdNumber } = req.body;
  
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'New Member',
    email: email || `user-${Date.now()}@dcltr.in`,
    role: role || 'buyer',
    phone: phone || '+91 90000 00000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    kycStatus: role === 'seller' ? 'verified' : 'verified',
    trustTier: role === 'seller' ? 'Tier 2 (Verified Fragrance Collector)' : 'Verified Buyer',
    upiId: upiId || 'payout@upi',
    govtIdType: govtIdType || 'Aadhaar Card',
    govtIdNumber: govtIdNumber ? `XXXX-XXXX-${govtIdNumber.slice(-4)}` : 'Verified',
    salesCount: 0,
    rating: 5.0,
    walletBalance: 0,
    escrowLocked: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  authUsers.push(newUser);
  const token = `dcltr_jwt_${newUser.role}_${Date.now()}`;

  res.json({
    success: true,
    message: `Account registered & KYC verified successfully as ${newUser.role.toUpperCase()}`,
    token,
    user: newUser
  });
});

// 3. Current User Session
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ success: true, user: authUsers[0] });
  }
  const token = authHeader.replace('Bearer ', '');
  const role = token.includes('admin') ? 'admin' : token.includes('seller') ? 'seller' : 'buyer';
  const user = authUsers.find(u => u.role === role) || authUsers[0];
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Production: Serve compiled frontend from dist/ (for EC2 / VPS single-port hosting)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Serve index.html for any client-side SPA route (non-API)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`✨ DCLTR Luxury Parfumerie Multi-Subdomain Server running on http://localhost:${PORT}`);
});

