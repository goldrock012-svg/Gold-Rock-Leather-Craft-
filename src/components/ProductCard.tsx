import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '../types';
import { toggleMockWishlist, isProductInWishlist, addToMockCart } from '../services/firebaseMock';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onShowNotification: (message: string, type: 'success' | 'info') => void;
}

export default function ProductCard({ product, onSelectProduct, onShowNotification }: ProductCardProps & { key?: React.Key }) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(isProductInWishlist(product.id));

    const handleWishlistUpdate = () => {
      setIsInWishlist(isProductInWishlist(product.id));
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [product.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleMockWishlist(product);
    onShowNotification(
      added ? `Added "${product.name}" to Wishlist!` : `Removed "${product.name}" from Wishlist.`,
      added ? 'success' : 'info'
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToMockCart(product, 1);
    onShowNotification(`"${product.name}" added to cart!`, 'success');
  };

  // Calculate discount percentage if applicable
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <motion.div
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden relative group"
      whileHover={{ y: -4 }}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Promo badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isFlashSale && (
            <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5 shadow-sm">
              <Percent className="w-3 h-3" />
              <span>-{discount}% OFF</span>
            </span>
          )}
          {product.isNew && !product.isFlashSale && (
            <span className="bg-brand-blue-light text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
              New
            </span>
          )}
          {product.isBestSeller && !product.isFlashSale && !product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Heart Overlay */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 p-2 rounded-full shadow-md transition-all active:scale-90 cursor-pointer"
          id={`wishlist-toggle-btn-${product.id}`}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add To Cart Button (Desktop Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform hidden md:flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
            id={`quick-add-cart-btn-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add To Cart
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Category tag */}
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="font-sans font-semibold text-slate-800 text-xs md:text-sm line-clamp-2 leading-snug group-hover:text-brand-blue-light transition-colors min-h-[36px]">
          {product.name}
        </h3>

        {/* Ratings block */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-2 text-xs text-slate-500">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-0.5 font-bold text-slate-700 text-[11px]">{product.rating}</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
        </div>

        {/* Pricing block */}
        <div className="mt-auto pt-2 flex flex-col justify-end">
          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-lg font-bold text-brand-blue">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] md:text-xs text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Flash Sale Stock bar */}
          {product.isFlashSale && product.stock !== undefined && product.soldCount !== undefined && (
            <div className="mt-2.5">
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                <span>{product.stock} items left</span>
                <span>{Math.round((product.soldCount / (product.stock + product.soldCount)) * 100)}% sold</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all"
                  style={{ width: `${(product.soldCount / (product.stock + product.soldCount)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Mobile Only Add to Cart Button (since hover card doesn't work on mobile) */}
          <button
            onClick={handleAddToCart}
            className="md:hidden mt-3 w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm active:scale-98 transition-all cursor-pointer"
            id={`mobile-quick-add-${product.id}`}
          >
            <ShoppingCart className="w-3 h-3" />
            Add To Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
