import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StoreSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreSearchModal: React.FC<StoreSearchModalProps> = ({ isOpen, onClose }) => {
  const { products, formatPrice, navigateToProduct } = useApp();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = products
    .filter((p) => p.status === 'active')
    .filter((p) => {
      if (!query.trim()) return false;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.collectionSlug.toLowerCase().includes(q)
      );
    })
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white border border-[#E5E5E5] shadow-2xl p-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalogue (e.g. sneaker, parka, polar, fleece)..."
            className="w-full pl-11 pr-4 py-3 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-sm text-[#0A0A0A] placeholder-[#737373] focus:outline-none font-medium"
          />
        </div>

        {query.trim() && (
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#737373] pb-2 border-b border-[#E5E5E5]">
              Results ({results.length})
            </div>

            {results.length > 0 ? (
              <div className="divide-y divide-[#E5E5E5] max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      navigateToProduct(product.id);
                      onClose();
                    }}
                    className="py-2.5 flex items-center justify-between hover:bg-[#F7F7F7] px-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover bg-[#F7F7F7] border border-[#E5E5E5]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#0A0A0A]">{product.name}</div>
                        <div className="text-[10px] font-mono text-[#737373] uppercase">
                          {product.collectionSlug}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#0A0A0A]">
                        {formatPrice(product.price)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#737373]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#737373]">
                No items matching "{query}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
