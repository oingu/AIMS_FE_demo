import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Product } from '../types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleItemSelection: (productId: string) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getSelectedItems: () => CartItem[];
  getSelectedTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('aims_cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return { items: [], totalPrice: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aims_cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      return total + item.product.currentPrice * item.quantity;
    }, 0);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity, selected: true }];
      }

      return {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product.id !== productId
      );
      return {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
      };
    });
  };

  const toggleItemSelection = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId
          ? { ...item, selected: !item.selected }
          : item
      );
      return {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
      };
    });
  };

  const selectAllItems = (selected: boolean) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => ({
        ...item,
        selected,
      }));
      return {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
  };

  const getCartItemsCount = (): number => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSelectedItems = (): CartItem[] => {
    return cart.items.filter((item) => item.selected);
  };

  const getSelectedTotal = (): number => {
    return cart.items
      .filter((item) => item.selected)
      .reduce((total, item) => {
        return total + item.product.currentPrice * item.quantity;
      }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        selectAllItems,
        clearCart,
        getCartItemsCount,
        getSelectedItems,
        getSelectedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

