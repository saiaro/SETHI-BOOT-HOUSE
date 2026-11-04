import React, { useState, useMemo } from 'react';
import {
  Layers,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  History,
  Sliders,
  CheckCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { StockMovementType } from '../../types/database';

export const InventoryView: React.FC = () => {
  const { products, movements, adjustStock, kpis } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();
  const { currentUser, checkPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'stock' | 'ledger' | 'dead_stock'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('all');

  // Adjustment Modal State
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState<string>('');
  const [selectedVarId, setSelectedVarId] = useState<string>('');
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'adjustment' | 'damaged' | 'stock_inward' | 'stock_outward'>('adjustment');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustError, setAdjustError] = useState<string | null>(null);

  // Flattened Variants for Stock Table
  const allVariantsList = useMemo(() => {
    const list: {
      productId: string;
      productName: string;
      brand: string;
      category: string;
      variantId: string;
      size: string;
      color: string;
      sku: string;
      barcode: string;
      stockQuantity: number;
      reorderLevel: number;
      purchaseCost: number;
      sellingPrice: number;
      mrp: number;
    }[] = [];

    products.forEach(p => {
      p.variants.forEach(v => {
        list.push({
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          category: p.category,
          variantId: v.id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          barcode: v.barcode,
          stockQuantity: v.stockQuantity,
          reorderLevel: v.reorderLevel,
          purchaseCost: v.purchaseCost,
          sellingPrice: v.sellingPrice,
          mrp: v.mrp
        });
      });
    });

    return list.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.productName.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.barcode.includes(q) ||
        item.size.includes(q)
      );
    });
  }, [products, searchQuery]);

  // Filtered Movements
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchesType = movementTypeFilter === 'all' || m.movementType === movementTypeFilter;
      const matchesSearch = !searchQuery ||
        m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.variantDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.referenceId && m.referenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.reason.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [movements, movementTypeFilter, searchQuery]);

  // Handle Adjustment Submit
  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdId || !selectedVarId || adjustQty === 0) {
      setAdjustError('Please specify product, variant and non-zero quantity change');
      return;
    }

    const res = adjustStock({
      productId: selectedProdId,
      variantId: selectedVarId,
      quantityChange: adjustType === 'stock_outward' || adjustType === 'damaged' ? -Math.abs(adjustQty) : adjustQty,
      type: adjustType,
      reason: adjustReason || 'Physical inventory reconciliation in Ratia store',
      userName: currentUser.name
    });

    if (res.success) {
      setIsAdjustOpen(false);
      setSelectedProdId('');
      setSelectedVarId('');
      setAdjustQty(0);
      setAdjustReason('');
      setAdjustError(null);
    } else {
      setAdjustError(res.error || 'Adjustment failed');
    }
  };

  const selectedProductObj = products.find(p => p.id === selectedProdId);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.inventory}</h1>
          <p className="text-xs text-slate-500">
            Real-time multi-variant stock valuation &amp; immutable audit ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAdjustOpen(true);
              setAdjustError(null);
            }}
            className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Stock Adjustment / Audit</span>
          </button>
        </div>
      </div>

      {/* Valuation Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Stock in Hand</span>
          <p className="mt-1 text-xl font-bold text-slate-900">{kpis.totalInventoryUnits} Pairs</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{allVariantsList.length} distinct variants</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Purchase Cost Valuation</span>
          <p className="mt-1 text-xl font-bold text-blue-900">{formatINR(kpis.inventoryCostValue)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Asset investment</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Retail Selling Valuation</span>
          <p className="mt-1 text-xl font-bold text-emerald-800">{formatINR(kpis.inventorySellingValue)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            +{formatINR(kpis.inventorySellingValue - kpis.inventoryCostValue)} expected margin
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Stock Alerts</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-amber-700">{kpis.lowStockCount} Low</span>
            <span className="text-slate-300">|</span>
            <span className="text-lg font-bold text-rose-700">{kpis.outOfStockCount} Out</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Reorder alerts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-2 text-xs font-bold gap-4 rounded-t-lg">
        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'stock' ? 'border-blue-900 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Variant-wise Stock List ({allVariantsList.length})
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'ledger' ? 'border-blue-900 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Immutable Stock Audit Ledger ({movements.length})
        </button>
      </div>

      {/* Tab 1: Variant-wise Stock List */}
      {activeTab === 'stock' && (
        <div className="rounded-b-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search variant by name, size, barcode, SKU..."
                className="w-full rounded border border-slate-300 py-1.5 pl-9 pr-3 text-xs bg-white"
              />
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">Product Name &amp; Brand</th>
                <th className="py-2.5 px-3">Size (UK)</th>
                <th className="py-2.5 px-3">Color</th>
                <th className="py-2.5 px-3">Barcode / SKU</th>
                <th className="py-2.5 px-3 text-right">Cost Price</th>
                <th className="py-2.5 px-3 text-right">Selling Price</th>
                <th className="py-2.5 px-3 text-center">Stock in Hand</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allVariantsList.map((item, idx) => {
                const isOut = item.stockQuantity === 0;
                const isLow = !isOut && item.stockQuantity <= item.reorderLevel;

                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3">
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-[11px] text-slate-500">{item.brand} • {item.category}</p>
                    </td>
                    <td className="py-2 px-3 font-bold text-blue-900 text-sm">
                      {item.size}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{item.color}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                      <div>{item.barcode}</div>
                      <div className="text-slate-400 text-[10px]">{item.sku}</div>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">₹{item.purchaseCost}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{item.sellingPrice}</td>
                    <td className="py-2 px-3 text-center font-bold text-sm">
                      <span className={isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'}>
                        {item.stockQuantity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        isOut ? 'bg-rose-100 text-rose-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Immutable Stock Audit Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-b-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Movement Type Filter Bar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              <span className="font-bold text-slate-500 mr-1">Movement Type:</span>
              {['all', 'sale', 'purchase_receipt', 'sale_return', 'exchange_in', 'exchange_out', 'damaged', 'adjustment'].map(mType => (
                <button
                  key={mType}
                  onClick={() => setMovementTypeFilter(mType)}
                  className={`rounded px-2.5 py-1 font-medium capitalize shrink-0 ${
                    movementTypeFilter === mType ? 'bg-blue-900 text-white font-bold' : 'bg-white border text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mType.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Footwear &amp; Variant</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-center">Change</th>
                <th className="py-2.5 px-3 text-center">Prev &rarr; New</th>
                <th className="py-2.5 px-3">Reference / Bill #</th>
                <th className="py-2.5 px-3">Reason &amp; Log</th>
                <th className="py-2.5 px-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredMovements.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {formatDateIndia(m.createdAt)} {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2 px-3 font-sans">
                    <p className="font-bold text-slate-900">{m.productName}</p>
                    <p className="text-[11px] text-slate-500">{m.variantDetails}</p>
                  </td>
                  <td className="py-2 px-3 font-sans">
                    <span className="capitalize font-semibold text-slate-700">
                      {m.movementType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center font-bold">
                    <span className={m.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center text-slate-600">
                    {m.previousStock} &rarr; <span className="font-bold text-slate-900">{m.newStock}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-800 font-semibold font-sans">{m.referenceId || 'N/A'}</td>
                  <td className="py-2 px-3 text-slate-600 font-sans max-w-xs truncate" title={m.reason}>
                    {m.reason}
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-700">{m.userName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">Record Stock Adjustment / Physical Audit</h3>
              </div>
              <button onClick={() => setIsAdjustOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="p-4 space-y-3 text-xs">
              {adjustError && (
                <div className="rounded bg-rose-50 border border-rose-200 p-2 text-rose-800 font-medium">
                  {adjustError}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700">1. Select Product:</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => {
                    setSelectedProdId(e.target.value);
                    setSelectedVarId('');
                  }}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white"
                >
                  <option value="">-- Choose footwear --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                  ))}
                </select>
              </div>

              {selectedProductObj && (
                <div>
                  <label className="font-bold text-slate-700">2. Select Size &amp; Variant:</label>
                  <select
                    value={selectedVarId}
                    onChange={(e) => setSelectedVarId(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white"
                  >
                    <option value="">-- Choose size --</option>
                    {selectedProductObj.variants.map(v => (
                      <option key={v.id} value={v.id}>
                        Size {v.size} ({v.color}) - Current Stock: {v.stockQuantity} pairs
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Adjustment Type:</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white font-medium"
                  >
                    <option value="adjustment">Stock Audit (Found Extra)</option>
                    <option value="damaged">Damaged / B-Grade Goods (-)</option>
                    <option value="stock_outward">Missing / Theft (-)</option>
                    <option value="stock_inward">Sample Lot (+)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Quantity (Pairs):</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustQty || ''}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    placeholder="e.g. 2"
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Reason / Audit Remarks *</label>
                <textarea
                  rows={2}
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Shoe box found damaged during shelf reorganization"
                  className="mt-1 w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="rounded px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
                >
                  Confirm &amp; Write to Audit Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
