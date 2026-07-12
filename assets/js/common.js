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
      window.open('https://wa.me/2348123456789?text=Hello%20Gold%20%26%20Rock%20Leather%20Craft%2C%20I%20would%20like%20to%20inquire%20about%20your%20custom%20leather%20crafts!', '_blank');
    });
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
        <span>Free local delivery on orders over $100! Handcrafted in nigeria's premium leather.</span>
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

          <!-- Search Bar -->
          <form id="desktop-search-form" class="w-full md:max-w-xl md:mx-6 flex items-center bg-slate-800 border border-slate-700 hover:border-slate-500 focus-within:border-brand-orange rounded-lg overflow-hidden transition-colors">
            <div class="pl-3 text-slate-400">
              <i data-lucide="search" class="w-4 h-4"></i>
            </div>
            <input
              type="text"
              id="search-input-field"
              placeholder="Search bags, wallets, belts, accessories..."
              value="${searchQuery}"
              class="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
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
  const isHome = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
  const isCategories = currentPath.includes('categories.html');
  const isWishlist = currentPath.includes('wishlist.html');
  const isAccount = currentPath.includes('account.html');

  container.innerHTML = `
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1e36] border-t border-slate-800 flex items-center justify-around py-2 px-1 z-40 shadow-2xl pb-[safe]" id="mobile-bottom-navigation">
      <a href="index.html" class="flex flex-col items-center justify-center flex-1 py-1 px-2.5 transition-all relative ${isHome ? 'text-brand-orange scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'}">
        <div class="relative">
          <i data-lucide="home" class="w-5 h-5 ${isHome ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
        </div>
        <span class="text-[10px] tracking-wide mt-1">Home</span>
        ${isHome ? '<span class="absolute bottom-0 w-5 h-[2px] bg-brand-orange rounded-full"></span>' : ''}
      </a>

      <a href="categories.html" class="flex flex-col items-center justify-center flex-1 py-1 px-2.5 transition-all relative ${isCategories ? 'text-brand-orange scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'}">
        <div class="relative">
          <i data-lucide="grid" class="w-5 h-5 ${isCategories ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
        </div>
        <span class="text-[10px] tracking-wide mt-1">Categories</span>
        ${isCategories ? '<span class="absolute bottom-0 w-5 h-[2px] bg-brand-orange rounded-full"></span>' : ''}
      </a>

      <button id="mobile-bottom-cart-btn" class="flex flex-col items-center justify-center flex-1 py-1 px-2.5 transition-all relative text-slate-400 hover:text-slate-200 cursor-pointer">
        <div class="relative">
          <i data-lucide="shopping-cart" class="w-5 h-5 stroke-[1.8px]"></i>
          <span id="bottom-cart-badge" class="hidden absolute -top-1.5 -right-2 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36] animate-pulse">0</span>
        </div>
        <span class="text-[10px] tracking-wide mt-1">Cart</span>
      </button>

      <a href="wishlist.html" class="flex flex-col items-center justify-center flex-1 py-1 px-2.5 transition-all relative ${isWishlist ? 'text-brand-orange scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'}">
        <div class="relative">
          <i data-lucide="heart" class="w-5 h-5 ${isWishlist ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
          <span id="bottom-wishlist-badge" class="hidden absolute -top-1.5 -right-2 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0f1e36]">0</span>
        </div>
        <span class="text-[10px] tracking-wide mt-1">Saved</span>
        ${isWishlist ? '<span class="absolute bottom-0 w-5 h-[2px] bg-brand-orange rounded-full"></span>' : ''}
      </a>

      <a href="account.html" class="flex flex-col items-center justify-center flex-1 py-1 px-2.5 transition-all relative ${isAccount ? 'text-brand-orange scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'}">
        <div class="relative">
          <i data-lucide="user" class="w-5 h-5 ${isAccount ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}"></i>
        </div>
        <span class="text-[10px] tracking-wide mt-1">Account</span>
        ${isAccount ? '<span class="absolute bottom-0 w-5 h-[2px] bg-brand-orange rounded-full"></span>' : ''}
      </a>
    </div>
  `;
}

