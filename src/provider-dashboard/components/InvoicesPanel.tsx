import React from 'react';
import { FileText } from 'lucide-react';
import { useProviderData } from '../useProviderData';

// TODO: Integrar subida real de CFDI y validación
// TODO: Mostrar lista de facturas por pedido

export const InvoicesPanel: React.FC = () => {
  const { provider, loading } = useProviderData();

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold">Facturas (CFDI)</h2>
      </div>
      {loading ? (
        <p>Cargando proveedor...</p>
      ) : (
        <div>
          <p className="mb-2">Sube tu CFDI por pedido (simulado):</p>
          <input type="file" accept=".xml,.pdf" className="mb-4" />
          <button className="bg-brand-primary text-white px-4 py-2 rounded">Subir factura</button>
        </div>
      )}
      {/* TODO: Listar facturas, asociar a pedidos, validación de archivos */}
    </div>
  );
};
