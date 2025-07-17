import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useProviderData } from '../useProviderData';

// TODO: Integrar métricas reales desde Supabase
// TODO: Filtros por rango de fechas, exportar datos

export const AnalyticsPanel: React.FC = () => {
  const { provider, loading } = useProviderData();

  // Simulación de métricas
  const metrics = {
    totalVentas: 35000,
    productosVendidos: 120,
    productoTop: 'Filtro de Aceite',
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold">Analytics</h2>
      </div>
      {loading ? (
        <p>Cargando proveedor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <div className="font-bold text-lg">${metrics.totalVentas}</div>
            <div>Total ventas</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <div className="font-bold text-lg">{metrics.productosVendidos}</div>
            <div>Productos vendidos</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <div className="font-bold text-lg">{metrics.productoTop}</div>
            <div>Más vendido</div>
          </div>
        </div>
      )}
      {/* TODO: Gráficas, exportar métricas, filtros avanzados */}
    </div>
  );
};
