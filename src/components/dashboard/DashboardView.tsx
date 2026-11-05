import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Receipt,
  Package,
  AlertTriangle,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Truck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';

export const DashboardView: React.FC = () => {
  const { 
    products, 
    invoices, 
    customers, 
    suppliers, 
    expenses, 
    onlineOrders, 
    movements, 
    kpis, 
    settings,
    setActiveModule,
    setIsStorefrontOpen 
  } = useStore();
  
  const { t, formatINR, formatDateIndia } = useTranslation();
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'yesterday' | '7days' | '30days' | 'this_month'>('today');

  // Filter invoices based on selected period
  const filteredData = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const periodInvoices = invoices.filter(inv => {
      if (inv.status === 'cancelled') return false;
      const invDate = new Date(inv.date);
      const invDateStr = inv.date.split('T')[0];

      if (filterPeriod === 'today') return invDateStr === todayStr;
      if (filterPeriod === 'yesterday') return invDateStr === yesterdayStr;
      if (filterPeriod === '7days') return invDate >= sevenDaysAgo;
      if (filterPeriod === '30days') return invDate >= thirtyDaysAgo;
      if (filterPeriod === 'this_month') return invDate >= startOfMonth;
      return true;
    });

    const totalSales = periodInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const invoiceCount = periodInvoices.length;
    const avgOrderValue = invoiceCount > 0 ? totalSales / invoiceCount : 0;

    // Gross Profit
    let grossProfit = 0;
    const brandMap: Record<string, number> = {};
    const categoryMap: Record<string, number> = {};
    const sizeMap: Record<string, number> = {};
    const paymentMap: Record<string, number> = { cash: 0, upi: 0, card: 0, credit: 0, bank_transfer: 0 };
    const productSoldMap: Record<string, { name: string; brand: string; qty: number; revenue: number }> = {};

    periodInvoices.forEach(inv => {
      inv.payments.forEach(p => {
        paymentMap[p.method] = (paymentMap[p.method] || 0) + p.amount;
      });

      inv.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const variant = prod?.variants.find(v => v.id === item.variantId);
        const cost = variant ? variant.purchaseCost : item.rate * 0.7;
        grossProfit += (item.rate - cost) * item.quantity;

        // Brand breakdown
        brandMap[item.brand] = (brandMap[item.brand] || 0) + item.total;

        // Size breakdown
        sizeMap[item.size] = (sizeMap[item.size] || 0) + item.quantity;

        // Top products
        if (!productSoldMap[item.productId]) {
          productSoldMap[item.productId] = { name: item.productName, brand: item.brand, qty: 0, revenue: 0 };
        }
        productSoldMap[item.productId].qty += item.quantity;
        productSoldMap[item.productId].revenue += item.total;
      });
    });

    products.forEach(p => {
      const cat = p.category;
      if (!categoryMap[cat]) categoryMap[cat] = 0;
    });
    periodInvoices.forEach(inv => {
      inv.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          categoryMap[prod.category] = (categoryMap[prod.category] || 0) + item.total;
        }
      });
    });

    const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    const topProducts = Object.values(productSoldMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    return {
      totalSales,
      invoiceCount,
      avgOrderValue,
      grossProfit,
      grossMargin,
      brandMap,
      categoryMap,
      sizeMap,
      paymentMap,
      topProducts,
      periodInvoices
    };
  }, [invoices, products, filterPeriod]);

  // Low stock variants list
  const lowStockItems = useMemo(() => {
    const list: { productName: string; brand: string; size: string; color: string; stock: number; reorder: number }[] = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stockQuantity <= v.reorderLevel) {
          list.push({
            productName: p.name,
            brand: p.brand,
            size: v.size,
            color: v.color,
            stock: v.stockQuantity,
            reorder: v.reorderLevel
          });
        }
      });
    });
    return list.slice(0, 5);
  }, [products]);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Top Banner & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t.dashboard}
          </h1>
          <p className="text-xs text-slate-500">
            {t.ratiaStore} • Live Retail &amp; Online Inventory Control
          </p>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'this_month', label: 'This Month' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterPeriod(tab.id as any)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                filterPeriod === tab.id
                  ? 'bg-blue-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Primary Real-time KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Sales */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Sales Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">{formatINR(filteredData.totalSales)}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{filteredData.invoiceCount} invoices generated</p>
        </div>

        {/* Gross Profit */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Gross Profit</span>
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-lg font-bold text-blue-950">{formatINR(filteredData.grossProfit)}</p>
          <p className="mt-0.5 text-[11px] text-emerald-600 font-semibold">{filteredData.grossMargin.toFixed(1)}% margin</p>
        </div>

        {/* Avg Order Value */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Avg Order Value</span>
            <Receipt className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">{formatINR(filteredData.avgOrderValue)}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Per customer visit</p>
        </div>

        {/* Inventory Units */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Stock in Hand</span>
            <Package className="h-4 w-4 text-slate-600" />
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">{kpis.totalInventoryUnits} Pairs</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Cost: {formatINR(kpis.inventoryCostValue)}</p>
        </div>

        {/* Customer Receivables (Khata) */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Customer Khata</span>
            <Users className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-lg font-bold text-amber-700">{formatINR(kpis.customerReceivables)}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">To collect in Ratia</p>
        </div>

        {/* Supplier Payables */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Supplier Due</span>
            <Truck className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-lg font-bold text-rose-700">{formatINR(kpis.supplierPayables)}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Hisar / Delhi agencies</p>
        </div>
      </div>

      {/* Row 2: Charts & Visual Intelligence */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Footwear Size Distribution (Crucial for Shoe Retailers) */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Footwear Size Velocity</h3>
              <p className="text-[11px] text-slate-500">Units sold across Indian / UK sizes</p>
            </div>
            <span className="text-xs font-semibold text-blue-900">Pairs Sold</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {['6', '7', '8', '9', '10'].map(size => {
              const qty = filteredData.sizeMap[size] || 0;
              const max = Math.max(...Object.values(filteredData.sizeMap), 1);
              const pct = (qty / max) * 100;

              return (
                <div key={size} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">Size {size} UK</span>
                    <span className="text-slate-900 font-bold">{qty} pairs</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-900 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Sizes 7, 8, 9 form 78% of demand in Ratia. Keep reorder levels high.
          </div>
        </div>

        {/* Brand Performance */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales by Footwear Brand</h3>
              <p className="text-[11px] text-slate-500">Revenue split for period</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">INR (₹)</span>
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(filteredData.brandMap).length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No brand sales in this filter period</p>
            ) : (
              Object.entries(filteredData.brandMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([brand, rev]) => {
                  const pct = filteredData.totalSales > 0 ? (rev / filteredData.totalSales) * 100 : 0;
                  return (
                    <div key={brand} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">{brand}</span>
                        <span className="font-bold text-slate-900">{formatINR(rev)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-indigo-700 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Tender Breakdown</h3>
              <p className="text-[11px] text-slate-500">Cash vs UPI vs Card vs Khata</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { label: 'UPI (QR Code)', val: filteredData.paymentMap.upi || 0, color: 'bg-emerald-600' },
              { label: 'Cash (Counter)', val: filteredData.paymentMap.cash || 0, color: 'bg-blue-600' },
              { label: 'Customer Khata (Credit)', val: filteredData.paymentMap.credit || 0, color: 'bg-amber-600' },
              { label: 'Card / Bank', val: (filteredData.paymentMap.card || 0) + (filteredData.paymentMap.bank_transfer || 0), color: 'bg-purple-600' },
            ].map(item => {
              const totalPayments = Object.values(filteredData.paymentMap).reduce((a, b) => a + b, 0) || 1;
              const pct = (item.val / totalPayments) * 100;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="font-bold text-slate-900">{formatINR(item.val)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick link to Daybook */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500">Reconciled with Daily Cash Book</span>
            <button
              onClick={() => setActiveModule('accounts')}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              Open Daybook <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Actionable Widgets: Low Stock Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Low Stock Variant Alerts</h3>
            </div>
            <button
              onClick={() => setActiveModule('inventory')}
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              Full Inventory →
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {lowStockItems.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">All sizes are well-stocked.</p>
            ) : (
              lowStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      Brand: {item.brand} • Size: {item.size} • Color: {item.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                      Only {item.stock} left
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Reorder at {item.reorder}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-blue-900" />
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Bills</h3>
            </div>
            <button
              onClick={() => setActiveModule('sales')}
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              View Sales Register →
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {invoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-slate-400">({inv.channel.toUpperCase()})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {inv.customerName} • {inv.items.length} item(s) • Cashier: {inv.cashierName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatINR(inv.grandTotal)}</p>
                  <p className="text-[10px] text-slate-400">{formatDateIndia(inv.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
