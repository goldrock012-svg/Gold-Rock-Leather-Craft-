import { 
  db, 
  auth, 
  storage, 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot, 
  doc,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from './firebase.js';

const KEYS = {
  PRODUCTS: 'gr_store_products_v2',
  CATEGORIES: 'gr_store_categories_v2',
  CART: 'gr_store_cart',
  WISHLIST: 'gr_store_wishlist',
  CURRENT_USER: 'gr_store_current_user',
  ORDERS: 'gr_store_orders',
  NOTIFICATIONS: 'gr_store_notifications',
  HOMEPAGE_SETTINGS: 'gr_store_homepage_settings',
};

// Caches for fast synchronous UI access with real-time Firestore backups
let productsCache = [];
let categoriesCache = [];
let cartCache = [];
let wishlistCache = [];
let ordersCache = [];
let notificationsCache = [];
let currentUserCache = null;
let homepageSettingsCache = null;

// Load initial caches from LocalStorage for seamless instant rendering
const loadLocalCaches = () => {
  try {
    const localProds = localStorage.getItem(KEYS.PRODUCTS);
    if (localProds) productsCache = JSON.parse(localProds);
  } catch (e) {}

  try {
    const localCats = localStorage.getItem(KEYS.CATEGORIES);
    if (localCats) categoriesCache = JSON.parse(localCats);
  } catch (e) {}

  try {
    const localCart = localStorage.getItem(KEYS.CART);
    if (localCart) cartCache = JSON.parse(localCart);
  } catch (e) {}

  try {
    const localWishlist = localStorage.getItem(KEYS.WISHLIST);
    if (localWishlist) wishlistCache = JSON.parse(localWishlist);
  } catch (e) {}

  try {
    const localUser = localStorage.getItem(KEYS.CURRENT_USER);
    if (localUser) currentUserCache = JSON.parse(localUser);
  } catch (e) {}

  try {
    const localOrders = localStorage.getItem(KEYS.ORDERS);
    if (localOrders) ordersCache = JSON.parse(localOrders);
  } catch (e) {}

  try {
    const localNotifs = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (localNotifs) notificationsCache = JSON.parse(localNotifs);
  } catch (e) {}

  try {
    const localHomeSettings = localStorage.getItem(KEYS.HOMEPAGE_SETTINGS);
    if (localHomeSettings) homepageSettingsCache = JSON.parse(localHomeSettings);
  } catch (e) {}
};

loadLocalCaches();

// Seed Categories if empty
const seedCategoriesIfEmpty = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (snapshot.empty && window.CATEGORIES) {
      console.log('Categories empty. Seeding initial categories...');
      let index = 0;
      for (const cat of window.CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), {
          ...cat,
          orderIndex: index++
        });
      }
      console.log('Seeding categories complete!');
    }
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
};

// Seed Homepage Settings if empty
const seedHomepageSettingsIfEmpty = async () => {
  try {
    const homepageDocRef = doc(db, 'settings', 'homepage');
    const snap = await getDoc(homepageDocRef);
    if (!snap.exists()) {
      console.log('Homepage settings empty. Seeding defaults...');
      const defaultSlides = window.SLIDES || [
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
        }
      ];
      await setDoc(homepageDocRef, {
        heroSlides: defaultSlides,
        banners: [
          {
            id: 'banner1',
            title: 'Genuine Craftsmanship',
            subtitle: 'Direct from Kwara State workshop',
            image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
            link: 'categories.html'
          }
        ]
      });
      console.log('Seeding homepage settings complete!');
    }
  } catch (err) {
    console.error('Error seeding homepage settings:', err);
  }
};

// Seed Products to Firestore if database is empty
const seedProductsIfEmpty = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.empty && window.PRODUCTS) {
      console.log('Database empty. Seeding initial leather products to Firestore...');
      for (const prod of window.PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          enabled: true
        });
      }
      console.log('Seeding products complete!');
    }
  } catch (err) {
    console.error('Error seeding products:', err);
  }
};

// Real-time Firestore Subscriptions
// 1. Products Catalog Subscription
onSnapshot(collection(db, 'products'), (snapshot) => {
  const prods = [];
  snapshot.forEach(d => prods.push(d.data()));
  if (prods.length > 0) {
    productsCache = prods;
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(productsCache));
    window.dispatchEvent(new Event('productsUpdated'));
  } else {
    seedProductsIfEmpty();
  }
}, (err) => {
  console.error('Products subscription error:', err);
});

// 1b. Categories Subscription
onSnapshot(collection(db, 'categories'), (snapshot) => {
  const cats = [];
  snapshot.forEach(d => cats.push(d.data()));
  if (cats.length > 0) {
    cats.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    categoriesCache = cats;
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categoriesCache));
    window.dispatchEvent(new Event('categoriesUpdated'));
  } else {
    seedCategoriesIfEmpty();
  }
}, (err) => {
  console.error('Categories subscription error:', err);
});

// 1c. Homepage Settings Subscription
onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
  if (docSnap.exists()) {
    homepageSettingsCache = docSnap.data();
    localStorage.setItem(KEYS.HOMEPAGE_SETTINGS, JSON.stringify(homepageSettingsCache));
    window.dispatchEvent(new Event('homepageSettingsUpdated'));
  } else {
    seedHomepageSettingsIfEmpty();
  }
}, (err) => {
  console.error('Homepage settings subscription error:', err);
});

