import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UserPanel: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id);
      if (!error) setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Historial de pedidos</h2>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {orders.length === 0 ? <li>No hay pedidos.</li> : orders.map(order => (
            <li key={order.id} className="mb-2 p-2 border rounded">
              Pedido #{order.id} - Total: ${order.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPanel;
