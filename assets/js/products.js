export const CATEGORIES = [
  {
    id: 'bags',
    name: 'Bags & Folios',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    count: 7
  },
  {
    id: 'wallets',
    name: 'Wallets & Cardholders',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    count: 5
  },
  {
    id: 'belts',
    name: 'Classic Belts',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
    count: 3
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    count: 9
  }
];

export const PRODUCTS = [
  // ===================== FLASH SALES (8 PRODUCTS) =====================
  {
    id: 'gr-01',
    productName: 'The Obsidian Bifold Wallet',
    name: 'The Obsidian Bifold Wallet',
    category: 'wallets',
    price: 45,
    oldPrice: 60,
    originalPrice: 60,
    discountPercentage: 25,
    flashSaleDiscount: 25,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 24,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 12,
    soldCount: 8,
    description: 'A sleek, classic bifold wallet crafted from full-grain vegetable-tanned leather. Features an ultra-slim profile with hand-painted burnished edges and heavy-duty polyester stitching. Built to last a lifetime and age beautifully.',
    details: [
      '100% Full-grain vegetable-tanned leather',
      '6 card slots + 1 central cash pocket',
      'Sleek bifold profile (11cm x 8.5cm x 1.2cm)',
      'Hand-burnished edges for a premium durable finish',
      'Premium gift-box packaging included'
    ],
    reviews: [
      { id: 'r1', userName: 'Adebayo O.', rating: 5, date: '2026-06-25', comment: 'The quality of the leather is unmatched. Stiff at first but breaking in nicely. Excellent craftsmanship!' },
      { id: 'r2', userName: 'Sarah M.', rating: 4, date: '2026-06-18', comment: 'Bought this as a gift for my husband. He absolutely loves it. Packaging was beautiful.' }
    ]
  },
  {
    id: 'gr-02',
    productName: 'Rock-Steady Leather Belt',
    name: 'Rock-Steady Leather Belt',
    category: 'belts',
    price: 35,
    oldPrice: 50,
    originalPrice: 50,
    discountPercentage: 30,
    flashSaleDiscount: 30,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 18,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 15,
    soldCount: 12,
    description: 'Engineered for daily wear and rugged reliability, this belt is cut from a single thick strap of premium harness leather. Secured with a heavy-duty solid brass buckle that develops a rich, golden patina over time.',
    details: [
      'Single piece full-grain harness leather (4mm thick)',
      'Solid brass heel-bar buckle (removable screw hardware)',
      'Hand-stamped Gold & Rock logo on the inside strap',
      'Standard width of 1.5 inches (3.8 cm) - fits all jeans loops'
    ],
    reviews: [
      { id: 'r4', userName: 'Chidi E.', rating: 5, date: '2026-07-02', comment: 'Solid brass and thick single-piece leather. Absolute rock solid belt.' }
    ]
  },
  {
    id: 'gr-03',
    productName: 'The Executive Leather Briefcase',
    name: 'The Executive Leather Briefcase',
    category: 'bags',
    price: 189,
    oldPrice: 270,
    originalPrice: 270,
    discountPercentage: 30,
    flashSaleDiscount: 30,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 15,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 5,
    soldCount: 10,
    description: 'The ultimate professional companion, crafted with full-grain cowhide leather, dedicated laptop compartment, and heavy-duty brass zippers.',
    details: [
      'Fits up to 16-inch laptops with dense internal padding',
      'Detachable and adjustable leather shoulder strap',
      'Front quick-access magnetic flap pockets',
      'Organized interior slots for cards, pens, and notebook'
    ],
    reviews: [
      { id: 'r101', userName: 'Olawale T.', rating: 5, date: '2026-07-01', comment: 'Outstanding craftsmanship. Perfectly fits my MacBook and looks super professional in board meetings.' }
    ]
  },
  {
    id: 'gr-04',
    productName: 'Bespoke Desk Organizer Mat',
    name: 'Bespoke Desk Organizer Mat',
    category: 'accessories',
    price: 28,
    oldPrice: 40,
    originalPrice: 40,
    discountPercentage: 30,
    flashSaleDiscount: 30,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 20,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 20,
    soldCount: 15,
    description: 'A premium top-grain leather desk blotter that adds immediate elegance to your workstation. Water-resistant and incredibly smooth.',
    details: [
      'Genuine oiled cowhide leather surface',
      'Anti-slip suede backing to protect desk surfaces',
      'Integrated stitched pen and cable loop organizer',
      'Dimensions: 80cm x 40cm - perfect for keyboard and mouse'
    ],
    reviews: [
      { id: 'r102', userName: 'Chioma N.', rating: 5, date: '2026-06-15', comment: 'Superb quality. Elevates my desk layout and acts as a wonderful mousepad.' }
    ]
  },
  {
    id: 'gr-05',
    productName: 'Vintage Leather Travel Duffel',
    name: 'Vintage Leather Travel Duffel',
    category: 'bags',
    price: 220,
    oldPrice: 315,
    originalPrice: 315,
    discountPercentage: 30,
    flashSaleDiscount: 30,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 22,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 7,
    soldCount: 9,
    description: 'Spacious and ruggedly luxurious, this weekender duffel is made of oil-waxed pull-up leather that develops beautiful scratch patinas.',
    details: [
      'Generous 45L volume capacity - perfect for 3-5 day trips',
      'Reinforced riveted carry handles + heavy-duty shoulder strap',
      'Dedicated side shoe compartment with breathable metal eyelets',
      'Inner security zipped pocket and dual quick-grab slip slots'
    ],
    reviews: [
      { id: 'r103', userName: 'Emeka U.', rating: 5, date: '2026-07-05', comment: 'Heavy duty, premium metal parts, smells amazing. Got so many compliments at the airport.' }
    ]
  },
  {
    id: 'gr-06',
    productName: 'The Horizon Cardholder',
    name: 'The Horizon Cardholder',
    category: 'wallets',
    price: 18,
    oldPrice: 25,
    originalPrice: 25,
    discountPercentage: 28,
    flashSaleDiscount: 28,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 30,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 30,
    soldCount: 25,
    description: 'Super slim front-pocket card slip crafted in top-grain crazy-horse leather. Holds 6 cards and folded cash bills effortlessly.',
    details: [
      'Ultra lightweight, weighs under 25 grams',
      '4 angled outer slots + 1 centralized cash slip',
      'Full-grain crazy-horse leather with self-healing properties',
      'Hand-threaded nylon stitches'
    ],
    reviews: [
      { id: 'r104', userName: 'Halima A.', rating: 4, date: '2026-06-29', comment: 'Very minimalist. Exactly what I needed to carry just my essential bank cards.' }
    ]
  },
  {
    id: 'gr-07',
    productName: 'Premium Leather Key Fob',
    name: 'Premium Leather Key Fob',
    category: 'accessories',
    price: 12,
    oldPrice: 20,
    originalPrice: 20,
    discountPercentage: 40,
    flashSaleDiscount: 40,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    reviewsCount: 45,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 45,
    soldCount: 40,
    description: 'An elegant handcrafted keychain with a solid brass spring clip. Perfect bespoke detail for your key ring setup.',
    details: [
      'Thick full-grain bridle leather strip',
      'Industrial solid brass snap-gate clip and key ring',
      'Laser-engraved Gold & Rock branding motif',
      'Fits comfortably over most belts up to 2 inches wide'
    ],
    reviews: [
      { id: 'r105', userName: 'Bisi S.', rating: 5, date: '2026-06-11', comment: 'Super sturdy, clip holds perfectly. A great pocket accent.' }
    ]
  },
  {
    id: 'gr-08',
    productName: 'The Nomad Passport Wallet',
    name: 'The Nomad Passport Wallet',
    category: 'accessories',
    price: 24,
    oldPrice: 35,
    originalPrice: 35,
    discountPercentage: 31,
    flashSaleDiscount: 31,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 18,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 18,
    soldCount: 12,
    description: 'Protect your passport and travel documents in absolute style. Includes slots for boarding passes, cards, and micro SIM cards.',
    details: [
      'Tailor-made fit for all standard international passports',
      'Includes 3 card slots + 1 cash / boarding ticket slip pocket',
      'Constructed with vegetable-tanned cowhide',
      'Hand-painted and hand-burnished edges'
    ],
    reviews: [
      { id: 'r106', userName: 'Tochukwu O.', rating: 5, date: '2026-07-09', comment: 'Essential companion for international travels. Sturdy and elegant.' }
    ]
  },

  // ===================== BEST SELLERS (8 PRODUCTS) =====================
  {
    id: 'gr-09',
    productName: 'The Sovereign Tote Bag',
    name: 'The Sovereign Tote Bag',
    category: 'bags',
    price: 180,
    oldPrice: 180,
    originalPrice: 180,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 32,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 14,
    soldCount: 45,
    description: 'A luxurious everyday leather tote designed to hold all your essentials with absolute class. Exquisitely crafted with sturdy leather shoulder handles, internal zippered pocket, and a solid brass accessory key clip.',
    details: [
      'Premium oil-waxed pull-up leather that develops a unique vintage character',
      'Double-layered reinforced shoulder straps with a comfortable 10" drop',
      'Spacious main compartment - easily fits a 15" MacBook Pro, tablet, and cosmetics',
      'Inner zippered floating pocket for phone, keys, and cards',
      'Dimensions: 14.5" Width x 13.5" Height x 5.5" Depth'
    ],
    reviews: [
      { id: 'r6', userName: 'Kemi A.', rating: 5, date: '2026-07-05', comment: 'I use this tote bag every single day for work. It carries my heavy laptop easily and matches everything.' },
      { id: 'r7', userName: 'Elena R.', rating: 4, date: '2026-06-22', comment: 'Stunning leather character. The smell is divine. Only wish the inner pocket was slightly larger.' }
    ]
  },
  {
    id: 'gr-10',
    productName: 'Apex Minimalist Cardholder',
    name: 'Apex Minimalist Cardholder',
    category: 'wallets',
    price: 20,
    oldPrice: 25,
    originalPrice: 25,
    discountPercentage: 20,
    flashSaleDiscount: 20,
    image: 'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 42,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 22,
    soldCount: 88,
    description: 'The perfect front-pocket wallet for low-footprint, comfortable carry. Traditional hand-stitched using thick waxed linen thread, it fits comfortably in any tight pocket while securely holding credit cards and folded cash.',
    details: [
      'Ultra-slim, front-pocket friendly footprint (10cm x 7.5cm x 0.4cm)',
      '4 outer card pockets + 1 central multi-use pocket',
      'Hand-stitched using traditional heavy saddle-stitch method',
      'Open design for immediate card access'
    ],
    reviews: [
      { id: 'r9', userName: 'Michael S.', rating: 5, date: '2026-06-11', comment: 'Finally got rid of my bulky pocket bulge! This cardholder is slim, holds my ID and 4 cards, plus some cash.' }
    ]
  },
  {
    id: 'gr-11',
    productName: 'Vanguard Apple Watch Strap',
    name: 'Vanguard Apple Watch Strap',
    category: 'accessories',
    price: 40,
    oldPrice: 40,
    originalPrice: 40,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 35,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 25,
    soldCount: 62,
    description: 'Elevate your smartwatch. Custom-crafted from sweat-resistant lining and soft vegetable-tanned leather, finished with modern black stainless steel hardware lugs and reinforced saddle stitching.',
    details: [
      'Genuine full-grain leather outer strap with sweat-resistant Vachetta lining',
      'Compatible with Apple Watch Series 1-9, SE, and Ultra (choose size)',
      'Pre-installed high-quality matte black lug adapters and buckle',
      'Double hand-stitched reinforcements near the adapters for robust daily wear'
    ],
    reviews: [
      { id: 'r12', userName: 'Yusuf A.', rating: 5, date: '2026-06-15', comment: 'Gives my Apple watch a super classy look. Perfect for business meetings.' }
    ]
  },
  {
    id: 'gr-12',
    productName: 'The Outlaw Western Belt',
    name: 'The Outlaw Western Belt',
    category: 'belts',
    price: 45,
    oldPrice: 45,
    originalPrice: 45,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 19,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 19,
    soldCount: 38,
    description: 'Features a hand-tooled floral pattern on single-bend thick cowhide leather with a premium antiqued silver buckle. A distinct statement piece.',
    details: [
      'Premium heavy cowhide shoulder leather (3.8mm-4.2mm)',
      'Distinct detailed hand-tooled western scrolling design',
      'Removable strap screw rivets for buckle customizability',
      'Hand-dyed in vintage chestnut tones'
    ],
    reviews: [
      { id: 'r112', userName: 'Nduka K.', rating: 5, date: '2026-07-06', comment: 'Fabulous western carving. The leather is thick and premium, holds up amazingly.' }
    ]
  },
  {
    id: 'gr-13',
    productName: 'The Heritage Messenger Bag',
    name: 'The Heritage Messenger Bag',
    category: 'bags',
    price: 210,
    oldPrice: 210,
    originalPrice: 210,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 28,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 8,
    soldCount: 21,
    description: 'Classic messenger bag with buckle closures. Perfect blend of vintage style and modern utility for daily commute, laptop and note storage.',
    details: [
      'Crafted with rugged water-resistant hunter leather',
      'Quick-access rear zipper slot for tablets',
      'Durable copper-finished zinc hardware details',
      'Padded internal partition fits 14-inch laptops safely'
    ],
    reviews: [
      { id: 'r113', userName: 'Tariq M.', rating: 5, date: '2026-06-25', comment: 'Heavy duty stitching and premium leather scent. Exactly what I wanted.' }
    ]
  },
  {
    id: 'gr-14',
    productName: 'Garrison Tri-Fold Wallet',
    name: 'Garrison Tri-Fold Wallet',
    category: 'wallets',
    price: 50,
    oldPrice: 50,
    originalPrice: 50,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 16,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 16,
    soldCount: 30,
    description: 'High capacity tri-fold wallet with dedicated ID window, 9 card slots, and dual cash bills divider. Perfect classic design.',
    details: [
      'Crafted with premium oiled pull-up leather',
      '9 stitched card slots + quick transparent ID mesh window',
      'Two separate cash note slots for receipts and currencies',
      'Compact folding footprint: 9cm x 11.5cm'
    ],
    reviews: [
      { id: 'r114', userName: 'Yemi G.', rating: 5, date: '2026-06-30', comment: 'Compact but holds all my business cards, IDs, and notes neatly.' }
    ]
  },
  {
    id: 'gr-15',
    productName: 'Premium Leather Journal Cover',
    name: 'Premium Leather Journal Cover',
    category: 'accessories',
    price: 32,
    oldPrice: 32,
    originalPrice: 32,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 33,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 33,
    soldCount: 55,
    description: 'Refillable A5 notebook and journal cover made of premium pull-up leather. Comes with standard heavy paper notebook for writers and executives.',
    details: [
      'Fits standard A5 journals and diaries',
      'Integrated stitched business card slot & pen holder slot',
      'Waxed thick leather cord wrap closure',
      'Includes 100 sheets of acid-free 120gsm lined paper'
    ],
    reviews: [
      { id: 'r115', userName: 'Ngozi E.', rating: 5, date: '2026-07-02', comment: 'Beautiful soft leather. It smells wonderful and makes my daily sketching feel special.' }
    ]
  },
  {
    id: 'gr-16',
    productName: 'Urban Leather Backpack',
    name: 'Urban Leather Backpack',
    category: 'bags',
    price: 240,
    oldPrice: 240,
    originalPrice: 240,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 25,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 6,
    soldCount: 18,
    description: 'Sleek and functional city backpack. Soft padded leather straps, secret phone pocket, and spacious double compartments.',
    details: [
      'Full grain pebbled leather body with premium moisture protection',
      'Separate padded notebook compartment fits laptops up to 15.6"',
      'Luggage pass-through strap for travel integration',
      'Dual exterior side pockets for umbrellas or water flasks'
    ],
    reviews: [
      { id: 'r116', userName: 'Gabriel A.', rating: 5, date: '2026-06-18', comment: 'Splendid bag! It accommodates my laptop, books, water flask, and charger with ease. Top class leather!' }
    ]
  },

  // ===================== NEW ARRIVALS (8 PRODUCTS) =====================
  {
    id: 'gr-17',
    productName: 'Nomad Messenger Bag',
    name: 'Nomad Messenger Bag',
    category: 'bags',
    price: 245,
    oldPrice: 245,
    originalPrice: 245,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 15,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 11,
    soldCount: 2,
    description: 'A rugged, highly professional messenger bag designed for the modern executive and nomad. Handcrafted from distressed full-grain crazy-horse leather, featuring heavy-duty brass zippers, dual security buckles, and a comfortable shoulder pad.',
    details: [
      'Genuine distressed heavy crazy-horse leather with self-healing pull-up effects',
      'Main padded compartment protects laptops up to 16 inches',
      'Quick-access front and back zipped slots for notebooks or tablet',
      'Adjustable canvas-reinforced leather strap with sliding pad',
      'Dimensions: 16.0" Width x 11.5" Height x 4.5" Depth'
    ],
    reviews: [
      { id: 'r8', userName: 'Tunde W.', rating: 5, date: '2026-07-10', comment: 'This bag is a masterpiece. The crazy horse leather gets cooler looking every time it gets scratched. Unbelievable durability.' }
    ]
  },
  {
    id: 'gr-18',
    productName: 'The Sentinel Passport Cover',
    name: 'The Sentinel Passport Cover',
    category: 'accessories',
    price: 28,
    oldPrice: 28,
    originalPrice: 28,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 11,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 40,
    soldCount: 3,
    description: 'Travel in absolute luxury. This hand-dyed leather jacket protects your international passport, featuring secondary card slots and custom ticket sleeves for efficient, stylish airport transit.',
    details: [
      'Fits all standard international passports',
      '2 internal high-capacity ticket slots for boarding passes',
      '2 card slots for IDs, credit cards, or lounge access cards',
      'Crafted from luxury cowhide that ages nicely under travel elements',
      'Beautiful stitching accents for a rugged travel feel'
    ],
    reviews: [
      { id: 'r10', userName: 'Fatima Z.', rating: 5, date: '2026-05-30', comment: 'Keeps my passport safe and looks highly professional. The boarding pass slot is extremely helpful.' }
    ]
  },
  {
    id: 'gr-19',
    productName: 'Iron-Clad Key Organizer',
    name: 'Iron-Clad Key Organizer',
    category: 'accessories',
    price: 15,
    oldPrice: 15,
    originalPrice: 15,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    reviewsCount: 29,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 29,
    soldCount: 5,
    description: 'Eliminate loud pocket rattle with a luxurious, compact leather key sleeve. Holds keys neatly stacked in a streamlined profile using an industrial-grade brass locking bolt post.',
    details: [
      'Full-grain bovine leather strap',
      'Solid brass adjustable locking screw post',
      'Holds 2 to 7 standard keys comfortably',
      'Includes premium metal D-ring attachment for chunky car key fobs',
      'Compact pocket footprint (8cm x 2cm)'
    ],
    reviews: [
      { id: 'r11', userName: 'Paul B.', rating: 5, date: '2026-07-01', comment: 'Simple, clever, elegant. Stopped my keys from scratching my phone screen in my pocket.' }
    ]
  },
  {
    id: 'gr-20',
    productName: 'The Renegade Leather Belt',
    name: 'The Renegade Leather Belt',
    category: 'belts',
    price: 38,
    oldPrice: 38,
    originalPrice: 38,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 14,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 24,
    soldCount: 2,
    description: 'An antiqued brown leather belt, double-stitched edges with a blackened zinc buckle. Perfect for business casual and jeans styling.',
    details: [
      'Genuine full grain cowhide cut (3.5mm thick)',
      'Classy double-line edge perimeter stitching',
      'Solid gunmetal-coated secure buckle hardware',
      'Ages into a beautiful distress profile'
    ],
    reviews: [
      { id: 'r120', userName: 'Kayode A.', rating: 4, date: '2026-07-08', comment: 'Very classy buckle and leather texture. Fits my suits perfectly.' }
    ]
  },
  {
    id: 'gr-21',
    productName: 'Gold & Rock Premium Folio',
    name: 'Gold & Rock Premium Folio',
    category: 'bags',
    price: 135,
    oldPrice: 135,
    originalPrice: 135,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 12,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 12,
    soldCount: 1,
    description: 'A luxury leather portfolio for meetings. Fits tablet, legal pad, business cards, and a premium pen in custom stitched compartments.',
    details: [
      'Full-grain supple cowhide leather wrapping',
      'Dual credit card slots + dedicated cell phone slot',
      'Universal writing pad pocket slide fitting A4 papers',
      'Sturdy leather-zipper tab closure mechanism'
    ],
    reviews: [
      { id: 'r121', userName: 'Soji O.', rating: 5, date: '2026-07-11', comment: 'Looks amazingly elite when entering board rooms. Genuine full grain leather and excellent stitches.' }
    ]
  },
  {
    id: 'gr-22',
    productName: 'The Artisan Dopp Kit',
    name: 'The Artisan Dopp Kit',
    category: 'accessories',
    price: 45,
    oldPrice: 45,
    originalPrice: 45,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 15,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 15,
    soldCount: 3,
    description: 'Waterproof-lined leather washbag. Spacious main compartment for all your shaving and travel toiletries.',
    details: [
      'Premium waterproof interior lining for protection against spillages',
      'Durable YKK brass slider zipper with full-length leather pull tab',
      'Wide-mouth opening for effortless access',
      'Compact size (24cm x 12cm x 10cm) fits any travel luggage'
    ],
    reviews: [
      { id: 'r122', userName: 'Segun F.', rating: 5, date: '2026-07-04', comment: 'Extremely spacious. Waterproof lining is superb and easy to clean.' }
    ]
  },
  {
    id: 'gr-23',
    productName: 'Phoenix Slim Wallet',
    name: 'Phoenix Slim Wallet',
    category: 'wallets',
    price: 25,
    oldPrice: 25,
    originalPrice: 25,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 11,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 35,
    soldCount: 4,
    description: 'Ultra thin wallet featuring a clever pull-tab mechanism for immediate card extraction. Fits 8 cards and folded cash bills neatly.',
    details: [
      'Constructed with vegetable-tanned premium harness leather',
      'Integrated heavy-duty elastic pull tab strap',
      'Central pocket block + 2 quick access outer card slots',
      'Extremely flat, only 0.6cm thick'
    ],
    reviews: [
      { id: 'r123', userName: 'Daniel O.', rating: 5, date: '2026-07-01', comment: 'The pull-tab is so satisfying and works flawlessly! Fits perfectly in my front pocket.' }
    ]
  },
  {
    id: 'gr-24',
    productName: 'Saddle Stitch Key Organizer',
    name: 'Saddle Stitch Key Organizer',
    category: 'accessories',
    price: 16,
    oldPrice: 16,
    originalPrice: 16,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 10,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 50,
    soldCount: 2,
    description: 'Hand-stitched leather keyholder. Securely wraps keys in a silent, beautiful leather bundle that keeps your other devices scratch-free.',
    details: [
      'Traditional saddle-stitched borders with premium waxed linen threads',
      'Solid brass screw lock holding up to 6 house keys',
      'Includes stainless steel keyring for your car fob',
      'Folds down to a highly streamlined size'
    ],
    reviews: [
      { id: 'r124', userName: 'Chinedu W.', rating: 5, date: '2026-07-09', comment: 'Excellent stitches and robust leather feel. Key rattle is totally gone.' }
    ]
  }
];
