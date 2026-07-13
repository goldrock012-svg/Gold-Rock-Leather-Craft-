// Slider configuration
const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1600',
    accent: 'GOLD & ROCK SIGNATURE',
    title: 'Premium Leather Bags',
    subtitle: 'Handcrafted from 100% genuine vegetable-tanned leather. Sourced and processed locally in Nigeria to provide unmatched durability and timeless elegance.',
    ctaUrl: 'categories.html',
    ctaText: 'Shop Premium Leather',
    secondaryCtaUrl: 'categories.html',
    secondaryCtaText: 'View Catalogue'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1600',
    accent: 'ELEGANT & SOPHISTICATED',
    title: 'Luxury Hand Bags',
    subtitle: 'Stunning handcrafted fashion bags with impeccable stitching, perfect for every social gathering, workplace, and formal event.',
    ctaUrl: 'categories.html?cat=ladies-hand-bags',
    ctaText: 'Shop Luxury Handbags',
    secondaryCtaUrl: 'categories.html',
    secondaryCtaText: 'All Collections'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1600',
    accent: 'EXECUTIVE OFFICE RANGE',
    title: 'Office Bags',
    subtitle: 'Keep your documents and tech devices secure in our highly functional executive laptop bags, portfolios, and messenger leather carriers.',
    ctaUrl: 'categories.html?cat=office-bags',
    ctaText: 'Shop Office Bags',
    secondaryCtaUrl: 'categories.html?cat=laptop-bags',
    secondaryCtaText: 'Laptop Carriers'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1600',
    accent: 'DURABLE SCHOOL GEAR',
    title: 'School Bags',
    subtitle: 'Spacious, robust, and water-resistant leather backpacks built with load-balanced shoulder padding to make school runs comfortable.',
    ctaUrl: 'categories.html?cat=school-bags',
    ctaText: 'Shop School Bags',
    secondaryCtaUrl: 'categories.html',
    secondaryCtaText: 'View All'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600',
    accent: 'TRAVEL & WEEKENDER SPECIAL',
    title: 'Travelling Bags',
    subtitle: 'Make your journeys memorable with high-capacity premium duffel and weekender bags built to handle rugged conditions while developing a gorgeous patina.',
    ctaUrl: 'categories.html?cat=travelling-bags',
    ctaText: 'Shop Travelling Bags',
    secondaryCtaUrl: 'categories.html',
    secondaryCtaText: 'Explore More'
  }
];

let currentSlide = 0;
let slideInterval;

// Flash Sale countdown values
let timeLeft = { hours: 8, minutes: 42, seconds: 15 };

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Header/Footer UI & Badge Updates
  initCommonUI();

  // 2. Parse Search Queries
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search') || '';

  if (searchQuery) {
    renderSearchResults(searchQuery);
  } else {
    // Standard Homepage Layout
    renderHomepage();
    setupHeroSlider();
    setupCountdownTimer();
  }

  // Re-run Lucide icons for page content
  if (window.lucide) window.lucide.createIcons();
});

