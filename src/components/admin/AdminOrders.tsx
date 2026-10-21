import React, { useState } from 'react';
import {
  ShoppingBag,
  Eye,
  Trash2,
  X,
  Phone,
  MapPin,
  CheckCircle,
  Plus,
  Copy,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderItem } from '../../types';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    products,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    formatPrice,
    storefrontConfig,
    showToast,
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Manual Order Creation Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qpay' | 'cod' | 'bank_transfer'>('cod');

  // Manual order items
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>(products[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [manualItems, setManualItems] = useState<OrderItem[]>([]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('Sukhbaatar District, Ulaanbaatar');
    setCustomerNotes('Manual Instagram / Phone Hotline Order');
    setPaymentMethod('cod');
    setManualItems([]);
    if (products[0]) {
      setSelectedProductToAdd(products[0].id);
      setSelectedSize(products[0].sizes[0] || 'Standard');
      setSelectedColor(products[0].colors[0]?.name || 'Standard');
    }
  };

  const handleAddManualItem = () => {
    const prod = products.find((p) => p.id === selectedProductToAdd);
    if (!prod) return;

    const newItem: OrderItem = {
      productId: prod.id,
      productName: prod.name,
      size: selectedSize || prod.sizes[0] || 'Standard',
      color: selectedColor || prod.colors[0]?.name || 'Standard',
      quantity: Number(itemQuantity),
      unitPrice: prod.price,
    };

    setManualItems([...manualItems, newItem]);
    showToast(`Added ${prod.name} to order draft`);
  };

  const handleRemoveManualItem = (index: number) => {
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const manualTotal = manualItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleSaveManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualItems.length === 0) {
      showToast('Please add at least one product item to the order', 'error');
      return;
    }

    createOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerNotes,
      items: manualItems,
      totalAmount: manualTotal,
      paymentMethod,
    });

    setIsAddModalOpen(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'shipped':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const copyOrderSlip = (order: Order) => {
    const slip = `[${storefrontConfig.storeName} ORDER SLIP ${order.orderNumber}]
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Address: ${order.customerAddress}
Payment: ${order.paymentMethod.toUpperCase()}
Items:
${order.items.map((i) => `• ${i.productName} (${i.size}, ${i.color}) × ${i.quantity} = ${formatPrice(i.unitPrice * i.quantity)}`).join('\n')}
Total: ${formatPrice(order.totalAmount)}
Status: ${order.status.toUpperCase()}`;

    navigator.clipboard.writeText(slip);
    setCopied(true);
    showToast('Order slip copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-xs text-[#737373]">
            Total {orders.length} orders · Real-time synchronization with checkout, hotline, and Instagram DM sales.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Manual Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#E5E5E5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer, phone..."
            className="w-full pl-9 pr-4 py-2 bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#0A0A0A] placeholder-[#737373] focus:outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#737373] uppercase">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#0A0A0A] py-2 px-3 focus:outline-none focus:border-[#0A0A0A]"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F7F7F7] text-[#737373] font-mono uppercase tracking-wider">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#F7F7F7]/60 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#0A0A0A]">
                  {ord.orderNumber}
                </td>
                <td className="py-3 px-4 font-mono text-[#737373]">
                  {new Date(ord.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-[#0A0A0A]">{ord.customerName}</div>
                  <div className="text-[11px] font-mono text-[#737373]">{ord.customerPhone}</div>
                </td>
                <td className="py-3 px-4 font-mono">
                  {ord.items.reduce((acc, i) => acc + i.quantity, 0)} items
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#0A0A0A]">
                  {formatPrice(ord.totalAmount)}
                </td>
                <td className="py-3 px-4 font-mono uppercase text-[#737373]">
                  {ord.paymentMethod}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 border rounded cursor-pointer ${getStatusBadge(
                      ord.status
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded"
                      title="Inspect Order Specification"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyOrderSlip(ord)}
                      className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded"
                      title="Copy Slip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete order ${ord.orderNumber}?`)) {
                          deleteOrder(ord.id);
                        }
                      }}
                      className="p-1.5 text-[#737373] hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Remove Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="py-16 text-center text-[#737373] text-xs font-mono">
            No orders match the selected filters.
          </div>
        )}
      </div>

      {/* Manual Order Creation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black font-brand uppercase tracking-wider text-[#0A0A0A] mb-1">
              Create Manual Customer Order
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              Register orders received via Instagram DM (@votex_brand_) or telephone hotlines.
            </p>

            <form onSubmit={handleSaveManualOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Temuulen B."
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="8808xxxx / 9911xxxx"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="District, Khoroo, Building, Door number"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="qpay">QPay QR</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, afternoon"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Add Items Sub-form */}
              <div className="p-4 bg-[#F7F7F7] border border-[#E5E5E5] space-y-3">
                <div className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                  Select Products to Include
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-[#737373] mb-1">
                      Product
                    </label>
                    <select
                      value={selectedProductToAdd}
                      onChange={(e) => {
                        setSelectedProductToAdd(e.target.value);
                        const p = products.find((x) => x.id === e.target.value);
                        if (p) {
                          setSelectedSize(p.sizes[0] || 'Standard');
                          setSelectedColor(p.colors[0]?.name || 'Standard');
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E5E5E5] text-xs focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatPrice(p.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#737373] mb-1">
                      Size
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E5E5E5] text-xs focus:outline-none"
                    >
                      {products
                        .find((p) => p.id === selectedProductToAdd)
                        ?.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#737373] mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E5E5E5] text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddManualItem}
                    className="px-4 py-1.5 bg-[#0A0A0A] text-white text-[11px] font-bold uppercase rounded cursor-pointer hover:bg-neutral-800"
                  >
                    + Add Item to Order
                  </button>
                </div>

                {/* Items in draft order */}
                {manualItems.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E5E5E5]">
                    {manualItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-[#E5E5E5] text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#0A0A0A]">{item.productName}</span>
                          <span className="text-[11px] text-[#737373] ml-2">
                            ({item.size}) × {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#0A0A0A]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveManualItem(idx)}
                            className="text-rose-600 hover:text-rose-800"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 flex justify-between font-bold text-sm text-[#0A0A0A]">
                      <span>Order Total:</span>
                      <span className="font-mono">{formatPrice(manualTotal)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E5E5E5] hover:border-[#0A0A0A] text-[#0A0A0A] uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualItems.length === 0}
                  className="px-6 py-2.5 bg-[#0A0A0A] disabled:opacity-50 hover:bg-neutral-800 text-white uppercase font-bold cursor-pointer"
                >
                  Save & Register Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 my-8 text-left">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#737373]">
                ORDER SPECIFICATION
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${getStatusBadge(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>

            <h2 className="text-2xl font-black font-brand text-[#0A0A0A] mb-4">
              {selectedOrder.orderNumber}
            </h2>

            <div className="p-4 bg-[#F7F7F7] border border-[#E5E5E5] mb-5 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#0A0A0A] min-w-[70px]">Customer:</span>
                <span className="text-[#0A0A0A]">{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#0A0A0A] min-w-[70px]">Phone:</span>
                <a href={`tel:${selectedOrder.customerPhone}`} className="text-[#0A0A0A] font-mono hover:underline font-bold">
                  {selectedOrder.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#0A0A0A] min-w-[70px]">Address:</span>
                <span className="text-[#737373]">{selectedOrder.customerAddress}</span>
              </div>
              {selectedOrder.customerNotes && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#0A0A0A] min-w-[70px]">Notes:</span>
                  <span className="text-[#737373] italic">{selectedOrder.customerNotes}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-6 space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-[#0A0A0A] pb-1 border-b border-[#E5E5E5]">
                Order Items ({selectedOrder.items.length})
              </div>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#E5E5E5] text-[#0A0A0A]">
                  <div>
                    <div className="font-bold">{item.productName}</div>
                    <div className="text-[11px] font-mono text-[#737373]">
                      Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-mono font-bold">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-between text-sm font-bold text-[#0A0A0A]">
                <span>Total Amount:</span>
                <span className="font-mono">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => copyOrderSlip(selectedOrder)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0A0A0A] hover:underline cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy Slip'}</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#0A0A0A] text-white text-xs font-bold uppercase rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
