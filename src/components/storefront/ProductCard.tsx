import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) => {
  // Sort variants by size numerically where possible
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0] || ({} as ProductVariant)
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!selectedVariant || !selectedVariant.sellingPrice) {
    return null;
  }

  const mrp = selectedVariant.mrp || selectedVariant.sellingPrice;
  const sellingPrice = selectedVariant.sellingPrice;
  const discountPercent = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVariant.stockQuantity <= 0) return;
    onAddToCart(product, selectedVariant);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <article className="group flex flex-col bg-white border border-[#E6E3DE] rounded-lg overflow-hidden hover:border-[#102F4D] hover:shadow-lg transition-all duration-300 relative">
      
      {/* Top Badges & Wishlist Trigger */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {discountPercent > 0 ? (
          <span className="bg-[#C91920] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
            {discountPercent}% OFF
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-xs transition-colors pointer-events-auto cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-[#C91920] text-white'
              : 'bg-white/90 text-[#102F4D] hover:bg-white hover:text-[#C91920]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title="Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image Area with Click to View Details */}
      <div 
        onClick={() => onOpenDetails(product)}
        className="w-full aspect-4/3 sm:aspect-square bg-[#FAF9F6] p-4 flex items-center justify-center relative cursor-pointer overflow-hidden group-hover:bg-[#F3EDE3]/40 transition-colors"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Pill on Hover (Desktop) */}
        <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 border border-[#E6E3DE] text-[#102F4D] px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5 shadow-sm">
          <Eye className="h-3.5 w-3.5" />
          <span>Quick View</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        
        {/* Brand Name */}
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-widest text-[#6C747C] mb-1">
          <span>{product.brand}</span>
          <span className="text-[#102F4D]/70 font-semibold">{product.gender}</span>
        </div>

        {/* Product Name */}
        <h3 
          onClick={() => onOpenDetails(product)}
          className="font-bold text-sm sm:text-base text-[#102F4D] group-hover:text-[#C91920] transition-colors line-clamp-1 cursor-pointer mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* UK Sizes Quick Selection */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-[#6C747C] mb-1 font-semibold">
            <span>SELECT UK SIZE:</span>
            {selectedVariant.stockQuantity <= 3 && selectedVariant.stockQuantity > 0 ? (
              <span className="text-[#C91920] font-bold">Only {selectedVariant.stockQuantity} left</span>
            ) : selectedVariant.stockQuantity === 0 ? (
              <span className="text-rose-600 font-bold">Out of stock</span>
            ) : (
              <span className="text-emerald-700">In Stock</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {variants.map((v) => {
              const isSelected = selectedVariant.id === v.id;
              const isOutOfStock = v.stockQuantity <= 0;

              return (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(v);
                  }}
                  disabled={isOutOfStock}
                  className={`min-h-[26px] min-w-[28px] px-1.5 py-0.5 text-xs font-bold rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#102F4D] text-white border-[#102F4D]'
                      : isOutOfStock
                      ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                      : 'bg-[#FAF9F6] text-[#17212B] border-[#E6E3DE] hover:border-[#102F4D]'
                  }`}
                  title={`Size ${v.size} (${v.color}) - ${v.stockQuantity} pairs`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Add to Bag in Bottom Row */}
        <div className="mt-auto pt-2 border-t border-[#E6E3DE] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-[#102F4D]">
                ₹{sellingPrice.toLocaleString('en-IN')}
              </span>
              {mrp > sellingPrice && (
                <span className="text-xs text-[#6C747C] line-through">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={selectedVariant.stockQuantity <= 0}
            className={`px-3 py-1.5 sm:py-2 rounded-md font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              selectedVariant.stockQuantity <= 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#102F4D] hover:bg-[#183E5D] text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
};
