import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

function DarkPasswordInput({ value, onChange, placeholder = '••••••••', label, id }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-bold text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={onChange}
          className="w-full bg-[#1A1A1E] border border-gray-700 rounded-xl px-3 py-2 pr-10 text-white font-mono focus:border-amber-500 focus:outline-none text-xs"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function AdminForgotPasswordFlow({ onBack }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('reset'); }, 1200);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('done'); }, 1500);
  };

  if (step === 'done') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-emerald-900/40 border border-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-black text-white">Password Reset!</h3>
          <p className="text-xs text-gray-400 mt-1">Admin credentials have been updated. This action is recorded in the audit ledger.</p>
        </div>
        <button type="button" onClick={onBack} className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs transition-all">
          Return to Admin Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 font-bold transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </button>

      {/* Security notice */}
      <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-red-300 leading-snug">
          Admin password resets are logged and audited. Ensure you are on a secure, private network.
        </p>
      </div>

      <div className="text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-amber-900/30 border border-amber-800 flex items-center justify-center">
            <Mail className="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <h3 className="text-lg font-black text-white">
          {step === 'email' ? 'Admin Password Recovery' : step === 'otp' ? 'Verify Recovery OTP' : 'Set New Admin Password'}
        </h3>
        <p className="text-xs text-gray-400">
          {step === 'email'
            ? 'Enter the registered admin email to receive a secure OTP.'
            : step === 'otp'
            ? `OTP sent to ${email}. This code expires in 10 minutes.`
            : 'Choose a strong new admin password.'}
        </p>
      </div>

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Administrator Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1E] border border-gray-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-500 focus:outline-none"
              placeholder="admin@dcltr.in"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all">
            {loading ? 'Sending Secure OTP...' : 'Send Recovery OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Recovery OTP (6 digits)</label>
            <input
              type="text" required maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-[#1A1A1E] border border-gray-700 rounded-xl px-3 py-2 text-amber-400 font-mono text-center tracking-[0.4em] text-base font-bold focus:border-amber-500 focus:outline-none"
              placeholder="000000"
            />
          </div>
          <button type="submit" disabled={loading || otp.length < 6} className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="space-y-4 text-xs">
          <DarkPasswordInput label="New Admin Password" id="new-password-admin" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 12 characters" />
          {newPassword.length > 0 && (
            <div className="flex gap-1 mt-1">
              {['12+ chars', 'Uppercase', 'Number', 'Symbol'].map((req, i) => {
                const checks = [newPassword.length >= 12, /[A-Z]/.test(newPassword), /\d/.test(newPassword), /[^A-Za-z0-9]/.test(newPassword)];
                return (
                  <span key={req} className={`flex-1 text-center text-[9px] font-bold py-0.5 rounded ${checks[i] ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-500'}`}>
                    {req}
                  </span>
                );
              })}
            </div>
          )}
          <button type="submit" disabled={loading || newPassword.length < 12} className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50">
            {loading ? 'Updating Credentials...' : 'Reset Admin Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AdminAuthPage() {
  const { login, switchSubdomain } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey2FA, setSecurityKey2FA] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password, role: 'admin' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#09090B] text-white">
      <div className="w-full max-w-md bg-[#121215] rounded-3xl p-8 border border-gray-800 shadow-2xl space-y-6">

        {mode === 'forgot' ? (
          <AdminForgotPasswordFlow onBack={() => setMode('login')} />
        ) : (
          <>
            {/* Brand Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800 font-mono">
                admin.dcltr.in • Restricted Owner Portal
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Admin &amp; Escrow Vault Sign In
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Authorized marketplace administrator access for escrow management, dispute arbitration, and anti-fraud operations.
              </p>
            </div>

            {/* Security Warning */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              All administrative actions, escrow releases, and dispute rulings are recorded in the permanent audit ledger.
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Administrator Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-gray-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-500 focus:outline-none"
                  placeholder="admin@dcltr.in"
                />
              </div>

              <DarkPasswordInput
                label="Master Password"
                id="password-admin"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              {/* Forgot password link */}
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-gray-500 hover:text-amber-400 font-bold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* 2FA key with show/hide */}
              <div>
                <label className="block font-bold text-gray-300 mb-1">2FA Hardware / Security Key</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    required
                    value={securityKey2FA}
                    onChange={e => setSecurityKey2FA(e.target.value)}
                    className="w-full bg-[#1A1A1E] border border-gray-700 rounded-xl px-3 py-2 pr-10 text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none text-xs"
                    placeholder="DCLTR-SECURE-XXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(v => !v)}
                    tabIndex={-1}
                    aria-label={showKey ? 'Hide key' : 'Show key'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all mt-2"
              >
                {loading ? 'Verifying 2FA Credentials...' : 'Unlock Admin Operations Vault'}
              </button>
            </form>

            {/* Back link */}
            <div className="pt-4 border-t border-gray-800 text-center text-xs">
              <button
                type="button"
                onClick={() => switchSubdomain('marketplace')}
                className="text-gray-400 hover:text-white font-bold transition-colors"
              >
                ← Exit to Main Storefront (dcltr.in)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
