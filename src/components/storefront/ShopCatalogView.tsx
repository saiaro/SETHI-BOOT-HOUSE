import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';
import { ProductCard } from './ProductCard';

interface ShopCatalogViewProps {
  products: Product[];
  initialCategory?: string;
  initialGender?: string;
  initialBrand?: string;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  pageTitle?: string;
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products,
  initialCategory = 'all',
  initialGender = 'all',
  initialBrand = 'all',
  onOpenDetails,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  pageTitle
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'discount'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['all', 'Sneakers', 'Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals', 'Boots'];
  const genders = ['all', 'Men', 'Women', 'Kids', 'Unisex'];
  const brands = [
    'all', 'Nike', 'Adidas', 'Puma', 'Skechers', 'Reebok', 
    'Red Chief', 'Campus', 'Sparx', 'Woodland', 'Bata', 'Relaxo', 'Paragon'
  ];
  const sizes = ['all', '5', '6', '7', '8', '9', '10', '11'];

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (selectedSize !== 'all' && !p.variants.some(v => v.size === selectedSize && v.stockQuantity > 0)) return false;
      return true;
    });

    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => (a.variants[0]?.sellingPrice || 0) - (b.variants[0]?.sellingPrice || 0));
        break;
      case 'price_high':
        result.sort((a, b) => (b.variants[0]?.sellingPrice || 0) - (a.variants[0]?.sellingPrice || 0));
        break;
      case 'discount':
        result.sort((a, b) => {
          const discA = ((a.variants[0]?.mrp - a.variants[0]?.sellingPrice) / a.variants[0]?.mrp) || 0;
          const discB = ((b.variants[0]?.mrp - b.variants[0]?.sellingPrice) / b.variants[0]?.mrp) || 0;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, selectedGender, selectedBrand, selectedSize, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedGender !== 'all' || selectedBrand !== 'all' || selectedSize !== 'all';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedBrand('all');
    setSelectedSize('all');
  };

  return (
    <div className="w-full bg-[#FAF9F6] py-8 sm:py-12 border-b border-[#E6E3DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E6E3DE]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102F4D] font-serif uppercase tracking-tight">
              {pageTitle || 'All Footwear Collection'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6C747C] mt-1 font-normal">
              Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'} from Sethi Boot House inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6E3DE] rounded-md text-xs font-bold text-[#102F4D]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-[#E6E3DE] rounded-md px-3 py-1.5 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#6C747C]" />
              <label htmlFor="sortSelect" className="text-[#6C747C] font-semibold">Sort:</label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-[#102F4D] focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured / Trending</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="discount">Biggest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Left Sidebar Filters + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:col-span-1 bg-white border border-[#E6E3DE] rounded-lg p-5 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DE]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#102F4D]" />
                <span className="font-bold text-sm text-[#102F4D] uppercase">Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#C91920] font-bold hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102F4D] mb-2.5">
                Category
              </h3>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCategory === c
                        ? 'bg-[#102F4D] text-white'
                        : 'text-[#17212B] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>{c === 'all' ? 'All Categories' : c}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Gender */}
            <div className="pt-4 border-t border-[#E6E3DE]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102F4D] mb-2.5">
                Department
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 px-2 text-center rounded text-xs font-semibold border transition-colors ${
                      selectedGender === g
                        ? 'bg-[#102F4D] text-white border-[#102F4D]'
                        : 'bg-white text-[#17212B] border-[#E6E3DE] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="pt-4 border-t border-[#E6E3DE]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102F4D] mb-2.5">
                Brand
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedBrand === b
                        ? 'bg-[#102F4D] text-white'
                        : 'text-[#17212B] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>{b === 'all' ? 'All Brands' : b}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UK Sizes */}
            <div className="pt-4 border-t border-[#E6E3DE]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102F4D] mb-2.5">
                UK Shoe Size
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-1 px-1.5 text-center rounded text-xs font-bold border transition-colors ${
                      selectedSize === s
                        ? 'bg-[#102F4D] text-white border-[#102F4D]'
                        : 'bg-white text-[#17212B] border-[#E6E3DE] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {s === 'all' ? 'All' : `UK ${s}`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filtered.length === 0 ? (
              <div className="bg-white border border-[#E6E3DE] rounded-lg p-12 text-center space-y-3">
                <Tag className="h-10 w-10 text-[#6C747C] mx-auto" />
                <h3 className="font-serif font-black text-lg text-[#102F4D]">
                  No footwear matches your selected filter criteria
                </h3>
                <p className="text-xs text-[#6C747C]">
                  Try clearing some filters or searching across other brands.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#102F4D] text-white px-5 py-2 rounded-md font-bold text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
                {filtered.map((product) => (
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
          </div>

        </div>

      </div>
    </div>
  );
};
