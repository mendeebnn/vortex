import React from 'react';
import { useApp } from '../../context/AppContext';

export const StorePromoMarquee: React.FC<{ text?: string }> = ({ text }) => {
  const { storefrontConfig } = useApp();
  const marqueeContent = text || storefrontConfig.promoMarqueeText || 'LIMITED WINTER DROP · -25°C TESTED FOOTWEAR · EXPRESS COURIER DELIVERY · HOTLINE: 8808-3734';

  return (
    <div className="w-full bg-[#0A0A0A] text-white py-3 overflow-hidden border-y border-neutral-800">
      <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-6 shrink-0 font-mono text-xs uppercase tracking-widest px-4 font-bold">
            <span>{marqueeContent}</span>
            <span className="text-neutral-500">✦</span>
            <span>VOTEX BRAND · ULAANBAATAR</span>
            <span className="text-neutral-500">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
