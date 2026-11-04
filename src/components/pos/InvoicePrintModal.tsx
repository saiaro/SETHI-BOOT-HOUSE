import React, { useState } from 'react';
import { X, Printer, Share2, Check, Download } from 'lucide-react';
import { Invoice, BusinessSettings } from '../../types/database';
import { useTranslation } from '../../i18n/LanguageContext';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  settings: BusinessSettings;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  isOpen,
  onClose,
  invoice,
  settings
}) => {
  const { t, formatINR, formatDateIndia } = useTranslation();
  const [format, setFormat] = useState<'thermal_80mm' | 'thermal_58mm' | 'a4'>(settings.printFormat || 'thermal_80mm');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const phone = invoice.customerPhone.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Hello ${invoice.customerName}! Thank you for shopping at *SETHI BOOT HOUSE*, Ratia.\n\n` +
      `🧾 *Invoice No:* ${invoice.invoiceNumber}\n` +
      `📅 *Date:* ${formatDateIndia(invoice.date)}\n` +
      `👟 *Items:* ${invoice.items.map(i => `${i.productName} (Size: ${i.size}) x${i.quantity} = ₹${i.total}`).join('\n')}\n\n` +
      `💰 *Grand Total:* ₹${invoice.grandTotal}\n` +
      `Payment: ${invoice.payments.map(p => `${p.method.toUpperCase()}: ₹${p.amount}`).join(', ')}\n\n` +
      `📍 Sethi Boot House, Main Road, Ratia (Haryana)\n` +
      `Phone: ${settings.phone}\n` +
      `Visit us again!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-2xl overflow-hidden">
        {/* Controls Toolbar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Print Template:</span>
            <div className="flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
              <button
                onClick={() => setFormat('thermal_80mm')}
                className={`rounded px-2.5 py-1 ${format === 'thermal_80mm' ? 'bg-blue-900 text-white font-semibold' : 'text-slate-600'}`}
              >
                80mm Thermal
              </button>
              <button
                onClick={() => setFormat('thermal_58mm')}
                className={`rounded px-2.5 py-1 ${format === 'thermal_58mm' ? 'bg-blue-900 text-white font-semibold' : 'text-slate-600'}`}
              >
                58mm Thermal
              </button>
              <button
                onClick={() => setFormat('a4')}
                className={`rounded px-2.5 py-1 ${format === 'a4' ? 'bg-blue-900 text-white font-semibold' : 'text-slate-600'}`}
              >
                A4 GST Invoice
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {invoice.customerPhone && (
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>WhatsApp Bill</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Now</span>
            </button>

            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 flex justify-center">
          {format === 'a4' ? (
            /* A4 GST TAX INVOICE FORMAT */
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white p-8 border border-slate-300 shadow-md text-slate-900 print:shadow-none print:border-none print:p-0">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-blue-950 uppercase">{settings.businessName}</h1>
                  <p className="text-xs text-slate-600 font-medium">{settings.tagline}</p>
                  <p className="text-xs text-slate-600 mt-1">{settings.address}, {settings.city}, {settings.state} - {settings.pincode}</p>
                  <p className="text-xs text-slate-600">Mobile: {settings.phone} • Email: {settings.email}</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">GSTIN: {settings.gstin} | PAN: {settings.panNumber}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                    TAX INVOICE
                  </div>
                  <p className="text-xs font-bold text-slate-900">Invoice No: <span className="font-mono">{invoice.invoiceNumber}</span></p>
                  <p className="text-xs text-slate-600">Date: {formatDateIndia(invoice.date)}</p>
                  <p className="text-xs text-slate-600">Place of Supply: Haryana (06)</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
                <div>
                  <p className="font-bold uppercase text-slate-500 mb-1">Details of Receiver (Billed To):</p>
                  <p className="font-bold text-sm text-slate-900">{invoice.customerName}</p>
                  <p className="text-slate-600">Phone: {invoice.customerPhone || 'N/A'}</p>
                  {invoice.customerAddress && <p className="text-slate-600">Address: {invoice.customerAddress}</p>}
                  {invoice.customerGstin && <p className="font-semibold text-slate-800">GSTIN: {invoice.customerGstin}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold uppercase text-slate-500 mb-1">Payment &amp; Dispatch:</p>
                  <p className="text-slate-700">Channel: <span className="font-semibold uppercase">{invoice.channel}</span></p>
                  <p className="text-slate-700">Cashier: <span className="font-semibold">{invoice.cashierName}</span></p>
                  <p className="text-slate-700">Terms: Immediate Payment</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mt-4 text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-300 font-bold text-slate-800">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Description of Footwear</th>
                    <th className="py-2 px-2">HSN</th>
                    <th className="py-2 px-2">Size</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-2 text-right">MRP</th>
                    <th className="py-2 px-2 text-right">Rate</th>
                    <th className="py-2 px-2 text-right">Disc</th>
                    <th className="py-2 px-2 text-right">Taxable</th>
                    <th className="py-2 px-2 text-right">GST%</th>
                    <th className="py-2 px-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, idx) => {
                    const itemGross = (item.rate || 0) * (item.quantity || 1);
                    // Determine effective discount: use item discount or allocate bill discount
                    const itemDiscount = item.discountAmount > 0
                      ? item.discountAmount
                      : (invoice.discountTotal > 0 && invoice.subtotal > 0
                          ? Number(((itemGross / invoice.subtotal) * invoice.discountTotal).toFixed(2))
                          : 0);

                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-2 text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-2 font-medium">
                          {item.productName}
                          <div className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</div>
                        </td>
                        <td className="py-2 px-2 text-slate-600">{item.hsnCode}</td>
                        <td className="py-2 px-2 font-bold">{item.size}</td>
                        <td className="py-2 px-2 text-center font-bold">{item.quantity}</td>
                        <td className="py-2 px-2 text-right text-slate-500">₹{item.mrp}</td>
                        <td className="py-2 px-2 text-right">₹{item.rate}</td>
                        <td className="py-2 px-2 text-right text-emerald-700">
                          {itemDiscount > 0 ? `₹${itemDiscount.toFixed(2)}` : '₹0.00'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">₹{item.taxableValue.toFixed(2)}</td>
                        <td className="py-2 px-2 text-right">{item.gstRate}%</td>
                        <td className="py-2 px-2 text-right font-bold font-mono">₹{item.total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Tax Summary & Totals */}
              <div className="mt-6 border-t-2 border-slate-300 pt-4 grid grid-cols-2 gap-6 text-xs">
                {/* GST Split */}
                <div className="border border-slate-200 p-3 rounded bg-slate-50">
                  <p className="font-bold text-slate-800 mb-2">GST Tax Breakdown (Intra-state Haryana):</p>
                  <div className="space-y-1 font-mono text-slate-700">
                    <div className="flex justify-between">
                      <span>CGST (Central Tax):</span>
                      <span>₹{invoice.cgstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (State Tax):</span>
                      <span>₹{invoice.sgstTotal.toFixed(2)}</span>
                    </div>
                    {invoice.igstTotal > 0 && (
                      <div className="flex justify-between">
                        <span>IGST (Integrated Tax):</span>
                        <span>₹{invoice.igstTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-900">
                      <span>Total GST Collected:</span>
                      <span>₹{(invoice.cgstTotal + invoice.sgstTotal + invoice.igstTotal).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="space-y-1.5 text-right font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span>Items Gross Subtotal:</span>
                    <span>₹{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Total Discount:</span>
                      <span>-₹{invoice.discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>Taxable Base Value:</span>
                    <span>₹{invoice.taxableTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total GST:</span>
                    <span>+₹{(invoice.cgstTotal + invoice.sgstTotal).toFixed(2)}</span>
                  </div>
                  {invoice.roundOff !== 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Round Off:</span>
                      <span>{invoice.roundOff > 0 ? `+₹${invoice.roundOff.toFixed(2)}` : `-₹${Math.abs(invoice.roundOff).toFixed(2)}`}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-slate-900">
                    <span>GRAND TOTAL:</span>
                    <span>{formatINR(invoice.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Return & Settlement Notes if any */}
              {invoice.notes && (
                <div className="mt-4 p-2.5 rounded border border-amber-200 bg-amber-50 text-[11px] text-amber-900 font-mono whitespace-pre-line">
                  <span className="font-bold block uppercase text-[10px] text-amber-800">Notes / Credit Note History:</span>
                  {invoice.notes}
                </div>
              )}

              {/* Bank & Declaration */}
              <div className="mt-8 border-t border-slate-200 pt-4 grid grid-cols-2 gap-4 text-[11px] text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Bank Details for RTGS / NEFT / UPI:</p>
                  <p>Bank: {settings.bankName}</p>
                  <p>A/C No: {settings.bankAccountNumber}</p>
                  <p>IFSC: {settings.bankIfsc}</p>
                  <p>UPI ID: {settings.upiId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">For SETHI BOOT HOUSE</p>
                  <div className="h-12"></div>
                  <p className="font-semibold text-slate-800">Authorized Signatory</p>
                </div>
              </div>
            </div>
          ) : (
            /* THERMAL RECEIPT FORMAT (80mm / 58mm) */
            <div
              className={`bg-white p-4 font-mono text-xs border border-slate-300 shadow-sm text-slate-900 leading-snug print:border-none print:shadow-none print:p-0 ${
                format === 'thermal_58mm' ? 'w-[58mm] text-[10px]' : 'w-[80mm]'
              }`}
            >
              {/* Thermal Header */}
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                <h2 className="text-base font-black tracking-wider uppercase">{settings.businessName}</h2>
                <p className="text-[10px] text-slate-600">FOOTWEAR RETAILER</p>
                <p className="text-[10px] text-slate-600">{settings.address}, {settings.city}</p>
                <p className="text-[10px] text-slate-600">Phone: {settings.phone}</p>
                <p className="text-[10px] font-bold">GSTIN: {settings.gstin}</p>
              </div>

              {/* Invoice Meta */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Bill No:</span>
                  <span className="font-bold">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDateIndia(invoice.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold truncate max-w-[140px]">{invoice.customerName}</span>
                </div>
                {invoice.customerPhone && (
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <span>{invoice.customerPhone}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Cashier:</span>
                  <span>{invoice.cashierName}</span>
                </div>
              </div>

              {/* Thermal Items List */}
              <div className="py-2 border-b border-dashed border-slate-400">
                <div className="flex justify-between font-bold border-b border-slate-300 pb-1 mb-1 text-[11px]">
                  <span>Item (Size)</span>
                  <span>Qty x Rate = Total</span>
                </div>
                {invoice.items.map((item, idx) => {
                  const itemGross = (item.rate || 0) * (item.quantity || 1);
                  const itemDiscount = item.discountAmount > 0
                    ? item.discountAmount
                    : (invoice.discountTotal > 0 && invoice.subtotal > 0
                        ? Number(((itemGross / invoice.subtotal) * invoice.discountTotal).toFixed(2))
                        : 0);

                  return (
                    <div key={idx} className="py-1">
                      <p className="font-semibold text-slate-900 truncate">{item.productName}</p>
                      <div className="flex justify-between text-[10px] text-slate-600">
                        <span>Sz {item.size} • {item.color}</span>
                        <span>
                          {item.quantity} x ₹{item.rate}
                          {itemDiscount > 0 ? ` (-₹${itemDiscount.toFixed(0)})` : ''}
                          {' = ₹'}{item.total.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Thermal Totals */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-right text-[11px]">
                <div className="flex justify-between">
                  <span>Gross Total:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{invoice.discountTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Taxable Base:</span>
                  <span>₹{invoice.taxableTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>CGST + SGST:</span>
                  <span>₹{(invoice.cgstTotal + invoice.sgstTotal).toFixed(2)}</span>
                </div>
                {invoice.roundOff !== 0 && (
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Round Off:</span>
                    <span>{invoice.roundOff > 0 ? `+₹${invoice.roundOff.toFixed(2)}` : `-₹${Math.abs(invoice.roundOff).toFixed(2)}`}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t border-slate-400 pt-1 text-slate-900">
                  <span>TOTAL:</span>
                  <span>{formatINR(invoice.grandTotal)}</span>
                </div>
                {invoice.payments.map((p, idx) => (
                  <div key={idx} className="flex justify-between text-[10px] text-slate-600">
                    <span className="uppercase">{p.amount < 0 ? `Credit Note (${p.method})` : p.method}:</span>
                    <span className={p.amount < 0 ? 'text-rose-700 font-bold' : ''}>
                      {p.amount < 0 ? `-₹${Math.abs(p.amount)}` : `₹${p.amount}`}
                    </span>
                  </div>
                ))}
                {invoice.changeDue !== undefined && invoice.changeDue > 0 && (
                  <div className="flex justify-between text-[10px] text-blue-900 font-bold">
                    <span>Change Returned:</span>
                    <span>₹{invoice.changeDue}</span>
                  </div>
                )}
              </div>

              {/* Thermal Return Notes */}
              {invoice.notes && (
                <div className="py-1.5 border-b border-dashed border-slate-400 text-[9px] text-slate-700 font-mono whitespace-pre-line">
                  <span className="font-bold block uppercase">Note / Returns:</span>
                  {invoice.notes}
                </div>
              )}

              {/* Footer Policy */}
              <div className="pt-3 text-center text-[10px] text-slate-600 space-y-1">
                <p>Exchange within 7 days with bill.</p>
                <p>No refund without cash memo.</p>
                <p className="font-bold text-slate-800">*** THANK YOU! VISIT AGAIN ***</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