// User-specific subscriptions management
let cartUnsubscribe = null;
let wishlistUnsubscribe = null;
let ordersUnsubscribe = null;
let notificationsUnsubscribe = null;

const setupUserSubscriptions = (userId) => {
  if (cartUnsubscribe) cartUnsubscribe();
  if (wishlistUnsubscribe) wishlistUnsubscribe();
  if (ordersUnsubscribe) ordersUnsubscribe();
  if (notificationsUnsubscribe) notificationsUnsubscribe();

  // A. Cart Subscription
  cartUnsubscribe = onSnapshot(doc(db, 'carts', userId), (docSnap) => {
    if (docSnap.exists()) {
      cartCache = docSnap.data().items || [];
    } else {
      cartCache = [];
    }
    localStorage.setItem(KEYS.CART, JSON.stringify(cartCache));
    window.dispatchEvent(new Event('cartUpdated'));
  });

  // B. Wishlist Subscription
  wishlistUnsubscribe = onSnapshot(doc(db, 'wishlists', userId), (docSnap) => {
    if (docSnap.exists()) {
      wishlistCache = docSnap.data().items || [];
    } else {
      wishlistCache = [];
    }
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlistCache));
    window.dispatchEvent(new Event('wishlistUpdated'));
  });

  // C. Orders Subscription
  const isCeo = currentUserCache && currentUserCache.email === "goldrock012@gmail.com";
  const ordersRef = collection(db, 'orders');
  const ordersQ = isCeo 
    ? query(ordersRef) 
    : query(ordersRef, where('userId', '==', userId));

  ordersUnsubscribe = onSnapshot(ordersQ, (snapshot) => {
    const ords = [];
    snapshot.forEach(d => ords.push(d.data()));
    ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    ordersCache = ords;
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(ordersCache));
    window.dispatchEvent(new Event('ordersUpdated'));
  });

  // D. Notifications Subscription
  const notificationsQ = query(
    collection(db, 'notifications'), 
    where('userId', '==', userId)
  );
  notificationsUnsubscribe = onSnapshot(notificationsQ, (snapshot) => {
    const notifs = [];
    snapshot.forEach(d => notifs.push({ ...d.data(), id: d.id }));
    notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    notificationsCache = notifs;
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notificationsCache));
    window.dispatchEvent(new Event('notificationsUpdated'));
  });
};

// Listen to Firebase Auth state changes
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    console.log("Logged in via Firebase Auth:", firebaseUser.email);
    
    // Load and sync User profile in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    let userProfile = null;
    
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        userProfile = userSnap.data();
      } else {
        // Fallback to caching metadata
        userProfile = {
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0].toUpperCase(),
          email: firebaseUser.email,
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          profilePicture: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
        };
        await setDoc(userDocRef, userProfile);
      }
    } catch (e) {
      console.error("Error loading profile from Firestore:", e);
      userProfile = {
        uid: firebaseUser.uid,
        fullName: firebaseUser.email.split('@')[0].toUpperCase(),
        email: firebaseUser.email,
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
      };
    }

    currentUserCache = userProfile;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(currentUserCache));

    // Start subscriptions for Cart, Wishlist, Orders, Notifications
    setupUserSubscriptions(firebaseUser.uid);
    
    // Merge any existing local items into Firestore on login
    await mergeLocalStateToFirestore(firebaseUser.uid);

    window.__authInitialized = true;
    window.dispatchEvent(new Event('authUpdated'));
  } else {
    console.log("Logged out from Firebase Auth");
    currentUserCache = null;
    localStorage.removeItem(KEYS.CURRENT_USER);
    
    if (cartUnsubscribe) cartUnsubscribe();
    if (wishlistUnsubscribe) wishlistUnsubscribe();
    if (ordersUnsubscribe) ordersUnsubscribe();
    if (notificationsUnsubscribe) notificationsUnsubscribe();

    // Reset back to guest local storage fallbacks
    loadLocalCaches();
    
    window.__authInitialized = true;
    window.dispatchEvent(new Event('authUpdated'));
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('wishlistUpdated'));
    window.dispatchEvent(new Event('ordersUpdated'));
  }
});

// Merging offline cart and wishlist on auth
const mergeLocalStateToFirestore = async (userId) => {
  try {
    const localCart = localStorage.getItem(KEYS.CART);
    if (localCart) {
      const items = JSON.parse(localCart);
      if (items.length > 0) {
        await setDoc(doc(db, 'carts', userId), { items }, { merge: true });
        localStorage.removeItem(KEYS.CART);
      }
    }
    const localWishlist = localStorage.getItem(KEYS.WISHLIST);
    if (localWishlist) {
      const items = JSON.parse(localWishlist);
      if (items.length > 0) {
        await setDoc(doc(db, 'wishlists', userId), { items }, { merge: true });
        localStorage.removeItem(KEYS.WISHLIST);
      }
    }
  } catch (err) {
    console.error("Error merging offline state:", err);
  }
};

