import React, { useState } from 'react';
import { X, UserPlus, Phone, MapPin, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types/database';

interface QuickCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
}

export const QuickCustomerModal: React.FC<QuickCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated
}) => {
  const { saveCustomer } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Ratia');
  const [customerType, setCustomerType] = useState<Customer['customerType']>('Regular');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const created = saveCustomer({
      name,
      phone,
      whatsapp: phone,
      address,
      city,
      state: 'Haryana',
      customerType,
      preferredBrands: [],
      preferredSizes: []
    });

    onCustomerCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">Add New Customer</h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Balwinder Singh"
              className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Mobile / WhatsApp Number *</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9896012345"
                className="w-full rounded border border-slate-300 py-1.5 pl-10 pr-3 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Area / Colony / Village</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Bus Stand, Tohana Road"
              className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">City / Town</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Customer Category</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as any)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 text-xs bg-white"
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 rounded bg-blue-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-800"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Save &amp; Select</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
