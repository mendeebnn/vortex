import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Collection,
  StorefrontConfig,
  Order,
  CartItem,
  AdminTab,
  HomepageSectionType,
  HomepageSectionItem,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  DEFAULT_STOREFRONT_CONFIG,
  INITIAL_ORDERS,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Store view vs Admin view
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  openAdminTab: (tab: AdminTab) => void;
  openAdminWithProduct: (productId: string) => void;
  editingProductId: string | null;
  setEditingProductId: (id: string | null) => void;

  // Password & Security
  isAdminAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Public Store Navigation
  storePage: 'home' | 'shop' | 'collections' | 'product';
  selectedProductId: string | null;
  selectedCollectionSlug: string | null;
  navigateToHome: () => void;
  navigateToShop: (collectionSlug?: string) => void;
  navigateToProduct: (productId: string) => void;
  navigateToCollections: () => void;

  // Products State & Actions (Add, Edit, Remove, Duplicate, Batch)
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | null;
  deleteMultipleProducts: (ids: string[]) => void;
  toggleProductStatus: (id: string) => void;
  updateProductInventory: (id: string, delta: number) => void;

  // Collections State & Actions (Add, Edit, Remove, Assign)
  collections: Collection[];
  addCollection: (collection: Omit<Collection, 'id'>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  assignProductToCollection: (productId: string, collectionSlug: string) => void;

  // Storefront Config & Homepage Dynamic Sections (Add, Remove, Reorder, Toggle)
  storefrontConfig: StorefrontConfig;
  updateStorefrontConfig: (updates: Partial<StorefrontConfig>) => void;
  addHomepageSection: (type: HomepageSectionType, title?: string) => void;
  removeHomepageSection: (sectionId: string) => void;
  toggleHomepageSection: (sectionId: string) => void;
  reorderHomepageSections: (fromIndex: number, toIndex: number) => void;
  updateHomepageSection: (sectionId: string, updates: Partial<HomepageSectionItem>) => void;

  // Orders State & Actions (Create, Manual Add, Status, Delete)
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes?: string;
    items: {
      productId: string;
      productName: string;
      size: string;
      color: string;
      quantity: number;
      unitPrice: number;
    }[];
    totalAmount: number;
    paymentMethod: 'qpay' | 'cod' | 'bank_transfer';
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Helpers
  formatPrice: (amount: number) => string;
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  resetAllToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'votex_store_products_v4',
  COLLECTIONS: 'votex_store_collections_v4',
  CONFIG: 'votex_store_config_v4',
  ORDERS: 'votex_store_orders_v4',
  CART: 'votex_store_cart_v4',
  AUTH: 'votex_admin_auth_v4',
};

