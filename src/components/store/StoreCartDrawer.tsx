import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StoreCartDrawerProps {
  onOpenCheckout: () => void;
}

export const StoreCartDrawer: React.FC<StoreCartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    formatPrice,
    storefrontConfig,
    navigateToShop,
  } = useApp();

  if (!isCartOpen) return null;

  const freeShippingThreshold = storefrontConfig.freeShippingThreshold || 200000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white border-l border-[#E5E5E5] h-full flex flex-col justify-between shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#0A0A0A]" />
            <h2 className="text-base font-bold text-[#0A0A0A] font-brand uppercase tracking-wider">
              Shopping Bag
            </h2>
            <span className="text-xs font-mono bg-[#0A0A0A] text-white px-2 py-0.5 font-bold">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#737373] hover:text-[#0A0A0A] rounded-full hover:bg-[#F7F7F7] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-[#F7F7F7] border-b border-[#E5E5E5] text-xs">
          <div className="flex items-center justify-between mb-1.5 font-mono text-[#737373]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0A0A0A]" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-[#0A0A0A] font-bold">Free City Courier Unlocked!</span>
              ) : (
                <span>Add {formatPrice(remainingForFreeShipping)} for free delivery</span>
              )}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E5E5E5] h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-[#0A0A0A] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white border border-[#E5E5E5] flex gap-3.5 items-center justify-between"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0A0A0A] truncate font-brand">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-[#737373] mt-0.5 flex items-center gap-2 font-mono">
                    <span>Size: {item.selectedSize}</span>
                    <span>·</span>
                    <span>{item.selectedColor}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0A0A0A] font-mono tabular-nums mt-1">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>

                {/* Stepper & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#737373] hover:text-[#0A0A0A] p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-[#E5E5E5] bg-[#F7F7F7]">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-[#0A0A0A] hover:bg-neutral-200 text-xs font-bold cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono text-[#0A0A0A] px-2 font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#0A0A0A] hover:bg-neutral-200 text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-[#737373] mb-3 stroke-[1.5]" />
              <h3 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider mb-1 font-brand">
                Your bag is empty
              </h3>
              <p className="text-xs text-[#737373] max-w-xs mb-6">
                Explore our minimal winter collection and add items to your cart.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateToShop();
                }}
                className="px-6 py-2.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E5E5E5] bg-[#F7F7F7] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-[#737373]">
                Subtotal
              </span>
              <span className="text-xl font-black font-mono text-[#0A0A0A] tabular-nums">
                {formatPrice(cartSubtotal)}
              </span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-4 px-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <span>Checkout Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] font-mono text-[#737373]">
              Taxes calculated at checkout · 24-48h Delivery in UB
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
