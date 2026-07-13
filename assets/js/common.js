// Common UI Injection & Logic
function initCommonUI() {
  renderNavbar();
  renderBottomNav();
  renderFooter();
  renderCartDrawer();
  renderToastContainer();
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup common event listeners
  setupNavbarListeners();
  setupCartDrawerListeners();
  updateCommonBadges();

  // Listen to state changes to update badges & cart drawer
  window.addEventListener('cartUpdated', () => {
    updateCommonBadges();
    renderCartItems();
  });
  window.addEventListener('wishlistUpdated', updateCommonBadges);
  window.addEventListener('notificationsUpdated', () => {
    updateCommonBadges();
    renderNotificationsDropdownList();
  });
  window.addEventListener('authUpdated', () => {
    renderNavbar(); // re-render to update user status
    if (window.lucide) window.lucide.createIcons();
    setupNavbarListeners();
    updateCommonBadges();
  });

  // Handle WhatsApp button click floating anywhere
  const waBtn = document.getElementById('whatsapp-floating-btn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      window.open('https://wa.me/2348126730784?text=Hello%20Gold%20%26%20Rock%20Leather%20Craft%2C%20I%20would%20like%20to%20inquire%20about%20your%20custom%20leather%20crafts!', '_blank');
    });
  }

  // Handle sliding announcement messages
  const slideContainer = document.getElementById('header-announcement-slides');
  if (slideContainer) {
    let currentAnnSlide = 0;
    const annSlidesCount = 3;
    setInterval(() => {
      currentAnnSlide = (currentAnnSlide + 1) % annSlidesCount;
      slideContainer.style.transform = `translateY(-${currentAnnSlide * 20}px)`;
    }, 4500);
  }
}