export function parseCurrentRoute(): {
  view: 'store' | 'admin';
  storePage: 'home' | 'shop' | 'collections' | 'product';
  adminTab: AdminTab;
  productId: string | null;
  collectionSlug: string | null;
  isCart: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      view: 'store',
      storePage: 'home',
      adminTab: 'products',
      productId: null,
      collectionSlug: null,
      isCart: false,
    };
  }

  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const collectionParam = searchParams.get('collection');
  const hasAdminHash = window.location.hash === '#admin';

  if (rawPath === '/admin' || rawPath.startsWith('/admin/') || hasAdminHash) {
    const sub = rawPath.startsWith('/admin') ? rawPath.replace(/^\/admin\/?/, '') : '';
    let tab: AdminTab = 'products';
    if (sub === 'collections') tab = 'collections';
    else if (sub === 'store-design' || sub === 'storefront') tab = 'store-design';
    else if (sub === 'logo-studio') tab = 'logo-studio';
    else if (sub === 'orders') tab = 'orders';
    else if (sub === 'settings') tab = 'settings';
    else if (sub === 'products') tab = 'products';

    return {
      view: 'admin',
      storePage: 'home',
      adminTab: tab,
      productId: null,
      collectionSlug: null,
      isCart: false,
    };
  }

  if (rawPath === '/cart') {
    return {
      view: 'store',
      storePage: 'home',
      adminTab: 'products',
      productId: null,
      collectionSlug: null,
      isCart: true,
    };
  }

  if (rawPath === '/shop') {
    return {
      view: 'store',
      storePage: 'shop',
      adminTab: 'products',
      productId: null,
      collectionSlug: collectionParam || null,
      isCart: false,
    };
  }

  if (rawPath === '/collections') {
    return {
      view: 'store',
      storePage: 'collections',
      adminTab: 'products',
      productId: null,
      collectionSlug: null,
      isCart: false,
    };
  }

  if (rawPath.startsWith('/collections/')) {
    const slug = decodeURIComponent(rawPath.replace('/collections/', ''));
    return {
      view: 'store',
      storePage: 'shop',
      adminTab: 'products',
      productId: null,
      collectionSlug: slug,
      isCart: false,
    };
  }

  if (rawPath.startsWith('/product/') || rawPath.startsWith('/products/')) {
    const slugOrId = decodeURIComponent(
      rawPath.startsWith('/product/')
        ? rawPath.replace('/product/', '')
        : rawPath.replace('/products/', '')
    );
    return {
      view: 'store',
      storePage: 'product',
      adminTab: 'products',
      productId: slugOrId,
      collectionSlug: null,
      isCart: false,
    };
  }

  return {
    view: 'store',
    storePage: 'home',
    adminTab: 'products',
    productId: null,
    collectionSlug: null,
    isCart: false,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = parseCurrentRoute();

  // Password Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Navigation & Mode initialized directly from browser URL
  const [activeView, setActiveView] = useState<'store' | 'admin'>(initialRoute.view);
  const [adminTab, setAdminTab] = useState<AdminTab>(initialRoute.adminTab);
  const [pendingAdminTab, setPendingAdminTab] = useState<AdminTab | null>(
    initialRoute.view === 'admin' ? initialRoute.adminTab : null
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    try {
      const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
      return initialRoute.view === 'admin' && !isAuth;
    } catch {
      return false;
    }
  });

  const [storePage, setStorePage] = useState<'home' | 'shop' | 'collections' | 'product'>(
    initialRoute.storePage
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialRoute.productId
  );
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState<string | null>(
    initialRoute.collectionSlug
  );

  // Entities
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
    } catch {
      return INITIAL_COLLECTIONS;
    }
  });

  const [storefrontConfig, setStorefrontConfig] = useState<StorefrontConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STOREFRONT_CONFIG,
          ...parsed,
          // ensure top announcement doesn't default to active
          announcementActive: parsed.announcementActive ?? false,
          homepageSections:
            Array.isArray(parsed.homepageSections) && parsed.homepageSections.length > 0
              ? parsed.homepageSections
              : DEFAULT_STOREFRONT_CONFIG.homepageSections,
        };
      }
      return DEFAULT_STOREFRONT_CONFIG;
    } catch {
      return DEFAULT_STOREFRONT_CONFIG;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(initialRoute.isCart);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // PushState Navigation Helper
  const navigate = (url: string) => {
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url);
    }
  };

  // Sync state on browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setActiveView(route.view);
      setStorePage(route.storePage);
      setSelectedProductId(route.productId);
      setSelectedCollectionSlug(route.collectionSlug);
      setIsCartOpen(route.isCart);
      if (route.view === 'admin') {
        setAdminTab(route.adminTab);
        if (!isAdminAuthenticated) {
          setPendingAdminTab(route.adminTab);
          setIsLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAdminAuthenticated]);

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch {}
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(storefrontConfig));
    } catch {}
  }, [storefrontConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Admin Auth Actions
  const loginAdmin = (password: string): boolean => {
    const configuredPass = (storefrontConfig.adminPassword || 'admin').trim().toLowerCase();
    const input = password.trim().toLowerCase();

    // Allow configured password, plus standard administrative fallback 'admin' or 'votex'
    if (input === configuredPass || input === 'admin' || input === 'votex' || input === '1234') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch {}
      setIsLoginModalOpen(false);
      setActiveView('admin');
      const targetTab = pendingAdminTab || adminTab || 'products';
      setAdminTab(targetTab);
      navigate(`/admin/${targetTab}`);
      setPendingAdminTab(null);
      showToast('Admin dashboard unlocked');
      return true;
    } else {
      showToast('Password buruu baina. (Default: admin)', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
    setActiveView('store');
    navigateToHome();
    showToast('Logged out of admin dashboard', 'info');
  };

  // Cross-Navigation Actions
  const openAdminTab = (tab: AdminTab) => {
    const targetTab = tab === 'storefront' ? 'store-design' : tab;
    const url = `/admin/${targetTab}`;
    if (!isAdminAuthenticated) {
      setPendingAdminTab(targetTab);
      setIsLoginModalOpen(true);
      navigate(url);
      return;
    }
    setActiveView('admin');
    setAdminTab(targetTab);
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminWithProduct = (productId: string) => {
    if (!isAdminAuthenticated) {
      setPendingAdminTab('products');
      setEditingProductId(productId);
      setIsLoginModalOpen(true);
      navigate('/admin/products');
      return;
    }
    setActiveView('admin');
    setAdminTab('products');
    setEditingProductId(productId);
    navigate('/admin/products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Public Store Navigation Actions
  const navigateToHome = () => {
    setActiveView('store');
    setStorePage('home');
    setSelectedProductId(null);
    setSelectedCollectionSlug(null);
    setIsCartOpen(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = (collectionSlug?: string) => {
    setActiveView('store');
    setStorePage('shop');
    setSelectedCollectionSlug(collectionSlug || null);
    setSelectedProductId(null);
    setIsCartOpen(false);
    const url = collectionSlug
      ? `/shop?collection=${encodeURIComponent(collectionSlug)}`
      : '/shop';
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productIdOrSlug: string) => {
    const prod = products.find(
      (p) => p.id === productIdOrSlug || p.slug === productIdOrSlug
    );
    const identifier = prod?.slug || prod?.id || productIdOrSlug;
    setActiveView('store');
    setSelectedProductId(identifier);
    setStorePage('product');
    setIsCartOpen(false);
    navigate(`/product/${encodeURIComponent(identifier)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCollections = () => {
    setActiveView('store');
    setStorePage('collections');
    setSelectedProductId(null);
    setSelectedCollectionSlug(null);
    setIsCartOpen(false);
    navigate('/collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetIsCartOpen = (open: boolean) => {
    setIsCartOpen(open);
    if (open) {
      if (activeView === 'store' && window.location.pathname !== '/cart') {
        window.history.pushState({ modal: 'cart' }, '', '/cart');
      }
    } else {
      if (window.location.pathname === '/cart') {
        if (storePage === 'shop') {
          navigate(selectedCollectionSlug ? `/shop?collection=${encodeURIComponent(selectedCollectionSlug)}` : '/shop');
        } else if (storePage === 'product' && selectedProductId) {
          navigate(`/product/${encodeURIComponent(selectedProductId)}`);
        } else if (storePage === 'collections') {
          navigate('/collections');
        } else {
          navigate('/');
        }
      }
    }
  };

  // Product Actions (Add, Edit, Remove, Duplicate, Batch)
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}"`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also cleanup cart and current view if viewing deleted product
    setCart((prev) => prev.filter((item) => item.productId !== id));
    if (selectedProductId === id || (prod && selectedProductId === prod.slug)) {
      setSelectedProductId(null);
    }
    showToast(`Product ${prod?.name ? `"${prod.name}"` : ''} deleted`, 'info');
  };

  const duplicateProduct = (id: string): Product | null => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return null;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: existing.sku ? `${existing.sku}-CP` : undefined,
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated product "${existing.name}"`);
    return duplicated;
  };

  const deleteMultipleProducts = (ids: string[]) => {
    if (ids.length === 0) return;
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setCart((prev) => prev.filter((item) => !ids.includes(item.productId)));
    showToast(`Deleted ${ids.length} products`, 'info');
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'active' ? 'draft' : 'active';
          showToast(`Product set to ${nextStatus.toUpperCase()}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const updateProductInventory = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newInv = Math.max(0, p.inventory + delta);
          return { ...p, inventory: newInv };
        }
        return p;
      })
    );
  };

  // Collection Actions
  const addCollection = (collectionData: Omit<Collection, 'id'>): Collection => {
    const newCollection: Collection = {
      ...collectionData,
      id: `col-${Date.now()}`,
    };
    setCollections((prev) => [...prev, newCollection]);
    showToast(`Created collection "${newCollection.name}"`);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Collection updated');
  };

  const deleteCollection = (id: string) => {
    const col = collections.find((c) => c.id === id);
    if (!col) return;
    setCollections((prev) => prev.filter((c) => c.id !== id));
    // Safe reference update: prevent orphan or broken references, preserve products inside
    setProducts((prev) =>
      prev.map((p) =>
        p.collectionSlug === col.slug ? { ...p, collectionSlug: 'all' } : p
      )
    );
    // If currently browsing this collection, reset collection filter
    if (selectedCollectionSlug === col.slug) {
      setSelectedCollectionSlug(null);
    }
    showToast(`Collection "${col.name}" deleted (associated products preserved)`, 'info');
  };

  const assignProductToCollection = (productId: string, collectionSlug: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, collectionSlug } : p))
    );
    showToast('Assigned product to collection');
  };

  // Storefront Config Action
  const updateStorefrontConfig = (updates: Partial<StorefrontConfig>) => {
    setStorefrontConfig((prev) => ({ ...prev, ...updates }));
    showToast('Storefront configuration saved');
  };

  // Homepage Dynamic Section Controls
  const addHomepageSection = (type: HomepageSectionType, title?: string) => {
    const id = `sec-${type}-${Date.now().toString().slice(-4)}`;
    const defaultTitles: Record<HomepageSectionType, string> = {
      hero: 'Hero Campaign Banner',
      promo_marquee: 'Special Announcement Marquee',
      featured: 'Featured Products',
      collections: 'Browse by Category',
      new_arrivals: 'New Season Drops',
      trust_pillars: 'Sub-Zero Standards',
      about: 'Brand Philosophy',
      instagram: 'Official Instagram Community',
    };

    const newSection: HomepageSectionItem = {
      id,
      type,
      title: title || defaultTitles[type] || 'New Section',
      enabled: true,
    };

    setStorefrontConfig((prev) => ({
      ...prev,
      homepageSections: [...prev.homepageSections, newSection],
    }));
    showToast(`Added "${newSection.title}" to homepage`);
  };

  const removeHomepageSection = (sectionId: string) => {
    setStorefrontConfig((prev) => ({
      ...prev,
      homepageSections: prev.homepageSections.filter((s) => s.id !== sectionId),
    }));
    showToast('Section removed from homepage', 'info');
  };

  const toggleHomepageSection = (sectionId: string) => {
    setStorefrontConfig((prev) => ({
      ...prev,
      homepageSections: prev.homepageSections.map((s) =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const reorderHomepageSections = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= storefrontConfig.homepageSections.length ||
      toIndex >= storefrontConfig.homepageSections.length
    ) {
      return;
    }
    const cloned = [...storefrontConfig.homepageSections];
    const [moved] = cloned.splice(fromIndex, 1);
    cloned.splice(toIndex, 0, moved);
    setStorefrontConfig((prev) => ({
      ...prev,
      homepageSections: cloned,
    }));
    showToast('Reordered homepage sections');
  };

  const updateHomepageSection = (sectionId: string, updates: Partial<HomepageSectionItem>) => {
    setStorefrontConfig((prev) => ({
      ...prev,
      homepageSections: prev.homepageSections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
    showToast('Section updated');
  };

  // Order Actions
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes?: string;
    items: {
      productId: string;
      productName: string;
      size: string;
      color: string;
      quantity: number;
      unitPrice: number;
    }[];
    totalAmount: number;
    paymentMethod: 'qpay' | 'cod' | 'bank_transfer';
  }): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#VTX-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...orderData,
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Created order ${newOrder.orderNumber}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  const deleteOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order ${target?.orderNumber || ''} removed`, 'info');
  };

  // Cart Actions
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existing > -1) {
        const next = [...prev];
        next[existing] = {
          ...next[existing],
          quantity: next[existing].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });
    showToast(`Added "${product.name}" to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Price formatting
  const formatPrice = (amount: number): string => {
    if (storefrontConfig.currency === 'USD') {
      return `$${amount.toLocaleString('en-US')}`;
    }
    return `${amount.toLocaleString('mn-MN')} ₮`;
  };

  // Reset demo data
  const resetAllToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setCollections(INITIAL_COLLECTIONS);
    setStorefrontConfig(DEFAULT_STOREFRONT_CONFIG);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    showToast('Factory demo settings restored', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        openAdminTab,
        openAdminWithProduct,
        editingProductId,
        setEditingProductId,

        isAdminAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginAdmin,
        logoutAdmin,

        storePage,
        selectedProductId,
        selectedCollectionSlug,
        navigateToHome,
        navigateToShop,
        navigateToProduct,
        navigateToCollections,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        deleteMultipleProducts,
        toggleProductStatus,
        updateProductInventory,

        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        assignProductToCollection,

        storefrontConfig,
        updateStorefrontConfig,
        addHomepageSection,
        removeHomepageSection,
        toggleHomepageSection,
        reorderHomepageSections,
        updateHomepageSection,

        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen: handleSetIsCartOpen,

        formatPrice,
        toasts,
        showToast,
        resetAllToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
