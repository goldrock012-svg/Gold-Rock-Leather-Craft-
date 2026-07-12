let editMode = false;
let authTab = 'signin'; // 'signin' or 'register'

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  renderAccountView();

  window.addEventListener('authUpdated', () => {
    renderAccountView();
  });
  window.addEventListener('ordersUpdated', () => {
    renderAccountView();
  });

  if (window.lucide) window.lucide.createIcons();
});

function renderAccountView() {
  const container = document.getElementById('account-page-inner');
  if (!container) return;

  const user = getMockCurrentUser();

  if (!user) {
    renderAuthForms(container);
  } else {
    renderProfileAndOrders(container, user);
  }

  if (window.lucide) window.lucide.createIcons();
}

// 1. Unauthenticated Login/Register View
function renderAuthForms(container) {
  container.innerHTML = `
    <div class="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden mt-6">
      <!-- Tabs header -->
      <div class="flex border-b">
        <button id="tab-btn-signin" class="flex-1 py-4 text-center font-sans font-bold text-xs md:text-sm tracking-wider uppercase cursor-pointer transition-colors ${
          authTab === 'signin' ? 'text-brand-orange bg-white border-b-2 border-brand-orange' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
        }">
          Sign In
        </button>
        <button id="tab-btn-register" class="flex-1 py-4 text-center font-sans font-bold text-xs md:text-sm tracking-wider uppercase cursor-pointer transition-colors ${
          authTab === 'register' ? 'text-brand-orange bg-white border-b-2 border-brand-orange' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
        }">
          Register Account
        </button>
      </div>

      <div class="p-6 md:p-8">
        ${authTab === 'signin' ? getSignInFormHtml() : getRegisterFormHtml()}
      </div>
    </div>
  `;

  // Bind tab toggling
  document.getElementById('tab-btn-signin').addEventListener('click', () => {
    authTab = 'signin';
    renderAccountView();
  });
  document.getElementById('tab-btn-register').addEventListener('click', () => {
    authTab = 'register';
    renderAccountView();
  });

  // Bind form submissions
  const signinForm = document.getElementById('auth-signin-form');
  const registerForm = document.getElementById('auth-register-form');

  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value;

      if (!email) {
        showNotification('Please provide a valid email.', 'info');
        return;
      }
      
      loginMockUser(email, password);
      showNotification('Signed in successfully! Welcome to GR STORE.', 'success');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phoneNumber = document.getElementById('reg-phone').value.trim();
      const address = document.getElementById('reg-addr').value.trim();
      const city = document.getElementById('reg-city').value.trim();
      const state = document.getElementById('reg-state').value.trim();

      if (!fullName || !email || !phoneNumber || !address || !city || !state) {
        showNotification('Please fill in all requested fields to register.', 'info');
        return;
      }

      const profile = { fullName, email, phoneNumber, address, city, state };
      registerMockUser(profile);
      showNotification('Account created successfully! Welcome to the family.', 'success');
    });
  }
}

function getSignInFormHtml() {
  return `
    <form id="auth-signin-form" class="flex flex-col gap-4">
      <div class="text-center mb-2">
        <h4 class="font-bold text-slate-800 text-base">Welcome Back</h4>
        <p class="text-xs text-slate-400 font-light mt-0.5">Access your orders and custom delivery details.</p>
      </div>

      <div class="flex flex-col gap-1">
        <label for="signin-email" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
        <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-brand-orange">
          <span class="pl-3 text-slate-400"><i data-lucide="user" class="w-4 h-4"></i></span>
          <input type="email" id="signin-email" placeholder="example@gmail.com" required class="w-full px-3 py-2.5 bg-transparent text-xs text-slate-800 focus:outline-none">
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label for="signin-password" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Password (Optional)</label>
        <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-brand-orange">
          <span class="pl-3 text-slate-400"><i data-lucide="lock" class="w-4 h-4"></i></span>
          <input type="password" id="signin-password" placeholder="••••••••" class="w-full px-3 py-2.5 bg-transparent text-xs text-slate-800 focus:outline-none">
        </div>
      </div>

      <button type="submit" class="w-full bg-[#0f1e36] hover:bg-brand-blue-light text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors shadow-md mt-2 cursor-pointer">
        Sign In Safely
      </button>
    </form>
  `;
}

