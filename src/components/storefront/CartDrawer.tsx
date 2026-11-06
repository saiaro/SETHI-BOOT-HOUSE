import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Tag,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Product, ProductVariant, OnlineOrder } from '../../types/database';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemoveItem: (variantId: string) => void;
  onPlaceOrder: (orderData: {
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: 'cod' | 'upi_online';
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
  }) => { success: boolean; order?: OnlineOrder; error?: string };
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1999;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearCart
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Checkout Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('Ratia');
  const [custState, setCustState] = useState('Haryana');
  const [custPincode, setCustPincode] = useState('125051');
  const [payMethod, setPayMethod] = useState<'cod' | 'upi_online'>('cod');
  const [checkoutError, setCheckoutError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<OnlineOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.variant.sellingPrice * item.quantity), 0);
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'SETHI100') {
      if (subtotal < 1000) {
        setCouponError('Minimum purchase of ₹1,000 required for SETHI100');
        return;
      }
      setAppliedDiscount(100);
      setCouponSuccess('₹100 discount applied successfully!');
    } else if (code === 'WELCOME50') {
      setAppliedDiscount(50);
      setCouponSuccess('₹50 welcome discount applied!');
    } else {
      setCouponError('Invalid coupon. Try "SETHI100" or "WELCOME50"');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!custName.trim()) {
      setCheckoutError('Please enter your full name');
      return;
    }
    if (!custPhone.trim() || custPhone.replace(/\D/g, '').length < 10) {
      setCheckoutError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!custAddress.trim()) {
      setCheckoutError('Please enter your delivery street address');
      return;
    }

    const res = onPlaceOrder({
      customerName: custName,
      phone: custPhone,
      shippingAddress: custAddress,
      city: custCity,
      state: custState,
      pincode: custPincode,
      paymentMethod: payMethod,
      items: items.map(i => ({
        productId: i.product.id,
        variantId: i.variant.id,
        productName: i.product.name,
        size: i.variant.size,
        color: i.variant.color,
        quantity: i.quantity,
        price: i.variant.sellingPrice,
        total: i.variant.sellingPrice * i.quantity
      })),
      totalAmount: grandTotal
    });

    if (res.success && res.order) {
      setPlacedOrder(res.order);
      onClearCart();
    } else {
      setCheckoutError(res.error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E3DE] bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#102F4D]" />
            <h2 className="font-[700] text-lg text-[#102F4D] uppercase tracking-wide">
              {placedOrder ? 'Order Confirmed' : isCheckingOut ? 'Express Checkout' : 'Shopping Bag'}
            </h2>
            <span className="text-xs bg-[#102F4D] text-white px-2 py-0.5 rounded-full font-bold">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C747C] hover:text-[#102F4D] hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (if not completed order) */}
        {!placedOrder && (
          <div className="bg-[#FAF9F6] border-b border-[#E6E3DE] px-5 py-2.5 text-xs">
            <div className="flex items-center justify-between font-semibold text-[#102F4D] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-[#C91920]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">You qualify for FREE Delivery across India!</span>
                ) : (
                  <span>Add <strong>₹{amountNeededForFreeShipping}</strong> more for Free Delivery</span>
                )}
              </span>
              <span className="text-[#6C747C]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#E6E3DE] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#C91920] h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* View 1: Placed Order Success Screen */}
          {placedOrder ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#C91920]">
                  OFFICIAL STORE ORDER
                </span>
                <h3 className="text-2xl font-[700] text-[#102F4D] tracking-[-0.5px] mt-1">
                  Thank You, {placedOrder.customerName}!
                </h3>
                <p className="text-sm text-[#6C747C] mt-1">
                  Order <strong>#{placedOrder.orderNumber}</strong> has been received and stock reserved from Ratia inventory.
                </p>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg p-4 text-left text-xs space-y-2 text-[#17212B]">
                <div className="flex justify-between border-b border-[#E6E3DE] pb-2">
                  <span className="text-[#6C747C]">Order Total:</span>
                  <strong className="text-base font-black text-[#102F4D]">
                    ₹{placedOrder.totalAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C747C]">Payment Mode:</span>
                  <span className="font-bold uppercase text-[#102F4D]">
                    {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI Online Payment'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C747C]">Deliver To:</span>
                  <span className="text-right max-w-[220px]">
                    {placedOrder.shippingAddress}, {placedOrder.city}, {placedOrder.state} - {placedOrder.pincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C747C]">Contact:</span>
                  <span>{placedOrder.phone}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    const msg = encodeURIComponent(`Hello Sethi Boot House! I placed order #${placedOrder.orderNumber} on your online store for ₹${placedOrder.totalAmount}. Please confirm dispatch!`);
                    window.open(`https://wa.me/919896012345?text=${msg}`, '_blank');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Chat on WhatsApp for Tracking Updates</span>
                </button>

                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    setIsCheckingOut(false);
                    onClose();
                  }}
                  className="w-full bg-[#102F4D] hover:bg-[#183E5D] text-white font-bold py-3 px-4 rounded-md text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : isCheckingOut ? (
            /* View 2: In-Drawer Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E3DE]">
                <span className="text-xs font-bold text-[#6C747C] uppercase tracking-wider">
                  Shipping & Customer Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs font-bold text-[#C91920] hover:underline"
                >
                  ← Edit Bag Items
                </button>
              </div>

              {checkoutError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded font-medium">
                  {checkoutError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#102F4D] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Jonny Sethi / Gurpreet Singh"
                    className="w-full border border-[#E6E3DE] rounded-md px-3 py-2 text-sm focus:border-[#102F4D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#102F4D] mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="10-digit mobile (for delivery SMS)"
                    className="w-full border border-[#E6E3DE] rounded-md px-3 py-2 text-sm focus:border-[#102F4D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#102F4D] mb-1">Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="House / Shop No., Street, Landmark"
                    className="w-full border border-[#E6E3DE] rounded-md px-3 py-2 text-sm focus:border-[#102F4D] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-[#102F4D] mb-1">City</label>
                    <input
                      type="text"
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      className="w-full border border-[#E6E3DE] rounded-md px-2.5 py-2 text-xs focus:border-[#102F4D] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#102F4D] mb-1">State</label>
                    <input
                      type="text"
                      value={custState}
                      onChange={(e) => setCustState(e.target.value)}
                      className="w-full border border-[#E6E3DE] rounded-md px-2.5 py-2 text-xs focus:border-[#102F4D] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#102F4D] mb-1">Pincode</label>
                    <input
                      type="text"
                      value={custPincode}
                      onChange={(e) => setCustPincode(e.target.value)}
                      className="w-full border border-[#E6E3DE] rounded-md px-2.5 py-2 text-xs focus:border-[#102F4D] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div className="pt-2">
                  <label className="block font-bold text-[#102F4D] mb-2">Select Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-all ${
                      payMethod === 'cod' 
                        ? 'border-[#102F4D] bg-[#EAF2F8] font-bold text-[#102F4D]' 
                        : 'border-[#E6E3DE] bg-[#FAF9F6] text-[#6C747C]'
                    }`}>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={payMethod === 'cod'}
                        onChange={() => setPayMethod('cod')}
                        className="sr-only"
                      />
                      <Banknote className="h-4 w-4 text-[#102F4D]" />
                      <div className="text-left">
                        <p className="text-xs font-bold leading-tight">Cash on Delivery</p>
                        <p className="text-[10px] text-[#6C747C]">Pay when shoes arrive</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-all ${
                      payMethod === 'upi_online' 
                        ? 'border-[#102F4D] bg-[#EAF2F8] font-bold text-[#102F4D]' 
                        : 'border-[#E6E3DE] bg-[#FAF9F6] text-[#6C747C]'
                    }`}>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={payMethod === 'upi_online'}
                        onChange={() => setPayMethod('upi_online')}
                        className="sr-only"
                      />
                      <CreditCard className="h-4 w-4 text-[#102F4D]" />
                      <div className="text-left">
                        <p className="text-xs font-bold leading-tight">UPI / Online</p>
                        <p className="text-[10px] text-[#6C747C]">GPay / PhonePe / Card</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#C91920] hover:bg-[#a8141a] text-white font-bold py-3.5 px-4 rounded-md text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Place Order • ₹{grandTotal.toLocaleString('en-IN')}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            /* View 3: Items in Cart */
            <>
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="h-16 w-16 bg-[#FAF9F6] text-[#6C747C] rounded-full flex items-center justify-center mx-auto border border-[#E6E3DE]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="font-[700] text-lg text-[#102F4D]">
                    Your shopping bag is empty
                  </h3>
                  <p className="text-xs text-[#6C747C] max-w-xs mx-auto">
                    Explore our collection of authentic sneakers, sports shoes, and leather boots to fill your bag.
                  </p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 bg-[#102F4D] text-white px-5 py-2 rounded-md font-bold text-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-[#E6E3DE]">
                  {items.map((item) => (
                    <div key={item.variant.id} className="pt-3 first:pt-0 flex gap-3">
                      
                      {/* Product Thumbnail */}
                      <div className="h-20 w-20 bg-[#FAF9F6] border border-[#E6E3DE] rounded-md p-2 flex items-center justify-center shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Info & Quantity Adjuster */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C747C]">
                                {item.product.brand}
                              </p>
                              <h4 className="font-bold text-xs sm:text-sm text-[#102F4D] line-clamp-1">
                                {item.product.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => onRemoveItem(item.variant.id)}
                              className="text-[#6C747C] hover:text-[#C91920] p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#6C747C] mt-1">
                            <span>UK Size: <strong className="text-[#102F4D]">{item.variant.size}</strong></span>
                            <span>•</span>
                            <span>{item.variant.color}</span>
                          </div>
                        </div>

                        {/* Price & Quantity Adjuster */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#E6E3DE] rounded bg-[#FAF9F6]">
                            <button
                              onClick={() => onUpdateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-xs font-bold text-[#102F4D] hover:bg-slate-200"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-bold text-[#102F4D]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.variant.id, Math.min(item.variant.stockQuantity, item.quantity + 1))}
                              disabled={item.quantity >= item.variant.stockQuantity}
                              className="px-2 py-0.5 text-xs font-bold text-[#102F4D] hover:bg-slate-200 disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-black text-sm text-[#102F4D]">
                            ₹{(item.variant.sellingPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Code Input */}
              {items.length > 0 && (
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6C747C]" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon: SETHI100"
                        className="w-full border border-[#E6E3DE] rounded-md py-1.5 pl-8 pr-2 text-xs uppercase font-semibold focus:border-[#102F4D] focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#102F4D] hover:bg-[#183E5D] text-white px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-emerald-700 font-semibold mt-1">{couponSuccess}</p>}
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Summary & Checkout Button (Only if items exist and not on success) */}
        {!placedOrder && items.length > 0 && !isCheckingOut && (
          <div className="border-t border-[#E6E3DE] bg-[#FAF9F6] p-5 space-y-3">
            <div className="space-y-1.5 text-xs text-[#6C747C]">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-[#102F4D]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery (Pan-India)</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-700 uppercase font-black">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#C91920] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-[#102F4D] pt-2 border-t border-[#E6E3DE]">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-[#102F4D] hover:bg-[#183E5D] text-white font-bold py-3.5 px-4 rounded-md text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
