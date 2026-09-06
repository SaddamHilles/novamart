import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../api';
import type { CartItem } from '../types';
import { useAuth } from './AuthContext';

type CartContextValue = {
  cart: CartItem[];
  count: number;
  subtotal: number;
  add: (productId: string, qty?: number) => Promise<void>;
  update: (productId: string, qty: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    api
      .get<{ cart: CartItem[] }>('/cart')
      .then(({ data }) => setCart(data.cart))
      .catch(() => setCart([]));
  }, [user]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cart.reduce((sum, item) => sum + item.qty, 0),
      subtotal: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      async add(productId, qty = 1) {
        const { data } = await api.post<{ cart: CartItem[] }>('/cart', { productId, qty });
        setCart(data.cart);
      },
      async update(productId, qty) {
        const { data } = await api.put<{ cart: CartItem[] }>(`/cart/${productId}`, { qty });
        setCart(data.cart);
      },
      async remove(productId) {
        const { data } = await api.delete<{ cart: CartItem[] }>(`/cart/${productId}`);
        setCart(data.cart);
      },
      clear() {
        setCart([]);
      },
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
