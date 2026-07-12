export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  details: string[];
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleDiscount?: number; // e.g. 20 for 20%
  stock?: number; // total stock for flash sale
  soldCount?: number; // how many sold
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface CartItem {
  id: string; // cart item unique id (product.id + optional options)
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface ShippingDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  additionalNotes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingDetails: ShippingDetails;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer';
}

export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
}
