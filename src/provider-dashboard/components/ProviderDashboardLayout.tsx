import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ProviderSidebar from './ProviderSidebar';
import { supabase } from '../../lib/supabaseClient';

const ProviderDashboardLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isProvider, setIsProvider] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) {
        navigate('/login', { replace: true });
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      if (profile?.role !== 'provider') {
        navigate('/', { replace: true });
        return;
      }
      setIsProvider(true);
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!isProvider) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderDashboardLayout;
