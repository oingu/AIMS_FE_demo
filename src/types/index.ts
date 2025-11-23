// Product Types
export type ProductCategory = 'book' | 'newspaper' | 'cd' | 'dvd';
export type ProductStatus = 'active' | 'deactivated';
export type CoverType = 'paperback' | 'hardcover';
export type DiscType = 'Blu-ray' | 'HD-DVD';

export interface ProductBase {
  id: string;
  barcode: string;
  title: string;
  category: ProductCategory;
  description: string;
  condition: string; // new, used, etc.
  primaryColor?: string;
  returnCondition?: string;
  dimensions: {
    height: number; // cm
    width: number; // cm
    length: number; // cm
  };
  weight: number; // kg
  originalValue: number; // VND, without VAT
  currentPrice: number; // VND, without VAT
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book extends ProductBase {
  category: 'book';
  authors: string[];
  coverType: CoverType;
  publisher: string;
  publicationDate: Date;
  numberOfPages?: number;
  language?: string;
  genre?: string;
}

export interface Newspaper extends ProductBase {
  category: 'newspaper';
  editorInChief: string;
  publisher: string;
  publicationDate: Date;
  issueNumber?: string;
  publicationFrequency?: string;
  issn?: string;
  language?: string;
  sections?: string[]; // politics, business, sports, culture
}

export interface Track {
  title: string;
  length: number; // seconds
}

export interface CD extends ProductBase {
  category: 'cd';
  artists: string[];
  recordLabel: string;
  tracks: Track[];
  genre: string;
  releaseDate?: Date;
}

export interface DVD extends ProductBase {
  category: 'dvd';
  discType: DiscType;
  director: string;
  runtime: number; // minutes
  studio: string;
  language: string;
  subtitles: string[];
  releaseDate?: Date;
  genre?: string;
}

export type Product = Book | Newspaper | CD | DVD;

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number; // excluding VAT
}

// Order Types
export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type PaymentMethod = 'qrcode' | 'creditcard';

export interface DeliveryInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  content: string;
  amount: number;
  method: PaymentMethod;
  datetime: Date;
  status: 'success' | 'failed' | 'refunded';
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  subtotal: number; // excluding VAT
  vat: number; // 10%
  deliveryFee: number;
  totalAmount: number;
  payment: PaymentTransaction;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export type UserRole = 'administrator' | 'product_manager';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Stock History
export interface StockHistory {
  id: string;
  productId: string;
  previousStock: number;
  newStock: number;
  reason: string;
  changedBy: string;
  changedAt: Date;
}

// Product History
export type ProductHistoryAction = 'add' | 'edit' | 'delete';

export interface ProductHistory {
  id: string;
  productId: string;
  action: ProductHistoryAction;
  changedBy: string;
  changes?: Record<string, any>;
  timestamp: Date;
}

// Price Range Filter
export interface PriceRange {
  min: number;
  max: number | null;
  label: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

