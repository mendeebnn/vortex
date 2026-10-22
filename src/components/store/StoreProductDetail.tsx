import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldCheck, Truck, ShoppingBag, Send, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StoreProductDetailProps {
  onDirectCheckout: (product: any, size: string, color: string, quantity: number) => void;
}

export const StoreProductDetail: React.FC<StoreProductDetailProps> = ({ onDirectCheckout }) => {
  const {
    products,
    selectedProductId,
    formatPrice,
    addToCart,
    navigateToShop,
    storefrontConfig,
    setIsCartOpen,
    openAdminWithProduct,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-[#737373]">Product not found.</p>
        <button
          onClick={() => navigateToShop()}
          className="mt-4 px-6 py-2 bg-[#0A0A0A] text-white text-xs font-bold uppercase rounded-full"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');

  const allImages = [product.image, ...(product.additionalImages || [])];
  const isOutOfStock = product.inventory <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
  };

  const handleDirectBuy = () => {
    if (isOutOfStock) return;
    onDirectCheckout(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigateToShop()}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#737373] hover:text-[#0A0A0A] uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>

          <span className="text-xs font-mono text-[#737373] uppercase">
            SKU: {product.sku || product.id}
          </span>
        </div>

        {/* Product Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:w-20 shrink-0 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-[#F7F7F7] border overflow-hidden shrink-0 transition-all ${
                      activeImage === img
                        ? 'border-[#0A0A0A] ring-1 ring-[#0A0A0A]'
                        : 'border-[#E5E5E5] hover:border-[#737373]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden group">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.tag && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-mono font-bold tracking-widest uppercase text-[#0A0A0A]">
                  {product.tag}
                </div>
              )}
            </div>
          </div>

          {/* Right: Purchasing Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category */}
              <div className="text-xs font-mono text-[#737373] uppercase tracking-widest mb-2">
                {product.collectionSlug}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] font-brand tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E5E5E5]">
                <span className="text-2xl sm:text-3xl font-black text-[#0A0A0A] font-mono tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-[#737373] line-through font-mono tabular-nums">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs font-mono text-[#737373] ml-auto">
                  {isOutOfStock ? 'Sold Out' : `${product.inventory} in stock`}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#737373] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2.5">
                    <span>Color: <span className="font-normal text-[#737373]">{selectedColor}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 border text-xs font-medium transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-sm font-bold'
                            : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#737373] hover:border-[#737373]'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-[#E5E5E5]"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2.5">
                    <span>Size / Variant</span>
                    <span className="text-[11px] font-mono text-[#737373]">Selected: {selectedSize}</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                            : 'bg-white text-[#0A0A0A] border-[#E5E5E5] hover:border-[#0A0A0A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6 flex items-center justify-between p-3 border border-[#E5E5E5] bg-[#F7F7F7]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] text-[#0A0A0A] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold font-mono text-[#0A0A0A] tabular-nums w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] text-[#0A0A0A] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-4 px-6 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-sm ${
                    isOutOfStock
                      ? 'bg-[#E5E5E5] text-[#737373] cursor-not-allowed'
                      : 'bg-[#0A0A0A] text-white hover:bg-neutral-800 active:scale-[0.99] cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
                </button>

                <button
                  onClick={handleDirectBuy}
                  disabled={isOutOfStock}
                  className="w-full py-4 px-6 bg-transparent hover:bg-neutral-100 text-[#0A0A0A] border border-[#0A0A0A] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Instant Order / Checkout</span>
                </button>
              </div>

              {/* Editorial Accordion / Tabs */}
              <div className="border-t border-[#E5E5E5] pt-4">
                <div className="flex items-center gap-6 border-b border-[#E5E5E5] pb-2 text-xs font-bold uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
                        : 'text-[#737373] hover:text-[#0A0A0A]'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'shipping'
                        ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
                        : 'text-[#737373] hover:text-[#0A0A0A]'
                    }`}
                  >
                    Delivery & Pickup
                  </button>
                </div>

                <div className="pt-4 text-xs text-[#737373] leading-relaxed">
                  {activeTab === 'details' ? (
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0A0A0A]" />
                        <span>Sub-zero thermal resistance & cold weather barrier.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0A0A0A]" />
                        <span>Weather-sealed durable composite construction.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0A0A0A]" />
                        <span>Available for immediate dispatch or pre-order.</span>
                      </li>
                    </ul>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <strong>Courier Delivery:</strong> 24 to 48 hours across Ulaanbaatar.
                      </p>
                      <p>
                        <strong>Store Pickup:</strong> {storefrontConfig.storeAddress}
                      </p>
                      <p>
                        <strong>Order Hotline:</strong> {storefrontConfig.phoneHotline}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
