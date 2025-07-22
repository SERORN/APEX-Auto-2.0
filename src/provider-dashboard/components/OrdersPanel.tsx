
import React, { useEffect, useState } from 'react';
import { Package, Loader2, CheckCircle, Truck, ClipboardCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { ShippingStatus } from '../../../types';
import { useProviderData } from '../useProviderData';

interface Order {
  id: string;
  cliente: string;
  estado: string;
  total: number;
  carrier?: string;
  tracking_number?: string;
  shipping_status: ShippingStatus;
  fecha_envio?: string;
  fecha_entrega?: string;
}

const ORDER_STATES = [
  ShippingStatus.Pendiente,
  ShippingStatus.EnTransito,
  ShippingStatus.Entregado,
  ShippingStatus.Cancelado,
];

export const OrdersPanel: React.FC = () => {
  const { provider, loading: loadingProvider } = useProviderData();
  const [filter, setFilter] = useState<ShippingStatus>(ShippingStatus.Pendiente);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editCarrier, setEditCarrier] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [actionLoading, setActionLoading] = useState<{[id: string]: boolean}>({});
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'}|null>(null);

  // Fetch real orders from Supabase
  useEffect(() => {
    if (!provider?.id) return;
    setLoading(true);
    supabase
      .from('orders')
      .select('*')
      .eq('provider_id', provider.id)
      .then(({ data, error }) => {
        if (!error) setOrders(data || []);
        setLoading(false);
      });
  }, [provider]);

  const filteredOrders = orders.filter(o => o.shipping_status === filter);

  // Toast simple
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Guardar edición de carrier/tracking
  const handleSave = async (order: Order) => {
    setActionLoading(l => ({ ...l, [order.id]: true }));
    const { error } = await supabase
      .from('orders')
      .update({ carrier: editCarrier, tracking_number: editTracking })
      .eq('id', order.id);
    if (!error) {
      setOrders(orders => orders.map(o => o.id === order.id ? { ...o, carrier: editCarrier, tracking_number: editTracking } : o));
      setToast({msg: 'Datos de envío actualizados.', type: 'success'});
      setEditOrderId(null);
    } else {
      setToast({msg: 'Error al actualizar.', type: 'error'});
    }
    setActionLoading(l => ({ ...l, [order.id]: false }));
  };

  // Cambiar estado de envío
  const updateShippingStatus = async (order: Order, status: ShippingStatus) => {
    setActionLoading(l => ({ ...l, [order.id]: true }));
    const update: any = { shipping_status: status };
    if (status === ShippingStatus.EnTransito) update.fecha_envio = new Date().toISOString();
    if (status === ShippingStatus.Entregado) update.fecha_entrega = new Date().toISOString();
    const { error } = await supabase.from('orders').update(update).eq('id', order.id);
    if (!error) {
      setOrders(orders => orders.map(o => o.id === order.id ? { ...o, ...update } : o));
      setToast({msg: 'Estado actualizado.', type: 'success'});
    } else {
      setToast({msg: 'Error al actualizar estado.', type: 'error'});
    }
    setActionLoading(l => ({ ...l, [order.id]: false }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold">Pedidos recibidos</h2>
      </div>
      <div className="mb-4 flex gap-2 flex-wrap">
        {ORDER_STATES.map(state => (
          <button
            key={state}
            className={`px-3 py-1 rounded ${filter === state ? 'bg-brand-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.msg}</div>
      )}
      {(loadingProvider || loading) ? (
        <p>Cargando pedidos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Cliente</th>
                <th className="px-2 py-1">Total</th>
                <th className="px-2 py-1">Estado envío</th>
                <th className="px-2 py-1">Carrier</th>
                <th className="px-2 py-1">Guía</th>
                <th className="px-2 py-1">F. envío</th>
                <th className="px-2 py-1">F. entrega</th>
                <th className="px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-gray-400 py-6">No hay pedidos en este estado.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-2 py-1">{order.id}</td>
                  <td className="px-2 py-1">{order.cliente}</td>
                  <td className="px-2 py-1">${order.total}</td>
                  <td className="px-2 py-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      order.shipping_status === ShippingStatus.Pendiente ? 'bg-yellow-100 text-yellow-800' :
                      order.shipping_status === ShippingStatus.EnTransito ? 'bg-blue-100 text-blue-800' :
                      order.shipping_status === ShippingStatus.Entregado ? 'bg-green-100 text-green-800' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {order.shipping_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    {editOrderId === order.id ? (
                      <input className="border p-1 rounded w-24" value={editCarrier} onChange={e => setEditCarrier(e.target.value)} />
                    ) : (
                      order.carrier || <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-1">
                    {editOrderId === order.id ? (
                      <input className="border p-1 rounded w-28" value={editTracking} onChange={e => setEditTracking(e.target.value)} />
                    ) : (
                      order.tracking_number || <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-1">{order.fecha_envio ? new Date(order.fecha_envio).toLocaleString() : '-'}</td>
                  <td className="px-2 py-1">{order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleString() : '-'}</td>
                  <td className="px-2 py-1 flex flex-col gap-1 min-w-[120px]">
                    {editOrderId === order.id ? (
                      <>
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs mb-1 hover:bg-blue-700 disabled:opacity-60"
                          disabled={actionLoading[order.id]}
                          onClick={() => handleSave(order)}
                        >
                          {actionLoading[order.id] ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Guardar'}
                        </button>
                        <button
                          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-400"
                          onClick={() => setEditOrderId(null)}
                        >Cancelar</button>
                      </>
                    ) : order.shipping_status === ShippingStatus.Pendiente ? (
                      <>
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mb-1 hover:bg-yellow-600 disabled:opacity-60"
                          onClick={() => {
                            setEditOrderId(order.id);
                            setEditCarrier(order.carrier || '');
                            setEditTracking(order.tracking_number || '');
                          }}
                        >Editar envío</button>
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs mb-1 hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1"
                          disabled={actionLoading[order.id]}
                          onClick={() => updateShippingStatus(order, ShippingStatus.EnTransito)}
                        >
                          {actionLoading[order.id] ? <Loader2 className="w-4 h-4 animate-spin inline" /> : <Truck className="w-4 h-4" />} En tránsito
                        </button>
                      </>
                    ) : order.shipping_status === ShippingStatus.EnTransito ? (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-60 flex items-center gap-1"
                        disabled={actionLoading[order.id]}
                        onClick={() => updateShippingStatus(order, ShippingStatus.Entregado)}
                      >
                        {actionLoading[order.id] ? <Loader2 className="w-4 h-4 animate-spin inline" /> : <ClipboardCheck className="w-4 h-4" />} Marcar entregado
                      </button>
                    ) : order.shipping_status === ShippingStatus.Entregado ? (
                      <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Entregado</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
