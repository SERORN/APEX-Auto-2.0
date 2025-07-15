import { supabase } from './lib/supabaseClient';

import React, { useState, useEffect, useCallback } from 'react';
import { Product, SelectedVehicle } from './types';
import { CartProvider } from './context/CartContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { PRODUCTS_DATA } from './data/products';

import Header from './components/Header';
import HomeView from './components/HomeView';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import UserPanel from './components/UserPanel';
import SupplierPanel from './components/SupplierPanel';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ConfirmationView from './components/ConfirmationView';

export type AppView = 'login' | 'signup' | 'user' | 'supplier' | 'home' | 'cart' | 'checkout' | 'confirmation';

interface AppContentProps {
  user: any;
  onLogout: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<AppView>('home');
  const [allProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useSettings();

  // Persistencia de carrito (hook base, integración real en CartContext)
  useEffect(() => {
    // TODO: Integrar con CartContext para persistir el carrito en localStorage
    // Ejemplo: localStorage.setItem('cart', JSON.stringify(cart));
  }, []);

  // Filtrado de productos
  const filterProducts = useCallback(() => {
    let products = allProducts;
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      products = products.filter(p =>
        t(`${p.sku}_name`, p.name).toLowerCase().includes(lowercasedQuery) ||
        p.sku.toLowerCase().includes(lowercasedQuery)
      );
    }
    if (selectedVehicle) {
      products = products.filter(p => {
        if (p.compatibility.length === 0) return true;
        return p.compatibility.some(comp =>
          comp.brand === selectedVehicle.brand &&
          comp.model === selectedVehicle.model &&
          comp.years.includes(parseInt(selectedVehicle.year, 10))
        );
      });
    }
    setFilteredProducts(products);
  }, [allProducts, searchQuery, selectedVehicle, t]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleNavigate = (newView: AppView) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  // Mensaje para rutas protegidas
  const requireAuth = (component: React.ReactNode) => {
    if (!user) {
      return <div className="text-center py-8 text-red-600">Debes iniciar sesión para acceder a esta sección.</div>;
    }
    return component;
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={() => setView('home')} />;
      case 'signup':
        return <SignupPage onSignup={() => setView('login')} />;
      case 'user':
        return requireAuth(<UserPanel />);
      case 'supplier':
        return requireAuth(<SupplierPanel />);
      case 'cart':
        return requireAuth(<CartView onNavigate={handleNavigate} />);
      case 'checkout':
        return requireAuth(<CheckoutView onNavigate={handleNavigate} />);
      case 'confirmation':
        return <ConfirmationView onNavigate={handleNavigate} />;
      case 'home':
      default:
        return (
          <HomeView
            products={filteredProducts}
            onVehicleSelect={setSelectedVehicle}
            selectedVehicle={selectedVehicle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-subtle font-sans flex flex-col">
      <Header onNavigate={handleNavigate} user={user} onLogout={onLogout} />
      <div className="flex-grow py-8 md:py-12">
        {renderView()}
      </div>
      <footer className="bg-background mt-auto py-8 border-t border-border-color">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
          <p>&copy; {new Date().getFullYear()} {t('copyright', 'Apex Auto. Todos los derechos reservados.')}</p>
          <p className="text-sm mt-1">{t('demo', 'Una demostración de e-commerce automotriz creada con React y Tailwind CSS.')}</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div className="text-center py-12">Cargando...</div>;

  return (
    <SettingsProvider>
      <CartProvider>
        <AppContent user={user} onLogout={handleLogout} />
      </CartProvider>
    </SettingsProvider>
  );
};

export default App;