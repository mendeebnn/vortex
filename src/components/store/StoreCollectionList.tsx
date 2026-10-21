import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreCollectionList: React.FC = () => {
  const { collections, products, navigateToShop } = useApp();

  return (
    <section className="py-16 sm:py-20 border-b border-[#E5E5E5] bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-medium text-[#737373] tracking-widest uppercase mb-1.5">
              COLLECTIONS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] font-brand">
              Browse by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => {
            const count = products.filter(
              (p) => p.collectionSlug === col.slug && p.status === 'active'
            ).length;

            return (
              <div
                key={col.id}
                onClick={() => navigateToShop(col.slug)}
                className="group relative bg-white border border-[#E5E5E5] p-4 flex flex-col justify-between hover:border-[#0A0A0A] transition-all cursor-pointer shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full bg-[#F7F7F7] overflow-hidden mb-4">
                  {col.image ? (
                    <img
                      src={col.image}
                      alt={col.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#737373]">
                      NO IMAGE
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-[#0A0A0A] font-brand group-hover:underline">
                      {col.name}
                    </h3>
                    <span className="text-xs font-mono text-[#737373]">
                      {count} items
                    </span>
                  </div>
                  {col.description && (
                    <p className="text-xs text-[#737373] line-clamp-1 mb-3">
                      {col.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
