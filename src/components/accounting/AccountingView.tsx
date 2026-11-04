import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Wallet,
  Building,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Expense, ExpenseCategory } from '../../types/database';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Electricity',
  'Staff Salary',
  'Transportation & Freight',
  'Marketing & Ads',
  'Packaging & Bags',
  'Store Maintenance',
  'Tea & Refreshments',
  'Internet & Utilities',
  'Other Expenses'
];

export const AccountingView: React.FC = () => {
  const { expenses, invoices, customers, suppliers, products, recordExpense, kpis } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'daybook' | 'expenses' | 'pnl' | 'balance_sheet'>('daybook');

  // Expense Modal
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Tea & Refreshments');
  const [expAmount, setExpAmount] = useState<number>(100);
  const [expMethod, setExpMethod] = useState<'cash' | 'upi' | 'bank_transfer'>('cash');
  const [expPaidTo, setExpPaidTo] = useState<string>('');
  const [expDescription, setExpDescription] = useState<string>('');

  // Daily Cash Book & Bank Book calculation
  const daybook = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Cash In: Counter cash sales today
    let cashIn = 0;
    let upiIn = 0;

    invoices.forEach(inv => {
      if (inv.date.startsWith(todayStr) && inv.status !== 'cancelled') {
        inv.payments.forEach(p => {
          if (p.method === 'cash') cashIn += p.amount;
          if (p.method === 'upi' || p.method === 'card' || p.method === 'bank_transfer') upiIn += p.amount;
        });
      }
    });

    // Cash Out: Today's cash expenses
    let cashOut = 0;
    let bankOut = 0;

    expenses.forEach(e => {
      if (e.date.startsWith(todayStr)) {
        if (e.paymentMethod === 'cash') cashOut += e.amount;
        else bankOut += e.amount;
      }
    });

    const openingCash = 5000; // Standard morning counter float in Ratia
    const closingCash = openingCash + cashIn - cashOut;

    return {
      openingCash,
      cashIn,
      cashOut,
      closingCash,
      upiIn,
      bankOut
    };
  }, [invoices, expenses]);

  // P&L Calculation
  const pnl = useMemo(() => {
    let totalSales = 0;
    let cogs = 0;

    invoices.forEach(inv => {
      if (inv.status !== 'cancelled') {
        totalSales += inv.grandTotal;
        inv.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          const variant = prod?.variants.find(v => v.id === item.variantId);
          const cost = variant ? variant.purchaseCost : item.rate * 0.7;
          cogs += cost * item.quantity;
        });
      }
    });

    const grossProfit = Math.max(0, totalSales - cogs);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;

    return {
      totalSales,
      cogs,
      grossProfit,
      totalExpenses,
      netProfit,
      margin: totalSales > 0 ? (netProfit / totalSales) * 100 : 0
    };
  }, [invoices, expenses, products]);

  // Handle Add Expense
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0 || !expPaidTo) return;

    recordExpense({
      category: expCategory,
      amount: expAmount,
      paymentMethod: expMethod,
      paidTo: expPaidTo,
      date: new Date().toISOString().split('T')[0],
      description: expDescription || `${expCategory} voucher`,
      recordedBy: currentUser.name
    });

    setIsAddExpenseOpen(false);
    setExpAmount(100);
    setExpPaidTo('');
    setExpDescription('');
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.accounts}</h1>
          <p className="text-xs text-slate-500">
            Daily Cash Book (रोकड़ बही), Expense Vouchers &amp; Real Profit-Loss
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Store Expense</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-2 text-xs font-bold gap-4 rounded-t-lg">
        {[
          { id: 'daybook', label: 'Daily Cash & Bank Register' },
          { id: 'expenses', label: `Store Expenses (${expenses.length})` },
          { id: 'pnl', label: 'Profit & Loss Statement' },
          { id: 'balance_sheet', label: 'Balance Sheet & Trial Balance' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-blue-900 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Daily Cash & Bank Register */}
      {activeTab === 'daybook' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash in Hand Register */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-900" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Today&apos;s Cash Register (Counter Drawer)</h3>
                    <p className="text-[11px] text-slate-500">Physical notes &amp; coins in Ratia store</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded">
                  {new Date().toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Opening Cash Float (Morning):</span>
                  <span>{formatINR(daybook.openingCash)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>+ Cash Sales Collections (In):</span>
                  <span>+{formatINR(daybook.cashIn)}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>- Cash Expenses &amp; Petty Cash (Out):</span>
                  <span>-{formatINR(daybook.cashOut)}</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Closing Drawer Cash:</span>
                  <span>{formatINR(daybook.closingCash)}</span>
                </div>
              </div>
            </div>

            {/* Bank & UPI Register */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-indigo-700" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Bank &amp; UPI Account (PNB Ratia)</h3>
                    <p className="text-[11px] text-slate-500">A/C 0345002100018899 • UPI 9896012345@pnb</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>+ UPI &amp; Card Payments Received:</span>
                  <span>+{formatINR(daybook.upiIn)}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>- Online / RTGS Supplier Payments Made:</span>
                  <span>-{formatINR(daybook.bankOut)}</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Net Digital Balance Today:</span>
                  <span>{formatINR(daybook.upiIn - daybook.bankOut)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses List */}
      {activeTab === 'expenses' && (
        <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">Voucher #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Paid To / Recipient</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 font-mono">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{e.voucherNumber}</td>
                  <td className="py-2.5 px-3 text-slate-500">{e.date}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{e.category}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-700">{e.paidTo}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-500">{e.description}</td>
                  <td className="py-2.5 px-3 uppercase text-slate-600">{e.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-rose-700 text-sm">
                    {formatINR(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Profit & Loss Statement */}
      {activeTab === 'pnl' && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase">SETHI BOOT HOUSE, RATIA</h2>
            <p className="text-xs text-slate-500">PROFIT &amp; LOSS STATEMENT (FISCAL YEAR 2026-27)</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Revenue */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>Gross Footwear Sales Revenue:</span>
                <span>{formatINR(pnl.totalSales)}</span>
              </div>
              <div className="flex justify-between text-slate-600 pl-4">
                <span>Less Cost of Goods Sold (COGS - Purchase Cost):</span>
                <span>-{formatINR(pnl.cogs)}</span>
              </div>
            </div>

            <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-blue-900 text-sm">
              <span>GROSS PROFIT (सकल लाभ):</span>
              <span>{formatINR(pnl.grossProfit)}</span>
            </div>

            {/* Operating Expenses */}
            <div className="border-t border-slate-200 pt-3 space-y-1">
              <span className="font-bold text-slate-800 font-sans block">Operating Store Expenses:</span>
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between text-slate-600 pl-4">
                  <span>{e.category} ({e.paidTo}):</span>
                  <span>{formatINR(e.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-slate-800 pl-4 border-t border-slate-200 pt-1">
                <span>Total Operating Expenses:</span>
                <span>{formatINR(pnl.totalExpenses)}</span>
              </div>
            </div>

            {/* Net Profit */}
            <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-center text-slate-900">
              <span className="text-sm font-black uppercase">NET PROFIT (शुद्ध लाभ):</span>
              <span className="text-xl font-black font-mono text-emerald-800">
                {formatINR(pnl.netProfit)}
              </span>
            </div>
            <p className="text-right text-[11px] text-slate-500 font-sans">
              Net Profit Margin: {pnl.margin.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Balance Sheet & Trial Balance */}
      {activeTab === 'balance_sheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assets */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs space-y-3 text-xs font-mono">
            <h3 className="font-black text-slate-900 font-sans uppercase border-b border-slate-200 pb-2">
              Assets (संपत्तियां)
            </h3>
            <div className="flex justify-between text-slate-700">
              <span>Footwear Stock in Hand (at Cost):</span>
              <span>{formatINR(kpis.inventoryCostValue)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Customer Khata Receivables:</span>
              <span>{formatINR(kpis.customerReceivables)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Cash in Hand &amp; Bank:</span>
              <span>{formatINR(daybook.closingCash + daybook.upiIn)}</span>
            </div>
            <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-bold text-sm text-slate-900">
              <span>TOTAL ASSETS:</span>
              <span>{formatINR(kpis.inventoryCostValue + kpis.customerReceivables + daybook.closingCash + daybook.upiIn)}</span>
            </div>
          </div>

          {/* Liabilities & Equity */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs space-y-3 text-xs font-mono">
            <h3 className="font-black text-slate-900 font-sans uppercase border-b border-slate-200 pb-2">
              Liabilities &amp; Equity (देनदारियां)
            </h3>
            <div className="flex justify-between text-slate-700">
              <span>Supplier Accounts Payable:</span>
              <span>{formatINR(kpis.supplierPayables)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Owner Capital &amp; Retained Earnings:</span>
              <span>
                {formatINR(
                  Math.max(
                    0,
                    kpis.inventoryCostValue + kpis.customerReceivables + daybook.closingCash + daybook.upiIn - kpis.supplierPayables
                  )
                )}
              </span>
            </div>
            <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-bold text-sm text-slate-900">
              <span>TOTAL LIABILITIES &amp; EQUITY:</span>
              <span>{formatINR(kpis.inventoryCostValue + kpis.customerReceivables + daybook.closingCash + daybook.upiIn)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900">Add Store Expense Voucher</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="rounded p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Expense Category *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white font-medium"
                >
                  {EXPENSE_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={expAmount || ''}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-slate-300 py-2 px-3 text-base font-bold font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Paid To (Vendor / Person) *</label>
                <input
                  type="text"
                  required
                  value={expPaidTo}
                  onChange={(e) => setExpPaidTo(e.target.value)}
                  placeholder="e.g. Sharma Tea Stall Ratia"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Payment Mode</label>
                <select
                  value={expMethod}
                  onChange={(e) => setExpMethod(e.target.value as any)}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white"
                >
                  <option value="cash">Cash (Counter Drawer)</option>
                  <option value="upi">UPI (GPay / PhonePe)</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Voucher Description / Remarks</label>
                <input
                  type="text"
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="e.g. Daily tea and biscuits for customers and staff"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="rounded px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
                >
                  Save Voucher &amp; Deduct Daybook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
