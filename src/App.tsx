import React, { useState, useEffect } from 'react';
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
import { AdminLogoStudio } from './components/admin/AdminLogoStudio';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

import { Check, Info, AlertCircle, Lock } from 'lucide-react';

function StoreRouter() {
  const {
    activeView,
    adminTab,
    openAdminTab,
    isAdminAuthenticated,
    setIsLoginModalOpen,
    navigateToHome,
    storePage,
    storefrontConfig,
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

  // Discreet Admin Keyboard shortcut (Alt + A or Ctrl + Shift + A) and URL hash #admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        openAdminTab('products');
      }
    };

    const handleHash = () => {
      if (window.location.hash === '#admin') {
        openAdminTab('products');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [openAdminTab]);

  const handleDirectCheckout = (product: any, size: string, color: string, quantity: number) => {
    setDirectCheckoutItem({ product, size, color, quantity });
    setIsCheckoutOpen(true);
  };

  // Render Password-Protected Private Admin Dashboard
  if (activeView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
          <AdminLoginModal />
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-white">
              <Lock className="w-5 h-5 text-neutral-400" />
            </div>
            <h1 className="text-lg font-black font-brand uppercase tracking-wider">
              VOTEX Admin Portal
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              Private management portal. Enter your password to continue.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2.5 bg-white text-[#0A0A0A] font-bold text-xs uppercase tracking-wider rounded cursor-pointer hover:bg-neutral-200 shadow-sm active:scale-95 transition-all"
              >
                Enter Password
              </button>
              <button
                onClick={() => navigateToHome()}
                className="px-4 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono rounded cursor-pointer transition-colors"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminLayout>
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'collections' && <AdminCollections />}
        {(adminTab === 'storefront' || adminTab === 'store-design') && <AdminStorefrontEditor />}
        {adminTab === 'logo-studio' && <AdminLogoStudio />}
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

  // Render Public Storefront (Clean, Minimal, No Floating Admin Bars)
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

      {/* Public Footer with Discreet Admin link */}
      <StoreFooter />

      {/* Password Protected Admin Login Modal */}
      <AdminLoginModal />

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
