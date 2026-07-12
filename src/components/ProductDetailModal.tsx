import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, ShoppingBag, MessageSquare, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product } from '../types';
import { toggleMockWishlist, isProductInWishlist, addToMockCart } from '../services/firebaseMock';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onShowNotification: (message: string, type: 'success' | 'info') => void;
}

const COLORS = [
  { name: 'Tan Gold', code: '#d97706' },
  { name: 'Obsidian Black', code: '#1e293b' },
  { name: 'Chestnut Rock', code: '#78350f' }
];

export default function ProductDetailModal({ product, onClose, onShowNotification }: ProductDetailModalProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (product) {
      setIsInWishlist(isProductInWishlist(product.id));
      setActiveImg(0);
      setQuantity(1);
      setSelectedColor(COLORS[0].name);
    }
  }, [product]);

  if (!product) return null;

  const handleWishlistToggle = () => {
    const added = toggleMockWishlist(product);
    setIsInWishlist(added);
    onShowNotification(
      added ? `Added "${product.name}" to Wishlist!` : `Removed "${product.name}" from Wishlist.`,
      added ? 'success' : 'info'
    );
  };

  const handleAddToCart = () => {
    addToMockCart(product, quantity, selectedColor);
    onShowNotification(`Added ${quantity}x "${product.name}" in ${selectedColor} to your cart!`, 'success');
    onClose();
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = '+2348123456789'; // Gold & Rock Leather Business WhatsApp
    const message = `*GR STORE INQUIRY*\n` +
                    `Hello Gold & Rock Leather Craft, I'm interested in buying your premium leather item:\n\n` +
                    `*Item:* ${product.name}\n` +
                    `*Color:* ${selectedColor}\n` +
                    `*Quantity:* ${quantity}\n` +
                    `*Price:* $${product.price} each\n` +
                    `*Total:* $${product.price * quantity}\n\n` +
                    `Is this item available? How long would shipping take? Thanks!`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const nextImage = () => {
    setActiveImg((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImg((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto" id="product-detail-overlay">
        {/* Backdrop overlay */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Sheet */}
        <motion.div
          className="relative bg-slate-50 w-full max-w-4xl h-full md:h-auto max-h-[100vh] md:max-h-[90vh] rounded-none md:rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col border border-slate-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          id="product-detail-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer border border-slate-700"
            id="product-detail-close-btn"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-4 md:p-8 flex flex-col gap-6 md:gap-8">
            {/* Top Product section: Split on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              
              {/* Product Images View */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-200 shadow-inner">
                  <img
                    src={product.images[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                        title="Prev image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                        title="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Flash sale badge overlay */}
                  {product.isFlashSale && (
                    <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                      ⚡ FLASH SALE
                    </span>
                  )}
                </div>

                {/* Thumbnails row */}
                {product.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto py-1 no-scrollbar">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 bg-white transition-all cursor-pointer ${
                          activeImg === i ? 'border-brand-orange shadow-sm scale-102' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        id={`product-thumbnail-btn-${i}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details Specs Panel */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.isNew && (
                    <span className="text-xs font-mono font-bold text-brand-blue-light bg-brand-blue-light/10 border border-brand-blue-light/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 leading-tight mb-2">
                  {product.name}
                </h2>

                {/* Star ratings */}
                <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-700">{product.rating}</span>
                  <span>({product.reviewsCount} customer reviews)</span>
                </div>

                {/* Price section */}
                <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-1 mb-5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Special Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl md:text-3xl font-extrabold text-brand-blue">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-slate-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-md">
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>
                  {product.isFlashSale && product.stock !== undefined && (
                    <p className="text-xs text-brand-orange font-semibold flex items-center gap-1 mt-1.5">
                      ⚡ Limited promotional stock: Only {product.stock} pieces left!
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Leather color options */}
                <div className="mb-5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-2">
                    Select Leather Finish: <span className="text-slate-500 font-medium">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-all cursor-pointer relative hover:scale-105 ${
                          selectedColor === color.name ? 'border-brand-orange scale-102' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.code }}
                        id={`color-option-${color.name.toLowerCase().replace(/\s/g, '-')}`}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4 mt-2">
                  
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-300 bg-white rounded-lg h-12 w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 h-full text-slate-500 hover:text-brand-blue-light transition-colors font-bold text-lg cursor-pointer"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 h-full text-slate-500 hover:text-brand-blue-light transition-colors font-bold text-lg cursor-pointer"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-brand-blue hover:bg-brand-blue-light text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer border border-brand-blue"
                    id="modal-add-to-cart-btn"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add To Cart - ${(product.price * quantity).toFixed(2)}
                  </button>

                  {/* Wishlist button */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`h-12 w-12 rounded-lg flex items-center justify-center border transition-all active:scale-90 cursor-pointer ${
                      isInWishlist 
                        ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' 
                        : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
                    }`}
                    id="modal-wishlist-toggle"
                    title={isInWishlist ? "Saved to wishlist" : "Save to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* WhatsApp Quick Order Inquiry button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="mt-3.5 w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:scale-101 active:scale-99 transition-all cursor-pointer border border-emerald-500"
                  id="modal-whatsapp-inquiry-btn"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  Order / Inquire via WhatsApp
                </button>
              </div>
            </div>

            {/* Middle Section: Technical Specifications & Handcrafting Details */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
                Artisanal Features & Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
                {product.details.map((spec, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="text-brand-orange mt-1 font-bold">✓</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Customer Reviews */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Verified Purchase Reviews ({product.reviews.length})
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800">{product.rating} / 5</span>
                </div>
              </div>

              {product.reviews.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No reviews yet for this artisanal item. Be the first to review!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs uppercase">
                            {review.userName.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{review.userName}</span>
                          <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                            ✓ Verified Buyer
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{review.date}</span>
                      </div>

                      {/* Stars for review */}
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? 'fill-current' : 'text-slate-100'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
