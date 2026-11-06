import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

interface BenefitItem {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description: 'Across India & express delivery in Haryana'
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Products',
    description: '100% Authentic Brands directly sourced'
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns & Exchange',
    description: 'Hassle-Free Process online or in Ratia store'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: "We're Here to Help • Direct WhatsApp assistance"
  }
];

export const BenefitsSection: React.FC = () => {
  return (
    <section 
      aria-label="Customer Benefits & Assurance"
      className="w-full bg-white py-10 sm:py-14 border-b border-[#E6E3DE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E6E3DE]">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className={`flex items-start gap-4 ${index !== 0 ? 'pt-5 sm:pt-0 sm:pl-6' : ''}`}
              >
                <div className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E6E3DE] text-[#C91920] shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[12px] font-[700] text-[#102F4D] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-[400] text-[#6C747C] mt-0.5 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
