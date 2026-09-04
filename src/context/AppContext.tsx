import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyProfile, Product, Order, UserRole, CartItem, OrderStatus } from '../types';
import { INITIAL_COMPANIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentCompany: CompanyProfile;
  companies: CompanyProfile[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  
  // Actor switching
  selectCompany: (companyId: string) => void;
  
  // Company actions
  updateCompanyProfile: (companyId: string, updated: Partial<CompanyProfile>) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  togglePublishProduct: (id: string) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Order actions
  placeOrder: (sellerId: string, notes?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Helpers
  getProductsForRole: () => Product[];
  getWholesalers: () => CompanyProfile[];
  getFactories: () => CompanyProfile[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('usine');
  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    const saved = localStorage.getItem('agri_companies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 25) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COMPANIES;
  });
  
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('usine-1');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('agri_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 25) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('agri_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('agri_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('agri_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('agri_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('agri_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('agri_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle role change -> default company for that role
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    const defaultCompany = companies.find(c => c.role === role);
    if (defaultCompany) {
      setCurrentCompanyId(defaultCompany.id);
    }
  };

  const selectCompany = (companyId: string) => {
    const comp = companies.find(c => c.id === companyId);
    if (comp) {
      setCurrentCompanyId(comp.id);
      setCurrentRoleState(comp.role);
    }
  };

  const currentCompany = companies.find(c => c.id === currentCompanyId && c.role === currentRole)
    || companies.find(c => c.role === currentRole)
    || companies.find(c => c.id === currentCompanyId)
    || companies[0];

  const updateCompanyProfile = (companyId: string, updated: Partial<CompanyProfile>) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, ...updated } : c));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const togglePublishProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (sellerId: string, notes?: string): Order | null => {
    const seller = companies.find(c => c.id === sellerId);
    if (!seller) return null;

    // Filter items in cart that belong to sellerId
    const sellerItems = cart.filter(item => item.product.ownerId === sellerId);
    if (sellerItems.length === 0) return null;

    const orderItems = sellerItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPriceHT: item.product.priceHT,
      unitType: item.product.unitType,
      totalHT: Number((item.product.priceHT * item.quantity).toFixed(2)),
      vatRate: item.product.vatRate
    }));

    const totalHT = orderItems.reduce((acc, curr) => acc + curr.totalHT, 0);
    const totalTVA = Number((totalHT * 0.055).toFixed(2)); // Average 5.5% TVA agro
    const totalTTC = Number((totalHT + totalTVA).toFixed(2));

    const today = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + (seller.deliveryLeadDays || 2));

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: `CMD-${currentRole.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-5)}`,
      buyerId: currentCompany.id,
      buyerName: currentCompany.name,
      buyerRole: currentRole,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerRole: seller.role,
      items: orderItems,
      totalHT,
      totalTVA,
      totalTTC,
      status: 'en_attente',
      orderDate: today.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      expectedDeliveryDate: deliveryDate.toISOString().split('T')[0],
      deliveryAddress: `${currentCompany.address}, ${currentCompany.postalCode} ${currentCompany.city}`,
      notes,
      invoiceGenerated: true
    };

    // Update stocks
    setProducts(prev =>
      prev.map(p => {
        const orderItem = sellerItems.find(i => i.product.id === p.id);
        if (orderItem) {
          return {
            ...p,
            stockQuantity: Math.max(0, p.stockQuantity - orderItem.quantity)
          };
        }
        return p;
      })
    );

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Remove ordered items from cart
    setCart(prev => prev.filter(item => item.product.ownerId !== sellerId));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const getProductsForRole = () => {
    return products.filter(p => p.ownerId === currentCompany.id);
  };

  const getWholesalers = () => {
    return companies.filter(c => c.role === 'grossiste');
  };

  const getFactories = () => {
    return companies.filter(c => c.role === 'usine');
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      currentCompany,
      companies,
      products,
      orders,
      cart,
      selectCompany,
      updateCompanyProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      togglePublishProduct,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      getProductsForRole,
      getWholesalers,
      getFactories
    }}>
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
