import React, { useState } from 'react';
import {
  Type,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Upload,
  Eye,
  Sliders,
  Sparkles,
  Check,
  Smartphone,
  Monitor,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLogoStudio: React.FC = () => {
  const { storefrontConfig, updateStorefrontConfig, showToast, navigateToHome, setActiveView } = useApp();

  const [formData, setFormData] = useState({
    logoType: storefrontConfig.logoType || 'text',
    logoText: storefrontConfig.logoText || 'VOTEX',
    logoImageUrl: storefrontConfig.logoImageUrl || '',
    logoFontFamily: storefrontConfig.logoFontFamily || 'Outfit, sans-serif',
    logoLetterSpacing: storefrontConfig.logoLetterSpacing || '0.2em',
    logoFontWeight: storefrontConfig.logoFontWeight || 900,
    logoFontSize: storefrontConfig.logoFontSize || 24,
    logoHeight: storefrontConfig.logoHeight || 32,
    logoColor: storefrontConfig.logoColor || '#0A0A0A',
    logoSymbol: (storefrontConfig.logoSymbol || 'monogram') as 'none' | 'monogram' | 'chevron' | 'diamond' | 'grid',
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  const fontOptions = [
    { label: 'Outfit (Bold Urban / Industrial)', value: 'Outfit, sans-serif' },
    { label: 'JetBrains Mono (Technical / Sub-Zero)', value: "'JetBrains Mono', monospace" },
    { label: 'Plus Jakarta Sans (Modern Geometric)', value: "'Plus Jakarta Sans', sans-serif" },
    { label: 'System Monospace', value: 'ui-monospace, SFMono-Regular, monospace' },
  ];

  const weightOptions = [
    { label: 'Medium (500)', value: 500 },
    { label: 'Bold (700)', value: 700 },
    { label: 'Extra Bold (800)', value: 800 },
    { label: 'Black Heavy (900)', value: 900 },
  ];

  const spacingPresets = [
    { label: 'Standard', value: '0.05em' },
    { label: 'Wide (0.15em)', value: '0.15em' },
    { label: 'Ultra-Wide (0.25em)', value: '0.25em' },
    { label: 'Expanded (0.4em)', value: '0.4em' },
  ];

  const brandPresets = [
    {
      name: 'Default Obsidian Minimalist',
      config: {
        logoType: 'text' as const,
        logoText: 'VOTEX',
        logoFontFamily: 'Outfit, sans-serif',
        logoLetterSpacing: '0.2em',
        logoFontWeight: 900,
        logoFontSize: 24,
      },
    },
    {
      name: 'Technical Sub-Zero Mono',
      config: {
        logoType: 'text' as const,
        logoText: 'VOTEX // BRAND',
        logoFontFamily: "'JetBrains Mono', monospace",
        logoLetterSpacing: '0.15em',
        logoFontWeight: 700,
        logoFontSize: 20,
      },
    },
    {
      name: 'Geometric Editorial',
      config: {
        logoType: 'text' as const,
        logoText: 'VOTEX BRAND',
        logoFontFamily: "'Plus Jakarta Sans', sans-serif",
        logoLetterSpacing: '0.25em',
        logoFontWeight: 800,
        logoFontSize: 22,
      },
    },
    {
      name: 'Spaced Luxury Studio',
      config: {
        logoType: 'text' as const,
        logoText: 'V O T E X',
        logoFontFamily: "'Plus Jakarta Sans', sans-serif",
        logoLetterSpacing: '0.35em',
        logoFontWeight: 700,
        logoFontSize: 22,
      },
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logoType: 'image',
          logoImageUrl: reader.result as string,
        }));
        showToast('Logo image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateStorefrontConfig(formData);
    showToast('Custom logo saved and live on the storefront!');
  };

  const exportLogoAsSvg = () => {
    const text = (formData.logoText || 'VOTEX').toUpperCase();
    const color = formData.logoColor || '#0A0A0A';
    
    let symbolMarkup = '';
    let startX = 20;

    if (formData.logoSymbol === 'monogram') {
      symbolMarkup = `<g stroke="${color}" stroke-width="2" fill="none"><rect x="16" y="14" width="32" height="32" rx="2"/><text x="32" y="37" font-family="${formData.logoFontFamily}" font-size="19" font-weight="900" fill="${color}" stroke="none" text-anchor="middle">V</text></g>`;
      startX = 60;
    } else if (formData.logoSymbol === 'chevron') {
      symbolMarkup = `<text x="16" y="38" font-family="monospace" font-size="22" font-weight="900" fill="${color}">//</text>`;
      startX = 55;
    } else if (formData.logoSymbol === 'diamond') {
      symbolMarkup = `<polygon points="30,15 42,30 30,45 18,30" fill="${color}"/>`;
      startX = 55;
    } else if (formData.logoSymbol === 'grid') {
      symbolMarkup = `<g fill="${color}"><rect x="18" y="18" width="8" height="8"/><rect x="30" y="18" width="8" height="8"/><rect x="18" y="30" width="8" height="8"/><rect x="30" y="30" width="8" height="8"/></g>`;
      startX = 52;
    }

    const estimatedWidth = Math.max(260, text.length * Number(formData.logoFontSize || 24) * 0.95 + startX + 30);

    const svgXml = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${estimatedWidth} 60" width="${estimatedWidth}" height="60">
  <style>
    .wordmark {
      font-family: ${formData.logoFontFamily};
      font-size: ${formData.logoFontSize}px;
      font-weight: ${formData.logoFontWeight};
      letter-spacing: ${formData.logoLetterSpacing};
      fill: ${color};
      text-transform: uppercase;
    }
  </style>
  ${symbolMarkup}
  <text x="${startX}" y="38" class="wordmark">${text}</text>
</svg>`;

    const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `votex-logo-${Date.now().toString().slice(-4)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported logo as SVG file');
  };

  const exportLogoAsPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Transparent canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = formData.logoColor || '#0A0A0A';
    const text = (formData.logoText || 'VOTEX').toUpperCase();
    
    let symbolText = '';
    if (formData.logoSymbol === 'monogram') symbolText = '[V] ';
    else if (formData.logoSymbol === 'chevron') symbolText = '// ';
    else if (formData.logoSymbol === 'diamond') symbolText = '◆ ';
    else if (formData.logoSymbol === 'grid') symbolText = '■ ';

    ctx.fillStyle = color;
    ctx.font = `${formData.logoFontWeight} ${Number(formData.logoFontSize) * 1.6}px Outfit, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(`${symbolText}${text}`, 24, 70);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `votex-logo-${Date.now().toString().slice(-4)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Exported transparent PNG');
    });
  };

  const handleResetToDefault = () => {
    const defaults = {
      logoType: 'text' as const,
      logoText: 'VOTEX',
      logoImageUrl: '',
      logoFontFamily: 'Outfit, sans-serif',
      logoLetterSpacing: '0.2em',
      logoFontWeight: 900,
      logoFontSize: 24,
      logoHeight: 32,
      logoColor: '#0A0A0A',
      logoSymbol: 'monogram' as const,
    };
    setFormData(defaults);
    updateStorefrontConfig(defaults);
    showToast('Reset logo to default VOTEX configuration');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#0A0A0A] text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded">
              STUDIO
            </span>
            <h1 className="text-2xl font-black font-brand uppercase tracking-wider text-[#0A0A0A]">
              Custom Logo Editor
            </h1>
          </div>
          <p className="text-xs text-[#737373]">
            Customize the brand identity, typography wordmark, letter spacing, and image insignia across the entire store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export SVG */}
          <button
            type="button"
            onClick={exportLogoAsSvg}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E5E5E5] bg-white hover:bg-neutral-100 text-xs font-mono text-[#0A0A0A] cursor-pointer shadow-xs"
            title="Download vector SVG file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SVG</span>
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={exportLogoAsPng}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E5E5E5] bg-white hover:bg-neutral-100 text-xs font-mono text-[#0A0A0A] cursor-pointer shadow-xs"
            title="Download transparent PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigateToHome();
              setActiveView('store');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E5E5E5] bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 hover:bg-neutral-100 text-xs font-mono text-[#737373] hover:text-[#0A0A0A] cursor-pointer"
            title="Reset to default brand logo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Logo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Column: Studio Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Logo Format Selection */}
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Logo Format</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoType: 'text' })}
                className={`p-4 border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  formData.logoType === 'text'
                    ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                    : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#0A0A0A] hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold uppercase tracking-wider text-xs">Typography Wordmark</span>
                  <Type className="w-4 h-4" />
                </div>
                <span className={`text-[11px] ${formData.logoType === 'text' ? 'text-neutral-300' : 'text-[#737373]'}`}>
                  Crisp minimalist vector fonts with sub-zero tracking
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoType: 'image' })}
                className={`p-4 border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  formData.logoType === 'image'
                    ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                    : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#0A0A0A] hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold uppercase tracking-wider text-xs">Image / SVG Logo</span>
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] ${formData.logoType === 'image' ? 'text-neutral-300' : 'text-[#737373]'}`}>
                  Upload custom PNG, SVG mark, or emblem file
                </span>
              </button>
            </div>
          </div>

          {/* Typography Controls (if text mode) */}
          {formData.logoType === 'text' && (
            <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                <Type className="w-4 h-4" />
                <span>Typography Wordmark Settings</span>
              </h2>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Brand Wordmark Text *
                </label>
                <input
                  type="text"
                  required
                  value={formData.logoText}
                  onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                  placeholder="e.g. VOTEX"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-bold text-sm tracking-wider uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Font Family
                  </label>
                  <select
                    value={formData.logoFontFamily}
                    onChange={(e) => setFormData({ ...formData, logoFontFamily: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  >
                    {fontOptions.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Font Weight
                  </label>
                  <select
                    value={formData.logoFontWeight}
                    onChange={(e) => setFormData({ ...formData, logoFontWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] focus:outline-none"
                  >
                    {weightOptions.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                    Letter Spacing (Tracking)
                  </label>
                  <span className="font-mono text-[#737373] text-[11px]">{formData.logoLetterSpacing}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {spacingPresets.map((sp) => (
                    <button
                      key={sp.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, logoLetterSpacing: sp.value })}
                      className={`px-2.5 py-1 text-[10px] font-mono border rounded cursor-pointer ${
                        formData.logoLetterSpacing === sp.value
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : 'bg-[#F7F7F7] text-[#0A0A0A] border-[#E5E5E5] hover:border-neutral-400'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Insignia / Symbol */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                  Brand SVG Symbol Insignia
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'monogram', label: '[ V ] Box', preview: '[ V ]' },
                    { id: 'chevron', label: '// Slashes', preview: '//' },
                    { id: 'diamond', label: '◆ Diamond', preview: '◆' },
                    { id: 'grid', label: '■ Matrix', preview: '■' },
                    { id: 'none', label: 'None', preview: '—' },
                  ].map((sym) => (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, logoSymbol: sym.id as any })}
                      className={`py-2 px-1 text-center border rounded cursor-pointer transition-colors ${
                        formData.logoSymbol === sym.id
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] font-bold'
                          : 'bg-[#F7F7F7] text-[#0A0A0A] border-[#E5E5E5] hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-sm font-mono">{sym.preview}</div>
                      <div className="text-[9px] font-mono mt-0.5 truncate">{sym.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Picker & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                    Wordmark Ink Color
                  </label>
                  <span className="font-mono text-[#737373] text-[11px]">{formData.logoColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Obsidian Black', hex: '#0A0A0A' },
                    { label: 'Glacier Charcoal', hex: '#374151' },
                    { label: 'Platinum Silver', hex: '#9CA3AF' },
                    { label: 'Pure White', hex: '#FFFFFF' },
                  ].map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, logoColor: col.hex })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono border rounded cursor-pointer ${
                        formData.logoColor === col.hex
                          ? 'border-[#0A0A0A] bg-neutral-100 font-bold'
                          : 'border-[#E5E5E5] bg-[#F7F7F7] hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.label}</span>
                    </button>
                  ))}
                  <input
                    type="color"
                    value={formData.logoColor}
                    onChange={(e) => setFormData({ ...formData, logoColor: e.target.value })}
                    className="w-7 h-7 p-0 border border-[#E5E5E5] cursor-pointer bg-transparent ml-auto"
                    title="Custom hex color"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                    Logo Scale / Font Size
                  </label>
                  <span className="font-mono text-[#737373] text-[11px]">{formData.logoFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="36"
                  step="1"
                  value={formData.logoFontSize}
                  onChange={(e) => setFormData({ ...formData, logoFontSize: Number(e.target.value) })}
                  className="w-full accent-[#0A0A0A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#737373] font-mono mt-1">
                  <span>16px (Subtle)</span>
                  <span>24px (Standard)</span>
                  <span>36px (Statement)</span>
                </div>
              </div>
            </div>
          )}

          {/* Image Logo Controls (if image mode) */}
          {formData.logoType === 'image' && (
            <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Custom Image or Vector Logo</span>
              </h2>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Image File Upload
                </label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E5E5E5] hover:border-[#0A0A0A] bg-[#F7F7F7] cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 text-[#737373] group-hover:text-[#0A0A0A] mb-2" />
                  <span className="font-bold uppercase tracking-wider text-xs text-[#0A0A0A]">
                    Click to select logo file
                  </span>
                  <span className="text-[11px] text-[#737373] mt-0.5">
                    Supports PNG with transparency, SVG, JPG, or WebP
                  </span>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  value={formData.logoImageUrl}
                  onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
                  placeholder="https://example.com/logo.svg"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#0A0A0A] text-[#0A0A0A] font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                    Logo Height Limit
                  </label>
                  <span className="font-mono text-[#737373] text-[11px]">{formData.logoHeight}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="2"
                  value={formData.logoHeight}
                  onChange={(e) => setFormData({ ...formData, logoHeight: Number(e.target.value) })}
                  className="w-full accent-[#0A0A0A] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Quick Design Presets */}
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>One-Click Design Presets</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {brandPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, ...preset.config }))}
                  className="p-3 border border-[#E5E5E5] hover:border-[#0A0A0A] bg-[#F7F7F7] text-left rounded transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#0A0A0A] uppercase tracking-wider group-hover:text-black">
                    {preset.name}
                  </div>
                  <div
                    style={{
                      fontFamily: preset.config.logoFontFamily,
                      letterSpacing: preset.config.logoLetterSpacing,
                      fontWeight: preset.config.logoFontWeight,
                    }}
                    className="text-xs text-neutral-800 mt-1 uppercase"
                  >
                    {preset.config.logoText}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Canvas Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-[#E5E5E5] p-5 shadow-sm space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#0A0A0A]">
                Live Store Simulation
              </h2>
              <div className="flex items-center gap-1 border border-[#E5E5E5] p-0.5 rounded bg-[#F7F7F7]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-white shadow-xs text-black' : 'text-[#737373]'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-white shadow-xs text-black' : 'text-[#737373]'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Header Navbar */}
            <div>
              <div className="text-[10px] font-mono text-[#737373] uppercase mb-1 flex items-center justify-between">
                <span>Header Navbar Simulation</span>
                <span className="text-[9px] bg-neutral-100 px-1.5 py-0.5 rounded">Light</span>
              </div>

              <div className="border border-[#E5E5E5] bg-white p-3.5 shadow-sm rounded-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center">
                    {formData.logoType === 'image' && formData.logoImageUrl ? (
                      <img
                        src={formData.logoImageUrl}
                        alt="Logo Preview"
                        style={{ maxHeight: `${formData.logoHeight}px` }}
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center" style={{ color: formData.logoColor || '#0A0A0A' }}>
                        {formData.logoSymbol === 'monogram' && (
                          <span className="font-mono text-xs px-1.5 py-0.5 border border-current rounded-xs mr-2 font-bold leading-none">
                            [V]
                          </span>
                        )}
                        {formData.logoSymbol === 'chevron' && (
                          <span className="font-mono text-xs mr-1.5 font-bold leading-none">
                            //
                          </span>
                        )}
                        {formData.logoSymbol === 'diamond' && (
                          <span className="text-xs mr-1.5 leading-none">
                            ◆
                          </span>
                        )}
                        {formData.logoSymbol === 'grid' && (
                          <span className="text-[10px] mr-1.5 leading-none">
                            ■
                          </span>
                        )}
                        <span
                          style={{
                            fontFamily: formData.logoFontFamily,
                            letterSpacing: formData.logoLetterSpacing,
                            fontWeight: formData.logoFontWeight,
                            fontSize: `${formData.logoFontSize}px`,
                          }}
                          className="uppercase select-none leading-none tracking-widest"
                        >
                          {formData.logoText || 'VOTEX'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#737373]">
                    <span className="hidden sm:inline">SHOP ALL</span>
                    <span className="hidden sm:inline">COLLECTIONS</span>
                    <span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[9px] font-bold">
                      0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Footer Navbar */}
            <div>
              <div className="text-[10px] font-mono text-[#737373] uppercase mb-1 flex items-center justify-between">
                <span>Footer Brand Block Simulation</span>
                <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">Dark</span>
              </div>

              <div className="border border-neutral-900 bg-[#0A0A0A] p-4 text-white rounded-sm">
                <div className="flex items-center mb-2">
                  {formData.logoType === 'image' && formData.logoImageUrl ? (
                    <img
                      src={formData.logoImageUrl}
                      alt="Logo Preview"
                      style={{ maxHeight: `${formData.logoHeight}px` }}
                      className="object-contain filter invert"
                    />
                  ) : (
                    <div className="flex items-center text-white">
                      {formData.logoSymbol === 'monogram' && (
                        <span className="font-mono text-xs px-1.5 py-0.5 border border-white/80 rounded-xs mr-2 font-bold leading-none">
                          [V]
                        </span>
                      )}
                      {formData.logoSymbol === 'chevron' && (
                        <span className="font-mono text-xs mr-1.5 font-bold leading-none text-white">
                          //
                        </span>
                      )}
                      {formData.logoSymbol === 'diamond' && (
                        <span className="text-xs mr-1.5 leading-none text-white">
                          ◆
                        </span>
                      )}
                      {formData.logoSymbol === 'grid' && (
                        <span className="text-[10px] mr-1.5 leading-none text-white">
                          ■
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: formData.logoFontFamily,
                          letterSpacing: formData.logoLetterSpacing,
                          fontWeight: formData.logoFontWeight,
                          fontSize: `${Math.max(18, formData.logoFontSize - 2)}px`,
                        }}
                        className="text-white uppercase select-none leading-none tracking-widest"
                      >
                        {formData.logoText || 'VOTEX'}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Sub-zero winter technical outerwear and footwear concept store.
                </p>
              </div>
            </div>

            {/* Product Tag Simulation */}
            <div className="border border-[#E5E5E5] bg-[#F7F7F7] p-3 rounded-sm text-center">
              <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block mb-1">
                Woven Label Simulation
              </span>
              <div className="inline-block bg-white border border-[#E5E5E5] px-4 py-2 shadow-xs">
                <span
                  style={{
                    fontFamily: formData.logoFontFamily,
                    letterSpacing: formData.logoLetterSpacing,
                    fontWeight: formData.logoFontWeight,
                  }}
                  className="text-xs text-[#0A0A0A] uppercase"
                >
                  {formData.logoText || 'VOTEX'}
                </span>
                <span className="block text-[8px] font-mono text-[#737373] tracking-widest mt-0.5">
                  -25°C SUB-ZERO
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => handleSave()}
              className="w-full py-3.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Publish Logo</span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
