import React, { useState } from 'react';
import { ArrowRight, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';

interface FeaturedProductsProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onViewAllClick: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onOpenDetails,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onViewAllClick
}) => {
  const [addedId, setAddedId] = useState<string | null>(null);

  // Preferred priority matching the reference screenshot:
  // 1. Nike Court Vision Low
  // 2. Adidas Grand Court
  // 3. Puma Electrify Nitro
  // 4. Skechers Go Walk 6
  const featuredList = React.useMemo(() => {
    const priorityKeywords = ['Nike Court Vision', 'Adidas Grand Court', 'Puma Electrify', 'Skechers GO WALK', 'Skechers Go Walk'];
    const matched: Product[] = [];
    const remaining = [...products];

    priorityKeywords.forEach(keyword => {
      const idx = remaining.findIndex(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
      if (idx !== -1) {
        matched.push(remaining[idx]);
        remaining.splice(idx, 1);
      }
    });

    return [...matched, ...remaining].slice(0, 4);
  }, [products]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const variant = product.variants?.[0];
    if (!variant) return;
    onAddToCart(product, variant);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section 
      aria-label="Featured Collection"
      className="w-full bg-[#FAF9F6] pt-4 sm:pt-6 pb-12 sm:pb-16 border-b border-[#E6E3DE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: TRENDING NOW / Featured Collection + View All → */}
        <div className="flex items-baseline justify-between mb-5 sm:mb-6">
          <div>
            <span className="block text-[11px] sm:text-[12px] font-[800] tracking-[2.5px] uppercase text-[#C91920] mb-0.5">
              TRENDING NOW
            </span>
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-[800] text-[#102F4D] tracking-[-1px] leading-tight">
              Featured Collection
            </h2>
          </div>

          <button
            onClick={onViewAllClick}
            className="text-[12px] sm:text-[13px] md:text-[14px] font-[700] text-[#102F4D] hover:text-[#C91920] inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Product Cards Grid matching the reference screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5">
          {featuredList.map((product) => {
            const variant = product.variants?.[0] || ({} as ProductVariant);
            const sellingPrice = variant.sellingPrice || 3999;
            const mrp = variant.mrp || Math.round(sellingPrice * 1.25);
            const discountPercent = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
            const isWishlisted = wishlistIds.has(product.id);
            const isAdded = addedId === product.id;

            return (
              <article 
                key={product.id}
                onClick={() => onOpenDetails(product)}
                className="bg-white rounded-xl border border-[#E6E3DE] p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-[#102F4D]/30 transition-all duration-300 relative flex flex-col justify-between group cursor-pointer"
              >
                {/* Top Right Heart Wishlist Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-[#102F4D] hover:text-[#C91920] hover:bg-slate-50 transition-colors z-10 cursor-pointer"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  title="Wishlist"
                >
                  <Heart 
                    className={`h-4.5 w-4.5 transition-colors ${
                      isWishlisted ? 'fill-[#C91920] text-[#C91920]' : 'text-[#102F4D]/70'
                    }`} 
                  />
                </button>

                {/* Product Shoe Image */}
                <div className="w-full aspect-[4/3] flex items-center justify-center p-2 mb-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-106 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info Block: Name & Pricing */}
                <div className="flex flex-col mt-auto">
                  <h3 
                    className="font-[700] text-[13px] sm:text-[14px] text-[#17212B] group-hover:text-[#C91920] transition-colors line-clamp-1 mb-1"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                    <span className="text-[16px] sm:text-[17px] md:text-[18px] font-[800] text-[#102F4D] tracking-tight">
                      ₹{sellingPrice.toLocaleString('en-IN')}
                    </span>
                    {mrp > sellingPrice && (
                      <span className="text-[11px] sm:text-[12px] font-[400] text-[#6C747C] line-through">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-[#C91920] text-white text-[10px] font-[800] px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Full-width Navy Add to Cart Button */}
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className={`w-full py-2 sm:py-2.5 rounded-md font-[700] text-[12px] sm:text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#102F4D] hover:bg-[#183E5D] text-white active:scale-[0.98]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
