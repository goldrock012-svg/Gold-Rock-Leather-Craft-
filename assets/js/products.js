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
    name: "Men's Purses",
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    count: 4
  },
  {
    id: 'travelling-bags',
    name: 'Travelling Bags',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    count: 4
  }
];

const PRODUCTS = [
  // ===================== FLASH SALES (8 PRODUCTS) =====================
  {
    id: 'gr-01',
    productName: 'The Obsidian Bifold Wallet',
    name: 'The Obsidian Bifold Wallet',
    category: 'mens-purses',
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
    productName: 'Apex Slim Pocket Purse',
    name: 'Apex Slim Pocket Purse',
    category: 'mens-purses',
    price: 25,
    oldPrice: 35,
    originalPrice: 35,
    discountPercentage: 28,
    flashSaleDiscount: 28,
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
    description: 'Crafted from premium distress-finish leather, this front pocket purse features a clever pull-tab for instant card extraction and holds cash notes securely.',
    details: [
      'Top-grain oil-waxed leather',
      'Holds up to 8 cards + 5 folded bills',
      'Super flat minimalist design'
    ],
    reviews: [
      { id: 'r4', userName: 'Chidi E.', rating: 5, date: '2026-07-02', comment: 'Perfect front pocket carry wallet. Fits cards nicely.' }
    ]
  },
  {
    id: 'gr-03',
    productName: 'The Executive Briefcase',
    name: 'The Executive Briefcase',
    category: 'laptop-bags',
    price: 189,
    oldPrice: 270,
    originalPrice: 270,
    discountPercentage: 30,
    flashSaleDiscount: 30,
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
    productName: 'Bespoke Meeting Folio',
    name: 'Bespoke Meeting Folio',
    category: 'office-bags',
    price: 35,
    oldPrice: 50,
    originalPrice: 50,
    discountPercentage: 30,
    flashSaleDiscount: 30,
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
    description: 'A premium top-grain leather folio that adds immediate elegance to your business meetings. Perfect for legal pads, business cards, and digital tablets.',
    details: [
      'Genuine oiled cowhide leather surface',
      'Universal writing pad slot',
      'Integrated stitched pen and phone loop organizer'
    ],
    reviews: [
      { id: 'r102', userName: 'Chioma N.', rating: 5, date: '2026-06-15', comment: 'Superb quality. Elevates my executive presence during pitches.' }
    ]
  },
  {
    id: 'gr-05',
    productName: 'Vintage Leather Weekender',
    name: 'Vintage Leather Weekender',
    category: 'travelling-bags',
    price: 220,
    oldPrice: 315,
    originalPrice: 315,
    discountPercentage: 30,
    flashSaleDiscount: 30,
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
    productName: 'The Empress Tote Bag',
    name: 'The Empress Tote Bag',
    category: 'ladies-hand-bags',
    price: 125,
    oldPrice: 180,
    originalPrice: 180,
    discountPercentage: 30,
    flashSaleDiscount: 30,
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
    description: 'A stylish and structured tote bag designed to turn heads. Spaciously holds tablet, cosmetics, and accessories with hand-stitched leather panels.',
    details: [
      'Full-grain textured calfskin',
      'Spacious main compartment + brass clasp closure',
      'Comfortable dual shoulder straps'
    ],
    reviews: [
      { id: 'r104', userName: 'Halima A.', rating: 4, date: '2026-06-29', comment: 'So elegant! I love using it for lunch dates and events.' }
    ]
  },
  {
    id: 'gr-07',
    productName: 'Classic Scholar Backpack',
    name: 'Classic Scholar Backpack',
    category: 'school-bags',
    price: 65,
    oldPrice: 90,
    originalPrice: 90,
    discountPercentage: 27,
    flashSaleDiscount: 27,
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
    description: 'An elegant handcrafted student backpack featuring heavy-duty canvas reinforced with thick premium leather trims and buckled flaps.',
    details: [
      'Thick water-resistant wax canvas + bridle leather straps',
      'Fits up to 15" laptops + text books comfortably',
      'Ergonomic padded shoulder straps'
    ],
    reviews: [
      { id: 'r105', userName: 'Bisi S.', rating: 5, date: '2026-06-11', comment: 'Extremely durable, carries my heavy textbooks easily. Classy look.' }
    ]
  },
  {
    id: 'gr-08',
    productName: 'Gourmet Insulated Lunch Tote',
    name: 'Gourmet Insulated Lunch Tote',
    category: 'lunch-bags',
    price: 28,
    oldPrice: 40,
    originalPrice: 40,
    discountPercentage: 30,
    flashSaleDiscount: 30,
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
    description: 'A luxurious leather-shelled lunch box with thick food-grade thermal insulation to keep your meals fresh in absolute style.',
    details: [
      'Thermal reflective premium insulating lining',
      'Splash-proof leather exterior with sturdy brass buckle handle',
      'Perfect size for lunch containers and drink flasks'
    ],
    reviews: [
      { id: 'r106', userName: 'Tochukwu O.', rating: 5, date: '2026-07-09', comment: 'Brings some class into taking lunch to the office! Highly recommended.' }
    ]
  },

  // ===================== BEST SELLERS (8 PRODUCTS) =====================
  {
    id: 'gr-09',
    productName: 'The Sovereign Hobo Bag',
    name: 'The Sovereign Hobo Bag',
    category: 'ladies-hand-bags',
    price: 150,
    oldPrice: 150,
    originalPrice: 150,
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
    description: 'A luxurious everyday ladies leather hobo handbag designed to hold all your essentials with absolute class. Exquisitely crafted with sturdy leather handles and secure zip closures.',
    details: [
      'Premium oil-waxed pull-up leather that develops a unique vintage character',
      'Spacious main compartment - easily fits cosmetic kit, notebook, and personal items',
      'Inner zippered floating pocket for phone and cards'
    ],
    reviews: [
      { id: 'r6', userName: 'Kemi A.', rating: 5, date: '2026-07-05', comment: 'I use this handbag every single day. It is highly elegant and robust.' }
    ]
  },
  {
    id: 'gr-10',
    productName: 'Saddle Stitch Credit Cardholder',
    name: 'Saddle Stitch Credit Cardholder',
    category: 'mens-purses',
    price: 20,
    oldPrice: 25,
    originalPrice: 25,
    discountPercentage: 20,
    flashSaleDiscount: 20,
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
    description: 'The perfect front-pocket companion for low-footprint, comfortable card carry. Traditional hand-stitched using thick waxed linen thread.',
    details: [
      'Ultra-slim, front-pocket friendly footprint',
      '4 outer card pockets + 1 central multi-use pocket',
      'Hand-stitched using traditional heavy saddle-stitch method'
    ],
    reviews: [
      { id: 'r9', userName: 'Michael S.', rating: 5, date: '2026-06-11', comment: 'Holds my 4 cards and driver license perfectly. Extremely flat!' }
    ]
  },
  {
    id: 'gr-11',
    productName: 'Gold & Rock Document Folder',
    name: 'Gold & Rock Document Folder',
    category: 'office-bags',
    price: 40,
    oldPrice: 40,
    originalPrice: 40,
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
    description: 'Elevate your workspace. Custom-crafted leather document envelope designed to protect and store legal documents, tablets, and notes with premium brass clasp.',
    details: [
      'Genuine full-grain leather outer shell',
      'Holds A4/Legal papers easily',
      'Secure brass stud locking system'
    ],
    reviews: [
      { id: 'r12', userName: 'Yusuf A.', rating: 5, date: '2026-06-15', comment: 'Gives me a very professional executive look when entering client pitches.' }
    ]
  },
  {
    id: 'gr-12',
    productName: 'Heritage Student Knapsack',
    name: 'Heritage Student Knapsack',
    category: 'school-bags',
    price: 75,
    oldPrice: 75,
    originalPrice: 75,
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
    description: 'Features high-density stitching on premium vegetable-tanned cowhide leather. A durable design that easily stores books, devices, and stationery.',
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
    productName: 'Vanguard Laptop Messenger',
    name: 'Vanguard Laptop Messenger',
    category: 'laptop-bags',
    price: 165,
    oldPrice: 165,
    originalPrice: 165,
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
    description: 'Classic laptop messenger bag with modern organization partitions, padded notebook sleeve, and comfortable sliding shoulder pad.',
    details: [
      'Genuine distressed oil-waxed leather',
      'Padded compartment fits laptops up to 15.6"',
      'Durable copper-finished zinc hardware'
    ],
    reviews: [
      { id: 'r113', userName: 'Tariq M.', rating: 5, date: '2026-06-25', comment: 'Heavy duty stitching and premium leather scent. Highly recommended.' }
    ]
  },
  {
    id: 'gr-14',
    productName: 'Artisan Lunchbox Companion',
    name: 'Artisan Lunchbox Companion',
    category: 'lunch-bags',
    price: 30,
    oldPrice: 30,
    originalPrice: 30,
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
    description: 'High capacity lunchbox bag with thick foil insulating interior and easy-wipe premium leather exterior. Sturdy carry handle for commuting convenience.',
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
    productName: 'The Nomad Voyager Duffle',
    name: 'The Nomad Voyager Duffle',
    category: 'travelling-bags',
    price: 210,
    oldPrice: 210,
    originalPrice: 210,
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
    description: 'Heavy capacity leather travel duffle bag. Made of thick vegetable-tanned cowhide leather with a separate compartment for wet clothes and travel gear.',
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
    productName: 'The Graceful Crossbody Bag',
    name: 'The Graceful Crossbody Bag',
    category: 'ladies-hand-bags',
    price: 110,
    oldPrice: 110,
    originalPrice: 110,
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
    description: 'Compact and fashionable ladies crossbody handbag. Soft padded leather straps, secure metal lock, and elegant interior slots for quick-access items.',
    details: [
      'Genuine full grain cowhide body with premium touch lining',
      'Sturdy magnetic click lock mechanism',
      'Adjustable side crossbody straps'
    ],
    reviews: [
      { id: 'r116', userName: 'Gabriel A.', rating: 5, date: '2026-06-18', comment: 'My wife absolutely fell in love with this bag. The stitching is elite.' }
    ]
  },

  // ===================== NEW ARRIVALS (8 PRODUCTS) =====================
  {
    id: 'gr-17',
    productName: 'Elite Leather Cabin Bag',
    name: 'Elite Leather Cabin Bag',
    category: 'travelling-bags',
    price: 245,
    oldPrice: 245,
    originalPrice: 245,
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
    description: 'A luxurious leather cabin companion bag designed to meet international flight carry-on requirements. Double reinforced straps with brass lock protection.',
    details: [
      'Distressed crazy-horse leather body',
      'Fits inside standard airline overhead bins',
      'Side cardholder pockets + ticket dividers'
    ],
    reviews: [
      { id: 'r8', userName: 'Tunde W.', rating: 5, date: '2026-07-10', comment: 'This bag is a true masterpiece. Smells amazing and carries a lot of gear!' }
    ]
  },
  {
    id: 'gr-18',
    productName: 'Premium Academic Leather Satchel',
    name: 'Premium Academic Leather Satchel',
    category: 'school-bags',
    price: 85,
    oldPrice: 85,
    originalPrice: 85,
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
    description: 'Study in high fashion. Hand-dyed leather satchel bag designed with reinforced stitching to withstand textbooks, tablet weights, and heavy use.',
    details: [
      'Double magnetic secure quick-tabs',
      'Padded internal device sleeves',
      'Handcrafted using thick waxed linen thread'
    ],
    reviews: [
      { id: 'r10', userName: 'Fatima Z.', rating: 5, date: '2026-05-30', comment: 'A gorgeous book bag. It keeps all my notebooks super neat.' }
    ]
  },
  {
    id: 'gr-19',
    productName: 'Pro-Insulated Leather Lunch Sack',
    name: 'Pro-Insulated Leather Lunch Sack',
    category: 'lunch-bags',
    price: 32,
    oldPrice: 32,
    originalPrice: 32,
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
    description: 'Insulated lunch container bag wrapped in premium water-repellent bovine leather. Features a roll-top brass strap closure for adjustable space.',
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
    productName: 'The Boardroom Attache Case',
    name: 'The Boardroom Attache Case',
    category: 'office-bags',
    price: 195,
    oldPrice: 195,
    originalPrice: 195,
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
    description: 'A traditional and solid office attache case crafted from rigid leather-wrapped wooden frame, secure mechanical dual-combination locks.',
    details: [
      'Reinforced solid brass protective corners',
      'Dual-combination gold-finished security dials',
      'Suede-lined organizer lid panel'
    ],
    reviews: [
      { id: 'r120', userName: 'Kayode A.', rating: 4, date: '2026-07-08', comment: 'Extremely elegant. Old school style boardroom presence.' }
    ]
  },
  {
    id: 'gr-21',
    productName: 'Apex Tech Folio Sleeve',
    name: 'Apex Tech Folio Sleeve',
    category: 'laptop-bags',
    price: 55,
    oldPrice: 55,
    originalPrice: 55,
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
    description: 'A premium leather sleeve for 13" and 14" notebooks. Soft microsuede inner protection, and side cable organizers.',
    details: [
      'Slim profile fit for MacBook Air/Pro 13" and 14"',
      'Microsuede anti-scratch backing',
      'Front pocket slide for smartphone and chargers'
    ],
    reviews: [
      { id: 'r121', userName: 'Soji O.', rating: 5, date: '2026-07-11', comment: 'Looks amazing and feels very slim inside my bag. Stitching is stellar.' }
    ]
  },
  {
    id: 'gr-22',
    productName: 'Phoenix Pull-Tab Card Purse',
    name: 'Phoenix Pull-Tab Card Purse',
    category: 'mens-purses',
    price: 28,
    oldPrice: 28,
    originalPrice: 28,
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
    description: 'Compact vertical card purse with pull-strap card selector, central notes slot, and secure RFID protection.',
    details: [
      'High capacity minimalist layout',
      'Pull-tab strap extracts up to 6 cards instantly',
      'Oiled vegetable tanned leather'
    ],
    reviews: [
      { id: 'r122', userName: 'Segun F.', rating: 5, date: '2026-07-04', comment: 'The card pulling mechanism is highly satisfying. Leather smells divine.' }
    ]
  },
  {
    id: 'gr-23',
    productName: 'The Artisan Dopp Kit Washbag',
    name: 'The Artisan Dopp Kit Washbag',
    category: 'travelling-bags',
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
    reviewsCount: 11,
    isFlashSale: false,
    isBestSeller: false,
    isNew: true,
    stock: 35,
    soldCount: 4,
    description: 'Waterproof-lined leather toiletry washbag. Features wide-mouth design for immediate access, heavy brass zippers.',
    details: [
      'Spacious main compartment with waterproof protective layer',
      'Wide-mouth opening frame stays open',
      'Sturdy leather wrist grab loop'
    ],
    reviews: [
      { id: 'r123', userName: 'Daniel O.', rating: 5, date: '2026-07-01', comment: 'Waterproof lining is top notch. Easy to wipe clean.' }
    ]
  },
  {
    id: 'gr-24',
    productName: 'Signature Executive Planner Cover',
    name: 'Signature Executive Planner Cover',
    category: 'office-bags',
    price: 38,
    oldPrice: 38,
    originalPrice: 38,
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
    description: 'A beautiful refillable leather cover for standard notebooks or A5 planners. Sturdy wrap strap with pen loop.',
    details: [
      'Refillable A5 sleeve fit',
      'Built-in pen holder slot',
      'Crafted from thick pull-up bridle leather'
    ],
    reviews: [
      { id: 'r124', userName: 'Chinedu W.', rating: 5, date: '2026-07-09', comment: 'Extremely elegant notebook protector. Smells wonderful.' }
    ]
  }
];
