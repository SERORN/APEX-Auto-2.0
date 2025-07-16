import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import CatalogView from './pages/CatalogView';
import SignupView from './pages/SignupView';
import SupplierView from './pages/SupplierView';
import SignupLogin from './components/SignupLogin';

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
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/signup" element={<SignupLogin />} />
        <Route path="/login" element={<SignupLogin />} />
        <Route path="/proveedor" element={<SupplierView />} />
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
