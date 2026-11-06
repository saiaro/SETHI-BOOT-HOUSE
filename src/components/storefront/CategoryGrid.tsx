import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

interface CategoryCardItem {
  id: string;
  name: string;
  categoryQuery: string;
  imageUrl: string;
  bgColor: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: 'cat-sneakers',
    name: 'Sneakers',
    categoryQuery: 'Sneakers',
    imageUrl: '/assets/aistudio/cat_shoe_sneakers.png',
    bgColor: 'bg-[#E3EDF6]'
  },
  {
    id: 'cat-sports',
    name: 'Sports Shoes',
    categoryQuery: 'Sports Shoes',
    imageUrl: '/assets/aistudio/cat_shoe_sports.png',
    bgColor: 'bg-[#E3EDF6]'
  },
  {
    id: 'cat-casual',
    name: 'Casual Shoes',
    categoryQuery: 'Casual Shoes',
    imageUrl: '/assets/aistudio/cat_shoe_casual.png',
    bgColor: 'bg-[#F7EFE4]'
  },
  {
    id: 'cat-sandals',
    name: 'Sandals & Slippers',
    categoryQuery: 'Sandals',
    imageUrl: '/assets/aistudio/cat_shoe_sandals.png',
    bgColor: 'bg-[#F5F2EB]'
  },
  {
    id: 'cat-boots',
    name: 'Boots',
    categoryQuery: 'Boots',
    imageUrl: '/assets/aistudio/cat_shoe_boots.png',
    bgColor: 'bg-[#ECECE9]'
  }
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section 
      aria-label="Shop Footwear by Category"
      className="w-full bg-[#FAF9F6] pt-8 sm:pt-12 pb-6 sm:pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Editorial Header: — SHOP BY CATEGORY — */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5 sm:mb-7">
          <span className="w-10 sm:w-16 md:w-20 h-[1.5px] bg-[#102F4D]/40 rounded-full" />
          <h2 className="text-[12px] sm:text-[14px] md:text-[15px] font-[800] tracking-[2.5px] sm:tracking-[3.5px] text-[#102F4D] uppercase select-none">
            SHOP BY CATEGORY
          </h2>
          <span className="w-10 sm:w-16 md:w-20 h-[1.5px] bg-[#102F4D]/40 rounded-full" />
        </div>

        {/* 5 Distinct Category Cards Grid: 5 columns on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.categoryQuery)}
              className={`group flex flex-col justify-between ${cat.bgColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer overflow-hidden border border-black/5 relative`}
              title={`Explore ${cat.name}`}
            >
              {/* Centered Shoe Visual */}
              <div className="w-full aspect-[4/3] flex items-center justify-center p-1 sm:p-2 mb-1">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-106 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Title & Circular Arrow Row */}
              <div className="flex items-center justify-between gap-1 mt-auto pt-1">
                <span className="font-[700] text-[12px] sm:text-[13px] md:text-[14px] text-[#102F4D] leading-tight">
                  {cat.name}
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#102F4D]/50 flex items-center justify-center text-[#102F4D] group-hover:bg-[#102F4D] group-hover:text-white transition-all shrink-0">
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
