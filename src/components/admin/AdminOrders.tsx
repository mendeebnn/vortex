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
  Sparkles,
  Calendar,
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

  // Inline delete confirmation state (avoids window.confirm popup blocker)
  const [deleteConfirmOrderId, setDeleteConfirmOrderId] = useState<string | null>(null);

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
    setCustomerPhone('8808-');
    setCustomerAddress('Ulaanbaatar, Sukhbaatar District');
    setCustomerNotes('Direct phone / Instagram order');
    setPaymentMethod('cod');
    setManualItems([]);
    if (products[0]) {
      setSelectedProductToAdd(products[0].id);
      setSelectedSize(products[0].sizes[0] || 'Standard');
      setSelectedColor(products[0].colors[0]?.name || 'Standard');
      setItemQuantity(1);
    }
  };

  const handleAddManualItem = () => {
    const prod = products.find((p) => p.id === selectedProductToAdd) || products[0];
    if (!prod) return;

    const newItem: OrderItem = {
      productId: prod.id,
      productName: prod.name,
      size: selectedSize || prod.sizes[0] || 'Standard',
      color: selectedColor || prod.colors[0]?.name || 'Standard',
      quantity: Number(itemQuantity) > 0 ? Number(itemQuantity) : 1,
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

    let finalItems = [...manualItems];
    // If user forgot to click "+ Add Item", automatically add the currently selected product
    if (finalItems.length === 0 && products.length > 0) {
      const prod = products.find((p) => p.id === selectedProductToAdd) || products[0];
      finalItems = [
        {
          productId: prod.id,
          productName: prod.name,
          size: selectedSize || prod.sizes[0] || 'Standard',
          color: selectedColor || prod.colors[0]?.name || 'Standard',
          quantity: Number(itemQuantity) > 0 ? Number(itemQuantity) : 1,
          unitPrice: prod.price,
        },
      ];
    }

    if (finalItems.length === 0) {
      showToast('Please add at least one product item', 'error');
      return;
    }

    const calculatedTotal = finalItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    createOrder({
      customerName: customerName.trim() || 'Anonymous Customer',
      customerPhone: customerPhone.trim() || '8808-3734',
      customerAddress: customerAddress.trim() || 'Ulaanbaatar',
      customerNotes,
      items: finalItems,
      totalAmount: calculatedTotal,
      paymentMethod,
    });

    setIsAddModalOpen(false);
  };

  // Safe delete handler without window.confirm
  const handleDeleteOrder = (orderId: string) => {
    if (deleteConfirmOrderId === orderId) {
      deleteOrder(orderId);
      setDeleteConfirmOrderId(null);
    } else {
      setDeleteConfirmOrderId(orderId);
      setTimeout(() => {
        setDeleteConfirmOrderId((prev) => (prev === orderId ? null : prev));
      }, 4000);
    }
  };

  // Quick 1-click test order generator
  const handleCreateSampleOrder = () => {
    if (products.length === 0) return;
    const randomProd = products[Math.floor(Math.random() * products.length)];
    const names = ['Anand B.', 'Enkhmaa S.', 'Temuulen G.', 'Solongo O.', 'Bilguun D.'];
    const chosenName = names[Math.floor(Math.random() * names.length)];

    createOrder({
      customerName: chosenName,
      customerPhone: `99${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`,
      customerAddress: 'Bayanzurkh District, 26th Khoroo, Ulaanbaatar',
      customerNotes: 'Deliver between 14:00 - 18:00',
      items: [
        {
          productId: randomProd.id,
          productName: randomProd.name,
          size: randomProd.sizes[0] || 'Standard',
          color: randomProd.colors[0]?.name || 'Standard',
          quantity: 1,
          unitPrice: randomProd.price,
        },
      ],
      totalAmount: randomProd.price,
      paymentMethod: 'cod',
    });
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick sample order */}
          <button
            onClick={handleCreateSampleOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-95"
            title="Create sample test order"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
            <span>+ 1-Click Sample</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Manual Order</span>
          </button>
        </div>
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
            {filteredOrders.map((ord) => {
              const isConfirmingDelete = deleteConfirmOrderId === ord.id;

              return (
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
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded cursor-pointer"
                        title="Inspect Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyOrderSlip(ord)}
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded cursor-pointer"
                        title="Copy Slip"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      
                      {/* Delete with 2-step inline confirm to avoid window.confirm popup block */}
                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className={`p-1.5 rounded cursor-pointer transition-all ${
                          isConfirmingDelete
                            ? 'bg-rose-600 text-white font-bold px-2 text-[10px]'
                            : 'text-[#737373] hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={isConfirmingDelete ? 'Click again to permanently delete' : 'Remove Order'}
                      >
                        {isConfirmingDelete ? <span>Confirm?</span> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
          <div className="relative w-full max-w-2xl bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black font-brand uppercase tracking-wider text-[#0A0A0A] mb-1">
              Create Manual Hotline / Instagram Order
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              Record telephone orders, direct message transactions, and assign items.
            </p>

            <form onSubmit={handleSaveManualOrder} className="space-y-5 text-xs">
              
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Bat-Erdene M."
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 8808-3734"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Delivery Address in Ulaanbaatar *
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="District, Khoroo, Building / Door number"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                />
              </div>

              {/* Item Selector Box */}
              <div className="p-4 bg-[#F7F7F7] border border-[#E5E5E5] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Select Product to Add</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#737373]">
                    {manualItems.length} items in order
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <select
                      value={selectedProductToAdd}
                      onChange={(e) => {
                        setSelectedProductToAdd(e.target.value);
                        const prod = products.find((p) => p.id === e.target.value);
                        if (prod) {
                          setSelectedSize(prod.sizes[0] || 'Standard');
                          setSelectedColor(prod.colors[0]?.name || 'Standard');
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {formatPrice(p.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs focus:outline-none"
                    >
                      {(products.find((p) => p.id === selectedProductToAdd)?.sizes || ['Standard']).map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-white border border-[#E5E5E5] focus:border-[#0A0A0A] text-xs font-mono focus:outline-none text-center"
                      title="Quantity"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddManualItem}
                      className="w-full py-2 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase rounded cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Items in Draft List */}
                {manualItems.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E5E5E5]">
                    {manualItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-[#E5E5E5] text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#0A0A0A]">{item.productName}</span>
                          <span className="font-mono text-[#737373] ml-2 text-[11px]">
                            ({item.size}, {item.color}) × {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#0A0A0A]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveManualItem(idx)}
                            className="text-[#737373] hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="text-right pt-2 font-mono text-xs">
                      <span className="text-[#737373]">Draft Total: </span>
                      <strong className="text-[#0A0A0A] text-sm">{formatPrice(manualTotal)}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method & Notes */}
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
                    <option value="cod">Cash / Card on Delivery (COD)</option>
                    <option value="qpay">QPay QR Payment</option>
                    <option value="bank_transfer">Bank Transfer (Khan Bank)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Order Note / Instruction
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Call before arrival"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-[#E5E5E5] text-[#737373] hover:text-[#0A0A0A] font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
                >
                  Confirm & Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 text-left animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-base font-bold text-[#0A0A0A]">
                {selectedOrder.orderNumber}
              </span>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${getStatusBadge(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono border-t border-b border-[#E5E5E5] py-4">
              <div>
                <span className="text-[#737373] block text-[10px] uppercase">Customer</span>
                <span className="font-bold text-[#0A0A0A]">{selectedOrder.customerName}</span>
              </div>

              <div>
                <span className="text-[#737373] block text-[10px] uppercase">Phone</span>
                <span className="text-[#0A0A0A]">{selectedOrder.customerPhone}</span>
              </div>

              <div>
                <span className="text-[#737373] block text-[10px] uppercase">Shipping Address</span>
                <span className="text-[#0A0A0A]">{selectedOrder.customerAddress}</span>
              </div>

              <div>
                <span className="text-[#737373] block text-[10px] uppercase">Items Ordered</span>
                <div className="space-y-1 mt-1">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.productName} ({item.size}, {item.color}) × {item.quantity}
                      </span>
                      <span className="font-bold">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-[#0A0A0A] pt-2 border-t border-[#E5E5E5]">
                <span>Total Amount:</span>
                <span>{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => copyOrderSlip(selectedOrder)}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E5E5E5] hover:border-[#0A0A0A] text-xs font-mono uppercase font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Slip' : 'Copy Slip'}</span>
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
