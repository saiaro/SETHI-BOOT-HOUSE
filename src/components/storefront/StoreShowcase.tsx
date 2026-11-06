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
      className="w-full bg-[#FAF9F6] py-10 sm:py-16 md:py-20 border-b border-[#E6E3DE] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
          
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
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                <span className="bg-[#C91920] text-white text-[10px] font-[700] uppercase px-2 py-0.5 rounded-xs tracking-[1px]">
                  FLAGSHIP STORE
                </span>
                <p className="font-[700] text-[16px] sm:text-[18px] mt-0.5 sm:mt-1 leading-snug">
                  {businessName} • {city}
                </p>
                <p className="text-[11px] sm:text-[12px] font-[400] text-white/90">
                  Try every size • In-person foot measurement • Instant exchanges
                </p>
              </div>
            </div>

            {/* Corner Decorative Accent */}
            <div className="hidden sm:block absolute -top-3 -left-3 w-24 h-24 border-t-2 border-l-2 border-[#102F4D] -z-0 pointer-events-none" />
          </div>

          {/* Right Column: Editorial Copy & Store Details */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-5">
            
            <div className="inline-flex items-center gap-2 self-start">
              <span className="h-2 w-2 rounded-full bg-[#C91920]" />
              <span className="text-[11px] font-[700] uppercase tracking-[3px] text-[#C91920]">
                VISIT OUR STORE
              </span>
            </div>

            <h2 className="text-[clamp(28px,2.8vw,36px)] font-[700] leading-[1.15] tracking-[-1px] text-[#102F4D]">
              Experience It In Person.
            </h2>

            <p className="text-[14px] font-[400] leading-[1.55] text-[#6C747C]">
              Explore a wide range of footwear, try your favourite styles and get expert guidance from our footwear specialists. Experience authentic multi-brand collections in a welcoming, family-friendly atmosphere.
            </p>

            {/* Key In-Store Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-[#E6E3DE]">
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-[600] text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>Over 1,500+ Pairs in Stock</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-[600] text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>All UK Sizes (3 to 12)</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-[600] text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>Direct Warranty Support</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-[600] text-[#102F4D]">
                <CheckCircle2 className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>Same Central ERP Inventory</span>
              </div>
            </div>

            {/* Address & Hours Card */}
            <div className="bg-white border border-[#E6E3DE] rounded-lg p-4 sm:p-5 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#C91920] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-[700] text-[#102F4D]">{businessName}</p>
                  <p className="text-[12px] font-[500] text-[#6C747C]">{address}, {city}, {state}, India</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-[12px] font-[500] text-[#6C747C]">
                <Clock className="h-4 w-4 text-[#102F4D] shrink-0" />
                <span>Open 7 Days • 9:30 AM – 9:00 PM</span>
              </div>

              {phone && (
                <div className="flex items-center gap-2.5 text-[12px] font-[500] text-[#6C747C]">
                  <Phone className="h-4 w-4 text-[#102F4D] shrink-0" />
                  <span>Call Store: <strong className="text-[#102F4D] font-[700]">{phone}</strong></span>
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
