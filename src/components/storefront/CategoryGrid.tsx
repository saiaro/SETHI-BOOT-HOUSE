import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

interface CategoryCardItem {
  id: string;
  name: string;
  subtitle: string;
  categoryQuery: string;
  imageUrl: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: 'cat-sneakers',
    name: 'Sneakers',
    subtitle: 'Lifestyle & Streetwear',
    categoryQuery: 'Sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-sports',
    name: 'Sports Shoes',
    subtitle: 'Running, Gym & Fitness',
    categoryQuery: 'Sports Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-casual',
    name: 'Casual Shoes',
    subtitle: 'Everyday Loafers & Slip-ons',
    categoryQuery: 'Casual Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-sandals',
    name: 'Sandals & Slippers',
    subtitle: 'Comfort Slides & Ethnic',
    categoryQuery: 'Sandals',
    imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-boots',
    name: 'Boots',
    subtitle: 'Nubuck & Leather Trekking',
    categoryQuery: 'Boots',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80'
  }
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section 
      aria-label="Shop Footwear by Category"
      className="w-full bg-[#FAF9F6] py-12 sm:py-16 border-b border-[#E6E3DE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#C91920] mb-1">
            CURATED COLLECTIONS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#102F4D] tracking-tight font-serif uppercase">
            SHOP BY CATEGORY
          </h2>
          <div className="w-12 h-0.5 bg-[#C91920] mx-auto mt-3" />
        </div>

        {/* 5-Column Responsive Grid: 5 on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.categoryQuery)}
              className="group flex flex-col bg-white border border-[#E6E3DE] rounded-lg p-3 sm:p-4 text-left hover:border-[#102F4D] hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative"
            >
              {/* Image Frame */}
              <div className="w-full aspect-square bg-[#FAF9F6] rounded-md overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:bg-[#EAF2F8] transition-colors">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Title & Arrow */}
              <div className="flex items-start justify-between gap-1 mt-auto">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#102F4D] group-hover:text-[#C91920] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#6C747C] font-normal leading-tight mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="p-1 rounded-full bg-[#FAF9F6] group-hover:bg-[#102F4D] text-[#102F4D] group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
