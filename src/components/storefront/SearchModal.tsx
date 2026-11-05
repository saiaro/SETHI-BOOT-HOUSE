import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/database';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenDetails: (product: Product) => void;
}

const QUICK_TAGS = [
  'Nike',
  'Sneakers',
  'Running',
  'Sports Shoes',
  'Red Chief Boots',
  'Campus',
  'Skechers',
  'Bata Formals'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onOpenDetails
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const searchResults = trimmed
    ? products.filter(p => {
        return (
          p.name.toLowerCase().includes(trimmed) ||
          p.brand.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.gender.toLowerCase().includes(trimmed) ||
          p.variants.some(v => v.size === trimmed || v.color.toLowerCase().includes(trimmed))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
      <div 
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#E6E3DE] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E6E3DE] flex items-center gap-3 bg-[#FAF9F6]">
          <Search className="h-5 w-5 text-[#102F4D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search footwear by brand, style (e.g. Nike Court Vision, Puma Nitro, Size 8)..."
            className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#102F4D] placeholder:text-[#6C747C] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#6C747C] hover:text-[#102F4D] p-1 font-bold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C747C] hover:text-[#102F4D] hover:bg-slate-200 cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="px-5 py-3 bg-white border-b border-[#E6E3DE] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-[#6C747C] uppercase tracking-wider shrink-0">
            Popular:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 text-xs font-semibold bg-[#FAF9F6] hover:bg-[#EAF2F8] text-[#102F4D] rounded-full border border-[#E6E3DE] whitespace-nowrap cursor-pointer transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {trimmed ? (
            searchResults.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-sm font-bold text-[#102F4D]">
                  No footwear matched "{query}"
                </p>
                <p className="text-xs text-[#6C747C]">
                  Try searching for general terms like "Sports Shoes", "Nike", "Boots", or "Bata".
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-[#6C747C] mb-3">
                  Found {searchResults.length} {searchResults.length === 1 ? 'pair' : 'pairs'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((product) => {
                    const defaultVar = product.variants?.[0];
                    const price = defaultVar?.sellingPrice || 0;
                    const mrp = defaultVar?.mrp || price;

                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          onOpenDetails(product);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg hover:border-[#102F4D] hover:bg-white transition-all cursor-pointer group"
                      >
                        <div className="h-16 w-16 bg-white border border-[#E6E3DE] rounded p-1 flex items-center justify-center shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-extrabold uppercase text-[#6C747C]">
                            {product.brand}
                          </p>
                          <h4 className="text-xs sm:text-sm font-bold text-[#102F4D] group-hover:text-[#C91920] transition-colors truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
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

                        <ArrowRight className="h-4 w-4 text-[#6C747C] group-hover:text-[#102F4D] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-[#102F4D]">
                Search over 1,500+ pairs in Sethi Boot House inventory
              </p>
              <p className="text-xs text-[#6C747C]">
                Type shoe model, brand, footwear category, or specific UK size above.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