// 3. Footer Injected HTML
function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="w-full bg-[#0f1e36] text-slate-400 text-xs py-10 px-4 border-t border-slate-800 mt-12 mb-16 md:mb-0">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <!-- Brand identity -->
        <div class="flex flex-col gap-3">
          <h4 class="font-extrabold text-white font-display text-lg tracking-tight">
            GR <span class="text-brand-orange">STORE</span>
          </h4>
          <p class="text-[11px] text-slate-400 font-medium tracking-wide -mt-2">
            Powered by Gold & Rock Leather Craft
          </p>
          <p class="text-slate-400 font-light leading-relaxed max-w-xs mx-auto md:mx-0">
            Premium handcrafted leather bags designed for school, work, travel, and everyday elegance. Built for durability, quality, and timeless style.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col gap-2.5">
          <h4 class="font-bold text-white text-xs uppercase tracking-wider">Quick Links</h4>
          <ul class="flex flex-col gap-1.5 font-light">
            <li><a href="index.html" class="hover:text-brand-orange transition-colors">Home</a></li>
            <li><a href="categories.html" class="hover:text-brand-orange transition-colors">Browse Catalogue</a></li>
            <li><a href="wishlist.html" class="hover:text-brand-orange transition-colors">Saved Wishlist</a></li>
            <li><a href="account.html" class="hover:text-brand-orange transition-colors">My Profile Account</a></li>
          </ul>
        </div>

        <!-- Support & Policies -->
        <div class="flex flex-col gap-2.5">
          <h4 class="font-bold text-white text-xs uppercase tracking-wider">Policies & Info</h4>
          <ul class="flex flex-col gap-1.5 font-light">
            <li><a href="#about" class="hover:text-brand-orange transition-colors">About Us</a></li>
            <li><a href="#contact" class="hover:text-brand-orange transition-colors">Contact Support</a></li>
            <li><a href="#privacy" class="hover:text-brand-orange transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" class="hover:text-brand-orange transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>

        <!-- Connect with Us -->
        <div class="flex flex-col gap-3">
          <h4 class="font-bold text-white text-xs uppercase tracking-wider">Get in Touch</h4>
          <div class="flex flex-col gap-2 font-light">
            <a href="https://wa.me/2348123456789" target="_blank" class="flex items-center gap-2 justify-center md:justify-start hover:text-[#25D366] transition-colors">
              <i data-lucide="message-circle" class="w-4 h-4 text-[#25D366]"></i>
              <span>Chat on WhatsApp</span>
            </a>
            <a href="tel:+2348123456789" class="flex items-center gap-2 justify-center md:justify-start hover:text-brand-orange transition-colors">
              <i data-lucide="phone" class="w-4 h-4 text-brand-orange"></i>
              <span>+234 812 345 6789</span>
            </a>
            <p class="text-slate-500 text-[11px] mt-1">
              Victoria Island, Lagos State, Nigeria
            </p>
          </div>
        </div>
      </div>

      <!-- Copyright Area -->
      <div class="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-5 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
        <span>&copy; ${new Date().getFullYear()} GR STORE. Powered by Gold & Rock Leather Craft.</span>
        <span class="flex items-center gap-1.5 justify-center">
          <i data-lucide="heart" class="w-3.5 h-3.5 text-brand-orange fill-brand-orange"></i>
          <span>Handcrafted in Nigeria with Leather & Code</span>
        </span>
      </div>
    </footer>
  `;
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
          <span class="font-mono font-medium">$10.00</span>
        </div>
        <div class="flex items-center justify-between border-t border-slate-200 pt-2 mb-2">
          <span class="font-sans font-bold text-slate-800 text-sm">Order Total</span>
          <span id="cart-drawer-total" class="font-mono font-extrabold text-brand-orange text-lg">$0.00</span>
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
    totalEl.textContent = '$0.00';
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
            
            <span class="font-mono text-xs font-extrabold text-slate-800">$${itemTotal}</span>
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
  totalEl.textContent = `$${(subtotal + 10).toFixed(2)}`;

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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const b1 = document.getElementById('mobile-cart-badge');
  const b2 = document.getElementById('mobile-wishlist-badge');
  const b3 = document.getElementById('desktop-cart-badge');
  const b4 = document.getElementById('desktop-wishlist-badge');
  const b5 = document.getElementById('bottom-cart-badge');
  const b6 = document.getElementById('bottom-wishlist-badge');

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

  // Search Submit Redirection
  const searchForm = document.getElementById('desktop-search-form');
  const searchInput = document.getElementById('search-input-field');
  const clearBtn = document.getElementById('clear-search-btn');

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
        window.location.href = 'index.html';
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
  container.innerHTML = list.map(prod => getProductCardHtml(prod)).join('');
  setupCardEvents(container, list);
}

// Generate premium product card HTML
function getProductCardHtml(prod) {
  const isSaved = isProductInWishlist(prod.id);
  const isFlash = prod.isFlashSale;
  const isOutOfStock = prod.stock === 0;

  let badgeHTML = '';
  if (isFlash) {
    badgeHTML = `
      <span class="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-0.5 shadow-sm z-10 animate-pulse">
        <i data-lucide="percent" class="w-2.5 h-2.5 stroke-[3px]"></i>
        ${prod.flashSaleDiscount}% OFF
      </span>
    `;
  } else if (prod.isBestSeller) {
    badgeHTML = `
      <span class="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm z-10 tracking-wider">
        BEST SELLER
      </span>
    `;
  } else if (prod.isNew) {
    badgeHTML = `
      <span class="absolute top-3 left-3 bg-[#1e3a8a] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm z-10 tracking-wider">
        NEW
      </span>
    `;
  }

  return `
    <div class="bg-white border border-slate-100 rounded-2xl p-2.5 md:p-3.5 relative shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between h-full group" id="product-card-${prod.id}">
      <!-- Badge element -->
      ${badgeHTML}

      <!-- Favorite save button -->
      <button class="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 p-1.5 rounded-full border shadow-sm transition-all cursor-pointer wishlist-toggle-btn" data-id="${prod.id}" title="${isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}">
        <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-brand-orange text-brand-orange' : ''}"></i>
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
        <span class="text-[9px] md:text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">${prod.category}</span>
        <a href="product.html?id=${prod.id}" class="font-sans font-bold text-xs md:text-sm text-slate-800 line-clamp-1 group-hover:text-brand-orange transition-colors mt-0.5 block">${prod.name}</a>
        
        <!-- Ratings bar -->
        <div class="flex items-center gap-1.5 mt-1">
          <div class="flex items-center text-amber-400">
            <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i>
            <span class="text-[11px] font-bold text-slate-700 ml-0.5">${prod.rating}</span>
          </div>
          <span class="text-[10px] text-slate-400">(${prod.reviewsCount} reviews)</span>
        </div>
      </div>

      <!-- Price & Actions row -->
      <div class="mt-3.5 pt-2.5 border-t border-slate-50 flex items-center justify-between">
        <div class="flex flex-col">
          ${isFlash ? `
            <span class="text-[10px] text-slate-400 line-through font-mono font-medium leading-none">$${prod.originalPrice}</span>
          ` : ''}
          <span class="font-mono font-extrabold text-[#0f1e36] text-xs md:text-sm leading-tight">$${prod.price}</span>
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

window.renderGrid = renderGrid;
window.getProductCardHtml = getProductCardHtml;
window.setupCardEvents = setupCardEvents;


