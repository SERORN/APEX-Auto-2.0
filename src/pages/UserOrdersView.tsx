// Crea un nuevo componente llamado UserOrdersView.tsx en la carpeta pages.
// Este componente debe hacer lo siguiente:
//
// 1. Usar el hook useSession o equivalente para obtener el ID o email del usuario actual autenticado.
// 2. Consultar la tabla 'orders' en Supabase para obtener los pedidos de ese usuario.
// 3. Mostrar en una tabla o lista responsiva:
//    - ID del pedido
//    - Fecha de creación (formateada)
//    - Total pagado
//    - Estado del pedido
//    - Un botón "Descargar factura" si 'factura_url' está disponible
// 4. Mostrar mensaje si no hay pedidos.
// 5. Usar TailwindCSS para estilo limpio y responsive.
// 6. Incluir loading, manejo de errores y feedback visual con toasts si es posible.
// 7. Agregar esta nueva vista como una ruta en App.tsx con path '/mis-pedidos'.
// 8. Dejar un TODO para permitir reordenar productos desde aquí en el futuro.
//
// BONUS: Mostrar el email del usuario autenticado en la parte superior con estilo amigable.


import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Download, RefreshCcw, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { ShippingStatus } from '../../types';

const UserOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [resending, setResending] = useState<{ [orderId: string]: boolean }>({});
  const [resentMsg, setResentMsg] = useState<{ [orderId: string]: string }>({});

  // Toast simple
  // TODO: Unificar sistema de toasts en toda la app si es necesario
  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') toast.success(msg);
    else toast.error(msg);
  }

  // Reenviar factura CFDI
  // Reenviar CFDI solo si no se ha reenviado en esta sesión
  const handleResendFactura = async (order: any) => {
    if (resentMsg[order.id]) return; // No repetir mensaje
    setResending(prev => ({ ...prev, [order.id]: true }));
    setResentMsg(prev => ({ ...prev, [order.id]: '' }));
    try {
      const res = await fetch('/api/facturar/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Si usas JWT, agrega aquí: 'Authorization': 'Bearer ...'
        },
        body: JSON.stringify({ orderId: order.id })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Factura reenviada a: ${data.email}`, 'success');
        setResentMsg(prev => ({ ...prev, [order.id]: `Factura reenviada a: ${data.email}` }));
      } else {
        showToast(data.error || 'Error al reenviar factura.', 'error');
      }
    } catch (err) {
      showToast('Error de red al reenviar factura.', 'error');
    }
    setResending(prev => ({ ...prev, [order.id]: false }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      // Obtener usuario autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('No se pudo obtener el usuario.');
        setLoading(false);
        return;
      }
      setUserEmail(user.email || null);
      // Consultar pedidos del usuario
      const { data, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });
      if (ordersError) {
        setError('Error al obtener pedidos.');
        setLoading(false);
        return;
      }
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mis pedidos</h2>
      {userEmail && (
        <div className="mb-4 text-blue-700 bg-blue-50 rounded px-4 py-2 text-sm">
          Sesión: <span className="font-semibold">{userEmail}</span>
        </div>
      )}
      {loading ? (
        <div className="text-center py-8">Cargando pedidos...</div>
      ) : error ? (
        <div className="text-red-600 font-semibold text-center py-8">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No tienes pedidos registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 text-left">ID</th>
                <th className="px-2 py-1 text-left">Fecha</th>
                <th className="px-2 py-1 text-left">Total</th>
                <th className="px-2 py-1 text-left">Estado envío</th>
                <th className="px-2 py-1 text-left">Carrier</th>
                <th className="px-2 py-1 text-left">Guía</th>
                <th className="px-2 py-1 text-left">F. envío</th>
                <th className="px-2 py-1 text-left">F. entrega</th>
                <th className="px-2 py-1 text-left">Factura</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-2 py-1">{order.id}</td>
                  <td className="px-2 py-1">{order.created_at ? new Date(order.created_at).toLocaleString() : '--'}</td>
                  <td className="px-2 py-1">${order.total || '--'}</td>
                  <td className="px-2 py-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      order.shipping_status === ShippingStatus.Pendiente ? 'bg-yellow-100 text-yellow-800' :
                      order.shipping_status === ShippingStatus.EnTransito ? 'bg-blue-100 text-blue-800' :
                      order.shipping_status === ShippingStatus.Entregado ? 'bg-green-100 text-green-800' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {order.shipping_status ? order.shipping_status.replace('_', ' ') : 'pendiente'}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    {order.carrier ? (
                      <span className="font-medium">{order.carrier}</span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-2 py-1">
                    {order.tracking_number && order.carrier ? (
                      <a
                        href={getTrackingUrl(order.carrier, order.tracking_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        {order.tracking_number} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : order.tracking_number ? (
                      <span>{order.tracking_number}</span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-2 py-1">{order.fecha_envio ? new Date(order.fecha_envio).toLocaleString() : '-'}</td>
                  <td className="px-2 py-1">{order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleString() : '-'}</td>
                  <td className="px-2 py-1">
                    {order.factura_url ? (
                      <div className="flex flex-col gap-1">
                        <a
                          href={order.factura_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                          onClick={() => showToast('Descargando factura...', 'success')}
                        >
                          <Download className="w-4 h-4" /> Descargar factura
                        </a>
                        {order.factura_uuid && order.factura_url && !resentMsg[order.id] && (
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-blue-100 text-blue-700 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            disabled={!!resending[order.id]}
                            onClick={() => handleResendFactura(order)}
                            aria-label="Reenviar factura CFDI"
                          >
                            {resending[order.id] ? (
                              <span className="flex items-center gap-1 animate-pulse"><RefreshCcw className="w-4 h-4 animate-spin" /> Enviando...</span>
                            ) : (
                              <>
                                <RefreshCcw className="w-4 h-4" /> Reenviar factura
                              </>
                            )}
                          </button>
                        )}
                        {resentMsg[order.id] && (
                          <div className="text-green-700 text-xs mt-1">{resentMsg[order.id]}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* TODO: Permitir reordenar productos desde aquí en el futuro */}
    </div>
  );

// Utilidad para generar enlace de rastreo según carrier
function getTrackingUrl(carrier: string, tracking: string) {
  const c = carrier.toLowerCase();
  if (c.includes('fedex')) return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`;
  if (c.includes('dhl')) return `https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=${tracking}`;
  if (c.includes('estafeta')) return `https://www.estafeta.com/Herramientas/Rastreo?guias=${tracking}`;
  if (c.includes('ups')) return `https://www.ups.com/track?loc=es_MX&tracknum=${tracking}`;
  if (c.includes('redpack')) return `https://www.redpack.com.mx/rastreo-de-envios/?guia=${tracking}`;
  if (c.includes('99 minutos') || c.includes('99minutos')) return `https://www.99minutos.com/track?tracking_number=${tracking}`;
  // Default: Google search
  return `https://www.google.com/search?q=${encodeURIComponent(carrier + ' ' + tracking)}`;
}
};

export default UserOrdersView;
