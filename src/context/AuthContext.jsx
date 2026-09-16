import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // One-time cleanup: remove stale subdomain key left from older dev builds
  // (subdomain is now always derived from hostname, never stored in localStorage)
  React.useEffect(() => {
    localStorage.removeItem('dcltr_subdomain');
  }, []);

  // Demo Seed Users
  const defaultBuyer = {
    id: 'usr-buyer-1',
    name: 'Vikram Mehta',
    email: 'collector@dcltr.in',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    kycStatus: 'verified',
    trustTier: 'Verified Buyer',
    phone: '+91 98765 43210'
  };

  const defaultSeller = {
    id: 'usr-seller-1',
    name: 'Jean-Paul Connoisseur',
    email: 'seller@dcltr.in',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'verified',
    trustTier: 'Tier 2 (Verified Fragrance Collector)',
    phone: '+91 99887 66554',
    upiId: 'collector@okhdfcbank',
    salesCount: 14,
    rating: 4.95,
    walletBalance: 355.2,
    escrowLocked: 177.6
  };

  const defaultAdmin = {
    id: 'usr-admin-1',
    name: 'Marketplace Owner / Master Admin',
    email: 'admin@dcltr.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'verified',
    trustTier: 'Master Admin (Level 0)',
    securityKey2FA: 'DCLTR-SECURE-9901'
  };

  // Detect initial subdomain from actual hostname only (never from localStorage)
  // On localhost/dev this always defaults to 'marketplace'
  const getInitialSubdomain = () => {
    const host = window.location.hostname;
    const path = window.location.pathname;
    const search = window.location.search;
    if (host.startsWith('admin.') || path.startsWith('/admin') || search.includes('portal=admin') || search.includes('subdomain=admin')) return 'admin';
    if (host.startsWith('seller.') || path.startsWith('/seller') || search.includes('portal=seller') || search.includes('subdomain=seller')) return 'seller';
    return 'marketplace';
  };

  const [activeSubdomain, setActiveSubdomain] = useState(getInitialSubdomain); // 'marketplace' (dcltr.in) | 'seller' (seller.dcltr.in) | 'admin' (admin.dcltr.in)
  const [activePage, setActivePage] = useState('home'); // 'home' | 'login' | 'register' | 'account' | 'terms' | 'privacy' | 'refund-policy' | 'shipping-policy' | 'contact'
  const [accountTab, setAccountTab] = useState('orders'); // Which tab BuyerAccountPage opens on: 'orders' | 'wishlist'
  
  // Real authentication state: Start unauthenticated by default so auth pages are fully accessible
  const [currentUser, setCurrentUser] = useState(() => {
    const isLoggedIn = localStorage.getItem('dcltr_logged_in');
    const saved = localStorage.getItem('dcltr_current_user');
    if (isLoggedIn === 'true' && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null; // Start as unauthenticated visitor
  });

  const [token, setToken] = useState(() => localStorage.getItem('dcltr_token') || null);

  // Keep localStorage in sync
  // Note: activeSubdomain is NOT persisted to localStorage.
  // It is always derived from the real hostname on load.

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dcltr_current_user', JSON.stringify(currentUser));
      localStorage.setItem('dcltr_logged_in', 'true');
    } else {
      localStorage.removeItem('dcltr_current_user');
      localStorage.removeItem('dcltr_logged_in');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('dcltr_token', token);
    } else {
      localStorage.removeItem('dcltr_token');
    }
  }, [token]);

  // Subdomain switcher — supports real subdomains on dcltr.in and SPA switching in dev
  const switchSubdomain = (domain) => {
    setActiveSubdomain(domain);
    setActivePage('home');
    
    // In production on dcltr.in, navigate across real subdomains
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host.endsWith('dcltr.in')) {
        if (domain === 'admin' && !host.startsWith('admin.')) {
          window.location.href = `${window.location.protocol}//admin.dcltr.in`;
          return;
        }
        if (domain === 'seller' && !host.startsWith('seller.')) {
          window.location.href = `${window.location.protocol}//seller.dcltr.in`;
          return;
        }
        if (domain === 'marketplace' && (host.startsWith('admin.') || host.startsWith('seller.'))) {
          window.location.href = `${window.location.protocol}//dcltr.in`;
          return;
        }
      }
    }
  };

  // Login handler
  const login = async ({ email, role = 'buyer' }) => {
    let user;
    if (role === 'admin' || email?.includes('admin')) {
      user = defaultAdmin;
    } else if (role === 'seller' || email?.includes('seller')) {
      user = defaultSeller;
    } else {
      user = {
        ...defaultBuyer,
        name: email ? email.split('@')[0] : 'Vikram Mehta',
        email: email || 'collector@dcltr.in'
      };
    }

    const generatedToken = `dcltr_token_${user.role}_${Date.now()}`;
    setCurrentUser(user);
    setToken(generatedToken);
    setActivePage('home');
    return user;
  };

  // Quick Demo Login for convenient testing on any Auth page
  const loginWithDemo = (role = 'buyer') => {
    const user = role === 'admin' ? defaultAdmin : role === 'seller' ? defaultSeller : defaultBuyer;
    const generatedToken = `dcltr_token_${user.role}_${Date.now()}`;
    setCurrentUser(user);
    setToken(generatedToken);
    setActivePage('home');
    return user;
  };

  // Register / Onboard handler
  const register = async (formData) => {
    const role = formData.role || (activeSubdomain === 'seller' ? 'seller' : 'buyer');
    const newUser = {
      id: `usr-${Date.now()}`,
      name: formData.name || 'Collector Member',
      email: formData.email,
      phone: formData.phone || '+91 98765 00000',
      role: role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      kycStatus: role === 'seller' ? 'verified' : 'verified',
      trustTier: role === 'seller' ? 'Tier 2 (Verified Fragrance Collector)' : 'Verified Buyer',
      upiId: formData.upiId || 'payout@okhdfcbank',
      salesCount: 0,
      rating: 5.0,
      walletBalance: 0,
      escrowLocked: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const generatedToken = `dcltr_token_${newUser.role}_${Date.now()}`;
    setCurrentUser(newUser);
    setToken(generatedToken);
    setActivePage('home');
    return newUser;
  };

  // Logout handler — cleanly clears state and session
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('dcltr_current_user');
    localStorage.removeItem('dcltr_logged_in');
    localStorage.removeItem('dcltr_token');
    setActivePage('home');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || 'guest',
        isAuthenticated: Boolean(currentUser),
        token,
        activeSubdomain,
        activePage,
        setActivePage,
        accountTab,
        setAccountTab,
        switchSubdomain,
        login,
        loginWithDemo,
        register,
        logout,
        defaultBuyer,
        defaultSeller,
        defaultAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
