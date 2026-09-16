import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SubdomainSelectorBar() {
  const {
    activeSubdomain,
    currentUser,
    isAuthenticated,
    logout,
    setActivePage
  } = useAuth();

  // Subdomain label for display
  const subdomainLabel = {
    marketplace: 'dcltr.in',
    seller: 'seller.dcltr.in',
    admin: 'admin.dcltr.in',
  }[activeSubdomain] || 'dcltr.in';

  const subdomainColor = {
    marketplace: 'bg-emerald-500',
    seller: 'bg-amber-500',
    admin: 'bg-purple-600',
  }[activeSubdomain] || 'bg-emerald-500';

  return (
    <div className="w-full bg-[#09090B] text-white text-xs border-b border-gray-800 px-3 sm:px-6 py-2 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">

        {/* Left: Current subdomain indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${subdomainColor} shrink-0`} />
          <span className="text-[11px] font-bold text-gray-300 font-mono">{subdomainLabel}</span>
          {activeSubdomain !== 'marketplace' && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-gray-800 text-gray-400">
              {activeSubdomain}
            </span>
          )}
        </div>

        {/* Right: User auth status */}
        <div className="flex items-center gap-3 text-xs">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-gray-900 px-2.5 py-1 rounded-full border border-gray-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover border border-gray-700"
                />
                <span className="font-bold text-gray-200 text-[11px] max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-gray-800 text-gray-400 font-mono">
                  {currentUser.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="text-gray-400 hover:text-white text-[11px] font-bold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('login')}
                className="text-gray-300 hover:text-white font-bold text-xs"
              >
                Sign In
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => setActivePage('register')}
                className="px-3 py-1 rounded-full bg-ink-950 text-white font-bold text-xs shadow-sm hover:bg-ink-800 transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
