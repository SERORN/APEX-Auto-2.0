import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

interface TopProduct {
  name: string;
  quantity: number;
  amount: number;
}

interface DailyIncome {
  date: string; // YYYY-MM-DD
  total: number;
}

interface ProviderAnalytics {
  totalIncome: number;
  totalOrders: number;
  topProducts: TopProduct[];
  dailyIncome: DailyIncome[];
}

export function useProviderAnalytics() {
  const [data, setData] = useState<ProviderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userError || !user) {
        setError('No autenticado.');
        setLoading(false);
        return;
      }
      const providerId = user.id;
      try {
        // Total ingresos y total pedidos
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, total, created_at')
          .eq('provider_id', providerId);
        if (ordersError) throw new Error(ordersError.message);
        const totalIncome = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const totalOrders = orders.length;

        // Top 5 productos más vendidos
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity, unit_price, products(name)')
          .in('order_id', orders.map((o: any) => o.id));
        if (itemsError) throw new Error(itemsError.message);
        const productMap: Record<string, TopProduct> = {};
        for (const item of orderItems) {
          const name = item.products?.name || 'Desconocido';
          if (!productMap[name]) {
            productMap[name] = { name, quantity: 0, amount: 0 };
          }
          productMap[name].quantity += item.quantity || 0;
          productMap[name].amount += (item.quantity || 0) * (item.unit_price || 0);
        }
        const topProducts = Object.values(productMap)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        // Ingresos por día últimos 30 días
        const now = new Date();
        const last30 = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (29 - i));
          return d.toISOString().slice(0, 10);
        });
        const dailyIncome: DailyIncome[] = last30.map(date => ({ date, total: 0 }));
        for (const o of orders) {
          const date = o.created_at?.slice(0, 10);
          const idx = dailyIncome.findIndex(d => d.date === date);
          if (idx !== -1) dailyIncome[idx].total += o.total || 0;
        }

        setData({ totalIncome, totalOrders, topProducts, dailyIncome });
      } catch (e: any) {
        setError(e.message || 'Error al obtener analíticas');
      }
      setLoading(false);
    }
    fetchAnalytics();
    return () => { ignore = true; };
  }, []);

  // TODO: agregar métricas de cancelaciones, tasa de conversión, ticket promedio, etc.

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