// 1. Navbar Injected HTML
function renderNavbar() {
  const container = document.getElementById('header-container');
  if (!container) return;

  const currentUser = getMockCurrentUser();
  const currentPath = window.location.pathname;
  const isWishlistActive = currentPath.includes('wishlist.html');

  // Parse current search query if on index
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search') || '';

  container.innerHTML = `
    <header class="sticky top-0 z-30 w-full flex flex-col" id="app-header">
      <!-- Top Promotional Bar -->
      <div class="w-full bg-[#f68b1e] text-white py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-1.5 md:gap-2 shadow-sm">
        <i data-lucide="sparkles" class="w-3.5 h-3.5 animate-pulse text-white"></i>
        <span>Free delivery on orders over ₦30,000! Handcrafted in Nigeria's premium leather.</span>
      </div>

      <!-- Main Header -->
      <div class="w-full bg-[#0f1e36] text-white px-4 py-3 md:py-4 border-b border-slate-800">
        <div class="max-w-7xl mx-auto flex flex-col gap-2.5 md:gap-0 md:flex-row md:items-center md:justify-between">
          
          <!-- Logo and Mobile Header Controls -->
          <div class="flex items-center justify-between w-full md:w-auto">
            <a href="index.html" class="flex flex-col items-start cursor-pointer group text-left" id="header-logo-btn">
              <span class="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                GR <span class="text-brand-orange">STORE</span>
              </span>
              <span class="text-[9px] md:text-[10px] tracking-widest text-slate-400 font-mono -mt-1 group-hover:text-brand-orange transition-colors">
                BY GOLD & ROCK LEATHER
              </span>
            </a>

            <!-- Quick Mobile Cart/Wishlist Badges -->
            <div class="flex items-center gap-1.5 md:hidden">
              <a href="wishlist.html" class="p-2 hover:bg-slate-800/60 rounded-full relative ${isWishlistActive ? 'text-brand-orange bg-slate-800/40' : 'text-slate-200'}" title="Wishlist">
                <i data-lucide="heart" class="w-5 h-5"></i>
                <span id="mobile-wishlist-badge" class="hidden absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">0</span>
              </a>
              <button id="mobile-cart-btn" class="p-2 hover:bg-slate-800/60 rounded-full text-slate-200 relative" title="Cart">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                <span id="mobile-cart-badge" class="hidden absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 animate-bounce">0</span>
              </button>
            </div>
          </div>

          <!-- Search Bar Container with suggestions dropdown -->
          <div class="relative w-full md:max-w-xl md:mx-6">
            <form id="desktop-search-form" class="w-full flex items-center bg-slate-800 border border-slate-700 hover:border-slate-500 focus-within:border-brand-orange rounded-lg overflow-hidden transition-colors">
              <div class="pl-3 text-slate-400">
                <i data-lucide="search" class="w-4 h-4"></i>
              </div>
              <input
                type="text"
                id="search-input-field"
                placeholder="Search bags, wallets, belts, accessories..."
                value="${searchQuery}"
                class="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                autocomplete="off"
              />
              ${searchQuery ? `
                <button type="button" id="clear-search-btn" class="px-2 text-slate-400 hover:text-white text-xs mr-1">
                  Clear
                </button>
              ` : ''}
              <button type="submit" class="bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-2 font-medium text-xs md:text-sm tracking-wide transition-colors uppercase cursor-pointer">
                Search
              </button>
            </form>
            
            <!-- Instant Search Suggestions Dropdown -->
            <div id="search-suggestions-dropdown" class="hidden absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[320px] overflow-y-auto">
              <!-- Dynamically Populated -->
            </div>
          </div>

          <!-- Right Desktop Utilities -->
          <div class="hidden md:flex items-center gap-2.5">
            <!-- Wishlist Button -->
            <a href="wishlist.html" class="p-2.5 hover:bg-slate-800/60 rounded-full text-slate-200 hover:text-brand-orange transition-colors relative" title="Wishlist">
              <i data-lucide="heart" class="w-5.5 h-5.5"></i>
              <span id="desktop-wishlist-badge" class="hidden absolute top-1 right-1 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36]">0</span>
            </a>

            <!-- Cart Trigger Button -->
            <button id="desktop-cart-btn" class="p-2.5 hover:bg-slate-800/60 rounded-full text-slate-200 hover:text-brand-orange transition-colors relative cursor-pointer" title="Cart">
              <i data-lucide="shopping-cart" class="w-5.5 h-5.5"></i>
              <span id="desktop-cart-badge" class="hidden absolute top-1 right-1 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36]">0</span>
            </button>

            <!-- Notifications Trigger Button -->
            <div class="relative">
              <button id="desktop-notifications-btn" class="p-2.5 hover:bg-slate-800/60 rounded-full text-slate-200 hover:text-brand-orange transition-colors relative cursor-pointer" title="Notifications">
                <i data-lucide="bell" class="w-5.5 h-5.5"></i>
                <span id="desktop-notifications-badge" class="hidden absolute top-1 right-1 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36]">0</span>
              </button>
              
              <!-- Notifications Dropdown Menu -->
              <div id="desktop-notifications-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-left">
                <div class="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <i data-lucide="bell" class="w-3.5 h-3.5 text-[#f68b1e] animate-bounce"></i> Notifications Log
                  </span>
                  <button id="mark-notif-read-btn" class="text-[10px] text-[#f68b1e] hover:underline font-bold cursor-pointer">
                    Mark all read
                  </button>
                </div>
                <div id="notifications-dropdown-list" class="max-h-60 overflow-y-auto divide-y divide-slate-800 flex flex-col">
                  <!-- Dynamic Notifications -->
                </div>
                <div class="px-4 pt-2 border-t border-slate-800 text-center">
                  <a href="account.html?tab=settings" class="text-[9px] text-slate-400 hover:text-white hover:underline font-bold">
                    Notification Settings
                  </a>
                </div>
              </div>
            </div>

            <!-- Separator -->
            <span class="w-[1px] h-6 bg-slate-800 mx-1"></span>

            <!-- User dropdown and Auth -->
            <div class="relative">
              ${currentUser ? `
                <button id="user-menu-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-200 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer">
                  <div class="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold">
                    ${currentUser.fullName.charAt(0)}
                  </div>
                  <span class="max-w-[80px] truncate">${currentUser.fullName}</span>
                  <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <!-- Dropdown Card -->
                <div id="user-dropdown-menu" class="hidden absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div class="px-4 py-2 border-b border-slate-800">
                    <p class="text-[10px] text-slate-500 font-medium">Signed in as</p>
                    <p class="text-xs text-slate-300 font-bold truncate">${currentUser.email}</p>
                  </div>
                  <a href="account.html" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <i data-lucide="user" class="w-4 h-4"></i> My Account
                  </a>
                  <a href="account.html?tab=orders" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <i data-lucide="package" class="w-4 h-4"></i> Order History
                  </a>
                  <button id="logout-btn" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 border-t border-slate-800 mt-1.5 transition-colors cursor-pointer text-left">
                    <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
                  </button>
                </div>
              ` : `
                <a href="account.html" class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-md">
                  <i data-lucide="user" class="w-4 h-4"></i>
                  Sign In
                </a>
              `}
            </div>
          </div>
        </div>
      </div>
      <!-- Sliding Announcement Bar (Orange, Under Search Bar, Jumia Style) -->
      <div class="w-full bg-[#f68b1e] text-white py-1.5 px-4 border-t border-orange-600/30 text-xs font-semibold overflow-hidden relative shadow-inner">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-hidden h-5">
          <!-- Left side: CEO Badge / Title -->
          <div class="flex items-center gap-1.5 shrink-0 bg-[#0f1e36]/15 px-2 py-0.5 rounded border border-white/20 select-none">
            <span class="text-[8px] md:text-[9px] uppercase tracking-wider font-extrabold text-white">CEO: OYEWOLE TOSIN OLUMIDE</span>
          </div>
          <!-- Centered text: sliding messages container -->
          <div class="flex-1 overflow-hidden relative h-5">
            <div id="header-announcement-slides" class="absolute inset-0 flex flex-col transition-all duration-500 transform translate-y-0">
              <div class="h-5 flex items-center justify-center text-center text-[10px] md:text-xs font-bold leading-none truncate select-none">
                🌟 PREMIUM HANDCRAFTED LEATHER CRAFTS &middot; POWERED BY GOLD & ROCK LEATHER CRAFT!
              </div>
              <div class="h-5 flex items-center justify-center text-center text-[10px] md:text-xs font-bold leading-none truncate select-none">
                🎒 EXQUISITE LAPTOP BAGS, SCHOOL GEAR, AND LADIES HANDBAGS DESIGNED TO LAST!
              </div>
              <div class="h-5 flex items-center justify-center text-center text-[10px] md:text-xs font-bold leading-none truncate select-none">
                📞 TALK TO THE DESIGNERS DIRECTLY &middot; PHONE/WHATSAPP: 08126730784
              </div>
            </div>
          </div>
          <!-- Right side: contact info -->
          <div class="hidden md:flex items-center gap-1.5 shrink-0 text-[10px]">
            <i data-lucide="phone" class="w-3.5 h-3.5 text-white"></i>
            <span>08126730784</span>
          </div>
        </div>
      </div>
    </header>
  `;

  // Sync back input value
  const searchInput = container.querySelector('#search-input-field');
  if (searchInput) {
    searchInput.value = searchQuery;
  }
}

