import React from 'react';
import { ArrowUp, Instagram, Phone, MapPin, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreFooter: React.FC = () => {
  const {
    storefrontConfig,
    collections,
    navigateToShop,
    navigateToCollections,
    openAdminTab,
  } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Brand Col */}
          <div className="md:col-span-5">
            {storefrontConfig.logoType === 'image' && storefrontConfig.logoImageUrl ? (
              <img
                src={storefrontConfig.logoImageUrl}
                alt={storefrontConfig.storeName}
                style={{ maxHeight: `${storefrontConfig.logoHeight || 32}px` }}
                className="max-w-[180px] object-contain filter invert mb-3"
              />
            ) : (
              <div className="flex items-center gap-2 mb-3 text-white">
                {storefrontConfig.logoSymbol === 'monogram' && (
                  <span className="font-mono text-xs px-1.5 py-0.5 border border-white/80 rounded-xs font-bold leading-none">
                    [V]
                  </span>
                )}
                {storefrontConfig.logoSymbol === 'chevron' && (
                  <span className="font-mono text-xs font-bold leading-none">
                    //
                  </span>
                )}
                {storefrontConfig.logoSymbol === 'diamond' && (
                  <span className="text-xs leading-none">
                    ◆
                  </span>
                )}
                {storefrontConfig.logoSymbol === 'grid' && (
                  <span className="text-[10px] leading-none">
                    ■
                  </span>
                )}
                <span
                  style={{
                    fontFamily: storefrontConfig.logoFontFamily || 'Outfit, sans-serif',
                    letterSpacing: storefrontConfig.logoLetterSpacing || '0.2em',
                    fontWeight: storefrontConfig.logoFontWeight || 900,
                  }}
                  className="text-xl uppercase tracking-widest leading-none select-none"
                >
                  {storefrontConfig.logoText || storefrontConfig.storeName}
                </span>
              </div>
            )}
            <p className="text-xs text-[#737373] max-w-sm leading-relaxed mb-6">
              {storefrontConfig.aboutText}
            </p>

            <div className="flex items-center gap-3">
              <a
                href={storefrontConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`tel:${storefrontConfig.phoneHotline.split('/')[0].trim().replace('-', '')}`}
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#737373]">
              <li>
                <button
                  onClick={() => navigateToShop()}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop All Products
                </button>
              </li>
              {collections.map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => navigateToShop(col.slug)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {col.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info & Admin Access */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">
              STORE DETAILS
            </h4>
            <div className="space-y-2.5 text-xs text-[#737373]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-white mt-0.5 shrink-0" />
                <span>{storefrontConfig.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="font-mono text-neutral-300">{storefrontConfig.phoneHotline}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#737373]">
          <div className="flex items-center flex-wrap gap-x-3">
            <span>© {new Date().getFullYear()} {storefrontConfig.storeName}. All rights reserved.</span>
            <span className="text-neutral-700">·</span>
            {/* Discreet Admin / Staff Link */}
            <button
              onClick={() => openAdminTab('products')}
              className="text-neutral-600 hover:text-neutral-300 inline-flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
              title="Staff / Admin Portal (Password Protected)"
            >
              <Lock className="w-2.5 h-2.5 opacity-50" />
              <span>Admin</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
