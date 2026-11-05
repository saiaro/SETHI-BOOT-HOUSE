import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { StorefrontPreviewModal } from './components/online/StorefrontPreviewModal';

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
  const { activeModule, setActiveModule } = useStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased">
      {/* 17-Module Sidebar Navigation (Desktop Sidebar & Mobile Drawer) */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Header
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenQuickSale={() => setActiveModule('pos')}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Viewport Content - with pb-16 on mobile so content clears the bottom navigation */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderActiveModule()}
        </main>

        {/* Native Mobile Bottom Navigation Bar (md:hidden) */}
        <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />
      </div>

      {/* Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Customer-Facing Live Storefront with Shared Real-Time Inventory */}
      <StorefrontPreviewModal />
    </div>
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