// 2. Mobile Bottom Navigation Injected HTML
function renderBottomNav() {
  const container = document.getElementById('bottom-nav-container');
  if (!container) return;

  const currentPath = window.location.pathname;
  const isHome = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/') || (!currentPath.includes('.html') && !currentPath.includes('categories') && !currentPath.includes('cart') && !currentPath.includes('wishlist') && !currentPath.includes('account') && !currentPath.includes('checkout') && !currentPath.includes('product'));
  const isCategories = currentPath.includes('categories.html');
  const isCart = currentPath.includes('cart.html');
  const isWishlist = currentPath.includes('wishlist.html');
  const isAccount = currentPath.includes('account.html');

  container.innerHTML = `
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2.5 px-2 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[safe] font-sans" id="mobile-bottom-navigation" style="font-family: 'Poppins', sans-serif;">
      <a href="index.html" class="flex flex-col items-center justify-center flex-1 py-1 px-1.5 transition-all duration-200 active:scale-95 group ${isHome ? 'text-[#F68B1E] font-bold' : 'text-slate-600 hover:text-[#F68B1E]'}" id="nav-item-home">
        <div class="relative flex items-center justify-center p-1 rounded-full group-hover:bg-orange-50 group-active:bg-orange-100 transition-colors">
          <i data-lucide="home" class="w-5 h-5 ${isHome ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
        </div>
        <span class="text-[10px] tracking-wide mt-0.5">Home</span>
        ${isHome ? '<span class="absolute bottom-0 w-6 h-[2.5px] bg-[#F68B1E] rounded-full"></span>' : ''}
      </a>

      <a href="categories.html" class="flex flex-col items-center justify-center flex-1 py-1 px-1.5 transition-all duration-200 active:scale-95 group ${isCategories ? 'text-[#F68B1E] font-bold' : 'text-slate-600 hover:text-[#F68B1E]'}" id="nav-item-categories">
        <div class="relative flex items-center justify-center p-1 rounded-full group-hover:bg-orange-50 group-active:bg-orange-100 transition-colors">
          <i data-lucide="grid" class="w-5 h-5 ${isCategories ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
        </div>
        <span class="text-[10px] tracking-wide mt-0.5">Categories</span>
        ${isCategories ? '<span class="absolute bottom-0 w-6 h-[2.5px] bg-[#F68B1E] rounded-full"></span>' : ''}
      </a>

      <a href="cart.html" class="flex flex-col items-center justify-center flex-1 py-1 px-1.5 transition-all duration-200 active:scale-95 group ${isCart ? 'text-[#F68B1E] font-bold' : 'text-slate-600 hover:text-[#F68B1E]'}" id="mobile-bottom-cart-btn">
        <div class="relative flex items-center justify-center p-1 rounded-full group-hover:bg-orange-50 group-active:bg-orange-100 transition-colors">
          <i data-lucide="shopping-cart" class="w-5 h-5 ${isCart ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
          <span id="bottom-cart-badge" class="hidden absolute -top-1 -right-1.5 bg-[#F68B1E] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">0</span>
        </div>
        <span class="text-[10px] tracking-wide mt-0.5">Cart</span>
        ${isCart ? '<span class="absolute bottom-0 w-6 h-[2.5px] bg-[#F68B1E] rounded-full"></span>' : ''}
      </a>

      <a href="wishlist.html" class="flex flex-col items-center justify-center flex-1 py-1 px-1.5 transition-all duration-200 active:scale-95 group ${isWishlist ? 'text-[#F68B1E] font-bold' : 'text-slate-600 hover:text-[#F68B1E]'}" id="nav-item-wishlist">
        <div class="relative flex items-center justify-center p-1 rounded-full group-hover:bg-orange-50 group-active:bg-orange-100 transition-colors">
          <i data-lucide="heart" class="w-5 h-5 ${isWishlist ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
          <span id="bottom-wishlist-badge" class="hidden absolute -top-1 -right-1.5 bg-[#F68B1E] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">0</span>
        </div>
        <span class="text-[10px] tracking-wide mt-0.5">Wishlist</span>
        ${isWishlist ? '<span class="absolute bottom-0 w-6 h-[2.5px] bg-[#F68B1E] rounded-full"></span>' : ''}
      </a>

      <a href="account.html" class="flex flex-col items-center justify-center flex-1 py-1 px-1.5 transition-all duration-200 active:scale-95 group ${isAccount ? 'text-[#F68B1E] font-bold' : 'text-slate-600 hover:text-[#F68B1E]'}" id="nav-item-account">
        <div class="relative flex items-center justify-center p-1 rounded-full group-hover:bg-orange-50 group-active:bg-orange-100 transition-colors">
          <i data-lucide="user" class="w-5 h-5 ${isAccount ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
        </div>
        <span class="text-[10px] tracking-wide mt-0.5">Account</span>
        ${isAccount ? '<span class="absolute bottom-0 w-6 h-[2.5px] bg-[#F68B1E] rounded-full"></span>' : ''}
      </a>
    </div>
  `;
}

