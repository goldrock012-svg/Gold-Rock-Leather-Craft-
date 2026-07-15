const COLORS = [
  { name: 'Tan Gold', code: '#d97706' },
  { name: 'Obsidian Black', code: '#1e293b' },
  { name: 'Chestnut Rock', code: '#78350f' }
];

let activeImg = 0;
let selectedColor = COLORS[0].name;
let quantity = 1;
let product = null;
let reviewsSortOrder = 'newest';
let selectedReviewStars = 5;

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

  // Track user interaction for recommendations and recently viewed lists
  localStorage.setItem('gr_store_last_viewed_category', product.category);
  try {
    let recentlyViewedIds = JSON.parse(localStorage.getItem('gr_store_recently_viewed_ids') || '[]');
    recentlyViewedIds = recentlyViewedIds.filter(id => id !== product.id);
    recentlyViewedIds.unshift(product.id);
    recentlyViewedIds = recentlyViewedIds.slice(0, 4);
    localStorage.setItem('gr_store_recently_viewed_ids', JSON.stringify(recentlyViewedIds));
  } catch (e) {
    console.error('Error tracking recently viewed', e);
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
    originalPriceEl.textContent = `₦${product.originalPrice.toLocaleString()}`;
    originalPriceEl.classList.remove('hidden');
    priceEl.textContent = `₦${product.price.toLocaleString()}`;
    
    const disc = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    discountBadge.innerHTML = `<i data-lucide="percent" class="w-2.5 h-2.5 stroke-[3.5px]"></i> ${disc}% OFF`;
    discountBadge.classList.remove('hidden');
  } else {
    originalPriceEl.classList.add('hidden');
    priceEl.textContent = `₦${product.price.toLocaleString()}`;
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

  // Bind Actions (Add to Cart, WhatsApp, Wishlist)
  setupProductActions();

  // Quantity controllers
  setupQuantityCounter();

  // Reviews list render
  renderReviewsList();
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

  if (!minus || !plus || !input) return;

  input.textContent = quantity;
  if (priceDisplay) {
    priceDisplay.textContent = `₦${(product.price * quantity).toLocaleString()}`;
  }

  // Reset Listeners by cloning (simplifies multiple redraw bindings)
  const newMinus = minus.cloneNode(true);
  const newPlus = plus.cloneNode(true);
  minus.parentNode.replaceChild(newMinus, minus);
  plus.parentNode.replaceChild(newPlus, plus);

  newMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      input.textContent = quantity;
      const pd = document.getElementById('total-cost-preview');
      if (pd) pd.textContent = `₦${(product.price * quantity).toLocaleString()}`;
    }
  });

  newPlus.addEventListener('click', () => {
    quantity++;
    input.textContent = quantity;
    const pd = document.getElementById('total-cost-preview');
    if (pd) pd.textContent = `₦${(product.price * quantity).toLocaleString()}`;
  });
}

