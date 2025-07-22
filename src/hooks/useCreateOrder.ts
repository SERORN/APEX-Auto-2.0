import { supabase } from '../lib/supabaseClient';
import { CartItem } from '../../types';

export interface OrderItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderInput {
  user_id: string;
  items: OrderItemInput[];
  total: number;
}

export interface CreateOrderResult {
  orderId: string;
  error?: string;
}

export const useCreateOrder = () => {
  const createOrder = async ({ user_id, items, total }: CreateOrderInput): Promise<CreateOrderResult> => {
    try {
      // 1. Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          { user_id, date: new Date().toISOString(), total, status: 'pendiente' },
        ])
        .select()
        .single();
      if (orderError || !order) return { orderId: '', error: orderError?.message || 'No se pudo crear la orden' };
      // 2. Insert order_items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) return { orderId: '', error: itemsError.message };
      return { orderId: order.id, error: undefined };
    } catch (e: any) {
      return { orderId: '', error: e.message };
    }
  };
  return { createOrder };
};