function getRegisterFormHtml() {
  return `
    <form id="auth-register-form" class="flex flex-col gap-3.5">
      <div class="text-center mb-1">
        <h4 class="font-bold text-slate-800 text-base">Create Account</h4>
        <p class="text-xs text-slate-400 font-light mt-0.5">Secure bespoke order dispatch tracks.</p>
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-name" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
        <input type="text" id="reg-name" placeholder="John Doe" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-email" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
        <input type="email" id="reg-email" placeholder="example@gmail.com" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-phone" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
        <input type="tel" id="reg-phone" placeholder="08126730784" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-addr" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Street Address</label>
        <input type="text" id="reg-addr" placeholder="15 Victoria Crescent" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label for="reg-city" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
          <input type="text" id="reg-city" placeholder="Victoria Island" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
        </div>
        <div class="flex flex-col gap-1">
          <label for="reg-state" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</label>
          <input type="text" id="reg-state" placeholder="Lagos State" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
        </div>
      </div>

      <button type="submit" class="w-full bg-brand-orange hover:bg-brand-orange-dark text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors shadow-md mt-2 cursor-pointer">
        Create Secure Profile
      </button>
    </form>
  `;
}


// 2. Authenticated Profile Details and Order History Column layout
function renderProfileAndOrders(container, user) {
  const orders = getMockOrders();

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
      
      <!-- Left side Profile Panel (5 cols) -->
      <div class="md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-[#0f1e36] text-white p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold text-lg uppercase shadow-sm">
            ${user.fullName.charAt(0)}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-base truncate font-display text-white">${user.fullName}</h3>
            <p class="text-xs text-slate-400 truncate">${user.email}</p>
          </div>
        </div>

        <div class="p-5 flex flex-col gap-4">
          ${!editMode ? getProfileViewHtml(user) : getProfileEditFormHtml(user)}
        </div>
      </div>

      <!-- Right side Order History Panel (7 cols) -->
      <div class="md:col-span-7 flex flex-col gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
          <h3 class="font-sans font-extrabold text-slate-900 text-sm md:text-base uppercase tracking-wider flex items-center gap-2 border-b pb-3.5 mb-5">
            <i data-lucide="package" class="w-4.5 h-4.5 text-brand-orange"></i>
            Your Order History
          </h3>

          <div class="flex flex-col gap-4" id="orders-list-rows">
            ${getOrdersListHtml(orders)}
          </div>
        </div>
      </div>

    </div>
  `;

  // Bind Actions in Authenticated screen
  setupAuthenticatedListeners(user, orders);
}

function getProfileViewHtml(user) {
  return `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-0.5 text-xs">
        <span class="text-slate-400 font-medium">Phone Number</span>
        <span class="text-slate-800 font-bold">${user.phoneNumber}</span>
      </div>
      
      <div class="flex flex-col gap-0.5 text-xs">
        <span class="text-slate-400 font-medium">Default Delivery Address</span>
        <span class="text-slate-800 font-semibold">${user.address}</span>
        <span class="text-slate-700 font-semibold">${user.city}, ${user.state}</span>
      </div>

      <div class="h-[1px] bg-slate-100 my-1" />

      <div class="flex gap-2">
        <button id="profile-edit-btn" class="flex-1 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          <i data-lucide="edit" class="w-4 h-4"></i> Edit Profile details
        </button>
        <button id="profile-logout-btn" class="border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
        </button>
      </div>
    </div>
  `;
}

function getProfileEditFormHtml(user) {
  return `
    <form id="profile-edit-form" class="flex flex-col gap-3.5">
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
        <input type="text" id="edit-name" value="${user.fullName}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
        <input type="tel" id="edit-phone" value="${user.phoneNumber}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
        <input type="text" id="edit-addr" value="${user.address}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
          <input type="text" id="edit-city" value="${user.city}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</label>
          <input type="text" id="edit-state" value="${user.state}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-orange">
        </div>
      </div>

      <div class="flex gap-2.5 mt-2">
        <button type="submit" class="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
          <i data-lucide="check" class="w-4 h-4 text-white"></i> Save Changes
        </button>
        <button type="button" id="edit-cancel-btn" class="border border-slate-200 hover:bg-slate-50 text-slate-500 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  `;
}

