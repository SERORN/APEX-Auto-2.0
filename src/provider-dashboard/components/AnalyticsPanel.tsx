import React, { useRef } from 'react';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { useProviderAnalytics } from '../../hooks/useProviderAnalytics';

const currency = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const AnalyticsPanel: React.FC = () => {
  const { data, loading, error } = useProviderAnalytics();

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando analíticas...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!data) return <div className="p-8 text-center text-gray-400">No hay datos suficientes para mostrar analíticas.</div>;

  const chartRef = useRef<HTMLDivElement>(null);

  // Exportar CSV de ingresos diarios
  const handleExportCSV = () => {
    if (!data?.dailyIncome?.length) return;
    const csv = Papa.unparse([
      ['Fecha', 'Ingresos'],
      ...data.dailyIncome.map(d => [d.date, d.total])
    ]);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingresos_diarios.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSV exportado correctamente');
  };

  // Descargar gráfica como imagen
  const handleDownloadChart = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#fff', scale: 2 });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'grafica_ingresos.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Gráfica descargada como imagen');
    } catch {
      toast.error('Error al capturar la gráfica');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-7 h-7 text-brand-primary" /> Analíticas de ventas
      </h2>
      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-600 bg-green-100 rounded-full p-2" />
          <div>
            <div className="text-gray-500 text-sm">Total ingresos</div>
            <div className="text-2xl font-bold">{currency(data.totalIncome)}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <ShoppingBag className="w-10 h-10 text-blue-600 bg-blue-100 rounded-full p-2" />
          <div>
            <div className="text-gray-500 text-sm">Pedidos recibidos</div>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
          </div>
        </div>
      </div>
      {/* Top productos */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-x-auto">
        <div className="font-semibold mb-4 text-lg">Top 5 productos más vendidos</div>
        {data.topProducts.length === 0 ? (
          <div className="text-gray-400">No hay ventas registradas.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left">Producto</th>
                <th className="px-3 py-2 text-right">Unidades</th>
                <th className="px-3 py-2 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p, i) => (
                <tr key={p.name} className={i % 2 ? 'bg-gray-50' : ''}>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 text-right">{p.quantity}</td>
                  <td className="px-3 py-2 text-right">{currency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Gráfico de ingresos diarios y acciones */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="font-semibold text-lg">Ingresos diarios (últimos 30 días)</div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition text-sm"
            >Exportar CSV</button>
            <button
              onClick={handleDownloadChart}
              className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded font-semibold hover:bg-green-100 transition text-sm"
            >Descargar gráfica</button>
            {/* TODO: Exportar PDF, Excel, SVG */}
          </div>
        </div>
        {data.dailyIncome.length === 0 ? (
          <div className="text-gray-400">No hay datos de ingresos diarios.</div>
        ) : (
          <div ref={chartRef} className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.dailyIncome} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} fontSize={12} angle={-45} textAnchor="end" height={50} interval={4} />
                <YAxis tickFormatter={(n: number) => n > 0 ? currency(n) : ''} fontSize={12} width={80} />
                <Tooltip formatter={(v: number) => currency(Number(v))} labelFormatter={(d: string) => `Fecha: ${d}`} />
                <Bar dataKey="total" fill="#0D6EFD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {/* TODO: Exportar analíticas a CSV, filtrar por fechas, métricas avanzadas */}
    </div>
  );
};

export default AnalyticsPanel;
