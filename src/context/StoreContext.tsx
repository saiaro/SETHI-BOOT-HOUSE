import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db } from '../db/storageEngine';
import {
  Product,
  Customer,
  Supplier,
  Invoice,
  Expense,
  OnlineOrder,
  BusinessSettings,
  InventoryMovement,
  CustomerLedgerEntry,
  SupplierLedgerEntry,
  AppNotification,
  SaleItem,
  PaymentBreakdown
} from '../types/database';

export interface HeldCart {
  id: string;
  name: string;
  createdAt: string;
  items: SaleItem[];
  customer?: Customer;
}

interface StoreContextType {
  // Live Data
  settings: BusinessSettings;
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  invoices: Invoice[];
  expenses: Expense[];
  onlineOrders: OnlineOrder[];
  movements: InventoryMovement[];
  customerLedger: CustomerLedgerEntry[];
  supplierLedger: SupplierLedgerEntry[];
  notifications: AppNotification[];

  // POS Held Carts
  heldCarts: HeldCart[];
  holdCurrentCart: (name: string, items: SaleItem[], customer?: Customer) => void;
  removeHeldCart: (cartId: string) => HeldCart | undefined;

  // Actions
  saveProduct: (product: any) => Product;
  archiveProduct: (id: string) => void;
  bulkImportProducts: (products: Product[]) => void;
  saveCustomer: (customer: any) => Customer;
  saveSupplier: (supplier: any) => Supplier;
  completeSale: (saleData: any) => { success: boolean; invoice?: Invoice; error?: string };
  processReturnOrExchange: (params: any) => { success: boolean; error?: string };
  adjustStock: (params: any) => { success: boolean; error?: string };
  receiveGoodsInward: (params: any) => { success: boolean; error?: string };
  recordSupplierPayment: (params: any) => { success: boolean; error?: string };
  recordCustomerPayment: (params: any) => { success: boolean; error?: string };
  recordExpense: (expense: any) => Expense;
  placeOnlineOrder: (order: any) => { success: boolean; order?: OnlineOrder; error?: string };
  updateOrderStatus: (orderId: string, status: OnlineOrder['status'], courierName?: string, trackingNumber?: string) => void;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  exportDatabaseJson: () => string;
  restoreDatabaseJson: (json: string) => { success: boolean; error?: string };
  resetToFactoryDemo: () => void;

  // UI State
  activeModule: string;
  setActiveModule: (module: string) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  isStorefrontOpen: boolean;
  setIsStorefrontOpen: (open: boolean) => void;

