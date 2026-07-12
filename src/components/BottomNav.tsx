import { useState, useEffect } from 'react';
import { Home, Grid, ShoppingCart, Heart, User } from 'lucide-react';
import { getMockCart, getMockWishlist } from '../services/firebaseMock';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCart: () => void;
}

export default function BottomNav({ currentTab, onNavigate, onOpenCart }: BottomNavProps) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    const cart = getMockCart();
    const wishlist = getMockWishlist();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();

    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);

    return () => {
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, isCartTrigger: true },
    { id: 'wishlist', label: 'Saved', icon: Heart, badge: wishlistCount },
    { id: 'account', label: 'Account', icon: User }
  ];

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1e36] border-t border-slate-800 flex items-center justify-around py-2 px-1 z-40 shadow-2xl pb-[safe]" 
      id="mobile-bottom-navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.isCartTrigger) {
                onOpenCart();
              } else {
                onNavigate(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2.5 transition-all relative ${
              isActive ? 'text-brand-orange scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
            id={`mobile-nav-${item.id}`}
          >
            {/* Icon Wrapper with potential Badges */}
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              
              {/* Badge for Cart */}
              {item.isCartTrigger && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36] animate-pulse">
                  {cartCount}
                </span>
              )}

              {/* Badge for Saved/Wishlist */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36]">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-[10px] tracking-wide mt-1">
              {item.label}
            </span>

            {/* Active Bottom Glow bar */}
            {isActive && (
              <span className="absolute bottom-0 w-5 h-[2px] bg-brand-orange rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
