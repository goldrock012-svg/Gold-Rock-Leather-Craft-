import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingCart, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { getMockCart, removeFromMockCart, updateMockCartQuantity } from '../services/firebaseMock';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onShowNotification: (message: string, type: 'success' | 'info') => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout, onShowNotification }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = () => {
    setItems(getMockCart());
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }

    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, [isOpen]);

  const handleRemove = (itemId: string, name: string) => {
    removeFromMockCart(itemId);
    onShowNotification(`Removed "${name}" from cart.`, 'info');
  };

  const handleUpdateQty = (itemId: string, qty: number) => {
    updateMockCartQuantity(itemId, qty);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = items.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end" id="cart-drawer-container">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Drawer Sheet */}
        <motion.div
          className="relative bg-slate-50 w-full max-w-md h-full shadow-2xl z-10 flex flex-col border-l border-slate-200"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          id="cart-drawer"
        >
          {/* Header */}
          <div className="p-4 bg-[#0f1e36] text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-brand-orange" />
              <h2 className="text-base font-bold uppercase tracking-wide">My Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-full transition-colors cursor-pointer border border-slate-700"
              id="cart-drawer-close-btn"
              title="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
                  <ShoppingBag className="w-10 h-10 stroke-[1.2px]" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Browse Gold & Rock premium leather crafts and add custom products to your shopping bag!
                </p>
                <button
                  onClick={onClose}
                  className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer border border-brand-blue"
                  id="cart-drawer-continue-shopping"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs flex gap-3 relative group"
                  id={`cart-item-${item.id}`}
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details column */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                    <div>
                      <h4 className="font-sans font-semibold text-slate-800 text-xs md:text-sm truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <span className="text-[10px] font-medium text-brand-orange bg-brand-orange/5 border border-brand-orange/10 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-brand-blue text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity tools */}
                      <div className="flex items-center border border-slate-200 bg-slate-50 rounded-md h-7">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          className="px-2 h-full text-slate-500 hover:text-slate-800 transition-colors font-bold text-xs cursor-pointer"
                          title="Decrease item quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          className="px-2 h-full text-slate-500 hover:text-slate-800 transition-colors font-bold text-xs cursor-pointer"
                          title="Increase item quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Absolute Trash Delete Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.product.name)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-slate-50 cursor-pointer"
                    id={`delete-cart-item-${item.id}`}
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer (sticky bottom) */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Shipping Fee</span>
                  <span className="text-slate-900 font-bold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-slate-100 my-1" />
                <div className="flex justify-between text-sm text-brand-blue font-extrabold uppercase">
                  <span>Est. Grand Total</span>
                  <span className="text-base text-brand-orange">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={onCheckout}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-brand-orange text-sm uppercase tracking-wider"
                id="cart-drawer-checkout-btn"
              >
                <CreditCard className="w-4 h-4" />
                Proceed To Checkout
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