  // Live Calculated Metrics
  kpis: {
    todaySales: number;
    todayInvoicesCount: number;
    todayProfit: number;
    totalInventoryUnits: number;
    inventoryCostValue: number;
    inventorySellingValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    customerReceivables: number;
    supplierPayables: number;
    pendingOnlineOrdersCount: number;
    todayExpenses: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = useState(0);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isStorefrontOpen, setIsStorefrontOpen] = useState<boolean>(false);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>(() => {
    try {
      const saved = localStorage.getItem('sbh_held_carts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  const settings = useMemo(() => db.getSettings(), [version]);
  const products = useMemo(() => db.getProducts(), [version]);
  const customers = useMemo(() => db.getCustomers(), [version]);
  const suppliers = useMemo(() => db.getSuppliers(), [version]);
  const invoices = useMemo(() => db.getInvoices(), [version]);
  const expenses = useMemo(() => db.getExpenses(), [version]);
  const onlineOrders = useMemo(() => db.getOnlineOrders(), [version]);
  const movements = useMemo(() => db.getMovements(), [version]);
  const customerLedger = useMemo(() => db.getCustomerLedger(), [version]);
  const supplierLedger = useMemo(() => db.getSupplierLedger(), [version]);
  const notifications = useMemo(() => db.getNotifications(), [version]);

  // POS Held Carts
  const holdCurrentCart = (name: string, items: SaleItem[], customer?: Customer) => {
    const newHeld: HeldCart = {
      id: `held-${Date.now()}`,
      name: name || `Cart #${heldCarts.length + 1}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items,
      customer
    };
    const updated = [newHeld, ...heldCarts];
    setHeldCarts(updated);
    localStorage.setItem('sbh_held_carts', JSON.stringify(updated));
  };

  const removeHeldCart = (cartId: string): HeldCart | undefined => {
    const target = heldCarts.find(c => c.id === cartId);
    const updated = heldCarts.filter(c => c.id !== cartId);
    setHeldCarts(updated);
    localStorage.setItem('sbh_held_carts', JSON.stringify(updated));
    return target;
  };

  // KPIs
  const kpis = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayInvoices = invoices.filter(inv => inv.date.startsWith(todayStr) && inv.status !== 'cancelled');
    const todaySales = todayInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
    const todayInvoicesCount = todayInvoices.length;

    // Gross profit = sum of (rate - purchaseCost) * quantity for today's sold items
    let todayProfit = 0;
    todayInvoices.forEach(inv => {
      inv.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const variant = prod?.variants.find(v => v.id === item.variantId);
        const cost = variant ? variant.purchaseCost : item.rate * 0.7;
        todayProfit += (item.rate - cost) * item.quantity;
      });
    });

    let totalInventoryUnits = 0;
    let inventoryCostValue = 0;
    let inventorySellingValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      p.variants.forEach(v => {
        totalInventoryUnits += v.stockQuantity;
        inventoryCostValue += v.stockQuantity * v.purchaseCost;
        inventorySellingValue += v.stockQuantity * v.sellingPrice;
        if (v.stockQuantity === 0) {
          outOfStockCount++;
        } else if (v.stockQuantity <= v.reorderLevel) {
          lowStockCount++;
        }
      });
    });

    const customerReceivables = customers.reduce((acc, c) => acc + (c.outstandingBalance || 0), 0);
    const supplierPayables = suppliers.reduce((acc, s) => acc + (s.outstandingBalance || 0), 0);
    const pendingOnlineOrdersCount = onlineOrders.filter(o => o.status === 'new' || o.status === 'confirmed').length;

    const todayExpenses = expenses
      .filter(e => e.date.startsWith(todayStr))
      .reduce((acc, e) => acc + e.amount, 0);

    return {
      todaySales,
      todayInvoicesCount,
      todayProfit,
      totalInventoryUnits,
      inventoryCostValue,
      inventorySellingValue,
      lowStockCount,
      outOfStockCount,
      customerReceivables,
      supplierPayables,
      pendingOnlineOrdersCount,
      todayExpenses
    };
  }, [invoices, products, customers, suppliers, onlineOrders, expenses]);

  return (
    <StoreContext.Provider
      value={{
        settings,
        products,
        customers,
        suppliers,
        invoices,
        expenses,
        onlineOrders,
        movements,
        customerLedger,
        supplierLedger,
        notifications,
        heldCarts,
        holdCurrentCart,
        removeHeldCart,
        saveProduct: (p) => db.saveProduct(p),
        archiveProduct: (id) => db.archiveProduct(id),
        bulkImportProducts: (prods) => db.bulkImportProducts(prods),
        saveCustomer: (c) => db.saveCustomer(c),
        saveSupplier: (s) => db.saveSupplier(s),
        completeSale: (s) => db.completeSale(s),
        processReturnOrExchange: (p) => db.processSalesReturnOrExchange(p),
        adjustStock: (p) => db.adjustStock(p),
        receiveGoodsInward: (p) => db.receiveGoodsInward(p),
        recordSupplierPayment: (p) => db.recordSupplierPayment(p),
        recordCustomerPayment: (p) => db.recordCustomerPayment(p),
        recordExpense: (e) => db.recordExpense(e),
        placeOnlineOrder: (o) => db.placeOnlineOrder(o),
        updateOrderStatus: (id, st, cr, tr) => db.updateOrderStatus(id, st, cr, tr),
        updateSettings: (ns) => db.updateSettings(ns),
        markNotificationAsRead: (id) => db.markNotificationAsRead(id),
        markAllNotificationsAsRead: () => db.markAllNotificationsAsRead(),
        exportDatabaseJson: () => db.exportFullDatabaseJson(),
        restoreDatabaseJson: (json) => db.restoreFromDatabaseJson(json),
        resetToFactoryDemo: () => db.resetToFactoryDemo(),
        activeModule,
        setActiveModule,
        globalSearch,
        setGlobalSearch,
        isStorefrontOpen,
        setIsStorefrontOpen,
        kpis
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
