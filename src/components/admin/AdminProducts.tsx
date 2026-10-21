import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Copy,
  Check,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Eye,
  Tag,
  Palette,
  Layers,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariantColor } from '../../types';

export const AdminProducts: React.FC = () => {
  const {
    products,
    collections,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    deleteMultipleProducts,
    toggleProductStatus,
    updateProductInventory,
    formatPrice,
    editingProductId,
    setEditingProductId,
    setActiveView,
    navigateToProduct,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [collectionSlug, setCollectionSlug] = useState('');
  const [price, setPrice] = useState(120000);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [inventory, setInventory] = useState(20);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [image, setImage] = useState('/src/assets/images/product_sneaker_polar_black_1792328359882.jpg');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [tag, setTag] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Dynamic Array Fields for Add/Remove
  const [sizesList, setSizesList] = useState<string[]>(['39', '40', '41', '42', '43', '44']);
  const [newSizeInput, setNewSizeInput] = useState('');

  const [colorsList, setColorsList] = useState<ProductVariantColor[]>([
    { name: 'Obsidian Black', hex: '#0A0A0A' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#0A0A0A');

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto-open modal if navigated from storefront "Edit in Admin"
  useEffect(() => {
    if (editingProductId) {
      const prod = products.find((p) => p.id === editingProductId);
      if (prod) {
        openEditModal(prod);
      }
      setEditingProductId(null);
    }
  }, [editingProductId, products]);

  // Image Presets for quick selection
  const imagePresets = [
    { label: 'Black Winter Sneaker', url: '/src/assets/images/product_sneaker_polar_black_1792328359882.jpg' },
    { label: 'Cream Sherpa Sneaker', url: '/src/assets/images/product_sneaker_polar_cream_1792328360477.jpg' },
    { label: 'Polo Insulated Puffer', url: '/src/assets/images/product_jacket_polo_puffer_1792328361605.jpg' },
    { label: 'Turkish Tactical Kurtik', url: '/src/assets/images/product_jacket_turkish_parka_1792328361082.jpg' },
    { label: 'Campaign Longline Parka', url: '/src/assets/images/hero_votex_winter_campaign_1792328359846.jpg' },
  ];

  const popularSizePresets = [
    { label: 'Shoes (39-44)', sizes: ['39', '40', '41', '42', '43', '44'] },
    { label: 'Apparel (S-XXL)', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { label: 'Standard (One Size)', sizes: ['One Size'] },
  ];

  const popularColorPresets = [
    { name: 'Obsidian Black', hex: '#0A0A0A' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Glacier Charcoal', hex: '#374151' },
    { name: 'Oatmeal Sand', hex: '#D6C7B2' },
    { name: 'Midnight Navy', hex: '#1E293B' },
    { name: 'Olive Green', hex: '#4D5340' },
  ];

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCollectionSlug(collections[0]?.slug || 'footwear');
    setPrice(130000);
    setCompareAtPrice(160000);
    setInventory(25);
    setStatus('active');
    setImage(imagePresets[0].url);
    setDescription('High performance thermal winter product engineered for cold city climates with extreme wind protection.');
    setSku(`VTX-${Math.floor(100 + Math.random() * 900)}`);
    setTag('New Season');
    setIsFeatured(false);
    setIsNewArrival(true);
    setSizesList(['39', '40', '41', '42', '43', '44']);
    setColorsList([
      { name: 'Obsidian Black', hex: '#0A0A0A' },
      { name: 'Glacier Charcoal', hex: '#374151' },
    ]);
    setGalleryImages([imagePresets[1].url]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCollectionSlug(p.collectionSlug);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice);
    setInventory(p.inventory);
    setStatus(p.status);
    setImage(p.image);
    setDescription(p.description);
    setSku(p.sku || '');
    setTag(p.tag || '');
    setIsFeatured(p.isFeatured);
    setIsNewArrival(p.isNewArrival);
    setSizesList(p.sizes && p.sizes.length > 0 ? [...p.sizes] : ['Standard']);
    setColorsList(p.colors && p.colors.length > 0 ? [...p.colors] : [{ name: 'Black', hex: '#0A0A0A' }]);
    setGalleryImages(p.additionalImages ? [...p.additionalImages] : []);
    setIsModalOpen(true);
  };

  // Add / Remove Sizes
  const handleAddSize = () => {
    const val = newSizeInput.trim();
    if (val && !sizesList.includes(val)) {
      setSizesList([...sizesList, val]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (sz: string) => {
    setSizesList(sizesList.filter((s) => s !== sz));
  };

  // Add / Remove Colors
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColorsList([
      ...colorsList,
      { name: newColorName.trim(), hex: newColorHex },
    ]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setColorsList(colorsList.filter((_, i) => i !== index));
  };

  // Add / Remove Gallery Images
  const handleAddImage = (urlToAdd?: string) => {
    const target = (urlToAdd || newImageUrl).trim();
    if (target && !galleryImages.includes(target)) {
      setGalleryImages([...galleryImages, target]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      collectionSlug: collectionSlug || collections[0]?.slug || 'footwear',
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      inventory: Number(inventory),
      status,
      image,
      additionalImages: galleryImages,
      description,
      sizes: sizesList.length > 0 ? sizesList : ['Standard'],
      colors: colorsList.length > 0 ? colorsList : [{ name: 'Default', hex: '#0A0A0A' }],
      sku: sku.trim() || undefined,
      tag: tag.trim() || undefined,
      isFeatured,
      isNewArrival,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  // Select all or individual
  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((x) => x !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCollection =
      selectedCollectionFilter === 'all' || p.collectionSlug === selectedCollectionFilter;
    const matchesStatus =
      statusFilter === 'all' || p.status === statusFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.collectionSlug.toLowerCase().includes(query) ||
      (p.sku && p.sku.toLowerCase().includes(query));

    return matchesCollection && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
            Products Catalogue
          </h1>
          <p className="text-xs text-[#737373]">
            Total {products.length} products · Add, edit, remove, duplicate, and configure inventory variants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedProductIds.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Delete ${selectedProductIds.length} selected products?`)) {
                  deleteMultipleProducts(selectedProductIds);
                  setSelectedProductIds([]);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedProductIds.length})</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#E5E5E5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, collection..."
            className="w-full pl-9 pr-4 py-2 bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#0A0A0A] placeholder-[#737373] focus:outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#737373] uppercase">Collection:</span>
            <select
              value={selectedCollectionFilter}
              onChange={(e) => setSelectedCollectionFilter(e.target.value)}
              className="bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#0A0A0A] py-2 px-3 focus:outline-none focus:border-[#0A0A0A]"
            >
              <option value="all">All Collections ({products.length})</option>
              {collections.map((col) => (
                <option key={col.id} value={col.slug}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#737373] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#0A0A0A] py-2 px-3 focus:outline-none focus:border-[#0A0A0A]"
            >
              <option value="all">All Status</option>
              <option value="active">Active (Visible)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F7F7F7] text-[#737373] font-mono uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-[#737373] hover:text-[#0A0A0A]"
                >
                  {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#0A0A0A]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Collection</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filteredProducts.map((p) => {
              const isSelected = selectedProductIds.includes(p.id);

              return (
                <tr
                  key={p.id}
                  className={`hover:bg-[#F7F7F7]/60 transition-colors ${
                    isSelected ? 'bg-neutral-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleSelectOne(p.id)}
                      className="text-[#737373] hover:text-[#0A0A0A]"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0A0A0A]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover bg-[#F7F7F7] border border-[#E5E5E5] shrink-0"
                      />
                      <div>
                        <div className="font-bold text-[#0A0A0A] text-sm flex items-center gap-2">
                          <span>{p.name}</span>
                          {p.tag && (
                            <span className="px-1.5 py-0.2 bg-[#F7F7F7] border border-[#E5E5E5] text-[9px] font-mono text-[#0A0A0A] uppercase">
                              {p.tag}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-[#737373] flex items-center gap-2 mt-0.5">
                          <span>{p.sku || p.id}</span>
                          <span>·</span>
                          <span>{p.sizes.length} sizes</span>
                          <span>·</span>
                          <span>{p.colors.length} colors</span>
                          {p.isFeatured && <span className="text-amber-700 font-bold">· Featured</span>}
                          {p.isNewArrival && <span className="text-sky-700 font-bold">· New</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[#737373]">
                    {p.collectionSlug}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleProductStatus(p.id)}
                      className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        p.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-[#737373] border border-neutral-300 hover:bg-neutral-200'
                      }`}
                      title="Click to toggle Active / Draft"
                    >
                      {p.status}
                    </button>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={p.inventory <= 0 ? 'text-rose-600 font-bold' : 'text-[#0A0A0A]'}>
                        {p.inventory}
                      </span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <button
                          onClick={() => updateProductInventory(p.id, -1)}
                          className="w-5 h-5 flex items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7] hover:bg-neutral-200 text-[#0A0A0A] font-bold rounded"
                          title="Decrease 1"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateProductInventory(p.id, 5)}
                          className="w-5 h-5 flex items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7] hover:bg-neutral-200 text-[#0A0A0A] font-bold rounded"
                          title="Add 5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#0A0A0A]">
                    <div>{formatPrice(p.price)}</div>
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <div className="text-[10px] text-[#737373] line-through">
                        {formatPrice(p.compareAtPrice)}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View on live store */}
                      <button
                        onClick={() => {
                          navigateToProduct(p.id);
                          setActiveView('store');
                        }}
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded"
                        title="View on Live Store"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => duplicateProduct(p.id)}
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded"
                        title="Duplicate Product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded"
                        title="Edit Product Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete product "${p.name}"? This removes it from store immediately.`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-[#737373] hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center text-[#737373] text-xs">
            No products match the selected criteria.{' '}
            <button
              onClick={openAddModal}
              className="text-[#0A0A0A] font-bold underline ml-1 cursor-pointer"
            >
              Add a new product
            </button>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black font-brand uppercase tracking-wider text-[#0A0A0A] mb-1">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              Configure product details, category collection, prices, sizes, colors, and gallery images.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              
              {/* Product Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. VOTEX Heavy Winter Parka"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="VTX-FW-09"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Collection, Price, Compare-at, Inventory */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Collection *
                  </label>
                  <select
                    value={collectionSlug}
                    onChange={(e) => setCollectionSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  >
                    {collections.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Compare-At Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={compareAtPrice || ''}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Original"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Stock Inventory *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventory}
                    onChange={(e) => setInventory(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Status and Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Product Visibility Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  >
                    <option value="active">Active (Visible in Public Store)</option>
                    <option value="draft">Draft (Hidden from Store)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Badge / Tag Label
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. -25°C Rated, Turkish Line, Limited"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Main Image URL & Presets */}
              <div className="p-4 bg-[#F7F7F7] border border-[#E5E5E5] space-y-2">
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A]">
                  Primary Product Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono text-[11px] focus:outline-none"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-9 h-9 object-cover border border-[#E5E5E5] bg-white shrink-0"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-[#737373] self-center mr-1">Presets:</span>
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`px-2 py-0.5 text-[10px] font-mono border rounded ${
                        image === preset.url
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : 'bg-white text-[#0A0A0A] border-[#E5E5E5] hover:border-[#0A0A0A]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Size Variants Manager (Add / Remove) */}
              <div className="p-4 border border-[#E5E5E5] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Sizes & Variant Dimensions ({sizesList.length})</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#737373]">
                    Click × to remove, or type to add
                  </span>
                </div>

                {/* Preset Bundles */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="text-[#737373] self-center">Apply Preset:</span>
                  {popularSizePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSizesList([...preset.sizes])}
                      className="px-2 py-0.5 border border-[#E5E5E5] bg-[#F7F7F7] hover:border-[#0A0A0A] rounded"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Current Sizes Chips with Remove button */}
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((sz) => (
                    <span
                      key={sz}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono font-bold text-[#0A0A0A] rounded"
                    >
                      <span>{sz}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(sz)}
                        className="text-[#737373] hover:text-rose-600 hover:bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                        title="Remove Size"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new size input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSize();
                      }
                    }}
                    placeholder="Enter custom size (e.g. 45 or 3XL) and press Add..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-4 py-1.5 bg-[#0A0A0A] text-white font-bold uppercase text-[11px] rounded cursor-pointer hover:bg-neutral-800"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Dynamic Color Variants Manager (Add / Remove) */}
              <div className="p-4 border border-[#E5E5E5] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Color Variants ({colorsList.length})</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#737373]">
                    Click × to remove, or add new color
                  </span>
                </div>

                {/* Color Chips List with Remove Button */}
                <div className="flex flex-wrap gap-2">
                  {colorsList.map((col, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#0A0A0A] rounded"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="font-bold">{col.name}</span>
                      <span className="text-[10px] text-[#737373]">{col.hex}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-[#737373] hover:text-rose-600 hover:bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer ml-1"
                        title="Remove Color"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Preset Colors */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="text-[#737373] self-center">Presets:</span>
                  {popularColorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        if (!colorsList.some((c) => c.name === preset.name)) {
                          setColorsList([...colorsList, preset]);
                        }
                      }}
                      className="px-2 py-0.5 border border-[#E5E5E5] bg-[#F7F7F7] hover:border-[#0A0A0A] rounded flex items-center gap-1"
                    >
                      <span
                        className="w-2 h-2 rounded-full border border-neutral-300"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Add new color input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-9 h-8 p-0.5 border border-[#E5E5E5] bg-white cursor-pointer shrink-0"
                    title="Choose color"
                  />
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Color Name (e.g. Glacier White, Slate Grey)..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-1.5 bg-[#0A0A0A] text-white font-bold uppercase text-[11px] rounded cursor-pointer hover:bg-neutral-800"
                  >
                    + Add Color
                  </button>
                </div>
              </div>

              {/* Dynamic Gallery Additional Images (Add / Remove) */}
              <div className="p-4 border border-[#E5E5E5] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Gallery Additional Images ({galleryImages.length})</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#737373]">
                    Additional angles & lifestyle shots
                  </span>
                </div>

                {galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden group"
                      >
                        <img
                          src={imgUrl}
                          alt="Gallery item"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL to add to product gallery..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="px-4 py-1.5 bg-[#0A0A0A] text-white font-bold uppercase text-[11px] rounded cursor-pointer hover:bg-neutral-800"
                  >
                    + Add Image
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Thermal specs, material composition, cold weather rating (-25°C)..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#E5E5E5]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-[#E5E5E5] text-[#0A0A0A] focus:ring-[#0A0A0A]"
                  />
                  <span className="font-bold text-[#0A0A0A]">Show in Homepage Featured Grid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded border-[#E5E5E5] text-[#0A0A0A] focus:ring-[#0A0A0A]"
                  />
                  <span className="font-bold text-[#0A0A0A]">Show in New Arrivals</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete product "${editingProduct.name}"?`)) {
                        deleteProduct(editingProduct.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold uppercase text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-[#E5E5E5] hover:border-[#0A0A0A] text-[#0A0A0A] uppercase font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white uppercase font-bold shadow-sm cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
