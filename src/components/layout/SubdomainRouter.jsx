import React from 'react';
import { useAuth } from '../../context/AuthContext';
import BuyerAuthPage from '../../pages/auth/BuyerAuthPage';
import SellerAuthPage from '../../pages/auth/SellerAuthPage';
import AdminAuthPage from '../../pages/auth/AdminAuthPage';
import SellerDashboardPage from '../../pages/seller/SellerDashboardPage';
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage';
import BuyerAccountPage from '../../pages/buyer/BuyerAccountPage';
import TermsPage from '../../pages/legal/TermsPage';
import PrivacyPolicyPage from '../../pages/legal/PrivacyPolicyPage';
import RefundPolicyPage from '../../pages/legal/RefundPolicyPage';
import ShippingPolicyPage from '../../pages/legal/ShippingPolicyPage';
import ContactUsPage from '../../pages/legal/ContactUsPage';

const LEGAL_PAGES = {
  terms: TermsPage,
  privacy: PrivacyPolicyPage,
  'refund-policy': RefundPolicyPage,
  'shipping-policy': ShippingPolicyPage,
  contact: ContactUsPage,
};

export default function SubdomainRouter({ children }) {
  const { activeSubdomain, activePage, isAuthenticated, currentUser } = useAuth();

  // 0. Public Legal & Support Pages (reachable from any subdomain)
  const LegalPage = LEGAL_PAGES[activePage];
  if (LegalPage) {
    return <LegalPage />;
  }

  // 1. Admin Subdomain (admin.dcltr.in)
  if (activeSubdomain === 'admin') {
    if (!isAuthenticated || currentUser?.role !== 'admin' || activePage === 'login') {
      return <AdminAuthPage />;
    }
    return <AdminDashboardPage />;
  }

  // 2. Seller Subdomain (seller.dcltr.in)
  if (activeSubdomain === 'seller') {
    if (!isAuthenticated || currentUser?.role !== 'seller' || activePage === 'login' || activePage === 'register') {
      return <SellerAuthPage />;
    }
    return <SellerDashboardPage />;
  }

  // 3. Buyer Marketplace (dcltr.in)
  if (activePage === 'login' || activePage === 'register') {
    return <BuyerAuthPage />;
  }

  if (activePage === 'account') {
    return <BuyerAccountPage />;
  }

  // Default Storefront
  return children;
}
