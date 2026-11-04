import React from 'react';
import { UserCheck, Shield, Key, Check, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';

export const EmployeesView: React.FC = () => {
  const { users, currentUser, switchUser } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.employees}</h1>
        <p className="text-xs text-slate-500">
          Staff Access Roles, Permissions &amp; Store Multi-User Management (Ratia Branch)
        </p>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map(u => (
          <div
            key={u.id}
            className={`rounded-lg border p-4 bg-white shadow-xs transition-all ${
              u.id === currentUser.id ? 'border-blue-900 ring-1 ring-blue-900' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white font-bold text-sm">
                {u.avatar || u.name.slice(0, 2).toUpperCase()}
              </div>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                u.role === 'owner' ? 'bg-purple-100 text-purple-900' :
                u.role === 'accountant' ? 'bg-blue-100 text-blue-900' :
                'bg-emerald-100 text-emerald-900'
              }`}>
                {u.role}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-bold text-slate-900">{u.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{u.phone}</p>
              <p className="text-xs text-slate-500">{u.email}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Status: Active</span>
              {u.id !== currentUser.id ? (
                <button
                  onClick={() => switchUser(u.id)}
                  className="rounded border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Switch To This Profile
                </button>
              ) : (
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Current User
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Key className="h-4 w-4 text-blue-900" />
          <h3 className="text-xs font-bold text-slate-900 uppercase">
            Role Permission Matrix (Owner vs Accountant vs Cashier)
          </h3>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 font-bold text-slate-700 border-b">
            <tr>
              <th className="py-2 px-3">Module / Action</th>
              <th className="py-2 px-3 text-center">Owner (Jonny Sethi)</th>
              <th className="py-2 px-3 text-center">Accountant (Ramesh)</th>
              <th className="py-2 px-3 text-center">Cashier (Gurpreet)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { label: 'POS Billing & Checkout', owner: true, acc: true, cashier: true },
              { label: 'Footwear Catalog & Variant Creation', owner: true, acc: false, cashier: false },
              { label: 'Inventory Movements & Physical Stock Audit', owner: true, acc: false, cashier: false },
              { label: 'Negative Stock Override Authorization', owner: true, acc: false, cashier: false },
              { label: 'Supplier Purchases & GRN Lot Inward', owner: true, acc: true, cashier: false },
              { label: 'Store Expense Vouchers', owner: true, acc: true, cashier: false },
              { label: 'Financial Profit & Loss / Balance Sheet', owner: true, acc: true, cashier: false },
              { label: 'GST Tax Compliance Reports', owner: true, acc: true, cashier: false },
              { label: 'Customer Khata Credit Recovery', owner: true, acc: true, cashier: true },
              { label: 'Database Backup & System Configuration', owner: true, acc: false, cashier: false }
            ].map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-medium text-slate-800">{p.label}</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">✓ Full Access</span>
                </td>
                <td className="py-2 px-3 text-center">
                  {p.acc ? <span className="text-emerald-700 font-bold">✓ Allowed</span> : <span className="text-slate-300">✕ Restricted</span>}
                </td>
                <td className="py-2 px-3 text-center">
                  {p.cashier ? <span className="text-emerald-700 font-bold">✓ Allowed</span> : <span className="text-slate-300">✕ Restricted</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
