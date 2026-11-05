import React, { useState } from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onViewAllClick: () => void;
}

const TABS = [
  { id: 'all', label: 'All Trending' },
  { id: 'Sneakers', label: 'Sneakers' },
  { id: 'Sports Shoes', label: 'Sports & Running' },
  { id: 'Casual Shoes', label: 'Casual Wear' },
  { id: 'Boots', label: 'Leather Boots' }
];

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onOpenDetails,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onViewAllClick
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const filteredProducts = products.filter(p => {
    if (activeCategoryTab === 'all') return true;
    return p.category === activeCategoryTab;
  });

  return (
    <section 
      aria-label="Featured Collection"
      className="w-full bg-white py-14 sm:py-20 border-b border-[#E6E3DE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block: Subtitle + Title + Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#C91920] mb-1">
              <Flame className="h-4 w-4" />
              <span>TRENDING NOW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#102F4D] tracking-tight font-serif">
              Featured Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#6C747C] mt-1 font-normal">
              Most requested pairs from international and premium Indian footwear brands
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryTab === tab.id
                    ? 'bg-[#102F4D] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#6C747C] hover:text-[#102F4D] hover:bg-[#EAF2F8] border border-[#E6E3DE]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: 4 columns on large desktop, 3 on tablet/desktop, 2 on mobile */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF9F6] rounded-lg border border-[#E6E3DE]">
            <p className="text-sm font-semibold text-[#6C747C]">No footwear found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenDetails}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.has(product.id)}
              />
            ))}
          </div>
        )}

        {/* View All CTA Link at the bottom */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 border-2 border-[#102F4D] text-[#102F4D] hover:bg-[#102F4D] hover:text-white px-8 py-3 rounded-md font-bold text-sm tracking-wide transition-all shadow-xs cursor-pointer group"
          >
            <span>View All Footwear ({products.length} Models)</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
