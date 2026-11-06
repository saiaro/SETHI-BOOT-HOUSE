import React from 'react';
import { Award, ArrowRight } from 'lucide-react';

interface BrandShowcaseProps {
  onSelectBrand: (brand: string) => void;
}

interface BrandItem {
  name: string;
  category: string;
  tagline: string;
  badge?: string;
}

const BRANDS: BrandItem[] = [
  { name: 'Nike', category: 'International', tagline: 'Court Vision & Air', badge: 'Global' },
  { name: 'Adidas', category: 'International', tagline: 'Grand Court & Boost', badge: 'Global' },
  { name: 'Puma', category: 'International', tagline: 'Nitro Foam & Speed', badge: 'Global' },
  { name: 'Skechers', category: 'International', tagline: 'Go Walk 6 & Arch Fit', badge: 'Comfort' },
  { name: 'Reebok', category: 'International', tagline: 'Floatride Energy', badge: 'Running' },
  { name: 'Red Chief', category: 'Premium Leather', tagline: 'Rough & Tough Nubuck', badge: 'Pure Leather' },
  { name: 'Campus', category: 'Sports & Active', tagline: 'Oxyfit & Memory Foam', badge: 'Athletic' },
  { name: 'Sparx', category: 'Everyday Casual', tagline: 'SM-734 & Lightweight', badge: 'Casual' },
  { name: 'Woodland', category: 'Outdoor & Trek', tagline: 'Pro-Trek Leather Boots', badge: 'Rugged' },
  { name: 'Bata', category: 'Heritage Classic', tagline: 'Executive Derby Formals', badge: 'Formal' },
  { name: 'Relaxo', category: 'Daily Comfort', tagline: 'Bahamas & Soft Slides', badge: 'Comfort' },
  { name: 'Paragon', category: 'Comfort & Ethnic', tagline: 'Soleplus & Ethnic Wedges', badge: 'Ethnic' }
];

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ onSelectBrand }) => {
  // Triple the array to ensure smooth infinite loop with zero blank gap
  const marqueeItems = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section 
      aria-label="Authorised Brands Showcase"
      className="w-full bg-[#FAF9F6] py-6 sm:py-8 border-b border-[#E6E3DE] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#C91920] shrink-0" />
            <h2 className="text-[11px] sm:text-[12px] font-[700] uppercase tracking-[3px] text-[#102F4D]">
              Top Brands Under One Roof
            </h2>
            <span className="hidden sm:inline text-[11px] text-[#6C747C]">•</span>
            <span className="hidden sm:inline text-[11px] font-[500] text-[#6C747C]">100% Genuine Authorized Footwear</span>
          </div>

          <span className="text-[11px] font-[600] text-[#C91920] flex items-center gap-1">
            <span>Tap any brand to explore</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Auto-Scrolling Brand Logos Strip */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge gradient fade overlays */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />

        {/* Animated Marquee Row */}
        <div className="flex w-max animate-brands-scroll py-1 select-none">
          {marqueeItems.map((brand, index) => (
            <button
              key={`${brand.name}-${index}`}
              onClick={() => onSelectBrand(brand.name)}
              className="group flex flex-col items-center justify-center mx-2 sm:mx-3 px-5 sm:px-6 py-3 bg-white border border-[#E6E3DE] rounded-lg hover:border-[#102F4D] hover:shadow-md transition-all duration-300 text-center cursor-pointer min-w-[140px] sm:min-w-[170px] shrink-0"
              title={`Explore all ${brand.name} footwear`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[14px] sm:text-[16px] font-[700] text-[#102F4D] group-hover:text-[#C91920] transition-colors tracking-tight uppercase">
                  {brand.name}
                </span>
                {brand.badge && (
                  <span className="text-[9px] font-[700] px-1.5 py-0.5 rounded bg-[#FAF9F6] group-hover:bg-[#EAF2F8] text-[#102F4D] border border-[#E6E3DE]">
                    {brand.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#6C747C] font-[600] uppercase tracking-wider">
                {brand.category}
              </span>
              <span className="text-[10px] text-[#102F4D]/70 font-[400] line-clamp-1">
                {brand.tagline}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
