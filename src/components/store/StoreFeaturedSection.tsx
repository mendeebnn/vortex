import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreProductCard } from './StoreProductCard';

export const StoreFeaturedSection: React.FC = () => {
  const { products, storefrontConfig, collections, navigateToShop } = useApp();

  // Find active products for featured collection or flagged as featured
  const featuredProducts = products
    .filter((p) => p.status === 'active')
    .filter(
      (p) =>
        p.isFeatured ||
        p.collectionSlug === storefrontConfig.featuredCollectionSlug
    )
    .slice(0, 4);

  const featuredCollection = collections.find(
    (c) => c.slug === storefrontConfig.featuredCollectionSlug
  );

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 border-b border-[#E5E5E5] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-medium text-[#737373] tracking-widest uppercase mb-1.5">
              CURATED SELECTION
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] font-brand">
              {featuredCollection ? featuredCollection.name : 'Featured Products'}
            </h2>
          </div>

          <button
            onClick={() => navigateToShop(featuredCollection?.slug)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#737373] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All in Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
