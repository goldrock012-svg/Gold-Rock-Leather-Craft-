document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  renderCartPage();

  window.addEventListener('cartUpdated', () => {
    renderCartPage();
  });

  if (window.lucide) window.lucide.createIcons();
});

function renderCartPage() {
  const container = document.getElementById('cart-page-items');
  const subtotalEl = document.getElementById('cart-page-subtotal');
  const totalEl = document.getElementById('cart-page-total');
  const checkoutBtn = document.getElementById('cart-page-checkout-btn');
  const emptyState = document.getElementById('cart-page-empty-state');
  const filledState = document.getElementById('cart-page-filled-state');

  if (!container || !subtotalEl || !totalEl || !checkoutBtn) return;

  const items = getMockCart();

  if (items.length === 0) {
    if (emptyState && filledState) {
      emptyState.classList.remove('hidden');
      filledState.classList.add('hidden');
    }
    return;
  }

  if (emptyState && filledState) {
    emptyState.classList.add('hidden');
    filledState.classList.remove('hidden');
  }

  let subtotal = 0;
  let itemsHTML = '';

  items.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;
    const options = item.selectedColor ? `<p class="text-xs text-slate-400 mt-1 capitalize">Color: ${item.selectedColor}</p>` : '';

    itemsHTML += `
      <!-- Single Item Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 border-b border-slate-100 last:border-b-0" id="cart-page-item-${item.id}">
        
        <!-- Thumbnail & Title description -->
        <div class="flex gap-4 items-start sm:items-center flex-1">
          <a href="product.html?id=${item.product.id}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border bg-slate-50 shrink-0">
            <img src="${item.product.images[0]}" alt="${item.product.name}" class="w-full h-full object-cover">
          </a>
          <div class="min-w-0">
            <span class="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-bold">${item.product.category}</span>
            <a href="product.html?id=${item.product.id}" class="block font-sans font-extrabold text-sm text-slate-800 hover:text-brand-orange transition-colors mt-0.5 line-clamp-1">${item.product.name}</a>
            ${options}
          </div>
        </div>

        <!-- Right action controllers row -->
        <div class="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 pt-3 sm:pt-0">
          
          <!-- Price/Quantity column -->
          <div class="flex items-center gap-4">
            <span class="text-xs text-slate-400 font-mono sm:hidden">Qty:</span>
            <!-- Quantity controls -->
            <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shadow-xs">
              <button class="px-2.5 py-1 hover:bg-slate-200 text-slate-500 font-bold text-sm cursor-pointer transition-colors page-minus-btn" data-id="${item.id}">-</button>
              <span class="px-3.5 text-xs font-mono font-extrabold text-slate-800">${item.quantity}</span>
              <button class="px-2.5 py-1 hover:bg-slate-200 text-slate-500 font-bold text-sm cursor-pointer transition-colors page-plus-btn" data-id="${item.id}">+</button>
            </div>
          </div>

          <!-- Total sub-price -->
          <div class="flex flex-col items-end min-w-[70px]">
            <span class="text-[10px] text-slate-400 font-mono leading-none sm:hidden">Subtotal:</span>
            <span class="font-mono font-bold text-slate-800 text-sm mt-0.5">₦${itemTotal.toLocaleString()}</span>
          </div>

          <!-- Delete Bin icon -->
          <button class="text-slate-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer page-delete-btn" data-id="${item.id}" title="Remove item">
            <i data-lucide="trash-2" class="w-4.5 h-4.5"></i>
          </button>
        </div>

      </div>
    `;
  });

  container.innerHTML = itemsHTML;
  subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
  totalEl.textContent = `₦${(subtotal + 1500).toLocaleString()}`;

  // Update dynamic page headers & estimated delivery dates
  const titleCountEl = document.getElementById('cart-title-count');
  if (titleCountEl) {
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    titleCountEl.textContent = totalItemsCount;
  }

  const deliveryDateEl = document.getElementById('cart-page-delivery-date');
  if (deliveryDateEl) {
    const today = new Date();
    const deliveryMin = new Date(today);
    deliveryMin.setDate(today.getDate() + 3);
    const deliveryMax = new Date(today);
    deliveryMax.setDate(today.getDate() + 5);
    
    const minStr = deliveryMin.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const maxStr = deliveryMax.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    deliveryDateEl.textContent = `${minStr} - ${maxStr}`;
  }

  if (window.lucide) window.lucide.createIcons();

  // Bind Listeners
  container.querySelectorAll('.page-minus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const curItem = items.find(i => i.id === id);
      if (curItem) {
        updateMockCartQuantity(id, curItem.quantity - 1);
      }
    });
  });

  container.querySelectorAll('.page-plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const curItem = items.find(i => i.id === id);
      if (curItem) {
        updateMockCartQuantity(id, curItem.quantity + 1);
      }
    });
  });

  container.querySelectorAll('.page-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromMockCart(id);
      showNotification('Item removed from cart', 'info');
    });
  });
}