// 3. Footer Injected HTML - Cleared for Jumia experience
function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;
  container.innerHTML = '';
}

// 4. Cart Drawer Injected HTML & UI
function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Overlay Background -->
    <div id="cart-drawer-backdrop" class="hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"></div>

    <!-- Drawer Content Panel -->
    <div id="cart-drawer-panel" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col translate-x-full transition-transform duration-300" style="padding-bottom: env(safe-area-inset-bottom)">
      <!-- Header -->
      <div class="p-4 border-b flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-2">
          <i data-lucide="shopping-cart" class="w-5 h-5 text-brand-blue"></i>
          <h3 class="font-sans font-bold text-slate-900 text-base">Shopping Cart</h3>
        </div>
        <button id="close-cart-drawer-btn" class="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Scrollable Cart Items Container -->
      <div id="cart-drawer-items" class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <!-- Dynamically Populated -->
      </div>

      <!-- Footer Subtotal & Action buttons -->
      <div class="p-4 border-t bg-slate-50 flex flex-col gap-3">
        <div class="flex items-center justify-between text-sm text-slate-500">
          <span>Shipping delivery fee</span>
          <span class="font-mono font-medium">₦1,500</span>
        </div>
        <div class="flex items-center justify-between border-t border-slate-200 pt-2 mb-2">
          <span class="font-sans font-bold text-slate-800 text-sm">Order Total</span>
          <span id="cart-drawer-total" class="font-mono font-extrabold text-brand-orange text-lg">₦0</span>
        </div>
        <a href="checkout.html" id="cart-drawer-checkout-btn" class="w-full bg-[#0f1e36] hover:bg-[#162a4d] text-white py-3 rounded-xl font-bold text-center text-xs tracking-wider uppercase transition-colors shadow-lg cursor-pointer">
          Proceed To Checkout
        </a>
        <button id="cart-drawer-continue-btn" class="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold py-1 transition-colors cursor-pointer">
          Continue Shopping
        </button>
      </div>
    </div>
  `;
}

// 5. Toast Container Injection
function renderToastContainer() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  container.innerHTML = `
    <div id="toast-notification-popup" class="hidden fixed bottom-24 md:bottom-6 left-6 right-6 md:left-auto md:w-80 bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div id="toast-indicator" class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#25D366] animate-pulse"></div>
      <p id="toast-text" class="text-xs md:text-sm font-medium flex-1">Item added to cart</p>
    </div>
  `;
}

// 6. Floating notification toast function
function showNotification(message, type = 'success') {
  const toast = document.getElementById('toast-notification-popup');
  const toastText = document.getElementById('toast-text');
  const indicator = document.getElementById('toast-indicator');
  
  if (!toast || !toastText || !indicator) return;

  toastText.textContent = message;

  if (type === 'success') {
    indicator.className = 'w-2.5 h-2.5 rounded-full shrink-0 bg-[#25D366] animate-pulse';
  } else {
    indicator.className = 'w-2.5 h-2.5 rounded-full shrink-0 bg-brand-orange animate-pulse';
  }

  toast.classList.remove('hidden');
  toast.classList.add('flex');

  // Clear timeout if already scheduled
  if (window.toastTimeout) clearTimeout(window.toastTimeout);

  window.toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 3500);
}

// Helper: Open/Close Drawer
function toggleCartDrawer(open) {
  const panel = document.getElementById('cart-drawer-panel');
  const backdrop = document.getElementById('cart-drawer-backdrop');

  if (!panel || !backdrop) return;

  if (open) {
    backdrop.classList.remove('hidden');
    panel.classList.remove('translate-x-full');
    renderCartItems();
  } else {
    backdrop.classList.add('hidden');
    panel.classList.add('translate-x-full');
  }
}

// Render dynamic items in Cart Drawer
function renderCartItems() {
  const container = document.getElementById('cart-drawer-items');
  const totalEl = document.getElementById('cart-drawer-total');
  const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');
  if (!container || !totalEl) return;

  const items = getMockCart();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center text-center py-12">
        <i data-lucide="shopping-cart" class="w-12 h-12 text-slate-300 stroke-[1.2px] mb-3"></i>
        <p class="text-sm text-slate-400 italic">Your cart is currently empty.</p>
        <button id="drawer-shop-btn" class="mt-4 text-xs font-bold text-brand-orange hover:underline cursor-pointer">Explore Products</button>
      </div>
    `;
    totalEl.textContent = '₦0';
    if (checkoutBtn) checkoutBtn.classList.add('pointer-events-none', 'opacity-50');
    
    // Add event click
    const shopBtn = document.getElementById('drawer-shop-btn');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        toggleCartDrawer(false);
        window.location.href = 'index.html';
      });
    }

    if (window.lucide) window.lucide.createIcons();
    return;
  }

  if (checkoutBtn) checkoutBtn.classList.remove('pointer-events-none', 'opacity-50');

  let itemsHTML = '';
  let subtotal = 0;

  items.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;
    const options = item.selectedColor ? `<p class="text-[10px] text-slate-400 mt-0.5 capitalize">Color: ${item.selectedColor}</p>` : '';

    itemsHTML += `
      <div class="flex gap-3 border-b border-slate-100 pb-3" id="cart-item-${item.id}">
        <!-- Thumbnail image -->
        <a href="product.html?id=${item.product.id}" class="w-16 h-16 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
          <img src="${item.product.images[0]}" alt="${item.product.name}" class="w-full h-full object-cover">
        </a>

        <!-- Middle Content info -->
        <div class="min-w-0 flex-1 flex flex-col justify-between">
          <div>
            <a href="product.html?id=${item.product.id}" class="text-xs font-bold text-slate-800 line-clamp-1 hover:text-brand-orange transition-colors">${item.product.name}</a>
            ${options}
          </div>
          <div class="flex items-center justify-between">
            <!-- Counter controls -->
            <div class="flex items-center border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
              <button class="px-2 py-0.5 hover:bg-slate-200 text-slate-500 text-xs font-bold cursor-pointer transition-colors minus-btn" data-id="${item.id}">-</button>
              <span class="px-2 text-xs font-mono font-bold text-slate-700">${item.quantity}</span>
              <button class="px-2 py-0.5 hover:bg-slate-200 text-slate-500 text-xs font-bold cursor-pointer transition-colors plus-btn" data-id="${item.id}">+</button>
            </div>
            
            <span class="font-mono text-xs font-extrabold text-slate-800">₦${itemTotal.toLocaleString()}</span>
          </div>
        </div>

        <!-- Remove option -->
        <button class="text-slate-300 hover:text-red-500 transition-colors p-1 align-top cursor-pointer delete-item-btn" data-id="${item.id}">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  });

  container.innerHTML = itemsHTML;
  totalEl.textContent = `₦${(subtotal + 1500).toLocaleString()}`;

  if (window.lucide) window.lucide.createIcons();

  // Add click handlers
  container.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const curItem = items.find(i => i.id === id);
      if (curItem) {
        updateMockCartQuantity(id, curItem.quantity - 1);
      }
    });
  });

  container.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const curItem = items.find(i => i.id === id);
      if (curItem) {
        updateMockCartQuantity(id, curItem.quantity + 1);
      }
    });
  });

  container.querySelectorAll('.delete-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target.closest('.delete-item-btn');
      const id = target.getAttribute('data-id');
      removeFromMockCart(id);
      showNotification('Item removed from cart', 'info');
    });
  });
}

// Sync counts on headers & footers
function updateCommonBadges() {
  const cart = getMockCart();
  const wishlist = getMockWishlist();
  const notifications = window.getMockNotifications ? window.getMockNotifications() : [];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const b1 = document.getElementById('mobile-cart-badge');
  const b2 = document.getElementById('mobile-wishlist-badge');
  const b3 = document.getElementById('desktop-cart-badge');
  const b4 = document.getElementById('desktop-wishlist-badge');
  const b5 = document.getElementById('bottom-cart-badge');
  const b6 = document.getElementById('bottom-wishlist-badge');
  const b7 = document.getElementById('desktop-notifications-badge');

  if (b1) {
    b1.textContent = cartCount;
    b1.classList.toggle('hidden', cartCount === 0);
  }
  if (b2) {
    b2.textContent = wishlistCount;
    b2.classList.toggle('hidden', wishlistCount === 0);
  }
  if (b3) {
    b3.textContent = cartCount;
    b3.classList.toggle('hidden', cartCount === 0);
  }
  if (b4) {
    b4.textContent = wishlistCount;
    b4.classList.toggle('hidden', wishlistCount === 0);
  }
  if (b5) {
    b5.textContent = cartCount;
    b5.classList.toggle('hidden', cartCount === 0);
  }
  if (b6) {
    b6.textContent = wishlistCount;
    b6.classList.toggle('hidden', wishlistCount === 0);
  }
  if (b7) {
    b7.textContent = unreadNotifCount;
    b7.classList.toggle('hidden', unreadNotifCount === 0);
  }

  // Auto-populate notifications dropdown list in case it's open or opening
  renderNotificationsDropdownList();
}

// Hook up header / menu click actions
function setupNavbarListeners() {
  // User menu dropdown toggle
  const userBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown-menu');

  if (userBtn && dropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
    });
  }

  // Notifications Bell trigger toggle
  const notifBtn = document.getElementById('desktop-notifications-btn');
  const notifDropdown = document.getElementById('desktop-notifications-dropdown');
  const markReadBtn = document.getElementById('mark-notif-read-btn');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Hide other dropdown if open
      if (dropdown) dropdown.classList.add('hidden');
      notifDropdown.classList.toggle('hidden');
      if (!notifDropdown.classList.contains('hidden')) {
        renderNotificationsDropdownList();
      }
    });

    document.addEventListener('click', () => {
      notifDropdown.classList.add('hidden');
    });

    notifDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      if (window.markAllNotificationsAsRead) {
        window.markAllNotificationsAsRead();
        updateCommonBadges();
        renderNotificationsDropdownList();
        showNotification('All notifications marked as read!', 'success');
      }
    });
  }

  // Logout action
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutMockUser();
      showNotification('Signed out successfully', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }

  // Search Submit Redirection & Auto-Suggest
  const searchForm = document.getElementById('desktop-search-form');
  const searchInput = document.getElementById('search-input-field');
  const clearBtn = document.getElementById('clear-search-btn');
  const suggestionsDropdown = document.getElementById('search-suggestions-dropdown');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = searchInput.value.trim();
      if (val) {
        window.location.href = `index.html?search=${encodeURIComponent(val)}`;
      } else {
        window.location.href = 'index.html';
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        if (suggestionsDropdown) {
          suggestionsDropdown.innerHTML = '';
          suggestionsDropdown.classList.add('hidden');
        }
        window.location.href = 'index.html';
      });
    }

    if (suggestionsDropdown) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (!val) {
          suggestionsDropdown.innerHTML = '';
          suggestionsDropdown.classList.add('hidden');
          return;
        }

        const query = val.toLowerCase();
        const products = getMockProducts();

        // Search by Name, Category, or Price
        const matches = products.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.price.toString().includes(query)
        );

        if (matches.length === 0) {
          suggestionsDropdown.innerHTML = `
            <div class="px-4 py-3 text-xs text-slate-400 italic">No matches found for "${val}"</div>
          `;
          suggestionsDropdown.classList.remove('hidden');
          return;
        }

        let html = '<div class="flex flex-col border-b border-slate-800 max-h-[240px] overflow-y-auto">';
        matches.slice(0, 5).forEach(m => {
          html += `
            <a href="product.html?id=${m.id}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/80 transition-colors border-b border-slate-800 last:border-0 text-left">
              <img src="${m.images[0]}" class="w-8 h-8 rounded-md object-cover border border-slate-700 shrink-0" />
              <div class="min-w-0 flex-1">
                <h4 class="text-xs font-bold text-white truncate leading-tight">${m.name}</h4>
                <span class="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">${m.category.replace('-', ' ')}</span>
              </div>
              <span class="text-xs font-extrabold text-brand-orange shrink-0 font-mono">₦${m.price.toLocaleString()}</span>
            </a>
          `;
        });
        html += '</div>';

        html += `
          <button type="submit" id="view-all-suggestions-btn" class="w-full text-center px-4 py-2 bg-slate-950/40 hover:bg-slate-950 text-[10px] font-bold text-slate-300 hover:text-brand-orange uppercase tracking-wider border-t border-slate-800 cursor-pointer">
            Show all ${matches.length} results
          </button>
        `;

        suggestionsDropdown.innerHTML = html;
        suggestionsDropdown.classList.remove('hidden');

        // Prevent form submit if they click results
        const viewAllBtn = document.getElementById('view-all-suggestions-btn');
        if (viewAllBtn) {
          viewAllBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            window.location.href = `index.html?search=${encodeURIComponent(val)}`;
          });
        }
      });

      // Close suggestion dropdown if user clicks away
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
          suggestionsDropdown.classList.add('hidden');
        }
      });
    }
  }

  // Trigger Cart opening
  const deskCartBtn = document.getElementById('desktop-cart-btn');
  const mobCartBtn = document.getElementById('mobile-cart-btn');
  const botCartBtn = document.getElementById('mobile-bottom-cart-btn');

  if (deskCartBtn) deskCartBtn.addEventListener('click', () => toggleCartDrawer(true));
  if (mobCartBtn) mobCartBtn.addEventListener('click', () => toggleCartDrawer(true));
  if (botCartBtn) botCartBtn.addEventListener('click', () => toggleCartDrawer(true));
}

// Set up backdrop / closing events inside cart drawer
function setupCartDrawerListeners() {
  const closeBtn = document.getElementById('close-cart-drawer-btn');
  const continueBtn = document.getElementById('cart-drawer-continue-btn');
  const backdrop = document.getElementById('cart-drawer-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', () => toggleCartDrawer(false));
  if (continueBtn) continueBtn.addEventListener('click', () => toggleCartDrawer(false));
  if (backdrop) backdrop.addEventListener('click', () => toggleCartDrawer(false));
}

// Global registrations
window.initCommonUI = initCommonUI;
window.toggleCartDrawer = toggleCartDrawer;
window.renderCartItems = renderCartItems;
window.showNotification = showNotification;

// Reusable Grid Renderer
function renderGrid(container, list) {
  const isScroller = container.id === 'flash-sale-scroller';
  container.innerHTML = list.map(prod => getProductCardHtml(prod, isScroller)).join('');
  setupCardEvents(container, list);
}

// Generate premium product card HTML
function getProductCardHtml(prod, isScroller = false) {
  const isSaved = isProductInWishlist(prod.id);
  const isOutOfStock = prod.stock === 0;

  const price = prod.price;
  const originalPrice = prod.originalPrice || prod.oldPrice || Math.round(price / 0.82);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  // Filled & Empty star SVGs for pixel-perfect display
  const starFilledSvg = `<svg class="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  const starEmptySvg = `<svg class="w-3 h-3 text-slate-200 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;

  let starsHtml = '';
  const roundedRating = Math.round(prod.rating || 5);
  for (let i = 1; i <= 5; i++) {
    starsHtml += i <= roundedRating ? starFilledSvg : starEmptySvg;
  }

  // Top Left Badge
  let badgeHTML = `
    <span class="absolute top-3 left-3 bg-brand-orange text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs z-10">
      -${discountPercent}% OFF
    </span>
  `;

  if (prod.isBestSeller) {
    badgeHTML = `
      <span class="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs z-10 tracking-wider">
        BEST SELLER
      </span>
    `;
  } else if (prod.isNew) {
    badgeHTML = `
      <span class="absolute top-3 left-3 bg-[#1e3a8a] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs z-10 tracking-wider">
        NEW
      </span>
    `;
  }

  const scrollerClasses = isScroller ? 'min-w-[170px] max-w-[170px] md:min-w-[220px] md:max-w-[220px] shrink-0 snap-start' : 'w-full';

  return `
    <div class="bg-white border border-slate-100 rounded-2xl p-2.5 md:p-3.5 relative shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between h-full group ${scrollerClasses}" id="product-card-${prod.id}">
      <!-- Badge element -->
      ${badgeHTML}

      <!-- Favorite save button -->
      <button class="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 p-1.5 rounded-full border shadow-xs transition-all cursor-pointer wishlist-toggle-btn" data-id="${prod.id}" title="${isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}">
        <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-[#f68b1e] text-[#f68b1e]' : ''}"></i>
      </button>

      <div>
        <!-- Image wrapper linking to details page -->
        <a href="product.html?id=${prod.id}" class="block aspect-square w-full rounded-xl overflow-hidden relative border bg-slate-50 mb-3">
          <img src="${prod.images[0]}" alt="${prod.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          ${isOutOfStock ? `
            <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
              <span class="bg-red-600 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-md shadow-md">
                SOLD OUT
              </span>
            </div>
          ` : ''}
        </a>

        <!-- Content details -->
        <span class="text-[9px] md:text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">${prod.category.replace('-', ' ')}</span>
        <a href="product.html?id=${prod.id}" class="font-sans font-bold text-xs md:text-sm text-slate-800 line-clamp-1 group-hover:text-brand-orange transition-colors mt-0.5 block" title="${prod.name}">${prod.name}</a>
        
        <!-- Ratings bar -->
        <div class="flex items-center gap-1 mt-1.5">
          <div class="flex items-center gap-0.5">
            ${starsHtml}
          </div>
          <span class="text-[9px] md:text-[10px] text-slate-400 font-medium ml-1">(${prod.reviewsCount} reviews)</span>
        </div>
      </div>

      <!-- Price & Actions row -->
      <div class="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
        <div class="flex flex-col min-w-0">
          <div class="flex items-center">
            <span class="text-[9px] md:text-[10px] text-slate-400 line-through font-mono font-semibold leading-none">₦${originalPrice.toLocaleString()}</span>
            <span class="bg-orange-50 text-[#f68b1e] text-[8px] md:text-[9px] font-extrabold px-1.5 py-0.5 rounded ml-1.5 shrink-0">-${discountPercent}%</span>
          </div>
          <span class="font-mono font-extrabold text-[#0f1e36] text-xs md:text-sm leading-tight mt-0.5">₦${price.toLocaleString()}</span>
        </div>

        <!-- Add to cart instant buttons -->
        <button class="bg-[#f68b1e] hover:bg-brand-orange-dark text-white p-1.5 md:p-2.5 rounded-lg md:rounded-xl shadow-xs transition-colors cursor-pointer add-to-cart-btn ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}" data-id="${prod.id}" title="Add to Cart">
          <i data-lucide="shopping-cart" class="w-3.5 h-3.5 md:w-4 md:h-4"></i>
        </button>
      </div>
    </div>
  `;
}

