import React, { useState } from 'react';
import { X, Plus, Trash2, Wand2, Check, Copy, Layers, Sparkles, PlusCircle, RotateCcw } from 'lucide-react';
import { Product, ProductVariant, FootwearCategory, FootwearBrand } from '../../types/database';
import { useTranslation } from '../../i18n/LanguageContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (product: any) => void;
}

const CATEGORIES: FootwearCategory[] = [
  "Men's Shoes",
  "Women's Shoes",
  "Kids' Shoes",
  "Sports Shoes",
  "Formal Shoes",
  "Casual Shoes",
  "Sandals",
  "Slippers",
  "Boots",
  "School Shoes",
  "Other Footwear"
];

const BRANDS = ['Campus', 'Sparx', 'Bata', 'Relaxo', 'Red Chief', 'Liberty', 'Action', 'Paragon', 'Puma', 'Nike', 'Adidas', 'Local / Unbranded'];

const INDIAN_SIZES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MEN_SIZES = ['6', '7', '8', '9', '10', '11'];
const WOMEN_SIZES = ['3', '4', '5', '6', '7', '8'];
const KIDS_SIZES = ['1', '2', '3', '4', '5'];
const POPULAR_COLORS = ['Black', 'Brown', 'Tan', 'White', 'Navy', 'Grey', 'Cherry', 'Olive', 'Beige', 'Red'];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [brand, setBrand] = useState(product?.brand || 'Campus');
  const [category, setCategory] = useState<FootwearCategory>(product?.category || 'Sports Shoes');
  const [gender, setGender] = useState<Product['gender']>(product?.gender || 'Men');
  const [hsnCode, setHsnCode] = useState(product?.hsnCode || '6404');
  const [gstRate, setGstRate] = useState<number>(product?.gstRate || 12);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80');

  // Variant Matrix
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [
      {
        id: `var-${Date.now()}-1`,
        productId: product?.id || '',
        sku: 'CAMP-7',
        barcode: '890123400701',
        size: '7',
        color: 'Black',
        purchaseCost: 650,
        mrp: 1499,
        sellingPrice: 1299,
        stockQuantity: 10,
        reorderLevel: 3
      }
    ]
  );

  // Quick Multi-Variant Generator State
  const [quickSizes, setQuickSizes] = useState<string[]>(['6', '7', '8', '9', '10']);
  const [colorInputValue, setColorInputValue] = useState<string>('Black');
  const [quickCost, setQuickCost] = useState<number>(600);
  const [quickMrp, setQuickMrp] = useState<number>(1299);
  const [quickSelling, setQuickSelling] = useState<number>(1099);
  const [quickStock, setQuickStock] = useState<number>(8);

  // Bulk Edit Bar
  const [showBulkEdit, setShowBulkEdit] = useState<boolean>(false);
  const [bulkCost, setBulkCost] = useState<string>('');
  const [bulkMrp, setBulkMrp] = useState<string>('');
  const [bulkSelling, setBulkSelling] = useState<string>('');
  const [bulkStock, setBulkStock] = useState<string>('');

  if (!isOpen) return null;

  // Parse colors from comma-separated input
  const parsedColors = Array.from(
    new Set(
      colorInputValue
        .split(',')
        .map(c => c.trim())
        .filter(Boolean)
    )
  );
  const effectiveColors = parsedColors.length > 0 ? parsedColors : ['Black'];
  const totalCombinations = quickSizes.length * effectiveColors.length;

  // Add / Toggle color tag in quick matrix
  const handleToggleColor = (colorName: string) => {
    if (parsedColors.includes(colorName)) {
      const remaining = parsedColors.filter(c => c !== colorName);
      setColorInputValue(remaining.join(', '));
    } else {
      const updated = [...parsedColors, colorName];
      setColorInputValue(updated.join(', '));
    }
  };

  // Generate multiple size × color variants
  const handleGenerateVariants = (mode: 'append' | 'replace' = 'append') => {
    if (quickSizes.length === 0) return;
    const prefix = (brand || 'LOC').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'SBH';
    const timestamp = Date.now().toString().slice(-6);

    const generated: ProductVariant[] = [];
    let counter = 0;

    for (const color of effectiveColors) {
      const colorCode = color.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'CLR';
      for (const size of quickSizes) {
        counter++;
        const id = `var-${Date.now()}-${counter}-${Math.floor(100 + Math.random() * 900)}`;
        const sku = `${prefix}-${size}-${colorCode}`;
        const barcode = `890${timestamp}${size.padStart(2, '0')}${counter % 10}`;

        generated.push({
          id,
          productId: product?.id || '',
          sku,
          barcode,
          size,
          color,
          purchaseCost: quickCost,
          mrp: quickMrp,
          sellingPrice: quickSelling,
          stockQuantity: quickStock,
          reorderLevel: 2
        });
      }
    }

    if (mode === 'replace') {
      setVariants(generated);
    } else {
      // Append mode: retain current variants and append new ones (skipping exact size+color duplicates)
      setVariants(prev => {
        const existingKeys = new Set(prev.map(v => `${v.size.trim().toLowerCase()}__${v.color.trim().toLowerCase()}`));
        const newToAdd = generated.filter(g => !existingKeys.has(`${g.size.trim().toLowerCase()}__${g.color.trim().toLowerCase()}`));
        return [...prev, ...newToAdd];
      });
    }
  };

  const handleAddManualVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: product?.id || '',
      sku: `${(brand || 'LOC').slice(0, 3).toUpperCase()}-NEW`,
      barcode: `890${Date.now().toString().slice(-7)}`,
      size: '8',
      color: effectiveColors[0] || 'Black',
      purchaseCost: quickCost || 500,
      mrp: quickMrp || 999,
      sellingPrice: quickSelling || 899,
      stockQuantity: quickStock || 5,
      reorderLevel: 2
    };
    setVariants(prev => [...prev, newVar]);
  };

  // Duplicate an existing variant
  const handleDuplicateVariant = (index: number) => {
    const source = variants[index];
    const duplicated: ProductVariant = {
      ...source,
      id: `var-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      sku: `${source.sku}-COPY`,
      barcode: `890${Date.now().toString().slice(-7)}`
    };
    const updated = [...variants];
    updated.splice(index + 1, 0, duplicated);
    setVariants(updated);
  };

  // Bulk edit all variants at once
  const handleApplyBulkEdit = () => {
    setVariants(prev => prev.map(v => ({
      ...v,
      purchaseCost: bulkCost !== '' ? Number(bulkCost) : v.purchaseCost,
      mrp: bulkMrp !== '' ? Number(bulkMrp) : v.mrp,
      sellingPrice: bulkSelling !== '' ? Number(bulkSelling) : v.sellingPrice,
      stockQuantity: bulkStock !== '' ? Number(bulkStock) : v.stockQuantity,
    })));
    setShowBulkEdit(false);
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, val: any) => {
    setVariants(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(product ? { id: product.id } : {}),
      name,
      description,
      brand,
      category,
      gender,
      hsnCode,
      gstRate,
      imageUrl,
      status: 'active',
      variants
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[94vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <h3 className="text-base font-bold text-slate-900">
            {product ? 'Edit Footwear Product & Variants' : 'Add New Footwear Product'}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Base Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Footwear Model / Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Campus OXYFIT Running Shoes"
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs bg-white font-medium"
              >
                {BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs bg-white font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Gender / Target</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs bg-white font-medium"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">HSN Code</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">GST Rate (%)</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs bg-white font-medium"
              >
                <option value={5}>5% (MRP &le; ₹1000)</option>
                <option value={12}>12% (MRP &gt; ₹1000)</option>
                <option value={18}>18% (Leather / Special)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs"
            />
          </div>

          {/* Quick Footwear Variant Matrix Generator Widget */}
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                  <Wand2 className="h-4 w-4" />
                  <span>Auto-Generate Multiple Variants Matrix</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select sizes and enter multiple colors (e.g. Black, Tan) to generate all variants at once.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleGenerateVariants('append')}
                  disabled={quickSizes.length === 0}
                  className="flex items-center gap-1 rounded bg-blue-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>+ Add {totalCombinations} Variant{totalCombinations !== 1 ? 's' : ''}</span>
                </button>
                {variants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleGenerateVariants('replace')}
                    disabled={quickSizes.length === 0}
                    title="Replace all existing variants with this new matrix"
                    className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-700 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Replace All</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs pt-1">
              {/* Size Curve Presets & Selection */}
              <div className="md:col-span-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700">Select Sizes (UK/India):</label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setQuickSizes(MEN_SIZES)}
                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium"
                    >
                      Men (6-11)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickSizes(WOMEN_SIZES)}
                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium"
                    >
                      Women (3-8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickSizes(KIDS_SIZES)}
                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium"
                    >
                      Kids (1-5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickSizes(INDIAN_SIZES)}
                      className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 hover:bg-blue-200 font-medium"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickSizes([])}
                      className="px-1.5 py-0.5 rounded text-rose-600 hover:bg-rose-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {INDIAN_SIZES.map(sz => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => {
                        setQuickSizes(prev =>
                          prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
                        );
                      }}
                      className={`h-6 w-6 rounded text-[11px] font-bold border transition-colors ${
                        quickSizes.includes(sz)
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors - Supports Multiple Colors */}
              <div className="md:col-span-3 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700">
                    Colours ({effectiveColors.length}):
                  </label>
                  <span className="text-[10px] text-slate-400">Separate by comma for multi-color</span>
                </div>
                <input
                  type="text"
                  value={colorInputValue}
                  onChange={(e) => setColorInputValue(e.target.value)}
                  placeholder="e.g. Black, Tan, Brown"
                  className="w-full rounded border border-slate-300 bg-white py-1.5 px-2.5 text-xs font-medium focus:ring-1 focus:ring-blue-900"
                />
                {/* Popular color quick chips */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {POPULAR_COLORS.map(col => {
                    const isSelected = parsedColors.includes(col);
                    return (
                      <button
                        type="button"
                        key={col}
                        onClick={() => handleToggleColor(col)}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                          isSelected
                            ? 'bg-blue-900 text-white border-blue-900 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? `✓ ${col}` : `+ ${col}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Stock defaults */}
              <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-blue-200/60">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Cost Price (₹):</label>
                  <input
                    type="number"
                    value={quickCost}
                    onChange={(e) => setQuickCost(Number(e.target.value))}
                    className="mt-0.5 w-full rounded border border-slate-300 bg-white py-1 px-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600">MRP (₹):</label>
                  <input
                    type="number"
                    value={quickMrp}
                    onChange={(e) => setQuickMrp(Number(e.target.value))}
                    className="mt-0.5 w-full rounded border border-slate-300 bg-white py-1 px-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Selling Price / Rate (₹):</label>
                  <input
                    type="number"
                    value={quickSelling}
                    onChange={(e) => setQuickSelling(Number(e.target.value))}
                    className="mt-0.5 w-full rounded border border-slate-300 bg-white py-1 px-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Initial Stock per Size:</label>
                  <input
                    type="number"
                    value={quickStock}
                    onChange={(e) => setQuickStock(Number(e.target.value))}
                    className="mt-0.5 w-full rounded border border-slate-300 bg-white py-1 px-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="text-[11px] text-blue-900 font-medium bg-blue-100/70 rounded px-2.5 py-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                <span>
                  Combinations: <strong>{quickSizes.length} sizes</strong> ({quickSizes.join(', ') || 'None'}) × <strong>{effectiveColors.length} colors</strong> ({effectiveColors.join(', ')}) = <strong>{totalCombinations} variants</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleGenerateVariants('append')}
                disabled={quickSizes.length === 0}
                className="underline font-bold text-blue-900 hover:text-blue-950"
              >
                Add All Now →
              </button>
            </div>
          </div>

          {/* Variants Table Header & Actions */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Product Footwear Variants ({variants.length})
                </h4>
                <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                  {variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)} pairs total in stock
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowBulkEdit(!showBulkEdit)}
                  className={`flex items-center gap-1 rounded border px-2.5 py-1 font-semibold transition-colors ${
                    showBulkEdit ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  title="Bulk edit prices or stock across all variants"
                >
                  <Layers className="h-3 w-3" />
                  <span>Bulk Edit</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddManualVariant}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Single Variant</span>
                </button>

                {variants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all variants?')) {
                        setVariants([]);
                      }
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-800"
                  >
                    Clear Table
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Edit Toolbar */}
            {showBulkEdit && (
              <div className="mb-2 p-2.5 bg-slate-100 rounded border border-slate-300 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-700">Bulk Apply to All Variants:</span>
                <input
                  type="number"
                  placeholder="Cost ₹"
                  value={bulkCost}
                  onChange={(e) => setBulkCost(e.target.value)}
                  className="w-20 rounded border border-slate-300 bg-white py-1 px-1.5 text-xs font-mono"
                />
                <input
                  type="number"
                  placeholder="MRP ₹"
                  value={bulkMrp}
                  onChange={(e) => setBulkMrp(e.target.value)}
                  className="w-20 rounded border border-slate-300 bg-white py-1 px-1.5 text-xs font-mono"
                />
                <input
                  type="number"
                  placeholder="Rate ₹"
                  value={bulkSelling}
                  onChange={(e) => setBulkSelling(e.target.value)}
                  className="w-20 rounded border border-slate-300 bg-white py-1 px-1.5 text-xs font-mono"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  className="w-16 rounded border border-slate-300 bg-white py-1 px-1.5 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyBulkEdit}
                  className="rounded bg-blue-900 px-3 py-1 font-bold text-white hover:bg-blue-800"
                >
                  Apply All
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkEdit(false)}
                  className="text-slate-500 hover:text-slate-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="py-2 px-2">Size</th>
                    <th className="py-2 px-2">Color</th>
                    <th className="py-2 px-2">SKU</th>
                    <th className="py-2 px-2">Barcode</th>
                    <th className="py-2 px-2">Cost (₹)</th>
                    <th className="py-2 px-2">MRP (₹)</th>
                    <th className="py-2 px-2">Rate (₹)</th>
                    <th className="py-2 px-2">Stock</th>
                    <th className="py-2 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-slate-400">
                        No variants added yet. Use the <strong>Auto-Generate Matrix</strong> above or click <strong>Add Single Variant</strong>.
                      </td>
                    </tr>
                  ) : (
                    variants.map((v, idx) => (
                      <tr key={v.id || idx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={v.size}
                            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                            className="w-12 rounded border border-slate-200 py-1 px-1.5 text-center font-bold"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={v.color}
                            onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                            className="w-20 rounded border border-slate-200 py-1 px-1.5 text-xs"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                            className="w-24 rounded border border-slate-200 py-1 px-1.5 text-xs font-mono"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={v.barcode}
                            onChange={(e) => handleVariantChange(idx, 'barcode', e.target.value)}
                            className="w-28 rounded border border-slate-200 py-1 px-1.5 text-xs font-mono"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="number"
                            value={v.purchaseCost}
                            onChange={(e) => handleVariantChange(idx, 'purchaseCost', Number(e.target.value))}
                            className="w-16 rounded border border-slate-200 py-1 px-1.5 text-xs font-mono"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="number"
                            value={v.mrp}
                            onChange={(e) => handleVariantChange(idx, 'mrp', Number(e.target.value))}
                            className="w-16 rounded border border-slate-200 py-1 px-1.5 text-xs font-mono"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="number"
                            value={v.sellingPrice}
                            onChange={(e) => handleVariantChange(idx, 'sellingPrice', Number(e.target.value))}
                            className="w-16 rounded border border-slate-200 py-1 px-1.5 text-xs font-bold font-mono"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="number"
                            value={v.stockQuantity}
                            onChange={(e) => handleVariantChange(idx, 'stockQuantity', Number(e.target.value))}
                            className="w-14 rounded border border-slate-200 py-1 px-1.5 text-xs font-bold text-center"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicateVariant(idx)}
                              title="Duplicate this variant"
                              className="text-slate-400 hover:text-blue-900 p-0.5 rounded hover:bg-slate-100"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              title="Delete variant"
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-slate-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-blue-900 px-5 py-2 text-xs font-bold text-white hover:bg-blue-800"
            >
              <Check className="h-4 w-4" />
              <span>Save Footwear &amp; Variants</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
