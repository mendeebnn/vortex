import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreProductCard } from './StoreProductCard';

export const StoreProductList: React.FC = () => {
  const {
    products,
    collections,
    selectedCollectionSlug,
    navigateToShop,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const activeCollection = collections.find((c) => c.slug === selectedCollectionSlug);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'active')
      .filter((p) => {
        if (selectedCollectionSlug && p.collectionSlug !== selectedCollectionSlug) {
          return false;
        }
        if (inStockOnly && p.inventory <= 0) {
          return false;
        }
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collectionSlug.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCollectionSlug, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="py-12 sm:py-16 bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Collection / Page Header */}
        <div className="mb-8 pb-6 border-b border-[#E5E5E5] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase tracking-widest mb-1.5">
              CATALOGUE
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] font-brand">
              {activeCollection ? activeCollection.name : 'All Products'}
            </h1>
            {activeCollection?.description && (
              <p className="text-xs sm:text-sm text-[#737373] mt-1.5 max-w-xl">
                {activeCollection.description}
              </p>
            )}
          </div>

          <div className="text-xs font-mono text-[#737373]">
            {filteredProducts.length} items found
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => navigateToShop()}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all shrink-0 cursor-pointer ${
                !selectedCollectionSlug
                  ? 'bg-[#0A0A0A] text-white shadow-sm'
                  : 'bg-[#F7F7F7] text-[#737373] hover:text-[#0A0A0A] border border-[#E5E5E5]'
              }`}
            >
              All
            </button>
            {collections.map((col) => {
              const active = selectedCollectionSlug === col.slug;
              return (
                <button
                  key={col.id}
                  onClick={() => navigateToShop(col.slug)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#0A0A0A] text-white shadow-sm'
                      : 'bg-[#F7F7F7] text-[#737373] hover:text-[#0A0A0A] border border-[#E5E5E5]'
                  }`}
                >
                  {col.name}
                </button>
              );
            })}
          </div>

          {/* Search, In-Stock Toggle, and Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] rounded-full text-xs text-[#0A0A0A] placeholder-[#737373] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0A0A0A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* In stock toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#0A0A0A] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#E5E5E5] text-[#0A0A0A] focus:ring-[#0A0A0A]"
              />
              <span>In stock</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-[#F7F7F7] border border-[#E5E5E5] text-[#0A0A0A] text-xs py-2 pl-3.5 pr-8 rounded-full focus:outline-none focus:border-[#0A0A0A] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-[#E5E5E5] bg-[#F7F7F7] rounded-xl p-8">
            <h3 className="text-base font-bold text-[#0A0A0A] mb-2 font-brand">
              No products found
            </h3>
            <p className="text-xs text-[#737373] mb-6">
              Try adjusting your filters or search query to find what you are looking for.
            </p>
            <button
              onClick={() => {
                navigateToShop();
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-5 py-2.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
