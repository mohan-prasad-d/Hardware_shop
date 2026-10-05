import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order, ColorTheme } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  
  // UI Dialogs
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  isRfqOpen: boolean;
  setIsRfqOpen: (open: boolean) => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;

  // 3D Customization & Control
  toolColor: ColorTheme;
  setToolColor: (color: ColorTheme) => void;
  worklightsOn: boolean;
  setWorklightsOn: (on: boolean) => void;
  explodeOverride: number; // -1 for auto scroll, 0 to 1 for manual
  setExplodeOverride: (val: number) => void;
  focusPart: string | null;
  setFocusPart: (part: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('forgepoint_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('FP-9824-X');
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // 3D Model Configuration
  const [toolColor, setToolColor] = useState<ColorTheme>('amber');
  const [worklightsOn, setWorklightsOn] = useState(true);
  const [explodeOverride, setExplodeOverride] = useState(-1);
  const [focusPart, setFocusPart] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('forgepoint_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category,
          specsSummary: product.torqueRating || product.rpm || product.warranty
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal === 0 ? 0 : subtotal > 150 ? 0 : 18.00;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        tax,
        shipping,
        total,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderId,
        setTrackingOrderId,
        isRfqOpen,
        setIsRfqOpen,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        toolColor,
        setToolColor,
        worklightsOn,
        setWorklightsOn,
        explodeOverride,
        setExplodeOverride,
        focusPart,
        setFocusPart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
