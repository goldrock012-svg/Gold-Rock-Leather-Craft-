let cartItems = [];
let placedOrder = null;
let paymentMethod = 'cash_on_delivery'; // or 'bank_transfer'

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  cartItems = getMockCart();
  if (cartItems.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderCheckoutForm();

  if (window.lucide) window.lucide.createIcons();
});

function renderCheckoutForm() {
  const container = document.getElementById('checkout-page-container');
  if (!container) return;

  const currentUser = getMockCurrentUser();

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;

  // Set up initial form data
  const initialData = {
    fullName: currentUser ? currentUser.fullName : '',
    phoneNumber: currentUser ? currentUser.phoneNumber : '',
    email: currentUser ? currentUser.email : '',
    address: currentUser ? currentUser.address : '',
    city: currentUser ? currentUser.city : '',
    state: currentUser ? currentUser.state : '',
  };

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
      
      <!-- Left side Form (7 cols) -->
      <form id="checkout-secure-form" class="lg:col-span-7 flex flex-col gap-6">
        
        <!-- 1. Shipping Section -->
        <div class="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <i data-lucide="truck" class="w-4.5 h-4.5 text-brand-blue"></i>
            1. Shipping Information
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
              <input type="text" id="chk-name" value="${initialData.fullName}" required placeholder="John Doe" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number *</label>
              <input type="tel" id="chk-phone" value="${initialData.phoneNumber}" required placeholder="+234 812 345 6789" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none">
            </div>
          </div>

          <div class="flex flex-col gap-1.5 mt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address *</label>
            <input type="email" id="chk-email" value="${initialData.email}" required placeholder="example@gmail.com" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none">
          </div>

          <div class="flex flex-col gap-1.5 mt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Street Delivery Address *</label>
            <input type="text" id="chk-addr" value="${initialData.address}" required placeholder="15 Victoria Crescent" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City *</label>
              <input type="text" id="chk-city" value="${initialData.city}" required placeholder="Victoria Island" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State *</label>
              <input type="text" id="chk-state" value="${initialData.state}" required placeholder="Lagos State" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none">
            </div>
          </div>

          <div class="flex flex-col gap-1.5 mt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Instructions & Bespoke Notes (Optional)</label>
            <textarea id="chk-notes" placeholder="Please add custom monogram initials (e.g., 'G.R.'), request custom stitch colors, or specify delivery requests..." rows="3" class="border border-slate-200 bg-slate-50/50 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-orange focus:outline-none resize-none"></textarea>
          </div>
        </div>

        <!-- 2. Payment Section -->
        <div class="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <i data-lucide="credit-card" class="w-4.5 h-4.5 text-brand-blue"></i>
            2. Payment Method
          </h3>

          <div class="flex flex-col gap-3">
            <!-- COD selection card -->
            <label class="flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'cash_on_delivery' ? 'border-brand-orange bg-brand-orange/5' : 'border-slate-100 bg-slate-50/30'
            }" id="payment-card-cod">
              <input type="radio" name="payment_method" value="cash_on_delivery" ${paymentMethod === 'cash_on_delivery' ? 'checked' : ''} class="mt-1 accent-brand-orange">
              <div class="flex flex-col -mt-0.5">
                <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  Cash on Delivery (Lagos State Only)
                </span>
                <span class="text-[11px] text-slate-400 font-light mt-1">
                  Pay securely with cash, card, or instant bank transfer when our priority courier dispatch rider drops off your items.
                </span>
              </div>
            </label>

            <!-- Bank transfer option -->
            <label class="flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'bank_transfer' ? 'border-brand-orange bg-brand-orange/5' : 'border-slate-100 bg-slate-50/30'
            }" id="payment-card-bank">
              <input type="radio" name="payment_method" value="bank_transfer" ${paymentMethod === 'bank_transfer' ? 'checked' : ''} class="mt-1 accent-brand-orange">
              <div class="flex flex-col -mt-0.5">
                <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  Direct Secure Bank Transfer (Lagos & Nationwide)
                </span>
                <span class="text-[11px] text-slate-400 font-light mt-1">
                  Secure instant verification. Account instructions are shared upon clicking dispatch order. High priority nationwide courier.
                </span>
              </div>
            </label>
          </div>
        </div>

        <!-- Secure checkout button -->
        <button type="submit" id="checkout-submit-btn" class="w-full bg-[#0f1e36] hover:bg-[#152a4d] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg text-xs tracking-wider uppercase">
          <i data-lucide="shield-check" class="w-4 h-4 text-white"></i> Confirm & Place Order
        </button>

      </form>

      <!-- Right Column: Cart items summary (5 cols) -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
          <h3 class="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b pb-3">
            <i data-lucide="shopping-bag" class="w-4 h-4 text-brand-orange"></i>
            Items in Order (${cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </h3>

          <!-- Items rows lists -->
          <div class="flex flex-col gap-3.5 border-b pb-4">
            ${cartItems.map(item => `
              <div class="flex gap-3 items-center">
                <div class="w-12 h-12 rounded-lg border bg-slate-50 overflow-hidden shrink-0">
                  <img src="${item.product.images[0]}" alt="" class="w-full h-full object-cover">
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${item.product.name}</h4>
                  <p class="text-[10px] text-slate-400 mt-0.5 capitalize">Qty: ${item.quantity} ${item.selectedColor ? `| ${item.selectedColor}` : ''}</p>
                </div>
                <span class="font-mono text-xs font-bold text-slate-700 shrink-0">$${item.product.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>

          <!-- Total sums -->
          <div class="flex flex-col gap-3 border-b pb-4 text-xs text-slate-500 font-light">
            <div class="flex justify-between items-center">
              <span>Subtotal</span>
              <span class="font-mono font-medium text-slate-800">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Standard priority delivery</span>
              <span class="font-mono font-medium text-slate-800">$10.00</span>
            </div>
          </div>

          <div class="flex justify-between items-center py-0.5">
            <span class="font-sans font-bold text-slate-900 text-sm">Grand Total</span>
            <span class="font-mono font-extrabold text-brand-orange text-base md:text-lg">$${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Bind Payment card radio styling triggers
  const codRadio = container.querySelector('input[value="cash_on_delivery"]');
  const bankRadio = container.querySelector('input[value="bank_transfer"]');
  const codCard = document.getElementById('payment-card-cod');
  const bankCard = document.getElementById('payment-card-bank');

  codRadio.addEventListener('change', () => {
    paymentMethod = 'cash_on_delivery';
    codCard.className = 'flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all border-brand-orange bg-brand-orange/5';
    bankCard.className = 'flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-100 bg-slate-50/30';
  });

  bankRadio.addEventListener('change', () => {
    paymentMethod = 'bank_transfer';
    bankCard.className = 'flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all border-brand-orange bg-brand-orange/5';
    codCard.className = 'flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-100 bg-slate-50/30';
  });

  // Handle Order Submit
  const checkoutForm = document.getElementById('checkout-secure-form');
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('chk-name').value.trim();
    const phoneNumber = document.getElementById('chk-phone').value.trim();
    const email = document.getElementById('chk-email').value.trim();
    const address = document.getElementById('chk-addr').value.trim();
    const city = document.getElementById('chk-city').value.trim();
    const state = document.getElementById('chk-state').value.trim();
    const additionalNotes = document.getElementById('chk-notes').value.trim();

    const submitBtn = document.getElementById('checkout-submit-btn');
    submitBtn.classList.add('pointer-events-none', 'opacity-60');
    submitBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-4 h-4 text-white animate-spin"></i> Processing payment & reserving stock...`;
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      const details = { fullName, phoneNumber, email, address, city, state, additionalNotes };
      placedOrder = placeMockOrder(details, paymentMethod);

      showNotification('Order placed successfully! Reserving your leather crafts.', 'success');
      renderSuccessState();
    }, 1500);
  });
}

