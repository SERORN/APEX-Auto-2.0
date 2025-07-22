import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useSpecialQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('special_quotes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError('Error al obtener cotizaciones.');
    setQuotes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const markAttended = async (id: string) => {
    await supabase.from('special_quotes').update({ status: 'attended' }).eq('id', id);
    fetchQuotes();
  };
  const markRejected = async (id: string) => {
    await supabase.from('special_quotes').update({ status: 'rejected' }).eq('id', id);
    fetchQuotes();
  };
  const respondQuote = async (id: string, { response, amount, conditions }: { response: string, amount: string, conditions?: string }) => {
    await supabase.from('special_quotes').update({ response, amount, conditions, status: 'attended' }).eq('id', id);
    fetchQuotes();
  };
  const exportQuote = (quote: any) => {
    // Exportar a CSV (puedes mejorar a PDF con una lib externa)
    const csv = [
      ['Comprador', 'Correo', 'Productos', 'Cantidades', 'Fecha', 'Tipo', 'Mensaje', 'Monto', 'Condiciones'],
      [
        quote.buyer_name,
        quote.buyer_email,
        quote.products?.map((p: any) => p.name).join(', '),
        quote.products?.map((p: any) => p.qty).join(', '),
        quote.created_at,
        quote.op_type,
        quote.response || '',
        quote.amount || '',
        quote.conditions || '',
      ],
    ];
    const csvStr = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cotizacion_${quote.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const uploadDocument = async (quoteId: string, file: File) => {
    const { error } = await supabase.storage.from('quote-documents').upload(`${quoteId}/${file.name}`, file, { upsert: true });
    if (error) alert('Error al subir PDF');
  };
  const refresh = fetchQuotes;

  return {
    quotes,
    loading,
    error,
    markAttended,
    markRejected,
    respondQuote,
    exportQuote,
    uploadDocument,
    refresh,
  };
}
