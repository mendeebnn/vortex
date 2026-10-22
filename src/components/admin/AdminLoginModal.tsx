import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginAdmin,
    storefrontConfig,
    activeView,
    isAdminAuthenticated,
    navigateToHome,
  } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2500);
    } else {
      setPassword('');
      setError(false);
    }
  };

  const handleQuickUnlock = () => {
    const defaultPass = storefrontConfig.adminPassword || 'admin';
    setPassword(defaultPass);
    loginAdmin(defaultPass);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setError(false);
    setPassword('');
    if (activeView === 'admin' && !isAdminAuthenticated) {
      navigateToHome();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 text-left animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A] cursor-pointer transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
              VOTEX Brand Portal
            </h2>
            <p className="text-xs font-mono text-[#737373]">
              Admin & Management Access
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
              Enter Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Password (default: admin)"
                className={`w-full pl-3.5 pr-10 py-3 bg-[#F7F7F7] border text-xs font-mono text-[#0A0A0A] placeholder-[#737373] focus:outline-none transition-colors ${
                  error
                    ? 'border-rose-500 bg-rose-50/30'
                    : 'border-[#E5E5E5] focus:border-[#0A0A0A]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0A0A0A] p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-mono">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Password buruu baina. (Анхны нууц үг: admin)</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.99]"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Discreet Helper with 1-click unlock for the owner */}
        <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] font-mono text-[#737373]">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
            <span>Default: <strong className="text-[#0A0A0A] font-bold">admin</strong></span>
          </div>

          <button
            type="button"
            onClick={handleQuickUnlock}
            className="text-[#0A0A0A] hover:underline font-bold cursor-pointer"
          >
            1-Click Demo Unlock
          </button>
        </div>

      </div>
    </div>
  );
};
