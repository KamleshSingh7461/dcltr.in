import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle, X } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

// Reusable password input with show/hide toggle
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

// Forgot password — 3 step flow: enter email → OTP sent (simulated) → success
function ForgotPasswordFlow({ onBack }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset' | 'done'
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
          <p className="text-xs text-gray-500 mt-1">Your password has been updated successfully.</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs transition-all"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </button>

      <div className="text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-black text-gray-900">
          {step === 'email' ? 'Forgot Password?' : step === 'otp' ? 'Check Your Email' : 'Set New Password'}
        </h3>
        <p className="text-xs text-gray-500">
          {step === 'email'
            ? "Enter your registered email — we'll send a one-time code."
            : step === 'otp'
            ? `We sent a 6-digit OTP to ${email}. Enter it below.`
            : 'Choose a strong new password for your account.'}
        </p>
      </div>

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Registered Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
              placeholder="collector@dcltr.in"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all"
          >
            {loading ? 'Sending OTP...' : 'Send Reset OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">6-Digit OTP</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono text-center tracking-[0.4em] text-base font-bold focus:border-gray-900 focus:bg-white focus:outline-none"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}
            className="w-full text-center text-gray-400 hover:text-gray-700 font-bold text-xs transition-colors"
          >
            Resend OTP
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="space-y-4 text-xs">
          <PasswordInput
            label="New Password"
            id="new-password-buyer"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />
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
          <button
            type="submit"
            disabled={loading || newPassword.length < 8}
            className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all disabled:opacity-60"
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function BuyerAuthPage() {
  const { login, register, setActivePage, switchSubdomain } = useAuth();
  const goBack = () => setActivePage('home');
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password, role: 'buyer' });
      } else {
        await register({ name, email, password, phone, role: 'buyer' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F8F9FA]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6 relative">

        {/* Close / Back to marketplace */}
        <button
          type="button"
          onClick={goBack}
          title="Continue browsing without signing in"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {mode === 'forgot' ? (
          <ForgotPasswordFlow onBack={() => setMode('login')} />
        ) : (
          <>
            {/* Brand Header */}
            <div className="text-center space-y-2">
              <img src={logoImg} alt="dcltr.in" className="h-16 mx-auto object-contain" />
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                Buyer &amp; Collector Portal
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {mode === 'login' ? 'Welcome to dcltr.in' : 'Create Collector Account'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {mode === 'login'
                  ? 'Sign in to place escrow-protected bids and track vintage flacons.'
                  : 'Join over 30,000 verified fragrance enthusiasts with 48-hour inspection protection.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-gray-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
                      placeholder="e.g. Vikram Mehta"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mobile Phone (for OTP &amp; Delivery)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono focus:border-gray-900 focus:bg-white focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none"
                  placeholder="collector@dcltr.in"
                />
              </div>

              <PasswordInput
                label="Password"
                id="password-buyer"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              {/* Forgot password link — only on sign in */}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all mt-2"
              >
                {loading
                  ? 'Authenticating...'
                  : mode === 'login'
                  ? 'Sign In to Marketplace'
                  : 'Create Account'}
              </button>
            </form>

            {/* Footer links */}
            <div className="pt-4 border-t border-gray-100 space-y-3 text-xs text-center">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 mx-auto text-gray-500 hover:text-gray-900 font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue browsing without signing in
              </button>
              <div className="text-gray-300">·</div>
              <div className="text-gray-500">Want to sell high-end fragrances?</div>
              <button
                type="button"
                onClick={() => switchSubdomain('seller')}
                className="text-amber-800 font-bold hover:underline"
              >
                Go to Seller Onboarding (seller.dcltr.in) →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
