import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StoreHeader } from './components/store/StoreHeader';
import { StoreHero } from './components/store/StoreHero';
import { StoreFeaturedSection } from './components/store/StoreFeaturedSection';
import { StoreCollectionList } from './components/store/StoreCollectionList';
import { StoreNewArrivals } from './components/store/StoreNewArrivals';
import { StoreAboutSection } from './components/store/StoreAboutSection';
import { StoreInstagramSection } from './components/store/StoreInstagramSection';
import { StorePromoMarquee } from './components/store/StorePromoMarquee';
import { StoreTrustPillars } from './components/store/StoreTrustPillars';
import { StoreProductList } from './components/store/StoreProductList';
import { StoreProductDetail } from './components/store/StoreProductDetail';
import { StoreCartDrawer } from './components/store/StoreCartDrawer';
import { StoreCheckoutModal } from './components/store/StoreCheckoutModal';
import { StoreSearchModal } from './components/store/StoreSearchModal';
import { StoreFooter } from './components/store/StoreFooter';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminCollections } from './components/admin/AdminCollections';
import { AdminStorefrontEditor } from './components/admin/AdminStorefrontEditor';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminSettings } from './components/admin/AdminSettings';

import {
  Check,
  Info,
  AlertCircle,
  Settings,
  Package,
  LayoutTemplate,
  ShoppingBag,
  Plus,
  Layers,
  ChevronUp,
} from 'lucide-react';

function StoreRouter() {
  const {
    activeView,
    setActiveView,
    adminTab,
    setAdminTab,
    openAdminTab,
    storePage,
    storefrontConfig,
    orders,
    products,
    toasts,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<{
    product: any;
    size: string;
    color: string;
    quantity: number;
  } | null>(null);

  const [isAdminQuickBarOpen, setIsAdminQuickBarOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleDirectCheckout = (product: any, size: string, color: string, quantity: number) => {
    setDirectCheckoutItem({ product, size, color, quantity });
    setIsCheckoutOpen(true);
  };

  // Render Private Admin Dashboard
  if (activeView === 'admin') {
    return (
      <AdminLayout>
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'collections' && <AdminCollections />}
        {adminTab === 'storefront' && <AdminStorefrontEditor />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'settings' && <AdminSettings />}

        {/* Admin Toast Stack */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto px-4 py-3 bg-[#0A0A0A] text-white border border-neutral-800 shadow-2xl flex items-center gap-2.5 text-xs font-mono backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-150"
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-neutral-400 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="leading-snug">{toast.text}</span>
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  // Render Public Storefront
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col font-sans selection:bg-[#0A0A0A] selection:text-white">
      {/* Public Store Header */}
      <StoreHeader onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Public Pages */}
      <main className="flex-1">
        {storePage === 'home' && (
          <>
            {storefrontConfig.homepageSections
              .filter((sec) => sec.enabled)
              .map((sec) => {
                switch (sec.type) {
                  case 'hero':
                    return <StoreHero key={sec.id} />;
                  case 'promo_marquee':
                    return (
                      <StorePromoMarquee
                        key={sec.id}
                        text={storefrontConfig.promoMarqueeText}
                      />
                    );
                  case 'featured':
                    return <StoreFeaturedSection key={sec.id} />;
                  case 'collections':
                    return <StoreCollectionList key={sec.id} />;
                  case 'new_arrivals':
                    return <StoreNewArrivals key={sec.id} />;
                  case 'trust_pillars':
                    return <StoreTrustPillars key={sec.id} />;
                  case 'about':
                    return <StoreAboutSection key={sec.id} />;
                  case 'instagram':
                    return <StoreInstagramSection key={sec.id} />;
                  default:
                    return null;
                }
              })}
          </>
        )}

        {storePage === 'shop' && <StoreProductList />}

        {storePage === 'collections' && (
          <>
            <StoreCollectionList />
            <StoreProductList />
          </>
        )}

        {storePage === 'product' && (
          <StoreProductDetail onDirectCheckout={handleDirectCheckout} />
        )}
      </main>

      {/* Public Footer */}
      <StoreFooter />

      {/* Cart Drawer */}
      <StoreCartDrawer
        onOpenCheckout={() => {
          setDirectCheckoutItem(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <StoreCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        directItem={directCheckoutItem}
      />

      {/* Search Modal */}
      <StoreSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Connected Floating Admin Bar in Bottom Corner */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        {/* Quick Drawer if expanded */}
        {isAdminQuickBarOpen && (
          <div className="bg-[#0A0A0A] text-white border border-neutral-800 shadow-2xl p-3 rounded-lg flex flex-col gap-1.5 text-xs font-mono w-56 animate-in slide-in-from-bottom-2 fade-in duration-150">
            <div className="text-[10px] text-neutral-400 uppercase tracking-widest px-2 py-1 border-b border-neutral-800 flex items-center justify-between">
              <span>ADMIN CONTROLS</span>
              <span className="text-emerald-400">● LIVE</span>
            </div>

            <button
              onClick={() => openAdminTab('products')}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-800 rounded text-left cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-neutral-400" />
                <span>Products</span>
              </span>
              <span className="text-[10px] bg-neutral-800 px-1.5 py-0.2 rounded font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => openAdminTab('collections')}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-800 rounded text-left cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Collections</span>
              </span>
            </button>

            <button
              onClick={() => openAdminTab('storefront')}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-800 rounded text-left cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <LayoutTemplate className="w-3.5 h-3.5 text-neutral-400" />
                <span>Storefront Editor</span>
              </span>
            </button>

            <button
              onClick={() => openAdminTab('orders')}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-800 rounded text-left cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                <span>Orders</span>
              </span>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold">
                  {pendingOrdersCount} new
                </span>
              )}
            </button>

            <button
              onClick={() => openAdminTab('settings')}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-800 rounded text-left cursor-pointer transition-colors border-t border-neutral-800/80 pt-2"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>Store Settings</span>
              </span>
            </button>
          </div>
        )}

        {/* Floating Admin Trigger Pill */}
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] text-white border border-neutral-700 shadow-2xl rounded-full p-1 pl-3.5 group">
          <button
            onClick={() => openAdminTab('storefront')}
            className="flex items-center gap-2 text-xs font-mono tracking-wider cursor-pointer hover:text-neutral-300"
            title="Open Admin Dashboard"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-45 transition-transform" />
            <span className="font-bold">ADMIN</span>
            {pendingOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setIsAdminQuickBarOpen(!isAdminQuickBarOpen)}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full cursor-pointer ml-1"
            title={isAdminQuickBarOpen ? 'Collapse menu' : 'Expand menu'}
          >
            <ChevronUp
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isAdminQuickBarOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Store Toast Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto px-4 py-3 bg-[#0A0A0A] text-white border border-neutral-800 shadow-2xl flex items-center gap-2.5 text-xs font-mono backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-150"
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-neutral-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="leading-snug">{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StoreRouter />
    </AppProvider>
  );
}
