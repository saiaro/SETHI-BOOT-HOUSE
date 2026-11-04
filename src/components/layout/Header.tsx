import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  UserCircle, 
  ShoppingBag, 
  ReceiptText, 
  Store, 
  Check, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types/database';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenQuickSale: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenQuickSale }) => {
  const { language, setLanguage, t } = useTranslation();
  const { currentUser, switchUser, users } = useAuth();
  const { notifications, globalSearch, setGlobalSearch, setIsStorefrontOpen, settings } = useStore();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-xs">
      {/* Left: Global Search & Location */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Customer Storefront Live Button */}
        <button
          onClick={() => setIsStorefrontOpen(true)}
          className="hidden sm:flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
          title="Open shared inventory customer e-commerce store"
        >
          <Store className="h-3.5 w-3.5 text-emerald-600" />
          <span>Online Store</span>
          <ExternalLink className="h-3 w-3 opacity-60" />
        </button>

        {/* Quick New Sale button */}
        <button
          onClick={onOpenQuickSale}
          className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-800 transition-colors"
        >
          <ReceiptText className="h-3.5 w-3.5" />
          <span>{t.quickSale}</span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
          <button
            onClick={() => setLanguage('en')}
            className={`rounded px-2 py-1 transition-all ${
              language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`rounded px-2 py-1 transition-all ${
              language === 'hi' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title={t.notifications}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-left text-xs hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <p className="font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-md border border-slate-200 bg-white py-1 shadow-lg z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-700">{t.activeUser}</p>
                <p className="text-sm font-bold text-blue-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>

              <div className="p-2">
                <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.switchRole}
                </p>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-left transition-colors ${
                      u.id === currentUser.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p>{u.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{u.role}</p>
                    </div>
                    {u.id === currentUser.id && <Check className="h-3.5 w-3.5 text-blue-900" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
