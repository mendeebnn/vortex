import React, { useState } from 'react';
import { Save, Sliders, RotateCcw, AlertTriangle, Lock, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { storefrontConfig, updateStorefrontConfig, resetAllToDefault, showToast } = useApp();

  const [formData, setFormData] = useState({
    storeName: storefrontConfig.storeName || 'VOTEX BRAND',
    storeSlug: storefrontConfig.storeSlug || 'votex-brand',
    storeDescription: storefrontConfig.storeDescription || storefrontConfig.aboutText || '',
    instagramHandle: storefrontConfig.instagramHandle || 'votex_brand_',
    instagramUrl: storefrontConfig.instagramUrl || 'https://www.instagram.com/votex_brand_/',
    phoneHotline: storefrontConfig.phoneHotline || '8808-3734 / 6012-0999',
    storeAddress: storefrontConfig.storeAddress || 'Khangai Khotkhon 501, Ulaanbaatar',
    currency: storefrontConfig.currency || 'MNT',
    freeShippingThreshold: storefrontConfig.freeShippingThreshold ?? 200000,
    trackInventory: storefrontConfig.trackInventory ?? true,
    storeStatus: storefrontConfig.storeStatus || 'published',
    adminPassword: storefrontConfig.adminPassword || 'admin',
  });

  const [slugError, setSlugError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const validateSlug = (val: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!val.trim()) {
      setSlugError('Store slug cannot be empty');
      return false;
    }
    if (!slugRegex.test(val.trim())) {
      setSlugError('Slug must contain only lowercase letters, numbers, and single hyphens (e.g. votex-brand)');
      return false;
    }
    setSlugError('');
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.storeName.trim()) {
      showToast('Store name cannot be empty', 'error');
      return;
    }

    const isSlugValid = validateSlug(formData.storeSlug);
    if (!isSlugValid) {
      showToast('Invalid store slug. Please fix the error below.', 'error');
      return;
    }

    if (formData.freeShippingThreshold < 0) {
      showToast('Shipping threshold must be 0 or greater', 'error');
      return;
    }

    updateStorefrontConfig({
      ...formData,
      storeName: formData.storeName.trim(),
      storeSlug: formData.storeSlug.trim().toLowerCase(),
      aboutText: formData.storeDescription.trim() || formData.storeName,
    });
    showToast('Store settings, identity & security saved successfully!');
  };

  const handleResetData = () => {
    if (confirmReset) {
      resetAllToDefault();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
          Store Settings
        </h1>
        <p className="text-xs text-[#737373]">
          Configure brand identifiers, store publication state, inventory preferences, currency, and security password.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#E5E5E5] p-6 shadow-sm space-y-5 text-xs">
        
        {/* Section 1: Store Brand & Identity */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <Sliders className="w-4 h-4" />
            <span>Store Brand & URL Identity</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="e.g. VOTEX BRAND"
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Store Slug Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.storeSlug}
                onChange={(e) => {
                  const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setFormData({ ...formData, storeSlug: cleaned });
                  validateSlug(cleaned);
                }}
                placeholder="e.g. votex-brand"
                className={`w-full px-3.5 py-2.5 bg-[#F7F7F7] border font-mono text-xs focus:outline-none ${
                  slugError ? 'border-rose-500 focus:border-rose-500 text-rose-700' : 'border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A]'
                }`}
              />
              {slugError ? (
                <span className="text-[10px] text-rose-600 mt-1 block">{slugError}</span>
              ) : (
                <span className="text-[10px] font-mono text-[#737373] mt-1 block">
                  Store handle: /{formData.storeSlug}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
              Store Description / Bio
            </label>
            <textarea
              rows={2}
              value={formData.storeDescription}
              onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
              placeholder="Short description of store brand, winter products, and philosophy..."
              className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Store Status & Inventory Tracking */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] pb-3">
            Publication Status & Operations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Storefront Publication Status
              </label>
              <select
                value={formData.storeStatus}
                onChange={(e) => setFormData({ ...formData, storeStatus: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
              >
                <option value="published">● Published (Live to Public)</option>
                <option value="maintenance">▲ Maintenance Mode</option>
                <option value="draft">○ Private Preview (Staff Only)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Stock & Inventory Tracking
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer font-bold text-[#0A0A0A]">
                <input
                  type="checkbox"
                  checked={formData.trackInventory}
                  onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                  className="rounded border-[#E5E5E5] w-4 h-4 text-[#0A0A0A] focus:ring-0 cursor-pointer"
                />
                <span>Enable Real-Time Inventory Tracking</span>
              </label>
              <span className="text-[10px] text-[#737373] block mt-1">
                When enabled, products show real stock counts and disable checkout when stock is 0.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Currency & Delivery */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] pb-3">
            Currency & Courier Threshold
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Store Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
              >
                <option value="MNT">Mongolian Tugrik (₮ MNT)</option>
                <option value="USD">US Dollar ($ USD)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Free Courier Delivery Threshold *
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social & Contact */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] pb-3">
            Contact & Social Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Customer Hotlines
              </label>
              <input
                type="text"
                value={formData.phoneHotline}
                onChange={(e) => setFormData({ ...formData, phoneHotline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Store Pickup Location
              </label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Security Password Setting */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2 pb-3">
            <Lock className="w-4 h-4" />
            <span>Admin Security & Password</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Admin Dashboard Password *
              </label>
              <input
                type="text"
                required
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                placeholder="e.g. admin or custom password"
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono font-bold focus:outline-none"
              />
              <span className="text-[11px] font-mono text-[#737373] mt-1 block">
                Current default is: <strong>admin</strong> (or <strong>votex</strong>)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E5E5] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white border border-rose-200 p-6 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Demo Data Reset</span>
        </h3>
        <p className="text-xs text-[#737373] mb-4">
          Reset all products, collections, storefront customization, orders, and bag items to the pristine factory demo default.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className={`px-4 py-2 border text-xs font-mono uppercase font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            confirmReset
              ? 'bg-rose-700 text-white border-rose-700 animate-pulse'
              : 'border-rose-300 text-rose-700 hover:bg-rose-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{confirmReset ? 'Click to Confirm Reset' : 'Reset to Defaults'}</span>
        </button>
      </div>
    </div>
  );
};
