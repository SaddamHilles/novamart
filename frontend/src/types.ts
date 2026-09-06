export type PublicUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
};

export type CartItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type Review = {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
};

export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  featured: boolean;
};

export type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type PaymentMethod = 'Card' | 'Cash on Delivery';

export type Order = {
  _id: string;
  status: string;
  isPaid: boolean;
  paidAt?: string;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  createdAt: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};

export type CatalogResponse = {
  products: Product[];
  categories: string[];
};

export type ProductForm = {
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  price: number;
  countInStock: number;
  featured: boolean;
};