function renderSuccessState() {
  const container = document.getElementById('checkout-page-container');
  if (!container || !placedOrder) return;

  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-4 md:gap-5">
      <div class="p-4 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 shadow-inner flex items-center justify-center">
        <i data-lucide="check-circle" class="w-12 h-12 stroke-[1.5px]"></i>
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="font-sans font-extrabold text-slate-900 text-lg md:text-xl">Bespoke Order Reserved!</h3>
        <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">ORDER ID: ${placedOrder.id}</span>
      </div>

      <p class="text-xs md:text-sm text-slate-500 font-light max-w-sm leading-relaxed">
        Thank you for choosing Gold & Rock Leather Craft! Your custom order has been logged in our databases. To secure rapid priority workshop line dispatch, click below to confirm your order details via WhatsApp.
      </p>

      <!-- Bank Transfer Details Option -->
      ${placedOrder.paymentMethod === 'bank_transfer' ? `
        <div class="w-full bg-[#0f1e36] text-left text-white border border-slate-800 rounded-xl p-4 md:p-5 mt-1 flex flex-col gap-2">
          <h4 class="font-bold text-xs text-brand-orange uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
            <i data-lucide="landmark" class="w-4 h-4 text-brand-orange"></i> Direct Bank Transfer instructions
          </h4>
          <div class="flex flex-col gap-1.5 text-xs font-light text-slate-300">
            <p>Please make your payment of <span class="text-brand-orange font-bold font-mono">$${placedOrder.total}</span> to:</p>
            <div class="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[11px] flex flex-col gap-1">
              <p>🏦 <span class="font-semibold text-white">Bank:</span> Rock Steady Trust Bank Ltd.</p>
              <p>🔢 <span class="font-semibold text-white">Account Number:</span> 1204481230</p>
              <p>👤 <span class="font-semibold text-white">Account Name:</span> Gold & Rock Leather Craft Ltd.</p>
            </div>
            <p class="text-[10px] text-slate-400 mt-1 italic">Note: Please send a screenshot of the transaction receipt via WhatsApp after making payment.</p>
          </div>
        </div>
      ` : ''}

      <!-- Delivery info review summary -->
      <div class="w-full bg-slate-50 border rounded-xl p-4 text-left flex flex-col gap-1 text-xs">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Destination:</span>
        <p class="text-slate-800 font-bold">${placedOrder.shippingDetails.fullName} • ${placedOrder.shippingDetails.phoneNumber}</p>
        <p class="text-slate-600 font-medium">${placedOrder.shippingDetails.address}, ${placedOrder.shippingDetails.city}, ${placedOrder.shippingDetails.state}</p>
      </div>

      <!-- Send to WhatsApp -->
      <button id="chk-whatsapp-confirm-btn" class="w-full bg-[#25D366] hover:bg-[#1ebd54] text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg text-xs tracking-wider uppercase border border-[#1fbf55]">
        <i data-lucide="message-square" class="w-4.5 h-4.5 fill-white text-white"></i> Send WhatsApp Confirmation
      </button>

      <a href="index.html" class="text-slate-500 hover:text-slate-800 text-xs font-bold hover:underline transition-all mt-2 flex items-center gap-1.5">
        Return to Homepage
      </a>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('chk-whatsapp-confirm-btn').addEventListener('click', () => {
    const link = generateWhatsAppOrderLink(placedOrder);
    window.open(link, '_blank');
  });
}