// Card Event bindings (AddToCart & Saved Wishlist)
function setupCardEvents(container, list) {
  // Wishlist Toggles
  container.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const prod = list.find(p => p.id === id);
      if (prod) {
        const added = toggleMockWishlist(prod);
        if (added) {
          showNotification(`Added "${prod.name}" to Saved Items!`, 'success');
          btn.querySelector('i').classList.add('fill-brand-orange', 'text-brand-orange');
        } else {
          showNotification(`Removed "${prod.name}" from Saved Items.`, 'info');
          btn.querySelector('i').classList.remove('fill-brand-orange', 'text-brand-orange');
        }
      }
    });
  });

  // Add to Cart handlers
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const prod = list.find(p => p.id === id);
      if (prod) {
        addToMockCart(prod, 1);
        showNotification(`"${prod.name}" added to shopping cart!`, 'success');
        toggleCartDrawer(true);
      }
    });
  });
}

function renderNotificationsDropdownList() {
  const listContainer = document.getElementById('notifications-dropdown-list');
  if (!listContainer) return;

  const notifications = window.getMockNotifications ? window.getMockNotifications() : [];

  if (notifications.length === 0) {
    listContainer.innerHTML = `
      <div class="py-6 px-4 text-center text-slate-500 text-xs italic">
        No notifications yet.
      </div>
    `;
    return;
  }

  listContainer.innerHTML = notifications.map(notif => {
    let iconName = 'bell';
    let iconColor = 'text-slate-400';
    if (notif.type === 'success') {
      iconName = 'check-circle';
      iconColor = 'text-emerald-400';
    } else if (notif.type === 'info') {
      iconName = 'info';
      iconColor = 'text-sky-400';
    }
    
    const relativeTime = getRelativeTime(notif.date);

    return `
      <div class="px-4 py-3 flex gap-2.5 hover:bg-slate-800/40 transition-colors ${notif.read ? 'opacity-70' : 'bg-slate-800/10'}">
        <div class="shrink-0 mt-0.5">
          <i data-lucide="${iconName}" class="w-4 h-4 ${iconColor}"></i>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 justify-between">
            <p class="text-xs font-bold text-slate-200 leading-tight">${notif.title}</p>
            ${!notif.read ? '<span class="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>' : ''}
          </div>
          <p class="text-[11px] text-slate-400 font-light mt-1 leading-normal">${notif.message}</p>
          <span class="text-[9px] text-slate-500 font-mono mt-1.5 block">${relativeTime}</span>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function getRelativeTime(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

window.renderGrid = renderGrid;
window.getProductCardHtml = getProductCardHtml;
window.setupCardEvents = setupCardEvents;
window.renderNotificationsDropdownList = renderNotificationsDropdownList;
window.getRelativeTime = getRelativeTime;


