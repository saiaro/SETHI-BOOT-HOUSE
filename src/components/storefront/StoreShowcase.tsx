import React from 'react';
import { MapPin, Clock, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StoreShowcaseProps {
  onFindStoreClick: () => void;
  businessName?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
}

export const StoreShowcase: React.FC<StoreShowcaseProps> = ({
  onFindStoreClick,
  businessName = 'SETHI BOOT HOUSE',
  city = 'Ratia',
  state = 'Haryana',
  address = 'Main Road, Near Bus Stand',
  phone = '+91 98960 12345'
}) => {
  return (
    <section 
      aria-label="Physical Retail Store Showcase"
      className="w-full bg-[#FAF9F6] py-14 sm:py-20 border-b border-[#E6E3DE] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Large Store Interior Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden border border-[#E6E3DE] shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=1200&auto=format&fit=crop&q=85"
                alt="Sethi Boot House Retail Showroom Interior in Ratia"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Badge on Store Photograph */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-[#C91920] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xs tracking-wider">
                  FLAGSHIP STORE
                </span>
                <p className="font-serif font-black text-lg sm:text-xl mt-1 leading-snug">
                  {businessName} • {city}
                </p>
                <p className="text-xs text-white/90">
                  Try every size • In-person foot measurement • Instant exchanges
                </p>
              </div>
            </div>

            {/* Corner Decorative Accent */}
            <div className="hidden sm:block absolute -top-3 -left-3 w-24 h-24 border-t-2 border-l-2 border-[#102F4D] -z-0 pointer-events-none" />
          </div>

          {/* Right Column: Editorial Copy & Store Details */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            
            <div className="inline-flex items-center gap-2 self-start">
              <span className="h-2 w-2 rounded-full bg-[#C91920]" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#102F4D]">
                VISIT OUR STORE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#102F4D] tracking-tight font-serif leading-tight">
              Experience It In Person.
            </h2>

            <p className="text-base sm:text-lg text-[#6C747C] leading-relaxed font-normal">
              Explore a wide range of footwear, try your favourite styles and get expert guidance from our footwear specialists. Experience authentic multi-brand collections in a welcoming, family-friendly atmosphere.
            </p>

            {/* Key In-Store Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-[#E6E3DE]">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>Over 1,500+ Pairs in Stock</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>All UK Sizes (3 to 12)</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>Direct Warranty Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>Same Central ERP Inventory</span>
              </div>
            </div>

            {/* Address & Hours Card */}
            <div className="bg-white border border-[#E6E3DE] rounded-lg p-4 sm:p-5 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#C91920] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#102F4D]">{businessName}</p>
                  <p className="text-xs text-[#6C747C]">{address}, {city}, {state}, India</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#6C747C]">
                <Clock className="h-4 w-4 text-[#102F4D] shrink-0" />
                <span>Open 7 Days • 9:30 AM – 9:00 PM</span>
              </div>

              {phone && (
                <div className="flex items-center gap-2.5 text-xs text-[#6C747C]">
                  <Phone className="h-4 w-4 text-[#102F4D] shrink-0" />
                  <span>Call Store: <strong className="text-[#102F4D]">{phone}</strong></span>
                </div>
              )}
            </div>

            {/* Find Store CTA */}
            <div className="pt-2">
              <button
                onClick={onFindStoreClick}
                className="inline-flex items-center gap-2 bg-[#102F4D] hover:bg-[#183E5D] text-white px-7 py-3.5 rounded-md font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <span>Find Our Store</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
