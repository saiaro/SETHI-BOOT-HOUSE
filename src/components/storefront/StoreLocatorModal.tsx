import React from 'react';
import { X, MapPin, Clock, Phone, Mail, Navigation, Store } from 'lucide-react';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E6E3DE] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E3DE] bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#102F4D]" />
            <h3 className="font-serif font-black text-lg text-[#102F4D] uppercase">
              Visit Sethi Boot House
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C747C] hover:text-[#102F4D] hover:bg-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="aspect-16/9 w-full rounded-lg overflow-hidden border border-[#E6E3DE] relative">
            <img
              src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=1000&auto=format&fit=crop&q=80"
              alt="Sethi Boot House Ratia Storefront"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 text-white">
              <div>
                <span className="bg-[#C91920] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  Flagship Showroom
                </span>
                <p className="font-serif font-black text-xl mt-1">SETHI BOOT HOUSE</p>
                <p className="text-xs text-white/90">Main Road, Near Bus Stand, Ratia (Haryana)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C91920] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#102F4D] block text-sm">Store Address</strong>
                  <p className="text-[#6C747C] mt-0.5">
                    Main Road, Near Bus Stand, Ratia, District Fatehabad, Haryana - 125051
                  </p>
                  <p className="text-[11px] text-[#102F4D] font-medium mt-1">
                    Landmark: Opposite City Park, 200m from Bus Stand
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[#102F4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#102F4D] block text-sm">Showroom Timings</strong>
                  <p className="text-[#6C747C] mt-0.5">Monday to Sunday: 9:30 AM – 9:00 PM</p>
                  <p className="text-emerald-700 font-bold mt-1">Open All 7 Days a Week</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#102F4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#102F4D] block text-sm">Phone Inquiries</strong>
                  <p className="text-[#6C747C] mt-0.5">+91 98960 12345</p>
                  <p className="text-[#6C747C]">Proprietor: Jonny Sethi</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-[#102F4D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#102F4D] block text-sm">Email Support</strong>
                  <p className="text-[#6C747C] mt-0.5">sethiboothouse.ratia@gmail.com</p>
                  <p className="text-[#6C747C]">GSTIN: 06AAAFS1234B1Z9</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://maps.google.com/?q=Ratia+Haryana"
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#102F4D] hover:bg-[#183E5D] text-white py-3 px-4 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              <span>Open in Google Maps</span>
            </a>

            <button
              onClick={onClose}
              className="bg-[#FAF9F6] border border-[#E6E3DE] hover:bg-slate-100 text-[#102F4D] py-3 px-6 rounded-md font-bold text-xs sm:text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
