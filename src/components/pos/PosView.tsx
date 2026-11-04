import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Barcode,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Pause,
  Play,
  User,
  CreditCard,
  Percent,
  Check,
  AlertCircle,
  Sparkles,
  Printer,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Product, ProductVariant, Customer, SaleItem, Invoice } from '../../types/database';
import { PaymentModal } from './PaymentModal';
import { InvoicePrintModal } from './InvoicePrintModal';
import { QuickCustomerModal } from './QuickCustomerModal';

export const PosView: React.FC = () => {
  const { products, customers, settings, completeSale, heldCarts, holdCurrentCart, removeHeldCart } = useStore();
  const { t, formatINR } = useTranslation();
  const { currentUser } = useAuth();

  // Search & Filters
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [taxPricingMode, setTaxPricingMode] = useState<'inclusive' | 'exclusive'>('inclusive');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [billDiscountType, setBillDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [billDiscountValue, setBillDiscountValue] = useState<number>(0);
  const [cartNotes, setCartNotes] = useState<string>('');

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [posError, setPosError] = useState<string | null>(null);
  const [showHeldCartsMenu, setShowHeldCartsMenu] = useState(false);

  // Focus barcode input on mount and on 'F2'
  useEffect(() => {
    barcodeInputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'active') return false;
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesQuery = !barcodeQuery ||
        p.name.toLowerCase().includes(barcodeQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(barcodeQuery.toLowerCase()) ||
        p.variants.some(v => v.barcode.includes(barcodeQuery) || v.sku.toLowerCase().includes(barcodeQuery.toLowerCase()));
      return matchesBrand && matchesCategory && matchesQuery;
    });
  }, [products, selectedBrand, selectedCategory, barcodeQuery]);

  // Handle Barcode Scan / Enter Key
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeQuery.trim()) return;

    // Search exact barcode
    let foundProduct: Product | undefined;
    let foundVariant: ProductVariant | undefined;

    for (const p of products) {
      const v = p.variants.find(v => v.barcode === barcodeQuery.trim() || v.sku.toLowerCase() === barcodeQuery.trim().toLowerCase());
      if (v) {
        foundProduct = p;
        foundVariant = v;
        break;
      }
    }

    if (foundProduct && foundVariant) {
      addVariantToCart(foundProduct, foundVariant);
      setBarcodeQuery('');
      setPosError(null);
    } else {
      setPosError(`No footwear found with barcode/SKU: "${barcodeQuery}"`);
    }
  };

  // Add Variant to Cart
  const addVariantToCart = (product: Product, variant: ProductVariant) => {
    if (variant.stockQuantity <= 0 && !settings.negativeStockAllowed) {
      setPosError(`Stock depleted for ${product.name} (Size: ${variant.size})`);
      return;
    }

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.variantId === variant.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const curItem = updated[existingIdx];
        if (curItem.quantity + 1 > variant.stockQuantity && !settings.negativeStockAllowed) {
          setPosError(`Cannot add more. Only ${variant.stockQuantity} pairs left in stock.`);
          return prev;
        }
        const newQty = curItem.quantity + 1;
        const discountAmt = (curItem.rate * curItem.discountPercent / 100) * newQty;
        const total = (curItem.rate * newQty) - discountAmt;
        const taxable = total / (1 + curItem.gstRate / 100);
        const cgst = (taxable * (curItem.gstRate / 2)) / 100;
        const sgst = cgst;

        updated[existingIdx] = {
          ...curItem,
          quantity: newQty,
          discountAmount: discountAmt,
          taxableValue: taxable,
          cgstAmount: cgst,
          sgstAmount: sgst,
          total
        };
        return updated;
      }

      // GST rule: <= ₹1000 is 5%, > ₹1000 is 12%
      const effectiveGstRate = variant.sellingPrice <= 1000 ? 5 : 12;
      const rate = variant.sellingPrice;
      const total = rate;
      const taxable = total / (1 + effectiveGstRate / 100);
      const cgst = (taxable * (effectiveGstRate / 2)) / 100;
      const sgst = cgst;

      const newItem: SaleItem = {
        id: `item-${Date.now()}-${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        brand: product.brand,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        barcode: variant.barcode,
        hsnCode: product.hsnCode || '6404',
        quantity: 1,
        mrp: variant.mrp,
        rate,
        discountPercent: 0,
        discountAmount: 0,
        taxableValue: taxable,
        gstRate: effectiveGstRate,
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: 0,
        total
      };

      return [...prev, newItem];
    });

    setPosError(null);
  };

  // Update item quantity
  const updateQuantity = (variantId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.variantId !== variantId) return item;
        const prod = products.find(p => p.id === item.productId);
        const variant = prod?.variants.find(v => v.id === item.variantId);
        const maxStock = variant ? variant.stockQuantity : 999;

        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > maxStock && !settings.negativeStockAllowed) {
          setPosError(`Maximum stock limit reached for size ${item.size}`);
          return item;
        }

        const discAmt = (item.rate * item.discountPercent / 100) * newQty;
        const total = (item.rate * newQty) - discAmt;
        const taxable = total / (1 + item.gstRate / 100);
        const cgst = (taxable * (item.gstRate / 2)) / 100;
        const sgst = cgst;

        return {
          ...item,
          quantity: newQty,
          discountAmount: discAmt,
          taxableValue: taxable,
          cgstAmount: cgst,
          sgstAmount: sgst,
          total
        };
      });
    });
  };

  // Remove from cart
  const removeFromCart = (variantId: string) => {
    setCartItems(prev => prev.filter(i => i.variantId !== variantId));
  };

  // --- MATHEMATICALLY SOUND TOTALS & GST CALCULATIONS ---
  const totalPairs = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const grossSubtotal = cartItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const itemsDiscountTotal = cartItems.reduce((sum, item) => sum + item.discountAmount, 0);

  const rawBillDiscount = billDiscountType === 'percent'
    ? (grossSubtotal * billDiscountValue) / 100
    : billDiscountValue;
  const billDiscount = Math.min(rawBillDiscount, Math.max(0, grossSubtotal - itemsDiscountTotal));
  const totalDiscount = itemsDiscountTotal + billDiscount;

  // Fully derived item breakdown ensuring arithmetic parity
  const calculatedItems: SaleItem[] = useMemo(() => {
    return cartItems.map(item => {
      const itemGross = item.rate * item.quantity;
      const itemDisc = item.discountAmount;
      // Proportional bill discount allocation
      const billDiscShare = grossSubtotal > 0 ? (itemGross / grossSubtotal) * billDiscount : 0;
      const totalItemDiscount = Number((itemDisc + billDiscShare).toFixed(2));
      const netItemVal = Math.max(0, itemGross - totalItemDiscount);

      // Footwear GST Rule: rate <= ₹1000 is 5%, > ₹1000 is 12%
      const unitNet = netItemVal / (item.quantity || 1);
      const effectiveGstRate = unitNet <= 1000 ? 5 : 12;

      let taxableValue = 0;
      let cgstAmount = 0;
      let sgstAmount = 0;
      let itemTotal = 0;

      if (taxPricingMode === 'inclusive') {
        // Price includes GST: itemTotal is netItemVal
        itemTotal = Number(netItemVal.toFixed(2));
        taxableValue = Number((netItemVal / (1 + effectiveGstRate / 100)).toFixed(2));
        const totalTax = Number((netItemVal - taxableValue).toFixed(2));
        cgstAmount = Number((totalTax / 2).toFixed(2));
        sgstAmount = Number((totalTax - cgstAmount).toFixed(2));
      } else {
        // Price is exclusive base, GST added on top
        taxableValue = Number(netItemVal.toFixed(2));
        const halfRate = effectiveGstRate / 200;
        cgstAmount = Number((taxableValue * halfRate).toFixed(2));
        sgstAmount = Number((taxableValue * halfRate).toFixed(2));
        itemTotal = Number((taxableValue + cgstAmount + sgstAmount).toFixed(2));
      }

      return {
        ...item,
        discountAmount: totalItemDiscount,
        discountPercent: itemGross > 0 ? Number(((totalItemDiscount / itemGross) * 100).toFixed(1)) : 0,
        gstRate: effectiveGstRate,
        taxableValue,
        cgstAmount,
        sgstAmount,
        total: itemTotal
      };
    });
  }, [cartItems, grossSubtotal, billDiscount, taxPricingMode]);

  const taxableTotal = Number(calculatedItems.reduce((sum, i) => sum + i.taxableValue, 0).toFixed(2));
  const cgstTotal = Number(calculatedItems.reduce((sum, i) => sum + i.cgstAmount, 0).toFixed(2));
  const sgstTotal = Number(calculatedItems.reduce((sum, i) => sum + i.sgstAmount, 0).toFixed(2));
  const totalGst = Number((cgstTotal + sgstTotal).toFixed(2));

  // Determine exact Grand Total and Round Off
  const rawPayable = taxPricingMode === 'inclusive'
    ? Math.max(0, grossSubtotal - totalDiscount)
    : Number((taxableTotal + totalGst).toFixed(2));

  const grandTotal = Math.round(rawPayable);
  const roundOff = Number((grandTotal - rawPayable).toFixed(2));

  // Hold Cart
  const handleHoldCart = () => {
    if (cartItems.length === 0) return;
    const name = selectedCustomer ? `${selectedCustomer.name} (${cartItems.length} items)` : `Cart #${heldCarts.length + 1}`;
    holdCurrentCart(name, cartItems, selectedCustomer);
    setCartItems([]);
    setSelectedCustomer(undefined);
  };

  // Resume Held Cart
  const handleResumeCart = (cartId: string) => {
    // If current cart already has items, hold it so no items are lost
    if (cartItems.length > 0) {
      const currentName = selectedCustomer ? `${selectedCustomer.name} (${cartItems.length} items)` : `Cart #${Date.now().toString().slice(-4)}`;
      holdCurrentCart(currentName, cartItems, selectedCustomer);
    }
    const resumed = removeHeldCart(cartId);
    if (resumed) {
      setCartItems(resumed.items);
      setSelectedCustomer(resumed.customer);
      setShowHeldCartsMenu(false);
      setPosError(null);
    }
  };

  // Final Checkout submission
  const handleConfirmPayment = (paymentData: any) => {
    const res = completeSale({
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer (Ratia)',
      customerPhone: selectedCustomer?.phone || '',
      customerAddress: selectedCustomer?.address || '',
      items: calculatedItems,
      subtotal: grossSubtotal,
      discountTotal: totalDiscount,
      taxableTotal: Math.max(0, taxableTotal),
      cgstTotal,
      sgstTotal,
      igstTotal: 0,
      roundOff,
      grandTotal,
      payments: paymentData.payments,
      cashTendered: paymentData.cashTendered,
      changeDue: paymentData.changeDue,
      channel: 'pos',
      cashierName: currentUser.name,
      notes: cartNotes,
      redeemedPoints: paymentData.redeemedPoints
    });

    if (res.success && res.invoice) {
      setCompletedInvoice(res.invoice);
      setIsPaymentModalOpen(false);
      setIsPrintModalOpen(true);
      setCartItems([]);
      setSelectedCustomer(undefined);
      setBillDiscountValue(0);
      setCartNotes('');
    } else {
      setPosError(res.error || 'Payment failed');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden">
      {/* LEFT SECTION: Catalog, Barcode Search & Fast Grid */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-white">
        {/* Barcode Search Header */}
        <div className="border-b border-slate-200 p-3 bg-slate-50 flex items-center gap-3">
          <form onSubmit={handleBarcodeSubmit} className="relative flex-1">
            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={barcodeQuery}
              onChange={(e) => setBarcodeQuery(e.target.value)}
              placeholder="Scan Barcode or type product / SKU / brand..."
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-24 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded bg-blue-900 px-3 py-1 text-xs font-bold text-white hover:bg-blue-800"
            >
              Add (Enter)
            </button>
          </form>

          {/* Held Carts quick launcher */}
          {heldCarts.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (heldCarts.length === 1 && !showHeldCartsMenu) {
                    handleResumeCart(heldCarts[0].id);
                  } else {
                    setShowHeldCartsMenu(!showHeldCartsMenu);
                  }
                }}
                className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 active:bg-amber-200 transition-colors cursor-pointer shadow-xs"
                title="Resume held customer bill"
              >
                <Play className="h-3.5 w-3.5 fill-amber-700 text-amber-700" />
                <span className="select-none font-bold">Resume ({heldCarts.length})</span>
                <ChevronDown className={`h-3 w-3 text-amber-700 transition-transform ${showHeldCartsMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Held Baskets Dropdown on click */}
              {showHeldCartsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowHeldCartsMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-72 rounded-lg border border-amber-200 bg-white p-2 shadow-xl z-40">
                    <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-1.5 mb-1">
                      <p className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                        Held Customer Baskets ({heldCarts.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowHeldCartsMenu(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs p-0.5"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {heldCarts.map(cart => {
                        const cartTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
                        return (
                          <div
                            key={cart.id}
                            className="p-2 hover:bg-amber-50/60 rounded transition-colors flex items-center justify-between gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => handleResumeCart(cart.id)}
                              className="flex-1 text-left cursor-pointer"
                            >
                              <p className="font-bold text-xs text-slate-900 truncate">{cart.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {cart.createdAt} • {cart.items.length} pairs • <span className="font-semibold text-slate-800">₹{cartTotal.toFixed(0)}</span>
                              </p>
                            </button>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleResumeCart(cart.id)}
                                className="rounded bg-blue-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-800 shadow-2xs cursor-pointer"
                              >
                                Resume
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeHeldCart(cart.id);
                                }}
                                className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Discard basket"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Brand & Category Filter Bar */}
        <div className="border-b border-slate-200 px-3 py-2 flex items-center gap-2 overflow-x-auto bg-slate-50 scrollbar-none text-xs">
          <span className="font-bold text-slate-500 shrink-0">Brand:</span>
          {['all', 'Campus', 'Sparx', 'Bata', 'Relaxo', 'Red Chief', 'Action', 'Paragon'].map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors shrink-0 ${
                selectedBrand === brand
                  ? 'bg-blue-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {brand === 'all' ? 'All Brands' : brand}
            </button>
          ))}
        </div>

        {/* Alert Bar */}
        {posError && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-800 flex justify-between items-center">
            <span className="font-medium">{posError}</span>
            <button onClick={() => setPosError(null)} className="text-rose-600 hover:text-rose-900 font-bold">✕</button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map(product => {
            const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);

            return (
              <div
                key={product.id}
                className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-blue-900 transition-all overflow-hidden"
              >
                {/* Product Image & Stock */}
                <div className="relative h-28 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {product.brand}
                  </div>
                  <div className={`absolute top-1.5 right-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    totalStock === 0 ? 'bg-rose-600 text-white' : totalStock <= 5 ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {totalStock} in stock
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={product.name}>
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-500">{product.category}</p>
                  </div>

                  {/* Size Matrix Quick Add Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 mb-1">Pick Size (UK):</p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map(variant => (
                        <button
                          key={variant.id}
                          disabled={variant.stockQuantity <= 0 && !settings.negativeStockAllowed}
                          onClick={() => addVariantToCart(product, variant)}
                          className={`rounded px-1.5 py-1 text-[11px] font-bold transition-all border ${
                            variant.stockQuantity <= 0
                              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                              : 'border-blue-900/40 bg-blue-50/50 text-blue-900 hover:bg-blue-900 hover:text-white'
                          }`}
                          title={`Size ${variant.size} • MRP ₹${variant.mrp} • Rate ₹${variant.sellingPrice} • Stock: ${variant.stockQuantity}`}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-400 line-through text-[11px]">₹{product.variants[0]?.mrp}</span>
                      <span className="font-bold text-slate-900 text-sm">₹{product.variants[0]?.sellingPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION: Cart, Customer Selector, Tax Calculation & Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-white border-l border-slate-200 shadow-md">
        {/* Customer Header */}
        <div className="border-b border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Billing To:</span>
            <button
              onClick={() => setIsQuickCustomerOpen(true)}
              className="text-xs font-bold text-blue-900 hover:underline"
            >
              + New Customer
            </button>
          </div>

          <div className="mt-1.5 relative">
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const found = customers.find(c => c.id === e.target.value);
                setSelectedCustomer(found);
              }}
              className="w-full rounded border border-slate-300 bg-white py-1.5 px-2.5 text-xs font-medium text-slate-800 focus:border-blue-900"
            >
              <option value="">Walk-in Customer (Ratia)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) • Khata: ₹{c.outstandingBalance} • Pts: {c.loyaltyPoints}
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && selectedCustomer.outstandingBalance > 0 && (
            <div className="mt-1.5 flex justify-between items-center text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <span>Existing Khata Balance:</span>
              <span>₹{selectedCustomer.outstandingBalance}</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400 space-y-2">
              <ShoppingCart className="h-10 w-10 text-slate-300 stroke-1" />
              <p className="text-xs font-semibold">{t.cartEmpty}</p>
              <p className="text-[11px]">Barcode scanner ready</p>
            </div>
          ) : (
            calculatedItems.map(item => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Size: <span className="font-bold text-blue-900">{item.size}</span> • {item.color} • HSN {item.hsnCode}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold text-slate-900 font-mono">₹{item.rate}</span>
                    <span className="text-[10px] text-slate-500">
                      {taxPricingMode === 'inclusive' ? `(${item.gstRate}% GST incl)` : `(+${item.gstRate}% GST extra)`}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.variantId, -1)}
                    className="h-6 w-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, 1)}
                    className="h-6 w-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold font-mono text-slate-900">₹{item.total.toFixed(0)}</p>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-slate-400 hover:text-rose-600 mt-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer: Tax Mode, Discounts, GST Breakdown, and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-3 space-y-2.5 text-xs">
            {/* Tax Pricing Mode Selector */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-1">
              <span className="text-[11px] font-semibold text-slate-600 pl-1">Pricing Mode:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTaxPricingMode('inclusive')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    taxPricingMode === 'inclusive'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Selling price includes GST (MRP Standard Retail)"
                >
                  MRP (GST Incl.)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxPricingMode('exclusive')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    taxPricingMode === 'exclusive'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="GST is calculated on top of base rate (+ GST Extra)"
                >
                  + GST Extra
                </button>
              </div>
            </div>

            {/* Bill Discount Input */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 font-medium">Bill Discount:</span>
              <div className="flex items-center gap-1 w-36">
                <input
                  type="number"
                  min="0"
                  value={billDiscountValue || ''}
                  onChange={(e) => setBillDiscountValue(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded border border-slate-300 py-1 px-2 text-right text-xs bg-white font-mono"
                />
                <button
                  onClick={() => setBillDiscountType(billDiscountType === 'percent' ? 'fixed' : 'percent')}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-700"
                >
                  {billDiscountType === 'percent' ? '%' : '₹'}
                </button>
              </div>
            </div>

            {/* Mathematically Unambiguous Tax & Subtotal Breakdown */}
            <div className="space-y-1 font-mono text-slate-600 border-t border-slate-200 pt-2 text-[11px]">
              {taxPricingMode === 'inclusive' ? (
                <>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>MRP Subtotal ({totalPairs} {totalPairs === 1 ? 'pair' : 'pairs'}):</span>
                    <span className="font-semibold">₹{grossSubtotal.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-semibold">
                      <span>Total Discount:</span>
                      <span>-₹{totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Detailed Taxable Base + GST addition showing exact math */}
                  <div className="rounded bg-slate-100/90 border border-slate-200/80 p-2 space-y-1 text-slate-600 mt-1">
                    <div className="flex justify-between items-center">
                      <span>Taxable Value (Base Price):</span>
                      <span className="font-semibold text-slate-800">₹{taxableTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>+ CGST (Central Tax):</span>
                      <span>+₹{cgstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>+ SGST (Haryana State):</span>
                      <span>+₹{sgstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-800 pt-1 border-t border-slate-200">
                      <span>GST (CGST + SGST):</span>
                      <span>+₹{totalGst.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Subtotal (Base Price):</span>
                    <span className="font-semibold">₹{grossSubtotal.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-semibold">
                      <span>Total Discount:</span>
                      <span>-₹{totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Taxable Amount:</span>
                    <span>₹{taxableTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>+ CGST:</span>
                    <span>+₹{cgstTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>+ SGST:</span>
                    <span>+₹{sgstTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-slate-700">
                    <span>Total GST:</span>
                    <span>+₹{totalGst.toFixed(2)}</span>
                  </div>
                </>
              )}

              {roundOff !== 0 && (
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Round Off:</span>
                  <span>{roundOff > 0 ? `+₹${roundOff.toFixed(2)}` : `-₹${Math.abs(roundOff).toFixed(2)}`}</span>
                </div>
              )}
            </div>

            {/* Grand Total Bar */}
            <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-slate-900">
              <div>
                <span className="font-extrabold text-sm uppercase block leading-tight">Total Payable:</span>
                <span className="text-[10px] text-slate-500 font-sans">
                  {taxPricingMode === 'inclusive' ? '✓ ₹' + taxableTotal.toFixed(2) + ' + ₹' + totalGst.toFixed(2) + ' GST' : 'Taxable + GST'}
                </span>
              </div>
              <span className="text-xl font-black font-mono">{formatINR(grandTotal)}</span>
            </div>

            {/* Checkout & Hold Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleHoldCart}
                className="flex-1 flex items-center justify-center gap-1 rounded border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                title="Save cart to resume later for another customer"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Hold</span>
              </button>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex-2 flex items-center justify-center gap-1.5 rounded bg-blue-900 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-blue-800 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pay ₹{grandTotal} (F4)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          subtotal={grossSubtotal}
          discount={totalDiscount}
          taxableAmount={taxableTotal}
          cgst={cgstTotal}
          sgst={sgstTotal}
          grandTotal={grandTotal}
          customer={selectedCustomer}
          settings={settings}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* Quick Customer Modal */}
      {isQuickCustomerOpen && (
        <QuickCustomerModal
          isOpen={isQuickCustomerOpen}
          onClose={() => setIsQuickCustomerOpen(false)}
          onCustomerCreated={(newCust) => setSelectedCustomer(newCust)}
        />
      )}

      {/* Invoice Print & Thermal Preview Modal */}
      {completedInvoice && (
        <InvoicePrintModal
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
            setCompletedInvoice(null);
          }}
          invoice={completedInvoice}
          settings={settings}
        />
      )}
    </div>
  );
};
