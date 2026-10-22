export type Currency = 'MNT' | 'USD';

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
}

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collectionSlug: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  status: 'active' | 'draft';
  isFeatured: boolean;
  isNewArrival: boolean;
  image: string;
  additionalImages?: string[];
  description: string;
  sizes: string[];
  colors: ProductVariantColor[];
  sku?: string;
  tag?: string;
}

export interface CartItem {
  id: string; // unique item instance in cart
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type HomepageSectionType =
  | 'hero'
  | 'featured'
  | 'collections'
  | 'new_arrivals'
  | 'promo_marquee'
  | 'about'
  | 'instagram'
  | 'trust_pillars';

export interface HomepageSectionItem {
  id: string;
  type: HomepageSectionType;
  title?: string;
  subtitle?: string;
  enabled: boolean;
}

export interface StorefrontConfig {
  storeName: string;
  logoType: 'text' | 'image';
  logoText: string;
  logoImageUrl?: string;
  announcementActive: boolean;
  announcementText: string;

  // Dynamic Homepage Sections list
  homepageSections: HomepageSectionItem[];

  // Section specific contents
  showHeroSection: boolean;
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroImageUrl: string;
  showFeaturedSection: boolean;
  featuredCollectionSlug: string;
  showCollectionsSection: boolean;
  showNewArrivalsSection: boolean;
  showAboutSection: boolean;
  storeCategoryLabel: string;
  aboutHeadline: string;
  aboutText: string;
  promoMarqueeText?: string;

  // Contact & Brand settings
  instagramHandle: string;
  instagramUrl: string;
  phoneHotline: string;
  storeAddress: string;
  currency: Currency;
  freeShippingThreshold: number;
  adminPassword?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'qpay' | 'cod' | 'bank_transfer';
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
}

export type AdminTab = 'products' | 'collections' | 'storefront' | 'orders' | 'settings';
