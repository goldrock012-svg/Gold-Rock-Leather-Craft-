import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Clock, Sparkles, Award, Star, ShieldCheck, Heart, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

// Reusable Custom Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HeroSlider from './components/HeroSlider';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import CategoriesTab from './components/CategoriesTab';
import AccountTab from './components/AccountTab';
import WhatsAppButton from './components/WhatsAppButton';

// Domain and Mock Services
import { Product } from './types';
import { getMockProducts, getMockWishlist, isProductInWishlist, toggleMockWishlist } from './services/firebaseMock';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'categories' | 'wishlist' | 'account'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Notification Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Flash Sale Timer values (Simulated countdown ending in 8 hours 42 minutes)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  // Load all products from the mock db
  const products = useMemo(() => getMockProducts(), []);

  // Sync wishlist items from mock storage
  const syncWishlist = () => {
    setWishlistItems(getMockWishlist());
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener('wishlistUpdated', syncWishlist);
    
    // Countdown Timer Loop
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 8, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);

    return () => {
      window.removeEventListener('wishlistUpdated', syncWishlist);
      clearInterval(timer);
    };
  }, []);

  // Show customized floating toast alerts
  const showNotification = (message: string, type: 'success' | 'info') => {
    setToast({ show: true, message, type });
    // Auto-hide after 3.5 seconds
    setTimeout(() => {
      setToast((prev) => (prev.message === message ? { ...prev, show: false } : prev));
    }, 3500);
  };

  // Filter products based on search queries and category tags
  const filteredProducts = useMemo(() => {
    let list = products;
    const query = searchQuery.trim().toLowerCase();

    if (!query) return list;

    // Direct category quick links checking
    if (['bags', 'wallets', 'belts', 'accessories'].includes(query)) {
      return list.filter((p) => p.category === query);
    }
    
    if (query === 'flash') {
      return list.filter((p) => p.isFlashSale);
    }

    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Separate lists for specific homepage sections
  const flashSaleProducts = useMemo(() => products.filter((p) => p.isFlashSale), [products]);
  const bestSellerProducts = useMemo(() => products.filter((p) => p.isBestSeller), [products]);
  const newArrivalsProducts = useMemo(() => products.filter((p) => p.isNew), [products]);

  // Handle categories navigation callback
  const handleSelectCategory = (catId: string) => {
    setSearchQuery(catId);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-0" id="gr-store-app-root">
      {/* Navigation bar */}
      <Navbar
        onSearch={setSearchQuery}
        onNavigate={setCurrentTab}
        onOpenCart={() => setIsCartOpen(true)}
        currentTab={currentTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {searchQuery ? (
            /* Search / Filter results view override */
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 leading-tight">
                    Search Results for <span className="text-brand-orange">"{searchQuery}"</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Found {filteredProducts.length} handcrafted leather crafts
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 sm:mt-0 text-xs font-semibold text-slate-500 hover:text-slate-800 border px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Clear Search Filters
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white border rounded-2xl flex flex-col items-center justify-center">
                  <p className="text-slate-400 text-sm italic">No products matched your search description.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    View All Leather Crafts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={setSelectedProduct}
                      onShowNotification={showNotification}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Standard tabbed views */
            <>
              {currentTab === 'home' && (
                <motion.div
                  key="home-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-8 md:gap-12"
                >
                  {/* Hero Slider banner */}
                  <HeroSlider onCtaClick={handleSelectCategory} />

                  {/* Quick Categories Bar */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-bold text-slate-900 text-sm md:text-base uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-brand-orange" />
                        Explore Collections
                      </h3>
                      <button
                        onClick={() => setCurrentTab('categories')}
                        className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark flex items-center gap-0.5 cursor-pointer"
                      >
                        See All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar md:grid md:grid-cols-4">
                      {products.slice(2, 6).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectCategory(prod.category)}
                          className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-xs cursor-pointer hover:shadow-md hover:border-slate-300 transition-all min-w-[200px] shrink-0 md:min-w-0"
                          id={`quick-cat-bar-${prod.category}`}
                        >
                          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border bg-slate-50">
                            <img src={prod.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-sans font-bold text-xs text-slate-800 capitalize">{prod.category}</h4>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">Gold & Rock Craft</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FLASH SALES SECTION */}
                  <div className="bg-[#0f1e36] text-white rounded-2xl p-4 md:p-6 border border-slate-800 shadow-xl overflow-hidden relative">
                    {/* Glowing decorative ambient corner */}
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="bg-brand-orange text-white p-1.5 rounded-lg shadow-md animate-pulse">
                          <Zap className="w-4 h-4 fill-white text-white" />
                        </span>
                        <h3 className="font-sans font-extrabold text-white text-base md:text-xl uppercase tracking-wider">
                          ⚡ Flash Sales
                        </h3>
                      </div>

                      {/* Count down timer widget */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-mono font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          ENDING IN:
                        </span>
                        <div className="flex gap-1.5 font-mono">
                          <span className="bg-slate-800 border border-slate-700 text-brand-orange font-bold px-2 py-1 rounded-md text-xs">
                            {String(timeLeft.hours).padStart(2, '0')}h
                          </span>
                          <span className="text-slate-500 font-bold">:</span>
                          <span className="bg-slate-800 border border-slate-700 text-brand-orange font-bold px-2 py-1 rounded-md text-xs">
                            {String(timeLeft.minutes).padStart(2, '0')}m
                          </span>
                          <span className="text-slate-500 font-bold">:</span>
                          <span className="bg-slate-800 border border-slate-700 text-brand-orange font-bold px-2 py-1 rounded-md text-xs">
                            {String(timeLeft.seconds).padStart(2, '0')}s
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {flashSaleProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onSelectProduct={setSelectedProduct}
                          onShowNotification={showNotification}
                        />
                      ))}
                    </div>
                  </div>

                  {/* BEST SELLERS SECTION */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-600 p-1 rounded-md border border-amber-200">
                        <Award className="w-4 h-4" />
                      </span>
                      <h3 className="font-sans font-extrabold text-slate-900 text-sm md:text-base uppercase tracking-wider">
                        Best Sellers
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {bestSellerProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onSelectProduct={setSelectedProduct}
                          onShowNotification={showNotification}
                        />
                      ))}
                    </div>
                  </div>

                  {/* NEW ARRIVALS */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-brand-blue-light p-1 rounded-md border border-blue-100">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <h3 className="font-sans font-extrabold text-slate-900 text-sm md:text-base uppercase tracking-wider">
                        New Arrivals
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {newArrivalsProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onSelectProduct={setSelectedProduct}
                          onShowNotification={showNotification}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Brand trust bento cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-8 pb-4">
                    <div className="bg-white border rounded-xl p-4 flex gap-3.5 shadow-xs items-start">
                      <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg border border-brand-orange/20">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm">Artisanal Lifetime Guarantee</h4>
                        <p className="text-slate-500 text-xs font-light mt-1 leading-normal">
                          We use 100% genuine full-grain leather. Built for decades, certified with a durability guarantee.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border rounded-xl p-4 flex gap-3.5 shadow-xs items-start">
                      <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg border border-brand-orange/20">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm">Bespoke Custom Tailoring</h4>
                        <p className="text-slate-500 text-xs font-light mt-1 leading-normal">
                          Add laser monograms, choose stitching threads, or adapt custom sizes via our WhatsApp live line!
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border rounded-xl p-4 flex gap-3.5 shadow-xs items-start">
                      <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg border border-brand-orange/20">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm">Speedy Local Priority Dispatch</h4>
                        <p className="text-slate-500 text-xs font-light mt-1 leading-normal">
                          Fast courier shipping with instant tracking notifications and direct driver coordination.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'categories' && (
                <motion.div
                  key="categories-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CategoriesTab onSelectCategory={handleSelectCategory} />
                </motion.div>
              )}

              {currentTab === 'wishlist' && (
                <motion.div
                  key="wishlist-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b pb-4">
                    <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 leading-tight">
                      My Wishlist ({wishlistItems.length})
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Your saved artisanal leather favorites
                    </p>
                  </div>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 bg-white border rounded-2xl flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-100 border flex items-center justify-center text-slate-400 mb-4">
                        <Heart className="w-7 h-7 stroke-[1.2px]" />
                      </div>
                      <p className="text-slate-400 text-sm italic">You haven't saved any leather pieces yet.</p>
                      <button
                        onClick={() => setCurrentTab('home')}
                        className="mt-4 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                      >
                        Explore Crafts Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {wishlistItems.map((prod) => (
                        <div key={prod.id} className="relative group">
                          <ProductCard
                            product={prod}
                            onSelectProduct={setSelectedProduct}
                            onShowNotification={showNotification}
                          />
                          {/* Inline Delete wishlist shortcut */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMockWishlist(prod);
                              showNotification(`Removed "${prod.name}" from Saved Items.`, 'info');
                            }}
                            className="absolute bottom-16 right-3 z-10 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full border shadow-sm transition-all cursor-pointer"
                            title="Remove from Saved Items"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {currentTab === 'account' && (
                <motion.div
                  key="account-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AccountTab onShowNotification={showNotification} />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0f1e36] text-slate-400 text-xs py-8 px-4 border-t border-slate-800 mt-12 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white font-display text-sm">GR STORE | Gold & Rock</h4>
            <p className="text-slate-400 font-light leading-relaxed max-w-xs mx-auto md:mx-0">
              Handcrafted in Nigeria. We harvest premium full-grain bovine leather to design long-lasting luxury accessories, belts, and bespoke custom bags.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white font-display text-sm">Client Support Hub</h4>
            <p className="font-light leading-relaxed">
              Open Hours: Mon - Sat (9AM - 6PM)<br />
              Secure Hotline: +234 812 345 6789<br />
              Email Contact: support@goldrockleather.com
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-white font-display text-sm">Corporate Information</h4>
            <p className="font-light leading-relaxed">
              Headquarters Workshop: Victoria Island, Lagos State.<br />
              <span className="text-brand-orange font-semibold">Ready for Firebase Integration</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-6 pt-5 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} GR STORE - Gold & Rock Leather Craft Ltd. All rights reserved.</span>
          <span className="flex items-center gap-1.5 justify-center">
            <svg className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Handcrafted with Leather & Code
          </span>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
      <WhatsAppButton />

      {/* Mobile Fixed Bottom Navigation bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Product Detail overlay sheet */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onShowNotification={showNotification}
      />

      {/* Shopping Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onShowNotification={showNotification}
      />

      {/* Checkout Forms modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          setIsCheckoutOpen(false); // keep success screen active internally, or close and reset
        }}
        onShowNotification={showNotification}
      />

      {/* Floating Toast Notification alerts */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-24 md:bottom-6 left-6 right-6 md:left-auto md:w-80 bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3"
            id="toast-notification-popup"
          >
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-[#25D366] animate-pulse' : 'bg-brand-orange animate-pulse'}`} />
            <p className="text-xs md:text-sm font-medium flex-1">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
