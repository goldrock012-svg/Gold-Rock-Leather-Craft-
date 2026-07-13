const CATEGORIES = [
  {
    id: 'school-bags',
    name: 'School Bags',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
    count: 3
  },
  {
    id: 'ladies-hand-bags',
    name: 'Ladies Hand Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    count: 3
  },
  {
    id: 'laptop-bags',
    name: 'Laptop Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    count: 3
  },
  {
    id: 'lunch-bags',
    name: 'Lunch Bags',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    count: 3
  },
  {
    id: 'office-bags',
    name: 'Office Bags',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    count: 4
  },
  {
    id: 'mens-purses',
    name: "Men's Purse",
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    count: 4
  },
  {
    id: 'travelling-bags',
    name: 'Travelling Bags',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    count: 4
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800',
    count: 2
  }
];

const PRODUCTS = [
  // ===================== FLASH SALES (8 PRODUCTS) =====================
  {
    id: 'gr-01',
    productName: "Gold & Rock Men's Leather Wallet",
    name: "Gold & Rock Men's Leather Wallet",
    category: 'mens-purses',
    price: 12500,
    oldPrice: 16000,
    originalPrice: 16000,
    discountPercentage: 22,
    flashSaleDiscount: 22,
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
    description: "A premium slim bifold wallet handcrafted by Gold & Rock Leather Craft using 100% genuine vegetable-tanned leather. Features fine hand-painted burnished edges and durable heavy-duty stitching designed to age into a beautiful patina.",
    details: [
      '100% Full-grain vegetable-tanned Nigerian leather',
      '6 secure card slots + 1 central compartment for cash notes',
      'Ultra-slim bifold profile (11cm x 8.5cm x 1.2cm)',
      'Hand-burnished edges for a premium durable finish',
      'Packaged in an elegant Gold & Rock presentation box'
    ],
    reviews: [
      { id: 'r1', userName: 'Adebayo Alabi', rating: 5, date: '2026-06-25', comment: 'The quality of this genuine leather is superb. It feels robust and has that signature high-end leather scent. Highly recommended!' },
      { id: 'r2', userName: 'Chioma Nwachukwu', rating: 5, date: '2026-06-18', comment: 'Bought this bifold wallet as a gift for my husband. He is extremely pleased with the hand-stitched detailing.' }
    ]
  },
  {
    id: 'gr-02',
    productName: 'Gold & Rock Slim Pocket Purse',
    name: 'Gold & Rock Slim Pocket Purse',
    category: 'mens-purses',
    price: 8500,
    oldPrice: 12000,
    originalPrice: 12000,
    discountPercentage: 29,
    flashSaleDiscount: 29,
    image: 'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 18,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 15,
    soldCount: 12,
    description: "Crafted from premium distress-finish leather, this slim pocket purse by Gold & Rock Leather Craft features an elegant layout for secure card and folded note carry.",
    details: [
      'Top-grain oil-waxed Nigerian leather',
      'Holds up to 8 cards and folded naira notes safely',
      'Super flat minimalist design'
    ],
    reviews: [
      { id: 'r4', userName: 'Chinedu O.', rating: 5, date: '2026-07-02', comment: 'Perfect front pocket carry wallet. Fits cards nicely.' }
    ]
  },
  {
    id: 'gr-03',
    productName: 'Executive Leather Laptop Bag',
    name: 'Executive Leather Laptop Bag',
    category: 'laptop-bags',
    price: 45000,
    oldPrice: 60000,
    originalPrice: 60000,
    discountPercentage: 25,
    flashSaleDiscount: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 15,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 5,
    soldCount: 10,
    description: "The ultimate business companion, crafted with full-grain thick Nigerian leather, featuring a padded laptop compartment and heavy-duty premium brass zippers.",
    details: [
      'Fits up to 16-inch laptops with dense internal shockproof padding',
      'Detachable and adjustable leather shoulder strap',
      'Front quick-access magnetic flap pockets',
      'Organized interior slots for cards, pens, and notebook'
    ],
    reviews: [
      { id: 'r101', userName: 'Ibrahim Bello', rating: 5, date: '2026-07-01', comment: 'Outstanding craftsmanship. Perfectly fits my laptop and looks super professional in board meetings.' }
    ]
  },
  {
    id: 'gr-04',
    productName: 'Gold & Rock Office Messenger Bag',
    name: 'Gold & Rock Office Messenger Bag',
    category: 'office-bags',
    price: 18500,
    oldPrice: 25000,
    originalPrice: 25000,
    discountPercentage: 26,
    flashSaleDiscount: 26,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 20,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 20,
    soldCount: 15,
    description: "A premium top-grain leather messenger bag that adds immediate elegance to your daily office commutes and business meetings. Handcrafted by Gold & Rock Leather Craft.",
    details: [
      'Genuine oiled leather surface',
      'Wide main compartment for documents and tablets',
      'Integrated stitched pen and phone loop organizer'
    ],
    reviews: [
      { id: 'r102', userName: 'Chioma N.', rating: 5, date: '2026-06-15', comment: 'Superb quality. Elevates my executive presence during pitches.' }
    ]
  },
  {
    id: 'gr-05',
    productName: 'Classic Travel Duffel',
    name: 'Classic Travel Duffel',
    category: 'travelling-bags',
    price: 55000,
    oldPrice: 75000,
    originalPrice: 75000,
    discountPercentage: 26,
    flashSaleDiscount: 26,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 22,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 7,
    soldCount: 9,
    description: "Spacious and ruggedly luxurious, this travel duffel is made of oil-waxed leather by Gold & Rock Leather Craft. It develops a rich vintage character over time.",
    details: [
      'Generous volume capacity - perfect for weekend and business trips',
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
    productName: 'Luxury Ladies Handbag',
    name: 'Luxury Ladies Handbag',
    category: 'ladies-hand-bags',
    price: 35000,
    oldPrice: 48000,
    originalPrice: 48000,
    discountPercentage: 27,
    flashSaleDiscount: 27,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 30,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 30,
    soldCount: 25,
    description: "A stylish and structured leather handbag designed to turn heads. Handcrafted with beautiful premium panels by Gold & Rock Leather Craft.",
    details: [
      'Full-grain textured premium calfskin',
      'Spacious main compartment + brass secure lock closure',
      'Comfortable dual shoulder straps'
    ],
    reviews: [
      { id: 'r104', userName: 'Halima A.', rating: 4, date: '2026-06-29', comment: 'So elegant! I love using it for office events and weekend outings.' }
    ]
  },
  {
    id: 'gr-07',
    productName: 'Premium School Backpack',
    name: 'Premium School Backpack',
    category: 'school-bags',
    price: 22000,
    oldPrice: 30000,
    originalPrice: 30000,
    discountPercentage: 26,
    flashSaleDiscount: 26,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    reviewsCount: 45,
    isFlashSale: true,
    isBestSeller: false,
    isNew: false,
    stock: 45,
    soldCount: 40,
    description: "An elegant handcrafted student backpack featuring heavy-duty canvas reinforced with thick premium leather trims and buckled flaps.",
    details: [
      'Thick water-resistant wax canvas + leather straps',
      'Fits up to 15" laptops + textbooks comfortably',
      'Ergonomic padded shoulder straps'
    ],
    reviews: [
      { id: 'r105', userName: 'Bisi S.', rating: 5, date: '2026-06-11', comment: 'Extremely durable, carries my heavy textbooks easily. Classy look.' }
    ]
  },
  {
    id: 'gr-08',
    productName: 'Executive Lunch Bag',
    name: 'Executive Lunch Bag',
    category: 'lunch-bags',
    price: 12000,
    oldPrice: 16000,
    originalPrice: 16000,
    discountPercentage: 25,
    flashSaleDiscount: 25,
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
    description: "A luxurious leather-shelled lunch box with thick food-grade thermal insulation to keep your meals fresh in absolute style.",
    details: [
      'Thermal reflective premium insulating lining',
      'Splash-proof leather exterior with sturdy hand-stitched handle',
      'Perfect size for lunch containers and drink flasks'
    ],
    reviews: [
      { id: 'r106', userName: 'Tochukwu O.', rating: 5, date: '2026-07-09', comment: 'Brings some class into taking lunch to the office! Highly recommended.' }
    ]
  },

  // ===================== BEST SELLERS (8 PRODUCTS) =====================
  {
    id: 'gr-09',
    productName: 'Gold & Rock Sovereign Ladies Bag',
    name: 'Gold & Rock Sovereign Ladies Bag',
    category: 'ladies-hand-bags',
    price: 38000,
    oldPrice: 38000,
    originalPrice: 38000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a490?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a490?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 32,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 14,
    soldCount: 45,
    description: "A luxurious everyday ladies leather handbag designed to hold all your essentials with absolute class. Exquisitely crafted by Gold & Rock Leather Craft with sturdy leather handles and secure zip closures.",
    details: [
      'Premium oil-waxed leather that develops a unique vintage character',
      'Spacious main compartment - easily fits cosmetic kit, notebook, and personal items',
      'Inner zippered floating pocket for phone and cards'
    ],
    reviews: [
      { id: 'r6', userName: 'Kemi A.', rating: 5, date: '2026-07-05', comment: 'I use this handbag every single day. It is highly elegant and robust.' }
    ]
  },
  {
    id: 'gr-10',
    productName: 'Saddle Stitch Leather Cardholder',
    name: 'Saddle Stitch Leather Cardholder',
    category: 'mens-purses',
    price: 7500,
    oldPrice: 10000,
    originalPrice: 10000,
    discountPercentage: 25,
    flashSaleDiscount: 25,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 42,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 22,
    soldCount: 88,
    description: "The perfect front-pocket companion for low-footprint, comfortable card carry. Traditional hand-stitching with thick waxed thread.",
    details: [
      'Ultra-slim, front-pocket friendly footprint',
      '4 outer card pockets + 1 central multi-use pocket',
      'Hand-stitched using traditional heavy saddle-stitch method'
    ],
    reviews: [
      { id: 'r9', userName: 'Yusuf B.', rating: 5, date: '2026-06-11', comment: 'Holds my cards and driver license perfectly. Extremely flat!' }
    ]
  },
  {
    id: 'gr-11',
    productName: 'Gold & Rock Document Folder',
    name: 'Gold & Rock Document Folder',
    category: 'office-bags',
    price: 14500,
    oldPrice: 14500,
    originalPrice: 14500,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 35,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 25,
    soldCount: 62,
    description: "Elevate your professional workspace. Custom-crafted leather document envelope designed to protect and store legal papers, tablets, and notes with secure brass stud clasp.",
    details: [
      'Genuine full-grain leather outer shell',
      'Holds A4 and Legal documents easily',
      'Secure brass stud locking system'
    ],
    reviews: [
      { id: 'r12', userName: 'Yusuf A.', rating: 5, date: '2026-06-15', comment: 'Gives me a very professional executive look when entering client pitches.' }
    ]
  },
  {
    id: 'gr-12',
    productName: 'Gold & Rock Premium Student Backpack',
    name: 'Gold & Rock Premium Student Backpack',
    category: 'school-bags',
    price: 24000,
    oldPrice: 24000,
    originalPrice: 24000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 19,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 19,
    soldCount: 38,
    description: "Features high-density stitching on premium vegetable-tanned Nigerian leather. A durable design that easily stores books, devices, and stationery.",
    details: [
      'Premium heavy cowhide shoulder leather',
      'Padded internal tablet compartment',
      'Solid brass double belt buckles'
    ],
    reviews: [
      { id: 'r112', userName: 'Nduka K.', rating: 5, date: '2026-07-06', comment: 'The leather is amazingly thick. This bag is definitely built to last my entire university years.' }
    ]
  },
  {
    id: 'gr-13',
    productName: 'Gold & Rock Laptop Messenger Bag',
    name: 'Gold & Rock Laptop Messenger Bag',
    category: 'laptop-bags',
    price: 42000,
    oldPrice: 42000,
    originalPrice: 42000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 28,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 8,
    soldCount: 21,
    description: "Classic laptop messenger bag with modern organization partitions, padded notebook sleeve, and comfortable sliding shoulder pad.",
    details: [
      'Genuine distressed oil-waxed leather',
      'Padded compartment fits laptops up to 15.6 inches',
      'Durable copper-finished zinc hardware'
    ],
    reviews: [
      { id: 'r113', userName: 'Tariq M.', rating: 5, date: '2026-06-25', comment: 'Heavy duty stitching and premium leather scent. Highly recommended.' }
    ]
  },
  {
    id: 'gr-14',
    productName: 'Gold & Rock Lunchbox Companion',
    name: 'Gold & Rock Lunchbox Companion',
    category: 'lunch-bags',
    price: 11000,
    oldPrice: 11000,
    originalPrice: 11000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 16,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 16,
    soldCount: 30,
    description: "High capacity lunchbox bag with thick foil insulating interior and easy-wipe premium leather exterior. Sturdy carry handle for commuting convenience.",
    details: [
      'High density thermal lining',
      'Waterproof interior makes it leak proof and easy to clean',
      'Premium leather top-handle'
    ],
    reviews: [
      { id: 'r114', userName: 'Yemi G.', rating: 5, date: '2026-06-30', comment: 'Spacious enough for dual meal containers. Looks like a beautiful designer pouch!' }
    ]
  },
  {
    id: 'gr-15',
    productName: 'Gold & Rock Voyager Travel Duffel',
    name: 'Gold & Rock Voyager Travel Duffel',
    category: 'travelling-bags',
    price: 52000,
    oldPrice: 52000,
    originalPrice: 52000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 33,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 33,
    soldCount: 55,
    description: "Heavy capacity leather travel duffle bag. Made of thick vegetable-tanned cowhide leather with a separate compartment for wet clothes and travel gear.",
    details: [
      '50L travel volume capacity',
      'Integrated heavy duty brass zipper rails',
      'Extra padded detachable shoulder strap'
    ],
    reviews: [
      { id: 'r115', userName: 'Ngozi E.', rating: 5, date: '2026-07-02', comment: 'Extremely durable. Used it for multiple flight trips, holds up perfectly.' }
    ]
  },
  {
    id: 'gr-16',
    productName: 'Gold & Rock Graceful Ladies Bag',
    name: 'Gold & Rock Graceful Ladies Bag',
    category: 'ladies-hand-bags',
    price: 28000,
    oldPrice: 28000,
    originalPrice: 28000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 25,
    isFlashSale: false,
    isBestSeller: true,
    isNew: false,
    stock: 6,
    soldCount: 18,
    description: "Compact and fashionable ladies crossbody handbag. Soft padded leather straps, secure metal lock, and elegant interior slots for quick-access items.",
    details: [
      'Genuine full grain cowhide body with premium touch lining',
      'Sturdy magnetic click lock mechanism',
      'Adjustable side crossbody straps'
    ],
    reviews: [
      { id: 'r116', userName: 'Grace A.', rating: 5, date: '2026-06-18', comment: 'My wife absolutely fell in love with this bag. The stitching is elite.' }
    ]
  },

  // ===================== NEW ARRIVALS (8 PRODUCTS) =====================
  {
    id: 'gr-17',
    productName: 'Gold & Rock Elite Cabin Bag',
    name: 'Gold & Rock Elite Cabin Bag',
    category: 'travelling-bags',
    price: 58000,
    oldPrice: 58000,
    originalPrice: 58000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 15,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 11,
    soldCount: 2,
    description: "A luxurious leather cabin companion bag designed to meet international flight carry-on requirements. Double reinforced straps with brass lock protection.",
    details: [
      'Distressed crazy-horse leather body',
      'Fits inside standard airline overhead bins',
      'Side cardholder pockets and ticket dividers'
    ],
    reviews: [
      { id: 'r8', userName: 'Tunde W.', rating: 5, date: '2026-07-10', comment: 'This bag is a true masterpiece. Smells amazing and carries a lot of gear!' }
    ]
  },
  {
    id: 'gr-18',
    productName: 'Gold & Rock Academic Satchel',
    name: 'Gold & Rock Academic Satchel',
    category: 'school-bags',
    price: 25000,
    oldPrice: 25000,
    originalPrice: 25000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 11,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 40,
    soldCount: 3,
    description: "Study in high fashion. Hand-dyed leather satchel bag designed with reinforced stitching by Gold & Rock Leather Craft to withstand textbooks and heavy use.",
    details: [
      'Double magnetic secure quick-tabs',
      'Padded internal device sleeves',
      'Handcrafted using thick waxed thread'
    ],
    reviews: [
      { id: 'r10', userName: 'Fatima Z.', rating: 5, date: '2026-05-30', comment: 'A gorgeous book bag. It keeps all my notebooks super neat.' }
    ]
  },
  {
    id: 'gr-19',
    productName: 'Gold & Rock Pro-Insulated Lunch Sack',
    name: 'Gold & Rock Pro-Insulated Lunch Sack',
    category: 'lunch-bags',
    price: 11500,
    oldPrice: 11500,
    originalPrice: 11500,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    reviewsCount: 29,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 29,
    soldCount: 5,
    description: "Insulated lunch container bag wrapped in premium water-repellent leather. Features a roll-top strap closure for adjustable space.",
    details: [
      'Alginate reflective thermal foil core',
      'Roll-top leather strap for expanding capacity',
      'Sturdy heavy-duty top buckle hanger'
    ],
    reviews: [
      { id: 'r11', userName: 'Paul B.', rating: 5, date: '2026-07-01', comment: 'Stays cold for hours. Highly elegant lunch carry.' }
    ]
  },
  {
    id: 'gr-20',
    productName: 'Gold & Rock Boardroom Attache Case',
    name: 'Gold & Rock Boardroom Attache Case',
    category: 'office-bags',
    price: 45000,
    oldPrice: 45000,
    originalPrice: 45000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 14,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 24,
    soldCount: 2,
    description: "A traditional and solid office attache case crafted from a rigid leather-wrapped frame with secure mechanical dual-combination locks.",
    details: [
      'Reinforced solid protective corners',
      'Dual-combination secure security dials',
      'Premium lined organizer lid panel'
    ],
    reviews: [
      { id: 'r120', userName: 'Kayode A.', rating: 4, date: '2026-07-08', comment: 'Extremely elegant. Classic boardroom presence.' }
    ]
  },
  {
    id: 'gr-21',
    productName: 'Gold & Rock Tech Folio Sleeve',
    name: 'Gold & Rock Tech Folio Sleeve',
    category: 'laptop-bags',
    price: 18500,
    oldPrice: 18500,
    originalPrice: 18500,
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
    description: "A premium leather sleeve for 13-inch and 14-inch notebooks. Soft scratchproof inner protection, and side cable organizers.",
    details: [
      'Slim profile fit for modern 13-inch and 14-inch laptops',
      'Anti-scratch interior lining',
      'Front pocket slide for smartphone and charger cords'
    ],
    reviews: [
      { id: 'r121', userName: 'Soji O.', rating: 5, date: '2026-07-11', comment: 'Looks amazing and feels very slim inside my bag.' }
    ]
  },
  {
    id: 'gr-22',
    productName: 'Gold & Rock Pull-Tab Card Purse',
    name: 'Gold & Rock Pull-Tab Card Purse',
    category: 'mens-purses',
    price: 9500,
    oldPrice: 9500,
    originalPrice: 9500,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 15,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 15,
    soldCount: 3,
    description: "Compact vertical card purse with pull-strap card selector, central notes slot, and secure RFID protection. Hand-detailed design.",
    details: [
      'High capacity minimalist layout',
      'Pull-tab strap extracts cards instantly',
      'Premium Nigerian vegetable-tanned leather'
    ],
    reviews: [
      { id: 'r122', userName: 'Segun F.', rating: 5, date: '2026-07-04', comment: 'The card pulling mechanism is highly satisfying. Leather smells divine.' }
    ]
  },
  {
    id: 'gr-23',
    productName: 'Gold & Rock Travel Dopp Kit',
    name: 'Gold & Rock Travel Dopp Kit',
    category: 'travelling-bags',
    price: 13500,
    oldPrice: 13500,
    originalPrice: 13500,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 11,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 35,
    soldCount: 4,
    description: "Waterproof-lined leather toiletry washbag. Features wide-mouth design for immediate access and heavy-duty premium zippers.",
    details: [
      'Spacious main compartment with waterproof protective layer',
      'Wide-mouth opening frame stays open during use',
      'Sturdy leather wrist grab loop'
    ],
    reviews: [
      { id: 'r123', userName: 'Daniel O.', rating: 5, date: '2026-07-01', comment: 'Waterproof lining is top notch. Easy to wipe clean.' }
    ]
  },
  {
    id: 'gr-24',
    productName: 'Gold & Rock Executive Planner Cover',
    name: 'Gold & Rock Executive Planner Cover',
    category: 'office-bags',
    price: 12000,
    oldPrice: 12000,
    originalPrice: 12000,
    discountPercentage: 0,
    flashSaleDiscount: 0,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 10,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 50,
    soldCount: 2,
    description: "A beautiful refillable leather cover for standard notebooks or A5 planners. Sturdy wrap strap with pen loop.",
    details: [
      'Refillable A5 sleeve fit',
      'Built-in pen holder slot',
      'Crafted from thick premium bridle leather'
    ],
    reviews: [
      { id: 'r124', userName: 'Chinedu W.', rating: 5, date: '2026-07-09', comment: 'Extremely elegant notebook protector. Smells wonderful.' }
    ]
  },
  {
    id: 'gr-acc-01',
    productName: 'Gold & Rock Premium Key Organizer',
    name: 'Gold & Rock Premium Key Organizer',
    category: 'accessories',
    price: 4500,
    oldPrice: 6000,
    originalPrice: 6000,
    discountPercentage: 25,
    flashSaleDiscount: 25,
    image: 'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 37,
    isFlashSale: false,
    isBestSeller: true,
    isNew: true,
    stock: 45,
    soldCount: 15,
    description: "Keep your keys silent and neat in our heavy-duty handcrafted leather organizer key sleeve.",
    details: [
      '100% thick premium tooling leather',
      'Holds 2-8 keys with robust steel locking shaft',
      'Elegant contrast stitching'
    ],
    reviews: [
      { id: 'rac1', userName: 'Emeka O.', rating: 5, date: '2026-07-12', comment: 'Absolutely brilliant organizer! No more jingle in my pocket.' }
    ]
  },
  {
    id: 'gr-acc-02',
    productName: 'Gold & Rock Classic Belt',
    name: 'Gold & Rock Classic Belt',
    category: 'accessories',
    price: 9500,
    oldPrice: 12000,
    originalPrice: 12000,
    discountPercentage: 20,
    flashSaleDiscount: 20,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 52,
    isFlashSale: false,
    isBestSeller: true,
    isNew: true,
    stock: 30,
    soldCount: 22,
    description: "Exquisite hand-burnished formal belt made from the finest top-grain bridal leather.",
    details: [
      '100% full-grain Nigerian bridal leather strap',
      'Solid heavy brass buckle attachment',
      'Durable edge treatment with natural burnishing beeswax'
    ],
    reviews: [
      { id: 'rac2', userName: 'Yusuf M.', rating: 5, date: '2026-07-11', comment: 'Incredible finish. Very thick and durable.' }
    ]
  }
];
