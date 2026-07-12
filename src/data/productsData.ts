import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'bags',
    name: 'Bags & Folios',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    count: 2
  },
  {
    id: 'wallets',
    name: 'Wallets & Cardholders',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    count: 2
  },
  {
    id: 'belts',
    name: 'Classic Belts',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
    count: 1
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    count: 3
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'gr-01',
    name: 'The Obsidian Bifold Wallet',
    price: 45,
    originalPrice: 60,
    category: 'wallets',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A sleek, classic bifold wallet crafted from full-grain vegetable-tanned leather. Features an ultra-slim profile with hand-painted burnished edges and heavy-duty polyester stitching. Built to last a lifetime and age beautifully.',
    details: [
      '100% Full-grain vegetable-tanned leather',
      '6 card slots + 1 central cash pocket',
      'Sleek bifold profile (11cm x 8.5cm x 1.2cm)',
      'Hand-burnished edges for a premium durable finish',
      'Premium gift-box packaging included'
    ],
    rating: 4.8,
    reviewsCount: 24,
    isFlashSale: true,
    flashSaleDiscount: 25,
    stock: 12,
    soldCount: 8,
    reviews: [
      { id: 'r1', userName: 'Adebayo O.', rating: 5, date: '2026-06-25', comment: 'The quality of the leather is unmatched. Stiff at first but breaking in nicely. Excellent craftsmanship!' },
      { id: 'r2', userName: 'Sarah M.', rating: 4, date: '2026-06-18', comment: 'Bought this as a gift for my husband. He absolutely loves it. Packaging was beautiful.' },
      { id: 'r3', userName: 'John D.', rating: 5, date: '2026-05-12', comment: 'Top tier wallet! Minimalist yet holds all my essential cards and cash perfectly.' }
    ]
  },
  {
    id: 'gr-02',
    name: 'Rock-Steady Leather Belt',
    price: 35,
    originalPrice: 50,
    category: 'belts',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ec5b01?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Engineered for daily wear and rugged reliability, this belt is cut from a single thick strap of premium harness leather. Secured with a heavy-duty solid brass buckle that develops a rich, golden patina over time.',
    details: [
      'Single piece full-grain harness leather (4mm thick)',
      'Solid brass heel-bar buckle (removable screw hardware)',
      'Hand-stamped Gold & Rock logo on the inside strap',
      'Standard width of 1.5 inches (3.8 cm) - fits all jeans loops',
      '7 adjustable oval holes for maximum comfort and perfect sizing'
    ],
    rating: 4.9,
    reviewsCount: 18,
    isFlashSale: true,
    flashSaleDiscount: 30,
    stock: 15,
    soldCount: 12,
    reviews: [
      { id: 'r4', userName: 'Chidi E.', rating: 5, date: '2026-07-02', comment: 'Solid brass and thick single-piece leather. This is not the cheap glued-together store-bought crap. Absolute rock solid belt.' },
      { id: 'r5', userName: 'David L.', rating: 5, date: '2026-06-20', comment: 'Perfect fit, premium smell, looks incredible with denim.' }
    ]
  },
  {
    id: 'gr-03',
    name: 'The Sovereign Tote Bag',
    price: 180,
    originalPrice: 220,
    category: 'bags',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A luxurious everyday leather tote designed to hold all your essentials with absolute class. Exquisitely crafted with sturdy leather shoulder handles, internal zippered pocket, and a solid brass accessory key clip.',
    details: [
      'Premium oil-waxed pull-up leather that develops a unique vintage character',
      'Double-layered reinforced shoulder straps with a comfortable 10" drop',
      'Spacious main compartment - easily fits a 15" MacBook Pro, tablet, and cosmetics',
      'Inner zippered floating pocket for phone, keys, and cards',
      'Dimensions: 14.5" Width x 13.5" Height x 5.5" Depth'
    ],
    rating: 4.7,
    reviewsCount: 32,
    isBestSeller: true,
    reviews: [
      { id: 'r6', userName: 'Kemi A.', rating: 5, date: '2026-07-05', comment: 'I use this tote bag every single day for work. It carries my heavy laptop easily and matches everything.' },
      { id: 'r7', userName: 'Elena R.', rating: 4, date: '2026-06-22', comment: 'Stunning leather character. The smell is divine. Only wish the inner pocket was slightly larger.' }
    ]
  },
  {
    id: 'gr-04',
    name: 'Nomad Messenger Bag',
    price: 245,
    category: 'bags',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A rugged, highly professional messenger bag designed for the modern executive and nomad. Handcrafted from distressed full-grain crazy-horse leather, featuring heavy-duty brass zippers, dual security buckles, and a comfortable shoulder pad.',
    details: [
      'Genuine distressed heavy crazy-horse leather with self-healing pull-up effects',
      'Main padded compartment protects laptops up to 16 inches',
      'Quick-access front and back zipped slots for notebooks or tablet',
      'Adjustable canvas-reinforced leather strap with sliding pad',
      'Dimensions: 16.0" Width x 11.5" Height x 4.5" Depth'
    ],
    rating: 4.9,
    reviewsCount: 15,
    isNew: true,
    reviews: [
      { id: 'r8', userName: 'Tunde W.', rating: 5, date: '2026-07-10', comment: 'This bag is a masterpiece. The crazy horse leather gets cooler looking every time it gets scratched. Unbelievable durability.' }
    ]
  },
  {
    id: 'gr-05',
    name: 'Apex Minimalist Cardholder',
    price: 20,
    originalPrice: 25,
    category: 'wallets',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'The perfect front-pocket wallet for low-footprint, comfortable carry. Traditional hand-stitched using thick waxed linen thread, it fits comfortably in any tight pocket while securely holding credit cards and folded cash.',
    details: [
      'Ultra-slim, front-pocket friendly footprint (10cm x 7.5cm x 0.4cm)',
      '4 outer card pockets + 1 central multi-use pocket',
      'Hand-stitched using traditional heavy saddle-stitch method',
      'Open design for immediate card access'
    ],
    rating: 4.6,
    reviewsCount: 42,
    isBestSeller: true,
    reviews: [
      { id: 'r9', userName: 'Michael S.', rating: 5, date: '2026-06-11', comment: 'Finally got rid of my bulky pocket bulge! This cardholder is slim, holds my ID and 4 cards, plus some cash. Leather quality is spectacular.' }
    ]
  },
  {
    id: 'gr-06',
    name: 'The Sentinel Passport Cover',
    price: 28,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Travel in absolute luxury. This hand-dyed leather jacket protects your international passport, featuring secondary card slots and custom ticket sleeves for efficient, stylish airport transit.',
    details: [
      'Fits all standard international passports',
      '2 internal high-capacity ticket slots for boarding passes',
      '2 card slots for IDs, credit cards, or lounge access cards',
      'Crafted from luxury cowhide that ages nicely under travel elements',
      'Beautiful stitching accents for a rugged travel feel'
    ],
    rating: 4.8,
    reviewsCount: 11,
    isNew: true,
    reviews: [
      { id: 'r10', userName: 'Fatima Z.', rating: 5, date: '2026-05-30', comment: 'Keeps my passport safe and looks highly professional. The boarding pass slot is extremely helpful.' }
    ]
  },
  {
    id: 'gr-07',
    name: 'Iron-Clad Key Organizer',
    price: 15,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Eliminate loud pocket rattle with a luxurious, compact leather key sleeve. Holds keys neatly stacked in a streamlined profile using an industrial-grade brass locking bolt post.',
    details: [
      'Full-grain bovine leather strap',
      'Solid brass adjustable locking screw post',
      'Holds 2 to 7 standard keys comfortably',
      'Includes premium metal D-ring attachment for chunky car key fobs',
      'Compact pocket footprint (8cm x 2cm)'
    ],
    rating: 4.5,
    reviewsCount: 29,
    isNew: true,
    isBestSeller: true,
    reviews: [
      { id: 'r11', userName: 'Paul B.', rating: 5, date: '2026-07-01', comment: 'Simple, clever, elegant. Stopped my keys from scratching my phone screen in my pocket.' }
    ]
  },
  {
    id: 'gr-08',
    name: 'Vanguard Apple Watch Strap',
    price: 40,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Elevate your smartwatch. Custom-crafted from sweat-resistant lining and soft vegetable-tanned leather, finished with modern black stainless steel hardware lugs and reinforced saddle stitching.',
    details: [
      'Genuine full-grain leather outer strap with sweat-resistant Vachetta lining',
      'Compatible with Apple Watch Series 1-9, SE, and Ultra (choose size)',
      'Pre-installed high-quality matte black lug adapters and buckle',
      'Double hand-stitched reinforcements near the adapters for robust daily wear'
    ],
    rating: 4.8,
    reviewsCount: 35,
    isBestSeller: true,
    reviews: [
      { id: 'r12', userName: 'Yusuf A.', rating: 5, date: '2026-06-15', comment: 'Gives my Apple watch a super classy look. Perfect for business meetings.' }
    ]
  }
];
