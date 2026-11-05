import React from 'react';
import { Receipt, ShoppingCart, Package, Users, Menu } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from '../../i18n/LanguageContext';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeModule, setActiveModule, heldCarts } = useStore();
  const { t } = useTranslation();

  const navItems = [
    { id: 'pos', label: 'POS Bill', icon: Receipt },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'products', label: 'Stock', icon: Package },
    { id: 'customers', label: 'Khata', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-15 items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 min-h-[44px] transition-colors relative ${
              isActive ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {item.id === 'pos' && heldCarts.length > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-600 text-[8px] font-bold text-white">
                  {heldCarts.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-blue-900" />
            )}
          </button>
        );
      })}

      {/* All Modules / More Drawer Button */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 min-h-[44px] text-slate-500 hover:text-slate-900 transition-colors"
        aria-label="Open all modules menu"
      >
        <Menu className="h-5 w-5 stroke-[1.8]" />
        <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
      </button>
    </nav>
  );
};
