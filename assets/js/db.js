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
  ref,
  uploadBytes,
  getDownloadURL
} from './firebase.js';

const KEYS = {
  PRODUCTS: 'gr_store_products_v2',
  CATEGORIES: 'gr_store_categories_v2',
  CART: 'gr_store_cart',
  WISHLIST: 'gr_store_wishlist',
  CURRENT_USER: 'gr_store_current_user',
  ORDERS: 'gr_store_orders',
  NOTIFICATIONS: 'gr_store_notifications',
};

// Caches for fast synchronous UI access with real-time Firestore backups
let productsCache = [];
let categoriesCache = [];
let cartCache = [];
let wishlistCache = [];
let ordersCache = [];
let notificationsCache = [];
let currentUserCache = null;

// Load initial caches from LocalStorage for seamless instant rendering
const loadLocalCaches = () => {
  try {
    const localProds = localStorage.getItem(KEYS.PRODUCTS);
    if (localProds) productsCache = JSON.parse(localProds);
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
};

loadLocalCaches();

// Seed Products to Firestore if database is empty
const seedProductsIfEmpty = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.empty && window.PRODUCTS) {
      console.log('Database empty. Seeding initial leather products to Firestore...');
      for (const prod of window.PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
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
const getMockProducts = () => {
  if (productsCache.length === 0 && window.PRODUCTS) {
    return window.PRODUCTS;
  }
  return productsCache;
};

const getMockProductById = (id) => {
  const prods = getMockProducts();
  return prods.find(p => p.id === id);
};

const getMockCategories = () => {
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

  const newOrder = {
    id: orderId,
    userId: auth.currentUser ? auth.currentUser.uid : 'guest',
    date: new Date().toISOString().split('T')[0],
    items: cartItems,
    total: total,
    status: 'Pending Payment Verification',
    paymentStatus: 'Pending', // Pending, Approved, Rejected as per Req 11
    shippingDetails: shippingDetails,
    paymentMethod: paymentMethod,
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

    // 3. Subtract product stock on Firestore if flash sale
    for (const cartItem of cartItems) {
      if (cartItem.product.isFlashSale) {
        const prodRef = doc(db, 'products', cartItem.product.id);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          const currentStock = prodSnap.data().stock || 0;
          const currentSold = prodSnap.data().soldCount || 0;
          await updateDoc(prodRef, {
            stock: Math.max(0, currentStock - cartItem.quantity),
            soldCount: currentSold + cartItem.quantity
          });
        }
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
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folderPath}/${fileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (err) {
    console.error("File upload failed:", err);
    throw new Error("Failed to upload file to Firebase Storage.");
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
window.getMockOrders = getMockOrders;
window.placeMockOrder = placeMockOrder;
window.generateWhatsAppOrderLink = generateWhatsAppOrderLink;
window.getMockNotifications = getMockNotifications;
window.addMockNotification = addMockNotification;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.uploadFile = uploadFile;

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
  getMockOrders,
  placeMockOrder,
  generateWhatsAppOrderLink,
  getMockNotifications,
  addMockNotification,
  markAllNotificationsAsRead,
  uploadFile
};
