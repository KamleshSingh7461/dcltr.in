import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

function PasswordInput({ value, onChange, placeholder = '••••••••', label, id }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-bold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={onChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-10 text-gray-900 font-mono focus:border-gray-900 focus:bg-white focus:outline-none text-xs"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordFlow({ onBack }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('reset'); }, 1000);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('done'); }, 1200);
  };

  if (step === 'done') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-black text-gray-900">Password Reset!</h3>
          <p className="text-xs text-gray-500 mt-1">Your seller account password has been updated.</p>
        </div>
        <button type="button" onClick={onBack} className="w-full py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs transition-all">
          Back to Seller Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </button>

      <div className="text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Mail className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <h3 className="text-lg font-black text-gray-900">
          {step === 'email' ? 'Forgot Password?' : step === 'otp' ? 'Check Your Email' : 'Set New Password'}
        </h3>
        <p className="text-xs text-gray-500">
          {step === 'email'
            ? "Enter your registered seller email — we'll send a one-time code."
            : step === 'otp'
            ? `We sent a 6-digit OTP to ${email}. Enter it below.`
            : 'Choose a strong new password for your seller account.'}
        </p>
      </div>

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Registered Seller Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
              placeholder="seller@dcltr.in"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all">
            {loading ? 'Sending OTP...' : 'Send Reset OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">6-Digit OTP</label>
            <input
              type="text" required maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono text-center tracking-[0.4em] text-base font-bold focus:border-gray-900 focus:bg-white focus:outline-none"
              placeholder="000000"
            />
          </div>
          <button type="submit" disabled={loading || otp.length < 6} className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }} className="w-full text-center text-gray-400 hover:text-gray-700 font-bold text-xs transition-colors">
            Resend OTP
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="space-y-4 text-xs">
          <PasswordInput label="New Password" id="new-password-seller" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" />
          {newPassword.length > 0 && (
            <div className="flex gap-1 mt-1">
              {['Length (8+)', 'Uppercase', 'Number', 'Symbol'].map((req, i) => {
                const checks = [newPassword.length >= 8, /[A-Z]/.test(newPassword), /\d/.test(newPassword), /[^A-Za-z0-9]/.test(newPassword)];
                return (
                  <span key={req} className={`flex-1 text-center text-[9px] font-bold py-0.5 rounded ${checks[i] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {req}
                  </span>
                );
              })}
            </div>
          )}
          <button type="submit" disabled={loading || newPassword.length < 8} className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all disabled:opacity-60">
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function SellerAuthPage() {
  const { login, register, switchSubdomain } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [govtIdType, setGovtIdType] = useState('Aadhaar Card');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password, role: 'seller' });
      } else {
        await register({ name, email, password, phone, upiId, govtIdType, govtIdNumber, role: 'seller' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F8F9FA]">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">

        {mode === 'forgot' ? (
          <ForgotPasswordFlow onBack={() => setMode('login')} />
        ) : (
          <>
            {/* Brand Header */}
            <div className="text-center space-y-2">
              <img src={logoImg} alt="dcltr.in" className="h-16 mx-auto object-contain" />
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                seller.dcltr.in • Seller Command Portal
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {mode === 'login' ? 'Sign In to Seller Command' : 'Verified Seller Onboarding'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {mode === 'login'
                  ? 'Access your inventory, fulfill orders with weight scale manifests, and withdraw payouts.'
                  : 'Complete identity & payout verification to sell luxury perfumes with 100% escrow protection.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-gray-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Seller Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Onboard New Seller
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Seller / Business Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
                  placeholder="seller@dcltr.in"
                />
              </div>

              <PasswordInput
                label="Password"
                id="password-seller"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              {/* Forgot password — login only */}
              {mode === 'login' && (
                <div className="text-right -mt-2">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === 'register' && (
                <>
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <div className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">
                      KYC &amp; Payout Registration (Anti-Fraud Requirement)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Seller Name / House</label>
                        <input
                          type="text" required value={name} onChange={e => setName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
                          placeholder="e.g. Jean-Paul Connoisseur"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Phone (OTP Verified)</label>
                        <input
                          type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono focus:border-gray-900 focus:bg-white focus:outline-none"
                          placeholder="+91 99887 66554"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Govt ID Type</label>
                        <select
                          value={govtIdType} onChange={e => setGovtIdType(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:border-gray-900 focus:outline-none"
                        >
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="PAN Card">PAN Card</option>
                          <option value="Passport">Passport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">ID Number</label>
                        <input
                          type="text" required value={govtIdNumber} onChange={e => setGovtIdNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono focus:border-gray-900 focus:bg-white focus:outline-none"
                          placeholder="ID Number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Default Payout UPI / Bank Account</label>
                      <input
                        type="text" required value={upiId} onChange={e => setUpiId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono focus:border-gray-900 focus:bg-white focus:outline-none"
                        placeholder="e.g. collector@okhdfcbank"
                      />
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2">
                      <input
                        type="checkbox" id="terms-seller" checked={agreedToTerms}
                        onChange={e => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 accent-gray-900" required
                      />
                      <label htmlFor="terms-seller" className="text-[11px] text-amber-900 leading-snug cursor-pointer">
                        I agree to the <strong>48-Hour Escrow Policy</strong> and commit to providing accurate scale weight logs (grams) and authentic batch stamps on every order.
                      </label>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all mt-2"
              >
                {loading ? 'Authenticating...' : mode === 'login' ? 'Access Seller Command' : 'Complete Seller Onboarding'}
              </button>
            </form>

            {/* Quick Back to Buyer */}
            <div className="pt-4 border-t border-gray-100 text-center space-y-2 text-xs">
              <div className="text-gray-500">Looking to browse &amp; buy fragrances?</div>
              <button
                type="button"
                onClick={() => switchSubdomain('marketplace')}
                className="text-gray-900 font-bold hover:underline"
              >
                ← Back to Main Marketplace (dcltr.in)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
