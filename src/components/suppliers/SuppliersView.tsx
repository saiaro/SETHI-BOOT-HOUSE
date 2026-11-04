import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  History,
  Check,
  X,
  Building2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { Supplier, SupplierLedgerEntry } from '../../types/database';

export const SuppliersView: React.FC = () => {
  const { suppliers, supplierLedger, recordSupplierPayment, saveSupplier } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSupplierDetail, setActiveSupplierDetail] = useState<Supplier | null>(null);

  // Pay Supplier Modal State
  const [paySupplierObj, setPaySupplierObj] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'upi' | 'cash'>('bank_transfer');
  const [payRef, setPayRef] = useState<string>('');

  // New Supplier Modal
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState<Partial<Supplier>>({
    name: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hisar',
    state: 'Haryana',
    gstin: '',
    paymentTerms: '30 Days Credit',
    openingBalance: 0
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        s.companyName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.city.toLowerCase().includes(q) ||
        (s.gstin && s.gstin.toLowerCase().includes(q))
      );
    });
  }, [suppliers, searchQuery]);

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupplierObj || payAmount <= 0) return;

    recordSupplierPayment({
      supplierId: paySupplierObj.id,
      amount: payAmount,
      paymentMethod: payMethod,
      referenceNumber: payRef || `PMT-${Date.now().toString().slice(-4)}`
    });

    setPaySupplierObj(null);
    setPayAmount(0);
    setPayRef('');
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.suppliers}</h1>
          <p className="text-xs text-slate-500">
            Footwear Wholesalers, Distributors (Hisar, Delhi, Sirsa) &amp; Accounts Payable
          </p>
        </div>

        <button
          onClick={() => setIsNewSupplierOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Active Footwear Distributors</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{suppliers.length} Agencies</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Total Supplier Outstanding Payable</span>
          <p className="text-xl font-bold text-rose-700 mt-1">
            {formatINR(suppliers.reduce((a, b) => a + (b.outstandingBalance || 0), 0))}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="font-medium text-slate-500">Total Historical Inward Purchases</span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatINR(suppliers.reduce((a, b) => a + (b.totalPurchases || 0), 0))}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, contact person, city, GSTIN..."
            className="w-full rounded border border-slate-300 py-1.5 pl-9 pr-3 text-xs"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">Company &amp; Contact Person</th>
              <th className="py-2.5 px-3">City &amp; Address</th>
              <th className="py-2.5 px-3">Phone / Contact</th>
              <th className="py-2.5 px-3">GSTIN</th>
              <th className="py-2.5 px-3 text-right">Total Purchases</th>
              <th className="py-2.5 px-3 text-right">Outstanding Balance</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSuppliers.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3">
                  <p className="font-bold text-slate-900">{s.companyName}</p>
                  <p className="text-[11px] text-slate-500">Contact: {s.contactPerson} ({s.paymentTerms})</p>
                </td>

                <td className="py-2.5 px-3 text-slate-600">
                  <p className="font-medium text-slate-800">{s.city}, {s.state}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs">{s.address}</p>
                </td>

                <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                  {s.phone}
                </td>

                <td className="py-2.5 px-3 font-mono text-slate-600">
                  {s.gstin || 'N/A'}
                </td>

                <td className="py-2.5 px-3 text-right font-mono text-slate-900 font-semibold">
                  {formatINR(s.totalPurchases || 0)}
                </td>

                <td className="py-2.5 px-3 text-right font-mono font-bold">
                  <span className={s.outstandingBalance > 0 ? 'text-rose-700 text-sm' : 'text-slate-500'}>
                    {formatINR(s.outstandingBalance || 0)}
                  </span>
                </td>

                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Pay Supplier Button */}
                    {s.outstandingBalance > 0 && (
                      <button
                        onClick={() => {
                          setPaySupplierObj(s);
                          setPayAmount(s.outstandingBalance);
                        }}
                        className="rounded border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-900 hover:bg-rose-100"
                        title="Record payment made to supplier"
                      >
                        Pay Supplier
                      </button>
                    )}

                    {/* Supplier Ledger */}
                    <button
                      onClick={() => setActiveSupplierDetail(s)}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                      title="View Supplier Account Ledger"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supplier Ledger Modal */}
      {activeSupplierDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeSupplierDetail.companyName} — Ledger Statement
                </h3>
                <p className="text-xs text-slate-500">GSTIN: {activeSupplierDetail.gstin || 'N/A'} • {activeSupplierDetail.city}</p>
              </div>
              <button onClick={() => setActiveSupplierDetail(null)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <div className="p-4 bg-rose-50/50 border-b border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-600 font-medium">Payable Amount Due to Supplier:</span>
                <p className="text-xl font-black text-rose-800 font-mono">
                  {formatINR(activeSupplierDetail.outstandingBalance)}
                </p>
              </div>
              {activeSupplierDetail.outstandingBalance > 0 && (
                <button
                  onClick={() => {
                    setPaySupplierObj(activeSupplierDetail);
                    setPayAmount(activeSupplierDetail.outstandingBalance);
                  }}
                  className="rounded bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-800"
                >
                  Record Payment
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Transaction / Ref</th>
                    <th className="py-2 px-3 text-right">Debit (Payment -)</th>
                    <th className="py-2 px-3 text-right">Credit (Purchase +)</th>
                    <th className="py-2 px-3 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {supplierLedger
                    .filter((e: SupplierLedgerEntry) => e.supplierId === activeSupplierDetail.id)
                    .map((entry: SupplierLedgerEntry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">{entry.date}</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">{entry.description}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">
                          {entry.debit > 0 ? `+₹${entry.debit}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-rose-700">
                          {entry.credit > 0 ? `-₹${entry.credit}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-black text-slate-900">
                          ₹{entry.balance}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pay Supplier Modal */}
      {paySupplierObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900">
                Pay Supplier: {paySupplierObj.companyName}
              </h3>
              <button onClick={() => setPaySupplierObj(null)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handlePaySupplierSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Payment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paySupplierObj.outstandingBalance}
                  value={payAmount || ''}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-slate-300 py-2 px-3 text-base font-bold font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Payment Mode:</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white font-semibold"
                >
                  <option value="bank_transfer">RTGS / NEFT (Bank Account)</option>
                  <option value="upi">UPI (GPay / PhonePe)</option>
                  <option value="cash">Cash (From Counter Daybook)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Bank UTR / Cheque / Ref Number *</label>
                <input
                  type="text"
                  required
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UTR-PNB-0988123"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaySupplierObj(null)}
                  className="rounded px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
                >
                  Record Payment &amp; Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Supplier Modal */}
      {isNewSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900">Add Footwear Wholesaler / Agency</h3>
              <button onClick={() => setIsNewSupplierOpen(false)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!supplierForm.companyName || !supplierForm.phone) return;
                saveSupplier({
                  name: supplierForm.contactPerson || supplierForm.companyName!,
                  companyName: supplierForm.companyName!,
                  contactPerson: supplierForm.contactPerson || '',
                  phone: supplierForm.phone!,
                  email: supplierForm.email,
                  address: supplierForm.address || '',
                  city: supplierForm.city || 'Hisar',
                  state: supplierForm.state || 'Haryana',
                  gstin: supplierForm.gstin,
                  paymentTerms: supplierForm.paymentTerms || '30 Days Credit',
                  openingBalance: supplierForm.openingBalance || 0
                });
                setIsNewSupplierOpen(false);
              }}
              className="p-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700">Company / Agency Name *</label>
                <input
                  type="text"
                  required
                  value={supplierForm.companyName || ''}
                  onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                  placeholder="e.g. Rohtak Footwear Agencies"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Contact Person</label>
                  <input
                    type="text"
                    value={supplierForm.contactPerson || ''}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    placeholder="e.g. Anil Kumar"
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={supplierForm.phone || ''}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    placeholder="+91 98120..."
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={supplierForm.city || ''}
                    onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">GSTIN</label>
                  <input
                    type="text"
                    value={supplierForm.gstin || ''}
                    onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value })}
                    placeholder="06AAAAA..."
                    className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierOpen(false)}
                  className="rounded px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
