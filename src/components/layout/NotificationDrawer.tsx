import React from 'react';
import { X, CheckCheck, AlertTriangle, ShoppingCart, Cake, Info } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveModule } = useStore();
  const { t, formatDateIndia } = useTranslation();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'stock_alert':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'online_order':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'birthday':
        return <Cake className="h-4 w-4 text-pink-600" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{t.notifications}</h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-900">
              {notifications.filter(n => !n.read).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-slate-500 hover:text-blue-900 flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all</span>
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No new alerts or notifications.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.type === 'stock_alert') setActiveModule('inventory');
                  if (notif.type === 'online_order') setActiveModule('online_orders');
                  onClose();
                }}
                className={`cursor-pointer rounded-md p-3 transition-colors ${
                  notif.read ? 'bg-white opacity-70 hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formatDateIndia(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
