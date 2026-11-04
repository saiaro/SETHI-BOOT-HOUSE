import React, { useState, useMemo } from 'react';
import { X, RefreshCw, Undo2, Check, AlertCircle, ArrowRight, UserCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Invoice, Product, SaleItem } from '../../types/database';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';

interface ReturnExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

interface ReturnSelection {
  [saleItemId: string]: {
    selected: boolean;
    quantity: number;
  };
}

export const ReturnExchangeModal: React.FC<ReturnExchangeModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const { products, customers, processReturnOrExchange } = useStore();
  const { currentUser } = useAuth();
  const { t, formatINR } = useTranslation();

  // Find linked customer
  const linkedCustomer = useMemo(() => {
    if (invoice.customerId) {
      const byId = customers.find(c => c.id === invoice.customerId);
      if (byId) return byId;
    }
    if (invoice.customerPhone) {
      const byPhone = customers.find(c => c.phone && c.phone === invoice.customerPhone);
      if (byPhone) return byPhone;
    }
    if (invoice.customerName && invoice.customerName.toLowerCase() !== 'walk-in customer') {
      const byName = customers.find(c => c.name.toLowerCase() === invoice.customerName.toLowerCase());
      if (byName) return byName;
    }
    return null;
  }, [customers, invoice]);

  const isCreditInvoice = useMemo(() => {
    return invoice.payments.some(p => p.method === 'credit');
  }, [invoice]);

  const customerHasKhataBalance = (linkedCustomer?.outstandingBalance || 0) > 0;

  // Workflow toggle: 'return' (multi-item return & refund) or 'exchange' (size swap)
  const [workflowType, setWorkflowType] = useState<'return' | 'exchange'>('return');

  // Multi-item return state for 'return' mode
  const [returnSelections, setReturnSelections] = useState<ReturnSelection>(() => {
    const initial: ReturnSelection = {};
    invoice.items.forEach((item, index) => {
      const availableQty = Math.max(0, item.quantity - (item.returnedQuantity || 0));
      initial[item.id] = {
        // By default, select the first available item
        selected: index === 0 && availableQty > 0,
        quantity: availableQty > 0 ? 1 : 0
      };
    });
    return initial;
  });

  // Single-item selection for 'exchange' mode
  const [exchangeSelectedItemId, setExchangeSelectedItemId] = useState<string>(() => {
    const firstAvail = invoice.items.find(i => Math.max(0, i.quantity - (i.returnedQuantity || 0)) > 0);
    return firstAvail?.id || invoice.items[0]?.id || '';
  });

  // Settlement method:
  // If credit invoice or customer has outstanding due, default to 'khata_credit'
  const [settlementMethod, setSettlementMethod] = useState<'khata_credit' | 'cash' | 'upi'>(
    (isCreditInvoice || customerHasKhataBalance) ? 'khata_credit' : 'cash'
  );

  const [returnReason, setReturnReason] = useState<string>('Customer return - size / preference');

  // Exchange target state
  const [exchangeProdId, setExchangeProdId] = useState<string>(invoice.items[0]?.productId || '');
  const [exchangeVarId, setExchangeVarId] = useState<string>('');
  const [exchangeSettlementMethod, setExchangeSettlementMethod] = useState<'khata_credit' | 'cash' | 'upi'>(
    (isCreditInvoice || customerHasKhataBalance) ? 'khata_credit' : 'cash'
  );

  const [processError, setProcessError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected items calculation for 'return' mode
  const selectedReturnItemsList = invoice.items.filter(item => {
    const sel = returnSelections[item.id];
    return sel && sel.selected && sel.quantity > 0;
  });

  const totalReturnRefundAmount = selectedReturnItemsList.reduce((sum, item) => {
    const qty = returnSelections[item.id]?.quantity || 0;
    return sum + (item.rate * qty);
  }, 0);

  const totalReturnUnitsCount = selectedReturnItemsList.reduce((sum, item) => {
    return sum + (returnSelections[item.id]?.quantity || 0);
  }, 0);

  // Exchange calculation
  const exchangeReturnedItem = invoice.items.find(i => i.id === exchangeSelectedItemId) || invoice.items[0];
  const exchangeProductObj = products.find(p => p.id === exchangeProdId);
  const exchangeVariantObj = exchangeProductObj?.variants.find(v => v.id === exchangeVarId);

  const exchangeReturnCredit = exchangeReturnedItem ? exchangeReturnedItem.rate : 0;
  const exchangeNewShoePrice = exchangeVariantObj ? exchangeVariantObj.sellingPrice : 0;
  const exchangePriceDifference = exchangeNewShoePrice - exchangeReturnCredit;

  // Live Khata Pending Bill Calculation
  const currentKhataDue = linkedCustomer?.outstandingBalance || 0;
  let simulatedNewKhataDue = currentKhataDue;

  if (workflowType === 'return') {
    if (settlementMethod === 'khata_credit') {
      simulatedNewKhataDue = Math.max(0, currentKhataDue - totalReturnRefundAmount);
    }
  } else {
    if (exchangeSettlementMethod === 'khata_credit') {
      if (exchangePriceDifference < 0) {
        simulatedNewKhataDue = Math.max(0, currentKhataDue - Math.abs(exchangePriceDifference));
      } else if (exchangePriceDifference > 0) {
        simulatedNewKhataDue = currentKhataDue + exchangePriceDifference;
      }
    }
  }

  const handleToggleSelectItem = (itemId: string) => {
    setReturnSelections(prev => {
      const current = prev[itemId] || { selected: false, quantity: 1 };
      return {
        ...prev,
        [itemId]: {
          ...current,
          selected: !current.selected,
          quantity: current.quantity > 0 ? current.quantity : 1
        }
      };
    });
  };

  const handleQuantityChange = (itemId: string, qty: number, maxQty: number) => {
    const safeQty = Math.max(1, Math.min(qty, maxQty));
    setReturnSelections(prev => ({
      ...prev,
      [itemId]: {
        selected: true,
        quantity: safeQty
      }
    }));
  };

  const handleSelectAll = () => {
    const allSelected = invoice.items.every(item => {
      const avail = Math.max(0, item.quantity - (item.returnedQuantity || 0));
      return avail === 0 || returnSelections[item.id]?.selected;
    });

    const next: ReturnSelection = {};
    invoice.items.forEach(item => {
      const avail = Math.max(0, item.quantity - (item.returnedQuantity || 0));
      next[item.id] = {
        selected: !allSelected && avail > 0,
        quantity: avail > 0 ? avail : 0
      };
    });
    setReturnSelections(next);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessError(null);

    if (workflowType === 'return') {
      if (selectedReturnItemsList.length === 0 || totalReturnRefundAmount <= 0) {
        setProcessError('Please select at least one item and quantity to return.');
        return;
      }

      const returnedItemsPayload = selectedReturnItemsList.map(item => {
        const qty = returnSelections[item.id].quantity;
        return {
          productId: item.productId,
          variantId: item.variantId,
          saleItemId: item.id,
          quantity: qty,
          refundAmount: item.rate,
          reason: returnReason
        };
      });

      const res = processReturnOrExchange({
        invoiceId: invoice.id,
        type: 'return',
        returnedItems: returnedItemsPayload,
        settlementMethod,
        reason: returnReason,
        cashierName: currentUser?.name || 'Cashier'
      });

      if (res.success) {
        onClose();
      } else {
        setProcessError(res.error || 'Failed to process return');
      }
    } else {
      // Exchange mode
      if (!exchangeReturnedItem) {
        setProcessError('Please select an item to exchange');
        return;
      }
      if (!exchangeVarId || !exchangeVariantObj) {
        setProcessError('Please select a replacement footwear size/variant');
        return;
      }

      const res = processReturnOrExchange({
        invoiceId: invoice.id,
        type: 'exchange',
        returnedItem: {
          productId: exchangeReturnedItem.productId,
          variantId: exchangeReturnedItem.variantId,
          saleItemId: exchangeReturnedItem.id,
          quantity: 1,
          refundAmount: exchangeReturnedItem.rate,
          reason: returnReason
        },
        exchangeItem: {
          productId: exchangeProductObj!.id,
          variantId: exchangeVariantObj.id,
          quantity: 1,
          price: exchangeVariantObj.sellingPrice
        },
        exchangeSettlementMethod,
        reason: returnReason,
        cashierName: currentUser?.name || 'Cashier'
      });

      if (res.success) {
        onClose();
      } else {
        setProcessError(res.error || 'Failed to process size exchange');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {workflowType === 'return' ? 'Sales Return & Khata Reconciliation' : 'Footwear Size Exchange'}
              </h3>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                isCreditInvoice ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-800'
              }`}>
                {isCreditInvoice ? 'CREDIT BILL (KHATA)' : 'PAID BILL'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Invoice #{invoice.invoiceNumber} • Customer: {invoice.customerName} {invoice.customerPhone ? `(${invoice.customerPhone})` : ''}
            </p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workflow Toggle */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setWorkflowType('return')}
            className={`flex items-center justify-center gap-1.5 py-3 transition-colors ${
              workflowType === 'return' ? 'bg-white text-rose-900 border-b-2 border-rose-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Undo2 className="h-4 w-4" />
            <span>Return Items &amp; Deduct Bill / Refund</span>
          </button>

          <button
            type="button"
            onClick={() => setWorkflowType('exchange')}
            className={`flex items-center justify-center gap-1.5 py-3 transition-colors ${
              workflowType === 'exchange' ? 'bg-white text-blue-900 border-b-2 border-blue-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Exchange Size (e.g. Size 7 &rarr; 8)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProcessSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {processError && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{processError}</span>
            </div>
          )}

          {/* Customer Khata Balance Card (If linked customer exists) */}
          {linkedCustomer && (
            <div className="rounded-lg border border-amber-300 bg-gradient-to-r from-amber-50/90 to-amber-100/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-amber-800" />
                  <span className="font-bold text-amber-950">Customer Khata Account: {linkedCustomer.name}</span>
                </div>
                <span className="text-[11px] font-mono text-amber-800">Ph: {linkedCustomer.phone}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white/90 rounded border border-amber-200 p-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Current Khata Due</span>
                  <span className="text-sm font-bold font-mono text-amber-900">
                    {formatINR(currentKhataDue)}
                  </span>
                </div>

                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Return Deduction</span>
                  <span className={`text-sm font-bold font-mono ${
                    workflowType === 'return'
                      ? totalReturnRefundAmount > 0 ? 'text-rose-700' : 'text-slate-400'
                      : exchangePriceDifference !== 0 ? 'text-blue-700' : 'text-slate-400'
                  }`}>
                    {workflowType === 'return'
                      ? (settlementMethod === 'khata_credit' ? `-₹${totalReturnRefundAmount}` : '₹0 (Cash/UPI)')
                      : (exchangeSettlementMethod === 'khata_credit'
                          ? (exchangePriceDifference < 0 ? `-₹${Math.abs(exchangePriceDifference)}` : `+₹${exchangePriceDifference}`)
                          : '₹0')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">New Pending Due</span>
                  <span className={`text-sm font-black font-mono ${
                    simulatedNewKhataDue < currentKhataDue ? 'text-emerald-700' : 'text-slate-900'
                  }`}>
                    {formatINR(simulatedNewKhataDue)}
                  </span>
                </div>
              </div>

              {settlementMethod === 'khata_credit' && workflowType === 'return' && totalReturnRefundAmount > 0 && (
                <p className="text-[11px] text-amber-900 font-medium">
                  ✓ Returning these item(s) will automatically reduce {linkedCustomer.name}&apos;s pending bill by <strong>₹{totalReturnRefundAmount}</strong> and record an immutable credit note in their Khata ledger.
                </p>
              )}
            </div>
          )}

          {/* WORKFLOW 1: MULTI-ITEM RETURN */}
          {workflowType === 'return' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-800 block text-xs">
                    Select Items Being Returned by Customer:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Check the items to return and adjust the quantity. Returned shoes will be restocked immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-bold text-blue-900 hover:underline"
                >
                  Select / Deselect All
                </button>
              </div>

              {/* Items Table */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-2.5 w-8 text-center">#</th>
                      <th className="py-2 px-2.5">Footwear Item</th>
                      <th className="py-2 px-2 text-center">Billed</th>
                      <th className="py-2 px-2 text-center">Prev Ret.</th>
                      <th className="py-2 px-2 text-center">Return Qty</th>
                      <th className="py-2 px-2.5 text-right">Unit Rate</th>
                      <th className="py-2 px-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.items.map(item => {
                      const prevReturned = item.returnedQuantity || 0;
                      const availableQty = Math.max(0, item.quantity - prevReturned);
                      const isFullyReturned = availableQty <= 0;
                      const isSelected = !!returnSelections[item.id]?.selected;
                      const returnQty = returnSelections[item.id]?.quantity || 1;
                      const itemRefundSubtotal = item.rate * (isSelected ? returnQty : 0);

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isFullyReturned
                              ? 'bg-slate-100/60 opacity-60'
                              : isSelected
                              ? 'bg-blue-50/50'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2.5 px-2.5 text-center">
                            <input
                              type="checkbox"
                              disabled={isFullyReturned}
                              checked={isSelected}
                              onChange={() => handleToggleSelectItem(item.id)}
                              className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                            />
                          </td>

                          <td className="py-2.5 px-2.5">
                            <p className="font-bold text-slate-900">{item.productName}</p>
                            <p className="text-[11px] text-slate-500">
                              Brand: {item.brand} • Size: <span className="font-bold text-slate-800">{item.size}</span> • Color: {item.color}
                            </p>
                          </td>

                          <td className="py-2.5 px-2 text-center font-mono font-medium">
                            {item.quantity}
                          </td>

                          <td className="py-2.5 px-2 text-center font-mono text-slate-500">
                            {prevReturned > 0 ? (
                              <span className="rounded bg-rose-100 text-rose-800 px-1.5 py-0.5 text-[10px] font-bold">
                                {prevReturned} ret
                              </span>
                            ) : '-'}
                          </td>

                          <td className="py-2.5 px-2 text-center">
                            {isFullyReturned ? (
                              <span className="text-[10px] font-bold text-rose-700">All Returned</span>
                            ) : (
                              <div className="inline-flex items-center gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  max={availableQty}
                                  value={isSelected ? returnQty : 1}
                                  disabled={!isSelected}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1, availableQty)}
                                  className="w-14 rounded border border-slate-300 py-1 px-1.5 text-center font-bold text-xs bg-white disabled:bg-slate-100"
                                />
                                <span className="text-[10px] text-slate-400">/ {availableQty}</span>
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-2.5 text-right font-mono font-medium text-slate-700">
                            ₹{item.rate}
                          </td>

                          <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">
                            ₹{itemRefundSubtotal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Refund Summary Bar */}
              <div className="rounded-lg bg-slate-900 text-white p-3 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-300 block">Total Items Selected for Return:</span>
                  <span className="text-base font-bold text-white">
                    {totalReturnUnitsCount} item(s) from {selectedReturnItemsList.length} product(s)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 block">Total Return Refund Value:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {formatINR(totalReturnRefundAmount)}
                  </span>
                </div>
              </div>

              {/* Settlement / Refund Method Selector */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2.5">
                <label className="font-bold text-slate-800 block text-xs">
                  How should this return amount (₹{totalReturnRefundAmount}) be settled? *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Option 1: Deduct from Khata (Default for Credit / Balance) */}
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      settlementMethod === 'khata_credit'
                        ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlement"
                      value="khata_credit"
                      checked={settlementMethod === 'khata_credit'}
                      onChange={() => setSettlementMethod('khata_credit')}
                      className="mt-0.5 text-blue-900 focus:ring-blue-900"
                    />
                    <div>
                      <span className="block text-xs font-bold flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5 text-blue-900" />
                        Deduct from Khata
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        Reduces customer&apos;s pending bill balance directly
                      </span>
                    </div>
                  </label>

                  {/* Option 2: Cash Refund */}
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      settlementMethod === 'cash'
                        ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlement"
                      value="cash"
                      checked={settlementMethod === 'cash'}
                      onChange={() => setSettlementMethod('cash')}
                      className="mt-0.5 text-blue-900 focus:ring-blue-900"
                    />
                    <div>
                      <span className="block text-xs font-bold flex items-center gap-1">
                        <Banknote className="h-3.5 w-3.5 text-emerald-700" />
                        Cash Refund
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        Pay physical cash from store cash drawer
                      </span>
                    </div>
                  </label>

                  {/* Option 3: UPI / Bank */}
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      settlementMethod === 'upi'
                        ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlement"
                      value="upi"
                      checked={settlementMethod === 'upi'}
                      onChange={() => setSettlementMethod('upi')}
                      className="mt-0.5 text-blue-900 focus:ring-blue-900"
                    />
                    <div>
                      <span className="block text-xs font-bold flex items-center gap-1">
                        <Smartphone className="h-3.5 w-3.5 text-indigo-700" />
                        UPI / Bank
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        Transfer refund to customer UPI/Account
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            /* WORKFLOW 2: FOOTWEAR SIZE EXCHANGE */
            <div className="space-y-3">
              {/* Item being exchanged */}
              <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-2">
                <label className="font-bold text-slate-700 block">Select Item to Exchange:</label>
                <select
                  value={exchangeSelectedItemId}
                  onChange={(e) => {
                    setExchangeSelectedItemId(e.target.value);
                    const item = invoice.items.find(i => i.id === e.target.value);
                    if (item) setExchangeProdId(item.productId);
                  }}
                  className="w-full rounded border border-slate-300 bg-white py-1.5 px-2 text-xs font-medium"
                >
                  {invoice.items.map(i => {
                    const avail = Math.max(0, i.quantity - (i.returnedQuantity || 0));
                    return (
                      <option key={i.id} value={i.id} disabled={avail <= 0}>
                        {i.productName} (Size: {i.size}, {i.color}) - Billed at ₹{i.rate} {avail <= 0 ? '(Already returned)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Replacement Footwear Selection */}
              <div className="rounded border border-blue-200 bg-blue-50/40 p-3 space-y-3">
                <label className="font-bold text-blue-950 block">Select Replacement Shoe / Size:</label>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-600 font-semibold">Select Footwear:</span>
                    <select
                      value={exchangeProdId}
                      onChange={(e) => {
                        setExchangeProdId(e.target.value);
                        setExchangeVarId('');
                      }}
                      className="mt-1 w-full rounded border border-slate-300 bg-white py-1.5 px-2 text-xs"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-600 font-semibold">Select Size &amp; Variant:</span>
                    <select
                      value={exchangeVarId}
                      onChange={(e) => setExchangeVarId(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 bg-white py-1.5 px-2 text-xs font-bold text-blue-900"
                    >
                      <option value="">-- Choose replacement size --</option>
                      {exchangeProductObj?.variants.map(v => (
                        <option key={v.id} value={v.id} disabled={v.stockQuantity <= 0}>
                          Size {v.size} ({v.color}) - Stock: {v.stockQuantity} - ₹{v.sellingPrice}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Difference Calculation */}
                {exchangeVariantObj && (
                  <div className="rounded border border-blue-200 bg-white p-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-600 font-medium">Price Difference:</span>
                      <p className="text-[10px] text-slate-400">
                        Returned: ₹{exchangeReturnCredit} vs Replacement: ₹{exchangeNewShoePrice}
                      </p>
                    </div>
                    <span className={`text-sm font-black font-mono ${
                      exchangePriceDifference > 0 ? 'text-amber-800' : exchangePriceDifference < 0 ? 'text-emerald-800' : 'text-slate-800'
                    }`}>
                      {exchangePriceDifference > 0
                        ? `Customer pays extra ₹${exchangePriceDifference}`
                        : exchangePriceDifference < 0
                        ? `Refund to customer ₹${Math.abs(exchangePriceDifference)}`
                        : 'Even Exchange (₹0)'}
                    </span>
                  </div>
                )}

                {/* Settlement if price difference exists */}
                {exchangeVariantObj && exchangePriceDifference !== 0 && linkedCustomer && (
                  <div className="pt-2 border-t border-blue-200">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Settle Price Difference ({exchangePriceDifference > 0 ? `+₹${exchangePriceDifference}` : `-₹${Math.abs(exchangePriceDifference)}`}):
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="ex_settlement"
                          value="khata_credit"
                          checked={exchangeSettlementMethod === 'khata_credit'}
                          onChange={() => setExchangeSettlementMethod('khata_credit')}
                          className="text-blue-900"
                        />
                        <span>Adjust Customer Khata Balance</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="ex_settlement"
                          value="cash"
                          checked={exchangeSettlementMethod === 'cash'}
                          onChange={() => setExchangeSettlementMethod('cash')}
                          className="text-blue-900"
                        />
                        <span>Settle via Cash</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason for Return / Exchange */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Reason for Return / Exchange *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                'Size fitting issue - customer wants return',
                'Sole / Stitching quality defect',
                'Customer changed mind',
                'Different model preference'
              ].map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setReturnReason(tag)}
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    returnReason === tag ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="e.g. Size 8 was tight for customer, exchanging or returning"
              className="w-full rounded border border-slate-300 py-1.5 px-3 text-xs"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={workflowType === 'return' ? (selectedReturnItemsList.length === 0 || totalReturnRefundAmount <= 0) : !exchangeVarId}
              className="flex items-center gap-1.5 rounded bg-blue-900 px-5 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>
                {workflowType === 'return'
                  ? `Confirm Return (${totalReturnUnitsCount} Items • ${formatINR(totalReturnRefundAmount)})`
                  : 'Confirm Size Exchange'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
