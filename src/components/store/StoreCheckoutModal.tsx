import React, { useState } from 'react';
import { X, Check, Copy, Instagram, QrCode, Banknote, CreditCard, ArrowRight, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

interface StoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItem?: {
    product: any;
    size: string;
    color: string;
    quantity: number;
  } | null;
}

export const StoreCheckoutModal: React.FC<StoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  directItem,
}) => {
  const {
    cart,
    cartSubtotal,
    formatPrice,
    createOrder,
    storefrontConfig,
    showToast,
  } = useApp();

  if (!isOpen) return null;

  // Items to checkout: either direct item or all cart items
  const itemsToCheckout = directItem
    ? [
        {
          productId: directItem.product.id,
          productName: directItem.product.name,
          size: directItem.size,
          color: directItem.color,
          quantity: directItem.quantity,
          unitPrice: directItem.product.price,
        },
      ]
    : cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        size: i.selectedSize,
        color: i.selectedColor,
        quantity: i.quantity,
        unitPrice: i.product.price,
      }));

  const totalAmount = directItem
    ? directItem.product.price * directItem.quantity
    : cartSubtotal;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Sukhbaatar District');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qpay' | 'cod' | 'bank_transfer'>('qpay');
  const [notes, setNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      showToast('Please provide a valid phone number', 'error');
      return;
    }

    const order = createOrder({
      customerName,
      customerPhone: phone,
      customerAddress: `${district}, ${address}`,
      customerNotes: notes,
      items: itemsToCheckout,
      totalAmount,
      paymentMethod,
    });

    setConfirmedOrder(order);
    showToast(`Order ${order.orderNumber} successfully placed!`);
  };

  const compiledOrderSlip = confirmedOrder
    ? `[${storefrontConfig.storeName} ORDER SLIP ${confirmedOrder.orderNumber}]
Customer: ${confirmedOrder.customerName}
Phone: ${confirmedOrder.customerPhone}
Address: ${confirmedOrder.customerAddress}
Payment: ${confirmedOrder.paymentMethod.toUpperCase()}
Items:
${confirmedOrder.items
  .map(
    (i) =>
      `• ${i.productName} | Size: ${i.size} | Color: ${i.color} | Qty: ${i.quantity} | ${formatPrice(i.unitPrice * i.quantity)}`
  )
  .join('\n')}

Total Amount: ${formatPrice(confirmedOrder.totalAmount)}
Courier Delivery: 24-48 hours
Hotline: ${storefrontConfig.phoneHotline}`
    : '';

  const handleCopySlip = () => {
    navigator.clipboard.writeText(compiledOrderSlip);
    setCopied(true);
    showToast('Order slip copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInstagram = () => {
    if (compiledOrderSlip) {
      navigator.clipboard.writeText(compiledOrderSlip);
    }
    window.open(storefrontConfig.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A] hover:bg-[#F7F7F7] rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedOrder ? (
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#737373] mb-1">
              CHECKOUT
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A0A0A] font-brand mb-2">
              Order Confirmation
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              Complete your contact and delivery details. Our city courier will deliver within 24 to 48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs text-[#0A0A0A] placeholder-[#737373] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="8808xxxx / 9911xxxx"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs text-[#0A0A0A] placeholder-[#737373] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    District / Region *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs text-[#0A0A0A] focus:outline-none"
                  >
                    <option value="Sukhbaatar District">Sukhbaatar District</option>
                    <option value="Bayanzurkh District">Bayanzurkh District</option>
                    <option value="Khan-Uul District">Khan-Uul District</option>
                    <option value="Bayangol District">Bayangol District</option>
                    <option value="Chingeltei District">Chingeltei District</option>
                    <option value="Songinokhairkhan District">Songinokhairkhan District</option>
                    <option value="Provincial Dispatch">Provincial Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Street & Apartment Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apt, entrance, door number"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs text-[#0A0A0A] placeholder-[#737373] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qpay')}
                    className={`p-3 border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'qpay'
                        ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-sm'
                        : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#737373] hover:border-[#0A0A0A]'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QPay QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-sm'
                        : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#737373] hover:border-[#0A0A0A]'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-sm'
                        : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#737373] hover:border-[#0A0A0A]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-3 bg-[#F7F7F7] border border-[#E5E5E5] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#0A0A0A] uppercase tracking-wider pb-1 border-b border-[#E5E5E5]">
                  <span>Items to purchase ({itemsToCheckout.length})</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                {itemsToCheckout.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#737373]">
                    <span className="truncate max-w-[280px]">
                      {item.productName} ({item.size}) × {item.quantity}
                    </span>
                    <span className="font-mono">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Place Order ({formatPrice(totalAmount)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation View */
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="text-xs font-mono text-[#737373] uppercase tracking-widest mb-1">
              ORDER CONFIRMED
            </div>
            <h2 className="text-2xl font-black text-[#0A0A0A] font-brand mb-2">
              {confirmedOrder.orderNumber}
            </h2>
            <p className="text-xs text-[#737373] max-w-sm mx-auto mb-6">
              Thank you, {confirmedOrder.customerName}. Your order has been registered in the system. Our dispatcher will call {confirmedOrder.customerPhone} prior to delivery.
            </p>

            {/* Order Slip Box */}
            <div className="mb-6 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-[#737373] mb-1.5">
                <span>OFFICIAL ORDER SLIP:</span>
                <button
                  onClick={handleCopySlip}
                  className="flex items-center gap-1 text-[#0A0A0A] hover:underline font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy Slip'}</span>
                </button>
              </div>
              <div className="p-3 bg-[#F7F7F7] border border-[#E5E5E5] text-[11px] font-mono text-[#0A0A0A] whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed select-all">
                {compiledOrderSlip}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleOpenInstagram}
                className="py-3 px-4 bg-white border border-[#0A0A0A] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                <span>Send via Instagram DM</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="py-3 px-4 bg-[#0A0A0A] text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 flex items-center justify-center cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
