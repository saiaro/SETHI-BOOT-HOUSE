import React, { useState } from 'react';
import { Gift, Sparkles, MessageCircle, Send, Award, Cake } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';

export const MarketingView: React.FC = () => {
  const { customers, settings, updateSettings } = useStore();
  const { t } = useTranslation();

  const [pointsPer100, setPointsPer100] = useState(settings.loyaltyPointsPer100Rs || 1);
  const [promoMessage, setPromoMessage] = useState(
    'Special Weekend Footwear Offer at Sethi Boot House, Ratia! Buy any Campus or Sparx sports shoes and get flat 10% off. Visit us near Bus Stand, Ratia!'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveLoyalty = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ loyaltyPointsPer100Rs: pointsPer100 });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const broadcastWhatsApp = () => {
    const text = encodeURIComponent(promoMessage);
    // Open WhatsApp Web with prompt
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.marketingLoyalty}</h1>
        <p className="text-xs text-slate-500">
          Customer Loyalty Rewards, Membership Tiers &amp; WhatsApp Marketing Campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Loyalty Configuration */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="h-5 w-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Loyalty Rewards Program</h3>
              <p className="text-[11px] text-slate-500">Earn points on every shoe purchase</p>
            </div>
          </div>

          <form onSubmit={handleSaveLoyalty} className="space-y-3 text-xs">
            {saveSuccess && (
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded font-bold">
                ✓ Loyalty settings updated successfully!
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700">Points earned per ₹100 spent:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={pointsPer100}
                onChange={(e) => setPointsPer100(Number(e.target.value))}
                className="mt-1 w-full rounded border border-slate-300 py-1.5 px-3 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Currently: 1 Point = ₹1.00 discount on future bills.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <span className="font-bold text-slate-800">Customer Membership Tiers:</span>
              <p>• <strong>Bronze</strong>: 0 - 100 Points</p>
              <p>• <strong>Silver</strong>: 101 - 300 Points (Special Festive Gift)</p>
              <p>• <strong>Gold</strong>: 301 - 600 Points (Free Leather Polish + 5% Extra Off)</p>
              <p>• <strong>Platinum VIP</strong>: 600+ Points (Priority New Arrival Holds)</p>
            </div>

            <button
              type="submit"
              className="rounded bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
            >
              Save Loyalty Rules
            </button>
          </form>
        </div>

        {/* WhatsApp Promotional Campaign */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">WhatsApp Broadcast &amp; Offers</h3>
              <p className="text-[11px] text-slate-500">Send festive discount announcements to Ratia customers</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700">Campaign Message Text:</label>
              <textarea
                rows={4}
                value={promoMessage}
                onChange={(e) => setPromoMessage(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 p-2 text-xs"
              />
            </div>

            <div className="rounded bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-900">
              <span className="font-bold block">Preview on WhatsApp:</span>
              <p className="mt-1 italic text-[11px]">{promoMessage}</p>
            </div>

            <button
              onClick={broadcastWhatsApp}
              className="flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Launch WhatsApp Broadcast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
