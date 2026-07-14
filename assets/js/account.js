let activeTab = 'my-profile';
let editMode = false;
let authTab = 'signin'; // 'signin' or 'register'
let mobileShowPane = false;
let adminSubTab = 'verify-payments'; // 'verify-payments' or 'upload-product'
let selectedProductImageFile = null;
let selectedProductImageFiles = []; // For multi-image product catalog uploads
let adminActiveSection = 'dashboard';
let adminEditingProduct = null;
let adminEditingCategory = null;

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  const params = new URLSearchParams(window.location.search);
  const queryTab = params.get('tab');
  if (queryTab) {
    activeTab = queryTab;
    mobileShowPane = true;
  }

  renderAccountView();

  window.addEventListener('authUpdated', () => {
    renderAccountView();
  });
  window.addEventListener('ordersUpdated', () => {
    renderAccountView();
  });
  window.addEventListener('wishlistUpdated', () => {
    if (activeTab === 'wishlist') {
      renderAccountView();
    }
  });
  window.addEventListener('productsUpdated', () => {
    if (activeTab === 'admin-dashboard') {
      renderAccountView();
    }
  });

  if (window.lucide) window.lucide.createIcons();
});

function renderAccountView() {
  const container = document.getElementById('account-page-inner');
  if (!container) return;

  const user = getMockCurrentUser();

  // Auto-route admin to the admin dashboard
  if (user && user.email === "goldrock012@gmail.com") {
    if (activeTab !== 'admin-dashboard' && activeTab !== 'settings') {
      activeTab = 'admin-dashboard';
    }
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <!-- Sidebar Menu (Visible on desktop, or on mobile when not viewing pane details) -->
      <div class="md:col-span-4 ${mobileShowPane ? 'hidden md:block' : 'block'}" id="account-sidebar-col">
        ${getSidebarMenuHtml(user)}
      </div>

      <!-- Active Content Panel (Visible on desktop, or on mobile when active pane details is selected) -->
      <div class="md:col-span-8 ${!mobileShowPane ? 'hidden md:block' : 'block'}" id="account-content-col">
        ${mobileShowPane ? `
          <div class="flex items-center gap-2 mb-4 md:hidden">
            <button id="back-to-menu-btn" class="text-xs font-bold text-brand-orange flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs cursor-pointer">
              <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Account Menu
            </button>
          </div>
        ` : ''}
        <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs min-h-[350px]">
          ${getActiveTabContentHtml(user)}
        </div>
      </div>
    </div>
  `;

  setupAccountListeners(user);
  if (window.lucide) window.lucide.createIcons();
}

function getSidebarMenuHtml(user) {
  const menuItems = [
    { id: 'my-profile', label: 'My Profile', icon: 'user' },
    { id: 'my-orders', label: 'My Orders', icon: 'package' },
    { id: 'pending-orders', label: 'Pending Orders', icon: 'clock' },
    { id: 'processing-orders', label: 'Processing Orders', icon: 'loader' },
    { id: 'shipped-orders', label: 'Shipped Orders', icon: 'truck' },
    { id: 'delivered-orders', label: 'Delivered Orders', icon: 'check-circle' },
    { id: 'cancelled-orders', label: 'Cancelled Orders', icon: 'x-circle' },
    { id: 'payment-history', label: 'Payment History', icon: 'credit-card' },
    { id: 'wishlist', label: 'Wishlist', icon: 'heart' },
    { id: 'saved-addresses', label: 'Saved Addresses', icon: 'map-pin' },
    { id: 'admin-console', label: 'Admin Console (Verify Payments)', icon: 'shield-alert' },
    { id: 'about-us', label: 'About GR STORE', icon: 'info' },
    { id: 'contact-us', label: 'Contact Us', icon: 'phone' },
    { id: 'help-support', label: 'Help & Support', icon: 'help-circle' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  let html = `
    <!-- User Card info header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
      <div class="bg-[#0f1e36] text-white p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center text-brand-orange font-bold text-base uppercase">
          ${user ? user.fullName.charAt(0) : '?'}
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="font-bold text-xs md:text-sm truncate font-display text-white">${user ? user.fullName : 'Guest Customer'}</h3>
          <p class="text-[10px] text-slate-400 truncate">${user ? user.email : 'Gold & Rock Handcrafts'}</p>
        </div>
      </div>
    </div>

    <!-- Jumia Navigation Links List -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 flex flex-col gap-0.5">
  `;

  menuItems.forEach(item => {
    const isActive = activeTab === item.id;
    html += `
      <button data-tab="${item.id}" class="tab-menu-btn w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
        isActive 
          ? 'bg-orange-50/70 text-[#f68b1e] font-extrabold border-l-4 border-[#f68b1e] pl-2.5' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-[#0f1e36]'
      }">
        <div class="flex items-center gap-3">
          <i data-lucide="${item.icon}" class="w-4 h-4 ${isActive ? 'text-[#f68b1e]' : 'text-slate-400'}"></i>
          <span class="text-xs font-semibold tracking-wide">${item.label}</span>
        </div>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400 md:hidden"></i>
      </button>
    `;
  });

  if (user) {
    html += `
      <div class="border-t border-slate-100 my-1"></div>
      <button id="sidebar-logout-btn" class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-all cursor-pointer">
        <i data-lucide="log-out" class="w-4 h-4 text-red-500"></i>
        <span class="text-xs font-bold tracking-wide">Logout</span>
      </button>
    `;
  }

  html += `</div>`;
  return html;
}

function getActiveTabContentHtml(user) {
  const isAuthRequired = [
    'my-orders', 'pending-orders', 'processing-orders', 'shipped-orders', 'delivered-orders', 'cancelled-orders',
    'saved-addresses', 'payment-history', 'settings', 'admin-console'
  ].includes(activeTab) || (activeTab === 'my-profile' && !user);
  
  if (isAuthRequired && !user) {
    return getAuthLockedHtml();
  }

  switch (activeTab) {
    case 'my-profile':
      return !editMode ? getProfileViewHtml(user) : getProfileEditFormHtml(user);
    case 'my-orders':
      return getOrdersViewHtml();
    case 'pending-orders':
      return getOrdersViewHtml('pending');
    case 'processing-orders':
      return getOrdersViewHtml('Processing');
    case 'shipped-orders':
      return getOrdersViewHtml('Shipped');
    case 'delivered-orders':
      return getOrdersViewHtml('Delivered');
    case 'cancelled-orders':
      return getOrdersViewHtml('Cancelled');
    case 'wishlist':
      return getWishlistViewHtml();
    case 'saved-addresses':
      return getSavedAddressesViewHtml(user);
    case 'payment-history':
      return getPaymentHistoryViewHtml(user);
    case 'admin-dashboard':
      return getAdminConsoleViewHtml();
    case 'about-us':
      return getAboutUsViewHtml();
    case 'contact-us':
      return getContactUsViewHtml();
    case 'help-support':
      return getHelpSupportViewHtml();
    case 'settings':
      return getSettingsViewHtml(user);
    default:
      return `<p class="text-slate-400 text-xs italic">Select a menu option.</p>`;
  }
}

function getAuthLockedHtml() {
  return `
    <div class="text-center py-6 flex flex-col items-center justify-center max-w-sm mx-auto animate-in fade-in duration-300">
      <div class="w-12 h-12 bg-amber-50 text-brand-orange border border-amber-100 rounded-full flex items-center justify-center mb-3">
        <i data-lucide="lock" class="w-5 h-5 text-brand-orange"></i>
      </div>
      <h3 class="font-sans font-bold text-slate-800 text-sm">Account Sign In Required</h3>
      <p class="text-[11px] text-slate-400 font-light mt-1 mb-5 leading-normal text-center">
        To view your order status, payment logs, saved addresses, or settings, please sign in or register below.
      </p>

      <div class="w-full bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
        <div class="flex border-b">
          <button id="lock-btn-signin" class="flex-1 py-3 text-center font-sans font-bold text-[10px] tracking-wider uppercase cursor-pointer transition-colors ${
            authTab === 'signin' ? 'text-brand-orange bg-white border-b-2 border-brand-orange' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
          }">
            Sign In
          </button>
          <button id="lock-btn-register" class="flex-1 py-3 text-center font-sans font-bold text-[10px] tracking-wider uppercase cursor-pointer transition-colors ${
            authTab === 'register' ? 'text-brand-orange bg-white border-b-2 border-brand-orange' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
          }">
            Register
          </button>
        </div>
        <div class="p-5 text-left">
          ${authTab === 'signin' ? getSignInFormHtml() : getRegisterFormHtml()}
        </div>
      </div>
    </div>
  `;
}

function getSignInFormHtml() {
  return `
    <form id="auth-signin-form" class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address *</label>
        <input type="email" id="signin-email" required placeholder="example@gmail.com" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password *</label>
        <input type="password" id="signin-password" required placeholder="••••••••" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
      </div>
      <button type="submit" id="signin-submit-btn" class="w-full bg-[#0f1e36] hover:bg-[#1a3258] text-white py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors uppercase cursor-pointer mt-2 flex items-center justify-center gap-1.5 border-0">
        Sign In
      </button>
    </form>
  `;
}

function getRegisterFormHtml() {
  return `
    <form id="auth-register-form" class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
        <input type="text" id="reg-name" required placeholder="John Doe" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address *</label>
        <input type="email" id="reg-email" required placeholder="john@example.com" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number *</label>
        <input type="tel" id="reg-phone" required placeholder="08126730784" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address *</label>
        <input type="text" id="reg-addr" required placeholder="Streets, Blocks" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City *</label>
          <input type="text" id="reg-city" required placeholder="Ilorin" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State *</label>
          <input type="text" id="reg-state" required placeholder="Kwara State" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password *</label>
          <input type="password" id="reg-password" required placeholder="••••••••" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm Password *</label>
          <input type="password" id="reg-confirm-password" required placeholder="••••••••" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
        </div>
      </div>
      <button type="submit" id="register-submit-btn" class="w-full bg-[#f68b1e] hover:bg-brand-orange-dark text-white py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors uppercase cursor-pointer mt-2 flex items-center justify-center gap-1.5 border-0">
        Register Account
      </button>
    </form>
  `;
}

function getProfileViewHtml(user) {
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="user" class="w-4 h-4 text-brand-orange"></i>
        My Profile Details
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div class="bg-slate-50/70 p-3 border border-slate-100 rounded-xl">
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Full Name</span>
          <span class="text-slate-800 font-bold text-xs md:text-sm block mt-0.5">${user.fullName}</span>
        </div>
        <div class="bg-slate-50/70 p-3 border border-slate-100 rounded-xl">
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
          <span class="text-slate-800 font-bold text-xs md:text-sm block mt-0.5">${user.email}</span>
        </div>
        <div class="bg-slate-50/70 p-3 border border-slate-100 rounded-xl">
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</span>
          <span class="text-slate-800 font-bold text-xs md:text-sm block mt-0.5">${user.phoneNumber}</span>
        </div>
        <div class="bg-slate-50/70 p-3 border border-slate-100 rounded-xl">
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Default Delivery Address</span>
          <span class="text-slate-800 font-semibold text-xs md:text-sm block mt-0.5">${user.address}, ${user.city}, ${user.state}</span>
        </div>
      </div>

      <div class="flex gap-2.5">
        <button id="profile-edit-btn" class="bg-[#0f1e36] hover:bg-[#1a3258] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
          <i data-lucide="edit-3" class="w-4 h-4"></i> Edit Profile Info
        </button>
        <button id="profile-logout-btn" class="border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
          Sign Out
        </button>
      </div>
    </div>
  `;
}

function getProfileEditFormHtml(user) {
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="edit-3" class="w-4 h-4 text-brand-orange"></i>
        Edit Profile Details
      </h3>

      <form id="profile-edit-form" class="flex flex-col gap-3.5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input type="text" id="edit-name" value="${user.fullName}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
            <input type="tel" id="edit-phone" value="${user.phoneNumber}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
          <input type="text" id="edit-addr" value="${user.address}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
            <input type="text" id="edit-city" value="${user.city}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</label>
            <input type="text" id="edit-state" value="${user.state}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
          </div>
        </div>

        <div class="flex gap-2.5 mt-2.5">
          <button type="submit" class="bg-brand-orange hover:bg-brand-orange-dark text-white py-2.5 px-5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm">
            <i data-lucide="check" class="w-4 h-4"></i> Save Changes
          </button>
          <button type="button" id="edit-cancel-btn" class="border border-slate-200 hover:bg-slate-50 text-slate-500 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;
}

