import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { StorefrontView } from './components/storefront/StorefrontView';
import { Store, LayoutDashboard } from 'lucide-react';

// Modules
import { DashboardView } from './components/dashboard/DashboardView';
import { PosView } from './components/pos/PosView';
import { ProductsView } from './components/products/ProductsView';
import { InventoryView } from './components/inventory/InventoryView';
import { SalesView } from './components/sales/SalesView';
import { CustomersView } from './components/customers/CustomersView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { AccountingView } from './components/accounting/AccountingView';
import { GstView } from './components/gst/GstView';
import { OnlineOrdersView } from './components/online/OnlineOrdersView';
import { EmployeesView } from './components/employees/EmployeesView';
import { MarketingView } from './components/marketing/MarketingView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const { activeModule, setActiveModule, isStorefrontOpen, setIsStorefrontOpen } = useStore();
  
  // High-level view mode: Customer Online Storefront vs Store ERP & POS Management
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync if isStorefrontOpen from StoreContext is activated
  useEffect(() => {
    if (isStorefrontOpen) {
      setViewMode('storefront');
      setIsStorefrontOpen(false);
    }
  }, [isStorefrontOpen, setIsStorefrontOpen]);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'pos':
        return <PosView />;
      case 'sales':
        return <SalesView />;
      case 'online_orders':
        return <OnlineOrdersView />;
      case 'products':
        return <ProductsView />;
      case 'inventory':
        return <InventoryView />;
      case 'customers':
        return <CustomersView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'purchases':
        return <PurchasesView />;
      case 'expenses':
      case 'accounts':
        return <AccountingView />;
      case 'gst':
        return <GstView />;
      case 'employees':
        return <EmployeesView />;
      case 'marketing':
        return <MarketingView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <>
      {viewMode === 'storefront' ? (
        /* =========================================================================
           1. Customer-Facing Premium Footwear E-Commerce Storefront
           (Built to Master Development Prompt specifications)
           ========================================================================= */
        <div className="relative">
          <StorefrontView onSwitchToAdmin={() => setViewMode('admin')} />

          {/* Floating Pill Switcher for Client Demo / Staff Access */}
          <div className="fixed bottom-4 left-4 z-50">
            <button
              onClick={() => setViewMode('admin')}
              className="flex items-center gap-2 bg-[#102F4D] hover:bg-[#183E5D] text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-2xl border border-white/20 transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
              title="Switch to Sethi Boot House ERP & POS Management Console"
            >
              <LayoutDashboard className="h-4 w-4 text-[#C91920]" />
              <span>Switch to ERP & Billing</span>
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           2. Retail ERP & POS Business Management Platform
           ========================================================================= */
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased relative">
          
          {/* Floating Pill Switcher to Return to Customer Online Storefront */}
          <div className="fixed bottom-4 left-4 z-50">
            <button
              onClick={() => setViewMode('storefront')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-2xl border border-white/20 transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
              title="Open Sethi Boot House Customer-Facing E-Commerce Website"
            >
              <Store className="h-4 w-4 text-emerald-200" />
              <span>View Online Store</span>
            </button>
          </div>

          {/* 17-Module Sidebar Navigation */}
          <Sidebar
            collapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Main ERP Container */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
            <Header
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenQuickSale={() => setActiveModule('pos')}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            />

            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
              {renderActiveModule()}
            </main>

            <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />
          </div>

          <NotificationDrawer
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
