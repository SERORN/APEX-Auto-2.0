import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Product, CartItem } from '../../types';

interface UseCartResult {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (item: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}


export function useCart(): UseCartResult {
  // ...implementación completa en el siguiente paso...
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Utilidades localStorage
  const loadLocal = () => {
    try {
      const data = localStorage.getItem('apx_cart');
      return data ? JSON.parse(data) as CartItem[] : [];
    } catch {
      return [];
    }
  };
  const saveLocal = (items: CartItem[]) => {
    try { localStorage.setItem('apx_cart', JSON.stringify(items)); } catch {}
  };
  const clearLocal = () => {
    try { localStorage.removeItem('apx_cart'); } catch {}
  };

  // Cargar usuario y carrito al iniciar
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    supabase.auth.getUser().then(async ({ data }) => {
      if (ignore) return;
      const user = data?.user;
      setUserId(user?.id || null);
      if (user?.id) {
        // Usuario autenticado: cargar de Supabase
        const { data: dbCart } = await supabase
          .from('persistent_cart')
          .select('items')
          .eq('user_id', user.id)
          .single();
        if (dbCart?.items) {
          setCart(dbCart.items);
        } else {
          // Si no hay carrito remoto, sube el local si existe
          const local = loadLocal();
          if (local.length) {
            await supabase.from('persistent_cart').upsert({ user_id: user.id, items: local });
            setCart(local);
            clearLocal();
          } else {
            setCart([]);
          }
        }
      } else {
        // Invitado: cargar de localStorage
        setCart(loadLocal());
      }
      setLoading(false);
    });
    return () => { ignore = true; };
    // eslint-disable-next-line
  }, []);

  // Reactividad a cambios de sesión
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id);
        // Fusionar carrito local con remoto
        const { data: dbCart } = await supabase
          .from('persistent_cart')
          .select('items')
          .eq('user_id', session.user.id)
          .single();
        const local = loadLocal();
        let merged: CartItem[] = [];
        if (dbCart?.items) {
          // Fusionar: sumar cantidades de productos repetidos
          const map = new Map<string, CartItem>();
          dbCart.items.forEach((item: CartItem) => map.set(String(item.id), { ...item }));
          local.forEach((item: CartItem) => {
            if (map.has(String(item.id))) {
              map.get(String(item.id))!.quantity += item.quantity;
            } else {
              map.set(String(item.id), { ...item });
            }
          });
          merged = Array.from(map.values());
        } else {
          merged = local;
        }
        await supabase.from('persistent_cart').upsert({ user_id: session.user.id, items: merged });
        setCart(merged);
        clearLocal();
      }
      if (event === 'SIGNED_OUT') {
        setUserId(null);
        setCart([]);
        clearLocal();
      }
    });
    return () => { listener?.subscription.unsubscribe(); };
    // eslint-disable-next-line
  }, []);

  // Guardar cambios en Supabase o localStorage
  useEffect(() => {
    if (loading) return;
    if (userId) {
      supabase.from('persistent_cart').upsert({ user_id: userId, items: cart });
    } else {
      saveLocal(cart);
    }
    // eslint-disable-next-line
  }, [cart, userId]);

  // API

  const addToCart = useCallback((product: Product, qty: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => String(i.id) === String(product.id));
      if (idx >= 0) {
        // Ya existe, suma cantidad
        const updated = [...prev];
        updated[idx].quantity += qty;
        return updated;
      }
      return [...prev, { ...product, id: String(product.id), quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => String(i.id) !== String(productId)));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setCart(prev => prev.map(i => String(i.id) === String(productId) ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Selectores
  // ...
  const getItemCount = useCallback(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const getTotal = useCallback(() => cart.reduce((sum, i) => sum + i.quantity * i.price, 0), [cart]);

  return {
    cartItems: cart,
    totalQuantity: getItemCount(),
    totalPrice: getTotal(),
    isLoading: loading,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
