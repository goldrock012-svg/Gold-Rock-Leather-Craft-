import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, MapPin, Edit, Check, Lock, Smartphone, Landmark, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { 
  getMockCurrentUser, 
  loginMockUser, 
  registerMockUser, 
  updateMockUserProfile, 
  logoutMockUser, 
  getMockOrders,
  generateWhatsAppOrderLink
} from '../services/firebaseMock';

interface AccountTabProps {
  onShowNotification: (message: string, type: 'success' | 'info') => void;
}

export default function AccountTab({ onShowNotification }: AccountTabProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Tab states for guests
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  
  // Auth Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Profile Edit states
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddr, setEditAddr] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');

  const loadAccountData = () => {
    const currentUser = getMockCurrentUser();
    setUser(currentUser);
    setOrders(getMockOrders());

    if (currentUser) {
      setEditName(currentUser.fullName);
      setEditPhone(currentUser.phoneNumber);
      setEditAddr(currentUser.address);
      setEditCity(currentUser.city);
      setEditState(currentUser.state);
    }
  };

  useEffect(() => {
    loadAccountData();

    window.addEventListener('authUpdated', loadAccountData);
    window.addEventListener('ordersUpdated', loadAccountData);
    
    return () => {
      window.removeEventListener('authUpdated', loadAccountData);
      window.removeEventListener('ordersUpdated', loadAccountData);
    };
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onShowNotification('Please enter your email.', 'info');
      return;
    }
    loginMockUser(email, password);
    onShowNotification('Logged in successfully! Welcome to GR Store.', 'success');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !phoneNumber || !address || !city || !state) {
      onShowNotification('Please fill in all required registration fields.', 'info');
      return;
    }
    const profile: UserProfile = {
      fullName,
      email,
      phoneNumber,
      address,
      city,
      state
    };
    registerMockUser(profile);
    onShowNotification('Account created successfully! Welcome to the family.', 'success');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editPhone || !editAddr || !editCity || !editState) {
      onShowNotification('Please fill in all details.', 'info');
      return;
    }
    const updated: UserProfile = {
      fullName: editName,
      email: user?.email || '',
      phoneNumber: editPhone,
      address: editAddr,
      city: editCity,
      state: editState
    };
    updateMockUserProfile(updated);
    setEditMode(false);
    onShowNotification('Profile details updated successfully.', 'success');
  };

  const handleLogout = () => {
    logoutMockUser();
    onShowNotification('Signed out safely. Have a wonderful day!', 'info');
  };

  const handleOpenWhatsAppReceipt = (order: Order) => {
    const link = generateWhatsAppOrderLink(order);
    window.open(link, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10" id="account-tab-view">
      {user ? (
        /* Authenticated View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Profile Details (5 cols on desktop) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#0f1e36] text-white p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold text-lg uppercase shadow-sm">
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base truncate font-display text-white">{user.fullName}</h3>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            {!editMode ? (
              /* View Details mode */
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-0.5 text-xs">
                  <span className="text-slate-400 font-medium">Phone Number</span>
                  <span className="text-slate-800 font-bold">{user.phoneNumber}</span>
                </div>
                
                <div className="flex flex-col gap-0.5 text-xs">
                  <span className="text-slate-400 font-medium">Default Delivery Address</span>
                  <span className="text-slate-800 font-semibold">{user.address}</span>
                  <span className="text-slate-700 font-semibold">{user.city}, {user.state}</span>
                </div>

                <div className="h-[1px] bg-slate-100 my-1" />

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    id="edit-profile-btn"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    id="sign-out-btn"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Profile Details mode */
              <form onSubmit={handleUpdateProfile} className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="edit-name-input"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="edit-phone-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={editAddr}
                    onChange={(e) => setEditAddr(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="edit-addr-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                      id="edit-city-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
                    <input
                      type="text"
                      required
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                      id="edit-state-input"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-brand-orange"
                    id="save-profile-btn"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer border"
                    id="cancel-edit-profile-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order History (7 cols on desktop) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-blue" />
              Order History ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 border flex items-center justify-center text-slate-400 mb-4">
                  <Package className="w-8 h-8 stroke-[1.2px]" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">No Orders Placed Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  When you complete a purchase, your leather craft orders will be recorded here securely.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col" id={`order-card-${order.id}`}>
                    {/* Order top bar */}
                    <div className="bg-slate-100 border-b p-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="font-bold text-slate-900 font-mono">ORDER ID: {order.id}</span>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <span className="text-slate-500">Placed on: {order.date}</span>
                      </div>
                      
                      {/* Status indicator badge */}
                      <span className="w-fit text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-600 border-amber-200 uppercase tracking-wide">
                        ⏳ Pending Verification
                      </span>
                    </div>

                    {/* Order items info list */}
                    <div className="p-4 flex flex-col gap-3.5 border-b">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 text-xs">
                          <div className="w-12 h-12 rounded bg-slate-50 border shrink-0 overflow-hidden">
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-semibold text-slate-800 truncate">{item.product.name}</h4>
                            <p className="text-slate-400 font-mono text-[10px] mt-0.5">
                              Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                            </p>
                          </div>
                          <span className="font-bold text-slate-800 shrink-0 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order pricing, payment and Actions footer */}
                    <div className="p-4 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs">
                      <div className="flex flex-col gap-1">
                        <p className="text-slate-500 font-medium">
                          Payment: <span className="font-bold text-slate-700">{order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                        </p>
                        <p className="font-bold text-brand-blue text-sm">
                          Total Amount: <span className="text-brand-orange font-mono">${order.total.toFixed(2)}</span>
                        </p>
                      </div>

                      {/* WhatsApp Receipt Action button */}
                      <button
                        onClick={() => handleOpenWhatsAppReceipt(order)}
                        className="bg-[#25D366] hover:bg-[#20ba56] text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer text-xs w-full sm:w-auto justify-center border border-emerald-500"
                        id={`whatsapp-verify-btn-${order.id}`}
                      >
                        <Smartphone className="w-4 h-4 fill-white" />
                        Verify on WhatsApp
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Guest View - Forms to Register/SignIn */
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Tabs header */}
          <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50 text-sm font-semibold">
            <button
              onClick={() => setAuthTab('signin')}
              className={`py-3.5 text-center cursor-pointer border-b-2 transition-all ${
                authTab === 'signin' 
                  ? 'border-brand-orange text-brand-orange bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="auth-tab-signin"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`py-3.5 text-center cursor-pointer border-b-2 transition-all ${
                authTab === 'register' 
                  ? 'border-brand-orange text-brand-orange bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="auth-tab-register"
            >
              Register Account
            </button>
          </div>

          <div className="p-6 md:p-8">
            {authTab === 'signin' ? (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 border">
                    <Lock className="w-5 h-5 stroke-[1.5px]" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Welcome Back</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Access your profile and order tracker securely.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="signin-email-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="signin-password-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer border border-brand-orange text-xs uppercase tracking-wider mt-2"
                  id="signin-submit-btn"
                >
                  Access My Account
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                <div className="text-center mb-1">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 border">
                    <User className="w-5 h-5 stroke-[1.5px]" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Create Profile</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Join Gold & Rock Leather to easily track purchases.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                      id="register-name-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      className="border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                      id="register-phone-input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="register-email-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Street Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="15 Rock Steady Cresent"
                    className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                    id="register-address-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Victoria Island"
                      className="border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                      id="register-city-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Lagos"
                      className="border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none"
                      id="register-state-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer border border-brand-orange text-xs uppercase tracking-wider mt-1"
                  id="register-submit-btn"
                >
                  Create My Profile
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
