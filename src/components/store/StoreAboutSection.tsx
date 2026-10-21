import React from 'react';
import { Truck, ShieldCheck, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreAboutSection: React.FC = () => {
  const { storefrontConfig } = useApp();

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E5E5] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <div className="text-xs font-mono font-medium text-[#737373] tracking-widest uppercase mb-2">
              BRAND PHILOSOPHY
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A0A0A] font-brand tracking-tight mb-6">
              {storefrontConfig.aboutHeadline}
            </h2>
            <p className="text-sm sm:text-base text-[#737373] leading-relaxed mb-8 max-w-xl">
              {storefrontConfig.aboutText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E5E5E5]">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  <Truck className="w-4 h-4 stroke-[2]" />
                  <span>24-48h Delivery</span>
                </div>
                <div className="text-xs text-[#737373]">
                  Direct city courier across Ulaanbaatar.
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  <ShieldCheck className="w-4 h-4 stroke-[2]" />
                  <span>Quality Standard</span>
                </div>
                <div className="text-xs text-[#737373]">
                  Sub-zero tested thermal insulation.
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  <MapPin className="w-4 h-4 stroke-[2]" />
                  <span>Store Pickup</span>
                </div>
                <div className="text-xs text-[#737373]">
                  {storefrontConfig.storeAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden">
              <img
                src="/src/assets/images/product_sneaker_polar_black_1792328359882.jpg"
                alt="Product Craftsmanship"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-white border border-[#E5E5E5] text-[10px] font-mono uppercase tracking-widest text-[#0A0A0A]">
                VOTEX TECHNICAL STANDARDS
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
