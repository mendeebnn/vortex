import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface StoreProductCardProps {
  product: Product;
}

export const StoreProductCard: React.FC<StoreProductCardProps> = ({ product }) => {
  const { formatPrice, addToCart, navigateToProduct } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.inventory <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0]?.name || 'Standard';
    addToCart(product, defaultSize, defaultColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigateToProduct(product.id)}
      className="group relative flex flex-col justify-between bg-white border border-[#E5E5E5] p-3 sm:p-4 hover:border-[#0A0A0A] transition-all duration-200 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#F7F7F7] overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Minimal Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.tag && (
            <span className="px-2 py-0.5 bg-white border border-[#E5E5E5] text-[10px] font-mono font-bold tracking-wider text-[#0A0A0A] uppercase">
              {product.tag}
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-[#0A0A0A] text-white text-[10px] font-mono font-bold tracking-wider uppercase">
              Sold Out
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && !isOutOfStock && (
            <span className="px-2 py-0.5 bg-white border border-[#E5E5E5] text-[10px] font-mono text-[#0A0A0A] uppercase font-bold">
              Sale
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer active:scale-90 ${
              justAdded
                ? 'bg-[#0A0A0A] text-white scale-100 opacity-100'
                : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white border border-[#E5E5E5] translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
            title="Quick add to bag"
          >
            {justAdded ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider mb-1">
            {product.collectionSlug}
          </div>
          <h3 className="text-sm font-bold text-[#0A0A0A] group-hover:underline line-clamp-1 font-brand mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#737373] line-clamp-1 mb-3">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E5E5E5] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-[#0A0A0A] font-mono tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-[#737373] line-through font-mono tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] group-hover:text-[#0A0A0A]">
            View →
          </span>
        </div>
      </div>
    </div>
  );
};
