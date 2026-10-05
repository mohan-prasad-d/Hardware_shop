export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  torqueRating?: string;
  battery?: string;
  rpm?: string;
  chuck?: string;
  weight?: string;
  warranty: string;
  rating: number;
  reviewsCount: number;
  inStock: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  features: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  specsSummary?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'PROCESSING' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export type ColorTheme = 'amber' | 'stealth' | 'crimson';