// ===================== PRODUCTS API =====================
const normalizeProduct = (p) => {
  if (!p) return p;
  
  // Ensure we have both old and new properties so nothing breaks
  const id = p.productId || p.id;
  const name = p.name || p.productName || '';
  const productName = p.productName || p.name || '';
  
  const featured = p.featured !== undefined ? !!p.featured : !!p.isFeatured;
  const isFeatured = featured;
  
  const flashSale = p.flashSale !== undefined ? !!p.flashSale : !!p.isFlashSale;
  const isFlashSale = flashSale;
  
  const bestSeller = p.bestSeller !== undefined ? !!p.bestSeller : !!p.isBestSeller;
  const isBestSeller = bestSeller;
  
  const newArrival = p.newArrival !== undefined ? !!p.newArrival : (p.isNew !== undefined ? !!p.isNew : false);
  const isNew = newArrival;
  
  const status = p.status || (p.enabled !== false ? 'active' : 'hidden');
  const enabled = status === 'active';
  
  const images = p.images || [p.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'];
  const image = p.image || images[0];

  const price = Number(p.price || 0);
  const oldPrice = p.oldPrice !== undefined ? (p.oldPrice ? Number(p.oldPrice) : null) : (p.originalPrice ? Number(p.originalPrice) : null);
  const originalPrice = oldPrice;
  const discount = p.discount !== undefined ? Number(p.discount) : (p.discountPercentage || 0);
  const discountPercentage = discount;

  // Specifications
  let details = p.specifications || p.details || [];
  if (typeof details === 'string') {
    details = details.split('\n').map(s => s.trim()).filter(Boolean);
  }
  const specifications = details;

  // Colours
  let colors = p.colours || p.colors || ["Classic Black", "Vintage Brown", "Tan Gold"];
  if (typeof colors === 'string') {
    colors = colors.split(',').map(s => s.trim()).filter(Boolean);
  }
  const colours = colors;

  // Sizes
  let sizes = p.sizes || [];
  if (typeof sizes === 'string') {
    sizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Stock
  const stock = p.stock !== undefined ? Number(p.stock) : 10;

  return {
    ...p,
    id,
    productId: id,
    name,
    productName,
    featured,
    isFeatured,
    flashSale,
    isFlashSale,
    bestSeller,
    isBestSeller,
    newArrival,
    isNew,
    status,
    enabled,
    image,
    images,
    price,
    oldPrice,
    originalPrice,
    discount,
    discountPercentage,
    details,
    specifications,
    colors,
    colours,
    sizes,
    stock,
    soldCount: p.soldCount !== undefined ? Number(p.soldCount) : 0,
    category: p.category
  };
};

const getMockProducts = () => {
  let prods = productsCache.length === 0 && window.PRODUCTS ? window.PRODUCTS : productsCache;
  const isCeo = currentUserCache && currentUserCache.email === "goldrock012@gmail.com";
  
  // Normalize all products
  let normalizedProds = prods.map(p => normalizeProduct(p));
  
  if (!isCeo) {
    normalizedProds = normalizedProds.filter(p => p.status === 'active');
  }
  return normalizedProds;
};

const getMockProductById = (id) => {
  const prods = getMockProducts();
  return prods.find(p => p.id === id);
};

const getMockCategories = () => {
  if (categoriesCache.length > 0) {
    return categoriesCache;
  }
  if (window.CATEGORIES) return window.CATEGORIES;
  return [];
};

// ===================== CART API =====================
const getMockCart = () => {
  return cartCache;
};

const saveMockCart = async (cart) => {
  cartCache = cart;
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  
  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'carts', auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        items: cart
      });
    } catch (err) {
      console.error("Error saving cart to Firestore:", err);
    }
  }
  window.dispatchEvent(new Event('cartUpdated'));
};

const addToMockCart = (product, quantity, color = null) => {
  const cart = [...getMockCart()];
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

const removeFromMockCart = (itemId) => {
  let cart = getMockCart().filter(item => item.id !== itemId);
  saveMockCart(cart);
  return cart;
};

const updateMockCartQuantity = (itemId, quantity) => {
  const cart = getMockCart().map(item => {
    if (item.id === itemId) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });
  saveMockCart(cart);
  return cart;
};

const clearMockCart = () => {
  saveMockCart([]);
};

// ===================== WISHLIST API =====================
const getMockWishlist = () => {
  return wishlistCache;
};

const saveMockWishlist = async (wishlist) => {
  wishlistCache = wishlist;
  localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'wishlists', auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        items: wishlist
      });
    } catch (err) {
      console.error("Error saving wishlist to Firestore:", err);
    }
  }
  window.dispatchEvent(new Event('wishlistUpdated'));
};

const toggleMockWishlist = (product) => {
  const wishlist = [...getMockWishlist()];
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

const isProductInWishlist = (productId) => {
  return getMockWishlist().some(item => item.id === productId);
};

// ===================== AUTHENTICATION & PROFILE API =====================
const getMockCurrentUser = () => {
  return currentUserCache;
};

const loginMockUser = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (err) {
    throw new Error(err.message || 'Failed to sign in. Please check your credentials.');
  }
};

