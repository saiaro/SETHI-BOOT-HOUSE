import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product, variant: ProductVariant) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveFromWishlist,
  onMoveToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E3DE] bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#C91920] fill-[#C91920]" />
            <h2 className="font-[700] text-lg text-[#102F4D] uppercase tracking-wide">
              Saved Footwear
            </h2>
            <span className="text-xs bg-[#C91920] text-white px-2 py-0.5 rounded-full font-bold">
              {products.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C747C] hover:text-[#102F4D] hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="h-16 w-16 bg-[#FAF9F6] text-[#6C747C] rounded-full flex items-center justify-center mx-auto border border-[#E6E3DE]">
                <Heart className="h-8 w-8 text-[#C91920]" />
              </div>
              <h3 className="font-[700] text-lg text-[#102F4D]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#6C747C] max-w-xs mx-auto">
                Tap the heart icon on any shoe to save your favourite pairs here for later.
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-[#102F4D] text-white px-5 py-2 rounded-md font-bold text-xs"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-[#E6E3DE]">
              {products.map((product) => {
                const defaultVariant = product.variants?.[0];
                const price = defaultVariant?.sellingPrice || 0;
                const mrp = defaultVariant?.mrp || price;

                return (
                  <div key={product.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="h-20 w-20 bg-[#FAF9F6] border border-[#E6E3DE] rounded-md p-2 flex items-center justify-center shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C747C]">
                              {product.brand}
                            </p>
                            <h4 className="font-bold text-xs sm:text-sm text-[#102F4D] line-clamp-1">
                              {product.name}
                            </h4>
                          </div>

                          <button
                            onClick={() => onRemoveFromWishlist(product)}
                            className="text-[#6C747C] hover:text-[#C91920] p-1 cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-black text-sm text-[#102F4D]">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          {mrp > price && (
                            <span className="text-xs text-[#6C747C] line-through">
                              ₹{mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        {defaultVariant && defaultVariant.stockQuantity > 0 ? (
                          <button
                            onClick={() => {
                              onMoveToCart(product, defaultVariant);
                              onRemoveFromWishlist(product);
                            }}
                            className="w-full bg-[#102F4D] hover:bg-[#183E5D] text-white py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Move to Bag (Size {defaultVariant.size})</span>
                          </button>
                        ) : (
                          <span className="text-xs text-rose-600 font-bold">Currently Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div className="p-4 border-t border-[#E6E3DE] bg-[#FAF9F6]">
            <button
              onClick={onClose}
              className="w-full bg-[#FAF9F6] border border-[#102F4D] text-[#102F4D] hover:bg-[#102F4D] hover:text-white font-bold py-2.5 px-4 rounded-md text-xs transition-colors"
            >
              Back to Store
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
