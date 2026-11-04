import {
  Product,
  ProductVariant,
  Customer,
  Supplier,
  Invoice,
  SaleItem,
  Expense,
  OnlineOrder,
  BusinessSettings,
  InventoryMovement,
  CustomerLedgerEntry,
  SupplierLedgerEntry,
  AppNotification
} from '../types/database';
import {
  INITIAL_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_ONLINE_ORDERS,
  INITIAL_MOVEMENTS,
  INITIAL_CUSTOMER_LEDGER,
  INITIAL_SUPPLIER_LEDGER
} from './initialData';

const DB_KEYS = {
  SETTINGS: 'sbh_db_settings',
  PRODUCTS: 'sbh_db_products',
  CUSTOMERS: 'sbh_db_customers',
  SUPPLIERS: 'sbh_db_suppliers',
  INVOICES: 'sbh_db_invoices',
  EXPENSES: 'sbh_db_expenses',
  ONLINE_ORDERS: 'sbh_db_online_orders',
  MOVEMENTS: 'sbh_db_movements',
  CUSTOMER_LEDGER: 'sbh_db_customer_ledger',
  SUPPLIER_LEDGER: 'sbh_db_supplier_ledger',
  NOTIFICATIONS: 'sbh_db_notifications'
};

function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load ${key}:`, err);
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
}

export class StorageEngine {
  private static instance: StorageEngine;

  private settings: BusinessSettings;
  private products: Product[];
  private customers: Customer[];
  private suppliers: Supplier[];
  private invoices: Invoice[];
  private expenses: Expense[];
  private onlineOrders: OnlineOrder[];
  private movements: InventoryMovement[];
  private customerLedger: CustomerLedgerEntry[];
  private supplierLedger: SupplierLedgerEntry[];
  private notifications: AppNotification[];

  private listeners: (() => void)[] = [];

  private constructor() {
    this.settings = loadFromStorage(DB_KEYS.SETTINGS, INITIAL_SETTINGS);
    this.products = loadFromStorage(DB_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.customers = loadFromStorage(DB_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    this.suppliers = loadFromStorage(DB_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    this.invoices = loadFromStorage(DB_KEYS.INVOICES, INITIAL_INVOICES);
    this.expenses = loadFromStorage(DB_KEYS.EXPENSES, INITIAL_EXPENSES);
    this.onlineOrders = loadFromStorage(DB_KEYS.ONLINE_ORDERS, INITIAL_ONLINE_ORDERS);
    this.movements = loadFromStorage(DB_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
    this.customerLedger = loadFromStorage(DB_KEYS.CUSTOMER_LEDGER, INITIAL_CUSTOMER_LEDGER);
    this.supplierLedger = loadFromStorage(DB_KEYS.SUPPLIER_LEDGER, INITIAL_SUPPLIER_LEDGER);
    this.notifications = loadFromStorage(DB_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'Low Stock Alert',
        message: 'Sparx SM-734 (Size 9) has only 1 unit remaining in stock.',
        type: 'stock_alert',
        severity: 'warning',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: 'New Online Order',
        message: 'Navjot Singh placed order #ORD-ON-101 for Campus OXYFIT Running Shoes.',
        type: 'online_order',
        severity: 'info',
        read: false,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  public static getInstance(): StorageEngine {
    if (!StorageEngine.instance) {
      StorageEngine.instance = new StorageEngine();
    }
    return StorageEngine.instance;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- Getters ---
  public getSettings(): BusinessSettings {
    return { ...this.settings };
  }

  public getProducts(): Product[] {
    return [...this.products];
  }

  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public getInvoices(): Invoice[] {
    return [...this.invoices];
  }

  public getExpenses(): Expense[] {
    return [...this.expenses];
  }

  public getOnlineOrders(): OnlineOrder[] {
    return [...this.onlineOrders];
  }

  public getMovements(): InventoryMovement[] {
    return [...this.movements];
  }

  public getCustomerLedger(customerId?: string): CustomerLedgerEntry[] {
    if (!customerId) return [...this.customerLedger];
    return this.customerLedger.filter(e => e.customerId === customerId);
  }

  public getSupplierLedger(supplierId?: string): SupplierLedgerEntry[] {
    if (!supplierId) return [...this.supplierLedger];
    return this.supplierLedger.filter(e => e.supplierId === supplierId);
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  // --- Settings Update ---
  public updateSettings(newSettings: Partial<BusinessSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    saveToStorage(DB_KEYS.SETTINGS, this.settings);
    this.notify();
  }

  // --- Product Management ---
  public saveProduct(productData: Omit<Product, 'createdAt' | 'updatedAt'> & { id?: string }): Product {
    const isEdit = !!productData.id && this.products.some(p => p.id === productData.id);
    const now = new Date().toISOString();

    let savedProduct: Product;
    if (isEdit) {
      savedProduct = {
        ...(productData as Product),
        updatedAt: now
      };
      this.products = this.products.map(p => p.id === savedProduct.id ? savedProduct : p);
    } else {
      const id = productData.id || `prod-${Date.now()}`;
      savedProduct = {
        ...productData,
        id,
        createdAt: now,
        updatedAt: now
      };
      this.products.unshift(savedProduct);
    }

    saveToStorage(DB_KEYS.PRODUCTS, this.products);
    this.notify();
    return savedProduct;
  }

  public archiveProduct(productId: string): void {
    this.products = this.products.map(p => {
      if (p.id === productId) {
        return { ...p, status: p.status === 'active' ? 'archived' : 'active', updatedAt: new Date().toISOString() };
      }
      return p;
    });
    saveToStorage(DB_KEYS.PRODUCTS, this.products);
    this.notify();
  }

  public bulkImportProducts(productsToImport: Product[]): void {
    const now = new Date().toISOString();
    productsToImport.forEach(p => {
      p.createdAt = now;
      p.updatedAt = now;
      this.products.unshift(p);
    });
    saveToStorage(DB_KEYS.PRODUCTS, this.products);
    this.notify();
  }

  // --- Customer Management ---
  public saveCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'totalPurchasesCount' | 'totalSpent' | 'outstandingBalance' | 'loyaltyPoints'> & { id?: string }): Customer {
    const now = new Date().toISOString();
    if (customerData.id) {
      const existing = this.customers.find(c => c.id === customerData.id);
      if (existing) {
        const updated: Customer = {
          ...existing,
          ...customerData,
        };
        this.customers = this.customers.map(c => c.id === updated.id ? updated : c);
        saveToStorage(DB_KEYS.CUSTOMERS, this.customers);
        this.notify();
        return updated;
      }
    }

    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      outstandingBalance: 0,
      loyaltyPoints: 0,
      totalPurchasesCount: 0,
      totalSpent: 0,
      createdAt: now
    };
    this.customers.unshift(newCustomer);
    saveToStorage(DB_KEYS.CUSTOMERS, this.customers);
    this.notify();
    return newCustomer;
  }

  // --- Supplier Management ---
  public saveSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchases' | 'outstandingBalance'> & { id?: string }): Supplier {
    const now = new Date().toISOString();
    if (supplierData.id) {
      const existing = this.suppliers.find(s => s.id === supplierData.id);
      if (existing) {
        const updated: Supplier = {
          ...existing,
          ...supplierData
        };
        this.suppliers = this.suppliers.map(s => s.id === updated.id ? updated : s);
        saveToStorage(DB_KEYS.SUPPLIERS, this.suppliers);
        this.notify();
        return updated;
      }
    }

    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      outstandingBalance: supplierData.openingBalance || 0,
      totalPurchases: 0,
      createdAt: now
    };
    this.suppliers.unshift(newSupplier);
    saveToStorage(DB_KEYS.SUPPLIERS, this.suppliers);
    this.notify();
    return newSupplier;
  }

  // --- ATOMIC POS SALE CHECKOUT TRANSACTION ---
  public completeSale(saleData: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    items: SaleItem[];
    subtotal: number;
    discountTotal: number;
    taxableTotal: number;
    cgstTotal: number;
    sgstTotal: number;
    igstTotal: number;
    roundOff: number;
    grandTotal: number;
    payments: { method: 'cash' | 'upi' | 'card' | 'credit' | 'bank_transfer'; amount: number; reference?: string }[];
    cashTendered?: number;
    changeDue?: number;
    channel: 'pos' | 'online' | 'whatsapp' | 'instagram' | 'phone';
    cashierName: string;
    notes?: string;
    redeemedPoints?: number;
  }): { success: boolean; invoice?: Invoice; error?: string } {
    try {
      // 1. Validate Stock for all items (Prevent negative stock unless setting overrides)
      if (!this.settings.negativeStockAllowed) {
        for (const item of saleData.items) {
          const product = this.products.find(p => p.id === item.productId);
          if (!product) return { success: false, error: `Product not found: ${item.productName}` };
          const variant = product.variants.find(v => v.id === item.variantId);
          if (!variant) return { success: false, error: `Variant not found for: ${item.productName}` };
          if (variant.stockQuantity < item.quantity) {
            return {
              success: false,
              error: `Insufficient stock for ${item.productName} (Size: ${item.size}). Available: ${variant.stockQuantity}, Required: ${item.quantity}`
            };
          }
        }
      }

      const now = new Date().toISOString();
      const nextNum = this.settings.invoiceNextNumber;
      const invoiceNumber = `${this.settings.invoicePrefix}${String(nextNum).padStart(4, '0')}`;
      const invoiceId = `inv-${Date.now()}`;

      // 2. Decrement Stock Atomically and create immutable Inventory Movements
      const updatedProducts = [...this.products];
      const newMovements: InventoryMovement[] = [];

      for (const item of saleData.items) {
        const prodIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (prodIndex >= 0) {
          const product = updatedProducts[prodIndex];
          const varIndex = product.variants.findIndex(v => v.id === item.variantId);
          if (varIndex >= 0) {
            const variant = product.variants[varIndex];
            const prevStock = variant.stockQuantity;
            const newStock = prevStock - item.quantity;

            product.variants[varIndex] = {
              ...variant,
              stockQuantity: newStock
            };

            newMovements.push({
              id: `mov-${Date.now()}-${item.variantId}`,
              productId: product.id,
              variantId: variant.id,
              productName: product.name,
              variantDetails: `Size ${variant.size} - ${variant.color}`,
              quantity: -item.quantity,
              previousStock: prevStock,
              newStock: newStock,
              movementType: 'sale',
              referenceId: invoiceNumber,
              reason: `Sold in Invoice ${invoiceNumber}`,
              userName: saleData.cashierName,
              createdAt: now
            });
          }
        }
      }

      this.products = updatedProducts;
      this.movements = [...newMovements, ...this.movements];
      saveToStorage(DB_KEYS.PRODUCTS, this.products);
      saveToStorage(DB_KEYS.MOVEMENTS, this.movements);

      // 3. Create Invoice
      const invoice: Invoice = {
        id: invoiceId,
        invoiceNumber,
        invoiceType: 'gst_tax_invoice',
        status: 'completed',
        date: now,
        customerId: saleData.customerId,
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone,
        customerAddress: saleData.customerAddress,
        items: saleData.items,
        subtotal: saleData.subtotal,
        discountTotal: saleData.discountTotal,
        taxableTotal: saleData.taxableTotal,
        cgstTotal: saleData.cgstTotal,
        sgstTotal: saleData.sgstTotal,
        igstTotal: saleData.igstTotal,
        roundOff: saleData.roundOff,
        grandTotal: saleData.grandTotal,
        payments: saleData.payments,
        cashTendered: saleData.cashTendered,
        changeDue: saleData.changeDue,
        channel: saleData.channel,
        cashierName: saleData.cashierName,
        notes: saleData.notes,
        createdAt: now
      };

      this.invoices.unshift(invoice);
      saveToStorage(DB_KEYS.INVOICES, this.invoices);

      // 4. Update Settings (Increment invoice number)
      this.settings.invoiceNextNumber = nextNum + 1;
      saveToStorage(DB_KEYS.SETTINGS, this.settings);

      // 5. Update Customer Account, Loyalty & Khata Credit if applicable
      const creditPayment = saleData.payments.find(p => p.method === 'credit');
      const creditAmount = creditPayment ? creditPayment.amount : 0;

      if (saleData.customerId) {
        const custIndex = this.customers.findIndex(c => c.id === saleData.customerId);
        if (custIndex >= 0) {
          const cust = this.customers[custIndex];
          const pointsEarned = Math.floor((saleData.grandTotal / 100) * this.settings.loyaltyPointsPer100Rs);
          const pointsRedeemed = saleData.redeemedPoints || 0;
          const newLoyalty = Math.max(0, cust.loyaltyPoints + pointsEarned - pointsRedeemed);
          const newOutstanding = cust.outstandingBalance + creditAmount;

          this.customers[custIndex] = {
            ...cust,
            totalPurchasesCount: cust.totalPurchasesCount + 1,
            totalSpent: cust.totalSpent + saleData.grandTotal,
            loyaltyPoints: newLoyalty,
            outstandingBalance: newOutstanding
          };
          saveToStorage(DB_KEYS.CUSTOMERS, this.customers);

          if (creditAmount > 0) {
            const entry: CustomerLedgerEntry = {
              id: `cled-${Date.now()}`,
              customerId: cust.id,
              date: now.split('T')[0],
              description: `Credit Sale - Invoice ${invoiceNumber}`,
              referenceType: 'sale',
              referenceId: invoiceNumber,
              debit: creditAmount,
              credit: 0,
              balance: newOutstanding
            };
            this.customerLedger.unshift(entry);
            saveToStorage(DB_KEYS.CUSTOMER_LEDGER, this.customerLedger);
          }
        }
      }

      this.notify();
      return { success: true, invoice };
    } catch (err: any) {
      console.error('Sale transaction failed:', err);
      return { success: false, error: err?.message || 'Transaction error' };
    }
  }

  // --- SALES RETURN & FOOTWEAR SIZE EXCHANGE WORKFLOW ---
  public processSalesReturnOrExchange(params: {
    invoiceId: string;
    type: 'return' | 'exchange';
    // Multi-item returns support
    returnedItems?: Array<{
      productId: string;
      variantId: string;
      quantity: number;
      refundAmount: number;
      reason?: string;
      saleItemId?: string;
    }>;
    // Single item backwards compatibility
    returnedItem?: {
      productId: string;
      variantId: string;
      quantity: number;
      refundAmount: number;
      reason: string;
      saleItemId?: string;
    };
    exchangeItem?: {
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
    };
    settlementMethod?: 'khata_credit' | 'cash' | 'upi' | 'store_credit';
    exchangeSettlementMethod?: 'khata_credit' | 'cash' | 'upi';
    reason?: string;
    cashierName: string;
  }): { success: boolean; error?: string } {
    try {
      const invoice = this.invoices.find(i => i.id === params.invoiceId);
      if (!invoice) return { success: false, error: 'Invoice not found' };

      const now = new Date().toISOString();

      // Normalize items to return
      const itemsToReturn = params.returnedItems && params.returnedItems.length > 0
        ? params.returnedItems
        : (params.returnedItem ? [params.returnedItem] : []);

      if (itemsToReturn.length === 0) {
        return { success: false, error: 'No items selected for return or exchange' };
      }

      // 1. Restock each returned footwear into inventory & log stock movements
      for (const retItem of itemsToReturn) {
        const prodIndex = this.products.findIndex(p => p.id === retItem.productId);
        if (prodIndex >= 0) {
          const prod = this.products[prodIndex];
          const varIndex = prod.variants.findIndex(v => v.id === retItem.variantId);
          if (varIndex >= 0) {
            const variant = prod.variants[varIndex];
            const prevStock = variant.stockQuantity;
            const newStock = prevStock + retItem.quantity;
            prod.variants[varIndex].stockQuantity = newStock;

            this.movements.unshift({
              id: `mov-${Date.now()}-${variant.id}-ret`,
              productId: prod.id,
              variantId: variant.id,
              productName: prod.name,
              variantDetails: `Size ${variant.size} - ${variant.color}`,
              quantity: retItem.quantity,
              previousStock: prevStock,
              newStock: newStock,
              movementType: params.type === 'exchange' ? 'exchange_in' : 'sale_return',
              referenceId: invoice.invoiceNumber,
              reason: `${params.type === 'exchange' ? 'Exchange IN' : 'Customer Return'}: ${retItem.reason || params.reason || 'Customer Return'}`,
              userName: params.cashierName,
              createdAt: now
            });
          }
        }

        // Update returned quantity on the invoice item
        const matchedItem = invoice.items.find(i =>
          (retItem.saleItemId && i.id === retItem.saleItemId) ||
          (i.productId === retItem.productId && i.variantId === retItem.variantId)
        );
        if (matchedItem) {
          matchedItem.returnedQuantity = (matchedItem.returnedQuantity || 0) + retItem.quantity;
        }
      }

      // 2. If Exchange, deduct replacement shoe from stock
      if (params.type === 'exchange' && params.exchangeItem) {
        const exProdIndex = this.products.findIndex(p => p.id === params.exchangeItem!.productId);
        if (exProdIndex >= 0) {
          const exProd = this.products[exProdIndex];
          const exVarIndex = exProd.variants.findIndex(v => v.id === params.exchangeItem!.variantId);
          if (exVarIndex >= 0) {
            const exVariant = exProd.variants[exVarIndex];
            if (exVariant.stockQuantity < params.exchangeItem.quantity && !this.settings.negativeStockAllowed) {
              return { success: false, error: `Replacement size out of stock: ${exProd.name} Size ${exVariant.size}` };
            }
            const prevStock = exVariant.stockQuantity;
            const newStock = prevStock - params.exchangeItem.quantity;
            exProd.variants[exVarIndex].stockQuantity = newStock;

            this.movements.unshift({
              id: `mov-${Date.now()}-exout`,
              productId: exProd.id,
              variantId: exVariant.id,
              productName: exProd.name,
              variantDetails: `Size ${exVariant.size} - ${exVariant.color}`,
              quantity: -params.exchangeItem.quantity,
              previousStock: prevStock,
              newStock: newStock,
              movementType: 'exchange_out',
              referenceId: invoice.invoiceNumber,
              reason: `Exchange OUT for invoice ${invoice.invoiceNumber}`,
              userName: params.cashierName,
              createdAt: now
            });
          }
        }
      }

      // 3. Financial calculations & Customer Khata / Balance reconciliation
      const totalRefundAmount = itemsToReturn.reduce((sum, item) => sum + (item.refundAmount * item.quantity), 0);

      // Locate customer (by ID, phone, or name)
      let customer = invoice.customerId ? this.customers.find(c => c.id === invoice.customerId) : undefined;
      if (!customer && invoice.customerPhone) {
        customer = this.customers.find(c => c.phone && c.phone === invoice.customerPhone);
      }
      if (!customer && invoice.customerName && invoice.customerName.toLowerCase() !== 'walk-in customer') {
        customer = this.customers.find(c => c.name.toLowerCase() === invoice.customerName.toLowerCase());
      }

      const isCreditInvoice = invoice.payments.some(p => p.method === 'credit');

      // Default settlement: if customer has outstanding Khata due or invoice had credit, deduct from Khata
      const settlement = params.settlementMethod || (customer && (customer.outstandingBalance > 0 || isCreditInvoice) ? 'khata_credit' : 'cash');

      if (params.type === 'return') {
        if (customer) {
          if (settlement === 'khata_credit') {
            // Deduct from customer's pending bill / Khata balance
            const previousBalance = customer.outstandingBalance;
            const newBalance = Math.max(0, previousBalance - totalRefundAmount);
            customer.outstandingBalance = newBalance;
            customer.totalSpent = Math.max(0, (customer.totalSpent || 0) - totalRefundAmount);

            const itemsSummary = itemsToReturn.map(i => {
              const p = this.products.find(prod => prod.id === i.productId);
              return `${p?.name || 'Footwear'} (${i.quantity} pr)`;
            }).join(', ');

            // Insert Credit Note entry into Customer Khata Ledger
            const ledgerEntry: CustomerLedgerEntry = {
              id: `cled-${Date.now()}-ret`,
              customerId: customer.id,
              date: now.split('T')[0],
              description: `Sales Return (Khata Credit) - Inv #${invoice.invoiceNumber}${itemsSummary ? ` [${itemsSummary}]` : ''}`,
              referenceType: 'return',
              referenceId: invoice.invoiceNumber,
              debit: 0,
              credit: totalRefundAmount,
              balance: newBalance
            };
            this.customerLedger.unshift(ledgerEntry);
            saveToStorage(DB_KEYS.CUSTOMER_LEDGER, this.customerLedger);
            saveToStorage(DB_KEYS.CUSTOMERS, this.customers);
          } else {
            // Cash / UPI refund: adjust customer's total spent
            customer.totalSpent = Math.max(0, (customer.totalSpent || 0) - totalRefundAmount);
            saveToStorage(DB_KEYS.CUSTOMERS, this.customers);
          }
        }
      } else if (params.type === 'exchange') {
        const replacementPrice = params.exchangeItem ? (params.exchangeItem.price * params.exchangeItem.quantity) : 0;
        const priceDifference = replacementPrice - totalRefundAmount;

        if (priceDifference !== 0 && customer) {
          const exSettlement = params.exchangeSettlementMethod || (customer.outstandingBalance > 0 || isCreditInvoice ? 'khata_credit' : 'cash');
          if (exSettlement === 'khata_credit') {
            if (priceDifference < 0) {
              // Replacement is cheaper: credit the difference to customer Khata
              const refundDiff = Math.abs(priceDifference);
              customer.outstandingBalance = Math.max(0, customer.outstandingBalance - refundDiff);
              customer.totalSpent = Math.max(0, (customer.totalSpent || 0) - refundDiff);

              this.customerLedger.unshift({
                id: `cled-${Date.now()}-ex-cr`,
                customerId: customer.id,
                date: now.split('T')[0],
                description: `Exchange Refund (Khata Credit) - Inv #${invoice.invoiceNumber}`,
                referenceType: 'return',
                referenceId: invoice.invoiceNumber,
                debit: 0,
                credit: refundDiff,
                balance: customer.outstandingBalance
              });
            } else if (priceDifference > 0) {
              // Replacement is more expensive: add difference to customer Khata debt
              customer.outstandingBalance = customer.outstandingBalance + priceDifference;
              customer.totalSpent = (customer.totalSpent || 0) + priceDifference;

              this.customerLedger.unshift({
                id: `cled-${Date.now()}-ex-dr`,
                customerId: customer.id,
                date: now.split('T')[0],
                description: `Exchange Extra Due (Khata Debit) - Inv #${invoice.invoiceNumber}`,
                referenceType: 'sale',
                referenceId: invoice.invoiceNumber,
                debit: priceDifference,
                credit: 0,
                balance: customer.outstandingBalance
              });
            }
            saveToStorage(DB_KEYS.CUSTOMERS, this.customers);
            saveToStorage(DB_KEYS.CUSTOMER_LEDGER, this.customerLedger);
          }
        }
      }

      // 4. Update Invoice status & append return note
      const totalOriginalQty = invoice.items.reduce((s, i) => s + i.quantity, 0);
      const totalReturnedQty = invoice.items.reduce((s, i) => s + (i.returnedQuantity || 0), 0);

      if (params.type === 'exchange') {
        invoice.status = 'partially_returned';
      } else if (totalReturnedQty >= totalOriginalQty) {
        invoice.status = 'returned';
      } else {
        invoice.status = 'partially_returned';
      }

      // Add Credit Note / return breakdown in notes and payments
      const settlementLabel = settlement === 'khata_credit' ? 'Khata Pending Due Reduced' : `${settlement.toUpperCase()} Refund`;
      const returnNote = `[${now.split('T')[0]}]: Returned ${itemsToReturn.reduce((s, i) => s + i.quantity, 0)} item(s) (₹${totalRefundAmount}) - Settlement: ${settlementLabel}`;
      invoice.notes = invoice.notes ? `${invoice.notes}\n${returnNote}` : returnNote;

      if (settlement === 'khata_credit') {
        invoice.payments.push({
          method: 'credit',
          amount: -totalRefundAmount,
          reference: `CN-${invoice.invoiceNumber} (Khata Return)`
        });
      }

      saveToStorage(DB_KEYS.PRODUCTS, this.products);
      saveToStorage(DB_KEYS.MOVEMENTS, this.movements);
      saveToStorage(DB_KEYS.INVOICES, this.invoices);
      this.notify();

      return { success: true };
    } catch (err: any) {
      console.error('Exchange/return error:', err);
      return { success: false, error: err?.message || 'Exchange/return error' };
    }
  }

  // --- MANUAL STOCK ADJUSTMENT / AUDIT ---
  public adjustStock(params: {
    productId: string;
    variantId: string;
    quantityChange: number;
    type: 'adjustment' | 'damaged' | 'stock_inward' | 'stock_outward';
    reason: string;
    userName: string;
  }): { success: boolean; error?: string } {
    const prod = this.products.find(p => p.id === params.productId);
    if (!prod) return { success: false, error: 'Product not found' };
    const variant = prod.variants.find(v => v.id === params.variantId);
    if (!variant) return { success: false, error: 'Variant not found' };

    const prevStock = variant.stockQuantity;
    const newStock = prevStock + params.quantityChange;

    if (newStock < 0 && !this.settings.negativeStockAllowed) {
      return { success: false, error: 'Negative stock not allowed without owner override' };
    }

    variant.stockQuantity = newStock;
    const now = new Date().toISOString();

    this.movements.unshift({
      id: `mov-${Date.now()}`,
      productId: prod.id,
      variantId: variant.id,
      productName: prod.name,
      variantDetails: `Size ${variant.size} - ${variant.color}`,
      quantity: params.quantityChange,
      previousStock: prevStock,
      newStock: newStock,
      movementType: params.type === 'damaged' ? 'damaged' : 'adjustment',
      reason: params.reason,
      userName: params.userName,
      createdAt: now
    });

    saveToStorage(DB_KEYS.PRODUCTS, this.products);
    saveToStorage(DB_KEYS.MOVEMENTS, this.movements);
    this.notify();

    return { success: true };
  }

  // --- SUPPLIER PURCHASE & GOODS RECEIPT NOTE (GRN) ---
  public receiveGoodsInward(params: {
    supplierId: string;
    items: {
      productId: string;
      variantId: string;
      quantityReceived: number;
      unitCost: number;
    }[];
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    paymentMethod?: 'cash' | 'bank_transfer' | 'upi';
    userName: string;
  }): { success: boolean; error?: string } {
    const now = new Date().toISOString();
    const supplier = this.suppliers.find(s => s.id === params.supplierId);

    // 1. Inward inventory
    for (const item of params.items) {
      const prod = this.products.find(p => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find(v => v.id === item.variantId);
        if (variant) {
          const prev = variant.stockQuantity;
          variant.stockQuantity = prev + item.quantityReceived;
          variant.purchaseCost = item.unitCost; // update latest purchase cost

          this.movements.unshift({
            id: `mov-${Date.now()}-${variant.id}`,
            productId: prod.id,
            variantId: variant.id,
            productName: prod.name,
            variantDetails: `Size ${variant.size} - ${variant.color}`,
            quantity: item.quantityReceived,
            previousStock: prev,
            newStock: variant.stockQuantity,
            movementType: 'purchase_receipt',
            referenceId: params.invoiceNumber,
            reason: `Purchase Received from ${supplier?.companyName || 'Supplier'} (Inv #${params.invoiceNumber})`,
            userName: params.userName,
            createdAt: now
          });
        }
      }
    }

    // 2. Update Supplier Outstanding Ledger
    if (supplier) {
      const unpaidAmount = params.totalAmount - params.paidAmount;
      supplier.totalPurchases += params.totalAmount;
      supplier.outstandingBalance += unpaidAmount;

      this.supplierLedger.unshift({
        id: `sled-${Date.now()}`,
        supplierId: supplier.id,
        date: now.split('T')[0],
        description: `Goods Received - Bill #${params.invoiceNumber}`,
        referenceType: 'purchase',
        referenceId: params.invoiceNumber,
        debit: 0,
        credit: params.totalAmount,
        balance: supplier.outstandingBalance
      });

      if (params.paidAmount > 0) {
        this.supplierLedger.unshift({
          id: `sled-${Date.now()}-pmt`,
          supplierId: supplier.id,
          date: now.split('T')[0],
          description: `Payment made via ${params.paymentMethod || 'Bank'}`,
          referenceType: 'payment_made',
          referenceId: `PMT-${params.invoiceNumber}`,
          debit: params.paidAmount,
          credit: 0,
          balance: supplier.outstandingBalance
        });
      }

      saveToStorage(DB_KEYS.SUPPLIERS, this.suppliers);
      saveToStorage(DB_KEYS.SUPPLIER_LEDGER, this.supplierLedger);
    }

    saveToStorage(DB_KEYS.PRODUCTS, this.products);
    saveToStorage(DB_KEYS.MOVEMENTS, this.movements);
    this.notify();

    return { success: true };
  }

  // --- RECORD SUPPLIER PAYMENT ---
  public recordSupplierPayment(params: {
    supplierId: string;
    amount: number;
    paymentMethod: 'cash' | 'bank_transfer' | 'upi';
    referenceNumber: string;
    notes?: string;
  }): { success: boolean; error?: string } {
    const supplier = this.suppliers.find(s => s.id === params.supplierId);
    if (!supplier) return { success: false, error: 'Supplier not found' };

    supplier.outstandingBalance = Math.max(0, supplier.outstandingBalance - params.amount);
    const now = new Date().toISOString();

    this.supplierLedger.unshift({
      id: `sled-${Date.now()}`,
      supplierId: supplier.id,
      date: now.split('T')[0],
      description: `Payment made via ${params.paymentMethod} (Ref: ${params.referenceNumber})`,
      referenceType: 'payment_made',
      referenceId: params.referenceNumber,
      debit: params.amount,
      credit: 0,
      balance: supplier.outstandingBalance
    });

    saveToStorage(DB_KEYS.SUPPLIERS, this.suppliers);
    saveToStorage(DB_KEYS.SUPPLIER_LEDGER, this.supplierLedger);
    this.notify();
    return { success: true };
  }

  // --- RECORD CUSTOMER PAYMENT (KHATA RECOVERY) ---
  public recordCustomerPayment(params: {
    customerId: string;
    amount: number;
    paymentMethod: 'cash' | 'upi' | 'card' | 'bank_transfer';
    reference?: string;
  }): { success: boolean; error?: string } {
    const customer = this.customers.find(c => c.id === params.customerId);
    if (!customer) return { success: false, error: 'Customer not found' };

    customer.outstandingBalance = Math.max(0, customer.outstandingBalance - params.amount);
    const now = new Date().toISOString();

    this.customerLedger.unshift({
      id: `cled-${Date.now()}`,
      customerId: customer.id,
      date: now.split('T')[0],
      description: `Payment received via ${params.paymentMethod} ${params.reference ? `(Ref: ${params.reference})` : ''}`,
      referenceType: 'payment_received',
      referenceId: `RCP-${Date.now()}`,
      debit: 0,
      credit: params.amount,
      balance: customer.outstandingBalance
    });

    saveToStorage(DB_KEYS.CUSTOMERS, this.customers);
    saveToStorage(DB_KEYS.CUSTOMER_LEDGER, this.customerLedger);
    this.notify();
    return { success: true };
  }

  // --- EXPENSE RECORDING ---
  public recordExpense(expenseData: Omit<Expense, 'id' | 'voucherNumber'>): Expense {
    const voucherNumber = `EXP-2026-${String(this.expenses.length + 84).padStart(3, '0')}`;
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      voucherNumber
    };
    this.expenses.unshift(newExpense);
    saveToStorage(DB_KEYS.EXPENSES, this.expenses);
    this.notify();
    return newExpense;
  }

  // --- ONLINE ORDER CREATION & SHARED INVENTORY CONCURRENCY ---
  public placeOnlineOrder(orderData: Omit<OnlineOrder, 'id' | 'orderNumber' | 'status' | 'createdAt'>): { success: boolean; order?: OnlineOrder; error?: string } {
    // Check inventory
    for (const item of orderData.items) {
      const prod = this.products.find(p => p.id === item.productId);
      if (!prod) return { success: false, error: `Product not found: ${item.productName}` };
      const variant = prod.variants.find(v => v.id === item.variantId);
      if (!variant) return { success: false, error: `Variant not found` };
      if (variant.stockQuantity < item.quantity) {
        return { success: false, error: `Sorry, size ${variant.size} is now out of stock in Ratia store.` };
      }
    }

    const now = new Date().toISOString();
    const orderNumber = `ORD-ON-${this.onlineOrders.length + 102}`;
    const newOrder: OnlineOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'new',
      createdAt: now
    };

    // Concurrently reserve/decrement stock so POS immediately sees updated stock
    for (const item of orderData.items) {
      const prod = this.products.find(p => p.id === item.productId)!;
      const variant = prod.variants.find(v => v.id === item.variantId)!;
      const prevStock = variant.stockQuantity;
      variant.stockQuantity = prevStock - item.quantity;

      this.movements.unshift({
        id: `mov-${Date.now()}-${variant.id}`,
        productId: prod.id,
        variantId: variant.id,
        productName: prod.name,
        variantDetails: `Size ${variant.size} - ${variant.color}`,
        quantity: -item.quantity,
        previousStock: prevStock,
        newStock: variant.stockQuantity,
        movementType: 'sale',
        referenceId: orderNumber,
        reason: `Online Store Order ${orderNumber} placed by ${orderData.customerName}`,
        userName: 'Online System',
        createdAt: now
      });
    }

    this.onlineOrders.unshift(newOrder);

    // Add alert notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'New Online Order Placed',
      message: `${orderData.customerName} (${orderData.city}) ordered ${orderData.items.length} item(s) - ₹${orderData.totalAmount}`,
      type: 'online_order',
      severity: 'info',
      read: false,
      createdAt: now
    });

    saveToStorage(DB_KEYS.PRODUCTS, this.products);
    saveToStorage(DB_KEYS.MOVEMENTS, this.movements);
    saveToStorage(DB_KEYS.ONLINE_ORDERS, this.onlineOrders);
    saveToStorage(DB_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, status: OnlineOrder['status'], courierName?: string, trackingNumber?: string): void {
    this.onlineOrders = this.onlineOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          courierName: courierName || o.courierName,
          trackingNumber: trackingNumber || o.trackingNumber,
          paymentStatus: status === 'delivered' ? 'paid' : o.paymentStatus
        };
      }
      return o;
    });
    saveToStorage(DB_KEYS.ONLINE_ORDERS, this.onlineOrders);
    this.notify();
  }

  // --- NOTIFICATIONS ---
  public markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveToStorage(DB_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markAllNotificationsAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    saveToStorage(DB_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // --- FULL JSON BACKUP & RESTORE ---
  public exportFullDatabaseJson(): string {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      business: this.settings.businessName,
      version: '1.0.0',
      data: {
        settings: this.settings,
        products: this.products,
        customers: this.customers,
        suppliers: this.suppliers,
        invoices: this.invoices,
        expenses: this.expenses,
        onlineOrders: this.onlineOrders,
        movements: this.movements,
        customerLedger: this.customerLedger,
        supplierLedger: this.supplierLedger,
        notifications: this.notifications
      }
    };
    return JSON.stringify(fullBackup, null, 2);
  }

  public restoreFromDatabaseJson(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || !parsed.data.products) {
        return { success: false, error: 'Invalid Sethi Boot House backup format' };
      }
      const d = parsed.data;
      if (d.settings) saveToStorage(DB_KEYS.SETTINGS, d.settings);
      if (d.products) saveToStorage(DB_KEYS.PRODUCTS, d.products);
      if (d.customers) saveToStorage(DB_KEYS.CUSTOMERS, d.customers);
      if (d.suppliers) saveToStorage(DB_KEYS.SUPPLIERS, d.suppliers);
      if (d.invoices) saveToStorage(DB_KEYS.INVOICES, d.invoices);
      if (d.expenses) saveToStorage(DB_KEYS.EXPENSES, d.expenses);
      if (d.onlineOrders) saveToStorage(DB_KEYS.ONLINE_ORDERS, d.onlineOrders);
      if (d.movements) saveToStorage(DB_KEYS.MOVEMENTS, d.movements);
      if (d.customerLedger) saveToStorage(DB_KEYS.CUSTOMER_LEDGER, d.customerLedger);
      if (d.supplierLedger) saveToStorage(DB_KEYS.SUPPLIER_LEDGER, d.supplierLedger);

      // Re-instantiate
      this.settings = d.settings || this.settings;
      this.products = d.products || this.products;
      this.customers = d.customers || this.customers;
      this.suppliers = d.suppliers || this.suppliers;
      this.invoices = d.invoices || this.invoices;
      this.expenses = d.expenses || this.expenses;
      this.onlineOrders = d.onlineOrders || this.onlineOrders;
      this.movements = d.movements || this.movements;
      this.customerLedger = d.customerLedger || this.customerLedger;
      this.supplierLedger = d.supplierLedger || this.supplierLedger;

      this.notify();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'JSON Parse error' };
    }
  }

  public resetToFactoryDemo(): void {
    localStorage.removeItem(DB_KEYS.SETTINGS);
    localStorage.removeItem(DB_KEYS.PRODUCTS);
    localStorage.removeItem(DB_KEYS.CUSTOMERS);
    localStorage.removeItem(DB_KEYS.SUPPLIERS);
    localStorage.removeItem(DB_KEYS.INVOICES);
    localStorage.removeItem(DB_KEYS.EXPENSES);
    localStorage.removeItem(DB_KEYS.ONLINE_ORDERS);
    localStorage.removeItem(DB_KEYS.MOVEMENTS);
    localStorage.removeItem(DB_KEYS.CUSTOMER_LEDGER);
    localStorage.removeItem(DB_KEYS.SUPPLIER_LEDGER);
    localStorage.removeItem(DB_KEYS.NOTIFICATIONS);

    this.settings = INITIAL_SETTINGS;
    this.products = INITIAL_PRODUCTS;
    this.customers = INITIAL_CUSTOMERS;
    this.suppliers = INITIAL_SUPPLIERS;
    this.invoices = INITIAL_INVOICES;
    this.expenses = INITIAL_EXPENSES;
    this.onlineOrders = INITIAL_ONLINE_ORDERS;
    this.movements = INITIAL_MOVEMENTS;
    this.customerLedger = INITIAL_CUSTOMER_LEDGER;
    this.supplierLedger = INITIAL_SUPPLIER_LEDGER;
    this.notifications = [];
    this.notify();
  }
}

export const db = StorageEngine.getInstance();
