import React from 'react';
import { Snowflake, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreTrustPillars: React.FC = () => {
  const { storefrontConfig } = useApp();

  return (
    <section className="py-12 border-b border-[#E5E5E5] bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm">
            <div className="w-9 h-9 bg-[#0A0A0A] text-white flex items-center justify-center mb-3">
              <Snowflake className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold font-brand text-[#0A0A0A] uppercase mb-1">
              -25°C Sub-Zero Rated
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Thermal fleece insulation and waterproof outer seals built for extreme continental cold.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm">
            <div className="w-9 h-9 bg-[#0A0A0A] text-white flex items-center justify-center mb-3">
              <Truck className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold font-brand text-[#0A0A0A] uppercase mb-1">
              24-48h City Courier
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Fast door-to-door delivery across all districts of Ulaanbaatar and provincial transport.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm">
            <div className="w-9 h-9 bg-[#0A0A0A] text-white flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold font-brand text-[#0A0A0A] uppercase mb-1">
              Ice-Grip Traction
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Deep-lug anti-slip rubber outsoles designed specifically for packed snow and black ice.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm">
            <div className="w-9 h-9 bg-[#0A0A0A] text-white flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold font-brand text-[#0A0A0A] uppercase mb-1">
              Hotline Order Support
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Direct phone support & Instagram DM orders at {storefrontConfig.phoneHotline}.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