function getOrdersListHtml(orders) {
  if (orders.length === 0) {
    return `
      <div class="text-center py-12 flex flex-col items-center justify-center">
        <i data-lucide="package" class="w-10 h-10 text-slate-200 stroke-[1.2px] mb-2.5"></i>
        <p class="text-slate-400 text-xs italic">No orders logged under this profile yet.</p>
      </div>
    `;
  }

  return orders.map(order => {
    let statusClass = '';
    if (order.status === 'pending') {
      statusClass = 'bg-amber-100 text-amber-700 border border-amber-200';
    } else if (order.status === 'completed') {
      statusClass = 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    } else {
      statusClass = 'bg-slate-100 text-slate-600 border border-slate-200';
    }

    const itemsSummary = order.items.map(it => `
      <div class="flex items-center gap-2 justify-between text-xs mt-1 last:border-b-0 pb-1 border-b border-dashed border-slate-100">
        <span class="text-slate-600 line-clamp-1">${it.product.name} ${it.selectedColor ? `(${it.selectedColor})` : ''} x ${it.quantity}</span>
        <span class="font-mono text-slate-800 font-bold shrink-0">₦${(it.product.price * it.quantity).toLocaleString()}</span>
      </div>
    `).join('');

    return `
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-900 font-mono">${order.id}</span>
            <span class="text-[10px] text-slate-400 mt-0.5">Placed: ${order.date}</span>
          </div>
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${statusClass}">
            ${order.status}
          </span>
        </div>

        <div class="border-t border-slate-200/80 pt-2 flex flex-col gap-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ordered Items:</span>
          ${itemsSummary}
        </div>

        <div class="border-t border-slate-200/80 pt-2.5 mt-0.5 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-1">
            <span class="text-xs text-slate-500 font-light">Total Paid:</span>
            <span class="font-mono text-sm font-extrabold text-[#0f1e36]">₦${order.total.toLocaleString()}</span>
          </div>

          <!-- WhatsApp instant click confirmation bypass -->
          <button class="bg-[#25D366] hover:bg-[#1ebd54] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-[#20ba59] shadow-xs order-wa-btn" data-id="${order.id}">
            <i data-lucide="message-circle" class="w-3.5 h-3.5 fill-white text-white"></i> Confirm on WhatsApp
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setupAuthenticatedListeners(user, orders) {
  // Logout
  const logBtn = document.getElementById('profile-logout-btn');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      logoutMockUser();
      showNotification('Logged out successfully.', 'info');
    });
  }

  // Edit Mode toggle
  const editBtn = document.getElementById('profile-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      editMode = true;
      renderAccountView();
    });
  }

  const cancelBtn = document.getElementById('edit-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      editMode = false;
      renderAccountView();
    });
  }

  // Save Edit Details form
  const editForm = document.getElementById('profile-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('edit-name').value.trim();
      const phoneNumber = document.getElementById('edit-phone').value.trim();
      const address = document.getElementById('edit-addr').value.trim();
      const city = document.getElementById('edit-city').value.trim();
      const state = document.getElementById('edit-state').value.trim();

      if (!fullName || !phoneNumber || !address || !city || !state) {
        showNotification('Please fill in all details.', 'info');
        return;
      }

      const updated = {
        fullName,
        email: user.email,
        phoneNumber,
        address,
        city,
        state
      };

      updateMockUserProfile(updated);
      editMode = false;
      showNotification('Profile updated successfully!', 'success');
    });
  }

  // Bind Order WhatsApp receipt links
  document.querySelectorAll('.order-wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ordId = btn.getAttribute('data-id');
      const order = orders.find(o => o.id === ordId);
      if (order) {
        const link = generateWhatsAppOrderLink(order);
        window.open(link, '_blank');
      }
    });
  });
}
