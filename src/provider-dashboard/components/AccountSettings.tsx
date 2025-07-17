import React from 'react';
import { Settings } from 'lucide-react';
import { useProviderData } from '../useProviderData';

// TODO: Integrar edición real de datos del proveedor
// TODO: Validar campos y guardar en Supabase

export const AccountSettings: React.FC = () => {
  const { provider, loading } = useProviderData();

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold">Configuración de cuenta</h2>
      </div>
      {loading ? (
        <p>Cargando proveedor...</p>
      ) : (
        <form className="space-y-4 max-w-md">
          <div>
            <label className="block font-semibold">Nombre comercial</label>
            <input type="text" defaultValue={provider?.nombreComercial} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-semibold">RFC</label>
            <input type="text" defaultValue={provider?.rfc} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input type="email" defaultValue={provider?.email} className="w-full border rounded p-2" />
          </div>
          <button className="bg-brand-primary text-white px-4 py-2 rounded">Guardar cambios</button>
        </form>
      )}
      {/* TODO: Validar y guardar cambios, agregar más campos */}
    </div>
  );
};
