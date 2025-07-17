import React, { useState } from 'react';
import { Link2 } from 'lucide-react';
import { useProviderData } from '../useProviderData';

// TODO: Integrar conexión real con ERP/CRM
// TODO: Validar URL y guardar en Supabase

export const ERPIntegration: React.FC = () => {
  const { provider, loading } = useProviderData();
  const [url, setUrl] = useState('');

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold">Integración ERP/CRM</h2>
      </div>
      {loading ? (
        <p>Cargando proveedor...</p>
      ) : (
        <div className="space-y-4 max-w-md">
          <label className="block font-semibold">URL de integración (simulado)</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="https://mi-erp.com/api"
          />
          <button className="bg-brand-primary text-white px-4 py-2 rounded">Conectar ERP</button>
        </div>
      )}
      {/* TODO: Validar y guardar URL, mostrar estado de integración */}
    </div>
  );
};