const registerMockUser = async (profile) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, profile.email, profile.password);
    
    // Create detailed profile in Firestore
    const userDoc = {
      uid: cred.user.uid,
      fullName: profile.fullName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    
    await setDoc(doc(db, 'users', cred.user.uid), userDoc);
    await updateProfile(cred.user, { displayName: profile.fullName });
    
    return cred.user;
  } catch (err) {
    throw new Error(err.message || 'Failed to register account.');
  }
};

const updateMockUserProfile = async (profile) => {
  if (!auth.currentUser) throw new Error("Authentication required.");
  
  try {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDocRef, profile);
    
    // Update local cache
    currentUserCache = { ...currentUserCache, ...profile };
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(currentUserCache));
    window.dispatchEvent(new Event('authUpdated'));
    return currentUserCache;
  } catch (err) {
    throw new Error(err.message || "Failed to update profile details.");
  }
};

const logoutMockUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Error signing out:", err);
  }
};

const sendMockPasswordResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw err;
  }
};

// ===================== ORDERS API =====================
const getMockOrders = () => {
  return ordersCache;
};

const placeMockOrder = async (shippingDetails, paymentMethod) => {
  const cartItems = getMockCart();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;
  const orderId = `GR-${Math.floor(100000 + Math.random() * 900000)}`;

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
  const estimatedDeliveryStr = estimatedDeliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const invoiceNum = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder = {
    id: orderId,
    userId: auth.currentUser ? auth.currentUser.uid : 'guest',
    date: new Date().toISOString().split('T')[0],
    items: cartItems,
    total: total,
    status: 'Pending Payment Verification',
    orderStatus: 'Pending Payment',
    paymentStatus: 'Pending', // Pending, Approved, Rejected as per Req 11
    shippingDetails: shippingDetails,
    paymentMethod: paymentMethod,
    invoiceNumber: invoiceNum,
    estimatedDelivery: estimatedDeliveryStr,
    trackingHistory: [
      { status: 'Pending Payment', time: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString(),
  };

  try {
    // 1. Save Order document to Firestore
    await setDoc(doc(db, 'orders', orderId), newOrder);

    // 2. Save Payment record document to Firestore as per Req 11
    await setDoc(doc(db, 'payments', orderId), {
      id: orderId,
      orderId: orderId,
      userId: auth.currentUser ? auth.currentUser.uid : 'guest',
      amount: total,
      status: 'Pending', // Pending, Approved, Rejected
      date: new Date().toISOString()
    });

    // 3. Subtract product stock on Firestore for all purchased items
    for (const cartItem of cartItems) {
      const prodRef = doc(db, 'products', cartItem.product.id);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const currentStock = prodSnap.data().stock !== undefined ? Number(prodSnap.data().stock) : 10;
        const currentSold = prodSnap.data().soldCount !== undefined ? Number(prodSnap.data().soldCount) : 0;
        await updateDoc(prodRef, {
          stock: Math.max(0, currentStock - cartItem.quantity),
          soldCount: currentSold + cartItem.quantity
        });
      }
    }

    // 4. Log Automatic Notifications inside Firestore
    await addMockNotification(
      'Order Received', 
      `Your order ${orderId} has been registered! Total amount: ₦${total.toLocaleString()}.`, 
      'success'
    );
    await addMockNotification(
      'Payment Pending', 
      `Payment for order ${orderId} is Pending verification. Please transfer ₦${total.toLocaleString()} to Opay 8126730784 (OYEWOLE TOSIN OLUMIDE).`, 
      'info'
    );

    // Clear cart on success
    clearMockCart();
    
    return newOrder;
  } catch (err) {
    throw new Error(err.message || "Failed to log order in system database.");
  }
};

// ===================== NOTIFICATIONS API =====================
const getMockNotifications = () => {
  return notificationsCache;
};

const addMockNotification = async (title, message, type = 'info') => {
  if (!auth.currentUser) return;
  
  const notifData = {
    userId: auth.currentUser.uid,
    title,
    message,
    date: new Date().toISOString(),
    read: false,
    type
  };

  try {
    await addDoc(collection(db, 'notifications'), notifData);
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

const markAllNotificationsAsRead = async () => {
  if (!auth.currentUser) return;
  
  try {
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', auth.currentUser.uid),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    
    for (const d of snapshot.docs) {
      await updateDoc(doc(db, 'notifications', d.id), { read: true });
    }
  } catch (err) {
    console.error("Error marking notifications read:", err);
  }
};

// ===================== FILE UPLOAD HELPER =====================
const uploadFile = async (file, folderPath) => {
  if (!file) return '';
  try {
    console.log("Uploading image to Cloudinary...");
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'goldrock_products');
    
    const cloudName = 'dhirznlm';
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = (errorData.error && errorData.error.message) || `Cloudinary HTTP error! Status: ${response.status}`;
      throw new Error(`Cloudinary upload failed: ${errMsg}`);
    }
    
    const result = await response.json();
    if (!result.secure_url) {
      throw new Error("Invalid response from Cloudinary (missing secure_url)");
    }
    
    console.log("Image uploaded successfully.");
    const url = result.secure_url;
    console.log("Download URL generated.");
    return url;
  } catch (err) {
    console.error("File upload failed:", err);
    throw err;
  }
};

// WhatsApp Order Link Helper
const generateWhatsAppOrderLink = (order) => {
  const phoneNumber = '2348126730784';
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
    message += `${index + 1}. ${item.product.name}${options} x ${item.quantity} - ₦${(item.product.price * item.quantity).toLocaleString()}\n`;
  });

  message += `============================\n`;
  message += `*Delivery Fee:* ₦1,500\n`;
  message += `*TOTAL AMOUNT:* ₦${order.total.toLocaleString()}\n\n`;
  message += `Hello Gold & Rock Leather Craft, I just placed an order on your website and would like to confirm it!`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

