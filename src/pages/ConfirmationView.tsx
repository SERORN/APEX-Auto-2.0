import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';

const ConfirmationView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, factura_url, emailSent, factura_email } = location.state || {};

  // Simulación de total (puedes pasar el total real por location.state)
  const total = location.state?.total || '---';

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-700">¡Gracias por tu compra!</h2>
      <div className="bg-gray-50 p-4 rounded mb-4">
        <div className="mb-2 text-lg font-semibold">Pedido confirmado</div>
        <div className="flex flex-col gap-2 items-center text-sm">
          <div><span className="font-medium">ID de pedido:</span> {orderId || '---'}</div>
          <div><span className="font-medium">Total pagado:</span> ${total}</div>
        </div>
      </div>
      {factura_url ? (
        <div className="mb-4">
          <a
            href={factura_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Descargar factura
          </a>
          <div className="text-xs text-gray-500 mt-2">Tu factura CFDI está lista.</div>
          {factura_url && factura_email && (
            <p className="text-green-600 mt-2">
              La factura también fue enviada a tu correo: <span className="font-medium">{factura_email}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4 text-gray-600">No se solicitó factura o aún no está disponible.</div>
      )}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full mt-2"
        onClick={() => navigate('/')}
      >
        Volver al inicio
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full mt-2"
        onClick={() => navigate('/catalog')}
      >
        Seguir comprando
      </button>
    </div>
  );
};

export default ConfirmationView;
