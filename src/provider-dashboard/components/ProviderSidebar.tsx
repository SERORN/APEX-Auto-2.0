import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ProviderSidebar: React.FC = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return;
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      setUserRole(profile?.role || null);
      if (profile?.role === 'provider') {
        const { count } = await supabase
          .from('special_quotes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        setPendingCount(count || 0);
      }
    });
  }, []);

  if (userRole !== 'provider') return null;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard/provider/analytics"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded transition font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`
          }
        >
          <BarChart3 className="w-5 h-5" />
          Estadísticas de Ventas
        </NavLink>
        <NavLink
          to="/dashboard/provider/special-quotes"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded transition font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`
          }
        >
          <FileText className="w-5 h-5" />
          Cotizaciones especiales
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">{pendingCount}</span>
          )}
        </NavLink>
        {/* TODO: Agregar más links de gestión */}
      </nav>
    </aside>
  );
};

export default ProviderSidebar;
