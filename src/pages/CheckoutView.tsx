import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';

// Opciones de uso CFDI
const usoCfdiOptions = [
  { code: 'G03', label: 'Gastos en general' },
  { code: 'P01', label: 'Por definir' },
  { code: 'D01', label: 'Honorarios médicos' },
  { code: 'D02', label: 'Gastos funerales' },
  { code: 'D03', label: 'Donativos' },
];

// Simulación de carrito
const mockCart = [
  { id: '1', name: 'Producto A', sku: 'A123', price: 100, quantity: 2 },
  { id: '2', name: 'Producto B', sku: 'B456', price: 200, quantity: 1 },
];

const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const [cart] = useState(mockCart);
  const [solicitaFactura, setSolicitaFactura] = useState(false);
  const [rfc, setRfc] = useState('');
  const [nombre, setNombre] = useState('');
  const [usoCfdi, setUsoCfdi] = useState('G03');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facturaUrl, setFacturaUrl] = useState<string | null>(null);

  // Toast simple
  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
  }

  // Validación RFC SAT
  function isValidRFC(rfc: string) {
    return /^[A-Z&Ññ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc) && (rfc.length === 12 || rfc.length === 13);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validaciones
    if (cart.length === 0) return setError('El carrito está vacío.');
    if (solicitaFactura) {
      if (!isValidRFC(rfc)) return setError('RFC inválido. Debe tener 12 o 13 caracteres y cumplir formato SAT.');
      if (!nombre) return setError('El nombre o razón social es obligatorio.');
      if (!usoCfdi) return setError('El uso de CFDI es obligatorio.');
    }
    setLoading(true);
    try {
      // Paso 4: Crear orden (simulada)
      const orderId = Math.floor(Math.random() * 1000000).toString();
      let factura_url = null;
      let factura_email = null;
      // Paso 5: Si se solicitó factura, llamar a /api/facturar
      if (solicitaFactura) {
        const resp = await fetch('/api/facturar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            cart,
            fiscal: { rfc, name: nombre, usoCfdi }
          })
        });
        const data = await resp.json();
        if (resp.ok && data.factura_url) {
          factura_url = data.factura_url;
          factura_email = data.factura_email || data.email || null;
          setFacturaUrl(factura_url);
          showToast('Factura generada con éxito.', 'success');
        } else {
          showToast(data.error || 'Error al generar factura.', 'error');
        }
      }
      // Paso 7: Redirigir a ConfirmationView con factura_url y factura_email
      setTimeout(() => {
        navigate('/confirmation', { state: { orderId, factura_url, factura_email } });
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error inesperado.');
      showToast('Error inesperado.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Resumen de pedido</h3>
          <ul className="text-sm">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between py-1">
                <span>{item.name} <span className="text-gray-400">({item.sku})</span> x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="font-bold text-right mt-2">Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</div>
        </div>
        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={solicitaFactura} onChange={e => setSolicitaFactura(e.target.checked)} className="accent-blue-600" />
          <span className="font-medium">Solicitar factura CFDI</span>
        </label>
        {solicitaFactura && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50 p-4 rounded">
            <input
              className="border p-2 rounded"
              placeholder="RFC del receptor"
              value={rfc}
              onChange={e => setRfc(e.target.value.toUpperCase())}
              maxLength={13}
            />
            <input
              className="border p-2 rounded"
              placeholder="Razón social o nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={usoCfdi}
              onChange={e => setUsoCfdi(e.target.value)}
            >
              {usoCfdiOptions.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? <span className="animate-pulse">Procesando...</span> : 'Confirmar pedido'}
        </button>
        {facturaUrl && (
          <div className="mt-4 flex items-center gap-2">
            <a href={facturaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold flex items-center gap-1">
              <Download className="w-4 h-4" /> Descargar factura
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutView;
