import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  TrendingUp,
  Package,
  Users
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';

export const ReportsView: React.FC = () => {
  const { invoices, products, customers, suppliers, expenses } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();

  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'customers' | 'finance'>('sales');

  // Aggregated Sales Data
  const reportData = useMemo(() => {
    const brandMap: Record<string, { qty: number; revenue: number }> = {};
    const categoryMap: Record<string, { qty: number; revenue: number }> = {};
    const sizeMap: Record<string, number> = {};

    invoices.forEach(inv => {
      if (inv.status !== 'cancelled') {
        inv.items.forEach(item => {
          if (!brandMap[item.brand]) brandMap[item.brand] = { qty: 0, revenue: 0 };
          brandMap[item.brand].qty += item.quantity;
          brandMap[item.brand].revenue += item.total;

          const prod = products.find(p => p.id === item.productId);
          const cat = prod?.category || 'Casual Shoes';
          if (!categoryMap[cat]) categoryMap[cat] = { qty: 0, revenue: 0 };
          categoryMap[cat].qty += item.quantity;
          categoryMap[cat].revenue += item.total;

          sizeMap[item.size] = (sizeMap[item.size] || 0) + item.quantity;
        });
      }
    });

    return { brandMap, categoryMap, sizeMap };
  }, [invoices, products]);

  const handleExportCsv = () => {
    let rows: string[] = [];

    if (reportType === 'sales') {
      rows.push('Brand,Pairs Sold,Revenue (INR)');
      Object.entries(reportData.brandMap).forEach(([b, val]) => {
        rows.push(`"${b}",${val.qty},${val.revenue.toFixed(2)}`);
      });
    } else if (reportType === 'inventory') {
      rows.push('Product,Brand,Size,Color,Stock Quantity,Cost Price,Selling Price');
      products.forEach(p => {
        p.variants.forEach(v => {
          rows.push(`"${p.name}","${p.brand}","${v.size}","${v.color}",${v.stockQuantity},${v.purchaseCost},${v.sellingPrice}`);
        });
      });
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sethi_Boot_House_${reportType}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.reports}</h1>
          <p className="text-xs text-slate-500">
            Exportable Business Intelligence &amp; Multi-Dimensional Retail Analytics
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Report CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-2 text-xs font-bold gap-4 rounded-t-lg">
        {[
          { id: 'sales', label: 'Brand & Category Sales Report' },
          { id: 'inventory', label: 'Inventory Valuation & Velocity' },
          { id: 'customers', label: 'Customer Lifetime Spend Analysis' },
          { id: 'finance', label: 'Financial Summary' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`pb-2.5 transition-colors border-b-2 ${
              reportType === tab.id ? 'border-blue-900 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-b-lg border border-slate-200 bg-white shadow-xs p-4">
        {reportType === 'sales' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Brand-wise Sales Performance
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-700 border-b">
                  <tr>
                    <th className="py-2 px-3">Footwear Brand</th>
                    <th className="py-2 px-3 text-center">Pairs Sold</th>
                    <th className="py-2 px-3 text-right">Total Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {Object.entries(reportData.brandMap).map(([brand, val]) => (
                    <tr key={brand} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">{brand}</td>
                      <td className="py-2 px-3 text-center text-slate-800">{val.qty}</td>
                      <td className="py-2 px-3 text-right font-bold text-blue-900">{formatINR(val.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Category-wise Turnover
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-700 border-b">
                  <tr>
                    <th className="py-2 px-3">Footwear Category</th>
                    <th className="py-2 px-3 text-center">Pairs Sold</th>
                    <th className="py-2 px-3 text-right">Total Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {Object.entries(reportData.categoryMap).map(([cat, val]) => (
                    <tr key={cat} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">{cat}</td>
                      <td className="py-2 px-3 text-center text-slate-800">{val.qty}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{formatINR(val.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Stock Valuation by Footwear Style
            </h3>
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b">
                <tr>
                  <th className="py-2 px-3 font-sans">Product</th>
                  <th className="py-2 px-3 font-sans">Brand</th>
                  <th className="py-2 px-3 text-center">Variants</th>
                  <th className="py-2 px-3 text-center">Total Pairs</th>
                  <th className="py-2 px-3 text-right">Cost Value</th>
                  <th className="py-2 px-3 text-right">Retail Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => {
                  const pairs = p.variants.reduce((a, b) => a + b.stockQuantity, 0);
                  const cost = p.variants.reduce((a, b) => a + (b.stockQuantity * b.purchaseCost), 0);
                  const retail = p.variants.reduce((a, b) => a + (b.stockQuantity * b.sellingPrice), 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">{p.name}</td>
                      <td className="py-2 px-3 font-sans text-slate-600">{p.brand}</td>
                      <td className="py-2 px-3 text-center">{p.variants.length}</td>
                      <td className="py-2 px-3 text-center font-bold">{pairs}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{formatINR(cost)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{formatINR(retail)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'customers' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Highest Spending Customers in Ratia (CLV)
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b">
                <tr>
                  <th className="py-2 px-3">Customer Name</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3 text-center">Orders</th>
                  <th className="py-2 px-3 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers
                  .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
                  .map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">{c.name}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{c.phone}</td>
                      <td className="py-2 px-3 text-slate-600">{c.customerType}</td>
                      <td className="py-2 px-3 text-center font-bold">{c.totalPurchasesCount || 0}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800 text-sm">
                        {formatINR(c.totalSpent || 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'finance' && (
          <div className="p-4 space-y-4 text-xs font-mono max-w-lg">
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold font-sans">Total Invoiced Sales:</span>
              <span className="font-bold text-slate-900">{formatINR(invoices.reduce((a, b) => a + b.grandTotal, 0))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold font-sans">Total Store Expenses:</span>
              <span className="font-bold text-rose-700">-{formatINR(expenses.reduce((a, b) => a + b.amount, 0))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold font-sans">Total Customer Khata Receivables:</span>
              <span className="font-bold text-amber-700">{formatINR(customers.reduce((a, b) => a + (b.outstandingBalance || 0), 0))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold font-sans">Total Supplier Payables:</span>
              <span className="font-bold text-rose-800">-{formatINR(suppliers.reduce((a, b) => a + (b.outstandingBalance || 0), 0))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
