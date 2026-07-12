const COLORS = [
  { name: 'Tan Gold', code: '#d97706' },
  { name: 'Obsidian Black', code: '#1e293b' },
  { name: 'Chestnut Rock', code: '#78350f' }
];

let activeImg = 0;
let selectedColor = COLORS[0].name;
let quantity = 1;
let product = null;

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  const params = new URLSearchParams(window.location.search);
  const prodId = params.get('id');

  if (!prodId) {
    window.location.href = 'index.html';
    return;
  }

  product = getMockProductById(prodId);
  if (!product) {
    window.location.href = 'index.html';
    return;
  }

  // Initial State Setup
  activeImg = 0;
  selectedColor = COLORS[0].name;
  quantity = 1;

  renderProductDetails();
  
  if (window.lucide) window.lucide.createIcons();
});

function renderProductDetails() {
  if (!product) return;

  const titleEl = document.getElementById('prod-details-title');
  const catEl = document.getElementById('prod-details-cat');
  const nameEl = document.getElementById('prod-details-name');
  const descEl = document.getElementById('prod-details-desc');
  const ratingEl = document.getElementById('prod-details-rating');
  const countEl = document.getElementById('prod-details-count');
  
  // Set window/meta document title
  document.title = `${product.name} | GR STORE`;

  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.category;
  if (nameEl) nameEl.textContent = product.name;
  if (descEl) descEl.textContent = product.description;
  if (ratingEl) ratingEl.textContent = product.rating;
  if (countEl) countEl.textContent = `(${product.reviewsCount} verified reviews)`;

  // Render Image Gallery
  renderImageGallery();

  // Price & Discount Display
  const originalPriceEl = document.getElementById('prod-original-price');
  const priceEl = document.getElementById('prod-price');
  const discountBadge = document.getElementById('prod-discount-badge');

  if (product.isFlashSale && product.originalPrice) {
    originalPriceEl.textContent = `$${product.originalPrice}`;
    originalPriceEl.classList.remove('hidden');
    priceEl.textContent = `$${product.price}`;
    
    const disc = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    discountBadge.innerHTML = `<i data-lucide="percent" class="w-2.5 h-2.5 stroke-[3.5px]"></i> ${disc}% OFF`;
    discountBadge.classList.remove('hidden');
  } else {
    originalPriceEl.classList.add('hidden');
    priceEl.textContent = `$${product.price}`;
    discountBadge.classList.add('hidden');
  }

  // Stock / Sold count progress bar
  const progressBar = document.getElementById('prod-stock-progressbar');
  const progressPercent = document.getElementById('prod-stock-percent');
  const progressText = document.getElementById('prod-stock-text');

  if (product.isFlashSale && product.stock !== undefined && product.soldCount !== undefined) {
    const total = product.stock + product.soldCount;
    const percentage = Math.round((product.soldCount / total) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}% SOLD`;
    progressText.innerHTML = `Stocks Left: <span class="text-brand-orange font-bold font-mono">${product.stock} items</span>`;
    document.getElementById('flash-sale-stock-alert').classList.remove('hidden');
  } else {
    document.getElementById('flash-sale-stock-alert').classList.add('hidden');
  }

  // Specifications/Details lists
  const bulletDetails = document.getElementById('prod-details-bullets');
  if (bulletDetails && product.details) {
    bulletDetails.innerHTML = product.details.map(det => `
      <li class="flex items-start gap-2 text-slate-600 text-xs md:text-sm font-light">
        <span class="text-brand-orange text-lg leading-none select-none mt-0.5">•</span>
        <span>${det}</span>
      </li>
    `).join('');
  }

  // Colors select circles
  renderColorSelector();

  // Wishlist heart sync
  syncWishlistHeart();

  // Quantity controllers
  setupQuantityCounter();

  // Reviews list render
  renderReviewsList();

  // Bind Actions (Add to Cart, WhatsApp, Wishlist)
  setupProductActions();
}

// 1. Dynamic Gallery renderer
function renderImageGallery() {
  const activeImgEl = document.getElementById('prod-active-image');
  const thumbnailsContainer = document.getElementById('prod-thumbnails-row');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');

  if (!activeImgEl) return;

  activeImgEl.src = product.images[activeImg];

  // Render Thumbnails
  if (thumbnailsContainer) {
    if (product.images.length > 1) {
      thumbnailsContainer.innerHTML = product.images.map((img, idx) => `
        <button class="relative w-16 h-16 rounded-lg overflow-hidden border-2 bg-white transition-all cursor-pointer shrink-0 ${
          activeImg === idx ? 'border-brand-orange scale-102 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
        }" data-idx="${idx}">
          <img src="${img}" alt="Thumbnail" class="w-full h-full object-cover">
        </button>
      `).join('');

      thumbnailsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          activeImg = parseInt(btn.getAttribute('data-idx'));
          renderImageGallery();
        });
      });
      thumbnailsContainer.classList.remove('hidden');
    } else {
      thumbnailsContainer.classList.add('hidden');
    }
  }

  // Show/Hide Arrows
  if (product.images.length > 1) {
    prevBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
  } else {
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
  }
}

// Gallery arrows triggers
document.getElementById('gallery-prev-btn').addEventListener('click', () => {
  activeImg = (activeImg === 0) ? product.images.length - 1 : activeImg - 1;
  renderImageGallery();
});
document.getElementById('gallery-next-btn').addEventListener('click', () => {
  activeImg = (activeImg + 1) % product.images.length;
  renderImageGallery();
});

// 2. Color picker widget
function renderColorSelector() {
  const container = document.getElementById('prod-colors-row');
  const label = document.getElementById('selected-color-label');
  if (!container || !label) return;

  label.textContent = selectedColor;

  container.innerHTML = COLORS.map(col => {
    const isSelected = selectedColor === col.name;
    return `
      <button class="w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
        isSelected ? 'border-brand-orange scale-105 shadow-md' : 'border-slate-200 hover:border-slate-400'
      }" style="background-color: ${col.code}" data-name="${col.name}" title="${col.name}">
        ${isSelected ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : ''}
      </button>
    `;
  }).join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.getAttribute('data-name');
      renderColorSelector();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// 3. Heart Wishlist state synchronizer
function syncWishlistHeart() {
  const heartIcon = document.getElementById('wishlist-heart-icon');
  const isSaved = isProductInWishlist(product.id);

  if (heartIcon) {
    if (isSaved) {
      heartIcon.className = 'w-5 h-5 fill-brand-orange text-brand-orange';
    } else {
      heartIcon.className = 'w-5 h-5 text-slate-500';
    }
  }
}

// 4. Counter Controls
function setupQuantityCounter() {
  const minus = document.getElementById('qty-minus-btn');
  const plus = document.getElementById('qty-plus-btn');
  const input = document.getElementById('qty-input-val');
  const priceDisplay = document.getElementById('total-cost-preview');

  if (!minus || !plus || !input || !priceDisplay) return;

  input.textContent = quantity;
  priceDisplay.textContent = `$${product.price * quantity}`;

  // Reset Listeners by cloning (simplifies multiple redraw bindings)
  const newMinus = minus.cloneNode(true);
  const newPlus = plus.cloneNode(true);
  minus.parentNode.replaceChild(newMinus, minus);
  plus.parentNode.replaceChild(newPlus, plus);

  newMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      input.textContent = quantity;
      priceDisplay.textContent = `$${product.price * quantity}`;
    }
  });

  newPlus.addEventListener('click', () => {
    quantity++;
    input.textContent = quantity;
    priceDisplay.textContent = `$${product.price * quantity}`;
  });
}

// 5. Review Section List
function renderReviewsList() {
  const reviewsCountEl = document.getElementById('reviews-title-count');
  const reviewsContainer = document.getElementById('prod-reviews-list');

  if (reviewsCountEl) {
    reviewsCountEl.textContent = `Customer Reviews (${product.reviews ? product.reviews.length : 0})`;
  }

  if (!reviewsContainer) return;

  if (!product.reviews || product.reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <p class="text-slate-400 text-xs italic py-4">No reviews yet. Be the first to purchase and review this item!</p>
    `;
    return;
  }

  reviewsContainer.innerHTML = product.reviews.map(rev => `
    <div class="bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
      <div class="flex items-center justify-between gap-1 mb-2">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
            ${rev.userName.charAt(0)}
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-800">${rev.userName}</h5>
            <!-- Star stars -->
            <div class="flex items-center text-amber-400 -mt-0.5">
              ${Array.from({ length: 5 }).map((_, i) => `
                <i data-lucide="star" class="w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}"></i>
              `).join('')}
            </div>
          </div>
        </div>
        <span class="text-[10px] text-slate-400 font-mono font-medium">${rev.date}</span>
      </div>
      <p class="text-xs text-slate-600 leading-relaxed font-light">${rev.comment}</p>
    </div>
  `).join('');
}

