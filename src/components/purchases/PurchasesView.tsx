import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Truck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types/database';

export const PurchasesView: React.FC = () => {
  const { suppliers, products, receiveGoodsInward } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();
  const { currentUser } = useAuth();

  const [isGrnModalOpen, setIsGrnModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [supplierBillNo, setSupplierBillNo] = useState<string>('');
  const [inwardItems, setInwardItems] = useState<{
    productId: string;
    variantId: string;
    quantityReceived: number;
    unitCost: number;
  }[]>([]);

  // Current item row being added
  const [itemProdId, setItemProdId] = useState<string>('');
  const [itemVarId, setItemVarId] = useState<string>('');
  const [itemQty, setItemQty] = useState<number>(10);
  const [itemCost, setItemCost] = useState<number>(600);

  const [paidNow, setPaidNow] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'upi' | 'cash'>('bank_transfer');
  const [grnSuccessMsg, setGrnSuccessMsg] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === itemProdId);
  const totalInwardAmount = inwardItems.reduce((sum, item) => sum + (item.quantityReceived * item.unitCost), 0);

  const handleAddItemToLot = () => {
    if (!itemProdId || !itemVarId || itemQty <= 0) return;
    setInwardItems(prev => [
      ...prev,
      {
        productId: itemProdId,
        variantId: itemVarId,
        quantityReceived: itemQty,
        unitCost: itemCost
      }
    ]);
    setItemVarId('');
    setItemQty(10);
  };

  const handleCompleteGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !supplierBillNo || inwardItems.length === 0) return;

    const res = receiveGoodsInward({
      supplierId: selectedSupplierId,
      items: inwardItems,
      invoiceNumber: supplierBillNo,
      totalAmount: totalInwardAmount,
      paidAmount: paidNow,
      paymentMethod,
      userName: currentUser.name
    });

    if (res.success) {
      setGrnSuccessMsg(`Successfully received ${inwardItems.reduce((a, b) => a + b.quantityReceived, 0)} pairs into Ratia store stock! Inventory updated.`);
      setIsGrnModalOpen(false);
      setInwardItems([]);
      setSupplierBillNo('');
      setPaidNow(0);
      setTimeout(() => setGrnSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.purchases}</h1>
          <p className="text-xs text-slate-500">
            Goods Receipt Notes (GRN), Wholesale Inward &amp; Cost Control
          </p>
        </div>

        <button
          onClick={() => setIsGrnModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
        >
          <PackageCheck className="h-4 w-4" />
          <span>+ Receive New Lot (GRN)</span>
        </button>
      </div>

      {grnSuccessMsg && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-900 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{grnSuccessMsg}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Authorized Suppliers</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{suppliers.length} Agencies</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Pending Goods Inward Checks</span>
          <p className="text-xl font-bold text-blue-900 mt-1">All Received (0 Pending)</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Total Inward Purchased</span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatINR(suppliers.reduce((a, b) => a + b.totalPurchases, 0))}
          </p>
        </div>
      </div>

      {/* Recent Purchases Register */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 uppercase">Recent Supplier Inward Shipments</h3>
          <span className="text-[11px] text-slate-500">Auto-synced with Ratia Warehouse</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Supplier Agency</th>
              <th className="py-2.5 px-3">Supplier Bill / GRN #</th>
              <th className="py-2.5 px-3 text-right">Invoice Value</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            <tr>
              <td className="py-2.5 px-3 text-slate-500">2026-10-15</td>
              <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Haryana Footwear Distributors (Hisar)</td>
              <td className="py-2.5 px-3 font-bold text-blue-900">HFD-4421</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹54,500.00</td>
              <td className="py-2.5 px-3 text-center font-sans">
                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                  Inward Verified
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Goods Receipt Note (GRN) Inward Modal */}
      {isGrnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Receive Footwear Lot (GRN / Goods Receipt Note)
                </h3>
                <p className="text-xs text-slate-500">Increments inventory stock and logs supplier purchase ledger</p>
              </div>
              <button onClick={() => setIsGrnModalOpen(false)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCompleteGRN} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Select Supplier *</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.companyName} ({s.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Supplier Bill / Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={supplierBillNo}
                    onChange={(e) => setSupplierBillNo(e.target.value)}
                    placeholder="e.g. HFD-2026-904"
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Add Footwear Variant to Lot */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <span className="font-bold text-slate-800">Add Shoes into Inward Lot:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-600">Product:</label>
                    <select
                      value={itemProdId}
                      onChange={(e) => {
                        setItemProdId(e.target.value);
                        setItemVarId('');
                      }}
                      className="mt-0.5 w-full rounded border border-slate-300 bg-white py-1 px-2 text-xs"
                    >
                      <option value="">-- Choose Model --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600">Size &amp; Variant:</label>
                    <select
                      value={itemVarId}
                      onChange={(e) => {
                        setItemVarId(e.target.value);
                        const v = selectedProduct?.variants.find(v => v.id === e.target.value);
                        if (v) setItemCost(v.purchaseCost);
                      }}
                      className="mt-0.5 w-full rounded border border-slate-300 bg-white py-1 px-2 text-xs font-bold text-blue-900"
                    >
                      <option value="">-- Size --</option>
                      {selectedProduct?.variants.map(v => (
                        <option key={v.id} value={v.id}>Size {v.size} ({v.color})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600">Qty (Pairs):</label>
                    <div className="flex gap-1 mt-0.5">
                      <input
                        type="number"
                        min="1"
                        value={itemQty}
                        onChange={(e) => setItemQty(Number(e.target.value))}
                        className="w-16 rounded border border-slate-300 bg-white py-1 px-2 text-center font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleAddItemToLot}
                        className="flex-1 rounded bg-blue-900 text-white font-bold text-xs hover:bg-blue-800"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items in Inward Lot */}
              <div>
                <p className="font-bold text-slate-800 mb-1">
                  Inward Items in Lot ({inwardItems.length}):
                </p>
                {inwardItems.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400 border border-dashed rounded">
                    No shoes added to inward lot yet. Use form above to add variants.
                  </p>
                ) : (
                  <div className="rounded border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="py-1.5 px-2">Footwear</th>
                          <th className="py-1.5 px-2">Size</th>
                          <th className="py-1.5 px-2 text-center">Pairs</th>
                          <th className="py-1.5 px-2 text-right">Cost (₹)</th>
                          <th className="py-1.5 px-2 text-right">Total (₹)</th>
                          <th className="py-1.5 px-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inwardItems.map((item, idx) => {
                          const prod = products.find(p => p.id === item.productId);
                          const variant = prod?.variants.find(v => v.id === item.variantId);
                          return (
                            <tr key={idx}>
                              <td className="py-1.5 px-2 font-semibold text-slate-900">{prod?.name}</td>
                              <td className="py-1.5 px-2 font-bold text-blue-900">{variant?.size}</td>
                              <td className="py-1.5 px-2 text-center font-bold">{item.quantityReceived}</td>
                              <td className="py-1.5 px-2 text-right font-mono">₹{item.unitCost}</td>
                              <td className="py-1.5 px-2 text-right font-mono font-bold">
                                ₹{item.quantityReceived * item.unitCost}
                              </td>
                              <td className="py-1.5 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => setInwardItems(prev => prev.filter((_, i) => i !== idx))}
                                  className="text-rose-600 hover:font-bold"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Inward Lot Totals & Payment */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">Payment Made on Delivery:</span>
                  <input
                    type="number"
                    min="0"
                    max={totalInwardAmount}
                    value={paidNow}
                    onChange={(e) => setPaidNow(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 py-1.5 px-3 font-mono font-bold"
                    placeholder="Enter paid amount if any"
                  />
                  <p className="text-[10px] text-slate-500">
                    Remaining ₹{Math.max(0, totalInwardAmount - paidNow)} will be credited to supplier ledger.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 font-medium">Total Lot Cost:</span>
                  <p className="text-xl font-black text-slate-900 font-mono">
                    {formatINR(totalInwardAmount)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGrnModalOpen(false)}
                  className="rounded px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inwardItems.length === 0}
                  className="rounded bg-blue-900 px-5 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  Accept Lot &amp; Inward Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
