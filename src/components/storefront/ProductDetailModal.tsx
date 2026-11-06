import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted
}) => {
  if (!product) return null;

  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0] || ({} as ProductVariant)
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const mrp = selectedVariant.mrp || selectedVariant.sellingPrice;
  const sellingPrice = selectedVariant.sellingPrice;
  const savings = mrp - sellingPrice;
  const discountPercent = mrp > sellingPrice ? Math.round((savings / mrp) * 100) : 0;
  const inStock = selectedVariant.stockQuantity > 0;

  const handleAdd = () => {
    if (!inStock) return;
    onAddToCart(product, selectedVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuy = () => {
    if (!inStock) return;
    onBuyNow(product, selectedVariant, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#E6E3DE] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E6E3DE] bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#102F4D]">
              {product.brand}
            </span>
            <span className="text-xs text-[#6C747C]">•</span>
            <span className="text-xs text-[#6C747C] font-semibold">{product.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C747C] hover:text-[#102F4D] hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close product details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-start">
            
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg p-6 flex items-center justify-center overflow-hidden">
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#C91920] text-white text-xs font-black px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-2 gap-2 text-xs text-[#102F4D] font-semibold bg-[#FAF9F6] p-3 rounded-lg border border-[#E6E3DE]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#C91920]" />
                  <span>100% Genuine Pair</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-[#C91920]" />
                  <span>7-Day Store Exchange</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[#C91920]" />
                  <span>Free Shipping on ₹1,999+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#C91920]" />
                  <span>Ratia Store Warranty</span>
                </div>
              </div>
            </div>

            {/* Right: Info, Price, Sizes & CTA */}
            <div className="space-y-5 flex flex-col justify-between">
              
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6C747C]">
                  {product.gender}'s Footwear
                </p>
                <h2 className="text-2xl sm:text-3xl font-[700] text-[#102F4D] tracking-[-1px] mt-1">
                  {product.name}
                </h2>
                <p className="text-xs text-[#6C747C] mt-0.5">
                  SKU: <strong className="text-[#102F4D]">{selectedVariant.sku || 'SBH-FW-01'}</strong>
                </p>
              </div>

              {/* Pricing Block */}
              <div className="p-3.5 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-[#102F4D]">
                    ₹{sellingPrice.toLocaleString('en-IN')}
                  </span>
                  {mrp > sellingPrice && (
                    <span className="text-base text-[#6C747C] line-through">
                      ₹{mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="text-xs font-bold text-[#C91920] bg-[#C91920]/10 px-2 py-0.5 rounded">
                      Save ₹{savings.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#6C747C] mt-1">
                  Inclusive of all taxes (GST {product.gstRate || 12}%)
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#102F4D] mb-2">
                  <span>SELECT UK SHOE SIZE:</span>
                  <span className="text-xs text-[#6C747C] font-normal">Standard India/UK Sizing</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    const isOut = v.stockQuantity <= 0;

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        disabled={isOut}
                        className={`py-2 px-2 text-center rounded-md border text-sm font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#102F4D] text-white border-[#102F4D] shadow-xs'
                            : isOut
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            : 'bg-white text-[#17212B] border-[#E6E3DE] hover:border-[#102F4D]'
                        }`}
                      >
                        <div>Size {v.size}</div>
                        <div className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-[#6C747C]'}`}>
                          {isOut ? 'Sold out' : `${v.stockQuantity} pairs`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Details & Stock Status */}
              <div className="flex items-center justify-between text-xs py-2 border-y border-[#E6E3DE]">
                <div>
                  <span className="text-[#6C747C]">Colour: </span>
                  <strong className="text-[#102F4D]">{selectedVariant.color || 'Standard'}</strong>
                </div>

                <div>
                  {selectedVariant.stockQuantity > 5 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock at Ratia Warehouse
                    </span>
                  ) : selectedVariant.stockQuantity > 0 ? (
                    <span className="text-[#C91920] font-bold">
                      Hurry, only {selectedVariant.stockQuantity} pairs remaining!
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Quantity Adjuster */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#102F4D]">Quantity:</span>
                <div className="flex items-center border border-[#E6E3DE] rounded-md bg-[#FAF9F6]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 font-bold text-sm text-[#102F4D] hover:bg-slate-200 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-[#102F4D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stockQuantity || 1, quantity + 1))}
                    disabled={quantity >= selectedVariant.stockQuantity}
                    className="px-3 py-1 font-bold text-sm text-[#102F4D] hover:bg-slate-200 rounded-r disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Bag, Buy Now & Wishlist */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
                <button
                  onClick={handleAdd}
                  disabled={!inStock}
                  className={`flex-1 py-3 px-5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    !inStock
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : addedSuccess
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#102F4D] hover:bg-[#183E5D] text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuy}
                  disabled={!inStock}
                  className="flex-1 py-3 px-5 rounded-md font-bold text-sm bg-[#C91920] hover:bg-[#a8141a] text-white flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-40"
                >
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-md border transition-colors flex items-center justify-center cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#C91920] text-white border-[#C91920]'
                      : 'bg-[#FAF9F6] text-[#102F4D] border-[#E6E3DE] hover:bg-white hover:text-[#C91920]'
                  }`}
                  title="Save to Wishlist"
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-2 text-xs text-[#6C747C] leading-relaxed">
                  <p className="font-bold text-[#102F4D] mb-1">Product Description:</p>
                  <p>{product.description}</p>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
