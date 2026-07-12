import { 
  getMockCategories, 
  getMockProducts, 
  addToMockCart, 
  toggleMockWishlist, 
  isProductInWishlist 
} from './db.js';
import { initCommonUI, showNotification, toggleCartDrawer } from './common.js';
import { getProductCardHtml, setupCardEvents } from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  const params = new URLSearchParams(window.location.search);
  const activeCat = params.get('cat') || '';

  if (activeCat) {
    renderCategoryProducts(activeCat);
  } else {
    renderCategoryGrid();
  }

  if (window.lucide) window.lucide.createIcons();
});

// Render the 4 main categories banners
function renderCategoryGrid() {
  const categoriesList = document.getElementById('categories-list-view');
  const catProductsList = document.getElementById('category-products-view');

  if (categoriesList && catProductsList) {
    categoriesList.classList.remove('hidden');
    catProductsList.classList.add('hidden');
  }

  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  const categories = getMockCategories();

  const descs = {
    'school-bags': 'Durable and spacious handcrafted leather backpacks designed for academic excellence.',
    'ladies-hand-bags': 'Elegant hand-crafted shoulder bags and luxury totes for the modern woman.',
    'laptop-bags': 'Padded protective leather sleeves and messenger bags designed for modern tech.',
    'lunch-bags': 'Insulated, premium custom-designed lunch bags that redefine gourmet on-the-go.',
    'office-bags': 'Sleek, organized leather briefcases and portfolios for executive presence.',
    'mens-purses': 'Ultra-slim leather wallets, bifold organizers, and executive pocket purses.',
    'travelling-bags': 'Rugged, high-capacity leather duffels and weekender bags built for long journeys.'
  };

  grid.innerHTML = categories.map(cat => `
    <div onclick="window.location.href='categories.html?cat=${cat.id}'" class="group relative h-48 md:h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md cursor-pointer hover:-translate-y-1 transition-all duration-300" id="category-card-${cat.id}">
      <!-- Background image -->
      <div class="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" style="background-image: url(${cat.image})"></div>
      
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

      <!-- Category Description -->
      <div class="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white flex justify-between items-end">
        <div class="flex flex-col">
          <span class="text-[10px] font-mono tracking-widest text-brand-orange uppercase font-bold mb-1">
            Collection
          </span>
          <h3 class="text-lg md:text-xl font-bold font-display tracking-tight text-white">
            ${cat.name}
          </h3>
          <p class="text-xs text-slate-300 font-light mt-0.5 max-w-sm">
            ${descs[cat.id] || ''}
          </p>
        </div>

        <!-- Arrow Indicator -->
        <div class="p-2 bg-brand-orange group-hover:bg-brand-orange-dark text-white rounded-full transition-all shrink-0">
          <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>
  `).join('');
}

// Render products under a specific category
function renderCategoryProducts(catId) {
  const categoriesList = document.getElementById('categories-list-view');
  const catProductsList = document.getElementById('category-products-view');

  if (categoriesList && catProductsList) {
    categoriesList.classList.add('hidden');
    catProductsList.classList.remove('hidden');
  }

  const category = getMockCategories().find(c => c.id === catId);
  const products = getMockProducts().filter(p => p.category === catId);

  const titleEl = document.getElementById('active-cat-title');
  const descEl = document.getElementById('active-cat-desc');
  const gridEl = document.getElementById('category-products-grid');

  if (titleEl && category) {
    titleEl.textContent = category.name;
  }

  const descs = {
    'school-bags': 'Explore our range of durable, handcrafted leather backpacks and student bookbags.',
    'ladies-hand-bags': 'Discover elegant hand-crafted shoulder bags, luxury leather totes, and crossbody bags.',
    'laptop-bags': 'A premium selection of padded laptop sleeves, tech-safe messengers, and folio protectors.',
    'lunch-bags': 'Keep your meals fresh in style with our high-end insulated leather lunch bags and totes.',
    'office-bags': 'Make a board-room statement with our sleek leather briefcases, document folders, and planners.',
    'mens-purses': 'Refined minimalist cardholders, bifold wallets, and luxury pocket organizers.',
    'travelling-bags': 'Travel with premium weekender duffels, cabin bags, and travel accessory dopp kits.'
  };

  if (descEl) {
    descEl.textContent = descs[catId] || 'Discover our premium handcrafted leather collection.';
  }

  if (gridEl) {
    if (products.length === 0) {
      gridEl.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-slate-400 text-sm italic">No items found under this collection.</p>
        </div>
      `;
    } else {
      gridEl.innerHTML = products.map(p => getProductCardHtml(p)).join('');
      setupCardEvents(gridEl, products);
    }
  }

  const backBtn = document.getElementById('back-to-collections-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'categories.html';
    });
  }
}
