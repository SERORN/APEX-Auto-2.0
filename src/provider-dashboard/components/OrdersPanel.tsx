import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { useProviderData } from '../useProviderData';

// TODO: Integrar fetch real de pedidos desde Supabase
// TODO: Filtros avanzados por estado y fechas

const ORDER_STATES = ['pendiente', 'enviado', 'entregado', 'cancelado'];

export const OrdersPanel: React.FC = () => {
  const { provider, loading } = useProviderData();
  const [filter, setFilter] = useState<string>('pendiente');

  // Simulación de pedidos
  const orders = [
    { id: 1, cliente: 'Juan', estado: 'pendiente', total: 1200 },
    { id: 2, cliente: 'Ana', estado: 'enviado', total: 800 },
    { id: 3, cliente: 'Luis', estado: 'entregado', total: 1500 },
  ];

  const filteredOrders = orders.filter(o => o.estado === filter);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold">Pedidos recibidos</h2>
      </div>
      <div className="mb-4 flex gap-2">
        {ORDER_STATES.map(state => (
          <button
            key={state}
            className={`px-3 py-1 rounded ${filter === state ? 'bg-brand-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Cargando proveedor...</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Cliente</th>
              <th className="border px-2 py-1">Estado</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="border px-2 py-1">{order.id}</td>
                <td className="border px-2 py-1">{order.cliente}</td>
                <td className="border px-2 py-1">{order.estado}</td>
                <td className="border px-2 py-1">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* TODO: Agregar paginación, exportar pedidos, ver detalles */}
    </div>
  );
};
