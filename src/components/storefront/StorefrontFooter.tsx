import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';

interface StorefrontFooterProps {
  onOpenStoreLocator: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onSelectCategory: (category: string) => void;
}

export const StorefrontFooter: React.FC<StorefrontFooterProps> = ({
  onOpenStoreLocator,
  onOpenAbout,
  onOpenContact,
  onSelectCategory
}) => {
  return (
    <footer className="w-full bg-[#102F4D] text-white pt-16 pb-12 border-t-4 border-[#C91920]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission (Col 1 & 2 on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-2xl font-black tracking-tight text-white uppercase font-serif">
                SETHI BOOT HOUSE
              </span>
              <p className="text-xs text-[#EAF2F8]/70 uppercase tracking-widest font-semibold mt-0.5">
                Ratia, Fatehabad, Haryana • Est. 1998
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-sm">
              Ratia’s premier multi-brand footwear destination. Authorized retailer for genuine Nike, Adidas, Puma, Skechers, Red Chief, Woodland, Campus and authentic Indian leather shoes.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#C91920] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#C91920] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#C91920] flex items-center justify-center text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#EAF2F8] border-b border-white/10 pb-2">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button 
                  onClick={() => onSelectCategory('Sneakers')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sneakers & Streetwear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Sports Shoes')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sports & Running
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Casual Shoes')}
                  className="hover:text-white transition-colors text-left"
                >
                  Casual Walking Shoes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Boots')}
                  className="hover:text-white transition-colors text-left"
                >
                  Nubuck & Leather Boots
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Sandals')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sandals & Slippers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#EAF2F8] border-b border-white/10 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={onOpenStoreLocator} className="hover:text-white transition-colors text-left">
                  Store Location
                </button>
              </li>
              <li>
                <span className="text-slate-400">Shipping Policy (Pan-India)</span>
              </li>
              <li>
                <span className="text-slate-400">Easy Returns & Exchanges</span>
              </li>
              <li>
                <span className="text-slate-400">Terms & Conditions</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Physical Store Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#EAF2F8] border-b border-white/10 pb-2">
              Visit Store
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C91920] shrink-0 mt-0.5" />
                <span>Main Road, Near Bus Stand, Ratia, Haryana 125051</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>+91 98960 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C91920] shrink-0" />
                <span>sethiboothouse.ratia@gmail.com</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenStoreLocator}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded text-center transition-colors border border-white/10"
                >
                  Get Directions in Ratia →
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Verified Trust */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>© 2027 SETHI BOOT HOUSE. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ratia, Fatehabad, Haryana, India.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Genuine Brands</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-blue-400" />
              <span>UPI & Cash on Delivery Accepted</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
