import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Product, SelectedVehicle, View } from './types';
import { CartProvider } from './context/CartContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { supabase } from './lib/supabaseClient';

import LoginView from './components/LoginView';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ConfirmationView from './components/ConfirmationView';

import { PRODUCTS_DATA } from './data/products';

const AppContent: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<View>('home');

  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useSettings();

  const [session, setSession] = useState<any>(null);

  // Obtener sesión actual al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const filterProducts = useCallback(() => {
    let products = allProducts;

    // Filtrar por búsqueda
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      products = products.filter(p =>
        t(`${p.sku}_name`, p.name).toLowerCase().includes(lowercasedQuery) ||
        p.sku.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Filtrar por vehículo
    if (selectedVehicle) {
      products = products.filter(p => {
        if (p.compatibility.length === 0) return true; // universales
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

  const handleNavigate = (newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    const isPrivate = ['cart', 'checkout', 'confirmation'].includes(view);

    if (!session && isPrivate) {
      return (
        <div className="text-center py-20">
          <p className="text-xl font-semibold mb-4">Debes iniciar sesión para continuar con tu compra.</p>
          <button
            onClick={() => setView('login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </div>
      );
    }

    switch (view) {
      case 'login':
        return <LoginView />;
      case 'cart':
        return <CartView onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutView onNavigate={handleNavigate} />;
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
      <Header onNavigate={handleNavigate} />
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
  return (
    <SettingsProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </SettingsProvider>
  );
};

export default App;
