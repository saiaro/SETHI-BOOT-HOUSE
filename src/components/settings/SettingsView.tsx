import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Receipt,
  Download,
  Upload,
  Database,
  Check,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Phone,
  Layers
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { BusinessSettings } from '../../types/database';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, exportDatabaseJson, restoreDatabaseJson, resetToFactoryDemo } = useStore();
  const { t } = useTranslation();

  const [form, setForm] = useState<BusinessSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sethi_Boot_House_ERP_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = restoreDatabaseJson(content);
      if (res.success) {
        setRestoreStatus('Database restored successfully from backup file!');
        setTimeout(() => setRestoreStatus(null), 5000);
      } else {
        setRestoreStatus(`Restore error: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.settings}</h1>
        <p className="text-xs text-slate-500">
          Store Details, Billing Templates, Thermal Printer Sizing &amp; Automated Database Backups
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {restoreStatus && (
        <div className="p-3 bg-blue-50 border border-blue-300 text-blue-900 text-xs font-bold rounded flex items-center gap-2">
          <Check className="h-4 w-4 text-blue-600" />
          <span>{restoreStatus}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="h-5 w-5 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">Retail Business Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700">Business Trade Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Tagline / Sub-header</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Store Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700">Official Mobile / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">GSTIN Number</label>
              <input
                type="text"
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono uppercase font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Bank UPI ID for Customer QR</label>
              <input
                type="text"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Billing & Printer Format */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Receipt className="h-5 w-5 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">Billing &amp; Thermal Printer Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700">Invoice Number Prefix</label>
              <input
                type="text"
                value={form.invoicePrefix}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Default Bill Print Layout</label>
              <select
                value={form.printFormat}
                onChange={(e) => setForm({ ...form, printFormat: e.target.value as any })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white font-medium"
              >
                <option value="thermal_80mm">80mm POS Thermal Receipt (ESC/POS)</option>
                <option value="thermal_58mm">58mm Small Thermal Receipt</option>
                <option value="a4">A4 Full Sheet GST Tax Invoice</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700">Negative Stock Policy</label>
              <select
                value={form.negativeStockAllowed ? 'allowed' : 'blocked'}
                onChange={(e) => setForm({ ...form, negativeStockAllowed: e.target.value === 'allowed' })}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-2 bg-white font-medium"
              >
                <option value="blocked">Block Billing When Stock = 0 (Strict)</option>
                <option value="allowed">Allow Negative Stock (Owner Override)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="rounded bg-blue-900 px-5 py-2 text-xs font-bold text-white hover:bg-blue-800"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>

      {/* Backup and Data Management */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="h-5 w-5 text-indigo-700" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Database Backup &amp; Restoration</h3>
            <p className="text-[11px] text-slate-500">
              Download complete store snapshot (products, invoices, ledgers, stock) as secure JSON
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Export JSON */}
          <div className="rounded border border-slate-200 bg-slate-50 p-4 space-y-2">
            <span className="font-bold text-slate-800 block">Download Full Store Backup:</span>
            <p className="text-slate-600 text-[11px]">
              Saves all Sethi Boot House inventory, bills, customer khatas, and suppliers to an offline JSON file.
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 rounded bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t.backupDatabase}</span>
            </button>
          </div>

          {/* Restore JSON */}
          <div className="rounded border border-slate-200 bg-slate-50 p-4 space-y-2">
            <span className="font-bold text-slate-800 block">Restore from Backup File:</span>
            <p className="text-slate-600 text-[11px]">
              Upload a previously exported Sethi Boot House JSON file to restore all store records.
            </p>
            <label className="flex items-center gap-1.5 rounded border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer w-fit">
              <Upload className="h-3.5 w-3.5" />
              <span>Select Backup JSON File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Factory Reset demo */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-slate-700">Reset Demo Data to Initial Factory State</span>
            <p className="text-[11px] text-slate-400">Re-loads fresh Campus, Sparx, Bata footwear catalogs</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset to initial factory state?')) {
                resetToFactoryDemo();
              }
            }}
            className="rounded border border-rose-200 bg-rose-50 px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-100"
          >
            Reset Factory Data
          </button>
        </div>
      </div>
    </div>
  );
};
