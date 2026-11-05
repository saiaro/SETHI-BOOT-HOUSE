import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, OnlineOrder } from '../../types/database';
import { AnnouncementBar } from './AnnouncementBar';
import { PromotionalTicker } from './PromotionalTicker';
import { StorefrontNav } from './StorefrontNav';
import { HeroSection } from './HeroSection';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedProducts } from './FeaturedProducts';
import { BrandShowcase } from './BrandShowcase';
import { StoreShowcase } from './StoreShowcase';
import { BenefitsSection } from './BenefitsSection';
import { StorefrontFooter } from './StorefrontFooter';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer, CartItem } from './CartDrawer';
import { WishlistDrawer } from './WishlistDrawer';
import { SearchModal } from './SearchModal';
import { StoreLocatorModal } from './StoreLocatorModal';
import { AboutContactModals } from './AboutContactModals';
import { ShopCatalogView } from './ShopCatalogView';

interface StorefrontViewProps {
  onSwitchToAdmin: () => void;
}

const CART_STORAGE_KEY = 'sbh_storefront_cart';
const WISHLIST_STORAGE_KEY = 'sbh_storefront_wishlist';

export const StorefrontView: React.FC<StorefrontViewProps> = ({ onSwitchToAdmin }) => {
  const { products, placeOnlineOrder, settings } = useStore();

  // Page Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'brands' | 'offers'>('home');
  const [shopFilters, setShopFilters] = useState<{ category?: string; gender?: string; brand?: string }>({});

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'about' | 'contact' | null>(null);

  // Cart & Wishlist State (persisted locally for consumer persistence)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Cart Actions
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.variant.id === variant.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(variant.stockQuantity, next[existingIndex].quantity + quantity);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }
      return [...prev, { product, variant, quantity: Math.min(variant.stockQuantity, quantity) }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    handleAddToCart(product, variant, quantity);
    setSelectedProduct(null);
  };

  const handleUpdateCartQuantity = (variantId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.variant.id === variantId ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variant.id !== variantId));
  };

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  };

  const wishlistedProducts = products.filter(p => wishlistIds.has(p.id));

  // Navigation handlers
  const handleSelectTab = (tab: string, filterParam?: { category?: string; gender?: string; brand?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'brands') {
      setActiveTab('brands');
      setShopFilters({});
    } else if (tab === 'offers') {
      setActiveTab('offers');
      setShopFilters({});
    } else if (tab === 'shop') {
      setActiveTab('shop');
      setShopFilters(filterParam || {});
    } else {
      setActiveTab('home');
      setShopFilters({});
    }
  };

  const handleSelectCategory = (category: string) => {
    setActiveTab('shop');
    setShopFilters({ category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBrand = (brand: string) => {
    setActiveTab('shop');
    setShopFilters({ brand });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#17212B] font-sans flex flex-col selection:bg-[#102F4D] selection:text-white">
      
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar
        onCtaClick={() => handleSelectTab('offers')}
      />

      {/* 2. Main Store Navigation */}
      <StorefrontNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        onSwitchToAdmin={onSwitchToAdmin}
      />

      {/* 3. Auto-Scrolling Promotional Ticker */}
      <PromotionalTicker />

      {/* 4. Page Views */}
      <main className="flex-1">
        {activeTab === 'home' ? (
          <>
            {/* Hero Section */}
            <HeroSection
              onShopClick={() => handleSelectTab('shop')}
              onExploreSportsClick={() => handleSelectCategory('Sports Shoes')}
            />

            {/* Shop by Category (5 cards) */}
            <CategoryGrid onSelectCategory={handleSelectCategory} />

            {/* Featured Collection / Trending Products */}
            <FeaturedProducts
              products={products}
              onOpenDetails={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onViewAllClick={() => handleSelectTab('shop')}
            />

            {/* Brand Showcase */}
            <BrandShowcase onSelectBrand={handleSelectBrand} />

            {/* Physical Store Showcase (Ratia, Haryana) */}
            <StoreShowcase
              onFindStoreClick={() => setIsStoreLocatorOpen(true)}
              businessName={settings.businessName}
              city={settings.city}
              state={settings.state}
              address={settings.address}
              phone={settings.phone}
            />

            {/* Customer Benefits */}
            <BenefitsSection />
          </>
        ) : activeTab === 'brands' ? (
          <>
            <div className="bg-[#FAF9F6] py-8 text-center border-b border-[#E6E3DE]">
              <span className="text-xs font-black uppercase tracking-widest text-[#C91920]">
                ALL 100% ORIGINAL BRANDS
              </span>
              <h1 className="text-3xl font-black font-serif text-[#102F4D] mt-1">
                Authorized Footwear Brands in Ratia
              </h1>
            </div>
            <BrandShowcase onSelectBrand={handleSelectBrand} />
            <BenefitsSection />
          </>
        ) : activeTab === 'offers' ? (
          <ShopCatalogView
            products={products}
            initialCategory="all"
            onOpenDetails={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            pageTitle="Special Celebration Sale • Up to 50% Off"
          />
        ) : (
          <ShopCatalogView
            products={products}
            initialCategory={shopFilters.category || 'all'}
            initialGender={shopFilters.gender || 'all'}
            initialBrand={shopFilters.brand || 'all'}
            onOpenDetails={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            pageTitle={
              shopFilters.brand 
                ? `${shopFilters.brand} Footwear Collection`
                : shopFilters.category
                ? `${shopFilters.category} Collection`
                : shopFilters.gender
                ? `${shopFilters.gender}'s Footwear`
                : 'All Footwear Collection'
            }
          />
        )}
      </main>

      {/* 5. Footer */}
      <StorefrontFooter
        onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        onOpenAbout={() => setInfoModalType('about')}
        onOpenContact={() => setInfoModalType('contact')}
        onSelectCategory={handleSelectCategory}
      />

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={placeOnlineOrder}
        onClearCart={() => setCart([])}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onOpenDetails={setSelectedProduct}
      />

      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
      />

      <AboutContactModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

    </div>
  );
};