// 6. Bind click events (Add to Cart, WhatsApp, Wishlist)
function setupProductActions() {
  const cartBtn = document.getElementById('prod-add-to-cart-action');
  const waBtn = document.getElementById('prod-whatsapp-action');
  const wishlistBtn = document.getElementById('prod-wishlist-action');

  if (cartBtn) {
    // Clone to clean event listeners
    const newCartBtn = cartBtn.cloneNode(true);
    cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);

    if (product.stock === 0) {
      newCartBtn.classList.add('opacity-40', 'pointer-events-none');
      newCartBtn.innerHTML = `SOLD OUT`;
    } else {
      newCartBtn.classList.remove('opacity-40', 'pointer-events-none');
      newCartBtn.innerHTML = `Add to Cart - <span id="total-cost-preview" class="font-mono">$${product.price * quantity}</span>`;
    }

    newCartBtn.addEventListener('click', () => {
      addToMockCart(product, quantity, selectedColor);
      showNotification(`Added ${quantity}x "${product.name}" in ${selectedColor} to your cart!`, 'success');
      toggleCartDrawer(true);
    });
  }

  if (waBtn) {
    const newWaBtn = waBtn.cloneNode(true);
    waBtn.parentNode.replaceChild(newWaBtn, waBtn);

    newWaBtn.addEventListener('click', () => {
      const phoneNumber = '+2348123456789';
      const message = `*GR STORE INQUIRY*\n` +
                      `Hello Gold & Rock Leather Craft, I'm interested in buying your premium leather item:\n\n` +
                      `*Item:* ${product.name}\n` +
                      `*Color:* ${selectedColor}\n` +
                      `*Quantity:* ${quantity}\n` +
                      `*Price:* $${product.price} each\n` +
                      `*Total:* $${product.price * quantity}\n\n` +
                      `Is this item available? How long would shipping take? Thanks!`;
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  if (wishlistBtn) {
    const newWishlistBtn = wishlistBtn.cloneNode(true);
    wishlistBtn.parentNode.replaceChild(newWishlistBtn, wishlistBtn);

    newWishlistBtn.addEventListener('click', () => {
      const added = toggleMockWishlist(product);
      syncWishlistHeart();
      showNotification(
        added ? `Added "${product.name}" to Saved Items!` : `Removed "${product.name}" from Saved Items.`,
        added ? 'success' : 'info'
      );
    });
  }
}
