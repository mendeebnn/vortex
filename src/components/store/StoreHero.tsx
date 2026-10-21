import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreHero: React.FC = () => {
  const { storefrontConfig, navigateToShop } = useApp();

  return (
    <section className="relative w-full border-b border-[#E5E5E5] bg-[#F7F7F7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-xs font-mono tracking-widest uppercase text-[#737373] mb-3">
              {storefrontConfig.storeCategoryLabel || 'CURATED COLLECTION'}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A0A0A] font-brand leading-[1.05] mb-5 text-balance">
              {storefrontConfig.heroHeadline}
            </h1>

            <p className="text-sm sm:text-base text-[#737373] leading-relaxed max-w-lg mb-8">
              {storefrontConfig.heroSubtitle}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateToShop(storefrontConfig.featuredCollectionSlug)}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <span>{storefrontConfig.heroCtaText || 'SHOP COLLECTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateToShop()}
                className="inline-flex items-center gap-2 px-6 py-4 bg-transparent hover:bg-neutral-200/50 text-[#0A0A0A] border border-[#E5E5E5] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                <span>ALL PRODUCTS</span>
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-white border border-[#E5E5E5] overflow-hidden shadow-sm group">
              <img
                src={storefrontConfig.heroImageUrl}
                alt={storefrontConfig.heroHeadline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm border border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
                    FEATURED RELEASE
                  </div>
                  <div className="text-sm font-bold text-[#0A0A0A] font-brand">
                    {storefrontConfig.storeName}
                  </div>
                </div>

                <button
                  onClick={() => navigateToShop(storefrontConfig.featuredCollectionSlug)}
                  className="text-xs font-bold uppercase tracking-wider underline underline-offset-4 text-[#0A0A0A] hover:text-[#737373]"
                >
                  View Drop →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
