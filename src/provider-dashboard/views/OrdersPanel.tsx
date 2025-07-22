
import React, { useState } from 'react';
import { useProviderOrders } from '../../hooks/useProviderOrders';
import { useNavigate } from 'react-router-dom';

const OrdersPanel: React.FC = () => {
  const { orders, loading, error, buttonLoading, markOrderAsShipped } = useProviderOrders();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleMarkAsShipped = async (orderId: string) => {
    try {
      await markOrderAsShipped(orderId);
      setToast({ type: 'success', message: '¡Pedido marcado como enviado!' });
    } catch (e: any) {
      setToast({ type: 'error', message: e.message || 'Error al actualizar el pedido.' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="p-8 text-center">Cargando órdenes...</div>;
  if (error) return (
    <div className="p-8 text-center text-red-600">
      {error}
      <button className="ml-4 underline text-blue-600" onClick={() => navigate('/login')}>Ir a login</button>
    </div>
  );

  if (!orders.length) {
    return <div className="p-8 text-center text-gray-500">No hay órdenes recibidas aún.</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded text-white font-semibold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
      )}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left"># Orden</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Productos</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const isShipped = order.status === 'enviado' || order.status === 'entregado';
            return (
              <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 font-mono">{order.id}</td>
                <td className="px-4 py-2">{new Date(order.date).toLocaleString()}</td>
                <td className="px-4 py-2 font-semibold text-green-700">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {order.order_items?.map(item => (
                      <li key={item.id}>
                        {item.products?.name || item.product_id} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 capitalize">{order.status}</td>
                <td className="px-4 py-2">
                  {!isShipped ? (
                    <button
                      className={`px-3 py-1 rounded text-sm font-semibold transition-colors w-full sm:w-auto ${buttonLoading[order.id] ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      onClick={() => handleMarkAsShipped(order.id)}
                      disabled={buttonLoading[order.id]}
                    >
                      {buttonLoading[order.id] ? 'Enviando...' : 'Marcar como enviado'}
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-500">Enviado</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPanel;
