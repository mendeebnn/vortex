import React, { useState } from 'react';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  CheckSquare,
  Upload,
  Sparkles,
  Sliders,
  Move,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HomepageSectionType, HomepageSectionItem } from '../../types';

export const AdminStorefrontEditor: React.FC = () => {
  const {
    storefrontConfig,
    updateStorefrontConfig,
    addHomepageSection,
    removeHomepageSection,
    toggleHomepageSection,
    reorderHomepageSections,
    updateHomepageSection,
    collections,
    setActiveView,
    navigateToHome,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState({ ...storefrontConfig });
  const [newSectionType, setNewSectionType] = useState<HomepageSectionType>('promo_marquee');

  const heroImagePresets = [
    { label: 'Campaign Longline Parka', url: '/src/assets/images/hero_votex_winter_campaign_1792328359846.jpg' },
    { label: 'Black Winter Sneaker', url: '/src/assets/images/product_sneaker_polar_black_1792328359882.jpg' },
    { label: 'Polo Puffer Studio', url: '/src/assets/images/product_jacket_polo_puffer_1792328361605.jpg' },
    { label: 'Turkish Utility Kurtik', url: '/src/assets/images/product_jacket_turkish_parka_1792328361082.jpg' },
    { label: 'Sherpa High-Top', url: '/src/assets/images/product_sneaker_polar_cream_1792328360477.jpg' },
  ];

  const sectionTypeLabels: Record<HomepageSectionType, { label: string; desc: string }> = {
    hero: { label: 'Hero Campaign Banner', desc: 'Prominent headline, CTAs, and campaign imagery' },
    promo_marquee: { label: 'Special Promotional Marquee', desc: 'Continuous scrolling black banner with store announcements' },
    featured: { label: 'Curated Featured Products', desc: 'Products flagged as featured or from featured collection' },
    collections: { label: 'Browse by Collections', desc: 'Category cards showing item counts and explore links' },
    new_arrivals: { label: 'New Season Arrivals', desc: 'Recent product releases with tag badges' },
    trust_pillars: { label: 'Sub-Zero Standards (4-Grid)', desc: '-25°C rating, 24-48h courier, ice-grip traction, hotline' },
    about: { label: 'Brand Story & Philosophy', desc: 'Deep dive into materials, craftsmanship, and store address' },
    instagram: { label: 'Official Instagram Community', desc: 'Live feed grid linking directly to @votex_brand_' },
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'heroImageUrl' | 'logoImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [targetField]: reader.result as string,
        }));
        showToast(`Loaded image for ${targetField === 'heroImageUrl' ? 'Hero Banner' : 'Logo'}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStorefrontConfig(formData);
    showToast('Storefront changes applied and live on website!');
  };

  const handleAddSelectedSection = () => {
    const info = sectionTypeLabels[newSectionType];
    addHomepageSection(newSectionType, info.label);
    // keep local state synced
    setFormData((prev) => ({
      ...prev,
      homepageSections: [
        ...prev.homepageSections,
        {
          id: `sec-${newSectionType}-${Date.now().toString().slice(-4)}`,
          type: newSectionType,
          title: info.label,
          enabled: true,
        },
      ],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
            Storefront Layout & Dynamic Sections
          </h1>
          <p className="text-xs text-[#737373]">
            Add, remove, reorder, and configure every section of the public homepage in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigateToHome();
              setActiveView('store');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E5E5E5] bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Storefront</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Left Column: Homepage Dynamic Sections (Add, Remove, Reorder) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Dynamic Homepage Section Builder */}
          <div className="bg-white border border-[#E5E5E5] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" />
                  <span>Homepage Section Manager (Add / Remove / Reorder)</span>
                </h2>
                <p className="text-xs text-[#737373] mt-0.5">
                  Change the order or add/remove sections. The live homepage reflects this exact order.
                </p>
              </div>

              {/* Add New Section Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value as HomepageSectionType)}
                  className="bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#0A0A0A] py-1.5 px-2.5 focus:outline-none focus:border-[#0A0A0A]"
                >
                  {Object.entries(sectionTypeLabels).map(([type, info]) => (
                    <option key={type} value={type}>
                      {info.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddSelectedSection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-[11px] uppercase tracking-wider rounded cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Section</span>
                </button>
              </div>
            </div>

            {/* List of current sections */}
            <div className="space-y-2.5 pt-3 border-t border-[#E5E5E5]">
              {storefrontConfig.homepageSections.map((section, index) => {
                const info = sectionTypeLabels[section.type] || {
                  label: section.title || section.type,
                  desc: 'Custom Homepage Section',
                };

                return (
                  <div
                    key={section.id}
                    className={`flex items-center justify-between p-3.5 border transition-all ${
                      section.enabled
                        ? 'bg-white border-[#E5E5E5] hover:border-[#0A0A0A]'
                        : 'bg-neutral-50/70 border-neutral-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Position Badge */}
                      <span className="w-6 h-6 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center font-mono font-bold text-[10px] text-[#737373]">
                        {index + 1}
                      </span>

                      {/* Enable/Disable checkbox */}
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => toggleHomepageSection(section.id)}
                        className="w-4 h-4 rounded border-[#E5E5E5] text-[#0A0A0A] focus:ring-[#0A0A0A] cursor-pointer"
                        title="Toggle Section Visibility"
                      />

                      <div>
                        <div className="font-bold text-[#0A0A0A] text-xs flex items-center gap-2">
                          <span>{section.title || info.label}</span>
                          <span className="px-1.5 py-0.2 bg-[#F7F7F7] border border-[#E5E5E5] text-[9px] font-mono text-[#737373] uppercase">
                            {section.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#737373]">{info.desc}</div>
                      </div>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1.5">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => reorderHomepageSections(index, index - 1)}
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] disabled:opacity-20 border border-[#E5E5E5] bg-[#F7F7F7] rounded cursor-pointer"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={index === storefrontConfig.homepageSections.length - 1}
                        onClick={() => reorderHomepageSections(index, index + 1)}
                        className="p-1.5 text-[#737373] hover:text-[#0A0A0A] disabled:opacity-20 border border-[#E5E5E5] bg-[#F7F7F7] rounded cursor-pointer"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Remove Section */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Remove section "${section.title || info.label}" from homepage?`)) {
                            removeHomepageSection(section.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded cursor-pointer ml-1"
                        title="Remove Section from Homepage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {storefrontConfig.homepageSections.length === 0 && (
                <div className="py-8 text-center text-[#737373] text-xs">
                  No sections currently enabled. Click "+ Add Section" above to construct your homepage!
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Brand Identity & Logo */}
          <div className="bg-white border border-[#E5E5E5] p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span>Brand Identity & Logo</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Store Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Product Category Slogan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeCategoryLabel}
                    onChange={(e) => setFormData({ ...formData, storeCategoryLabel: e.target.value })}
                    placeholder="e.g. Winter Outerwear & Footwear"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E5E5]">
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-2">
                  Logo Display Style
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="logoType"
                      checked={formData.logoType === 'text'}
                      onChange={() => setFormData({ ...formData, logoType: 'text' })}
                      className="text-[#0A0A0A] focus:ring-[#0A0A0A]"
                    />
                    <span>Typography Wordmark</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="logoType"
                      checked={formData.logoType === 'image'}
                      onChange={() => setFormData({ ...formData, logoType: 'image' })}
                      className="text-[#0A0A0A] focus:ring-[#0A0A0A]"
                    />
                    <span>Image Logo</span>
                  </label>
                </div>

                {formData.logoType === 'text' ? (
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                      Wordmark Text
                    </label>
                    <input
                      type="text"
                      value={formData.logoText}
                      onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold tracking-widest uppercase font-brand"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                      Logo Image URL or Upload File
                    </label>
                    <input
                      type="text"
                      value={formData.logoImageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
                      placeholder="Paste image URL or choose file below..."
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono mb-2"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F7F7F7] border border-[#E5E5E5] hover:border-[#0A0A0A] cursor-pointer text-[11px] font-mono">
                      <Upload className="w-3.5 h-3.5 text-[#0A0A0A]" />
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logoImageUrl')}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Hero Banner Settings */}
          <div className="bg-white border border-[#E5E5E5] p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Hero Campaign Banner Content</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Hero Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-brand text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.heroCtaText}
                    onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Featured Collection Link
                  </label>
                  <select
                    value={formData.featuredCollectionSlug}
                    onChange={(e) => setFormData({ ...formData, featuredCollectionSlug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A]"
                  >
                    {collections.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hero Image */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Hero Banner Image URL or Upload *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroImageUrl}
                  onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono text-[11px] mb-2"
                />

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] cursor-pointer text-[11px] font-mono font-medium">
                    <Upload className="w-3.5 h-3.5 text-[#0A0A0A]" />
                    <span>Upload Banner File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'heroImageUrl')}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#737373]">or choose preset:</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {heroImagePresets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, heroImageUrl: preset.url })}
                      className={`px-2.5 py-1 text-[10px] font-mono border rounded ${
                        formData.heroImageUrl === preset.url
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : 'bg-[#F7F7F7] text-[#0A0A0A] border-[#E5E5E5]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Promo Marquee & Brand Philosophy Copy */}
          <div className="bg-white border border-[#E5E5E5] p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A]">
              Promotional Marquee & Story Copy
            </h2>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Scrolling Marquee Banner Content
              </label>
              <input
                type="text"
                value={formData.promoMarqueeText || ''}
                onChange={(e) => setFormData({ ...formData, promoMarqueeText: e.target.value })}
                placeholder="e.g. LIMITED DROP · -25°C COLD RESISTANT FOOTWEAR · 24-48H CITY COURIER"
                className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E5E5]">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Brand Philosophy Headline
                </label>
                <input
                  type="text"
                  value={formData.aboutHeadline}
                  onChange={(e) => setFormData({ ...formData, aboutHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Brand Philosophy Body Text
                </label>
                <textarea
                  rows={2}
                  value={formData.aboutText}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Announcement Bar & Quick Live Preview */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Announcement Bar Settings */}
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] mb-3">
              Announcement Bar
            </h2>

            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementActive}
                onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
                className="rounded border-[#E5E5E5] text-[#0A0A0A] focus:ring-[#0A0A0A]"
              />
              <span className="font-bold text-[#0A0A0A]">Enable Top Announcement Bar</span>
            </label>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                Announcement Message
              </label>
              <textarea
                rows={2}
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                disabled={!formData.announcementActive}
                className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] mb-3">
              Hero Live Preview
            </h2>
            <div className="border border-[#E5E5E5] p-3 bg-[#F7F7F7]">
              <div className="text-[10px] font-mono text-[#737373] uppercase mb-1">
                {formData.storeCategoryLabel}
              </div>
              <div className="text-base font-black font-brand text-[#0A0A0A] mb-1 truncate">
                {formData.heroHeadline}
              </div>
              <div className="aspect-video w-full bg-white border border-[#E5E5E5] overflow-hidden mb-2">
                <img
                  src={formData.heroImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[11px] text-[#737373] line-clamp-2">
                {formData.heroSubtitle}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm text-xs space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-[#0A0A0A] pb-1 border-b border-[#E5E5E5]">
              Homepage Layout Summary
            </h3>
            <div className="flex justify-between text-[#737373]">
              <span>Active Sections:</span>
              <span className="font-mono font-bold text-[#0A0A0A]">
                {storefrontConfig.homepageSections.filter((s) => s.enabled).length} of {storefrontConfig.homepageSections.length}
              </span>
            </div>
            <div className="flex justify-between text-[#737373]">
              <span>Collections Visible:</span>
              <span className="font-mono font-bold text-[#0A0A0A]">{collections.length}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer active:scale-95"
          >
            Apply Storefront Changes
          </button>

        </div>

      </form>
    </div>
  );
};
