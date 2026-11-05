import React from 'react';
import { Truck, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  message?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = 'Free Delivery on Orders Above ₹1,999 | Add Sneaker Wipes – Pack of 12 & Get ₹500 Shipping Waived Off',
  ctaText = 'Shop Now',
  onCtaClick
}) => {
  return (
    <aside 
      aria-label="Promotional Announcement"
      className="w-full bg-[#F3EDE3] text-[#102F4D] border-b border-[#E6E3DE] py-2 px-3 text-xs md:text-sm font-medium tracking-wide transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-semibold text-[#102F4D]">
          <Truck className="h-3.5 w-3.5 text-[#C91920] shrink-0" aria-hidden="true" />
          <span>Special Offer:</span>
        </span>
        <span className="text-[#17212B] text-xs md:text-sm">{message}</span>
        {ctaText && (
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-1 font-bold text-[#C91920] hover:underline cursor-pointer ml-1 text-xs md:text-sm shrink-0"
          >
            <span>{ctaText}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
};
