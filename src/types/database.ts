export type UserRole = 'owner' | 'accountant' | 'manager' | 'cashier' | 'salesperson';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branchId: string;
  active: boolean;
  avatar?: string;
}

export type FootwearCategory = 
  | "Men's Shoes"
  | "Women's Shoes"
  | "Kids' Shoes"
  | "Sports Shoes"
  | "Formal Shoes"
  | "Casual Shoes"
  | "Sandals"
  | "Slippers"
  | "Boots"
  | "School Shoes"
  | "Other Footwear";

export type FootwearBrand =
  | 'Bata'
  | 'Sparx'
  | 'Campus'
  | 'Relaxo'
  | 'Red Chief'
  | 'Liberty'
  | 'Action'
  | 'Paragon'
  | 'Puma'
  | 'Nike'
  | 'Adidas'
  | 'Local / Unbranded';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string;
  size: string; // e.g. "6", "7", "8", "9", "10", "11", "38", "39"
  color: string;
  purchaseCost: number; // in Rupees
  mrp: number; // in Rupees
  sellingPrice: number; // in Rupees
  stockQuantity: number;
  reorderLevel: number;
  reservedOnlineQuantity?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: FootwearCategory;
  subcategory?: string;
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  manufacturer?: string;
  supplierId?: string;
  hsnCode: string; // e.g. "6402", "6403", "6404", "6405"
  gstRate: number; // 5, 12, or 18%
  imageUrl: string;
  status: 'active' | 'archived';
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export type StockMovementType =
  | 'opening_stock'
  | 'sale'
  | 'sale_return'
  | 'purchase_receipt'
  | 'purchase_return'
  | 'damaged'
  | 'adjustment'
  | 'exchange_in'
  | 'exchange_out';

export interface InventoryMovement {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantDetails: string; // e.g. "Size 8 - Black"
  quantity: number; // positive for additions, negative for deductions
  previousStock: number;
  newStock: number;
  movementType: StockMovementType;
  referenceId?: string; // invoiceId, poId, etc.
  reason: string;
  userName: string;
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'credit' | 'bank_transfer' | 'split';

export interface PaymentBreakdown {
  method: 'cash' | 'upi' | 'card' | 'credit' | 'bank_transfer';
  amount: number;
  reference?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  brand: string;
  size: string;
  color: string;
  sku: string;
  barcode: string;
  hsnCode: string;
  quantity: number;
  returnedQuantity?: number;
  mrp: number;
  rate: number; // unit selling price
  discountPercent: number;
  discountAmount: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
}

export type InvoiceType = 'gst_tax_invoice' | 'cash_bill' | 'quotation';
export type InvoiceStatus = 'completed' | 'returned' | 'partially_returned' | 'cancelled';
export type SalesChannel = 'pos' | 'online' | 'whatsapp' | 'instagram' | 'phone';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "SBH/2026/0101"
  invoiceType: InvoiceType;
  status: InvoiceStatus;
  date: string; // ISO
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerGstin?: string;
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
  payments: PaymentBreakdown[];
  cashTendered?: number;
  changeDue?: number;
  channel: SalesChannel;
  cashierName: string;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  birthday?: string;
  gender?: 'Male' | 'Female' | 'Other';
  customerType: 'Regular' | 'VIP' | 'Wholesale' | 'Walk-in';
  preferredBrands: string[];
  preferredSizes: string[];
  outstandingBalance: number; // positive means customer owes store
  loyaltyPoints: number;
  totalPurchasesCount: number;
  totalSpent: number;
  notes?: string;
  createdAt: string;
}

export interface CustomerLedgerEntry {
  id: string;
  customerId: string;
  date: string;
  description: string;
  referenceType: 'sale' | 'payment_received' | 'return' | 'adjustment';
  referenceId: string;
  debit: number; // Increases receivable (e.g. credit sale)
  credit: number; // Decreases receivable (e.g. payment received or return)
  balance: number; // Cumulative balance
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  gstin?: string;
  paymentTerms?: string;
  openingBalance: number;
  outstandingBalance: number; // amount store owes supplier
  totalPurchases: number;
  createdAt: string;
}

export interface SupplierLedgerEntry {
  id: string;
  supplierId: string;
  date: string;
  description: string;
  referenceType: 'purchase' | 'payment_made' | 'return';
  referenceId: string;
  debit: number; // payment made
  credit: number; // purchase received
  balance: number;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  gstRate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-2026-0042"
  supplierId: string;
  supplierName: string;
  supplierGstin?: string;
  date: string;
  status: 'draft' | 'ordered' | 'received' | 'partial' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  paidAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  receivedDate?: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Electricity'
  | 'Staff Salary'
  | 'Transportation & Freight'
  | 'Marketing & Ads'
  | 'Packaging & Bags'
  | 'Store Maintenance'
  | 'Tea & Refreshments'
  | 'Internet & Utilities'
  | 'Other Expenses';

export interface Expense {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'upi';
  paidTo: string;
  date: string;
  description: string;
  recordedBy: string;
  receiptAttachment?: string;
}

export interface OnlineOrder {
  id: string;
  orderNumber: string; // e.g. "ORD-ON-1082"
  customerName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: {
    productId: string;
    variantId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount: number;
  paymentMethod: 'cod' | 'upi_online' | 'card_online';
  paymentStatus: 'pending' | 'paid';
  status: 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  courierName?: string;
  trackingNumber?: string;
  reservationExpiresAt?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'stock_alert' | 'payment_due' | 'online_order' | 'birthday' | 'system';
  severity: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstin: string;
  panNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  upiId: string;
  invoicePrefix: string;
  invoiceNextNumber: number;
  printFormat: 'thermal_80mm' | 'thermal_58mm' | 'a4';
  loyaltyPointsPer100Rs: number;
  loyaltyRedemptionRate: number; // e.g. 1 point = 0.5 Rs
  whatsappEnabled: boolean;
  whatsappApiKey?: string;
  smsEnabled: boolean;
  smsApiKey?: string;
  negativeStockAllowed: boolean;
}
