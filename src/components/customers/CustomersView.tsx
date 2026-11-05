import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  CreditCard,
  Sparkles,
  Cake,
  History,
  Check,
  X,
  Wallet
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { Customer, CustomerLedgerEntry } from '../../types/database';

export const CustomersView: React.FC = () => {
  const { customers, customerLedger, invoices, recordCustomerPayment, saveCustomer } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Customer Modals
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<Customer | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('cash');
  const [paymentRef, setPaymentRef] = useState<string>('');

  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);
  const [custForm, setCustForm] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: 'Ratia',
    state: 'Haryana',
    customerType: 'Regular',
    preferredBrands: ['Campus'],
    preferredSizes: ['8']
  });

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.address && c.address.toLowerCase().includes(q));

      const matchesType = filterType === 'all' ||
        (filterType === 'khata_due' ? c.outstandingBalance > 0 : c.customerType === filterType);

      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, filterType]);

  // Handle Khata Payment Submission
  const handleKhataPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentCustomer || paymentAmount <= 0) return;

    recordCustomerPayment({
      customerId: paymentCustomer.id,
      amount: paymentAmount,
      paymentMethod,
      reference: paymentRef
    });

    setPaymentCustomer(null);
    setPaymentAmount(0);
    setPaymentRef('');
  };

  // WhatsApp Payment Reminder Link
  const sendWhatsAppReminder = (customer: Customer) => {
    const phone = customer.whatsapp || customer.phone;
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Namaste ${customer.name} Ji! Greetings from *SETHI BOOT HOUSE*, Ratia.\n\n` +
      `This is a gentle reminder that your current store Khata outstanding balance is *₹${customer.outstandingBalance}*.\n\n` +
      `You can clear it at our store or via UPI to *9896012345@pnb*.\n` +
      `Thank you for being our valued customer!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.customers}</h1>
          <p className="text-xs text-slate-500">
            Customer Directory, Khata Credit Balances &amp; Loyalty Rewards
          </p>
        </div>

        <button
          onClick={() => setIsNewCustModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
          <span className="font-medium text-slate-500">Total Registered Customers</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{customers.length}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
          <span className="font-medium text-slate-500">Total Customer Khata Due</span>
          <p className="text-xl font-bold text-amber-700 mt-1">
            {formatINR(customers.reduce((a, b) => a + (b.outstandingBalance || 0), 0))}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
          <span className="font-medium text-slate-500">Total Loyalty Points In Circulation</span>
          <p className="text-xl font-bold text-indigo-700 mt-1">
            {customers.reduce((a, b) => a + (b.loyaltyPoints || 0), 0)} Pts
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
          <span className="font-medium text-slate-500">VIP &amp; Regular Buyers</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">
            {customers.filter(c => c.customerType === 'VIP' || c.customerType === 'Regular').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, mobile, address..."
              className="w-full rounded border border-slate-300 py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Customer Types</option>
              <option value="khata_due">Outstanding Khata Due (&gt; ₹0)</option>
              <option value="VIP">VIP Customers</option>
              <option value="Regular">Regular</option>
              <option value="Wholesale">Wholesale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">Customer Name</th>
              <th className="py-2.5 px-3">Mobile &amp; WhatsApp</th>
              <th className="py-2.5 px-3">City / Area</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3 text-right">Total Spent</th>
              <th className="py-2.5 px-3 text-right">Khata Due</th>
              <th className="py-2.5 px-3 text-center">Loyalty Points</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map(cust => (
              <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3">
                  <p className="font-bold text-slate-900">{cust.name}</p>
                  {cust.notes && <p className="text-[10px] text-slate-400 truncate max-w-xs">{cust.notes}</p>}
                </td>

                <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                  {cust.phone}
                </td>

                <td className="py-2.5 px-3 text-slate-600">
                  {cust.address ? `${cust.address}, ${cust.city}` : cust.city}
                </td>

                <td className="py-2.5 px-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                    cust.customerType === 'VIP' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cust.customerType}
                  </span>
                </td>

                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatINR(cust.totalSpent || 0)}
                  <span className="text-[10px] text-slate-400 block font-normal">({cust.totalPurchasesCount || 0} bills)</span>
                </td>

                <td className="py-2.5 px-3 text-right font-mono font-bold">
                  <span className={cust.outstandingBalance > 0 ? 'text-amber-800 text-sm' : 'text-slate-500'}>
                    {formatINR(cust.outstandingBalance || 0)}
                  </span>
                </td>

                <td className="py-2.5 px-3 text-center font-bold text-indigo-700">
                  {cust.loyaltyPoints || 0} pts
                </td>

                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Receive Khata Payment */}
                    {cust.outstandingBalance > 0 && (
                      <button
                        onClick={() => {
                          setPaymentCustomer(cust);
                          setPaymentAmount(cust.outstandingBalance);
                        }}
                        className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
                        title="Receive Cash/UPI against Khata balance"
                      >
                        Receive Pay
                      </button>
                    )}

                    {/* WhatsApp Reminder */}
                    {cust.outstandingBalance > 0 && (
                      <button
                        onClick={() => sendWhatsAppReminder(cust)}
                        className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                        title="Send WhatsApp Khata balance reminder"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    )}

                    {/* Customer Ledger History */}
                    <button
                      onClick={() => setActiveCustomerDetail(cust)}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                      title="View Khata Ledger"
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

      {/* Khata Ledger History Modal */}
      {(() => {
        const liveCustomer = activeCustomerDetail ? (customers.find(c => c.id === activeCustomerDetail.id) || activeCustomerDetail) : null;
        if (!liveCustomer) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {liveCustomer.name} — Khata Account Ledger
                  </h3>
                  <p className="text-xs text-slate-500">Phone: {liveCustomer.phone} • {liveCustomer.city}</p>
                </div>
                <button onClick={() => setActiveCustomerDetail(null)} className="rounded p-1 text-slate-400 hover:bg-slate-200">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 bg-amber-50/50 border-b border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-600 font-medium">Current Outstanding Balance:</span>
                  <p className="text-xl font-black text-amber-800 font-mono">
                    {formatINR(liveCustomer.outstandingBalance)}
                  </p>
                </div>
                {liveCustomer.outstandingBalance > 0 && (
                  <button
                    onClick={() => {
                      setPaymentCustomer(liveCustomer);
                      setPaymentAmount(liveCustomer.outstandingBalance);
                    }}
                    className="rounded bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-800"
                  >
                    Receive Payment Now
                  </button>
                )}
              </div>

            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Description / Ref</th>
                    <th className="py-2 px-3 text-right">Debit (Credit Sale +)</th>
                    <th className="py-2 px-3 text-right">Credit (Paid -)</th>
                    <th className="py-2 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {customerLedger
                    .filter((e: CustomerLedgerEntry) => e.customerId === liveCustomer.id)
                    .map((entry: CustomerLedgerEntry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">{entry.date}</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">{entry.description}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-700">
                          {entry.debit > 0 ? `+₹${entry.debit}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">
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
      );
    })()}

      {/* Receive Khata Payment Modal */}
      {paymentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900">
                Receive Khata Payment from {paymentCustomer.name}
              </h3>
              <button onClick={() => setPaymentCustomer(null)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleKhataPaymentSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentCustomer.outstandingBalance}
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-slate-300 py-2 px-3 text-base font-bold font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Payment Mode:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white font-semibold"
                >
                  <option value="cash">Cash (Counter)</option>
                  <option value="upi">UPI / GPay / PhonePe</option>
                  <option value="card">Debit / Credit Card</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Reference / Receipt Number (Optional):</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. UPI-989601..."
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentCustomer(null)}
                  className="rounded px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
                >
                  Confirm &amp; Update Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {isNewCustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Customer</h3>
              <button onClick={() => setIsNewCustModalOpen(false)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!custForm.name || !custForm.phone) return;
                saveCustomer({
                  name: custForm.name,
                  phone: custForm.phone,
                  whatsapp: custForm.whatsapp || custForm.phone,
                  address: custForm.address || '',
                  city: custForm.city || 'Ratia',
                  state: 'Haryana',
                  customerType: custForm.customerType || 'Regular',
                  preferredBrands: custForm.preferredBrands || [],
                  preferredSizes: custForm.preferredSizes || []
                });
                setIsNewCustModalOpen(false);
              }}
              className="p-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={custForm.name || ''}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                  placeholder="e.g. Gurpreet Singh"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={custForm.phone || ''}
                  onChange={(e) => setCustForm({ ...custForm, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="9896012345"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Address / Village / Colony</label>
                <input
                  type="text"
                  value={custForm.address || ''}
                  onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                  placeholder="e.g. Near Bus Stand, Ratia"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustModalOpen(false)}
                  className="rounded px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
