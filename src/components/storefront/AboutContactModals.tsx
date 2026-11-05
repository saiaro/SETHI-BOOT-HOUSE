import React from 'react';
import { X, ShieldCheck, Award, Heart, Phone, Mail, MapPin } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'contact' | null;
  onClose: () => void;
}

export const AboutContactModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#E6E3DE] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E3DE] bg-[#FAF9F6]">
          <h3 className="font-serif font-black text-lg text-[#102F4D] uppercase">
            {type === 'about' ? 'About Sethi Boot House' : 'Customer Support & Contact'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C747C] hover:text-[#102F4D] hover:bg-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 text-xs sm:text-sm text-[#17212B] leading-relaxed space-y-4">
          {type === 'about' ? (
            <>
              <p>
                Founded in 1998 in <strong>Ratia, Haryana</strong>, <strong>SETHI BOOT HOUSE</strong> has been a trusted family footwear destination for over two decades.
              </p>
              <p>
                Under the leadership of <strong>Jonny Sethi</strong>, our mission is to offer people in Ratia and across India access to 100% genuine, world-class athletic footwear, premium genuine leather formals, outdoor boots, and everyday comfort wear.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg">
                  <Award className="h-5 w-5 text-[#C91920] mb-1" />
                  <strong className="block text-[#102F4D]">Authorized Retailer</strong>
                  <span className="text-xs text-[#6C747C]">Direct brand partnerships</span>
                </div>
                <div className="p-3 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-[#102F4D] mb-1" />
                  <strong className="block text-[#102F4D]">Quality Guaranteed</strong>
                  <span className="text-xs text-[#6C747C]">Inspected before dispatch</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p>
                Have a question about shoe sizing, an order status, or a brand recommendation? Our footwear advisors are ready to assist you.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg">
                  <Phone className="h-5 w-5 text-[#C91920] shrink-0" />
                  <div>
                    <strong className="block text-[#102F4D]">Direct Phone & WhatsApp</strong>
                    <span className="text-xs text-[#6C747C]">+91 98960 12345 (9:30 AM to 9:00 PM)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg">
                  <Mail className="h-5 w-5 text-[#102F4D] shrink-0" />
                  <div>
                    <strong className="block text-[#102F4D]">Email Us</strong>
                    <span className="text-xs text-[#6C747C]">sethiboothouse.ratia@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#E6E3DE] rounded-lg">
                  <MapPin className="h-5 w-5 text-[#C91920] shrink-0" />
                  <div>
                    <strong className="block text-[#102F4D]">Store Showroom</strong>
                    <span className="text-xs text-[#6C747C]">Main Road, Near Bus Stand, Ratia, Haryana 125051</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-3">
            <button
              onClick={onClose}
              className="w-full bg-[#102F4D] hover:bg-[#183E5D] text-white py-2.5 px-4 rounded-md font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
