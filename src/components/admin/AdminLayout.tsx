import React from 'react';
import {
  Package,
  Layers,
  LayoutTemplate,
  ShoppingBag,
  Sliders,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    setActiveView,
    storefrontConfig,
    orders,
    products,
    resetAllToDefault,
  } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const navItems: { tab: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { tab: 'products', label: 'Products', icon: Package, badge: products.length },
    { tab: 'collections', label: 'Collections', icon: Layers },
    { tab: 'storefront', label: 'Storefront Editor', icon: LayoutTemplate },
    { tab: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { tab: 'settings', label: 'Store Settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#0A0A0A] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A] text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Store indicator */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black font-brand uppercase tracking-widest bg-white text-[#0A0A0A] px-2 py-0.5 rounded">
              ADMIN
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-wide">
                {storefrontConfig.storeName}
              </span>
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">
                Shopify-Inspired Core
              </span>
            </div>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo products and settings to default?')) {
                  resetAllToDefault();
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#737373] hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={() => setActiveView('store')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0A0A0A] hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>View Public Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-t border-neutral-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = adminTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setAdminTab(item.tab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer shrink-0 border-b-2 ${
                  active
                    ? 'border-white text-white font-bold bg-neutral-900/60'
                    : 'border-transparent text-[#737373] hover:text-neutral-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.tab === 'orders' && pendingOrdersCount > 0
                        ? 'bg-amber-400 text-black'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {children}
      </main>
    </div>
  );
};
