import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
  onExploreSportsClick: () => void;
}

interface Slide {
  id: number;
  smallHeading: string;
  mainHeading: string;
  supportingCopy: string;
  ctaText: string;
  tag: string;
  imageUrl: string;
  badgeText: string;
  action: 'shop' | 'sports';
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    smallHeading: 'PREMIUM FOOTWEAR COLLECTION',
    mainHeading: 'Step Into Luxury.',
    supportingCopy: 'Iconic styles. Everyday comfort. For the entire family. Discover authentic global & Indian footwear at Ratia’s premier showroom.',
    ctaText: 'Shop Collection',
    tag: 'NEW ARRIVALS 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
    badgeText: '100% Authentic Brands',
    action: 'shop'
  },
  {
    id: 2,
    smallHeading: 'HIGH-PERFORMANCE RUNNING & TRAINING',
    mainHeading: 'Engineered For Pure Speed.',
    supportingCopy: 'Experience revolutionary rebound cushioning, lightweight breathable mesh and unshakeable grip with Nike, Puma Nitro & Campus.',
    ctaText: 'Explore Sports Shoes',
    tag: 'SPORTS & MARATHON',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=85',
    badgeText: 'Nitro Foam Cushioning',
    action: 'sports'
  },
  {
    id: 3,
    smallHeading: 'HANDCRAFTED LEATHER HERITAGE',
    mainHeading: 'Timeless Leather Craft.',
    supportingCopy: 'Executive Derby formals, genuine nubuck boots, and hand-finished footwear built to command every room.',
    ctaText: 'Explore Boots & Formals',
    tag: 'GENUINE LEATHER',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=85',
    badgeText: 'Pure Nubuck Leather',
    action: 'shop'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onExploreSportsClick
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlideIndex];

  const handleCta = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Column: Text & Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6 z-10">
            
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 self-start">
              <span className="h-2 w-2 rounded-full bg-[#C91920]" />
              <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#102F4D] uppercase">
                {slide.smallHeading}
              </span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#102F4D] tracking-tight leading-[1.08] font-serif">
              {slide.mainHeading}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#6C747C] leading-relaxed max-w-xl font-normal">
              {slide.supportingCopy}
            </p>

            {/* CTAs and Quality Guarantee */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleCta}
                className="inline-flex items-center gap-2.5 bg-[#102F4D] hover:bg-[#183E5D] text-white px-7 py-3.5 rounded-md font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#102F4D] bg-[#F3EDE3] px-3.5 py-2.5 rounded-md border border-[#E6E3DE]">
                <ShieldCheck className="h-4 w-4 text-[#C91920]" />
                <span>{slide.badgeText}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Visual with Studio Lighting Aesthetic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Soft Ambient Glow Circle */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#EAF2F8] -z-0 blur-xl opacity-80" />

            {/* Floating Tag */}
            <div className="absolute top-2 right-4 z-20 bg-white/95 backdrop-blur-xs border border-[#E6E3DE] px-3 py-1.5 rounded-md shadow-xs text-xs font-bold text-[#102F4D] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#C91920]" />
              <span>{slide.tag}</span>
            </div>

            {/* Shoe Product Image Container */}
            <div className="relative z-10 w-full max-w-md aspect-4/3 flex items-center justify-center p-4">
              <img
                key={slide.id}
                src={slide.imageUrl}
                alt={slide.mainHeading}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-700 ease-out transform hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Carousel Navigation Buttons & Indicators (Bottom Right) */}
            <div className="absolute -bottom-4 sm:bottom-0 right-2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-[#E6E3DE] p-1.5 rounded-md shadow-xs">
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="p-1.5 hover:bg-[#FAF9F6] text-[#102F4D] rounded cursor-pointer"
                aria-label="Previous Hero Slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 px-1">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentSlideIndex 
                        ? 'w-6 bg-[#102F4D]' 
                        : 'w-2 bg-[#E6E3DE] hover:bg-[#6C747C]'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-1.5 hover:bg-[#FAF9F6] text-[#102F4D] rounded cursor-pointer"
                aria-label="Next Hero Slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
