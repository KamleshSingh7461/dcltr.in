import React, { useState } from 'react';
import PolicyLayout, { Section } from '../../components/legal/PolicyLayout';
import { useMarketplace } from '../../context/MarketplaceContext';

export default function ContactUsPage() {
  const { showToast } = useMarketplace();
  const [form, setForm] = useState({ name: '', email: '', orderId: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Message Sent', "Our support team will get back to you within 1-2 business days.", 'success');
    setForm({ name: '', email: '', orderId: '', message: '' });
  };

  return (
    <PolicyLayout
      title="Contact Us"
      tagline="We're here to help with orders, disputes, and general questions"
      lastUpdated="September 14, 2026"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-xs font-bold text-gray-900">General Support</div>
          <a href="mailto:support@dcltr.in" className="text-xs text-amber-800 font-semibold hover:underline">
            support@dcltr.in
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-xs font-bold text-gray-900">Escrow & Dispute Desk</div>
          <a href="mailto:disputes@dcltr.in" className="text-xs text-amber-800 font-semibold hover:underline">
            disputes@dcltr.in
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-xs font-bold text-gray-900">Phone Support</div>
          <div className="text-xs text-gray-600 font-mono">[Support Phone Number]</div>
          <div className="text-[10px] text-gray-400">Mon–Sat, 10 AM – 7 PM IST</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-xs font-bold text-gray-900">Registered Office</div>
          <div className="text-xs text-gray-600 leading-relaxed">
            [Legal Entity Name]<br />
            [Registered Business Address], India
          </div>
        </div>
      </div>

      <Section title="Send Us a Message">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={handleChange('name')}
                placeholder="e.g. Vikram Mehta"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Order ID (optional)</label>
            <input
              type="text"
              value={form.orderId}
              onChange={handleChange('orderId')}
              placeholder="e.g. ord-8831"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 font-mono focus:border-gray-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={handleChange('message')}
              placeholder="How can we help?"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all"
          >
            Send Message
          </button>

          {submitted && (
            <p className="text-[11px] text-emerald-700 font-semibold pt-1">
              Thanks — your message has been received.
            </p>
          )}
        </form>
      </Section>

      <Section title="Grievance Officer">
        <p>
          As required under the Information Technology Act, 2000 and applicable IT Rules, complaints
          regarding content or conduct on the Platform can be escalated to our Grievance Officer at{' '}
          <a href="mailto:grievance@dcltr.in" className="text-amber-800 font-bold hover:underline">
            grievance@dcltr.in
          </a>
          . See our <strong>Privacy Policy</strong> for full details.
        </p>
      </Section>
    </PolicyLayout>
  );
}