// Setup Slider Animations and controls
function setupHeroSlider() {
  const container = document.getElementById('hero-slider-bg');
  const accentEl = document.getElementById('hero-slide-accent');
  const titleEl = document.getElementById('hero-slide-title');
  const descEl = document.getElementById('hero-slide-desc');
  const ctaEl = document.getElementById('hero-slide-cta');
  const prevBtn = document.getElementById('hero-slider-prev-btn');
  const nextBtn = document.getElementById('hero-slider-next-btn');
  const indicatorsContainer = document.getElementById('hero-indicators');

  if (!container || !titleEl) return;

  function updateSlide(index) {
    currentSlide = (index + SLIDES.length) % SLIDES.length;
    const slide = SLIDES[currentSlide];

    // Smooth transition
    container.style.opacity = '0.4';
    setTimeout(() => {
      container.style.backgroundImage = `url(${slide.image})`;
      container.style.opacity = '1';
    }, 200);

    accentEl.textContent = slide.accent;
    titleEl.textContent = slide.title;
    descEl.textContent = slide.subtitle;
    ctaEl.textContent = slide.ctaText;
    ctaEl.href = slide.ctaUrl;

    const secondaryCtaEl = document.getElementById('hero-slide-secondary');
    if (secondaryCtaEl) {
      secondaryCtaEl.textContent = slide.secondaryCtaText || 'Browse Categories';
      secondaryCtaEl.href = slide.secondaryCtaUrl || 'categories.html';
    }

    // Update Pagination indicators
    const dots = indicatorsContainer.querySelectorAll('button');
    dots.forEach((dot, dIdx) => {
      if (dIdx === currentSlide) {
        dot.className = 'h-2 w-6 bg-brand-orange rounded-full transition-all duration-300';
      } else {
        dot.className = 'h-2 w-2 bg-white/50 rounded-full transition-all duration-300';
      }
    });
  }

  // Generate Indicators
  indicatorsContainer.innerHTML = SLIDES.map((_, idx) => `
    <button class="h-2 ${idx === 0 ? 'w-6 bg-brand-orange' : 'w-2 bg-white/50'} rounded-full transition-all duration-300 cursor-pointer" aria-label="Go to slide ${idx + 1}"></button>
  `).join('');

  indicatorsContainer.querySelectorAll('button').forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      updateSlide(idx);
      startAutoSlide();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      updateSlide(currentSlide - 1);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      updateSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      updateSlide(currentSlide + 1);
    }, 6000);
  }

  // Initial render
  updateSlide(0);
  startAutoSlide();
}

// Flash Sale Timer Setup
function setupCountdownTimer() {
  const timerHours = document.getElementById('timer-hours');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');

  if (!timerHours) return;

  const timer = setInterval(() => {
    if (timeLeft.seconds > 0) {
      timeLeft.seconds--;
    } else if (timeLeft.minutes > 0) {
      timeLeft.minutes--;
      timeLeft.seconds = 59;
    } else if (timeLeft.hours > 0) {
      timeLeft.hours--;
      timeLeft.minutes = 59;
      timeLeft.seconds = 59;
    } else {
      timeLeft = { hours: 8, minutes: 0, seconds: 0 }; // reset
    }

    timerHours.textContent = String(timeLeft.hours).padStart(2, '0') + 'h';
    timerMinutes.textContent = String(timeLeft.minutes).padStart(2, '0') + 'm';
    timerSeconds.textContent = String(timeLeft.seconds).padStart(2, '0') + 's';
  }, 1000);
}

