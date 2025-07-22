
import { useCreateOrder } from './useCreateOrder';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useCartToOrder = () => {
  const { state, dispatch } = useCart();
  const { createOrder } = useCreateOrder();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Validar si hay productos agotados
  const hasOutOfStock = state.items.some(item => item.stock <= 0);
  const canCheckout = state.items.length > 0 && !hasOutOfStock;

  const checkout = async () => {
    setError(null);
    // Validar sesión activa
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      navigate('/login');
      return;
    }
    if (state.items.length === 0) {
      setError('El carrito está vacío.');
      return;
    }
    if (hasOutOfStock) {
      setError('Hay productos agotados.');
      return;
    }
    setLoading(true);
    const items = state.items.map(item => ({
      product_id: String(item.id),
      quantity: item.quantity,
      unit_price: item.price,
    }));
    const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = await createOrder({ user_id: user.id, items, total });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setOrderId(result.orderId);
    dispatch({ type: 'CLEAR_CART' });
  };

  return { checkout, canCheckout, loading, error, orderId };
};
