import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Percent,
  Sparkles
} from 'lucide-react';

interface StorefrontNavProps {
  activeTab: string;
  onSelectTab: (tab: string, filterParam?: { category?: string; gender?: string; brand?: string }) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenStoreLocator: () => void;
  onSwitchToAdmin: () => void;
}

export const StorefrontNav: React.FC<StorefrontNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenStoreLocator,
  onSwitchToAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', tab: 'home' },
    { label: 'Men', tab: 'shop', filter: { gender: 'Men' } },
    { label: 'Women', tab: 'shop', filter: { gender: 'Women' } },
    { label: 'Kids', tab: 'shop', filter: { gender: 'Kids' } },
    { label: 'Sports', tab: 'shop', filter: { category: 'Sports Shoes' } },
    { label: 'Brands', tab: 'brands' },
    { label: 'Offers', tab: 'offers', badge: '50% OFF' }
  ];

  const popularBrands = [
    'Nike', 'Adidas', 'Puma', 'Skechers', 'Reebok', 
    'Red Chief', 'Campus', 'Sparx', 'Woodland', 'Bata'
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-[#E6E3DE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#102F4D] hover:bg-[#FAF9F6] rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Brand Logo */}
            <button
              onClick={() => onSelectTab('home')}
              className="flex flex-col text-left group cursor-pointer focus:outline-hidden"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#102F4D] leading-none uppercase font-serif group-hover:text-[#183E5D] transition-colors">
                SETHI BOOT HOUSE
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#6C747C] uppercase mt-0.5">
                RATIA • FATEHABAD • EST. 1998
              </span>
            </button>
          </div>

          {/* Middle: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              if (link.label === 'Brands') {
                return (
                  <div 
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setBrandsDropdownOpen(true)}
                    onMouseLeave={() => setBrandsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => onSelectTab('brands')}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        activeTab === 'brands' 
                          ? 'text-[#102F4D] bg-[#FAF9F6]' 
                          : 'text-[#17212B] hover:text-[#102F4D] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span>Brands</span>
                      <ChevronDown className="h-3.5 w-3.5 text-[#6C747C]" />
                    </button>

                    {/* Brands Dropdown Menu */}
                    {brandsDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 bg-white border border-[#E6E3DE] shadow-xl rounded-b-lg p-3 grid grid-cols-2 gap-1.5 z-50">
                        {popularBrands.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => {
                              onSelectTab('shop', { brand });
                              setBrandsDropdownOpen(false);
                            }}
                            className="text-left px-2.5 py-1.5 text-xs font-semibold text-[#17212B] hover:bg-[#EAF2F8] hover:text-[#102F4D] rounded-sm transition-colors"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = activeTab === link.tab && !link.filter;

              return (
                <button
                  key={link.label}
                  onClick={() => onSelectTab(link.tab, link.filter)}
                  className={`relative px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'text-[#102F4D] bg-[#FAF9F6]'
                      : 'text-[#17212B] hover:text-[#102F4D] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="bg-[#C91920] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Actions, Cart, Wishlist, Store Locator & ERP Switcher */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 text-[#102F4D] hover:bg-[#FAF9F6] rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Search Footwear"
              aria-label="Search footwear products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Store Locator Icon */}
            <button
              onClick={onOpenStoreLocator}
              className="hidden sm:flex p-2 sm:p-2.5 text-[#102F4D] hover:bg-[#FAF9F6] rounded-full transition-colors min-h-[40px] min-w-[40px] items-center justify-center"
              title="Visit Sethi Boot House in Ratia"
              aria-label="Store locator Ratia"
            >
              <MapPin className="h-5 w-5" />
            </button>

            {/* Wishlist Icon with Dynamic Badge */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 text-[#102F4D] hover:bg-[#FAF9F6] rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C91920] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart Icon with Dynamic Count */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#102F4D] hover:bg-[#183E5D] text-white px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-sm shadow-xs transition-colors min-h-[40px]"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-[#C91920] text-[11px] font-black text-white">
                {cartCount}
              </span>
            </button>

            {/* Discrete ERP & Billing Console Switcher for Store Staff / Jonny Sethi */}
            <button
              onClick={onSwitchToAdmin}
              className="hidden xl:flex items-center gap-1.5 ml-2 border border-[#E6E3DE] bg-[#FAF9F6] hover:bg-[#EAF2F8] text-[#102F4D] px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
              title="Switch to Store POS Billing & Central Inventory Console"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#183E5D]" />
              <span>ERP & POS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E3DE] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E6E3DE]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onSelectTab(link.tab, link.filter);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 text-sm font-semibold rounded-md ${
                  activeTab === link.tab && !link.filter
                    ? 'bg-[#102F4D] text-white'
                    : 'text-[#17212B] bg-[#FAF9F6] hover:bg-[#EAF2F8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] bg-[#C91920] text-white px-1.5 py-0.5 rounded font-bold">
                      {link.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Quick Brands on Mobile */}
          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6C747C] mb-2">
              Popular Brands:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {popularBrands.slice(0, 6).map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    onSelectTab('shop', { brand: b });
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#FAF9F6] hover:bg-[#EAF2F8] text-[#102F4D] border border-[#E6E3DE] rounded-sm"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E6E3DE] flex items-center justify-between">
            <button
              onClick={() => {
                onOpenStoreLocator();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#102F4D]"
            >
              <MapPin className="h-4 w-4 text-[#C91920]" />
              <span>Visit Ratia Store</span>
            </button>

            <button
              onClick={() => {
                onSwitchToAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#183E5D] bg-[#EAF2F8] px-2.5 py-1.5 rounded"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Staff ERP</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
