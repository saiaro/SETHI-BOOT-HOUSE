import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Package,
  Layers,
  Users,
  Truck,
  FileSpreadsheet,
  Wallet,
  BookOpen,
  Calculator,
  UserCheck,
  Gift,
  BarChart3,
  Bell,
  Settings,
  Globe,
  ChevronRight,
  Store,
  X
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { t } = useTranslation();
  const { checkPermission, currentUser } = useAuth();
  const { activeModule, setActiveModule, kpis } = useStore();

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, badge: null, permission: true },
    { id: 'pos', label: t.posBilling, icon: Receipt, badge: 'POS', permission: checkPermission('canAccessPos') },
    { id: 'sales', label: t.sales, icon: ShoppingCart, badge: null, permission: true },
    { id: 'online_orders', label: t.onlineOrders, icon: Globe, badge: kpis.pendingOnlineOrdersCount > 0 ? kpis.pendingOnlineOrdersCount : null, permission: checkPermission('canAccessOnlineOrders') },
    { id: 'products', label: t.products, icon: Package, badge: null, permission: checkPermission('canAccessProducts') },
    { id: 'inventory', label: t.inventory, icon: Layers, badge: kpis.lowStockCount > 0 ? `${kpis.lowStockCount}` : null, permission: checkPermission('canAccessInventory') },
    { id: 'customers', label: t.customers, icon: Users, badge: null, permission: checkPermission('canAccessCustomers') },
    { id: 'suppliers', label: t.suppliers, icon: Truck, badge: null, permission: checkPermission('canAccessSuppliers') },
    { id: 'purchases', label: t.purchases, icon: FileSpreadsheet, badge: null, permission: checkPermission('canAccessPurchases') },
    { id: 'expenses', label: t.expenses, icon: Wallet, badge: null, permission: checkPermission('canAccessAccounting') },
    { id: 'accounts', label: t.accounts, icon: BookOpen, badge: null, permission: checkPermission('canAccessAccounting') },
    { id: 'gst', label: t.gstTax, icon: Calculator, badge: null, permission: checkPermission('canAccessGst') },
    { id: 'employees', label: t.employees, icon: UserCheck, badge: null, permission: checkPermission('canAccessEmployees') },
    { id: 'marketing', label: t.marketingLoyalty, icon: Gift, badge: null, permission: true },
    { id: 'reports', label: t.reports, icon: BarChart3, badge: null, permission: checkPermission('canAccessReports') },
    { id: 'notifications', label: t.notifications, icon: Bell, badge: null, permission: true },
    { id: 'settings', label: t.settings, icon: Settings, badge: null, permission: checkPermission('canAccessSettings') },
  ];

  const handleSelectModule = (id: string) => {
    setActiveModule(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavList = (isMobileView = false) => (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 scrollbar-thin">
      {navItems.map((item) => {
        if (!item.permission) return null;
        const Icon = item.icon;
        const isActive = activeModule === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleSelectModule(item.id)}
            title={collapsed && !isMobileView ? item.label : undefined}
            className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-all min-h-[44px] ${
              isActive
                ? 'bg-blue-900 text-white shadow-xs font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
              }`}
            />

            {(!collapsed || isMobileView) && (
              <div className="flex flex-1 items-center justify-between truncate text-left">
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : item.badge === 'POS'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on md: and larger) */}
      <aside
        className={`hidden md:flex relative flex-col border-r border-slate-200 bg-white transition-all duration-200 z-20 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white font-black text-base shadow-xs">
              SBH
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 truncate">
                  SETHI BOOT HOUSE
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate">
                  Ratia, Haryana • Footwear ERP
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        {renderNavList(false)}

        {/* Sidebar Collapse Toggle Footer */}
        <div className="border-t border-slate-200 p-2">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-md p-2 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 min-h-[44px]"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>

      {/* 2. MOBILE SLIDE-OVER DRAWER (Visible on mobile when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-4/5 max-w-xs bg-white shadow-2xl z-50 h-full">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-slate-50">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white font-black text-sm shadow-xs">
                  SBH
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-extrabold tracking-tight text-slate-900 truncate">
                    SETHI BOOT HOUSE
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 truncate">
                    Owner: Jonny Sethi • Ratia
                  </span>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Items */}
            {renderNavList(true)}

            {/* Footer with Role */}
            <div className="border-t border-slate-200 p-3 bg-slate-50 text-xs text-slate-500">
              <p className="font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-[10px] uppercase font-mono">{currentUser.role} • Ratia Footwear Retail</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
