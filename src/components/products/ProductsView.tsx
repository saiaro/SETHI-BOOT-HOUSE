import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Barcode,
  Upload,
  Download,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { Product } from '../../types/database';
import { ProductModal } from './ProductModal';
import { BarcodePrintModal } from './BarcodePrintModal';

export const ProductsView: React.FC = () => {
  const { products, saveProduct, archiveProduct, bulkImportProducts } = useStore();
  const { t, formatINR } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | undefined>(undefined);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()) || v.barcode.includes(searchQuery));

      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      const isLowStock = p.variants.some(v => v.stockQuantity > 0 && v.stockQuantity <= v.reorderLevel);
      const isOut = totalStock === 0;

      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = totalStock > 0;
      if (stockFilter === 'low_stock') matchesStock = isLowStock;
      if (stockFilter === 'out_of_stock') matchesStock = isOut;

      return matchesSearch && matchesBrand && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedBrand, selectedCategory, stockFilter]);

  // Duplicate Product
  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      variants: product.variants.map((v, i) => ({
        ...v,
        id: `var-${Date.now()}-${i}`,
        sku: `${v.sku}-CP`,
        barcode: `890${Date.now().toString().slice(-6)}${i}`
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveProduct(duplicated);
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['Product Name', 'Brand', 'Category', 'Size', 'Color', 'SKU', 'Barcode', 'Cost', 'MRP', 'Selling Price', 'Stock'];
    const rows: string[] = [headers.join(',')];

    products.forEach(p => {
      p.variants.forEach(v => {
        rows.push([
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.brand}"`,
          `"${p.category}"`,
          `"${v.size}"`,
          `"${v.color}"`,
          `"${v.sku}"`,
          `"${v.barcode}"`,
          v.purchaseCost,
          v.mrp,
          v.sellingPrice,
          v.stockQuantity
        ].join(','));
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sethi_Boot_House_Footwear_Catalog_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.products}</h1>
          <p className="text-xs text-slate-500">
            {products.length} footwear styles • {products.reduce((acc, p) => acc + p.variants.length, 0)} distinct size/color variants
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(undefined);
              setIsProductModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addNewProduct}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search footwear name, SKU, or barcode..."
              className="w-full rounded border border-slate-300 py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Brands</option>
              {['Campus', 'Sparx', 'Bata', 'Relaxo', 'Red Chief', 'Liberty', 'Action', 'Paragon'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Categories</option>
              {["Men's Shoes", "Women's Shoes", "Kids' Shoes", "Sports Shoes", "Formal Shoes", "Casual Shoes", "Sandals", "Slippers", "Boots", "School Shoes"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock (&gt; 0)</option>
              <option value="low_stock">Low Stock Alerts</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3 w-8"></th>
              <th className="py-2.5 px-3">Footwear Name &amp; Brand</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">HSN / GST</th>
              <th className="py-2.5 px-3 text-center">Variants</th>
              <th className="py-2.5 px-3 text-right">MRP Range</th>
              <th className="py-2.5 px-3 text-right">Selling Price</th>
              <th className="py-2.5 px-3 text-center">Total Stock</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(product => {
              const isExpanded = expandedProductId === product.id;
              const totalStock = product.variants.reduce((a, b) => a + b.stockQuantity, 0);
              const minMrp = Math.min(...product.variants.map(v => v.mrp));
              const maxMrp = Math.max(...product.variants.map(v => v.mrp));
              const minPrice = Math.min(...product.variants.map(v => v.sellingPrice));
              const maxPrice = Math.max(...product.variants.map(v => v.sellingPrice));

              return (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                        className="text-slate-400 hover:text-slate-800"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-9 w-9 rounded object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Brand: <span className="font-semibold text-slate-700">{product.brand}</span> • {product.gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 font-medium">{product.category}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      HSN {product.hsnCode} • {product.gstRate}%
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {product.variants.length} sizes
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {minMrp === maxMrp ? `₹${minMrp}` : `₹${minMrp} - ₹${maxMrp}`}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                        totalStock === 0 ? 'bg-rose-100 text-rose-800' : totalStock <= 6 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {totalStock} Pairs
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setBarcodeProduct(product)}
                          title="Print Barcode Labels"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                        >
                          <Barcode className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product)}
                          title="Duplicate Product"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductModalOpen(true);
                          }}
                          title="Edit Footwear"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Variants Details */}
                  {isExpanded && (
                    <tr className="bg-slate-50/80">
                      <td colSpan={9} className="p-3 pl-12">
                        <div className="rounded border border-slate-200 bg-white p-3 shadow-2xs">
                          <p className="text-xs font-bold text-slate-800 mb-2">Variant Stock Breakdown:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {product.variants.map(v => (
                              <div key={v.id} className="rounded border border-slate-200 p-2 text-[11px] bg-slate-50">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="text-blue-900">Size {v.size}</span>
                                  <span className={v.stockQuantity === 0 ? 'text-rose-600 font-black' : 'text-slate-800'}>
                                    {v.stockQuantity} pairs
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">{v.color}</p>
                                <p className="text-[10px] text-slate-600 font-mono mt-0.5">SKU: {v.sku}</p>
                                <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between text-[10px]">
                                  <span>Rate: ₹{v.sellingPrice}</span>
                                  <span className="text-slate-400">Cost: ₹{v.purchaseCost}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(undefined);
          }}
          product={editingProduct}
          onSave={(prod) => saveProduct(prod)}
        />
      )}

      {/* Barcode Print Modal */}
      {barcodeProduct && (
        <BarcodePrintModal
          isOpen={!!barcodeProduct}
          onClose={() => setBarcodeProduct(undefined)}
          product={barcodeProduct}
        />
      )}
    </div>
  );
};
