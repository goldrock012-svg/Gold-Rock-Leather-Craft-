import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Smartphone, Truck, ShieldCheck, MapPin, CreditCard, Landmark } from 'lucide-react';
import { ShippingDetails, Order, CartItem } from '../types';
import { getMockCart, getMockCurrentUser, placeMockOrder, generateWhatsAppOrderLink } from '../services/firebaseMock';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
  onShowNotification: (message: string, type: 'success' | 'info') => void;
}

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess, onShowNotification }: CheckoutModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bank_transfer'>('cash_on_delivery');
  
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCartItems(getMockCart());
      setPlacedOrder(null);
      
      const currentUser = getMockCurrentUser();
      if (currentUser) {
        setFullName(currentUser.fullName);
        setPhoneNumber(currentUser.phoneNumber);
        setEmail(currentUser.email);
        setAddress(currentUser.address);
        setCity(currentUser.city);
        setState(currentUser.state);
      } else {
        setFullName('');
        setPhoneNumber('');
        setEmail('');
        setAddress('');
        setCity('');
        setState('');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !email || !address || !city || !state) {
      onShowNotification('Please fill in all required shipping details.', 'info');
      return;
    }

    setLoading(true);
    // Simulate server/Firebase placement delay
    setTimeout(() => {
      const details: ShippingDetails = {
        fullName,
        phoneNumber,
        email,
        address,
        city,
        state,
        additionalNotes,
      };
      
      const newOrder = placeMockOrder(details, paymentMethod);
      setPlacedOrder(newOrder);
      setLoading(false);
      onShowNotification('Order placed successfully! Reserving your artisanal leather items.', 'success');
      onOrderSuccess(); // Triggers parent callbacks if needed
    }, 1500);
  };

  const handleSendWhatsApp = () => {
    if (placedOrder) {
      const link = generateWhatsAppOrderLink(placedOrder);
      window.open(link, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto" id="checkout-modal-overlay">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          className="relative bg-slate-50 w-full max-w-4xl h-full md:h-auto max-h-[100vh] md:max-h-[92vh] rounded-none md:rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col border border-slate-200"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          id="checkout-modal"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0f1e36] text-white p-4 border-b border-slate-800 flex items-center justify-between z-10">
            <h2 className="text-base font-bold uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-orange" />
              Secure Checkout
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-full text-slate-200 transition-all cursor-pointer border border-slate-700"
              id="checkout-close-btn"
              title="Close secure checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!placedOrder ? (
            /* Phase 1: Shipping and Payment Form */
            <form onSubmit={handleSubmit} className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Shipping details (7 cols on desktop) */}
              <div className="md:col-span-7 flex flex-col gap-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Truck className="w-4.5 h-4.5 text-brand-blue" />
                    1. Shipping Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-name-input"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +234 803 123 4567"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-phone-input"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-email-input"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">Street Delivery Address *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="No. 15 Rock Steady Street, Lekki Phase 1"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-address-input"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">City / Suburb *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Lekki"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-city-input"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">State / Province *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Lagos State"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-state-input"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600">Delivery Notes (Optional)</label>
                      <textarea
                        rows={2}
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="e.g. Ring doorbell, drop-off with gatekeeper"
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                        id="checkout-notes-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection Section */}
                <div className="border-t border-slate-200 pt-5">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <CreditCard className="w-4.5 h-4.5 text-brand-blue" />
                    2. Payment Method
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Cash on Delivery option */}
                    <div
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1 relative ${
                        paymentMethod === 'cash_on_delivery' 
                          ? 'border-brand-orange bg-brand-orange/5' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      id="payment-cod-option"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === 'cash_on_delivery'}
                          onChange={() => {}}
                          className="accent-brand-orange"
                        />
                        <span className="font-bold text-slate-800 text-sm">Cash on Delivery</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5 leading-normal">
                        Pay with cash or mobile bank transfer upon delivery. Only available in Lagos areas.
                      </p>
                    </div>

                    {/* Bank Transfer option */}
                    <div
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1 relative ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-brand-orange bg-brand-orange/5' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      id="payment-bank-option"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => {}}
                          className="accent-brand-orange"
                        />
                        <span className="font-bold text-slate-800 text-sm">Pre-paid Bank Transfer</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5 leading-normal">
                        Transfer to our corporate account and send screenshot via WhatsApp for instant release.
                      </p>
                    </div>
                  </div>

                  {/* Bank Details Panel (rendered only if bank transfer selected) */}
                  {paymentMethod === 'bank_transfer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-start gap-3"
                    >
                      <Landmark className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-600 flex flex-col gap-0.5 leading-normal">
                        <p className="font-bold text-slate-800">Gold & Rock Corporate Bank Details:</p>
                        <p>Bank: <span className="font-semibold text-slate-900">Access Bank PLC</span></p>
                        <p>Account Name: <span className="font-semibold text-slate-900">Gold & Rock Leather Craft Ltd</span></p>
                        <p>Account Number: <span className="font-semibold text-slate-900 font-mono">0123456789</span></p>
                        <p className="text-[11px] text-amber-600 italic mt-1 font-medium">
                          Note: Orders are shipped after proof of payment receipt is verified.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary (5 cols on desktop) */}
              <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                  Order Summary
                </h3>

                {/* Items loop */}
                <div className="flex flex-col gap-3 max-h-56 overflow-y-auto no-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start text-xs border-b border-slate-50 pb-2">
                      <div className="w-12 h-12 rounded bg-slate-50 border shrink-0 overflow-hidden">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                        <p className="text-slate-400 font-mono text-[10px]">
                          Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-slate-700 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal pricing calculations */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold font-mono text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Courier Delivery</span>
                    <span className="font-bold font-mono text-slate-800">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <div className="flex justify-between text-sm text-brand-blue font-extrabold uppercase">
                    <span>Total Amount</span>
                    <span className="text-lg text-brand-orange font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Secure ordering disclaimer */}
                <div className="p-3 bg-slate-50 border rounded-lg text-[11px] text-slate-500 leading-normal flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    Your order will be safely dispatched via our priority courier partners. We will call you to confirm before delivery.
                  </span>
                </div>

                {/* Main Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer border border-brand-orange uppercase text-xs tracking-wider"
                  id="checkout-submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Reserving leather craft...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Place Secure Order
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Phase 2: Order Success Screen */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 md:p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto"
              id="checkout-success-view"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                <CheckCircle className="w-12 h-12" />
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-900 leading-tight mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-6 font-mono font-medium">
                ORDER ID: <span className="text-brand-blue font-bold text-sm md:text-base">{placedOrder.id}</span>
              </p>

              <div className="bg-slate-100 p-4 rounded-xl border text-left flex flex-col gap-2.5 text-xs md:text-sm text-slate-600 mb-8 leading-relaxed">
                <p className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                  <Smartphone className="w-4.5 h-4.5 text-[#25D366]" />
                  Verify on WhatsApp
                </p>
                <p>
                  Thank you for shopping with <span className="font-semibold text-slate-950">Gold & Rock Leather Craft</span>.
                </p>
                <p>
                  Since each of our leather bags, wallets, and belts is carefully handcrafted or requires bank payment verification, **please send your order receipt details directly to us on WhatsApp** to fast-track your shipment processing!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                {/* Send Receipt to WhatsApp */}
                <button
                  onClick={handleSendWhatsApp}
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer border border-emerald-500 text-xs md:text-sm"
                  id="success-whatsapp-receipt-btn"
                >
                  <Smartphone className="w-4.5 h-4.5 fill-white" />
                  Send Receipt to WhatsApp
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-sm border border-slate-300 hover:scale-101 active:scale-99 transition-all cursor-pointer text-xs md:text-sm"
                  id="success-back-home-btn"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
