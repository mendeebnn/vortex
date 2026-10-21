import React, { useState } from 'react';
import { Save, Sliders, RotateCcw, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { storefrontConfig, updateStorefrontConfig, resetAllToDefault, showToast } = useApp();

  const [formData, setFormData] = useState({
    instagramHandle: storefrontConfig.instagramHandle,
    instagramUrl: storefrontConfig.instagramUrl,
    phoneHotline: storefrontConfig.phoneHotline,
    storeAddress: storefrontConfig.storeAddress,
    currency: storefrontConfig.currency,
    freeShippingThreshold: storefrontConfig.freeShippingThreshold,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStorefrontConfig(formData);
    showToast('Store settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
          Store Settings
        </h1>
        <p className="text-xs text-[#737373]">
          Configure regional contact channels, currency options, and delivery thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#E5E5E5] p-6 shadow-sm space-y-5 text-xs">
        <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
          <Sliders className="w-4 h-4" />
          <span>Regional & Contact Information</span>
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
              value={formData.freeShippingThreshold}
              onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
            />
          </div>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="pt-4 border-t border-[#E5E5E5] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 flex items-center gap-2"
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
          onClick={() => {
            if (window.confirm('Are you sure you want to restore demo factory settings?')) {
              resetAllToDefault();
            }
          }}
          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-mono uppercase font-bold flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
};
