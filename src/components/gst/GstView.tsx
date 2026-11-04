import React, { useMemo } from 'react';
import { Calculator, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';

export const GstView: React.FC = () => {
  const { invoices, suppliers, settings } = useStore();
  const { t, formatINR } = useTranslation();

  // GST Calculation for completed invoices
  const gstMetrics = useMemo(() => {
    let taxableTurnover = 0;
    let cgstOutput = 0;
    let sgstOutput = 0;
    let igstOutput = 0;

    const hsnSummary: Record<string, { desc: string; totalQty: number; taxableVal: number; cgst: number; sgst: number; totalGst: number }> = {
      '6402': { desc: 'Footwear with rubber/plastics uppers (Slippers, Sandals)', totalQty: 0, taxableVal: 0, cgst: 0, sgst: 0, totalGst: 0 },
      '6403': { desc: 'Footwear with leather uppers (Formal shoes, Boots)', totalQty: 0, taxableVal: 0, cgst: 0, sgst: 0, totalGst: 0 },
      '6404': { desc: 'Footwear with textile uppers (Sports, Sneakers, Canvas)', totalQty: 0, taxableVal: 0, cgst: 0, sgst: 0, totalGst: 0 },
      '6405': { desc: 'Other footwear', totalQty: 0, taxableVal: 0, cgst: 0, sgst: 0, totalGst: 0 }
    };

    invoices.forEach(inv => {
      if (inv.status !== 'cancelled') {
        taxableTurnover += inv.taxableTotal;
        cgstOutput += inv.cgstTotal;
        sgstOutput += inv.sgstTotal;
        igstOutput += inv.igstTotal;

        inv.items.forEach(item => {
          const hsn = item.hsnCode || '6404';
          if (!hsnSummary[hsn]) {
            hsnSummary[hsn] = { desc: 'Footwear', totalQty: 0, taxableVal: 0, cgst: 0, sgst: 0, totalGst: 0 };
          }
          hsnSummary[hsn].totalQty += item.quantity;
          hsnSummary[hsn].taxableVal += item.taxableValue;
          hsnSummary[hsn].cgst += item.cgstAmount;
          hsnSummary[hsn].sgst += item.sgstAmount;
          hsnSummary[hsn].totalGst += item.cgstAmount + item.sgstAmount;
        });
      }
    });

    const totalOutputGst = cgstOutput + sgstOutput + igstOutput;

    // Approximate Input Tax Credit (ITC) from wholesale supplier invoices
    const itcEstimated = suppliers.reduce((sum, s) => sum + (s.totalPurchases * 0.05), 0);
    const netGstPayable = Math.max(0, totalOutputGst - itcEstimated);

    return {
      taxableTurnover,
      cgstOutput,
      sgstOutput,
      igstOutput,
      totalOutputGst,
      itcEstimated,
      netGstPayable,
      hsnSummary
    };
  }, [invoices, suppliers]);

  const handleExportGstr1 = () => {
    const headers = ['HSN Code', 'Description', 'Quantity (Pairs)', 'Taxable Turnover (₹)', 'CGST (₹)', 'SGST (₹)', 'Total Tax (₹)'];
    const rows = [headers.join(',')];

    Object.entries(gstMetrics.hsnSummary).forEach(([hsn, data]) => {
      rows.push([
        `"${hsn}"`,
        `"${data.desc}"`,
        data.totalQty,
        data.taxableVal.toFixed(2),
        data.cgst.toFixed(2),
        data.sgst.toFixed(2),
        data.totalGst.toFixed(2)
      ].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sethi_Boot_House_GSTR1_HSN_Summary_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.gstTax}</h1>
          <p className="text-xs text-slate-500">
            GSTIN: <span className="font-mono font-bold text-slate-800">{settings.gstin}</span> • State Code: 06 (Haryana)
          </p>
        </div>

        <button
          onClick={handleExportGstr1}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export GSTR-1 HSN CSV</span>
        </button>
      </div>

      {/* Tax Liability Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Total Taxable Turnover</span>
          <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {formatINR(gstMetrics.taxableTurnover)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Footwear sales in Haryana</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Output CGST (Central Tax)</span>
          <p className="text-xl font-bold text-blue-900 mt-1 font-mono">
            {formatINR(gstMetrics.cgstOutput)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">2.5% / 6%</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Output SGST (Haryana State)</span>
          <p className="text-xl font-bold text-blue-900 mt-1 font-mono">
            {formatINR(gstMetrics.sgstOutput)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">2.5% / 6%</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Total Output GST Collected</span>
          <p className="text-xl font-bold text-emerald-800 mt-1 font-mono">
            {formatINR(gstMetrics.totalOutputGst)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">CGST + SGST</p>
        </div>
      </div>

      {/* HSN Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 uppercase">
            HSN Wise Footwear Tax Summary (GSTR-1 Format)
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">B2C Retail Ratia Counter</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">HSN Code</th>
              <th className="py-2.5 px-3">Description of Footwear Goods</th>
              <th className="py-2.5 px-3 text-center">Pairs Sold</th>
              <th className="py-2.5 px-3 text-right">Taxable Turnover</th>
              <th className="py-2.5 px-3 text-right">CGST (₹)</th>
              <th className="py-2.5 px-3 text-right">SGST (₹)</th>
              <th className="py-2.5 px-3 text-right">Total Tax (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {Object.entries(gstMetrics.hsnSummary).map(([hsn, data]) => (
              <tr key={hsn} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-blue-900">{hsn}</td>
                <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{data.desc}</td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-900">{data.totalQty}</td>
                <td className="py-2.5 px-3 text-right text-slate-700 font-semibold">
                  {formatINR(data.taxableVal)}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-600">₹{data.cgst.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right text-slate-600">₹{data.sgst.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                  ₹{data.totalGst.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footwear Tax Rate Rule Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-950 space-y-1">
        <p className="font-bold">Indian GST Footwear Tax Rule Compliant:</p>
        <p>• Footwear with Sale Price / MRP &le; ₹1,000 is taxed at <strong>5% GST</strong> (2.5% CGST + 2.5% SGST).</p>
        <p>• Footwear with Sale Price / MRP &gt; ₹1,000 is taxed at <strong>12% GST</strong> (6% CGST + 6% SGST).</p>
        <p>• Sethi Boot House ERP calculates item-level rates deterministically using integer paise arithmetic.</p>
      </div>
    </div>
  );
};
