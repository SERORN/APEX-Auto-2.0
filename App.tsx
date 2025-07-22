
import UserOrdersView from './pages/UserOrdersView';
import CartPage from './pages/CartPage';
import React, { Suspense } from 'react';
import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import CatalogView from './pages/CatalogView';
import SignupView from './pages/SignupView';
import SupplierView from './pages/SupplierView';
import SignupLogin from './components/SignupLogin';
import CheckoutView from './pages/CheckoutView';
import ConfirmationView from './pages/ConfirmationView';
import ProviderDashboardLayout from './provider-dashboard/components/ProviderDashboardLayout';
import ProductManager from './provider-dashboard/components/ProductManager';
import { OrdersPanel } from './provider-dashboard/components/OrdersPanel';

const AnalyticsPanel = React.lazy(() => import('./provider-dashboard/components/AnalyticsPanel'));
const SpecialQuoteRequest = React.lazy(() => import('./provider-dashboard/components/SpecialQuoteRequest'));

const App = () => {
  return (
    <>
      <header className="bg-black text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-widest hover:opacity-80 transition">APX</Link>
          <nav className="space-x-6">
            <a href="#features" className="hover:text-gray-300">Características</a>
            <Link to="/catalog" className="hover:text-gray-300">Catálogo</Link>
            <Link to="/signup" className="hover:text-gray-300">Crear cuenta</Link>
            <Link to="/proveedor" className="hover:text-gray-300">Proveedores</Link>
            {/* Panel del Proveedor solo si el usuario es proveedor */}
            {window.localStorage.getItem('user_role') === 'provider' && (
              <Link to="/proveedor/dashboard" className="hover:text-brand-primary font-semibold">Panel del Proveedor</Link>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/mis-pedidos" element={<UserOrdersView />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/signup" element={<SignupLogin />} />
        <Route path="/login" element={<SignupLogin />} />
        <Route path="/proveedor" element={<SupplierView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/confirmation" element={<ConfirmationView />} />
        <Route path="/carrito" element={<CartPage />} />
        {/* Provider dashboard layout and protected routes */}
        <Route path="/dashboard/provider" element={<ProviderDashboardLayout />}>
          <Route index element={<div className="p-8 text-center text-xl">Bienvenido al panel de proveedor</div>} />
          <Route path="productos" element={<ProductManager />} />
          <Route path="ordenes" element={<OrdersPanel />} />
          <Route path="analytics" element={
            <Suspense fallback={<div className="p-8 text-center">Cargando estadísticas...</div>}>
              <AnalyticsPanel />
            </Suspense>
          } />
          <Route path="special-quotes" element={
            <Suspense fallback={<div className="p-8 text-center">Cargando cotizaciones especiales...</div>}>
              <SpecialQuoteRequest />
            </Suspense>
          } />
        </Route>
        <Route
          path="/"
          element={
            <main className="container mx-auto px-4 py-20 text-center">
              <h2 className="text-4xl font-extrabold mb-4">La nueva forma de comprar autopartes</h2>
              <p className="text-lg mb-6">Directo de proveedores y distribuidores. Sin intermediarios. 100% online.</p>
              <Link to="/catalog" className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition">
                Explorar catálogo
              </Link>
            </main>
          }
        />
      </Routes>
    </>
  );
};

export default App;
