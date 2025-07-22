
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    products?: any;
  }>;
}

export const useProviderOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<{[orderId: string]: boolean}>({});

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('Debes iniciar sesión como proveedor.');
      setLoading(false);
      return;
    }
    const { data, error: ordersError } = await supabase
      .from('orders')
      .select('id, date, total, status, order_items(id, product_id, quantity, unit_price, products(*))')
      .eq('provider_id', user.id)
      .order('date', { ascending: false });
    if (ordersError) {
      setError(ordersError.message);
      setLoading(false);
      return;
    }
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Marcar como enviado
  const markOrderAsShipped = async (orderId: string) => {
    setButtonLoading(prev => ({ ...prev, [orderId]: true }));
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'enviado' })
      .eq('id', orderId);
    if (!updateError) {
      // Actualizar estado localmente para mejor UX
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'enviado' } : order));
    }
    setButtonLoading(prev => ({ ...prev, [orderId]: false }));
    if (updateError) throw new Error(updateError.message);
  };

  return { orders, loading, error, buttonLoading, markOrderAsShipped };
};