// 5. Review Section List
async function renderReviewsList() {
  const root = document.getElementById('reviews-section-root');
  if (!root) return;

  root.innerHTML = `
    <div class="flex items-center justify-center py-8">
      <svg class="animate-spin h-6 w-6 text-brand-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  `;

  try {
    const reviews = await window.getReviewsForProduct(product.id);
    const totalReviews = reviews.length;
    let averageRating = 0;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = (sum / totalReviews).toFixed(1);
      reviews.forEach(r => {
        const rounded = Math.round(r.rating);
        if (starCounts[rounded] !== undefined) {
          starCounts[rounded]++;
        }
      });
    }

    // Sort Reviews in memory based on current selection
    if (reviewsSortOrder === 'highest') {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (reviewsSortOrder === 'lowest') {
      reviews.sort((a, b) => a.rating - b.rating);
    } else {
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const currentUser = window.getMockCurrentUser ? window.getMockCurrentUser() : null;
    const isAdmin = currentUser && currentUser.email === "goldrock012@gmail.com";
    const orders = window.getMockOrders ? window.getMockOrders() : [];
    const hasPurchased = orders.some(o => 
      o.items && o.items.some(item => (item.product.id === product.id || (item.product.productId && item.product.productId === product.id)))
    );

    root.innerHTML = `
      <!-- Header with count -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 gap-2">
        <div>
          <h3 class="font-sans font-extrabold text-slate-900 text-sm md:text-base uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="message-square" class="w-4.5 h-4.5 text-brand-orange"></i>
            Customer Reviews & Ratings
          </h3>
          <p class="text-[11px] text-slate-400 font-light mt-0.5">Real, verified customer feedback from Gold & Rock Leather Craft orders.</p>
        </div>
        
        <!-- Sorting dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort By:</span>
          <select id="review-sort-select" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-orange cursor-pointer">
            <option value="newest" ${reviewsSortOrder === 'newest' ? 'selected' : ''}>Newest Reviews</option>
            <option value="highest" ${reviewsSortOrder === 'highest' ? 'selected' : ''}>Highest Rating</option>
            <option value="lowest" ${reviewsSortOrder === 'lowest' ? 'selected' : ''}>Lowest Rating</option>
          </select>
        </div>
      </div>

      <!-- Two Column Stats and Review writing section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <!-- Stats column -->
        <div class="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-4">
          <div class="text-center md:text-left">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div class="flex items-baseline justify-center md:justify-start gap-1.5 mt-1">
              <span class="text-3xl md:text-4xl font-extrabold text-slate-800 font-mono">${totalReviews > 0 ? averageRating : '0.0'}</span>
              <span class="text-sm font-medium text-slate-400">/ 5.0</span>
            </div>
            
            <div class="flex items-center justify-center md:justify-start text-amber-400 mt-1 gap-0.5">
              ${Array.from({ length: 5 }).map((_, i) => `
                <i data-lucide="star" class="w-4 h-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}"></i>
              `).join('')}
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block">Based on ${totalReviews} verified reviews</span>
          </div>

          <!-- Star breakdown -->
          <div class="flex flex-col gap-2 border-t border-slate-200/60 pt-4">
            ${[5, 4, 3, 2, 1].map(stars => {
              const count = starCounts[stars];
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return `
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span class="w-3 text-right font-bold font-mono text-[10px]">${stars}</span>
                  <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>
                  <div class="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-brand-orange h-full rounded-full" style="width: ${percent}%"></div>
                  </div>
                  <span class="w-8 text-right text-[10px] text-slate-400 font-mono font-medium">${percent}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Review form or verification message -->
        <div class="md:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-4 shadow-xs">
          ${!currentUser ? `
            <div class="text-center py-6 flex flex-col items-center">
              <div class="w-10 h-10 bg-amber-50 text-brand-orange border border-amber-100 rounded-full flex items-center justify-center mb-3">
                <i data-lucide="lock" class="w-4.5 h-4.5"></i>
              </div>
              <h4 class="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">Sign In to Review</h4>
              <p class="text-[10px] text-slate-400 font-light max-w-xs mt-1 mb-4 leading-relaxed">
                Only verified customers who have purchased this leather item can submit a product review.
              </p>
              <a href="account.html" class="bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold py-2 px-5 rounded-lg transition-colors uppercase tracking-wide">
                Go to Sign In
              </a>
            </div>
          ` : !hasPurchased ? `
            <div class="text-center py-6 flex flex-col items-center">
              <div class="w-10 h-10 bg-blue-50 text-brand-blue border border-blue-100 rounded-full flex items-center justify-center mb-3">
                <i data-lucide="shield-check" class="w-4.5 h-4.5 text-brand-orange"></i>
              </div>
              <h4 class="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">Verified Purchase Policy</h4>
              <p class="text-[10px] text-slate-400 font-light max-w-xs mt-1 leading-relaxed">
                Only customers with a completed purchase of this product on their account record can leave a review. This maintains absolute authenticity for Gold & Rock Leather Craft.
              </p>
            </div>
          ` : `
            <form id="product-review-submission-form" class="flex flex-col gap-3">
              <div class="border-b border-slate-100 pb-2">
                <h4 class="font-sans font-extrabold text-slate-800 text-xs uppercase tracking-wider">Write A Product Review</h4>
                <p class="text-[10px] text-slate-400 font-light mt-0.5">Share your leather craft experience with other buyers.</p>
              </div>
              
              <!-- Interactive Star Selection -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Rating *</label>
                <div class="flex items-center gap-1.5" id="form-interactive-stars-row">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <button type="button" class="star-rating-btn text-2xl focus:outline-none bg-transparent border-0 p-0 cursor-pointer transition-transform hover:scale-110" data-star="${star}">
                      <i data-lucide="star" class="w-6 h-6 ${star <= selectedReviewStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}"></i>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Review Title -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider" for="review-title-input">Review Title *</label>
                <input type="text" id="review-title-input" required placeholder="e.g. Unbelievable Quality, Highly Durable" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange">
              </div>

              <!-- Review Message -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider" for="review-message-input">Review Details *</label>
                <textarea id="review-message-input" required rows="3" placeholder="Describe the stitching, leather thickness, premium feel, packaging etc..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange resize-none"></textarea>
              </div>

              <button type="submit" id="review-submit-btn" class="w-full sm:w-auto self-end bg-[#0f1e36] hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors uppercase tracking-wide cursor-pointer mt-1 border-0">
                Submit Verified Review
              </button>
            </form>
          `}
        </div>
      </div>

      <!-- Reviews List Section -->
      <div class="flex flex-col gap-4 mt-2">
        <h4 class="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">Reviews List</h4>
        
        ${reviews.length === 0 ? `
          <p class="text-slate-400 text-xs italic py-6 text-center bg-white border border-dashed border-slate-200 rounded-2xl">No reviews found matching the criteria.</p>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${reviews.map(rev => {
              return `
                <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs relative flex flex-col gap-2.5">
                  
                  <!-- Review Header -->
                  <div class="flex items-center justify-between gap-2 border-b border-slate-50 pb-2.5">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200/50">
                        ${rev.userName ? rev.userName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <h5 class="text-xs font-extrabold text-slate-800">${rev.userName}</h5>
                          ${rev.verifiedPurchase ? `
                            <span class="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-100">
                              <i data-lucide="check" class="w-2 h-2 stroke-[4px]"></i> Verified Purchase
                            </span>
                          ` : ''}
                        </div>
                        <div class="flex items-center text-amber-400 mt-0.5">
                          ${Array.from({ length: 5 }).map((_, i) => `
                            <i data-lucide="star" class="w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}"></i>
                          `).join('')}
                        </div>
                      </div>
                    </div>
                    
                    <span class="text-[9px] text-slate-400 font-mono font-medium">${rev.date}</span>
                  </div>

                  <!-- Review Content -->
                  <div class="flex flex-col gap-1">
                    <h6 class="text-xs font-bold text-slate-800">${rev.title || 'Leather Review'}</h6>
                    <p class="text-xs text-slate-600 leading-relaxed font-light">${rev.comment}</p>
                  </div>

                  <!-- CEO Reply (if exists) -->
                  ${rev.reply ? `
                    <div class="bg-amber-50/20 border-l-2 border-brand-orange p-3 rounded-r-xl mt-1">
                      <div class="flex items-center gap-1 mb-1">
                        <i data-lucide="shield" class="w-3 h-3 text-brand-orange"></i>
                        <span class="text-[9px] font-extrabold text-brand-orange uppercase tracking-wider">CEO Reply</span>
                      </div>
                      <p class="text-xs text-slate-600 font-light leading-relaxed">${rev.reply}</p>
                    </div>
                  ` : ''}

                  <!-- Administrative Controls -->
                  ${isAdmin ? `
                    <div class="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex flex-col gap-2 mt-2">
                      <div class="flex items-center justify-between text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">
                        <span>Admin Controls</span>
                        <span class="text-slate-400 font-mono">${rev.id}</span>
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <button class="admin-review-hide-btn flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-1 px-2.5 rounded text-[10px] uppercase cursor-pointer" data-id="${rev.id}" data-hidden="${rev.isHidden}">
                          ${rev.isHidden ? 'Unhide' : 'Hide Review'}
                        </button>
                        <button class="admin-review-delete-btn flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold py-1 px-2.5 rounded text-[10px] uppercase cursor-pointer" data-id="${rev.id}">
                          Delete
                        </button>
                      </div>
                      
                      <!-- Inline Reply Form -->
                      <form class="admin-review-reply-form flex items-center gap-2 border-t border-slate-200/50 pt-2 mt-1" data-id="${rev.id}">
                        <input type="text" placeholder="Write CEO reply..." value="${rev.reply || ''}" class="flex-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-brand-orange">
                        <button type="submit" class="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-1 px-3 rounded text-[10px] uppercase cursor-pointer border-0">
                          Reply
                        </button>
                      </form>
                    </div>
                  ` : rev.isHidden ? `
                    <div class="bg-slate-100 border border-slate-200 text-slate-400 p-2 rounded-xl text-[10px] text-center italic mt-1">
                      This review has been flagged and is hidden from public viewing.
                    </div>
                  ` : ''}

                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    // Bind event handlers
    const sortSelect = document.getElementById('review-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        reviewsSortOrder = e.target.value;
        renderReviewsList();
      });
    }

    const starBtns = document.querySelectorAll('.star-rating-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedReviewStars = parseInt(btn.getAttribute('data-star'));
        renderReviewsList();
      });
    });

    const submitForm = document.getElementById('product-review-submission-form');
    if (submitForm) {
      submitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('review-title-input');
        const msgInput = document.getElementById('review-message-input');
        const submitBtn = document.getElementById('review-submit-btn');

        if (!titleInput || !msgInput) return;

        const originalHTML = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }

        try {
          await window.addReviewForProduct(product.id, {
            rating: selectedReviewStars,
            title: titleInput.value.trim(),
            comment: msgInput.value.trim()
          });
          showNotification("Thank you! Your verified customer review has been posted successfully.", "success");
          selectedReviewStars = 5;
          renderReviewsList();
        } catch (err) {
          console.error("Failed to submit review:", err);
          showNotification(err.message || "Failed to submit review.", "danger");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
          }
        }
      });
    }

    const deleteBtns = document.querySelectorAll('.admin-review-delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const revId = btn.getAttribute('data-id');
        if (confirm("Are you sure you want to permanently delete this product review?")) {
          try {
            await window.updateReviewState(revId, { delete: true });
            showNotification("Review deleted successfully.", "success");
            renderReviewsList();
          } catch (err) {
            showNotification("Failed to delete review: " + err.message, "danger");
          }
        }
      });
    });

    const hideBtns = document.querySelectorAll('.admin-review-hide-btn');
    hideBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const revId = btn.getAttribute('data-id');
        const isCurrentlyHidden = btn.getAttribute('data-hidden') === 'true';
        try {
          await window.updateReviewState(revId, { isHidden: !isCurrentlyHidden });
          showNotification(!isCurrentlyHidden ? "Review is now hidden from public." : "Review is now public.", "success");
          renderReviewsList();
        } catch (err) {
          showNotification("Failed to update visibility: " + err.message, "danger");
        }
      });
    });

    const replyForms = document.querySelectorAll('.admin-review-reply-form');
    replyForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const revId = form.getAttribute('data-id');
        const input = form.querySelector('input');
        if (!input) return;
        const replyText = input.value.trim();
        try {
          await window.updateReviewState(revId, { reply: replyText });
          showNotification("Official CEO reply updated successfully.", "success");
          renderReviewsList();
        } catch (err) {
          showNotification("Failed to update response: " + err.message, "danger");
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error("Failed to load reviews list:", err);
    root.innerHTML = `<p class="text-xs text-red-500 italic py-4">Failed to load verified reviews. Please try again later.</p>`;
  }
}

// Listen for authentications to refresh form accessibility
window.addEventListener('authUpdated', () => {
  renderReviewsList();
});
window.addEventListener('ordersUpdated', () => {
  renderReviewsList();
});

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
      newCartBtn.innerHTML = `Add to Cart - <span id="total-cost-preview" class="font-mono">₦${(product.price * quantity).toLocaleString()}</span>`;
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
      const phoneNumber = '2348126730784';
      const message = `*GR STORE INQUIRY*\n` +
                      `Hello Gold & Rock Leather Craft, I'm interested in buying your premium leather item:\n\n` +
                      `*Item:* ${product.name}\n` +
                      `*Color:* ${selectedColor}\n` +
                      `*Quantity:* ${quantity}\n` +
                      `*Price:* ₦${product.price.toLocaleString()} each\n` +
                      `*Total:* ₦${(product.price * quantity).toLocaleString()}\n\n` +
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
