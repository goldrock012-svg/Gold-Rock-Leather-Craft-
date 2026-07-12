// Slider configuration
const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1600',
    accent: 'GOLD & ROCK HANDCRAFTED LUXURY',
    title: 'Artisanal Premium Bags & Accessories',
    subtitle: 'Sourced from the finest full-grain leather in Nigeria. Handcrafted with meticulous double-stitching and designed for a lifetime of timeless elegance and durability.',
    ctaUrl: 'categories.html',
    ctaText: 'Shop Collections',
    secondaryCtaUrl: 'categories.html',
    secondaryCtaText: 'Browse Catalogue'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1600',
    accent: 'EXECUTIVE OFFICE RANGE',
    title: 'Luxury Laptop Bags & Meeting Folios',
    subtitle: 'Padded protective interiors, heavy-duty brass zippers, and burnished edge-finishes. Make an unmistakable statement in every executive boardroom meeting.',
    ctaUrl: 'categories.html?cat=laptop-bags',
    ctaText: 'Shop Laptop Bags',
    secondaryCtaUrl: 'categories.html?cat=office-bags',
    secondaryCtaText: 'View Portfolios'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600',
    accent: 'TRAVEL & WEEKENDER SPECIAL',
    title: 'Rugged Duffel Bags Built to Last',
    subtitle: 'High-capacity, oil-waxed premium pull-up leather that develops beautiful scratch patinas. Engineered with reinforced handles to endure your longest journeys.',
    ctaUrl: 'categories.html?cat=travelling-bags',
    ctaText: 'Explore Weekenders',
    secondaryCtaUrl: 'categories.html',
    secondaryCtaText: 'All Collections'
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

  const flashSaleContainer = document.getElementById('flash-sale-grid');
  const bestSellersContainer = document.getElementById('best-sellers-grid');
  const newArrivalsContainer = document.getElementById('new-arrivals-grid');

  const flashSales = products.filter(p => p.isFlashSale);
  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);

  if (flashSaleContainer) renderGrid(flashSaleContainer, flashSales);
  if (bestSellersContainer) renderGrid(bestSellersContainer, bestSellers);
  if (newArrivalsContainer) renderGrid(newArrivalsContainer, newArrivals);

  // Setup click handler for custom quick categories
  const categories = [
    'school-bags',
    'ladies-hand-bags',
    'laptop-bags',
    'lunch-bags',
    'office-bags',
    'mens-purses',
    'travelling-bags'
  ];
  categories.forEach(cat => {
    const el = document.getElementById(`quick-cat-bar-${cat}`);
    if (el) {
      el.addEventListener('click', () => {
        window.location.href = `categories.html?cat=${cat}`;
      });
    }
  });
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
      p.category.toLowerCase().includes(lowerQuery)
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