// ===================== ADMIN CONSOLE & OPERATIONS API =====================

// Automatic initialization of the administrator account
const autoInitializeAdmin = async () => {
  // Prevent duplicate concurrent initialization triggers
  if (localStorage.getItem('gr_admin_init_triggered')) return;
  localStorage.setItem('gr_admin_init_triggered', 'true');
  try {
    // Attempt to register the administrator
    const cred = await createUserWithEmailAndPassword(auth, 'goldrock012@gmail.com', 'promise');
    const uid = cred.user.uid;
    
    // Set up their profile metadata document in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid: uid,
      fullName: 'OYEWOLE TOSIN OLUMIDE',
      email: 'goldrock012@gmail.com',
      phoneNumber: '2348126730784',
      address: 'Kwara State, Nigeria',
      city: 'Ilorin',
      state: 'Kwara State',
      needsPasswordChange: true, // Force password change flag
      profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });
    
    console.log("Admin account goldrock012@gmail.com initialized with temporary password 'promise'.");
    // Sign out so they have to sign in properly
    await signOut(auth);
  } catch (err) {
    // Expected to fail if already registered. Ignore silently.
  }
};

// Trigger auto admin setup
autoInitializeAdmin();

// Force admin to change password
const adminChangePassword = async (newPassword) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Only the administrator can perform this action.");
  }
  try {
    await updatePassword(auth.currentUser, newPassword);
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDocRef, { needsPasswordChange: false });
    
    if (currentUserCache) {
      currentUserCache.needsPasswordChange = false;
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(currentUserCache));
    }
    console.log("Administrator password successfully updated.");
  } catch (err) {
    console.error("Failed to change admin password:", err);
    throw new Error(err.message || "Failed to update administrator password.");
  }
};

