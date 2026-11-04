import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Printer,
  Share2,
  RefreshCw,
  Download,
  Calendar,
  Eye,
  FileSpreadsheet,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { Invoice } from '../../types/database';
import { InvoicePrintModal } from '../pos/InvoicePrintModal';
import { ReturnExchangeModal } from './ReturnExchangeModal';

export const SalesView: React.FC = () => {
  const { invoices, settings } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);
  const [activeExchangeInvoice, setActiveExchangeInvoice] = useState<Invoice | null>(null);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.customerPhone && inv.customerPhone.includes(q)) ||
        inv.items.some(i => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));

      const matchesChannel = channelFilter === 'all' || inv.channel === channelFilter;
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [invoices, searchQuery, channelFilter, statusFilter]);

  // Export Sales to CSV
  const handleExportCsv = () => {
    const headers = ['Invoice No', 'Date', 'Customer Name', 'Phone', 'Items Count', 'Subtotal', 'Discount', 'GST Total', 'Grand Total', 'Payment Method', 'Channel', 'Cashier', 'Status'];
    const rows = [headers.join(',')];

    filteredInvoices.forEach(inv => {
      rows.push([
        `"${inv.invoiceNumber}"`,
        `"${inv.date.split('T')[0]}"`,
        `"${inv.customerName.replace(/"/g, '""')}"`,
        `"${inv.customerPhone || ''}"`,
        inv.items.length,
        inv.subtotal,
        inv.discountTotal,
        (inv.cgstTotal + inv.sgstTotal + inv.igstTotal).toFixed(2),
        inv.grandTotal,
        `"${inv.payments.map(p => p.method).join('+')}"`,
        `"${inv.channel}"`,
        `"${inv.cashierName}"`,
        `"${inv.status}"`
      ].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sethi_Boot_House_Sales_Register_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.sales}</h1>
          <p className="text-xs text-slate-500">
            Complete GST Tax &amp; Counter Invoices with instant reprints, returns, and size exchanges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Register CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice number, customer name, mobile..."
              className="w-full rounded border border-slate-300 py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Sales Channels</option>
              <option value="pos">POS Counter</option>
              <option value="online">Online Store</option>
              <option value="whatsapp">WhatsApp Order</option>
              <option value="phone">Phone / Instagram</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="returned">Returned</option>
              <option value="partially_returned">Exchanged / Partial</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">Invoice Number</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Items Sold</th>
              <th className="py-2.5 px-3">Tender</th>
              <th className="py-2.5 px-3 text-right">Taxable</th>
              <th className="py-2.5 px-3 text-right">GST</th>
              <th className="py-2.5 px-3 text-right">Grand Total</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map(inv => {
              const totalGst = inv.cgstTotal + inv.sgstTotal + inv.igstTotal;

              return (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {formatDateIndia(inv.date)}
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-slate-900">{inv.customerName}</p>
                    {inv.customerPhone && <p className="text-[11px] text-slate-500">{inv.customerPhone}</p>}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-800">{inv.items.length} item(s)</span>
                    <p className="text-[10px] text-slate-500 truncate max-w-[160px]">
                      {inv.items.map(i => `${i.productName} (Sz ${i.size})`).join(', ')}
                    </p>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    {inv.payments.map((p, idx) => (
                      <span key={idx} className={`uppercase font-semibold block ${p.amount < 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                        {p.amount < 0 ? `CN: -₹${Math.abs(p.amount)}` : `${p.method}: ₹${p.amount}`}
                      </span>
                    ))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{inv.taxableTotal.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{totalGst.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatINR(inv.grandTotal)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                      inv.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'partially_returned'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status === 'partially_returned' ? 'PARTIAL RETURN' : inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Size Exchange / Return button */}
                      <button
                        onClick={() => setActiveExchangeInvoice(inv)}
                        title="Exchange Shoe Size or Process Return"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>

                      {/* Reprint Thermal/A4 Bill */}
                      <button
                        onClick={() => setActivePrintInvoice(inv)}
                        title="Reprint Bill (Thermal / A4)"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Print Modal */}
      {activePrintInvoice && (
        <InvoicePrintModal
          isOpen={!!activePrintInvoice}
          onClose={() => setActivePrintInvoice(null)}
          invoice={activePrintInvoice}
          settings={settings}
        />
      )}

      {/* Exchange / Return Modal */}
      {activeExchangeInvoice && (
        <ReturnExchangeModal
          isOpen={!!activeExchangeInvoice}
          onClose={() => setActiveExchangeInvoice(null)}
          invoice={activeExchangeInvoice}
        />
      )}
    </div>
  );
};
