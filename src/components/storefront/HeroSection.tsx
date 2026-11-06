import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
  onExploreSportsClick: () => void;
}

interface Slide {
  id: number;
  smallHeading: string;
  mainHeadingLine1: string;
  mainHeadingEmphasis: string;
  supportingLine1: string;
  supportingLine2: string;
  ctaText: string;
  imageUrl?: string;
  bannerImage?: string;
  action: 'shop' | 'sports';
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    smallHeading: 'PREMIUM FOOTWEAR COLLECTION',
    mainHeadingLine1: 'Step Into',
    mainHeadingEmphasis: 'Luxury.',
    supportingLine1: 'Iconic styles. Everyday comfort.',
    supportingLine2: 'For the entire family.',
    ctaText: 'Shop Collection',
    bannerImage: '/assets/aistudio/image_7067c491.png',
    action: 'shop'
  },
  {
    id: 2,
    smallHeading: 'HIGH-PERFORMANCE RUNNING & TRAINING',
    mainHeadingLine1: 'Engineered For',
    mainHeadingEmphasis: 'Pure Speed.',
    supportingLine1: 'Revolutionary cushioning. Unshakeable grip.',
    supportingLine2: 'For marathon runners & everyday fitness.',
    ctaText: 'Explore Sports Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=85',
    action: 'sports'
  },
  {
    id: 3,
    smallHeading: 'HANDCRAFTED LEATHER HERITAGE',
    mainHeadingLine1: 'Timeless',
    mainHeadingEmphasis: 'Leather Craft.',
    supportingLine1: 'Executive Derby formals & rugged nubuck boots.',
    supportingLine2: 'Built to command every room.',
    ctaText: 'Explore Boots & Formals',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=85',
    action: 'shop'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onExploreSportsClick
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlideIndex];

  const handleCta = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (slide.action === 'sports') {
      onExploreSportsClick();
    } else {
      onShopClick();
    }
  };

  return (
    <section 
      aria-label="Featured Hero Presentation"
      className="relative w-full bg-[#FAF9F6] border-b border-[#E6E3DE] overflow-hidden"
    >
      {/* Top Red Accent Stripe (matching the reference image top border) */}
      <div className="w-full h-[2.5px] bg-[#C91920]" />

      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-3 md:py-4">
        <div className="relative w-full overflow-hidden sm:rounded-lg border-b sm:border border-[#E6E3DE] shadow-xs">
          
          {/* SLIDE 1: Exact Master Reference Banner from User Attachment */}
          {slide.id === 1 ? (
            <div 
              onClick={() => handleCta()}
              className="relative w-full aspect-[724/247] min-h-[160px] sm:min-h-[220px] md:min-h-[300px] lg:min-h-[380px] cursor-pointer group select-none overflow-hidden bg-[#FAF9F6]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCta();
                }
              }}
              aria-label="Step Into Luxury - Shop Collection"
            >
              {/* High-fidelity banner image matching the user screenshot */}
              <picture>
                <source srcSet="/assets/aistudio/hero_banner_2x.png" media="(min-width: 640px)" />
                <img
                  src="/assets/aistudio/image_7067c491.png"
                  alt="Step Into Luxury. Iconic styles. Everyday comfort. For the entire family."
                  className="w-full h-full object-cover sm:object-contain md:object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  loading="eager"
                />
              </picture>

              {/* Interactive CTA overlay button positioned exactly over the red button */}
              <button
                onClick={(e) => handleCta(e)}
                className="absolute left-[5.1%] top-[76.5%] w-[20%] h-[12.2%] min-w-[90px] min-h-[24px] sm:min-w-[140px] sm:min-h-[32px] rounded-md opacity-0 hover:opacity-20 active:opacity-30 bg-white transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C91920]/70"
                title="Shop Collection"
                aria-label="Shop Collection"
              >
                <span className="sr-only">Shop Collection</span>
              </button>

              {/* Interactive bottom-right carousel dots overlaid over the 3 banner dots */}
              <div 
                className="absolute right-[3.5%] bottom-[5.5%] z-20 flex items-center gap-1.5 sm:gap-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className="p-1 sm:p-1.5 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`Switch to slide ${i + 1}`}
                  >
                    <span 
                      className={`block rounded-full transition-all duration-300 ${
                        i === currentSlideIndex
                          ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#C91920] shadow-xs'
                          : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-white/70 shadow-xs'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* SLIDES 2 & 3: Rendered with identical typography, spacing and visual composition */
            <div 
              onClick={() => handleCta()}
              className="relative w-full aspect-[724/247] min-h-[160px] sm:min-h-[220px] md:min-h-[300px] lg:min-h-[380px] bg-gradient-to-r from-[#FFFFFF] via-[#F4F8FC] to-[#E8F1F8] cursor-pointer group select-none overflow-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCta();
                }
              }}
              aria-label={`${slide.mainHeadingLine1} ${slide.mainHeadingEmphasis}`}
            >
              <div className="w-full h-full flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-14 relative z-10">
                
                {/* Left Column: Text & Red CTA Button */}
                <div className="w-[58%] sm:w-[54%] md:w-[50%] flex flex-col justify-center space-y-1.5 sm:space-y-3 md:space-y-4">
                  {/* Eyebrow Label */}
                  <span className="text-[9px] sm:text-[11px] md:text-[12px] font-[700] tracking-[2.5px] sm:tracking-[3.5px] text-[#102F4D] uppercase">
                    {slide.smallHeading}
                  </span>

                  {/* Main Editorial Heading */}
                  <h1 className="text-[20px] sm:text-[34px] md:text-[46px] lg:text-[56px] font-[700] text-[#102F4D] tracking-[-1.5px] leading-[1.02]">
                    {slide.mainHeadingLine1}{' '}
                    <span className="font-[800] italic text-[#C91920] block sm:inline">
                      {slide.mainHeadingEmphasis}
                    </span>
                  </h1>

                  {/* Subtitle Description */}
                  <p className="text-[11px] sm:text-[13px] md:text-[15px] text-[#17212B] leading-[1.35] sm:leading-[1.45] font-[400]">
                    {slide.supportingLine1}
                    <br className="hidden sm:inline" />
                    {' '}{slide.supportingLine2}
                  </p>

                  {/* Red CTA Button */}
                  <div className="pt-0.5 sm:pt-1">
                    <button
                      onClick={(e) => handleCta(e)}
                      className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#C91920] hover:bg-[#A8141A] text-white px-3.5 sm:px-5 md:px-6 py-1.5 sm:py-2.5 md:py-3 rounded-md font-[700] text-[11px] sm:text-[13px] md:text-[14px] shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Column: High Quality Footwear Visual */}
                <div className="w-[42%] sm:w-[46%] md:w-[50%] h-full flex items-center justify-center p-2 sm:p-4">
                  <img
                    src={slide.imageUrl}
                    alt={slide.mainHeadingEmphasis}
                    className="max-h-[85%] max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                </div>

              </div>

              {/* Bottom Right Carousel Dots */}
              <div 
                className="absolute right-[3.5%] bottom-[5.5%] z-20 flex items-center gap-1.5 sm:gap-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className="p-1 sm:p-1.5 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`Switch to slide ${i + 1}`}
                  >
                    <span 
                      className={`block rounded-full transition-all duration-300 ${
                        i === currentSlideIndex
                          ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#C91920] shadow-xs'
                          : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-slate-300 shadow-xs'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
