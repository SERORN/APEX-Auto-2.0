import React, { useEffect, useState } from 'react';
import { useSpecialQuotes } from '../hooks/useSpecialQuotes';
import { Download, FileText, CheckCircle, XCircle, UploadCloud } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Enum para tipos de operación
const OP_TYPES = {
  lease: 'Arrendamiento',
  finance: 'Financiamiento',
  bulk: 'Compra volumen',
};

const SpecialQuoteRequest: React.FC = () => {
  const {
    quotes,
    loading,
    error,
    markAttended,
    markRejected,
    respondQuote,
    exportQuote,
    uploadDocument,
    refresh,
  } = useSpecialQuotes();
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [response, setResponse] = useState('');
  const [amount, setAmount] = useState('');
  const [conditions, setConditions] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Validar rol proveedor (puedes mejorar con tu sistema de auth)
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) window.location.href = '/login';
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      if (profile?.role !== 'provider') window.location.href = '/';
    });
  }, []);

  const handleRespond = async (quoteId: string) => {
    if (!response || !amount) {
      showToast('Completa todos los campos de respuesta.', 'error');
      return;
    }
    await respondQuote(quoteId, { response, amount, conditions });
    setResponse('');
    setAmount('');
    setConditions('');
    setSelectedQuote(null);
  };

  const handleFileUpload = async (quoteId: string) => {
    if (!file) return;
    setUploading(true);
    await uploadDocument(quoteId, file);
    setUploading(false);
    setFile(null);
    refresh();
  };

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Solicitudes de Cotización Especial</h2>
      {loading ? (
        <div className="text-center py-8">Cargando solicitudes...</div>
      ) : error ? (
        <div className="text-red-600 font-semibold text-center py-8">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Comprador</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Productos</th>
                <th className="px-4 py-2 text-left">Cantidades</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q: any) => (
                <tr key={q.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{q.buyer_name}</td>
                  <td className="px-4 py-2">{q.buyer_email}</td>
                  <td className="px-4 py-2">{q.products?.map((p: any) => p.name).join(', ')}</td>
                  <td className="px-4 py-2">{q.products?.map((p: any) => p.qty).join(', ')}</td>
                  <td className="px-4 py-2">{q.created_at ? new Date(q.created_at).toLocaleString() : '--'}</td>
                  <td className="px-4 py-2">{OP_TYPES[q.op_type] || q.op_type}</td>
                  <td className="px-4 py-2">
                    {q.status === 'attended' ? (
                      <span className="text-green-700 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" />Atendida</span>
                    ) : q.status === 'rejected' ? (
                      <span className="text-red-600 font-semibold flex items-center gap-1"><XCircle className="w-4 h-4" />Rechazada</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Pendiente</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex flex-col gap-1">
                    {q.status === 'pending' && (
                      <>
                        <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1" onClick={() => markAttended(q.id)}><CheckCircle className="w-4 h-4" />Atender</button>
                        <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1" onClick={() => markRejected(q.id)}><XCircle className="w-4 h-4" />Rechazar</button>
                      </>
                    )}
                    <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1" onClick={() => setSelectedQuote(q)}><FileText className="w-4 h-4" />Responder</button>
                    <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 flex items-center gap-1" onClick={() => exportQuote(q)}><Download className="w-4 h-4" />Exportar</button>
                    <label className="flex items-center gap-1 cursor-pointer mt-1">
                      <UploadCloud className="w-4 h-4 text-blue-500" />
                      <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                      <span className="text-xs text-blue-700">Adjuntar PDF</span>
                    </label>
                    {file && (
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs mt-1" disabled={uploading} onClick={() => handleFileUpload(q.id)}>{uploading ? 'Subiendo...' : 'Subir PDF'}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal de respuesta */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Responder Cotización</h3>
            <div className="mb-2">Para: <span className="font-semibold">{selectedQuote.buyer_name} ({selectedQuote.buyer_email})</span></div>
            <textarea className="border p-2 rounded w-full mb-2" placeholder="Mensaje de respuesta" value={response} onChange={e => setResponse(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Monto / Precio" value={amount} onChange={e => setAmount(e.target.value)} />
            <input className="border p-2 rounded w-full mb-2" placeholder="Condiciones (opcional)" value={conditions} onChange={e => setConditions(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setSelectedQuote(null)}>Cancelar</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleRespond(selectedQuote.id)}>Enviar respuesta</button>
            </div>
          </div>
        </div>
      )}
      {/* TODO: Integrar con ERP o CFDI desde cotización aprobada */}
    </div>
  );
};

export default SpecialQuoteRequest;
