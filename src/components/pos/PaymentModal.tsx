import React, { useState, useMemo } from 'react';
import { X, QrCode, CreditCard, Banknote, Users, Sparkles, Check } from 'lucide-react';
import { Customer, BusinessSettings } from '../../types/database';
import { useTranslation } from '../../i18n/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  customer?: Customer;
  settings: BusinessSettings;
  onConfirmPayment: (paymentData: {
    payments: { method: 'cash' | 'upi' | 'card' | 'credit' | 'bank_transfer'; amount: number; reference?: string }[];
    cashTendered?: number;
    changeDue?: number;
    redeemedPoints?: number;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  discount,
  taxableAmount,
  cgst,
  sgst,
  grandTotal,
  customer,
  settings,
  onConfirmPayment
}) => {
  const { t, formatINR } = useTranslation();

  const [activeMethod, setActiveMethod] = useState<'cash' | 'upi' | 'card' | 'credit' | 'split'>('cash');
  const [cashTendered, setCashTendered] = useState<number>(grandTotal);
  const [upiRef, setUpiRef] = useState<string>('');
  const [cardRef, setCardRef] = useState<string>('');
  const [splitCash, setSplitCash] = useState<number>(Math.floor(grandTotal / 2));
  const [splitUpi, setSplitUpi] = useState<number>(grandTotal - Math.floor(grandTotal / 2));

  // Loyalty points redemption
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const maxRedeemable = customer ? Math.min(customer.loyaltyPoints, Math.floor(grandTotal * 0.5)) : 0;

  const finalPayable = Math.max(0, grandTotal - redeemPoints);
  const changeDue = Math.max(0, cashTendered - finalPayable);

  if (!isOpen) return null;

  const handleComplete = () => {
    let payments: { method: 'cash' | 'upi' | 'card' | 'credit' | 'bank_transfer'; amount: number; reference?: string }[] = [];

    if (activeMethod === 'cash') {
      payments.push({ method: 'cash', amount: finalPayable });
    } else if (activeMethod === 'upi') {
      payments.push({ method: 'upi', amount: finalPayable, reference: upiRef || 'UPI-APP' });
    } else if (activeMethod === 'card') {
      payments.push({ method: 'card', amount: finalPayable, reference: cardRef || 'CARD-POS' });
    } else if (activeMethod === 'credit') {
      payments.push({ method: 'credit', amount: finalPayable, reference: 'KHATA-CREDIT' });
    } else if (activeMethod === 'split') {
      payments.push({ method: 'cash', amount: splitCash });
      payments.push({ method: 'upi', amount: splitUpi, reference: upiRef || 'SPLIT-UPI' });
    }

    onConfirmPayment({
      payments,
      cashTendered: activeMethod === 'cash' ? cashTendered : undefined,
      changeDue: activeMethod === 'cash' ? changeDue : undefined,
      redeemedPoints: redeemPoints > 0 ? redeemPoints : undefined
    });
  };

  // UPI QR String
  const upiQrString = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.businessName)}&am=${finalPayable}&cu=INR`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[92vh] w-full max-w-xl flex-col rounded-lg bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Complete Payment</h3>
            <p className="text-xs text-slate-500">
              Customer: <span className="font-semibold text-slate-800">{customer?.name || 'Walk-in Customer'}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Amount Summary */}
        <div className="bg-blue-900 p-5 text-white flex justify-between items-center">
          <div>
            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Total Amount Due</p>
            <p className="text-2xl font-black">{formatINR(finalPayable)}</p>
            <p className="text-[11px] text-blue-200/90 mt-0.5 font-mono">
              Taxable: ₹{taxableAmount.toFixed(2)} + GST: ₹{(cgst + sgst).toFixed(2)}
            </p>
            {redeemPoints > 0 && (
              <p className="text-xs text-emerald-300 mt-0.5">₹{redeemPoints} discount from loyalty points applied</p>
            )}
          </div>

          {/* Loyalty points widget if customer exists */}
          {customer && customer.loyaltyPoints > 0 && (
            <div className="rounded-md bg-blue-950/60 p-2.5 text-right border border-blue-800">
              <div className="flex items-center gap-1 justify-end text-xs text-amber-300 font-semibold">
                <Sparkles className="h-3 w-3" />
                <span>{customer.loyaltyPoints} Points Available</span>
              </div>
              {maxRedeemable > 0 && (
                <button
                  onClick={() => setRedeemPoints(redeemPoints > 0 ? 0 : maxRedeemable)}
                  className="mt-1 text-[11px] font-bold text-white underline hover:text-amber-200"
                >
                  {redeemPoints > 0 ? 'Remove Redemption' : `Redeem ₹${maxRedeemable} Off`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveMethod('cash')}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              activeMethod === 'cash' ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Banknote className="h-4 w-4" />
            <span>Cash</span>
          </button>

          <button
            onClick={() => setActiveMethod('upi')}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              activeMethod === 'upi' ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>UPI QR</span>
          </button>

          <button
            onClick={() => setActiveMethod('card')}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              activeMethod === 'card' ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Card</span>
          </button>

          <button
            onClick={() => setActiveMethod('credit')}
            disabled={!customer}
            title={!customer ? 'Select or add a customer to allow Khata credit sale' : undefined}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              !customer ? 'opacity-40 cursor-not-allowed text-slate-400' :
              activeMethod === 'credit' ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Khata Credit</span>
          </button>

          <button
            onClick={() => setActiveMethod('split')}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              activeMethod === 'split' ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="text-sm font-bold">½</span>
            <span>Split Pay</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Cash Received from Customer (₹)</label>
                <input
                  type="number"
                  value={cashTendered || ''}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-slate-300 py-2.5 px-3 text-lg font-bold text-slate-900 focus:border-blue-900 focus:outline-hidden"
                  placeholder="Enter cash given by customer"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex gap-2">
                {[finalPayable, 500, 1000, 2000].map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashTendered(amt)}
                    className="flex-1 rounded border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    {idx === 0 ? 'Exact' : `₹${amt}`}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-600">Change to return customer:</span>
                  <span className={`text-xl font-black ${changeDue > 0 ? 'text-blue-900' : 'text-slate-700'}`}>
                    {formatINR(changeDue)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeMethod === 'upi' && (
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-white rounded-lg border-2 border-slate-300 shadow-xs">
                {/* SVG QR Code Simulation */}
                <div className="h-36 w-36 bg-slate-900 p-2 flex flex-col items-center justify-center rounded">
                  <div className="w-full h-full bg-white p-2 flex flex-col items-center justify-center">
                    <QrCode className="h-24 w-24 text-slate-900" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Scan to Pay via PhonePe, GPay, Paytm</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{settings.upiId}</p>
                <p className="text-sm font-black text-blue-900 mt-1">{formatINR(finalPayable)}</p>
              </div>

              <div className="w-full text-left pt-2">
                <label className="text-xs font-medium text-slate-700">UPI Ref / UTR No (Optional)</label>
                <input
                  type="text"
                  value={upiRef}
                  onChange={(e) => setUpiRef(e.target.value)}
                  placeholder="e.g. 989601278912"
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs"
                />
              </div>
            </div>
          )}

          {activeMethod === 'card' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Swipe or tap credit/debit card on EDC POS machine for <span className="font-bold text-slate-900">{formatINR(finalPayable)}</span>.
              </p>
              <div>
                <label className="text-xs font-medium text-slate-700">Card Approval Code / Transaction Ref</label>
                <input
                  type="text"
                  value={cardRef}
                  onChange={(e) => setCardRef(e.target.value)}
                  placeholder="e.g. TXN-8849"
                  className="mt-1 w-full rounded border border-slate-300 py-2 px-3 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {activeMethod === 'credit' && (
            <div className="space-y-3">
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <p className="font-bold">Customer Khata (Udhaar) Sale</p>
                <p className="mt-1">
                  This ₹{finalPayable} will be debited to {customer?.name}&apos;s ledger.
                </p>
                <p className="mt-1 font-semibold">
                  Current Outstanding: ₹{customer?.outstandingBalance || 0} → New Balance: ₹{(customer?.outstandingBalance || 0) + finalPayable}
                </p>
              </div>
            </div>
          )}

          {activeMethod === 'split' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Cash Portion (₹)</label>
                  <input
                    type="number"
                    value={splitCash}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSplitCash(v);
                      setSplitUpi(Math.max(0, finalPayable - v));
                    }}
                    className="mt-1 w-full rounded border border-slate-300 py-2 px-3 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">UPI / Card Portion (₹)</label>
                  <input
                    type="number"
                    value={splitUpi}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSplitUpi(v);
                      setSplitCash(Math.max(0, finalPayable - v));
                    }}
                    className="mt-1 w-full rounded border border-slate-300 py-2 px-3 text-sm font-bold"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Total: ₹{splitCash + splitUpi} / Payable: ₹{finalPayable}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex justify-between items-center">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Back to Cart
          </button>

          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 rounded-md bg-blue-900 px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Complete Sale &amp; Print Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
