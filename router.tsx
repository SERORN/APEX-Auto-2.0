
import { supabase } from './lib/supabaseClient';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
const ProviderDashboard = React.lazy(() => import('./provider-dashboard'));

function RequireProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!user || user.user_metadata?.role !== 'provider') {
    window.location.replace('/');
    return null;
  }
  return <>{children}</>;
}


const SpecialQuotesPage = React.lazy(() => import('./pages/dashboard/provider/special-quotes'));

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<HomeView />} />
      <Route path="/catalog" element={<CatalogView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/proveedor/dashboard" element={
        <Suspense fallback={<div className="p-8 text-center">Cargando dashboard...</div>}>
          <RequireProvider>
            <ProviderDashboard />
          </RequireProvider>
        </Suspense>
      } />
      <Route path="/dashboard/provider/special-quotes" element={
        <Suspense fallback={<div className="p-8 text-center">Cargando cotizaciones especiales...</div>}>
          <RequireProvider>
            <SpecialQuotesPage />
          </RequireProvider>
        </Suspense>
      } />
    </Routes>
  </Router>
);

export default AppRouter;
