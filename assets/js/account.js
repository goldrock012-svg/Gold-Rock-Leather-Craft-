let activeTab = 'my-profile';
let editMode = false;
let authTab = 'signin'; // 'signin' or 'register'
let mobileShowPane = false;
let adminSubTab = 'verify-payments'; // 'verify-payments' or 'upload-product'
let selectedProductImageFile = null;

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

  if (window.lucide) window.lucide.createIcons();
});

function renderAccountView() {
  const container = document.getElementById('account-page-inner');
  if (!container) return;

  const user = getMockCurrentUser();

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
    { id: 'wishlist', label: 'Wishlist', icon: 'heart' },
    { id: 'saved-addresses', label: 'Saved Addresses', icon: 'map-pin' },
    { id: 'payment-history', label: 'Payment History', icon: 'credit-card' },
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
  const isAuthRequired = ['my-orders', 'saved-addresses', 'payment-history', 'settings', 'admin-console'].includes(activeTab) || (activeTab === 'my-profile' && !user);
  
  if (isAuthRequired && !user) {
    return getAuthLockedHtml();
  }

  switch (activeTab) {
    case 'my-profile':
      return !editMode ? getProfileViewHtml(user) : getProfileEditFormHtml(user);
    case 'my-orders':
      return getOrdersViewHtml();
    case 'wishlist':
      return getWishlistViewHtml();
    case 'saved-addresses':
      return getSavedAddressesViewHtml(user);
    case 'payment-history':
      return getPaymentHistoryViewHtml(user);
    case 'admin-console':
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

function getOrdersViewHtml() {
  const orders = getMockOrders();
  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="package" class="w-4 h-4 text-brand-orange"></i>
        My Orders
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
        <p class="text-slate-400 text-xs italic">You haven't placed any orders yet.</p>
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

    return `
      <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50/20">
        <!-- Order header card -->
        <div class="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div class="flex flex-col">
            <span class="text-[9px] text-slate-400 font-bold uppercase leading-none">Order ID</span>
            <span class="font-mono font-bold text-xs text-slate-800 mt-1">${ord.id}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[9px] text-slate-400 font-bold uppercase leading-none">Placed On</span>
            <span class="font-bold text-xs text-slate-800 mt-1">${dateFormatted}</span>
          </div>
        </div>

        <!-- Order details rows -->
        <div class="p-4 flex flex-col gap-3">
          ${itemsList}

          <div class="border-t border-slate-150 pt-2.5 mt-1 flex justify-between items-center">
            <span class="text-xs font-bold text-slate-600">Total Paid (₦1,500 Delivery):</span>
            <span class="font-mono font-extrabold text-brand-orange text-sm md:text-base">₦${ord.total.toLocaleString()}</span>
          </div>

          <div class="flex gap-2 justify-end mt-2">
            <a href="https://wa.me/2348126730784?text=Hello%20Gold%20%26%20Rock%2C%20I%20want%20to%20confirm%20my%20Order%20ID%3A%20${ord.id}%20totaling%20%E2%82%A6${ord.total.toLocaleString()}" target="_blank" class="bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold px-3 py-2 rounded-lg flex items-center gap-1">
              <i data-lucide="message-circle" class="w-3.5 h-3.5 fill-white"></i> Confirm on WhatsApp
            </a>
            <span class="text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg border flex items-center justify-center ${
              ord.status === 'Paid Successfully' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : ord.status === 'completed' || ord.status === 'Verified Dispatch'
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
            }">
              ${ord.status === 'Paid Successfully' 
                ? 'Paid Successfully' 
                : ord.status === 'completed' || ord.status === 'Verified Dispatch'
                  ? 'Verified Dispatch' 
                  : 'Pending Payment Verification'}
            </span>
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

function getAdminConsoleViewHtml() {
  const orders = getMockOrders();
  
  let mainContentHTML = '';
  
  if (adminSubTab === 'verify-payments') {
    let ordersListHTML = '';
    if (orders.length === 0) {
      ordersListHTML = `
        <div class="text-center py-10 bg-slate-50 border border-dashed rounded-2xl p-6">
          <p class="text-slate-400 text-xs italic">No orders logged in system database yet.</p>
          <p class="text-slate-400 text-[10px] mt-1">Place some handcrafted leather orders in the checkout first!</p>
        </div>
      `;
    } else {
      ordersListHTML = orders.map(ord => {
        const isPending = ord.status === 'Pending Payment Verification' || ord.status === 'pending';
        const isPaid = ord.status === 'Paid Successfully';
        const isCompleted = ord.status === 'completed' || ord.status === 'Verified Dispatch';
        
        let itemsList = ord.items.map(item => `
          <div class="flex justify-between text-[11px] text-slate-600 font-mono">
            <span>${item.product.name} (Qty: ${item.quantity})</span>
            <span>₦${(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        `).join('');
        
        return `
          <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
            <div class="flex justify-between items-start border-b border-slate-100 pb-2">
              <div>
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Order ID</span>
                <span class="font-mono font-bold text-xs text-[#0f1e36]">${ord.id}</span>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
                <span class="font-semibold text-xs text-slate-800">${ord.shippingDetails.fullName}</span>
              </div>
            </div>
            
            <div class="flex flex-col gap-1.5 border-b border-slate-100 pb-2">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order Items</span>
              ${itemsList}
              <div class="flex justify-between font-bold text-xs mt-1 text-slate-800">
                <span>Total Payment:</span>
                <span class="text-brand-orange font-mono">₦${ord.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div>
                <span class="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Current Status</span>
                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  isPaid 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : isCompleted 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                }">
                  ${ord.status === 'pending' ? 'Pending Payment Verification' : ord.status}
                </span>
              </div>
              
              <div>
                ${isPending ? `
                  <button data-order-id="${ord.id}" class="admin-approve-btn bg-[#f68b1e] hover:bg-[#e07a1b] text-white font-extrabold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1 uppercase tracking-wide shadow-xs border-0">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i> Approve Payment
                  </button>
                ` : `
                  <div class="flex items-center gap-1 text-emerald-600 font-extrabold text-[10px] uppercase">
                    <i data-lucide="shield-check" class="w-4.5 h-4.5 text-emerald-500"></i>
                    <span>Paid & Approved</span>
                  </div>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('<div class="h-4"></div>');
    }
    
    mainContentHTML = `
      <div class="flex flex-col gap-4">
        ${ordersListHTML}
      </div>
    `;
  } else if (adminSubTab === 'upload-product') {
    mainContentHTML = `
      <form id="admin-add-product-form" class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-xs">
        <div class="flex items-center gap-2 border-b pb-2 mb-2">
          <i data-lucide="plus-circle" class="w-4 h-4 text-[#f68b1e]"></i>
          <h4 class="font-extrabold text-xs text-[#0f1e36] uppercase tracking-wider">Add New Product Catalog</h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
            <input type="text" id="prod-name" required placeholder="Gold & Rock Vintage Briefcase" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product ID *</label>
            <input type="text" id="prod-id" required placeholder="gr-${Date.now().toString().slice(-4)}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category *</label>
            <select id="prod-category" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
              <option value="school-bags">School Bags</option>
              <option value="ladies-hand-bags">Ladies Hand Bags</option>
              <option value="laptop-bags">Laptop Bags</option>
              <option value="lunch-bags">Lunch Bags</option>
              <option value="office-bags">Office Bags</option>
              <option value="mens-purses">Men's Purse</option>
              <option value="travelling-bags">Travelling Bags</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (₦) *</label>
            <input type="number" id="prod-price" required placeholder="15000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Description *</label>
          <textarea id="prod-description" required rows="3" placeholder="Handcrafted from full-grain vegetable-tanned leather..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange"></textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Image (Upload to Storage) *</label>
          <div id="image-drag-drop-zone" class="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-1.5 hover:border-brand-orange/60 transition-colors cursor-pointer bg-slate-50">
            <i data-lucide="image" class="w-8 h-8 text-slate-400"></i>
            <span class="text-[11px] font-bold text-slate-600">Drag & drop product image or click to browse</span>
            <span class="text-[9px] text-slate-400 font-light">Supports JPEG, PNG, WEBP</span>
            <input type="file" id="prod-image-file" accept="image/*" class="hidden">
          </div>
          
          <div id="image-preview-container" class="hidden mt-2 flex items-center gap-3 bg-slate-50 border p-2.5 rounded-lg">
            <img id="image-preview-img" src="" class="w-12 h-12 object-cover rounded border bg-white">
            <div class="flex-1 min-w-0">
              <p id="image-preview-filename" class="text-[11px] font-bold text-slate-800 truncate"></p>
              <p id="image-preview-size" class="text-[9px] text-slate-400"></p>
            </div>
            <button type="button" id="image-preview-remove" class="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-red-500 border-0 bg-transparent cursor-pointer">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <button type="submit" id="admin-add-product-btn" class="w-full bg-[#0f1e36] hover:bg-[#1a3258] text-white py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-0">
          <i data-lucide="plus" class="w-4 h-4"></i> Add Product Catalog
        </button>
      </form>
    `;
  }

  return `
    <div class="animate-in fade-in duration-300">
      <h3 class="font-sans font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3 mb-5">
        <i data-lucide="shield-check" class="w-4 h-4 text-brand-orange"></i>
        Administrator Verification Hub
      </h3>
      
      <!-- Hub Description -->
      <div class="bg-[#0f1e36] text-white p-4 rounded-xl border border-slate-800 text-xs mb-5 shadow-md flex flex-col gap-2">
        <div class="flex items-center gap-2 text-brand-orange">
          <i data-lucide="shield" class="w-4.5 h-4.5"></i>
          <h4 class="font-extrabold uppercase tracking-wider text-[11px]">CEO Admin Controls Hub</h4>
        </div>
        <p class="text-slate-300 font-light leading-relaxed">
          Welcome back, <strong class="text-white font-bold">OYEWOLE TOSIN OLUMIDE</strong>. As the administrator of Gold & Rock Leather Craft, use this panel to inspect incoming bank payments or upload new custom products directly to Firebase.
        </p>
      </div>

      <!-- Admin Mini Tabs -->
      <div class="flex border-b border-slate-200 mb-5 text-center">
        <button id="admin-tab-verify" class="flex-1 py-2.5 font-bold text-[10px] tracking-wider uppercase cursor-pointer transition-colors border-b-2 ${adminSubTab === 'verify-payments' ? 'text-brand-orange bg-slate-50 border-brand-orange' : 'text-slate-400 border-transparent hover:text-slate-600 bg-transparent'}">
          Verify Orders
        </button>
        <button id="admin-tab-upload" class="flex-1 py-2.5 font-bold text-[10px] tracking-wider uppercase cursor-pointer transition-colors border-b-2 ${adminSubTab === 'upload-product' ? 'text-brand-orange bg-slate-50 border-brand-orange' : 'text-slate-400 border-transparent hover:text-slate-600 bg-transparent'}">
          Upload New Product
        </button>
      </div>
      
      ${mainContentHTML}
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
  // Admin sub-tab toggling
  const adminTabVerify = document.getElementById('admin-tab-verify');
  const adminTabUpload = document.getElementById('admin-tab-upload');
  
  if (adminTabVerify) {
    adminTabVerify.addEventListener('click', () => {
      adminSubTab = 'verify-payments';
      renderAccountView();
    });
  }
  if (adminTabUpload) {
    adminTabUpload.addEventListener('click', () => {
      adminSubTab = 'upload-product';
      renderAccountView();
    });
  }

  // Admin Approve Buttons
  document.querySelectorAll('.admin-approve-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const orderId = btn.getAttribute('data-order-id');
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Verifying...</span>
      `;
      
      try {
        await window.approveOrderPayment(orderId);
        showNotification(`Order ${orderId} has been marked as Paid Successfully!`, 'success');
        renderAccountView();
      } catch (err) {
        showNotification(err.message, 'danger');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
    });
  });

  // Admin Product Creation form & drag-and-drop file handlers
  const imageZone = document.getElementById('image-drag-drop-zone');
  const fileInput = document.getElementById('prod-image-file');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('image-preview-img');
  const previewFilename = document.getElementById('image-preview-filename');
  const previewSize = document.getElementById('image-preview-size');
  const previewRemove = document.getElementById('image-preview-remove');

  const handleFileSelection = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showNotification('Please select a valid image file (JPEG, PNG, WEBP).', 'info');
      return;
    }
    selectedProductImageFile = file;
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) previewImg.src = e.target.result;
      if (previewFilename) previewFilename.textContent = file.name;
      if (previewSize) previewSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
      if (previewContainer) previewContainer.classList.remove('hidden');
      if (imageZone) imageZone.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  };

  if (imageZone && fileInput) {
    imageZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    });

    imageZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageZone.classList.add('border-brand-orange');
      imageZone.classList.add('bg-orange-50/10');
    });

    ['dragleave', 'dragend'].forEach(type => {
      imageZone.addEventListener(type, () => {
        imageZone.classList.remove('border-brand-orange');
        imageZone.classList.remove('bg-orange-50/10');
      });
    });

    imageZone.addEventListener('drop', (e) => {
      e.preventDefault();
      imageZone.classList.remove('border-brand-orange');
      imageZone.classList.remove('bg-orange-50/10');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });
  }

  if (previewRemove) {
    previewRemove.addEventListener('click', () => {
      selectedProductImageFile = null;
      if (fileInput) fileInput.value = '';
      if (previewContainer) previewContainer.classList.add('hidden');
      if (imageZone) imageZone.classList.remove('hidden');
    });
  }

  const addProductForm = document.getElementById('admin-add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!selectedProductImageFile) {
        showNotification('Please select or upload a product image first.', 'info');
        return;
      }

      const submitBtn = document.getElementById('admin-add-product-btn');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Uploading and Creating...</span>
        `;
      }

      const prodData = {
        id: document.getElementById('prod-id').value.trim(),
        name: document.getElementById('prod-name').value.trim(),
        category: document.getElementById('prod-category').value,
        price: parseFloat(document.getElementById('prod-price').value),
        description: document.getElementById('prod-description').value.trim(),
        stock: 10,
        colors: ["Default Leather", "Classic Black", "Vintage Brown"],
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" // default placeholder fallback
      };

      try {
        await window.addProductToCatalog(prodData, selectedProductImageFile);
        showNotification('Product successfully uploaded and registered in catalog database!', 'success');
        selectedProductImageFile = null;
        adminSubTab = 'verify-payments';
        renderAccountView();
      } catch (err) {
        showNotification(err.message || 'Failed to create product.', 'danger');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
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
        renderAccountView();
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
        renderAccountView();
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