// Render dynamic sections for standard home layout
function renderHomepage() {
  const products = getMockProducts();

  const flashSaleContainer = document.getElementById('flash-sale-scroller');
  const bestSellersContainer = document.getElementById('best-sellers-grid');
  const newArrivalsContainer = document.getElementById('new-arrivals-grid');
  const topDealsContainer = document.getElementById('top-deals-grid');
  const recommendedContainer = document.getElementById('recommended-for-you-grid');
  const recentlyViewedSec = document.getElementById('recently-viewed-section');
  const recentlyViewedContainer = document.getElementById('recently-viewed-grid');

  const flashSales = products.filter(p => p.isFlashSale);
  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);

  if (flashSaleContainer) renderGrid(flashSaleContainer, flashSales);
  if (bestSellersContainer) renderGrid(bestSellersContainer, bestSellers);
  if (newArrivalsContainer) renderGrid(newArrivalsContainer, newArrivals);

  // 1. Top Deals: display discounted products (e.g., originalPrice > price, or flash sales)
  if (topDealsContainer) {
    const topDeals = products.filter(p => (p.oldPrice && p.oldPrice > p.price) || (p.originalPrice && p.originalPrice > p.price));
    renderGrid(topDealsContainer, topDeals.slice(0, 4));
  }

  // 2. Recommended For You: based on customer browsing (last visited category)
  if (recommendedContainer) {
    const lastCat = localStorage.getItem('gr_store_last_viewed_category');
    let recommended = [];
    if (lastCat) {
      recommended = products.filter(p => p.category === lastCat).slice(0, 4);
    }
    // Fallback if none viewed yet, or if there are fewer than 2 items in that category
    if (recommended.length < 2) {
      recommended = products.filter(p => p.isBestSeller || p.rating >= 4.8).slice(0, 4);
    }
    renderGrid(recommendedContainer, recommended);
  }

  // 3. Recently Viewed: loaded from local storage list of recently viewed product IDs
  if (recentlyViewedSec && recentlyViewedContainer) {
    try {
      const recentlyViewedIds = JSON.parse(localStorage.getItem('gr_store_recently_viewed_ids') || '[]');
      if (recentlyViewedIds.length > 0) {
        recentlyViewedSec.classList.remove('hidden');
        const recentlyViewedProducts = recentlyViewedIds
          .map(id => products.find(p => p.id === id))
          .filter(p => p !== undefined);
        
        if (recentlyViewedProducts.length > 0) {
          renderGrid(recentlyViewedContainer, recentlyViewedProducts);
        } else {
          recentlyViewedSec.classList.add('hidden');
        }
      } else {
        recentlyViewedSec.classList.add('hidden');
      }
    } catch (e) {
      console.error('Error rendering recently viewed', e);
      recentlyViewedSec.classList.add('hidden');
    }
  }

  // Setup click handler for custom quick categories
  const categories = [
    'school-bags',
    'ladies-hand-bags',
    'laptop-bags',
    'lunch-bags',
    'office-bags',
    'mens-purses',
    'travelling-bags',
    'accessories'
  ];
  categories.forEach(cat => {
    const el = document.getElementById(`quick-cat-${cat}`);
    if (el) {
      el.addEventListener('click', () => {
        window.location.href = `categories.html?cat=${cat}`;
      });
    }
  });

  // Homepage Newsletter Form handler
  const newsletterForm = document.getElementById('homepage-newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success-notice');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value.trim() !== '') {
        // Show success visual notice
        if (newsletterSuccess) {
          newsletterSuccess.classList.remove('hidden');
        }
        // Notify the user via beautiful toast notification
        showNotification('Thank you for subscribing! Voucher code GR10 has been sent to your email.', 'success');
        // Clear and disable form input
        emailInput.value = '';
        newsletterForm.querySelector('button').disabled = true;
        newsletterForm.querySelector('button').classList.add('opacity-50', 'pointer-events-none');
      }
    });
  }
}

// Render Search Results override
function renderSearchResults(query) {
  // Hide standard elements
  const mainSliders = document.getElementById('main-homepage-content');
  const searchResultsDiv = document.getElementById('search-results-content');
  
  if (mainSliders) mainSliders.classList.add('hidden');
  if (searchResultsDiv) searchResultsDiv.classList.remove('hidden');

  const searchQueryText = document.getElementById('search-query-text');
  const searchResultsCount = document.getElementById('search-results-count');
  const searchResultsGrid = document.getElementById('search-results-grid');

  if (searchQueryText) searchQueryText.textContent = `"${query}"`;

  const products = getMockProducts();
  const lowerQuery = query.toLowerCase().trim();

  let filtered = products;
  if (lowerQuery === 'flash') {
    filtered = products.filter(p => p.isFlashSale);
  } else {
    filtered = products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.price.toString().includes(lowerQuery)
    );
  }

  if (searchResultsCount) {
    searchResultsCount.textContent = `Found ${filtered.length} handcrafted leather crafts`;
  }

  if (filtered.length === 0) {
    searchResultsGrid.innerHTML = `
      <div class="col-span-full text-center py-16 bg-white border rounded-2xl flex flex-col items-center justify-center">
        <p class="text-slate-400 text-sm italic">No products matched your search description.</p>
        <button id="search-clear-all-btn" class="mt-4 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer">
          View All Leather Crafts
        </button>
      </div>
    `;
    const clearAll = document.getElementById('search-clear-all-btn');
    if (clearAll) {
      clearAll.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  } else {
    renderGrid(searchResultsGrid, filtered);
  }

  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}


