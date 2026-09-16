import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function PolicyLayout({ title, tagline, lastUpdated, children }) {
  const { setActivePage } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => setActivePage('home')}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          ← Back to Marketplace
        </button>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="pb-6 mb-6 border-b border-gray-100 space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
            {tagline && <p className="text-xs text-gray-500 font-medium">{tagline}</p>}
            <p className="text-[11px] text-gray-400 font-mono pt-1">Last Updated: {lastUpdated}</p>
          </div>

          <div className="space-y-7">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section className="space-y-2.5">
      <h2 className="text-base font-extrabold text-gray-900 tracking-tight">{title}</h2>
      <div className="space-y-2.5 text-sm text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

export function SubHeading({ children }) {
  return <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pt-1">{children}</h3>;
}
