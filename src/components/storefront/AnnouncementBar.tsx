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
      className="w-full bg-[#F3EDE3] text-[#102F4D] border-b border-[#E6E3DE] py-2 px-3 text-[12px] sm:text-[13px] font-[600] tracking-[-0.2px] transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-1.5 sm:gap-2 overflow-hidden">
        <Truck className="h-3.5 w-3.5 text-[#C91920] shrink-0" aria-hidden="true" />
        
        {/* Desktop / Tablet message */}
        <span className="hidden md:inline font-[700] text-[#102F4D]">Special Offer:</span>
        <span className="hidden md:inline text-[#17212B] font-[600]">{message}</span>
        
        {/* Mobile / Small tablet compact message that fits cleanly */}
        <span className="md:hidden text-[#17212B] font-[600] truncate">
          Free Delivery on Orders Above ₹1,999
        </span>

        {ctaText && (
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-1 font-[700] text-[#C91920] hover:underline cursor-pointer shrink-0 text-[12px] sm:text-[13px] ml-1 tracking-[-0.2px]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
};
