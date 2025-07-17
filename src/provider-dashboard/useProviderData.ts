import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export interface ProviderData {
  id: string;
  nombreComercial: string;
  rfc: string;
  email: string;
  // TODO: Agregar más campos relevantes del proveedor
}

export function useProviderData() {
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Reemplazar con fetch real a Supabase
    // Ejemplo:
    // supabase.from('providers').select('*').eq('id', user.id)
    setTimeout(() => {
      setProvider({
        id: 'demo-provider',
        nombreComercial: 'Mi Refaccionaria',
        rfc: 'XAXX010101000',
        email: 'proveedor@demo.com',
      });
      setLoading(false);
    }, 500);
  }, []);

  return { provider, loading };
}
