import React from 'react';
import { ArrowRight, Award } from 'lucide-react';

interface BrandShowcaseProps {
  onSelectBrand: (brand: string) => void;
}

interface BrandItem {
  name: string;
  category: string;
  tagline: string;
}

const BRANDS: BrandItem[] = [
  { name: 'Nike', category: 'International', tagline: 'Court Vision & Air Force' },
  { name: 'Adidas', category: 'International', tagline: 'Grand Court & Ultraboost' },
  { name: 'Puma', category: 'International', tagline: 'Nitro Foam & Smash V2' },
  { name: 'Skechers', category: 'International', tagline: 'Go Walk 6 & Arch Fit' },
  { name: 'Reebok', category: 'International', tagline: 'Floatride & Classic' },
  { name: 'Red Chief', category: 'Premium Leather', tagline: 'Rough & Tough Nubuck' },
  { name: 'Campus', category: 'Sports & Active', tagline: 'Oxyfit & Memory Foam' },
  { name: 'Sparx', category: 'Everyday Casual', tagline: 'SM-734 & Lightweight' },
  { name: 'Woodland', category: 'Outdoor & Trek', tagline: 'Pro-Trek Leather Boots' },
  { name: 'Bata', category: 'Heritage Classic', tagline: 'Executive Derby & Comfit' },
  { name: 'Relaxo', category: 'Daily Comfort', tagline: 'Bahamas & Flite' },
  { name: 'Paragon', category: 'Comfort & Ethnic', tagline: 'Soleplus & Wedges' }
];

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ onSelectBrand }) => {
  return (
    <section 
      aria-label="Brand Showcase"
      className="w-full bg-[#FAF9F6] py-14 sm:py-20 border-b border-[#E6E3DE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#C91920] mb-1">
            <Award className="h-4 w-4" />
            <span>100% AUTHORISED RETAILER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102F4D] tracking-tight font-serif uppercase">
            Top Brands Under One Roof.
          </h2>
          <p className="text-xs sm:text-sm text-[#6C747C] mt-2 font-normal">
            Bringing the world’s leading athletic, casual, and genuine leather brands directly to Ratia, Haryana.
          </p>
        </div>

        {/* Brands Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {BRANDS.map((brand) => (
            <button
              key={brand.name}
              onClick={() => onSelectBrand(brand.name)}
              className="group flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-[#E6E3DE] rounded-lg hover:border-[#102F4D] hover:shadow-md transition-all duration-300 text-center cursor-pointer min-h-[110px]"
            >
              <span className="text-base sm:text-lg font-black text-[#102F4D] group-hover:text-[#C91920] transition-colors tracking-tight font-serif">
                {brand.name}
              </span>
              <span className="text-[10px] text-[#6C747C] font-semibold mt-1 uppercase tracking-wider">
                {brand.category}
              </span>
              <span className="text-[10px] text-[#102F4D]/70 font-normal line-clamp-1 mt-0.5">
                {brand.tagline}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
