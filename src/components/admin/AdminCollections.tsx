import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Eye, Layers, ArrowUpRight, Check, PackagePlus, MinusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Collection } from '../../types';

export const AdminCollections: React.FC = () => {
  const {
    collections,
    products,
    addCollection,
    updateCollection,
    deleteCollection,
    assignProductToCollection,
    navigateToShop,
    setActiveView,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Selected collection for inspecting and managing products inside it
  const [selectedColForProducts, setSelectedColForProducts] = useState<string | null>(null);
  const [productToAddId, setProductToAddId] = useState<string>('');

  const imagePresets = [
    { label: 'Winter Footwear', url: '/src/assets/images/product_sneaker_polar_black_1792328359882.jpg' },
    { label: 'Polo Outerwear', url: '/src/assets/images/product_jacket_polo_puffer_1792328361605.jpg' },
    { label: 'Turkish Kurtiks', url: '/src/assets/images/product_jacket_turkish_parka_1792328361082.jpg' },
    { label: 'Sherpa High-Top', url: '/src/assets/images/product_sneaker_polar_cream_1792328360477.jpg' },
    { label: 'Winter Campaign', url: '/src/assets/images/hero_votex_winter_campaign_1792328359846.jpg' },
  ];

  const openAddModal = () => {
    setEditingCollection(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage(imagePresets[0].url);
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description || '');
    setImage(col.image || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name,
        slug: finalSlug,
        description,
        image,
      });
    } else {
      addCollection({
        name,
        slug: finalSlug,
        description,
        image,
      });
    }
    setIsModalOpen(false);
  };

  const handleAssignProduct = (colSlug: string) => {
    if (!productToAddId) return;
    assignProductToCollection(productToAddId, colSlug);
    setProductToAddId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
            Collections & Categories
          </h1>
          <p className="text-xs text-[#737373]">
            Total {collections.length} collections · Organize products, create seasonal drops, and control store navigation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const colProducts = products.filter((p) => p.collectionSlug === col.slug);
          const isManagingProducts = selectedColForProducts === col.slug;
          const unassignedProducts = products.filter((p) => p.collectionSlug !== col.slug);

          return (
            <div
              key={col.id}
              className="bg-white border border-[#E5E5E5] p-5 flex flex-col justify-between shadow-sm hover:border-[#0A0A0A] transition-colors"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden mb-4">
                  {col.image ? (
                    <img
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#737373]">
                      NO COVER IMAGE
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-white border border-[#E5E5E5] text-[10px] font-mono text-[#0A0A0A] uppercase font-bold">
                    {colProducts.length} items
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-base font-bold text-[#0A0A0A] font-brand">
                    {col.name}
                  </h3>
                  <span className="text-[11px] font-mono text-[#737373]">
                    /{col.slug}
                  </span>
                </div>

                <p className="text-xs text-[#737373] line-clamp-2 mb-4 leading-relaxed">
                  {col.description || 'No description configured.'}
                </p>

                {/* Manage Items Accordion */}
                <div className="mb-4 pt-3 border-t border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setSelectedColForProducts(isManagingProducts ? null : col.slug)}
                    className="text-xs font-mono text-[#0A0A0A] hover:underline font-bold flex items-center justify-between w-full"
                  >
                    <span>Products inside ({colProducts.length})</span>
                    <span>{isManagingProducts ? '▲ Hide' : '▼ Manage'}</span>
                  </button>

                  {isManagingProducts && (
                    <div className="mt-3 space-y-2.5 bg-[#F7F7F7] p-3 border border-[#E5E5E5] text-xs">
                      {/* Products list with remove */}
                      {colProducts.length > 0 ? (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {colProducts.map((cp) => (
                            <div
                              key={cp.id}
                              className="flex items-center justify-between p-1.5 bg-white border border-[#E5E5E5] text-[11px]"
                            >
                              <span className="truncate max-w-[160px] font-bold text-[#0A0A0A]">
                                {cp.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => assignProductToCollection(cp.id, 'unassigned')}
                                className="text-[#737373] hover:text-rose-600 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                                title="Remove product from this collection"
                              >
                                <MinusCircle className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#737373] italic">
                          No products assigned to this collection yet.
                        </div>
                      )}

                      {/* Add Product Dropdown */}
                      {unassignedProducts.length > 0 && (
                        <div className="pt-2 border-t border-[#E5E5E5] flex gap-1.5">
                          <select
                            value={productToAddId}
                            onChange={(e) => setProductToAddId(e.target.value)}
                            className="flex-1 bg-white border border-[#E5E5E5] text-[11px] py-1 px-2 focus:outline-none"
                          >
                            <option value="">Select product to add...</option>
                            {unassignedProducts.map((up) => (
                              <option key={up.id} value={up.id}>
                                {up.name} ({up.collectionSlug})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssignProduct(col.slug)}
                            disabled={!productToAddId}
                            className="px-2.5 py-1 bg-[#0A0A0A] disabled:opacity-40 text-white text-[10px] font-bold uppercase rounded cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                {/* View on live store */}
                <button
                  onClick={() => {
                    navigateToShop(col.slug);
                    setActiveView('store');
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0A0A0A] hover:underline cursor-pointer"
                >
                  <span>View on Store</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(col)}
                    className="p-1.5 text-[#737373] hover:text-[#0A0A0A] hover:bg-neutral-100 rounded cursor-pointer"
                    title="Edit Collection Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete collection "${col.name}"? Products inside will remain in the catalogue.`)) {
                        deleteCollection(col.id);
                      }
                    }}
                    className="p-1.5 text-[#737373] hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {collections.length === 0 && (
        <div className="py-16 text-center text-[#737373] text-xs bg-white border border-[#E5E5E5]">
          No collections found.{' '}
          <button
            onClick={openAddModal}
            className="text-[#0A0A0A] font-bold underline ml-1 cursor-pointer"
          >
            Create your first collection
          </button>
        </div>
      )}

      {/* Add / Edit Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E5E5E5] shadow-2xl p-6 sm:p-8 my-8 text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black font-brand uppercase tracking-wider text-[#0A0A0A] mb-1">
              {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create New Collection'}
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              Define category name, URL slug identifier, and promotional cover image.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCollection) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Winter Footwear"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Slug Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="winter-footwear"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of products featured in this collection..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste image URL..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono text-[11px] focus:outline-none mb-2"
                />

                <div className="flex flex-wrap gap-1.5">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className="px-2 py-1 text-[10px] font-mono border border-[#E5E5E5] bg-[#F7F7F7] hover:border-[#0A0A0A] rounded"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                {editingCollection ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete collection "${editingCollection.name}"?`)) {
                        deleteCollection(editingCollection.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold uppercase text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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
                    className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white uppercase font-bold cursor-pointer"
                  >
                    {editingCollection ? 'Update Collection' : 'Create Collection'}
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