// Product Catalog operations
const addProductToCatalog = async (productData, imageFileOrFiles, onStageChange = null) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    let images = [];
    let mainImage = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"; // fallback

    // If there are files, upload them
    if (imageFileOrFiles) {
      if (onStageChange) onStageChange('uploading');
      if (Array.isArray(imageFileOrFiles)) {
        images = await uploadMultipleFiles(imageFileOrFiles, 'products');
        if (images.length > 0) mainImage = images[0];
      } else if (imageFileOrFiles instanceof File) {
        const url = await uploadFile(imageFileOrFiles, 'products');
        if (url) {
          mainImage = url;
          images = [url];
        }
      }
      console.log("Image upload completed");
    }

    if (onStageChange) onStageChange('saving');

    const docId = productData.id || `gr-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    
    // Normalize categories
    const categoryId = productData.category || 'accessories';

    // Parse specifications, colours, sizes
    let specifications = productData.specifications || [];
    if (typeof specifications === 'string') {
      specifications = specifications.split('\n').map(s => s.trim()).filter(Boolean);
    }
    
    let colours = productData.colours || [];
    if (typeof colours === 'string') {
      colours = colours.split(',').map(s => s.trim()).filter(Boolean);
    }

    let sizes = productData.sizes || [];
    if (typeof sizes === 'string') {
      sizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
    }

    const price = Number(productData.price || 0);
    const oldPrice = productData.oldPrice ? Number(productData.oldPrice) : null;
    let discount = 0;
    if (oldPrice && oldPrice > price) {
      discount = Math.round(((oldPrice - price) / oldPrice) * 100);
    }

    const fullProd = {
      id: docId,
      productId: docId,
      name: productData.name,
      productName: productData.name,
      category: categoryId,
      price: price,
      oldPrice: oldPrice,
      originalPrice: oldPrice,
      discount: discount,
      discountPercentage: discount,
      image: mainImage,
      images: images.length > 0 ? images : [mainImage],
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      featured: !!productData.featured,
      isFeatured: !!productData.featured,
      flashSale: !!productData.flashSale,
      isFlashSale: !!productData.flashSale,
      bestSeller: !!productData.bestSeller,
      isBestSeller: !!productData.bestSeller,
      newArrival: !!productData.newArrival,
      isNew: !!productData.newArrival,
      stock: Number(productData.stock ?? 10),
      soldCount: Number(productData.soldCount || 0),
      description: productData.description || "Premium leather craft product.",
      specifications: specifications,
      details: specifications,
      colours: colours,
      colors: colours,
      sizes: sizes,
      reviews: [],
      status: productData.status || 'active',
      enabled: productData.status !== 'hidden',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    console.log("Saving product to Firestore...");
    await setDoc(doc(db, 'products', docId), fullProd);
    console.log("Product saved successfully.");
    console.log("Firestore save completed");
    if (onStageChange) onStageChange('saved');
    return fullProd;
  } catch (err) {
    console.error("Error adding product to catalog:", err);
    throw err;
  }
};

const editProductInCatalog = async (productId, productData, imageFileOrFiles, onStageChange = null) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const prodRef = doc(db, 'products', productId);
    let updatedFields = { ...productData };
    const nowIso = new Date().toISOString();
    updatedFields.updatedAt = nowIso;

    // Upload new image files if provided
    if (imageFileOrFiles) {
      if (onStageChange) onStageChange('uploading');
      if (Array.isArray(imageFileOrFiles) && imageFileOrFiles.length > 0) {
        const urls = await uploadMultipleFiles(imageFileOrFiles, 'products');
        if (urls.length > 0) {
          updatedFields.image = urls[0];
          updatedFields.images = urls;
        }
      } else if (imageFileOrFiles instanceof File) {
        const url = await uploadFile(imageFileOrFiles, 'products');
        if (url) {
          updatedFields.image = url;
          updatedFields.images = [url];
        }
      }
      console.log("Image upload completed");
    }

    if (onStageChange) onStageChange('saving');

    // Convert values
    if (updatedFields.price !== undefined) updatedFields.price = Number(updatedFields.price);
    if (updatedFields.oldPrice !== undefined) {
      updatedFields.oldPrice = updatedFields.oldPrice ? Number(updatedFields.oldPrice) : null;
      updatedFields.originalPrice = updatedFields.oldPrice;
      
      const price = updatedFields.price !== undefined ? updatedFields.price : 0;
      if (updatedFields.oldPrice && updatedFields.oldPrice > price) {
        updatedFields.discount = Math.round(((updatedFields.oldPrice - price) / updatedFields.oldPrice) * 100);
        updatedFields.discountPercentage = updatedFields.discount;
      } else {
        updatedFields.discount = 0;
        updatedFields.discountPercentage = 0;
      }
    }
    
    if (updatedFields.stock !== undefined) updatedFields.stock = Number(updatedFields.stock);
    if (updatedFields.soldCount !== undefined) updatedFields.soldCount = Number(updatedFields.soldCount);

    if (updatedFields.specifications !== undefined) {
      let specs = updatedFields.specifications;
      if (typeof specs === 'string') {
        specs = specs.split('\n').map(s => s.trim()).filter(Boolean);
      }
      updatedFields.specifications = specs;
      updatedFields.details = specs;
    }

    if (updatedFields.colours !== undefined) {
      let cols = updatedFields.colours;
      if (typeof cols === 'string') {
        cols = cols.split(',').map(s => s.trim()).filter(Boolean);
      }
      updatedFields.colours = cols;
      updatedFields.colors = cols;
    }

    if (updatedFields.sizes !== undefined) {
      let szs = updatedFields.sizes;
      if (typeof szs === 'string') {
        szs = szs.split(',').map(s => s.trim()).filter(Boolean);
      }
      updatedFields.sizes = szs;
    }

    // Handle checkboxes mapping
    if (updatedFields.featured !== undefined) updatedFields.isFeatured = !!updatedFields.featured;
    if (updatedFields.flashSale !== undefined) updatedFields.isFlashSale = !!updatedFields.flashSale;
    if (updatedFields.bestSeller !== undefined) updatedFields.isBestSeller = !!updatedFields.bestSeller;
    if (updatedFields.newArrival !== undefined) updatedFields.isNew = !!updatedFields.newArrival;
    if (updatedFields.status !== undefined) updatedFields.enabled = updatedFields.status !== 'hidden';

    console.log("Saving product to Firestore...");
    await updateDoc(prodRef, updatedFields);
    console.log("Product saved successfully.");
    console.log("Firestore save completed");
    if (onStageChange) onStageChange('saved');
  } catch (err) {
    console.error("Error editing product in catalog:", err);
    throw err;
  }
};

const deleteProductFromCatalog = async (productId) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const prodRef = doc(db, 'products', productId);
    const prodSnap = await getDoc(prodRef);
    if (prodSnap.exists()) {
      const data = prodSnap.data();
      const imgs = data.images || [data.image].filter(Boolean);
      for (const imgUrl of imgs) {
        if (imgUrl && imgUrl.includes('firebasestorage.googleapis.com')) {
          try {
            const imgRef = ref(storage, imgUrl);
            await deleteObject(imgRef);
          } catch (e) {
            console.error("Error deleting product image from storage:", e);
          }
        }
      }
    }
    await deleteDoc(prodRef);
    console.log(`Product ${productId} successfully deleted.`);
  } catch (err) {
    console.error("Error deleting product:", err);
    throw new Error(err.message || "Failed to delete product from database.");
  }
};

// Helper for multiple file uploads
const uploadMultipleFiles = async (files, folderPath) => {
  if (!files || files.length === 0) return [];
  const urls = [];
  for (const file of files) {
    if (file && file instanceof File) {
      const url = await uploadFile(file, folderPath);
      if (url) urls.push(url);
    }
  }
  return urls;
};

// Categories Management
const addCategory = async (categoryData) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const id = categoryData.id || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const orderIndex = categoriesCache.length;
    
    await setDoc(doc(db, 'categories', id), {
      id: id,
      name: categoryData.name,
      image: categoryData.image || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600",
      count: 0,
      orderIndex: orderIndex
    });
  } catch (err) {
    console.error("Error adding category:", err);
    throw new Error("Failed to create category.");
  }
};

const editCategory = async (categoryId, categoryData) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    await updateDoc(doc(db, 'categories', categoryId), categoryData);
  } catch (err) {
    console.error("Error editing category:", err);
    throw new Error("Failed to edit category.");
  }
};

const deleteCategory = async (categoryId) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (err) {
    console.error("Error deleting category:", err);
    throw new Error("Failed to delete category.");
  }
};

const reorderCategories = async (reorderedIds) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    for (let i = 0; i < reorderedIds.length; i++) {
      const catId = reorderedIds[i];
      await updateDoc(doc(db, 'categories', catId), { orderIndex: i });
    }
  } catch (err) {
    console.error("Error reordering categories:", err);
    throw new Error("Failed to update category ranks.");
  }
};

// Homepage settings manager
const saveHomepageSettings = async (settings) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    await setDoc(doc(db, 'settings', 'homepage'), settings, { merge: true });
  } catch (err) {
    console.error("Error saving homepage settings:", err);
    throw new Error("Failed to update homepage content.");
  }
};

// Order administrative actions
const approveOrderPayment = async (orderId) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) throw new Error("Order not found.");
    
    const orderData = orderSnap.data();

    const adminEmail = auth.currentUser ? auth.currentUser.email : 'goldrock012@gmail.com';
    const timestamp = new Date().toISOString();

    let currentHistory = orderData.trackingHistory || [
      { status: 'Pending Payment', time: orderData.date || timestamp }
    ];
    
    // Add steps if they don't already exist
    if (!currentHistory.some(h => h.status === 'Payment Verified')) {
      currentHistory.push({ status: 'Payment Verified', time: timestamp });
    }
    if (!currentHistory.some(h => h.status === 'Processing')) {
      currentHistory.push({ status: 'Processing', time: timestamp });
    }

    // 1. Update Order status and Payment status
    await updateDoc(orderRef, {
      paymentStatus: 'Approved',
      status: 'Processing',
      orderStatus: 'Processing',
      approvedBy: adminEmail,
      approvedAt: timestamp,
      trackingHistory: currentHistory,
      lastUpdated: timestamp
    });

    // 2. Update Payment record status
    await updateDoc(doc(db, 'payments', orderId), {
      status: 'Approved',
      approvedBy: adminEmail,
      approvedAt: timestamp
    });

    // 3. Create Dynamic Notifications inside Firestore for the customer
    const userNotifRef = collection(db, 'notifications');
    await addDoc(userNotifRef, {
      userId: orderData.userId || 'guest',
      title: 'Payment Successful',
      message: `Your payment for order ${orderId} has been verified successfully! Status: Paid Successfully.`,
      date: new Date().toISOString(),
      read: false,
      type: 'success'
    });

    await addDoc(userNotifRef, {
      userId: orderData.userId || 'guest',
      title: 'Order Confirmed',
      message: `🔔 Your order is now Processing.`,
      date: new Date().toISOString(),
      read: false,
      type: 'success'
    });

    console.log(`Order ${orderId} payment approved successfully.`);
  } catch (err) {
    console.error("Error approving payment:", err);
    throw new Error(err.message || "Failed to approve payment.");
  }
};

const rejectOrderPayment = async (orderId) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) throw new Error("Order not found.");
    
    const orderData = orderSnap.data();

    const adminEmail = auth.currentUser ? auth.currentUser.email : 'goldrock012@gmail.com';
    const timestamp = new Date().toISOString();

    let currentHistory = orderData.trackingHistory || [
      { status: 'Pending Payment', time: orderData.date || timestamp }
    ];
    currentHistory.push({ status: 'Cancelled', time: timestamp });

    // Update statuses
    await updateDoc(orderRef, {
      paymentStatus: 'Rejected',
      status: 'Cancelled (Payment Rejected)',
      orderStatus: 'Cancelled',
      rejectedBy: adminEmail,
      rejectedAt: timestamp,
      trackingHistory: currentHistory,
      lastUpdated: timestamp
    });

    await updateDoc(doc(db, 'payments', orderId), {
      status: 'Rejected',
      rejectedBy: adminEmail,
      rejectedAt: timestamp
    });

    // Notify customer
    await addDoc(collection(db, 'notifications'), {
      userId: orderData.userId || 'guest',
      title: 'Payment Rejected',
      message: `We could not verify your payment transfer for order ${orderId}. Please contact customer care.`,
      date: new Date().toISOString(),
      read: false,
      type: 'danger'
    });
  } catch (err) {
    console.error("Error rejecting payment:", err);
    throw new Error(err.message || "Failed to reject payment.");
  }
};

const updateOrderStatus = async (orderId, status) => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) throw new Error("Order not found.");
    
    const orderData = orderSnap.data();
    const timestamp = new Date().toISOString();

    let currentHistory = orderData.trackingHistory || [
      { status: 'Pending Payment', time: orderData.date || timestamp }
    ];
    
    // Add status if it's not the same as last one
    if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1].status !== status) {
      currentHistory.push({ status: status, time: timestamp });
    }

    await updateDoc(orderRef, { 
      status: status,
      orderStatus: status,
      trackingHistory: currentHistory,
      lastUpdated: timestamp
    });

    // Notify customer dynamically
    let type = 'info';
    let msg = `Your order ${orderId} is now at state: ${status}`;
    if (status === 'Processing') msg = `🔔 Your order is now Processing.`;
    else if (status === 'Packed' || status === 'Packaging') msg = `🔔 Your order has been Packed.`;
    else if (status === 'Shipped') {
      type = 'success';
      msg = `🔔 Your order has been Shipped.`;
    }
    else if (status === 'Out For Delivery') msg = `🔔 Your order is Out For Delivery.`;
    else if (status === 'Delivered') {
      type = 'success';
      msg = `🔔 Your order has been Delivered.`;
    }

    await addDoc(collection(db, 'notifications'), {
      userId: orderData.userId || 'guest',
      title: `Order Status: ${status}`,
      message: msg,
      date: new Date().toISOString(),
      read: false,
      type: type
    });

    console.log(`Order ${orderId} status changed to ${status}.`);
  } catch (err) {
    console.error("Error updating order status:", err);
    throw new Error(err.message || "Failed to update order status.");
  }
};

// Customer accounts catalog query
const getCustomersList = async () => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const customers = [];
    snapshot.forEach(d => {
      const data = d.data();
      if (data.email !== "goldrock012@gmail.com") {
        customers.push(data);
      }
    });
    return customers;
  } catch (err) {
    console.error("Error loading customer database list:", err);
    return [];
  }
};

// Payment logs query
const getAllPaymentsList = async () => {
  if (!auth.currentUser || auth.currentUser.email !== "goldrock012@gmail.com") {
    throw new Error("Administrative permission required.");
  }
  try {
    const snapshot = await getDocs(collection(db, 'payments'));
    const payments = [];
    snapshot.forEach(d => payments.push(d.data()));
    return payments;
  } catch (err) {
    console.error("Error loading payment transaction logs:", err);
    return [];
  }
};

// Homepage settings accessor
const getHomepageSettings = () => {
  return homepageSettingsCache;
};


// Bind to window object for full compatibility with legacy code
window.KEYS = KEYS;
window.getMockProducts = getMockProducts;
window.getMockProductById = getMockProductById;
window.getMockCategories = getMockCategories;
window.getMockCart = getMockCart;
window.saveMockCart = saveMockCart;
window.addToMockCart = addToMockCart;
window.removeFromMockCart = removeFromMockCart;
window.updateMockCartQuantity = updateMockCartQuantity;
window.clearMockCart = clearMockCart;
window.getMockWishlist = getMockWishlist;
window.saveMockWishlist = saveMockWishlist;
window.toggleMockWishlist = toggleMockWishlist;
window.isProductInWishlist = isProductInWishlist;
window.getMockCurrentUser = getMockCurrentUser;
window.loginMockUser = loginMockUser;
window.registerMockUser = registerMockUser;
window.updateMockUserProfile = updateMockUserProfile;
window.logoutMockUser = logoutMockUser;
window.sendMockPasswordResetEmail = sendMockPasswordResetEmail;
window.getMockOrders = getMockOrders;
window.placeMockOrder = placeMockOrder;
window.generateWhatsAppOrderLink = generateWhatsAppOrderLink;
window.getMockNotifications = getMockNotifications;
window.addMockNotification = addMockNotification;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.uploadFile = uploadFile;

// Admin binds
window.adminChangePassword = adminChangePassword;
window.addProductToCatalog = addProductToCatalog;
window.editProductInCatalog = editProductInCatalog;
window.deleteProductFromCatalog = deleteProductFromCatalog;
window.addCategory = addCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.reorderCategories = reorderCategories;
window.saveHomepageSettings = saveHomepageSettings;
window.approveOrderPayment = approveOrderPayment;
window.rejectOrderPayment = rejectOrderPayment;
window.updateOrderStatus = updateOrderStatus;
window.getCustomersList = getCustomersList;
window.getAllPaymentsList = getAllPaymentsList;
window.getHomepageSettings = getHomepageSettings;

// Export Firebase features directly for any scripts that want to import them as Req 2
export {
  db,
  auth,
  storage,
  getMockProducts,
  getMockProductById,
  getMockCategories,
  getMockCart,
  saveMockCart,
  addToMockCart,
  removeFromMockCart,
  updateMockCartQuantity,
  clearMockCart,
  getMockWishlist,
  saveMockWishlist,
  toggleMockWishlist,
  isProductInWishlist,
  getMockCurrentUser,
  loginMockUser,
  registerMockUser,
  updateMockUserProfile,
  logoutMockUser,
  sendMockPasswordResetEmail,
  getMockOrders,
  placeMockOrder,
  generateWhatsAppOrderLink,
  getMockNotifications,
  addMockNotification,
  markAllNotificationsAsRead,
  uploadFile,
  // Admin exports
  adminChangePassword,
  addProductToCatalog,
  editProductInCatalog,
  deleteProductFromCatalog,
  addCategory,
  editCategory,
  deleteCategory,
  reorderCategories,
  saveHomepageSettings,
  approveOrderPayment,
  rejectOrderPayment,
  updateOrderStatus,
  getCustomersList,
  getAllPaymentsList,
  getHomepageSettings
};
