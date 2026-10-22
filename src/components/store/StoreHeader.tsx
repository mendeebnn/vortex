import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StoreHeaderProps {
  onOpenSearch: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onOpenSearch }) => {
  const {
    storefrontConfig,
    collections,
    cartCount,
    setIsCartOpen,
    setActiveView,
    navigateToHome,
    navigateToShop,
    navigateToCollections,
    storePage,
    selectedCollectionSlug,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] transition-colors">
      {/* Top Announcement Bar if configured in Admin */}
      {storefrontConfig.announcementActive && storefrontConfig.announcementText && (
        <div className="bg-[#0A0A0A] text-white text-[11px] font-mono tracking-wider uppercase py-2 px-4 text-center">
          <span>{storefrontConfig.announcementText}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Left: Store Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={navigateToHome}
            className="text-left cursor-pointer group focus-visible:outline-none"
          >
            {storefrontConfig.logoType === 'image' && storefrontConfig.logoImageUrl ? (
              <img
                src={storefrontConfig.logoImageUrl}
                alt={storefrontConfig.storeName}
                className="h-8 max-w-[160px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-widest text-[#0A0A0A] uppercase font-brand">
                  {storefrontConfig.logoText || storefrontConfig.storeName}
                </span>
              </div>
            )}
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-semibold text-[#0A0A0A]">
            <button
              onClick={navigateToHome}
              className={`hover:text-[#737373] transition-colors cursor-pointer ${
                storePage === 'home' ? 'text-[#0A0A0A] underline underline-offset-8 decoration-2' : 'text-[#737373]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateToShop()}
              className={`hover:text-[#737373] transition-colors cursor-pointer ${
                storePage === 'shop' && !selectedCollectionSlug ? 'text-[#0A0A0A] underline underline-offset-8 decoration-2' : 'text-[#737373]'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={navigateToCollections}
              className={`hover:text-[#737373] transition-colors cursor-pointer ${
                storePage === 'collections' ? 'text-[#0A0A0A] underline underline-offset-8 decoration-2' : 'text-[#737373]'
              }`}
            >
              Collections
            </button>

            {/* Configured Collection Links */}
            {collections.slice(0, 3).map((col) => (
              <button
                key={col.id}
                onClick={() => navigateToShop(col.slug)}
                className={`hover:text-[#737373] transition-colors cursor-pointer hidden lg:inline-block ${
                  storePage === 'shop' && selectedCollectionSlug === col.slug ? 'text-[#0A0A0A] underline underline-offset-8 decoration-2' : 'text-[#737373]'
                }`}
              >
                {col.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Search, Instagram & Cart */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#0A0A0A] hover:text-[#737373] transition-colors cursor-pointer rounded-full hover:bg-[#F7F7F7]"
            aria-label="Search products"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Instagram link */}
          <a
            href={storefrontConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-[#737373] hover:text-[#0A0A0A] transition-colors"
          >
            <span>@{storefrontConfig.instagramHandle}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Bag"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0A0A0A] text-white hover:bg-neutral-800 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            <span className="text-xs font-bold font-mono tabular-nums">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0A0A0A] hover:bg-[#F7F7F7] rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-4 py-6 space-y-4 animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-[#0A0A0A]">
            <button
              onClick={() => {
                navigateToHome();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#737373]"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigateToShop();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#737373]"
            >
              Shop All
            </button>
            <button
              onClick={() => {
                navigateToCollections();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#737373]"
            >
              Collections
            </button>

            <div className="pt-2 border-t border-[#E5E5E5] space-y-2">
              <span className="text-[11px] font-mono text-[#737373] tracking-widest block">
                COLLECTIONS
              </span>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    navigateToShop(col.slug);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left block py-1.5 text-xs text-[#737373] hover:text-[#0A0A0A]"
                >
                  {col.name}
                </button>
              ))}
            </div>
          </nav>

          <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
            <a
              href={storefrontConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[#737373] hover:text-[#0A0A0A] flex items-center gap-1"
            >
              <span>@{storefrontConfig.instagramHandle}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded bg-[#0A0A0A] text-white text-xs font-mono font-medium"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
