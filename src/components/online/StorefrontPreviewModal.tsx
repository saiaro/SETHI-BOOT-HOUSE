import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Store,
  Check,
  Truck,
  ShieldCheck,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { Product, ProductVariant } from '../../types/database';

export const StorefrontPreviewModal: React.FC = () => {
  const { products, placeOnlineOrder, isStorefrontOpen, setIsStorefrontOpen, settings } = useStore();
  const { formatINR } = useTranslation();

  const [cart, setCart] = useState<{ product: Product; variant: ProductVariant; quantity: number }[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('Fatehabad');
  const [payMethod, setPayMethod] = useState<'cod' | 'upi_online'>('cod');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);

  if (!isStorefrontOpen) return null;

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    if (variant.stockQuantity <= 0) {
      setStoreError(`Sorry! Size ${variant.size} is currently out of stock.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.variant.id === variant.id);
      if (existing) {
        if (existing.quantity + 1 > variant.stockQuantity) {
          setStoreError(`Only ${variant.stockQuantity} pairs available in central warehouse.`);
          return prev;
        }
        return prev.map(item => item.variant.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setStoreError(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.variant.sellingPrice * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !custName || !custPhone || !custAddress) return;

    const res = placeOnlineOrder({
      customerName: custName,
      phone: custPhone,
      shippingAddress: custAddress,
      city: custCity,
      state: 'Haryana',
      pincode: '125050',
      items: cart.map(i => ({
        productId: i.product.id,
        variantId: i.variant.id,
        productName: i.product.name,
        size: i.variant.size,
        color: i.variant.color,
        quantity: i.quantity,
        price: i.variant.sellingPrice,
        total: i.variant.sellingPrice * i.quantity
      })),
      totalAmount: cartTotal,
      paymentMethod: payMethod,
      paymentStatus: payMethod === 'upi_online' ? 'paid' : 'pending'
    });

    if (res.success && res.order) {
      setOrderPlacedSuccess(`Order #${res.order.orderNumber} placed successfully! Stock immediately reserved from Ratia inventory.`);
      setCart([]);
      setCustName('');
      setCustPhone('');
      setCustAddress('');
      setTimeout(() => setOrderPlacedSuccess(null), 7000);
    } else {
      setStoreError(res.error || 'Failed to place order');
    }
  };

  const filtered = products.filter(p => selectedBrand === 'all' || p.brand === selectedBrand);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-2 md:p-6 backdrop-blur-xs">
      <div className="flex h-full max-h-[96vh] w-full max-w-6xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden border border-slate-300">
        {/* Customer E-Commerce Storefront Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-black text-sm">
              SBH
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase">{settings.businessName} ONLINE STORE</h2>
              <p className="text-[11px] text-blue-200">
                Official Online Storefront • Shared Real-time Inventory with Ratia Shop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 border border-emerald-500/40">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Concurrency Active</span>
            </div>

            <button
              onClick={() => setIsStorefrontOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {orderPlacedSuccess && (
          <div className="bg-emerald-600 text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            <span>{orderPlacedSuccess}</span>
          </div>
        )}

        {storeError && (
          <div className="bg-rose-600 text-white p-2.5 text-center text-xs font-bold flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{storeError}</span>
          </div>
        )}

        {/* Storefront Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          {/* Main Catalog Area */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 space-y-4">
            {/* Promo Banner */}
            <div className="rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white shadow-sm flex justify-between items-center">
              <div>
                <span className="rounded bg-blue-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Haryana Free Delivery
                </span>
                <h3 className="text-xl font-black mt-2">New Season Campus &amp; Sparx Arrivals</h3>
                <p className="text-xs text-blue-200 mt-1">100% Genuine Branded Footwear direct from Sethi Boot House, Ratia</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-2xl font-black">UP TO 30% OFF</p>
                <p className="text-xs text-blue-200">COD Available across Haryana</p>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {['all', 'Campus', 'Sparx', 'Bata', 'Relaxo', 'Red Chief', 'Paragon'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors shrink-0 ${
                    selectedBrand === b ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {b === 'all' ? 'All Footwear' : b}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <img src={product.imageUrl} alt={product.name} className="h-36 w-full object-cover" />
                    <div className="p-3">
                      <span className="text-[10px] font-bold text-blue-900 uppercase">{product.brand}</span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-900">₹{product.variants[0]?.sellingPrice}</span>
                        <span className="text-xs text-slate-400 line-through">₹{product.variants[0]?.mrp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Size Matrix Add to Cart */}
                  <div className="p-3 pt-0 border-t border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-500 mb-1">Select Size:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map(v => (
                        <button
                          key={v.id}
                          disabled={v.stockQuantity <= 0}
                          onClick={() => handleAddToCart(product, v)}
                          className={`rounded px-2 py-1 text-xs font-bold border transition-colors ${
                            v.stockQuantity <= 0
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                              : 'bg-slate-50 text-slate-900 border-slate-300 hover:bg-blue-900 hover:text-white'
                          }`}
                          title={`Size ${v.size} (${v.stockQuantity} pairs remaining in Ratia)`}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Cart & Fast Checkout Drawer */}
          <div className="w-full md:w-80 bg-white border-l border-slate-200 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-blue-900" />
                  <h3 className="text-sm font-bold text-slate-900">Your Shopping Bag</h3>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)} items
                </span>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto py-2 text-xs">
                {cart.length === 0 ? (
                  <p className="py-8 text-center text-slate-400">Your bag is empty.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 truncate max-w-[140px]">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">Size {item.variant.size} • Qty {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">₹{item.variant.sellingPrice * item.quantity}</span>
                        <button
                          onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                          className="text-rose-500 block text-[10px] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Checkout Form */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700">Full Delivery Name *</label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Navjot Singh"
                    className="w-full rounded border border-slate-300 py-1 px-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9872154321"
                    className="w-full rounded border border-slate-300 py-1 px-2 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="House/Street, Village or Town"
                    className="w-full rounded border border-slate-300 py-1 px-2"
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Payment:</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={payMethod === 'cod'} onChange={() => setPayMethod('cod')} />
                      <span>COD</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={payMethod === 'upi_online'} onChange={() => setPayMethod('upi_online')} />
                      <span>UPI Online</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-black">
                  <span>Total Payable:</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-emerald-700 py-2 text-xs font-bold text-white hover:bg-emerald-600 shadow-sm"
                >
                  Place Order &amp; Reserve Inventory
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
