import React, { useState } from 'react';
import {
  Globe,
  Package,
  Truck,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Clock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { OnlineOrder } from '../../types/database';

export const OnlineOrdersView: React.FC = () => {
  const { onlineOrders, updateOrderStatus, setIsStorefrontOpen } = useStore();
  const { t, formatINR, formatDateIndia } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);
  const [courierName, setCourierName] = useState('Delhivery Surface');
  const [trackingNumber, setTrackingNumber] = useState('');

  const filteredOrders = onlineOrders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.city.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.onlineOrders}</h1>
          <p className="text-xs text-slate-500">
            E-Commerce Order Fulfillment Pipeline • Centralized Multi-channel Stock Lock
          </p>
        </div>

        <button
          onClick={() => setIsStorefrontOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-600"
        >
          <Globe className="h-4 w-4" />
          <span>Open Live Customer Storefront</span>
        </button>
      </div>

      {/* Orders Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {['new', 'confirmed', 'packed', 'shipped', 'delivered'].map((st) => {
          const count = onlineOrders.filter(o => o.status === st).length;
          return (
            <div key={st} className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
              <span className="font-semibold text-slate-500 uppercase text-[10px]">{st} Orders</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order number, customer, city, phone..."
              className="w-full rounded border border-slate-300 py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded border border-slate-300 py-1.5 px-2 text-xs bg-white"
            >
              <option value="all">All Pipeline Stages</option>
              <option value="new">New (Needs Confirmation)</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">Order #</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Customer &amp; City</th>
              <th className="py-2.5 px-3">Items Ordered</th>
              <th className="py-2.5 px-3">Tender</th>
              <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Fulfillment Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 font-mono">
                <td className="py-2.5 px-3 font-bold text-blue-900">{order.orderNumber}</td>
                <td className="py-2.5 px-3 text-slate-500">{formatDateIndia(order.createdAt)}</td>
                <td className="py-2.5 px-3 font-sans">
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                  <p className="text-[11px] text-slate-500">{order.city}, {order.phone}</p>
                </td>
                <td className="py-2.5 px-3 font-sans">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="text-slate-700 font-medium truncate max-w-xs">
                      {i.productName} (Size: <span className="font-bold text-blue-900">{i.size}</span>) x{i.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-2.5 px-3 font-sans uppercase font-semibold text-slate-600">
                  {order.paymentMethod} ({order.paymentStatus})
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900 text-sm">
                  {formatINR(order.totalAmount)}
                </td>
                <td className="py-2.5 px-3 text-center font-sans">
                  <span className={`inline-block rounded px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    order.status === 'new' ? 'bg-amber-100 text-amber-900' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-900' :
                    order.status === 'packed' ? 'bg-purple-100 text-purple-900' :
                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-900' :
                    'bg-emerald-100 text-emerald-900'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-sans">
                  {order.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="rounded bg-blue-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-800"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'packed')}
                      className="rounded bg-purple-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-purple-800"
                    >
                      Pack in Box
                    </button>
                  )}
                  {order.status === 'packed' && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setTrackingNumber(`DLV-${Math.floor(100000 + Math.random() * 900000)}`);
                      }}
                      className="rounded bg-indigo-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-800"
                    >
                      Dispatch &amp; Ship
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-600"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Dispatch Order #{selectedOrder.orderNumber}
            </h3>

            <div>
              <label className="font-bold text-slate-700">Courier Partner</label>
              <input
                type="text"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Tracking / Docket Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono font-bold"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'shipped', courierName, trackingNumber);
                  setSelectedOrder(null);
                }}
                className="rounded bg-blue-900 px-4 py-1.5 font-bold text-white hover:bg-blue-800"
              >
                Mark as Shipped
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
