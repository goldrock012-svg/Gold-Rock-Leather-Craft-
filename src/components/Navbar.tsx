import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, User, Sparkles, LogOut, Package, MapPin } from 'lucide-react';
import { getMockCart, getMockWishlist, getMockCurrentUser, logoutMockUser } from '../services/firebaseMock';
import { UserProfile } from '../types';

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (tab: string) => void;
  onOpenCart: () => void;
  currentTab: string;
}

export default function Navbar({ onSearch, onNavigate, onOpenCart, currentTab }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const updateCounts = () => {
    const cart = getMockCart();
    const wishlist = getMockWishlist();
    const user = getMockCurrentUser();
    
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    setWishlistCount(wishlist.length);
    setCurrentUser(user);
  };

  useEffect(() => {
    updateCounts();

    // Add event listeners for mock database changes
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);
    window.addEventListener('authUpdated', updateCounts);
    window.addEventListener('ordersUpdated', updateCounts);

    return () => {
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
      window.removeEventListener('authUpdated', updateCounts);
      window.removeEventListener('ordersUpdated', updateCounts);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('home'); // Go to home to show search results
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    onSearch(val);
  };

  const handleLogout = () => {
    logoutMockUser();
    setShowUserDropdown(false);
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-30 w-full flex flex-col" id="app-header">
      {/* Top Promotional Bar */}
      <div className="w-full bg-[#f68b1e] text-white py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-1.5 md:gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Free local delivery on orders over $100! Handcrafted in premium leather.</span>
      </div>

      {/* Main Header */}
      <div className="w-full bg-[#0f1e36] text-white px-4 py-3 md:py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col gap-2.5 md:gap-0 md:flex-row md:items-center md:justify-between">
          
          {/* Logo and Mobile Header Controls */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <button 
              onClick={() => {
                setSearchQuery('');
                onSearch('');
                onNavigate('home');
              }}
              className="flex flex-col items-start cursor-pointer group text-left"
              id="header-logo-btn"
            >
              <span className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                GR <span className="text-brand-orange">STORE</span>
              </span>
              <span className="text-[9px] md:text-[10px] tracking-widest text-slate-400 font-mono -mt-1 group-hover:text-brand-orange transition-colors">
                BY GOLD & ROCK LEATHER
              </span>
            </button>

            {/* Quick Mobile Cart/Wishlist Badges */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => onNavigate('wishlist')}
                className={`p-2 hover:bg-slate-800/60 rounded-full relative ${currentTab === 'wishlist' ? 'text-brand-orange bg-slate-800/40' : 'text-slate-200'}`}
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={onOpenCart}
                className="p-2 hover:bg-slate-800/60 rounded-full text-slate-200 relative"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Desktop and full-width mobile row */}
          <form 
            onSubmit={handleSearchSubmit}
            className="w-full md:max-w-xl md:mx-6 flex items-center bg-slate-800 border border-slate-700 hover:border-slate-500 focus-within:border-brand-orange rounded-lg overflow-hidden transition-colors"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search handcrafted bags, wallets, belts, straps..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              id="search-input-field"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="px-2 text-slate-400 hover:text-white text-xs mr-1"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-2 font-medium text-xs md:text-sm tracking-wide transition-colors uppercase cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Right Desktop Utilities */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className={`flex items-center gap-1.5 px-3 py-2 hover:bg-slate-800/60 rounded-lg text-sm font-medium relative transition-colors cursor-pointer ${
                currentTab === 'wishlist' ? 'text-brand-orange bg-slate-800/50' : 'text-slate-200'
              }`}
              id="desktop-wishlist-nav"
            >
              <Heart className={`w-5 h-5 ${currentTab === 'wishlist' ? 'fill-brand-orange' : ''}`} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-slate-900">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-orange/10 hover:bg-brand-orange/25 border border-brand-orange/30 rounded-lg text-brand-orange text-sm font-semibold relative transition-all cursor-pointer"
              id="desktop-cart-nav"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account dropdown / login */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-1.5 px-3 py-2 hover:bg-slate-800/60 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-200 ${
                  currentTab === 'account' ? 'text-brand-orange bg-slate-800/40' : ''
                }`}
                id="desktop-account-dropdown-trigger"
              >
                <User className="w-5 h-5" />
                <span className="max-w-[100px] truncate">
                  {currentUser ? `Hi, ${currentUser.fullName.split(' ')[0]}` : 'Account'}
                </span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden text-sm">
                  <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/40">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="font-semibold text-white truncate text-xs">{currentUser?.email || 'Guest'}</p>
                  </div>
                  {currentUser ? (
                    <>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onNavigate('account');
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onNavigate('account'); // Contains order list!
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200 transition-colors cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        Order History
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-red-950/40 text-red-400 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onNavigate('account');
                      }}
                      className="w-full px-4 py-2 text-left text-brand-orange hover:bg-brand-orange/10 flex items-center gap-2 font-medium transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Sign In / Register
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Category ribbon / quick filter (Desktop) */}
      <div className="hidden md:block w-full bg-slate-900 border-b border-slate-800 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm text-slate-300">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Quick Category Filter:</span>
          <button 
            onClick={() => { onSearch(''); onNavigate('home'); }}
            className={`hover:text-white transition-colors cursor-pointer font-medium ${currentTab === 'home' ? 'text-brand-orange' : ''}`}
          >
            All Products
          </button>
          <button 
            onClick={() => { onSearch('bags'); onNavigate('home'); }}
            className="hover:text-white transition-colors cursor-pointer font-medium"
          >
            Bags & Folios
          </button>
          <button 
            onClick={() => { onSearch('wallets'); onNavigate('home'); }}
            className="hover:text-white transition-colors cursor-pointer font-medium"
          >
            Wallets & Cardholders
          </button>
          <button 
            onClick={() => { onSearch('belts'); onNavigate('home'); }}
            className="hover:text-white transition-colors cursor-pointer font-medium"
          >
            Classic Belts
          </button>
          <button 
            onClick={() => { onSearch('accessories'); onNavigate('home'); }}
            className="hover:text-white transition-colors cursor-pointer font-medium"
          >
            Accessories
          </button>
          <span className="h-4 w-[1px] bg-slate-800" />
          <button 
            onClick={() => { onSearch('flash'); onNavigate('home'); }}
            className="hover:text-white text-brand-orange flex items-center gap-1 transition-colors cursor-pointer font-semibold animate-pulse"
          >
            ⚡ Flash Sales
          </button>
        </div>
      </div>
    </header>
  );
}
