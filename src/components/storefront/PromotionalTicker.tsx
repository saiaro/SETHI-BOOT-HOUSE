import React from 'react';

interface PromotionalTickerProps {
  messages?: string[];
}

const DEFAULT_MESSAGES = [
  'CELEBRATION SALE',
  'UP TO 50% OFF',
  'PRICE DROP ON SNEAKERS, SPORTS & MORE',
  'LIMITED TIME OFFERS',
  'EXPLORE NEW ARRIVALS',
  '100% ORIGINAL AUTHENTIC BRANDS',
  'SETHI BOOT HOUSE • RATIA FLAGSHIP'
];

export const PromotionalTicker: React.FC<PromotionalTickerProps> = ({
  messages = DEFAULT_MESSAGES
}) => {
  // Duplicate array so scrolling loop has zero blank gap
  const repeated = [...messages, ...messages, ...messages];

  return (
    <div 
      className="w-full bg-[#C91920] text-white overflow-hidden py-2 select-none border-b border-[#a8141a]"
      role="region"
      aria-label="Promotional ticker"
    >
      <div className="flex w-max animate-ticker-infinite hover:[animation-play-state:paused]">
        {repeated.map((msg, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="text-[13px] sm:text-[15px] font-[800] tracking-[0.2px] uppercase px-4 sm:px-6 whitespace-nowrap">
              {msg}
            </span>
            <span className="text-white/60 font-light text-[13px] sm:text-[15px] select-none" aria-hidden="true">
              |
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
