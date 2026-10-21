import React from 'react';
import { useApp } from '../../context/AppContext';
import { StoreProductCard } from './StoreProductCard';

export const StoreNewArrivals: React.FC = () => {
  const { products } = useApp();

  const newArrivals = products
    .filter((p) => p.status === 'active' && p.isNewArrival)
    .slice(0, 4);

  if (newArrivals.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 border-b border-[#E5E5E5] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-medium text-[#737373] tracking-widest uppercase mb-1.5">
              NEW RELEASES
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] font-brand">
              Latest Additions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