function getOrdersViewHtml(statusFilter = null) {
  let orders = getMockOrders() || [];
  let title = 'My Orders';
  let icon = 'package';

  if (statusFilter) {
    if (statusFilter === 'pending') {
      orders = orders.filter(o => o.status && o.status.toLowerCase().includes('pending'));
      title = 'Pending Orders';
      icon = 'clock';
    } else if (statusFilter === 'Processing') {
      orders = orders.filter(o => o.status && (o.status.toLowerCase() === 'processing' || o.status.toLowerCase() === 'packaging'));
      title = 'Processing Orders';
      icon = 'loader';
    } else if (statusFilter === 'Shipped') {
      orders = orders.filter(o => o.status && (o.status.toLowerCase() === 'shipped' || o.status.toLowerCase().includes('dispatch')));
      title = 'Shipped Orders';
      icon = 'truck';
    } else if (statusFilter === 'Delivered') {
      orders = orders.filter(o => o.status && (o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'completed'));
      title = 'Delivered Orders';
      icon = 'check-circle';
    } else if (statusFilter === 'Cancelled') {
      orders = orders.filter(o => o.status && (o.status.toLowerCase() === 'cancelled' || o.status.toLowerCase() === 'canceled'));
      title = 'Cancelled Orders';
      icon = 'x-circle';
    }
  }

  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="${icon}" class="w-4 h-4 text-brand-orange"></i>
        ${title}
      </h3>

      <div class="flex flex-col gap-4" id="orders-list-rows">
        ${getOrdersListHtml(orders)}
      </div>
    </div>
  `;
}

function getOrdersListHtml(orders) {
  if (orders.length === 0) {
    return `
      <div class="text-center py-8">
        <p class="text-slate-400 text-xs italic">You don't have any orders under this category.</p>
        <a href="categories.html" class="mt-3 inline-block bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
          Shop Handcrafted Bags
        </a>
      </div>
    `;
  }

  return orders.map(ord => {
    const totalQty = ord.items.reduce((sum, item) => sum + item.quantity, 0);
    const dateFormatted = ord.date ? new Date(ord.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';
    
    let itemsList = ord.items.map(item => `
      <div class="flex justify-between items-start text-xs border-b border-slate-50 pb-2 last:border-b-0 last:pb-0">
        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-700 truncate">${item.product.name}</p>
          <p class="text-[10px] text-slate-400 mt-0.5">
            Qty: ${item.quantity} ${item.selectedColor ? `| Color: ${item.selectedColor}` : ''}
          </p>
        </div>
        <span class="font-mono font-bold text-slate-800 shrink-0">₦${(item.product.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('<div class="h-2"></div>');

    const payStatus = ord.paymentStatus || 'Pending';
    const ordStatus = ord.status || 'Pending Payment Verification';

    return `
      <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50/20">
        <!-- Order header card -->
        <div class="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div class="flex flex-col">
            <span class="text-[9px] text-slate-400 font-bold uppercase leading-none">Order ID / Number</span>
            <span class="font-mono font-bold text-xs text-slate-800 mt-1">${ord.id}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[9px] text-slate-400 font-bold uppercase leading-none">Date Ordered</span>
            <span class="font-bold text-xs text-slate-800 mt-1">${dateFormatted}</span>
          </div>
        </div>

        <!-- Order details rows -->
        <div class="p-4 flex flex-col gap-3">
          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Products Ordered</span>
            ${itemsList}
          </div>

          <div class="border-t border-slate-150 pt-2.5 mt-1 flex justify-between items-center">
            <span class="text-xs font-bold text-slate-600">Total Amount (including delivery):</span>
            <span class="font-mono font-extrabold text-brand-orange text-sm md:text-base">₦${ord.total.toLocaleString()}</span>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-slate-150 pt-3 mt-1 text-xs">
            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Payment Status</span>
              <div>
                <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase border ${
                  payStatus === 'Approved'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : payStatus === 'Rejected'
                      ? 'bg-red-50 text-red-600 border-red-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                }">
                  ${payStatus}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order Status</span>
              <div>
                <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase border ${
                  ordStatus === 'Paid Successfully' || ordStatus === 'Delivered' || ordStatus === 'completed'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : ordStatus === 'Cancelled'
                      ? 'bg-red-50 text-red-600 border-red-100'
                      : ordStatus === 'Shipped' || ordStatus === 'Verified Dispatch'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                }">
                  ${ordStatus === 'completed' || ordStatus === 'Verified Dispatch' ? 'Verified Dispatch' : ordStatus}
                </span>
              </div>
            </div>
          </div>

          <div class="flex gap-2 justify-end mt-2">
            <a href="https://wa.me/2348126730784?text=Hello%20Gold%20%26%20Rock%2C%20I%20want%20to%20confirm%20my%20Order%20ID%3A%20${ord.id}%20totaling%20%E2%82%A6${ord.total.toLocaleString()}" target="_blank" class="bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold px-3 py-2 rounded-lg flex items-center gap-1">
              <i data-lucide="message-circle" class="w-3.5 h-3.5 fill-white"></i> Confirm on WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getWishlistViewHtml() {
  const items = getMockWishlist();
  
  if (items.length === 0) {
    return `
      <div class="animate-in fade-in duration-300">
        <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
          <i data-lucide="heart" class="w-4 h-4 text-brand-orange"></i>
          My Wishlist
        </h3>
        
        <div class="text-center py-12 flex flex-col items-center justify-center max-w-xs mx-auto">
          <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
            <i data-lucide="heart" class="w-6 h-6 fill-red-100 text-red-500"></i>
          </div>
          <p class="text-slate-850 font-bold text-xs mb-1">Your wishlist is empty</p>
          <p class="text-slate-400 text-[10px] font-light mb-4 text-center">
            You haven't saved any handcrafted bags yet. Keep exploring!
          </p>
          <a href="categories.html" class="bg-[#0f1e36] hover:bg-[#1a3258] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
            Explore Collection
          </a>
        </div>
      </div>
    `;
  }

  const listItemsHTML = items.map(p => `
    <div class="flex items-center gap-3 p-2.5 border border-slate-100 bg-slate-50/50 rounded-xl transition-all">
      <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white cursor-pointer" onclick="window.location.href='product.html?id=${p.id}'">
        <img src="${p.image}" alt="" class="w-full h-full object-cover">
      </div>
      <div class="min-w-0 flex-1">
        <h4 class="font-sans font-bold text-xs text-slate-800 truncate cursor-pointer hover:text-brand-orange" onclick="window.location.href='product.html?id=${p.id}'">
          ${p.name}
        </h4>
        <span class="font-mono text-xs font-extrabold text-[#f68b1e] block mt-0.5">₦${p.price.toLocaleString()}</span>
      </div>
      <div class="flex gap-1">
        <button class="wishlist-add-cart-btn p-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg transition-colors cursor-pointer" data-id="${p.id}" title="Move to Cart">
          <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
        </button>
        <button class="wishlist-remove-btn p-2 border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer" data-id="${p.id}" title="Remove Item">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="heart" class="w-4 h-4 text-brand-orange"></i>
        My Wishlist (${items.length})
      </h3>

      <div class="flex flex-col gap-2.5">
        ${listItemsHTML}
      </div>
    </div>
  `;
}

function getSavedAddressesViewHtml(user) {
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="map-pin" class="w-4 h-4 text-brand-orange"></i>
        Saved Addresses
      </h3>

      <div class="border border-slate-200 bg-slate-50/50 rounded-xl p-4 flex flex-col gap-3 max-w-md">
        <div class="flex items-center gap-2 text-brand-orange">
          <i data-lucide="home" class="w-4 h-4"></i>
          <span class="text-[9px] font-bold tracking-wider uppercase">Default Shipping Address</span>
        </div>
        <div class="flex flex-col gap-1 text-xs text-slate-700 leading-normal">
          <p class="font-bold text-slate-900">${user.fullName}</p>
          <p>${user.address}</p>
          <p>${user.city}, ${user.state}</p>
          <p class="mt-1 text-slate-500 font-mono">📞 ${user.phoneNumber}</p>
        </div>
        <div class="border-t pt-3 mt-1">
          <button id="addresses-edit-btn" class="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent">
            <i data-lucide="edit-3" class="w-3 h-3"></i> Edit Address
          </button>
        </div>
      </div>
    </div>
  `;
}

function getPaymentHistoryViewHtml(user) {
  const orders = getMockOrders();
  
  const paymentsListHTML = orders.length === 0
    ? `
      <div class="text-center py-6 text-slate-400 text-xs italic">No transactions captured under this account.</div>
    `
    : orders.map(ord => `
      <div class="flex items-center justify-between gap-4 p-2.5 border-b border-slate-100 last:border-b-0 text-[11px]">
        <div class="flex flex-col">
          <span class="font-mono font-bold text-slate-950">${ord.id}</span>
          <span class="text-[9px] text-slate-400 mt-0.5">Via Direct Bank Transfer</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-mono font-extrabold text-[#0f1e36]">₦${ord.total.toLocaleString()}</span>
          <span class="text-[8px] font-bold mt-0.5 px-2 py-0.5 rounded ${
            ord.status === 'Paid Successfully' 
              ? 'bg-emerald-100 text-emerald-800' 
              : ord.status === 'completed' || ord.status === 'Verified Dispatch'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
          }">
            ${ord.status === 'Paid Successfully' 
              ? 'Paid Successfully' 
              : ord.status === 'completed' || ord.status === 'Verified Dispatch'
                ? 'Verified Dispatch' 
                : 'Pending Verification'}
          </span>
        </div>
      </div>
    `).join('');

  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="credit-card" class="w-4 h-4 text-brand-orange"></i>
        Payment History
      </h3>

      <div class="flex flex-col gap-4">
        <!-- Transfer Guideline Info Card -->
        <div class="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-slate-700 leading-normal flex flex-col gap-2">
          <h4 class="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            🏦 direct bank payments
          </h4>
          <p>
            Make transfers directly to our corporate bank account below to process customized bags or complete checkout items:
          </p>
          
          <div class="bg-[#0f1e36] text-white p-3 rounded-lg font-mono text-[10px] flex flex-col gap-1 border border-slate-800 relative">
            <p>🏦 <span class="text-slate-400">Bank:</span> Opay</p>
            <p class="flex items-center gap-1.5">🔢 <span class="text-slate-400">Acct No:</span> <span class="text-brand-orange font-bold tracking-wider">8126730784</span></p>
            <p>👤 <span class="text-slate-400">Acct Name:</span> OYEWOLE TOSIN OLUMIDE</p>
          </div>

          <p class="text-[9px] text-slate-500 italic mt-0.5">
            Please share transfer receipt screenshots with CEO OYEWOLE TOSIN OLUMIDE (08126730784) for dispatch approval.
          </p>
        </div>

        <div class="border border-slate-200 rounded-xl p-3.5">
          <h4 class="font-sans font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-2 border-b pb-1.5">
            Recent Payments Logs
          </h4>
          <div class="flex flex-col">
            ${paymentsListHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateWhatsAppOrderLink(order) {
  const phone = "2348126730784";
  const text = `Hello CEO, I would like to inquire about my Gold & Rock order details:\n- *Order ID:* ${order.id}\n- *Customer:* ${order.shippingDetails.fullName}\n- *Total Amount:* ₦${order.total.toLocaleString()}\n- *Status:* ${order.status}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function getForceChangePasswordHtml() {
  return `
    <div class="animate-in fade-in duration-300 max-w-md mx-auto py-8">
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg flex flex-col gap-4 text-center">
        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-brand-orange animate-bounce">
          <i data-lucide="lock" class="w-6 h-6"></i>
        </div>
        <h3 class="font-display font-extrabold text-lg text-[#0f1e36]">Secure Your Admin Account</h3>
        <p class="text-xs text-slate-500 leading-normal">
          Welcome back, <strong class="text-slate-800">OYEWOLE TOSIN OLUMIDE</strong>. For secure access, you must change the temporary password <span class="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-brand-orange">promise</span> before entering the dashboard workspace.
        </p>
        <form id="admin-force-password-form" class="flex flex-col gap-3 mt-2 text-left">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">New Security Password *</label>
            <input type="password" id="admin-new-pass" required placeholder="Minimum 6 characters" minlength="6" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">Confirm Password *</label>
            <input type="password" id="admin-confirm-pass" required placeholder="Repeat new password" minlength="6" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
          </div>
          <button type="submit" id="admin-force-password-btn" class="w-full bg-[#f68b1e] hover:bg-[#e07a1b] text-white py-2.5 rounded-lg text-xs font-bold uppercase cursor-pointer border-0 mt-2">
            Change Password & Continue
          </button>
        </form>
      </div>
    </div>
  `;
}

function getInlineEditProductFormHtml(prod = null) {
  const isEdit = !!prod;
  const requiredCategories = [
    { id: "school-bags", name: "School Bags" },
    { id: "ladies-hand-bags", name: "Ladies Handbags" },
    { id: "laptop-bags", name: "Laptop Bags" },
    { id: "lunch-bags", name: "Lunch Bags" },
    { id: "office-bags", name: "Office Bags" },
    { id: "mens-purses", name: "Men's Purse" },
    { id: "travelling-bags", name: "Travel Bags" },
    { id: "accessories", name: "Accessories" }
  ];
  
  const options = `
    <option value="">-- Choose Category --</option>
    ${requiredCategories.map(cat => `
      <option value="${cat.id}" ${isEdit && prod.category === cat.id ? 'selected' : ''}>${cat.name}</option>
    `).join('')}
  `;

  // Specs joined by newline for textarea edit
  const specsText = isEdit && Array.isArray(prod.specifications) ? prod.specifications.join('\n') : '';
  const coloursText = isEdit && Array.isArray(prod.colours) ? prod.colours.join(', ') : '';
  const sizesText = isEdit && Array.isArray(prod.sizes) ? prod.sizes.join(', ') : '';

  return `
    <form id="admin-edit-product-form" class="bg-white border-2 border-[#0f1e36] rounded-xl p-5 flex flex-col gap-4 shadow-md mb-5 animate-in slide-in-from-top duration-300 text-left">
      <div class="flex items-center justify-between border-b pb-2 mb-2">
        <div class="flex items-center gap-2">
          <i data-lucide="${isEdit ? 'edit-3' : 'plus-circle'}" class="w-4.5 h-4.5 text-brand-orange"></i>
          <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider">${isEdit ? `Modify Product Details: ${prod.name}` : 'Add New Catalog Product'}</h4>
        </div>
        <button type="button" id="admin-edit-product-cancel-btn" class="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
          <input type="text" id="edit-prod-name" required value="${isEdit ? prod.name : ''}" placeholder="e.g., Luxury Briefcase XL" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product ID (Slug) *</label>
          <input type="text" id="edit-prod-id" ${isEdit ? 'readonly' : ''} required value="${isEdit ? prod.id : ''}" placeholder="e.g., luxury-briefcase-xl" class="w-full px-3 py-2 ${isEdit ? 'bg-slate-100 text-slate-500' : 'bg-slate-50'} border border-slate-200 rounded-lg text-xs font-mono focus:outline-none">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category *</label>
          <select id="edit-prod-category" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">
            ${options}
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (₦) *</label>
          <input type="number" id="edit-prod-price" required value="${isEdit ? prod.price : ''}" placeholder="e.g., 45000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Old Price (₦) (Optional)</label>
          <input type="number" id="edit-prod-old-price" value="${isEdit && prod.oldPrice ? prod.oldPrice : ''}" placeholder="e.g., 60000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Percentage (%)</label>
          <input type="text" id="edit-prod-discount" readonly value="${isEdit ? prod.discountPercentage || 0 : 0}%" placeholder="Calculated automatically" class="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 focus:outline-none">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Quantity *</label>
          <input type="number" id="edit-prod-stock" required value="${isEdit ? prod.stock ?? 10 : 10}" placeholder="e.g., 15" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Description *</label>
        <textarea id="edit-prod-description" required rows="3" placeholder="Handcrafted with vegetable-tanned leather..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">${isEdit ? (prod.description || '') : ''}</textarea>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Specifications * (one specification per line)</label>
        <textarea id="edit-prod-specifications" required rows="4" placeholder="100% genuine vegetable-tanned Nigerian leather&#10;Durable metal hardware&#10;Dimensions: 12&quot; x 14&quot; x 4&quot;" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">${specsText}</textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Colours * (comma separated)</label>
          <input type="text" id="edit-prod-colours" required value="${coloursText}" placeholder="Classic Black, Vintage Brown, Tan Gold" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Sizes (Optional, comma separated)</label>
          <input type="text" id="edit-prod-sizes" value="${sizesText}" placeholder="S, M, L, XL" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none">
        </div>
      </div>

      <!-- Switches for Flags -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col gap-2.5">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Product Badges & Visibility Flags</span>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label class="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" id="edit-prod-featured" ${isEdit && prod.featured ? 'checked' : ''} class="w-4 h-4 accent-brand-orange">
            <span>Featured Product</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" id="edit-prod-flash" ${isEdit && prod.flashSale ? 'checked' : ''} class="w-4 h-4 accent-brand-orange">
            <span>Flash Sale</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" id="edit-prod-new" ${isEdit && prod.newArrival ? 'checked' : ''} class="w-4 h-4 accent-brand-orange">
            <span>New Arrival</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" id="edit-prod-best" ${isEdit && prod.bestSeller ? 'checked' : ''} class="w-4 h-4 accent-brand-orange">
            <span>Best Seller</span>
          </label>
          <div class="flex items-center gap-2 col-span-2 sm:col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">Status:</label>
            <select id="edit-prod-status" class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none text-slate-800">
              <option value="active" ${isEdit && prod.status === 'active' ? 'selected' : ''}>Published (Active)</option>
              <option value="hidden" ${isEdit && prod.status === 'hidden' ? 'selected' : ''}>Hidden (Draft)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Image upload section -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Images (Upload 1 to 6 images) *</label>
        
        <div id="edit-image-drag-drop-zone" class="border border-dashed border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-1.5 hover:border-brand-orange/60 transition-colors cursor-pointer bg-slate-50">
          <i data-lucide="image-plus" class="w-8 h-8 text-slate-400"></i>
          <span class="text-[11px] font-bold text-slate-700">Click to browse or drop up to 6 images</span>
          <span class="text-[9px] text-slate-400">Images are auto-compressed to ensure premium quality under 500KB</span>
          <input type="file" id="edit-prod-image-file" accept="image/*" multiple class="hidden">
        </div>

        <!-- Selected image list thumbnails -->
        <div id="edit-image-previews-list" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          <p class="text-[10px] text-slate-400 italic col-span-full">No new images selected</p>
        </div>

        ${isEdit && prod.images && prod.images.length > 0 ? `
          <!-- Existing Images Preview list -->
          <div class="mt-2.5 border-t pt-2.5">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Images on Server:</span>
            <div class="flex flex-wrap gap-2 mt-1">
              ${prod.images.map(img => `
                <img src="${img}" class="w-12 h-12 object-cover rounded border bg-white shadow-xs">
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <button type="submit" id="admin-edit-product-btn" class="w-full bg-[#0f1e36] hover:bg-[#1a3258] text-white py-3 rounded-xl text-xs font-bold transition-colors uppercase cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-md">
        <i data-lucide="check" class="w-4 h-4"></i> ${isEdit ? 'Save Modifications' : 'Register New Product'}
      </button>
    </form>
  `;
}

function getInlineCategoryFormHtml(cat = null) {
  const isEdit = !!cat;
  return `
    <form id="admin-category-form" class="bg-white border-2 border-[#0f1e36] rounded-xl p-5 flex flex-col gap-4 shadow-md mb-5 animate-in slide-in-from-top duration-300 text-left">
      <div class="flex items-center justify-between border-b pb-2 mb-2">
        <div class="flex items-center gap-2">
          <i data-lucide="${isEdit ? 'edit-3' : 'plus-circle'}" class="w-4.5 h-4.5 text-brand-orange"></i>
          <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider">${isEdit ? 'Modify Category' : 'Create Custom Category'}</h4>
        </div>
        <button type="button" id="admin-category-form-close-btn" class="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Slug ID *</label>
          <input type="text" id="cat-slug" required ${isEdit ? 'readonly bg-slate-100 text-slate-500' : 'bg-slate-50'} value="${isEdit ? cat.id : ''}" placeholder="e.g., luxury-briefcases" class="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Display Name *</label>
          <input type="text" id="cat-name" required value="${isEdit ? cat.name : ''}" placeholder="e.g., Luxury Briefcases" class="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none">
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Display Banner Image</label>
        <div id="cat-image-zone" class="border border-dashed border-slate-200 rounded-xl p-4 text-center flex flex-col items-center justify-center gap-1 hover:border-brand-orange/60 transition-colors cursor-pointer bg-slate-50">
          <i data-lucide="image" class="w-6 h-6 text-slate-400"></i>
          <span class="text-[10px] font-bold text-slate-600">Click to browse or drop banner image</span>
          <input type="file" id="cat-image-file" accept="image/*" class="hidden">
        </div>
        <div id="cat-preview-container" class="mt-2 ${isEdit ? 'flex' : 'hidden'} items-center gap-3 bg-slate-50 border p-2 rounded-lg">
          <img id="cat-preview-img" src="${isEdit ? cat.image : ''}" class="w-12 h-8 object-cover rounded border bg-white">
          <div class="flex-1 min-w-0">
            <p id="cat-preview-filename" class="text-[10px] font-bold text-slate-800 truncate">${isEdit ? 'Existing Banner' : 'Selected Banner'}</p>
          </div>
        </div>
      </div>

      <button type="submit" id="admin-category-save-btn" class="w-full bg-[#0f1e36] hover:bg-[#1a3258] text-white py-2.5 rounded-xl text-xs font-bold transition-colors uppercase cursor-pointer border-0 shadow-sm flex items-center justify-center gap-1.5">
        <i data-lucide="check" class="w-4 h-4"></i> ${isEdit ? 'Update Category' : 'Register Category'}
      </button>
    </form>
  `;
}

function getAdminConsoleViewHtml() {
  const user = getMockCurrentUser();
  if (user && user.needsPasswordChange) {
    return getForceChangePasswordHtml();
  }

  const orders = getMockOrders() || [];
  const products = getMockProducts() || [];
  const categories = getMockCategories() || [];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'package' },
    { id: 'categories', label: 'Categories', icon: 'folder' },
    { id: 'orders', label: 'Orders', icon: 'shopping-cart' },
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'payments', label: 'Payments', icon: 'credit-card' },
    { id: 'flash-sales', label: 'Flash Sales', icon: 'zap' },
    { id: 'new-arrivals', label: 'New Arrivals', icon: 'sparkles' },
    { id: 'featured-products', label: 'Featured', icon: 'star' },
    { id: 'banner-manager', label: 'Banners', icon: 'image' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart-2' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  const subNavHTML = `
    <div class="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-5 border-b border-slate-100 scrollbar-none">
      ${adminTabs.map(t => {
        const active = adminActiveSection === t.id;
        return `
          <button data-section="${t.id}" class="admin-section-tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all border-0 ${
            active ? 'bg-[#0f1e36] text-white shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
          }">
            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
            <span>${t.label}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  let contentHTML = '';

  if (adminActiveSection === 'dashboard') {
    const paidOrders = orders.filter(o => o.paymentStatus === 'Approved' || o.status === 'Paid Successfully' || o.status === 'completed' || o.status === 'Verified Dispatch');
    const totalRev = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStock = products.filter(p => (p.stock ?? 0) <= 3);
    const activeCustomersCount = localStorage.getItem('gr_last_customers_count') || 12;

    contentHTML = `
      <div class="flex flex-col gap-5 text-left animate-in fade-in duration-300">
        <div class="bg-[#0f1e36] text-white p-4 rounded-xl border border-slate-800 text-xs shadow-md">
          <div class="flex items-center gap-2 text-brand-orange mb-1">
            <i data-lucide="shield" class="w-4.5 h-4.5"></i>
            <h4 class="font-extrabold uppercase tracking-wider text-[11px]">CEO Control Panel</h4>
          </div>
          <p class="text-slate-300 font-light leading-relaxed">
            Welcome back, <strong class="text-white font-bold">OYEWOLE TOSIN OLUMIDE</strong>. You are securely connected to the live Gold & Rock leather database.
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div class="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl flex flex-col gap-1">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Sales</span>
            <span class="text-slate-900 font-extrabold text-xs font-mono">₦${totalRev.toLocaleString()}</span>
          </div>
          <div class="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl flex flex-col gap-1">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Orders</span>
            <span class="text-slate-900 font-extrabold text-xs font-mono">${orders.length}</span>
          </div>
          <div class="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl flex flex-col gap-1">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Subscribed</span>
            <span class="text-slate-900 font-extrabold text-xs font-mono">${activeCustomersCount}</span>
          </div>
          <div class="bg-amber-50 border border-amber-100 p-3.5 rounded-xl flex flex-col gap-1">
            <span class="text-[9px] text-amber-500 font-bold uppercase tracking-wider block">Low Stock Alerts</span>
            <span class="text-amber-700 font-extrabold text-xs font-mono">${lowStock.length}</span>
          </div>
        </div>

        ${lowStock.length > 0 ? `
          <div class="border border-amber-200 bg-amber-50/40 rounded-xl p-3 text-xs flex flex-col gap-2">
            <span class="font-bold text-amber-800 flex items-center gap-1"><i data-lucide="alert-triangle" class="w-4 h-4"></i> Stock Refill Required</span>
            <div class="grid grid-cols-1 gap-2">
              ${lowStock.map(p => `
                <div class="flex items-center justify-between text-[11px] bg-white border border-amber-100 p-2 rounded-lg">
                  <span class="font-semibold text-slate-700">${p.name} (Stock Left: <strong class="text-red-500 font-bold">${p.stock || 0}</strong>)</span>
                  <div class="flex items-center gap-1.5">
                    <input type="number" id="quick-stock-${p.id}" value="${p.stock || 0}" class="w-12 px-1.5 py-1 text-center border rounded font-mono text-[10px]">
                    <button data-id="${p.id}" class="quick-stock-update-btn bg-brand-orange hover:bg-[#e07a1b] text-white font-bold px-2 py-1 rounded text-[9px] border-0 cursor-pointer">Refill</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="border border-slate-200 rounded-xl p-3.5">
          <h4 class="font-sans font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-2 border-b pb-1.5">
            Recent Orders Log
          </h4>
          <div class="flex flex-col">
            ${orders.length === 0 ? `
              <div class="text-center py-6 text-slate-400 text-xs italic">No orders received yet.</div>
            ` : orders.slice(0, 5).map(ord => `
              <div class="flex items-center justify-between gap-4 p-2 border-b border-slate-100 last:border-b-0 text-[11px]">
                <div class="flex flex-col">
                  <span class="font-mono font-bold text-slate-900">${ord.id}</span>
                  <span class="text-[9px] text-slate-400 mt-0.5">${ord.shippingDetails.fullName}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="font-mono font-extrabold text-[#0f1e36]">₦${ord.total.toLocaleString()}</span>
                  <span class="text-[8px] font-bold uppercase mt-0.5 px-1.5 py-0.5 rounded ${
                    ord.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }">
                    ${ord.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'products') {
    let productRows = products.map((p, idx) => {
      // Visual indicators/badges
      let badges = [];
      if (p.featured) badges.push(`<span class="text-[8px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-extrabold uppercase tracking-wide">Featured</span>`);
      if (p.flashSale) badges.push(`<span class="text-[8px] bg-red-100 text-red-800 px-1 py-0.5 rounded font-extrabold uppercase tracking-wide">Flash Sale</span>`);
      if (p.newArrival) badges.push(`<span class="text-[8px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-extrabold uppercase tracking-wide">New</span>`);
      if (p.bestSeller) badges.push(`<span class="text-[8px] bg-purple-100 text-purple-800 px-1 py-0.5 rounded font-extrabold uppercase tracking-wide">Bestseller</span>`);
      
      const badgeList = badges.length > 0 ? `<div class="flex flex-wrap gap-1 mt-1">${badges.join('')}</div>` : '';

      // Stock status visual alerts
      let stockAlert = '';
      if (Number(p.stock) === 0) {
        stockAlert = `<span class="text-[8px] font-bold text-red-500 uppercase block mt-1">● Out of Stock</span>`;
      } else if (Number(p.stock) > 0 && Number(p.stock) <= 5) {
        stockAlert = `<span class="text-[8px] font-bold text-amber-500 uppercase block mt-1">● Low Stock (${p.stock})</span>`;
      } else {
        stockAlert = `<span class="text-[8px] font-semibold text-emerald-500 block mt-1">✓ In Stock</span>`;
      }

      // Readable Date
      let dateString = '2026-07-14';
      if (p.createdAt) {
        try {
          dateString = p.createdAt.split('T')[0];
        } catch(e) {}
      }

      const isPublished = p.status !== 'hidden';

      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-[11px] text-slate-700">
          <td class="py-2.5 px-2 font-mono font-bold text-slate-400">${p.id}</td>
          <td class="py-2.5 px-2">
            <div class="flex items-center gap-2">
              <img src="${p.image}" class="w-10 h-10 object-cover rounded border bg-slate-50">
              <div class="flex flex-col min-w-0">
                <span class="font-bold text-slate-950 leading-tight truncate">${p.name}</span>
                ${badgeList}
              </div>
            </div>
          </td>
          <td class="py-2.5 px-2 text-slate-800 uppercase text-[9px] font-extrabold">
            ${(() => {
              const categoryMap = {
                'school-bags': 'School Bags',
                'ladies-hand-bags': 'Ladies Handbags',
                'laptop-bags': 'Laptop Bags',
                'lunch-bags': 'Lunch Bags',
                'office-bags': 'Office Bags',
                'mens-purses': "Men's Purse",
                'travelling-bags': 'Travel Bags',
                'accessories': 'Accessories'
              };
              return categoryMap[p.category] || p.category;
            })()}
          </td>
          <td class="py-2.5 px-2">
            <div class="flex items-center gap-1">
              <input type="number" id="prod-price-input-${p.id}" value="${p.price}" class="w-18 px-1.5 py-1 border rounded font-mono text-center text-xs text-slate-800">
              <button data-id="${p.id}" class="prod-price-update-btn bg-slate-100 hover:bg-slate-200 text-[#0f1e36] px-1.5 py-1 rounded font-bold border-0 cursor-pointer text-[10px]" title="Save new price">Save</button>
            </div>
          </td>
          <td class="py-2.5 px-2">
            <div class="flex items-center gap-1">
              <input type="number" id="prod-stock-input-${p.id}" value="${p.stock ?? 10}" class="w-12 px-1 py-1 border rounded font-mono text-center text-xs text-slate-800">
              <button data-id="${p.id}" class="prod-stock-update-btn bg-slate-100 hover:bg-slate-200 text-[#0f1e36] px-1.5 py-1 rounded font-bold border-0 cursor-pointer text-[10px]" title="Refill stock">Refill</button>
            </div>
            ${stockAlert}
          </td>
          <td class="py-2.5 px-2">
            <button data-id="${p.id}" class="prod-status-toggle-btn px-2 py-1 font-bold uppercase rounded text-[9px] border-0 cursor-pointer ${
              isPublished ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
            }">
              ${isPublished ? 'Published' : 'Hidden'}
            </button>
          </td>
          <td class="py-2.5 px-2 font-mono text-slate-400 text-[10px]">${dateString}</td>
          <td class="py-2.5 px-2 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button data-id="${p.id}" class="prod-edit-trigger-btn text-slate-500 hover:text-blue-600 bg-transparent border-0 cursor-pointer p-1" title="Edit Product">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button data-id="${p.id}" class="prod-duplicate-trigger-btn text-slate-400 hover:text-indigo-600 bg-transparent border-0 cursor-pointer p-1" title="Duplicate/Clone Product">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              </button>
              <button data-id="${p.id}" class="prod-delete-trigger-btn text-slate-300 hover:text-red-500 bg-transparent border-0 cursor-pointer p-1" title="Delete Product">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <div class="flex justify-between items-center border-b pb-2">
          <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="package" class="w-4.5 h-4.5 text-brand-orange"></i> Catalog Products (${products.length})
          </h4>
          <button id="admin-add-prod-btn" class="bg-[#0f1e36] hover:bg-[#1c355c] text-white font-bold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1 uppercase tracking-wide border-0 shadow-xs">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Add New Product
          </button>
        </div>

        <div id="admin-product-crud-form-container" class="hidden"></div>

        <div class="overflow-x-auto border rounded-xl bg-white max-h-[600px] shadow-xs">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-2.5 px-2 w-16">ID</th>
                <th class="py-2.5 px-2">Product Info</th>
                <th class="py-2.5 px-2 w-24">Category</th>
                <th class="py-2.5 px-2 w-32">Price (₦)</th>
                <th class="py-2.5 px-2 w-28">Stock</th>
                <th class="py-2.5 px-2 w-24">Status</th>
                <th class="py-2.5 px-2 w-24">Date Created</th>
                <th class="py-2.5 px-2 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${productRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'categories') {
    let categoryRows = categories.map((c, idx) => `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-[11px] text-slate-700">
        <td class="py-3 px-2 font-mono font-bold">${c.id}</td>
        <td class="py-3 px-2">
          <div class="flex items-center gap-2">
            <img src="${c.image}" class="w-8 h-8 object-cover rounded border bg-slate-50">
            <span class="font-bold text-slate-900">${c.name}</span>
          </div>
        </td>
        <td class="py-3 px-2 font-mono text-slate-500 font-bold">${c.orderIndex || 0}</td>
        <td class="py-3 px-2">
          <div class="flex items-center gap-1">
            <button data-idx="${idx}" class="cat-move-up-btn bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded border-0 cursor-pointer disabled:opacity-30" ${idx === 0 ? 'disabled' : ''}>
              <i data-lucide="arrow-up" class="w-3 h-3"></i>
            </button>
            <button data-idx="${idx}" class="cat-move-down-btn bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded border-0 cursor-pointer disabled:opacity-30" ${idx === categories.length - 1 ? 'disabled' : ''}>
              <i data-lucide="arrow-down" class="w-3 h-3"></i>
            </button>
          </div>
        </td>
        <td class="py-3 px-2 text-right">
          <div class="flex items-center justify-end gap-2">
            <button data-id="${c.id}" class="cat-edit-trigger-btn text-slate-500 hover:text-blue-600 bg-transparent border-0 cursor-pointer p-1">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button data-id="${c.id}" class="cat-delete-trigger-btn text-slate-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-1">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <div class="flex justify-between items-center border-b pb-2">
          <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="folder" class="w-4.5 h-4.5 text-brand-orange"></i> Category Manager (${categories.length})
          </h4>
          <button id="admin-add-cat-btn" class="bg-[#0f1e36] hover:bg-[#1c355c] text-white font-bold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1 uppercase tracking-wide border-0 shadow-xs">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Add Category
          </button>
        </div>

        <div id="admin-category-form-container" class="hidden"></div>

        <div class="overflow-x-auto border rounded-xl bg-white">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-2.5 px-2">Slug ID</th>
                <th class="py-2.5 px-2">Category Name</th>
                <th class="py-2.5 px-2">Index</th>
                <th class="py-2.5 px-2 w-20">Rank</th>
                <th class="py-2.5 px-2 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${categories.length === 0 ? '<tr><td colspan="5" class="py-10 text-center text-slate-400 italic">No custom categories.</td></tr>' : categoryRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'orders') {
    let ordersListHTML = '';
    if (orders.length === 0) {
      ordersListHTML = `
        <div class="text-center py-10 bg-slate-50 border border-dashed rounded-2xl p-6">
          <p class="text-slate-400 text-xs italic">No orders logged in system database yet.</p>
        </div>
      `;
    } else {
      ordersListHTML = orders.map(ord => {
        let itemsList = ord.items.map(item => `
          <div class="flex justify-between text-[11px] text-slate-600 font-mono">
            <span>${item.product.name} (Qty: ${item.quantity})</span>
            <span>₦${(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        `).join('');

        const statusOptions = ["pending", "Processing", "Packaging", "Shipped", "Delivered", "Cancelled"].map(st => {
          const isSelected = ord.status === st || (st === 'pending' && (ord.status === 'Pending Payment Verification' || ord.status === 'pending'));
          return `<option value="${st}" ${isSelected ? 'selected' : ''}>${st === 'pending' ? 'Pending Verification' : st}</option>`;
        }).join('');

        const waLink = generateWhatsAppOrderLink(ord);

        return `
          <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
            <div class="flex justify-between items-start border-b border-slate-100 pb-2">
              <div>
                <span class="text-[9px] font-bold text-slate-400 uppercase block">Order ID</span>
                <span class="font-mono font-bold text-xs text-[#0f1e36]">${ord.id}</span>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-bold text-slate-400 uppercase block">Customer Details</span>
                <span class="font-semibold text-xs text-slate-800 block">${ord.shippingDetails.fullName}</span>
                <span class="text-[9px] text-slate-500 font-mono">${ord.shippingDetails.phoneNumber}</span>
              </div>
            </div>

            <div class="flex flex-col gap-1.5 border-b border-slate-100 pb-2">
              <span class="text-[9px] font-bold text-slate-400 uppercase">Items List</span>
              ${itemsList}
              <div class="flex justify-between font-bold text-xs mt-1 text-slate-800">
                <span>Payment:</span>
                <span class="text-brand-orange font-mono">₦${ord.total.toLocaleString()} (${ord.paymentMethod === 'cash_on_delivery' ? 'COD' : 'Bank Transfer'})</span>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold text-slate-400 uppercase block">Modifier</span>
                <select data-id="${ord.id}" class="order-status-change-select px-2 py-1 text-xs border rounded bg-slate-50">
                  ${statusOptions}
                </select>
              </div>

              <a href="${waLink}" target="_blank" class="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[9px] px-3 py-1.5 rounded-lg flex items-center gap-1 uppercase no-underline">
                <i data-lucide="message-square" class="w-3 h-3 fill-white"></i> WhatsApp Alert
              </a>
            </div>
          </div>
        `;
      }).join('<div class="h-4"></div>');
    }

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="shopping-cart" class="w-4.5 h-4.5 text-brand-orange"></i> Live Customer Orders (${orders.length})
        </h4>
        <div class="flex flex-col gap-3">
          ${ordersListHTML}
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'customers') {
    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="users" class="w-4.5 h-4.5 text-brand-orange"></i> Customer Database Accounts
        </h4>
        <div class="overflow-x-auto border rounded-xl bg-white">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-2.5 px-3">Name</th>
                <th class="py-2.5 px-3">Contact</th>
                <th class="py-2.5 px-3">Default Location</th>
                <th class="py-2.5 px-3 text-right">Spent (₦)</th>
              </tr>
            </thead>
            <tbody id="admin-customers-table-body">
              <tr>
                <td colspan="4" class="py-8 text-center text-slate-400 text-xs italic">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-brand-orange" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Loading Live Accounts...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    setTimeout(async () => {
      const customers = await window.getCustomersList();
      const body = document.getElementById('admin-customers-table-body');
      if (body) {
        localStorage.setItem('gr_last_customers_count', customers.length);
        if (customers.length === 0) {
          body.innerHTML = '<tr><td colspan="4" class="py-6 text-center text-slate-400 italic">No active customer accounts registered yet.</td></tr>';
        } else {
          body.innerHTML = customers.map(c => {
            const customerOrders = orders.filter(o => o.userId === c.uid);
            const spent = customerOrders.filter(o => o.paymentStatus === 'Approved' || o.status === 'Paid Successfully' || o.status === 'completed' || o.status === 'Verified Dispatch').reduce((sum, o) => sum + (o.total || 0), 0);
            return `
              <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-[11px] text-slate-700">
                <td class="py-3 px-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-[#0f1e36] text-white rounded-full flex items-center justify-center font-bold text-[10px] uppercase">${c.fullName ? c.fullName.charAt(0) : 'U'}</div>
                    <span class="font-bold text-slate-950 block">${c.fullName || 'Anonymous'}</span>
                  </div>
                </td>
                <td class="py-3 px-3">
                  <p class="font-medium">${c.email}</p>
                  <p class="font-mono text-[10px] text-slate-400">${c.phoneNumber || 'N/A'}</p>
                </td>
                <td class="py-3 px-3 text-slate-500">${c.address || 'Kwara'}, ${c.city || 'Ilorin'}, ${c.state || 'Kwara State'}</td>
                <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">₦${spent.toLocaleString()}</td>
              </tr>
            `;
          }).join('');
        }
      }
    }, 200);
  }

  else if (adminActiveSection === 'payments') {
    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="credit-card" class="w-4.5 h-4.5 text-brand-orange"></i> Payments Verification Desk
        </h4>
        <div class="overflow-x-auto border rounded-xl bg-white">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-2.5 px-3">Order ID</th>
                <th class="py-2.5 px-3">Amount</th>
                <th class="py-2.5 px-3">Verification State</th>
                <th class="py-2.5 px-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody id="admin-payments-table-body">
              <tr>
                <td colspan="4" class="py-8 text-center text-slate-400 text-xs italic">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-brand-orange" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Loading Transaction Audits...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    setTimeout(async () => {
      const payments = await window.getAllPaymentsList();
      const body = document.getElementById('admin-payments-table-body');
      if (body) {
        if (payments.length === 0) {
          body.innerHTML = '<tr><td colspan="4" class="py-6 text-center text-slate-400 italic">No bank transfer logs found in Firestore.</td></tr>';
        } else {
          body.innerHTML = payments.map(p => {
            const isPending = p.status === 'Pending';
            return `
              <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-[11px] text-slate-700">
                <td class="py-3 px-3 font-mono font-bold">${p.orderId}</td>
                <td class="py-3 px-3 font-mono font-extrabold text-[#0f1e36]">₦${p.amount.toLocaleString()}</td>
                <td class="py-3 px-3">
                  <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    p.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }">
                    ${p.status}
                  </span>
                </td>
                <td class="py-3 px-3 text-right">
                  ${isPending ? `
                    <div class="flex items-center justify-end gap-1.5">
                      <button data-id="${p.orderId}" class="payment-verify-approve-btn bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] px-2.5 py-1.5 rounded border-0 cursor-pointer shadow-xs">Approve</button>
                      <button data-id="${p.orderId}" class="payment-verify-reject-btn bg-red-500 hover:bg-red-600 text-white font-bold text-[9px] px-2.5 py-1.5 rounded border-0 cursor-pointer shadow-xs">Reject</button>
                    </div>
                  ` : `
                    <span class="text-[9px] text-slate-400 italic">Audit Log Locked</span>
                  `}
                </td>
              </tr>
            `;
          }).join('');

          // Bind click event handlers directly to the newly created elements
          body.querySelectorAll('.payment-verify-approve-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const orderId = btn.getAttribute('data-id');
              btn.disabled = true;
              btn.innerHTML = 'Approving...';
              try {
                await window.approveOrderPayment(orderId);
                showNotification("Payment Approved Successfully.", "success");
                renderAccountView();
              } catch (err) {
                console.error("Approve payment failed:", err);
                showNotification(err.message || String(err), "danger");
                btn.disabled = false;
                btn.innerHTML = 'Approve';
              }
            });
          });

          body.querySelectorAll('.payment-verify-reject-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const orderId = btn.getAttribute('data-id');
              btn.disabled = true;
              btn.innerHTML = 'Rejecting...';
              try {
                await window.rejectOrderPayment(orderId);
                showNotification("Payment Rejected Successfully.", "success");
                renderAccountView();
              } catch (err) {
                console.error("Reject payment failed:", err);
                showNotification(err.message || String(err), "danger");
                btn.disabled = false;
                btn.innerHTML = 'Reject';
              }
            });
          });
        }
      }
    }, 200);
  }

  else if (adminActiveSection === 'flash-sales') {
    let rowHtml = products.map(p => `
      <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <img src="${p.image}" class="w-8 h-8 object-cover rounded border">
          <div class="flex flex-col">
            <span class="font-bold text-slate-900">${p.name}</span>
            <span class="text-[9px] text-slate-400 font-mono">Price: ₦${p.price.toLocaleString()}</span>
          </div>
        </div>
        <button data-id="${p.id}" class="flash-sale-toggle-btn px-3 py-1.5 font-bold uppercase rounded text-[10px] border-0 cursor-pointer ${
          p.isFlashSale ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }">
          ${p.isFlashSale ? '★ Active Sale' : 'Add to Flash'}
        </button>
      </div>
    `).join('');

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="zap" class="w-4.5 h-4.5 text-brand-orange animate-pulse"></i> Flash Sales Manager
        </h4>
        <p class="text-[10px] text-slate-500">Products placed on Flash Sale will have countdown indicators and discount price displays on the homepage.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          ${rowHtml}
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'new-arrivals') {
    let rowHtml = products.map(p => `
      <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <img src="${p.image}" class="w-8 h-8 object-cover rounded border">
          <span class="font-bold text-slate-900">${p.name}</span>
        </div>
        <button data-id="${p.id}" class="new-arrival-toggle-btn px-3 py-1.5 font-bold uppercase rounded text-[10px] border-0 cursor-pointer ${
          p.isNew ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }">
          ${p.isNew ? '★ New Arrival' : 'Mark New'}
        </button>
      </div>
    `).join('');

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="sparkles" class="w-4.5 h-4.5 text-brand-orange"></i> New Arrivals Manager
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          ${rowHtml}
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'featured-products') {
    let rowHtml = products.map(p => `
      <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <img src="${p.image}" class="w-8 h-8 object-cover rounded border">
          <span class="font-bold text-slate-900">${p.name}</span>
        </div>
        <button data-id="${p.id}" class="featured-toggle-btn px-3 py-1.5 font-bold uppercase rounded text-[10px] border-0 cursor-pointer ${
          p.isFeatured ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }">
          ${p.isFeatured ? '★ Featured' : 'Mark Featured'}
        </button>
      </div>
    `).join('');

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="star" class="w-4.5 h-4.5 text-brand-orange"></i> Featured Products Selector
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          ${rowHtml}
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'banner-manager') {
    const currentSlides = SLIDES || [];
    let listHTML = currentSlides.map((s, idx) => `
      <div class="border border-slate-200 bg-white p-3 rounded-xl flex flex-col gap-2 shadow-xs text-xs mb-3">
        <div class="flex items-center gap-3">
          <img src="${s.image}" class="w-16 h-12 object-cover rounded border bg-slate-50">
          <div class="flex-1 min-w-0">
            <span class="text-[9px] uppercase font-bold text-brand-orange tracking-wider block">${s.accent || 'SLIDE ACCENT'}</span>
            <span class="font-bold text-slate-950 block truncate">${s.title}</span>
            <span class="text-[10px] text-slate-400 block truncate">${s.subtitle}</span>
          </div>
        </div>
        <div class="flex justify-between items-center border-t pt-2 mt-1">
          <span class="text-[9px] font-mono text-slate-400">Target: ${s.ctaUrl || 'None'}</span>
          <button data-idx="${idx}" class="banner-delete-btn text-red-500 hover:bg-red-50 p-1 rounded border-0 bg-transparent cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');

    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <div class="flex justify-between items-center border-b pb-2">
          <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="image" class="w-4.5 h-4.5 text-brand-orange"></i> Homepage Banner Slider
          </h4>
          <button id="admin-add-banner-btn" class="bg-[#0f1e36] hover:bg-[#1c355c] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg border-0 cursor-pointer uppercase tracking-wide shadow-xs">Add New Slide</button>
        </div>

        <div id="admin-banner-form-container" class="hidden bg-slate-50 border p-4 rounded-xl flex flex-col gap-3">
          <div class="flex items-center justify-between border-b pb-1.5 mb-1.5">
            <span class="font-bold text-[10px] uppercase text-slate-700">Configure Slide Details</span>
            <button id="admin-banner-form-close-btn" type="button" class="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"><i data-lucide="x" class="w-4 h-4"></i></button>
          </div>
          <form id="admin-banner-add-form" class="flex flex-col gap-2.5">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase">Image URL *</label>
              <input type="url" id="slide-image-url" required placeholder="https://images.unsplash.com/..." class="w-full px-2.5 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:border-brand-orange">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase">Accent Tagline</label>
                <input type="text" id="slide-accent" placeholder="GOLD & ROCK EXCLUSIVE" class="w-full px-2.5 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:border-brand-orange">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase">Slide Heading Title *</label>
                <input type="text" id="slide-title" required placeholder="Custom Briefcases" class="w-full px-2.5 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:border-brand-orange">
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase">Slide Paragraph Subtitle *</label>
              <input type="text" id="slide-subtitle" required placeholder="Nigeria's best premium full-grain leather designs..." class="w-full px-2.5 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:border-brand-orange">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase">CTA Button Text</label>
                <input type="text" id="slide-cta-text" placeholder="Shop Now" class="w-full px-2.5 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:border-brand-orange">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase">CTA Link (HTML File) *</label>
                <input type="text" id="slide-cta-url" required placeholder="categories.html" class="w-full px-2.5 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:border-brand-orange">
              </div>
            </div>
            <button type="submit" class="w-full bg-brand-orange hover:bg-brand-orange-dark text-white py-2 rounded-lg text-xs font-bold uppercase cursor-pointer border-0 mt-2 shadow-xs">Insert Slide</button>
          </form>
        </div>

        <div class="flex flex-col">
          ${listHTML === '' ? '<p class="text-xs text-slate-400 italic">No slides found in settings.</p>' : listHTML}
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'analytics') {
    const totalRevenueSum = orders.filter(o => o.paymentStatus === 'Approved' || o.status === 'Paid Successfully' || o.status === 'completed' || o.status === 'Verified Dispatch').reduce((sum, o) => sum + (o.total || 0), 0);
    const topSellers = [...products].sort((a,b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 3);

    contentHTML = `
      <div class="flex flex-col gap-5 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="bar-chart-2" class="w-4.5 h-4.5 text-brand-orange"></i> Shop Analytics Intelligence
        </h4>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Live Revenue Ledger</span>
          <div class="h-32 flex items-end gap-3.5 border-b border-l border-slate-200 pb-1 pl-1 pt-4 relative">
            <div class="absolute left-2 top-2 text-[8px] text-slate-400 font-bold uppercase font-mono">Current Peak: ₦${(totalRevenueSum || 500000).toLocaleString()}</div>
            
            <div class="flex-1 bg-gradient-to-t from-[#0f1e36]/20 to-[#0f1e36]/80 rounded-t-md h-[40%] flex items-center justify-center relative">
              <span class="text-[8px] font-mono font-bold text-slate-600 absolute -top-4">Q1</span>
            </div>
            <div class="flex-1 bg-gradient-to-t from-[#0f1e36]/20 to-[#0f1e36]/80 rounded-t-md h-[65%] flex items-center justify-center relative">
              <span class="text-[8px] font-mono font-bold text-slate-600 absolute -top-4">Q2</span>
            </div>
            <div class="flex-1 bg-gradient-to-t from-orange-200 to-brand-orange rounded-t-md h-[95%] flex items-center justify-center relative">
              <span class="text-[8px] font-mono font-bold text-slate-600 absolute -top-4">Live</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-slate-200 rounded-xl p-3.5">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Top Performance Products</span>
            <div class="flex flex-col gap-2.5">
              ${topSellers.map(p => `
                <div class="flex items-center justify-between text-xs p-1">
                  <div class="flex items-center gap-1.5">
                    <img src="${p.image}" class="w-7 h-7 object-cover rounded border">
                    <span class="font-bold text-slate-900">${p.name}</span>
                  </div>
                  <span class="font-mono font-extrabold text-brand-orange">${p.soldCount || 0} sold</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="border border-slate-200 rounded-xl p-3.5">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Order Distribution</span>
            <div class="flex flex-col gap-2 font-mono text-[10px]">
              <div class="flex justify-between">
                <span>Completed / Delivered:</span>
                <span class="font-bold">${orders.filter(o => o.status === 'Delivered').length}</span>
              </div>
              <div class="flex justify-between">
                <span>Handcrafting / Processing:</span>
                <span class="font-bold">${orders.filter(o => o.status === 'Processing').length}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipped / Dispatched:</span>
                <span class="font-bold">${orders.filter(o => o.status === 'Shipped').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  else if (adminActiveSection === 'settings') {
    contentHTML = `
      <div class="flex flex-col gap-4 text-left animate-in fade-in duration-300">
        <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <i data-lucide="settings" class="w-4.5 h-4.5 text-brand-orange"></i> Security Settings & Account Profile
        </h4>

        <div class="bg-slate-50 border p-4 rounded-xl flex items-center gap-3">
          <img src="${user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" class="w-12 h-12 object-cover rounded-full border">
          <div class="flex flex-col">
            <span class="font-extrabold text-slate-900 text-sm">OYEWOLE TOSIN OLUMIDE</span>
            <span class="text-[10px] text-slate-400 font-mono">live_database_admin | Kwara State</span>
          </div>
        </div>

        <form id="admin-settings-password-form" class="bg-white border p-4 rounded-xl flex flex-col gap-3 shadow-xs">
          <span class="font-sans font-bold text-[#0f1e36] text-[11px] uppercase tracking-wide border-b pb-1">Reset Console Admin Password</span>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-400 uppercase">New Master Password</label>
            <input type="password" id="admin-settings-new-pass" required placeholder="Minimum 6 characters" minlength="6" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
          </div>
          <button type="submit" id="admin-settings-password-btn" class="w-full bg-[#0f1e36] hover:bg-[#1a345a] text-white py-2 rounded-lg text-xs font-bold uppercase cursor-pointer border-0 mt-1 shadow-sm">Update Console Security Password</button>
        </form>
      </div>
    `;
  }

  return `
    <div class="animate-in fade-in duration-300">
      ${subNavHTML}
      ${contentHTML}
    </div>
  `;
}

function getAboutUsViewHtml() {
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="info" class="w-4 h-4 text-brand-orange"></i>
        About GR STORE
      </h3>

      <div class="flex flex-col gap-4 font-sans text-xs text-slate-600 leading-relaxed">
        <div class="bg-gradient-to-br from-[#0f1e36] to-[#152a4b] text-white p-5 rounded-2xl border border-slate-800 relative">
          <span class="text-[9px] tracking-widest text-[#f68b1e] font-bold uppercase font-mono">handcrafted leather</span>
          <h4 class="text-lg md:text-xl font-black font-display tracking-tight text-white mt-1">GR STORE</h4>
          <p class="text-[11px] text-slate-300 max-w-sm mt-1 leading-normal">
            Designed and handcrafted with passion. Powered by Gold & Rock Leather Craft.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="border border-slate-100 bg-slate-50/50 p-3 rounded-xl flex items-start gap-2.5">
            <i data-lucide="award" class="w-4 h-4 text-brand-orange shrink-0 mt-0.5"></i>
            <div>
              <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Founder & CEO</span>
              <span class="text-slate-800 font-extrabold text-[11px] md:text-xs block mt-1">OYEWOLE TOSIN OLUMIDE</span>
            </div>
          </div>
          <div class="border border-slate-100 bg-slate-50/50 p-3 rounded-xl flex items-start gap-2.5">
            <i data-lucide="map-pin" class="w-4 h-4 text-brand-orange shrink-0 mt-0.5"></i>
            <div>
              <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Location HQ</span>
              <span class="text-slate-800 font-extrabold text-[11px] md:text-xs block mt-1">Kwara State, Nigeria</span>
            </div>
          </div>
        </div>

        <div class="border-l-4 border-brand-orange bg-orange-50/30 p-3 rounded-r-xl">
          <h5 class="text-[9px] font-bold text-brand-orange uppercase tracking-wider mb-1 font-mono">Our Mission</h5>
          <p class="text-slate-800 font-medium italic text-[11px] leading-relaxed">
            "To produce premium handcrafted leather products that combine durability, elegance, affordability and excellent customer satisfaction."
          </p>
        </div>

        <div class="border border-slate-150 rounded-xl p-3 bg-slate-50/30">
          <h5 class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Bags Categories Sold</h5>
          <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-800 font-medium">
            <div class="flex items-center gap-1.5"><i data-lucide="backpack" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> School Bags</div>
            <div class="flex items-center gap-1.5"><i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Ladies Hand Bags</div>
            <div class="flex items-center gap-1.5"><i data-lucide="laptop" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Laptop Bags</div>
            <div class="flex items-center gap-1.5"><i data-lucide="box" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Lunch Bags</div>
            <div class="flex items-center gap-1.5"><i data-lucide="briefcase" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Office Bags</div>
            <div class="flex items-center gap-1.5"><i data-lucide="wallet" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Men's Purse</div>
            <div class="flex items-center gap-1.5"><i data-lucide="luggage" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Travelling Bags</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getContactUsViewHtml() {
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="phone" class="w-4 h-4 text-brand-orange"></i>
        Contact Us
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start font-sans text-xs">
        <!-- Left: HQ details -->
        <div class="lg:col-span-5 flex flex-col gap-3.5">
          <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-2.5">
            <h4 class="font-bold text-[#0f1e36] text-[10px] uppercase tracking-wider mb-0.5">GR Store Support Hub</h4>
            
            <div class="flex items-start gap-2">
              <i data-lucide="user" class="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5"></i>
              <div>
                <p class="text-slate-400 text-[8px] font-bold uppercase leading-none">CEO</p>
                <p class="text-slate-800 font-bold mt-0.5">OYEWOLE TOSIN OLUMIDE</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5"></i>
              <div>
                <p class="text-slate-400 text-[8px] font-bold uppercase leading-none">Location</p>
                <p class="text-slate-800 font-semibold mt-0.5">Kwara State, Nigeria</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <i data-lucide="message-circle" class="w-3.5 h-3.5 text-[#25D366] shrink-0 mt-0.5"></i>
              <div>
                <p class="text-slate-400 text-[8px] font-bold uppercase leading-none">WhatsApp</p>
                <a href="https://wa.me/2348126730784" target="_blank" class="text-slate-800 font-bold hover:underline mt-0.5">08126730784</a>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <i data-lucide="phone" class="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5"></i>
              <div>
                <p class="text-slate-400 text-[8px] font-bold uppercase leading-none">Phone Lines</p>
                <p class="text-slate-800 font-bold mt-0.5">08126730784, 07037631601</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5"></i>
              <div>
                <p class="text-slate-400 text-[8px] font-bold uppercase leading-none">Business Hours</p>
                <p class="text-slate-800 font-semibold mt-0.5">Mon - Sat: 8:00 AM - 6:00 PM</p>
                <p class="text-red-500 font-bold text-[9px] mt-0.5">Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 p-4 text-center relative flex flex-col items-center justify-center min-h-[100px]">
            <i data-lucide="map" class="w-8 h-8 text-slate-400 mb-1"></i>
            <h5 class="text-[10px] font-bold text-slate-800">Workshop: Kwara State</h5>
            <a href="https://maps.google.com/?q=Kwara+State+Nigeria" target="_blank" class="mt-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-[8px] font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer">
              <i data-lucide="external-link" class="w-2.5 h-2.5"></i> Open Maps
            </a>
          </div>
        </div>

        <!-- Right: form -->
        <div class="lg:col-span-7 bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
          <form id="contact-us-form" class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
              <input type="text" id="contact-name" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Address *</label>
                <input type="email" id="contact-email" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                <input type="tel" id="contact-phone" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subject *</label>
              <input type="text" id="contact-subject" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Message *</label>
              <textarea id="contact-message" rows="3" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange resize-none"></textarea>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 mt-1">
              <button type="submit" id="contact-submit-standard-btn" class="flex-1 bg-[#0f1e36] hover:bg-[#1a3258] text-white py-2.5 rounded-xl font-bold text-xs uppercase cursor-pointer">
                Submit Form
              </button>
              <button type="button" id="contact-submit-wa-btn" class="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                <i data-lucide="message-circle" class="w-4 h-4 fill-white"></i> WhatsApp Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function getHelpSupportViewHtml() {
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="help-circle" class="w-4 h-4 text-brand-orange"></i>
        Help & Support
      </h3>

      <div class="flex flex-col gap-4 font-sans text-xs text-slate-600">
        <div class="flex flex-col gap-2.5">
          <div class="border border-slate-100 rounded-xl bg-slate-50/50 p-3">
            <h5 class="font-extrabold text-slate-800 text-xs flex items-center gap-1"><i data-lucide="help-circle" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Customized leather design requests?</h5>
            <p class="text-slate-600 font-light mt-1 leading-relaxed text-[11px]">
              Yes, Gold & Rock specialize in premium personalized creations. You can order custom lunch bags, travel accessories, or executive purse models to your specifications. Talk to the CEO on WhatsApp!
            </p>
          </div>
          <div class="border border-slate-100 rounded-xl bg-slate-50/50 p-3">
            <h5 class="font-extrabold text-slate-800 text-xs flex items-center gap-1"><i data-lucide="help-circle" class="w-3.5 h-3.5 text-brand-orange shrink-0"></i> Returns & Exchange Policy?</h5>
            <p class="text-slate-600 font-light mt-1 leading-relaxed text-[11px]">
              We provide a 7-day refund or exchange duration on any unworn item in original condition if they do not meet your premium leather expectations.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
          <a href="https://wa.me/2348126730784" target="_blank" class="border border-slate-100 hover:border-slate-200 bg-white p-3 rounded-xl text-center flex flex-col items-center gap-1 shadow-xs">
            <i data-lucide="message-circle" class="w-4.5 h-4.5 text-[#25D366]"></i>
            <span class="text-xs font-bold text-slate-800">WhatsApp Chat</span>
            <span class="text-[9px] text-slate-400">Response < 15m</span>
          </a>
          <a href="tel:08126730784" class="border border-slate-100 hover:border-slate-200 bg-white p-3 rounded-xl text-center flex flex-col items-center gap-1 shadow-xs">
            <i data-lucide="phone" class="w-4.5 h-4.5 text-[#f68b1e]"></i>
            <span class="text-xs font-bold text-slate-800">Direct Line Call</span>
            <span class="text-[9px] text-slate-400">Mon-Sat Hotline</span>
          </a>
          <a href="mailto:goldrock012@gmail.com" class="border border-slate-100 hover:border-slate-200 bg-white p-3 rounded-xl text-center flex flex-col items-center gap-1 shadow-xs">
            <i data-lucide="mail" class="w-4.5 h-4.5 text-slate-400"></i>
            <span class="text-xs font-bold text-slate-800">Support Mail</span>
            <span class="text-[9px] text-slate-400">goldrock012@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

function getSettingsViewHtml(user) {
  const notifications = getMockNotifications();
  const notifListHtml = notifications.length === 0 ? `
    <p class="text-[11px] text-slate-400 italic">No notifications on file.</p>
  ` : notifications.map(n => `
    <div class="p-3 rounded-lg border ${n.read ? 'border-slate-100 bg-slate-50/30 opacity-75' : 'border-l-4 border-l-[#f68b1e] border-slate-100 bg-brand-orange/5'} flex flex-col gap-1">
      <div class="flex items-center justify-between gap-2">
        <span class="font-bold text-xs text-slate-800">${n.title}</span>
        <span class="text-[9px] text-slate-400 font-mono tracking-tighter shrink-0">${getRelativeTime ? getRelativeTime(n.date) : n.date}</span>
      </div>
      <p class="text-[11px] text-slate-600 leading-normal font-sans font-light">${n.message}</p>
    </div>
  `).join('');

  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="settings" class="w-4 h-4 text-brand-orange"></i>
        Account Settings & Notification Center
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        <!-- Preferences column -->
        <div class="lg:col-span-5 flex flex-col gap-4 text-xs">
          <div class="border border-slate-200 bg-slate-50/30 rounded-xl p-3.5 flex flex-col gap-2.5">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wide border-b pb-1.5">Communication Preferences</h4>
            <div class="flex items-center justify-between py-1 border-b pb-2 last:border-b-0">
              <div class="flex flex-col gap-0.5">
                <span class="font-bold text-slate-800">WhatsApp Dispatch Alerts</span>
                <span class="text-[9px] text-slate-400 leading-none">Instant chat alert when order leaves Kwara State</span>
              </div>
              <input type="checkbox" checked class="w-4 h-4 accent-brand-orange cursor-pointer">
            </div>
            <div class="flex items-center justify-between py-1 last:border-0">
              <div class="flex flex-col gap-0.5">
                <span class="font-bold text-slate-800">Catalog Updates</span>
                <span class="text-[9px] text-slate-400 leading-none">Email on new handcrafted design launches</span>
              </div>
              <input type="checkbox" checked class="w-4 h-4 accent-brand-orange cursor-pointer">
            </div>
          </div>

          <div class="border border-red-100 bg-red-50/20 rounded-xl p-3.5 flex flex-col gap-1.5">
            <h4 class="font-bold text-red-600">Reset Account</h4>
            <p class="text-[10px] text-slate-500 leading-normal">Resetting clears local profile information, order state, and mock address caches.</p>
            <button id="reset-account-data-btn" class="mt-1 text-red-500 font-bold hover:underline text-left bg-transparent cursor-pointer">
              Clear Account Data
            </button>
          </div>
        </div>

        <!-- Notifications center column -->
        <div class="lg:col-span-7 flex flex-col gap-3">
          <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center justify-between border-b pb-1.5 mb-1">
            <span>Recent Alerts Log</span>
            <button id="settings-clear-notifs-btn" class="text-[10px] text-[#f68b1e] hover:underline font-bold bg-transparent border-0 cursor-pointer">
              Mark all read
            </button>
          </h4>
          <div class="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto">
            ${notifListHtml}
          </div>
        </div>

      </div>
    </div>
  `;
}

function setupAccountListeners(user) {
  // 1. Admin Section Tab Clicks (Multi-tab system)
  document.querySelectorAll('.admin-section-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      adminActiveSection = btn.getAttribute('data-section');
      adminEditingProduct = null;
      adminEditingCategory = null;
      selectedProductImageFile = null;
      renderAccountView();
    });
  });

  // 2. Admin Force Change Password Form
  const forcePasswordForm = document.getElementById('admin-force-password-form');
  if (forcePasswordForm) {
    forcePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPass = document.getElementById('admin-new-pass').value;
      const confirmPass = document.getElementById('admin-confirm-pass').value;
      
      if (newPass !== confirmPass) {
        showNotification("Passwords do not match.", "danger");
        return;
      }
      if (newPass.length < 6) {
        showNotification("Password must be at least 6 characters.", "danger");
        return;
      }
      
      const btn = document.getElementById('admin-force-password-btn');
      const originalHTML = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Updating security...';
      }
      
      try {
        await window.adminChangePassword(newPass);
        showNotification("Security password successfully updated! Welcome to your secure dashboard.", "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
        }
      }
    });
  }

  // 3. Quick Stock Update Buttons (Dashboard & Products lists)
  document.querySelectorAll('.quick-stock-update-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const input = document.getElementById(`quick-stock-${pId}`);
      if (!input) return;
      const val = parseInt(input.value);
      if (isNaN(val) || val < 0) {
        showNotification("Please enter a valid stock quantity.", "info");
        return;
      }
      
      btn.disabled = true;
      try {
        await window.editProductInCatalog(pId, { stock: val });
        showNotification("Product stock refilled successfully!", "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll('.prod-stock-update-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const input = document.getElementById(`prod-stock-input-${pId}`);
      if (!input) return;
      const val = parseInt(input.value);
      if (isNaN(val) || val < 0) {
        showNotification("Please enter a valid stock quantity.", "info");
        return;
      }
      
      btn.disabled = true;
      try {
        await window.editProductInCatalog(pId, { stock: val });
        showNotification("Product stock refilled successfully!", "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll('.prod-price-update-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const input = document.getElementById(`prod-price-input-${pId}`);
      if (!input) return;
      const val = parseFloat(input.value);
      if (isNaN(val) || val < 0) {
        showNotification("Please enter a valid price.", "info");
        return;
      }
      
      btn.disabled = true;
      try {
        await window.editProductInCatalog(pId, { price: val });
        showNotification("Product price updated successfully!", "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  // 4. Product Status Toggle Button
  document.querySelectorAll('.prod-status-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts() || [];
      const p = products.find(prod => prod.id === pId);
      if (!p) return;
      
      btn.disabled = true;
      const newStatus = p.status === 'active' ? 'hidden' : 'active';
      try {
        await window.editProductInCatalog(pId, { status: newStatus });
        showNotification(`Product "${p.name}" status set to ${newStatus === 'active' ? 'Published' : 'Hidden'}!`, "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  // Duplicate Product Trigger
  document.querySelectorAll('.prod-duplicate-trigger-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts() || [];
      const p = products.find(prod => prod.id === pId);
      if (!p) return;
      
      if (!confirm(`Are you sure you want to duplicate product "${p.name}"?`)) {
        return;
      }
      
      btn.disabled = true;
      showNotification(`Duplicating "${p.name}"...`, 'info');
      
      const newId = `${p.id}-copy-${Math.floor(100 + Math.random() * 900)}`;
      const duplicatedData = {
        ...p,
        id: newId,
        productId: newId,
        name: `${p.name} (Copy)`,
        productName: `${p.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        await window.addProductToCatalog(duplicatedData, null); // pass null since we copy images directly inside duplicatedData
        showNotification(`Product duplicated successfully as "${duplicatedData.name}"!`, 'success');
        renderAccountView();
      } catch (err) {
        showNotification(err.message, 'danger');
        renderAccountView();
      }
    });
  });

  // Delete Product Trigger
  document.querySelectorAll('.prod-delete-trigger-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      if (confirm("Are you sure you want to permanently delete this product and its stored images from Firebase Storage? This action is irreversible.")) {
        try {
          await window.deleteProductFromCatalog(pId);
          showNotification("Product and associated images permanently deleted successfully.", "success");
          renderAccountView();
        } catch (err) {
          showNotification(err.message, "danger");
        }
      }
    });
  });

  // Edit Product / Create Product Form Toggle
  const addProdBtn = document.getElementById('admin-add-prod-btn');
  if (addProdBtn) {
    addProdBtn.addEventListener('click', () => {
      adminEditingProduct = null; // Adding mode
      selectedProductImageFile = null;
      selectedProductImageFiles = []; // Clear multi-image array
      const container = document.getElementById('admin-product-crud-form-container');
      if (container) {
        container.innerHTML = getInlineEditProductFormHtml(null);
        container.classList.remove('hidden');
        setupEditProductFormListeners(false);
      }
    });
  }

  document.querySelectorAll('.prod-edit-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts() || [];
      const p = products.find(prod => prod.id === pId);
      if (!p) return;
      
      adminEditingProduct = p; // Editing mode
      selectedProductImageFile = null;
      selectedProductImageFiles = []; // Reset multi-image array
      const container = document.getElementById('admin-product-crud-form-container');
      if (container) {
        container.innerHTML = getInlineEditProductFormHtml(p);
        container.classList.remove('hidden');
        setupEditProductFormListeners(true, p);
      }
    });
  });

  // Client-side image compression helper
  const compressImage = async (file, maxKB = 500) => {
    if (file.size <= maxKB * 1024) return file;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        const img = new Image();
        img.src = ev.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_RES = 1200;
          if (width > MAX_RES || height > MAX_RES) {
            if (width > height) {
              height = Math.round((height * MAX_RES) / width);
              width = MAX_RES;
            } else {
              width = Math.round((width * MAX_RES) / height);
              height = MAX_RES;
            }
          }
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.85;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          const getBlobSize = (url) => {
            const head = 'data:image/jpeg;base64,';
            return Math.round((url.length - head.length) * 3 / 4);
          };
          
          while (getBlobSize(dataUrl) > maxKB * 1024 && quality > 0.15) {
            quality -= 0.08;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          
          const arr = dataUrl.split(',');
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          
          resolve(new File([u8arr], file.name, { type: mime }));
        };
      };
    });
  };

  const setupEditProductFormListeners = (isEdit, prod = null) => {
    const cancelBtn = document.getElementById('admin-edit-product-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        const container = document.getElementById('admin-product-crud-form-container');
        if (container) container.classList.add('hidden');
        adminEditingProduct = null;
        selectedProductImageFile = null;
        selectedProductImageFiles = [];
      });
    }

    const editZone = document.getElementById('edit-image-drag-drop-zone');
    const editFileInput = document.getElementById('edit-prod-image-file');

    // Auto slug/id generation on create
    const nameInput = document.getElementById('edit-prod-name');
    const idInput = document.getElementById('edit-prod-id');
    if (nameInput && idInput && !isEdit) {
      nameInput.addEventListener('input', () => {
        idInput.value = nameInput.value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      });
    }

    // Dynamic on-the-fly discount calculation
    const priceInput = document.getElementById('edit-prod-price');
    const oldPriceInput = document.getElementById('edit-prod-old-price');
    const discountInput = document.getElementById('edit-prod-discount');
    
    const updateDiscountOnFly = () => {
      const price = parseFloat(priceInput.value || 0);
      const oldPrice = parseFloat(oldPriceInput.value || 0);
      if (oldPrice && oldPrice > price) {
        const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
        discountInput.value = `${pct}%`;
      } else {
        discountInput.value = '0%';
      }
    };
    
    if (priceInput && oldPriceInput && discountInput) {
      priceInput.addEventListener('input', updateDiscountOnFly);
      oldPriceInput.addEventListener('input', updateDiscountOnFly);
    }

    // Multi-image preview rendering
    const renderImagePreviews = () => {
      const listContainer = document.getElementById('edit-image-previews-list');
      if (!listContainer) return;
      
      if (selectedProductImageFiles.length === 0) {
        listContainer.innerHTML = `<p class="text-[10px] text-slate-400 italic col-span-full">No new images selected</p>`;
        return;
      }
      
      listContainer.innerHTML = selectedProductImageFiles.map((file, idx) => {
        const objectUrl = URL.createObjectURL(file);
        return `
          <div class="flex items-center gap-2 bg-slate-50 border p-1.5 rounded-lg text-xs">
            <img src="${objectUrl}" class="w-8 h-8 object-cover rounded border bg-white flex-shrink-0">
            <div class="flex-1 min-w-0">
              <p class="text-[9px] font-bold text-slate-800 truncate">${file.name}</p>
              <p class="text-[8px] text-slate-400 font-bold uppercase">${(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button type="button" class="remove-preview-img-btn text-slate-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0.5" data-index="${idx}">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
      }).join('');
      
      if (window.lucide) window.lucide.createIcons();
      
      listContainer.querySelectorAll('.remove-preview-img-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.getAttribute('data-index'));
          selectedProductImageFiles.splice(index, 1);
          renderImagePreviews();
        });
      });
    };

    const handleFilesSelection = (filesList) => {
      const arr = Array.from(filesList).filter(f => f.type.startsWith('image/'));
      if (arr.length === 0) return;
      
      if (selectedProductImageFiles.length + arr.length > 6) {
        showNotification('You can upload a maximum of 6 images per product.', 'danger');
        return;
      }
      
      selectedProductImageFiles.push(...arr);
      renderImagePreviews();
    };

    if (editZone && editFileInput) {
      editZone.addEventListener('click', () => editFileInput.click());
      editFileInput.addEventListener('change', (e) => {
        if (e.target.files) {
          handleFilesSelection(e.target.files);
        }
      });
      editZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        editZone.classList.add('border-brand-orange', 'bg-orange-50/10');
      });
      ['dragleave', 'dragend'].forEach(type => {
        editZone.addEventListener(type, () => {
          editZone.classList.remove('border-brand-orange', 'bg-orange-50/10');
        });
      });
      editZone.addEventListener('drop', (e) => {
        e.preventDefault();
        editZone.classList.remove('border-brand-orange', 'bg-orange-50/10');
        if (e.dataTransfer.files) {
          handleFilesSelection(e.dataTransfer.files);
        }
      });
    }

    const form = document.getElementById('admin-edit-product-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('admin-edit-product-btn');
        const originalHTML = submitBtn ? submitBtn.innerHTML : '';

        try {
          if (!isEdit && selectedProductImageFiles.length === 0) {
            showNotification('Please select between 1 and 6 product images to register.', 'info');
            return;
          }

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="flex items-center gap-1"><i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Processing...</span>`;
            if (window.lucide) window.lucide.createIcons();
          }

          const idVal = document.getElementById('edit-prod-id').value.trim();
          const nameVal = document.getElementById('edit-prod-name').value.trim();
          const catVal = document.getElementById('edit-prod-category').value;
          const priceVal = parseFloat(document.getElementById('edit-prod-price').value || 0);
          const oldPriceVal = parseFloat(document.getElementById('edit-prod-old-price').value || 0) || null;
          const stockVal = parseInt(document.getElementById('edit-prod-stock').value || 0);
          const descVal = document.getElementById('edit-prod-description').value.trim();
          const specsVal = document.getElementById('edit-prod-specifications').value.trim();
          const coloursVal = document.getElementById('edit-prod-colours').value.trim();
          const sizesVal = document.getElementById('edit-prod-sizes').value.trim();
          
          const featuredVal = document.getElementById('edit-prod-featured').checked;
          const flashVal = document.getElementById('edit-prod-flash').checked;
          const newVal = document.getElementById('edit-prod-new').checked;
          const bestVal = document.getElementById('edit-prod-best').checked;
          const statusVal = document.getElementById('edit-prod-status').value;

          if (!catVal) {
            showNotification("Please choose a product category.", "danger");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalHTML;
            }
            return;
          }

          console.log("Form validation complete.");

          const dataObj = {
            id: idVal,
            name: nameVal,
            category: catVal,
            price: priceVal,
            oldPrice: oldPriceVal,
            stock: stockVal,
            description: descVal,
            specifications: specsVal,
            colours: coloursVal,
            sizes: sizesVal,
            featured: featuredVal,
            flashSale: flashVal,
            newArrival: newVal,
            bestSeller: bestVal,
            status: statusVal
          };

          const uploadAndSave = async () => {
            // 1. COMPRESSION STAGE
            console.log("Image compression started");
            if (submitBtn) {
              submitBtn.innerHTML = `<span class="flex items-center gap-1"><i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Compressing image...</span>`;
              if (window.lucide) window.lucide.createIcons();
            }

            const processedFiles = [];
            if (selectedProductImageFiles.length > 0) {
              for (const file of selectedProductImageFiles) {
                const compressed = await compressImage(file, 500);
                processedFiles.push(compressed);
              }
            }
            console.log("Image compression complete.");

            // Define progress changes
            const onStageChange = (stage) => {
              if (!submitBtn) return;
              if (stage === 'uploading') {
                submitBtn.innerHTML = `<span class="flex items-center gap-1"><i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Uploading image...</span>`;
              } else if (stage === 'saving') {
                submitBtn.innerHTML = `<span class="flex items-center gap-1"><i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Saving product...</span>`;
              } else if (stage === 'saved') {
                submitBtn.innerHTML = `<span class="flex items-center gap-1"><i data-lucide="check" class="w-4 h-4 text-emerald-500"></i> Product created successfully.</span>`;
              }
              if (window.lucide) window.lucide.createIcons();
            };

            const filesToSend = processedFiles.length > 0 ? processedFiles : null;

            if (isEdit) {
              await window.editProductInCatalog(prod.id, dataObj, filesToSend, onStageChange);
            } else {
              await window.addProductToCatalog(dataObj, filesToSend, onStageChange);
            }
          };

          // Create a timeout promise to stop after 30 seconds
          let timeoutId;
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error("Upload timed out. Please try again."));
            }, 30000);
          });

          // Run them race-conditioned
          await Promise.race([uploadAndSave(), timeoutPromise]);
          clearTimeout(timeoutId);

          console.log("Upload finished.");

          if (submitBtn) {
            submitBtn.innerHTML = `<span class="flex items-center gap-1"><i data-lucide="check" class="w-4 h-4 text-emerald-500"></i> Product uploaded successfully.</span>`;
            if (window.lucide) window.lucide.createIcons();
          }

          // Show success feedback
          await new Promise(r => setTimeout(r, 800));
          showNotification("Product uploaded successfully.", 'success');

          // Reset forms and selections
          selectedProductImageFiles = [];
          adminEditingProduct = null;

          // Clear the form
          form.reset();
          const previewContainer = document.getElementById('image-previews-container');
          if (previewContainer) previewContainer.innerHTML = '';

          // Refresh the product table
          renderAccountView();

        } catch (error) {
          console.error(error);
          alert(error.message || String(error));
          
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    }
  };

  // 5. Category CRUD
  const addCatBtn = document.getElementById('admin-add-cat-btn');
  if (addCatBtn) {
    addCatBtn.addEventListener('click', () => {
      adminEditingCategory = null;
      selectedProductImageFile = null;
      const container = document.getElementById('admin-category-form-container');
      if (container) {
        container.innerHTML = getInlineCategoryFormHtml(null);
        container.classList.remove('hidden');
        setupCategoryFormListeners(false);
      }
    });
  }

  document.querySelectorAll('.cat-edit-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-id');
      const categories = getMockCategories() || [];
      const cat = categories.find(c => c.id === catId);
      if (!cat) return;

      adminEditingCategory = cat;
      selectedProductImageFile = null;
      const container = document.getElementById('admin-category-form-container');
      if (container) {
        container.innerHTML = getInlineCategoryFormHtml(cat);
        container.classList.remove('hidden');
        setupCategoryFormListeners(true, cat);
      }
    });
  });

  document.querySelectorAll('.cat-delete-trigger-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const catId = btn.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete category "${catId}"?`)) {
        try {
          await window.deleteCategory(catId);
          showNotification("Category successfully deleted from system.", "success");
          renderAccountView();
        } catch (err) {
          showNotification(err.message, "danger");
        }
      }
    });
  });

  // Reorder index up/down for categories
  document.querySelectorAll('.cat-move-up-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      const categories = [...getMockCategories()];
      if (idx > 0) {
        const reordered = categories.map(c => c.id);
        const temp = reordered[idx];
        reordered[idx] = reordered[idx - 1];
        reordered[idx - 1] = temp;
        try {
          await window.reorderCategories(reordered);
          showNotification("Category ranked up successfully!", "success");
          renderAccountView();
        } catch (err) {
          showNotification(err.message, "danger");
        }
      }
    });
  });

  document.querySelectorAll('.cat-move-down-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      const categories = [...getMockCategories()];
      if (idx < categories.length - 1) {
        const reordered = categories.map(c => c.id);
        const temp = reordered[idx];
        reordered[idx] = reordered[idx + 1];
        reordered[idx + 1] = temp;
        try {
          await window.reorderCategories(reordered);
          showNotification("Category ranked down successfully!", "success");
          renderAccountView();
        } catch (err) {
          showNotification(err.message, "danger");
        }
      }
    });
  });

  const setupCategoryFormListeners = (isEdit, cat = null) => {
    const closeBtn = document.getElementById('admin-category-form-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const container = document.getElementById('admin-category-form-container');
        if (container) container.classList.add('hidden');
        adminEditingCategory = null;
        selectedProductImageFile = null;
      });
    }

    const catZone = document.getElementById('cat-image-zone');
    const catFileInput = document.getElementById('cat-image-file');
    const catPreviewContainer = document.getElementById('cat-preview-container');
    const catPreviewImg = document.getElementById('cat-preview-img');
    const catPreviewFilename = document.getElementById('cat-preview-filename');

    const handleCatFile = (file) => {
      if (!file || !file.type.startsWith('image/')) {
        showNotification('Please select a valid banner image file.', 'info');
        return;
      }
      selectedProductImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (catPreviewImg) catPreviewImg.src = e.target.result;
        if (catPreviewFilename) catPreviewFilename.textContent = file.name;
        if (catPreviewContainer) catPreviewContainer.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    };

    if (catZone && catFileInput) {
      catZone.addEventListener('click', () => catFileInput.click());
      catFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleCatFile(e.target.files[0]);
      });
      catZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        catZone.classList.add('border-brand-orange', 'bg-orange-50/10');
      });
      ['dragleave', 'dragend'].forEach(type => {
        catZone.addEventListener(type, () => {
          catZone.classList.remove('border-brand-orange', 'bg-orange-50/10');
        });
      });
      catZone.addEventListener('drop', (e) => {
        e.preventDefault();
        catZone.classList.remove('border-brand-orange', 'bg-orange-50/10');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleCatFile(e.dataTransfer.files[0]);
      });
    }

    const form = document.getElementById('admin-category-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const slug = document.getElementById('cat-slug').value.trim();
        const name = document.getElementById('cat-name').value.trim();
        const submitBtn = document.getElementById('admin-category-save-btn');
        if (submitBtn) submitBtn.disabled = true;

        try {
          let bannerUrl = isEdit ? cat.image : '';
          if (selectedProductImageFile) {
            bannerUrl = await window.uploadFile(selectedProductImageFile, 'categories');
          }

          const catData = {
            id: slug,
            name: name,
            image: bannerUrl || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600"
          };

          if (isEdit) {
            await window.editCategory(cat.id, catData);
            showNotification(`Category "${name}" updated successfully!`, "success");
          } else {
            await window.addCategory(catData);
            showNotification(`Category "${name}" created successfully!`, "success");
          }
          selectedProductImageFile = null;
          adminEditingCategory = null;
          renderAccountView();
        } catch (err) {
          showNotification(err.message, "danger");
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  };

  // 6. Live Order Status Select Dropdown Change
  document.querySelectorAll('.order-status-change-select').forEach(sel => {
    sel.addEventListener('change', async () => {
      const orderId = sel.getAttribute('data-id');
      const newStatus = sel.value;
      try {
        await window.updateOrderStatus(orderId, newStatus);
        showNotification(`Order ${orderId} status successfully updated to: ${newStatus}`, "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
      }
    });
  });

  // 7. Payment Verification Actions (Approve/Reject)
  document.querySelectorAll('.payment-verify-approve-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const orderId = btn.getAttribute('data-id');
      btn.disabled = true;
      try {
        await window.approveOrderPayment(orderId);
        showNotification(`Payment for Order ${orderId} APPROVED successfully!`, "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll('.payment-verify-reject-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const orderId = btn.getAttribute('data-id');
      btn.disabled = true;
      try {
        await window.rejectOrderPayment(orderId);
        showNotification(`Payment for Order ${orderId} REJECTED and order cancelled.`, "info");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  // 8. Dynamic Badges/Modes toggling (Flash Sale, New Arrival, Featured)
  document.querySelectorAll('.flash-sale-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts() || [];
      const p = products.find(prod => prod.id === pId);
      if (!p) return;
      
      btn.disabled = true;
      const newFlash = !p.isFlashSale;
      const updates = { 
        isFlashSale: newFlash,
        oldPrice: newFlash ? (p.oldPrice || Math.round(p.price * 1.25)) : null
      };
      try {
        await window.editProductInCatalog(pId, updates);
        showNotification(newFlash ? `${p.name} added to Flash Sales!` : `${p.name} removed from Flash Sales.`, "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll('.new-arrival-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts() || [];
      const p = products.find(prod => prod.id === pId);
      if (!p) return;
      
      btn.disabled = true;
      const newIsNew = !p.isNew;
      try {
        await window.editProductInCatalog(pId, { isNew: newIsNew });
        showNotification(newIsNew ? `${p.name} marked as New Arrival!` : `${p.name} removed from New Arrivals.`, "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll('.featured-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts() || [];
      const p = products.find(prod => prod.id === pId);
      if (!p) return;
      
      btn.disabled = true;
      const newFeatured = !p.isFeatured;
      try {
        await window.editProductInCatalog(pId, { isFeatured: newFeatured });
        showNotification(newFeatured ? `${p.name} placed in Featured category!` : `${p.name} removed from Featured category.`, "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        btn.disabled = false;
      }
    });
  });

  // 9. Banner Manager Slider
  const addBannerBtn = document.getElementById('admin-add-banner-btn');
  if (addBannerBtn) {
    addBannerBtn.addEventListener('click', () => {
      const formContainer = document.getElementById('admin-banner-form-container');
      if (formContainer) formContainer.classList.remove('hidden');
    });
  }

  const closeBannerFormBtn = document.getElementById('admin-banner-form-close-btn');
  if (closeBannerFormBtn) {
    closeBannerFormBtn.addEventListener('click', () => {
      const formContainer = document.getElementById('admin-banner-form-container');
      if (formContainer) formContainer.classList.add('hidden');
    });
  }

  const bannerAddForm = document.getElementById('admin-banner-add-form');
  if (bannerAddForm) {
    bannerAddForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const imageUrl = document.getElementById('slide-image-url').value.trim();
      const accent = document.getElementById('slide-accent').value.trim();
      const title = document.getElementById('slide-title').value.trim();
      const subtitle = document.getElementById('slide-subtitle').value.trim();
      const ctaText = document.getElementById('slide-cta-text').value.trim() || 'Shop Now';
      const ctaUrl = document.getElementById('slide-cta-url').value.trim();

      const newSlide = {
        id: Date.now(),
        image: imageUrl,
        accent: accent || 'GOLD & ROCK EXCLUSIVE',
        title: title,
        subtitle: subtitle,
        ctaText: ctaText,
        ctaUrl: ctaUrl
      };

      const currentSettings = window.getHomepageSettings() || { heroSlides: [] };
      const slides = currentSettings.heroSlides ? [...currentSettings.heroSlides] : [];
      slides.push(newSlide);

      try {
        await window.saveHomepageSettings({ ...currentSettings, heroSlides: slides });
        showNotification("New slider banner added to the homepage!", "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
      }
    });
  }

  document.querySelectorAll('.banner-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      if (confirm("Are you sure you want to remove this slider banner from the homepage?")) {
        const currentSettings = window.getHomepageSettings() || { heroSlides: [] };
        const slides = currentSettings.heroSlides ? [...currentSettings.heroSlides] : [];
        slides.splice(idx, 1);
        try {
          await window.saveHomepageSettings({ ...currentSettings, heroSlides: slides });
          showNotification("Homepage banner slider removed.", "info");
          renderAccountView();
        } catch (err) {
          showNotification(err.message, "danger");
        }
      }
    });
  });

  // 10. Settings Admin Master Password Form Submission
  const adminSettingsForm = document.getElementById('admin-settings-password-form');
  if (adminSettingsForm) {
    adminSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPass = document.getElementById('admin-settings-new-pass').value;
      const btn = document.getElementById('admin-settings-password-btn');
      if (btn) btn.disabled = true;

      try {
        await window.adminChangePassword(newPass);
        showNotification("Console master password updated successfully!", "success");
        renderAccountView();
      } catch (err) {
        showNotification(err.message, "danger");
        if (btn) btn.disabled = false;
      }
    });
  }

  // Back to Menu on mobile
  const backBtn = document.getElementById('back-to-menu-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      mobileShowPane = false;
      renderAccountView();
    });
  }

  // Sidebar Menu clicks
  document.querySelectorAll('.tab-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      activeTab = tabId;
      editMode = false;
      mobileShowPane = true;
      renderAccountView();
    });
  });

  // Sidebar logout click
  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const originalHTML = logoutBtn.innerHTML;
      logoutBtn.innerHTML = 'Signing out...';
      try {
        await logoutMockUser();
        activeTab = 'my-profile';
        mobileShowPane = false;
        showNotification('Successfully signed out of GR STORE.', 'success');
        renderAccountView();
      } catch (err) {
        showNotification(err.message, 'danger');
        logoutBtn.innerHTML = originalHTML;
      }
    });
  }

  // Profile Sign out
  const profLogoutBtn = document.getElementById('profile-logout-btn');
  if (profLogoutBtn) {
    profLogoutBtn.addEventListener('click', async () => {
      const originalHTML = profLogoutBtn.innerHTML;
      profLogoutBtn.innerHTML = 'Signing out...';
      try {
        await logoutMockUser();
        activeTab = 'my-profile';
        mobileShowPane = false;
        showNotification('Successfully signed out of GR STORE.', 'success');
        renderAccountView();
      } catch (err) {
        showNotification(err.message, 'danger');
        profLogoutBtn.innerHTML = originalHTML;
      }
    });
  }

  // Edit Profile triggers
  const editBtn = document.getElementById('profile-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      editMode = true;
      renderAccountView();
    });
  }

  const cancelEditBtn = document.getElementById('edit-cancel-btn');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      editMode = false;
      renderAccountView();
    });
  }

  // Edit address redirect
  const editAddrBtn = document.getElementById('addresses-edit-btn');
  if (editAddrBtn) {
    editAddrBtn.addEventListener('click', () => {
      activeTab = 'my-profile';
      editMode = true;
      renderAccountView();
    });
  }

  // Auth lock tab switching
  const btnLockSignin = document.getElementById('lock-btn-signin');
  const btnLockReg = document.getElementById('lock-btn-register');
  if (btnLockSignin) {
    btnLockSignin.addEventListener('click', () => {
      authTab = 'signin';
      renderAccountView();
    });
  }
  if (btnLockReg) {
    btnLockReg.addEventListener('click', () => {
      authTab = 'register';
      renderAccountView();
    });
  }

  // Submits form bindings
  const editForm = document.getElementById('profile-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = editForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin h-4 w-4 text-white inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Saving...</span>
        `;
      }

      const profile = {
        fullName: document.getElementById('edit-name').value.trim(),
        phoneNumber: document.getElementById('edit-phone').value.trim(),
        address: document.getElementById('edit-addr').value.trim(),
        city: document.getElementById('edit-city').value.trim(),
        state: document.getElementById('edit-state').value.trim()
      };

      try {
        await updateMockUserProfile(profile);
        editMode = false;
        showNotification('Profile information updated successfully!', 'success');
        renderAccountView();
      } catch (err) {
        showNotification(err.message, 'danger');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  const signinForm = document.getElementById('auth-signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value;
      const submitBtn = document.getElementById('signin-submit-btn');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin h-4 w-4 text-white inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Signing in...</span>
        `;
      }

      try {
        await loginMockUser(email, password);
        showNotification('Signed in successfully! Welcome back to GR STORE.', 'success');
        const params = new URLSearchParams(window.location.search);
        if (params.get('redirect') === 'checkout') {
          window.location.href = 'checkout.html';
        } else {
          renderAccountView();
        }
      } catch (err) {
        showNotification(err.message, 'danger');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
      }
    });
  }

  const registerForm = document.getElementById('auth-register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phoneNumber = document.getElementById('reg-phone').value.trim();
      const address = document.getElementById('reg-addr').value.trim();
      const city = document.getElementById('reg-city').value.trim();
      const state = document.getElementById('reg-state').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;
      const submitBtn = document.getElementById('register-submit-btn');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'danger');
        return;
      }

      if (password.length < 6) {
        showNotification('Password must be at least 6 characters.', 'danger');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin h-4 w-4 text-white inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Registering...</span>
        `;
      }

      try {
        await registerMockUser({
          fullName,
          email,
          phoneNumber,
          address,
          city,
          state,
          password
        });
        showNotification('Account registered successfully! Welcome to GR STORE.', 'success');
        const params = new URLSearchParams(window.location.search);
        if (params.get('redirect') === 'checkout') {
          window.location.href = 'checkout.html';
        } else {
          renderAccountView();
        }
      } catch (err) {
        showNotification(err.message, 'danger');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
      }
    });
  }

  const resetBtn = document.getElementById('reset-account-data-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const originalHTML = resetBtn.innerHTML;
      resetBtn.innerHTML = 'Clearing...';
      try {
        await logoutMockUser();
        activeTab = 'my-profile';
        mobileShowPane = false;
        showNotification('Account profile cache reset successfully.', 'success');
        renderAccountView();
      } catch (err) {
        showNotification(err.message, 'danger');
        resetBtn.innerHTML = originalHTML;
      }
    });
  }

  // Clear or Mark all notifications read inside settings
  const settingsClearNotifsBtn = document.getElementById('settings-clear-notifs-btn');
  if (settingsClearNotifsBtn) {
    settingsClearNotifsBtn.addEventListener('click', () => {
      if (window.markAllNotificationsAsRead) {
        window.markAllNotificationsAsRead();
        showNotification('All notifications marked as read!', 'success');
        renderAccountView();
      }
    });
  }

  // Wishlist dynamic buttons
  document.querySelectorAll('.wishlist-add-cart-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts();
      const p = products.find(prod => prod.id === pId);
      if (p) {
        await addToMockCart(p, 1, null);
        await toggleMockWishlist(p); // Move means remove from wishlist and add to cart
        showNotification(`${p.name} has been moved to your cart!`, 'success');
        renderAccountView();
      }
    });
  });

  document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pId = btn.getAttribute('data-id');
      const products = getMockProducts();
      const p = products.find(prod => prod.id === pId);
      if (p) {
        await toggleMockWishlist(p);
        showNotification(`${p.name} removed from your wishlist.`, 'info');
        renderAccountView();
      }
    });
  });

  // Contact form buttons
  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('Thank you! Your message has been sent successfully. OYEWOLE TOSIN OLUMIDE will contact you shortly.', 'success');
      contactForm.reset();
    });

    const contactWABtn = document.getElementById('contact-submit-wa-btn');
    if (contactWABtn) {
      contactWABtn.addEventListener('click', () => {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim() || 'Not provided';
        const subject = document.getElementById('contact-subject').value.trim();
        const msg = document.getElementById('contact-message').value.trim();

        if (!name || !email || !subject || !msg) {
          showNotification('Please fill in Name, Email, Subject, and Message before sending.', 'info');
          return;
        }

        const waText = `Hello Gold & Rock Leather Craft, my name is ${name} (${email}, Phone: ${phone}).\n\nSubject: ${subject}\n\nMessage: ${msg}`;
        window.open(`https://wa.me/2348126730784?text=${encodeURIComponent(waText)}`, '_blank');
      });
    }
  }
}
