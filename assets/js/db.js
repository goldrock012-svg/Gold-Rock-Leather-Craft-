import { PRODUCTS, CATEGORIES } from './products.js';

const KEYS = {
  PRODUCTS: 'gr_store_products_v2',
  CATEGORIES: 'gr_store_categories_v2',
  CART: 'gr_store_cart',
  WISHLIST: 'gr_store_wishlist',
  CURRENT_USER: 'gr_store_current_user',
  ORDERS: 'gr_store_orders',
};

// Initialize default mock data into LocalStorage if not present
export const initializeMockDB = () => {
  const storedProducts = localStorage.getItem(KEYS.PRODUCTS);
  let needsProductReset = false;
  if (!storedProducts) {
    needsProductReset = true;
  } else {
    try {
      const parsed = JSON.parse(storedProducts);
      if (!Array.isArray(parsed) || parsed.length < PRODUCTS.length) {
        needsProductReset = true;
      }
    } catch (e) {
      needsProductReset = true;
    }
  }

  if (needsProductReset) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
  }

  const storedCategories = localStorage.getItem(KEYS.CATEGORIES);
  let needsCategoryReset = false;
  if (!storedCategories) {
    needsCategoryReset = true;
  } else {
    try {
      const parsed = JSON.parse(storedCategories);
      if (!Array.isArray(parsed) || parsed.length < CATEGORIES.length) {
        needsCategoryReset = true;
      }
    } catch (e) {
      needsCategoryReset = true;
    }
  }

  if (needsCategoryReset) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
  }

  if (!localStorage.getItem(KEYS.CART)) {
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  }
};

// Products API
export const getMockProducts = () => {
  initializeMockDB();
  const productsJSON = localStorage.getItem(KEYS.PRODUCTS);
  return productsJSON ? JSON.parse(productsJSON) : PRODUCTS;
};

export const getMockProductById = (id) => {
  const products = getMockProducts();
  return products.find(p => p.id === id);
};

// Categories API
export const getMockCategories = () => {
  initializeMockDB();
  const categoriesJSON = localStorage.getItem(KEYS.CATEGORIES);
  return categoriesJSON ? JSON.parse(categoriesJSON) : CATEGORIES;
};

// Cart API
export const getMockCart = () => {
  initializeMockDB();
  const cartJSON = localStorage.getItem(KEYS.CART);
  return cartJSON ? JSON.parse(cartJSON) : [];
};

export const saveMockCart = (cart) => {
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const addToMockCart = (product, quantity, color = null) => {
  const cart = getMockCart();
  const itemId = `${product.id}-${color || 'default'}`;
  const existingIndex = cart.findIndex(item => item.id === itemId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: itemId,
      product,
      quantity,
      selectedColor: color,
    });
  }

  saveMockCart(cart);
  return cart;
};

export const removeFromMockCart = (itemId) => {
  let cart = getMockCart();
  cart = cart.filter(item => item.id !== itemId);
  saveMockCart(cart);
  return cart;
};

export const updateMockCartQuantity = (itemId, quantity) => {
  const cart = getMockCart();
  const existingItem = cart.find(item => item.id === itemId);
  if (existingItem) {
    existingItem.quantity = Math.max(1, quantity);
    saveMockCart(cart);
  }
  return cart;
};

export const clearMockCart = () => {
  saveMockCart([]);
};

// Wishlist API
export const getMockWishlist = () => {
  initializeMockDB();
  const wishlistJSON = localStorage.getItem(KEYS.WISHLIST);
  return wishlistJSON ? JSON.parse(wishlistJSON) : [];
};

export const saveMockWishlist = (wishlist) => {
  localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

export const toggleMockWishlist = (product) => {
  const wishlist = getMockWishlist();
  const index = wishlist.findIndex(item => item.id === product.id);
  let added = false;

  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(product);
    added = true;
  }

  saveMockWishlist(wishlist);
  return added;
};

export const isProductInWishlist = (productId) => {
  const wishlist = getMockWishlist();
  return wishlist.some(item => item.id === productId);
};

// Authentication & User Profile Mocks
export const getMockCurrentUser = () => {
  const userJSON = localStorage.getItem(KEYS.CURRENT_USER);
  return userJSON ? JSON.parse(userJSON) : null;
};

export const loginMockUser = (email, password = null) => {
  const existingUser = getMockCurrentUser();
  if (existingUser && existingUser.email === email) {
    return existingUser;
  }

  const defaultProfile = {
    fullName: email.split('@')[0].toUpperCase(),
    email: email,
    phoneNumber: '+234 812 345 6789',
    address: '15 Rock Steady Crescent, Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
  };

  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(defaultProfile));
  window.dispatchEvent(new Event('authUpdated'));
  return defaultProfile;
};

export const registerMockUser = (profile) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
  window.dispatchEvent(new Event('authUpdated'));
  return profile;
};

export const updateMockUserProfile = (profile) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
  window.dispatchEvent(new Event('authUpdated'));
  return profile;
};

export const logoutMockUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
  window.dispatchEvent(new Event('authUpdated'));
};

// Orders API
export const getMockOrders = () => {
  initializeMockDB();
  const ordersJSON = localStorage.getItem(KEYS.ORDERS);
  return ordersJSON ? JSON.parse(ordersJSON) : [];
};

export const placeMockOrder = (shippingDetails, paymentMethod) => {
  const cartItems = getMockCart();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;

  const newOrder = {
    id: `GR-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split('T')[0],
    items: cartItems,
    total: total,
    status: 'pending',
    shippingDetails: shippingDetails,
    paymentMethod: paymentMethod,
  };

  const orders = getMockOrders();
  orders.unshift(newOrder);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));

  // Reduce stock if flash sale
  const products = getMockProducts();
  cartItems.forEach(cartItem => {
    const prod = products.find(p => p.id === cartItem.product.id);
    if (prod && prod.isFlashSale && prod.stock !== undefined) {
      prod.stock = Math.max(0, prod.stock - cartItem.quantity);
      if (prod.soldCount !== undefined) {
        prod.soldCount += cartItem.quantity;
      }
    }
  });
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

  // Clear cart on success
  clearMockCart();

  window.dispatchEvent(new Event('ordersUpdated'));
  return newOrder;
};

// WhatsApp Order Formatting Helper
export const generateWhatsAppOrderLink = (order) => {
  const phoneNumber = '+2348123456789';
  let message = `*GR STORE - NEW ORDER CONFIRMATION*\n`;
  message += `============================\n`;
  message += `*Order ID:* ${order.id}\n`;
  message += `*Customer:* ${order.shippingDetails.fullName}\n`;
  message += `*Phone:* ${order.shippingDetails.phoneNumber}\n`;
  message += `*Address:* ${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.state}\n`;
  message += `*Payment:* ${order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}\n`;
  message += `============================\n`;
  message += `*ITEMS ORDERED:*\n`;

  order.items.forEach((item, index) => {
    const options = item.selectedColor ? ` (${item.selectedColor})` : '';
    message += `${index + 1}. ${item.product.name}${options} x ${item.quantity} - $${item.product.price * item.quantity}\n`;
  });

  message += `============================\n`;
  message += `*Delivery Fee:* $10\n`;
  message += `*TOTAL AMOUNT:* $${order.total}\n\n`;
  message += `Hello Gold & Rock Leather Craft, I just placed an order on your website and would like to confirm it!`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
