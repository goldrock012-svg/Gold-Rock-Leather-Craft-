import { 
  getMockWishlist, 
  addToMockCart, 
  toggleMockWishlist, 
  isProductInWishlist 
} from './db.js';
import { initCommonUI, showNotification, toggleCartDrawer } from './common.js';
import { getProductCardHtml, setupCardEvents } from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  renderWishlistPage();

  window.addEventListener('wishlistUpdated', () => {
    renderWishlistPage();
  });

  if (window.lucide) window.lucide.createIcons();
});

function renderWishlistPage() {
  const grid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');
  const filledState = document.getElementById('wishlist-filled-state');

  if (!grid || !emptyState || !filledState) return;

  const items = getMockWishlist();

  if (items.length === 0) {
    emptyState.classList.remove('hidden');
    filledState.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  filledState.classList.remove('hidden');

  grid.innerHTML = items.map(p => getProductCardHtml(p)).join('');
  setupCardEvents(grid, items);

  if (window.lucide) window.lucide.createIcons();
}
