import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="bg-black text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-widest">APX</h1>
          <nav className="space-x-6">
            <a href="#features" className="hover:text-gray-300">Características</a>
            <Link to="/catalog" className="hover:text-gray-300">Catálogo</Link>
            <Link to="/signup" className="hover:text-gray-300">Crear cuenta</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-4">La nueva forma de comprar autopartes</h2>
        <p className="text-lg mb-6">Directo de proveedores y distribuidores. Sin intermediarios. 100% online.</p>
        <Link to="/catalog" className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition">Explorar catálogo</Link>
      </main>

      <section id="features" className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-10 text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2">Distribuidores verificados</h3>
            <p>Confiamos solo en empresas serias y con stock actualizado.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Compra segura</h3>
            <p>Pagos protegidos y factura instantánea (CFDI) con validación oficial.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Precios competitivos</h3>
            <p>Transparencia en costos y márgenes bajos.</p>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Catálogo completo</h3>
        <p className="mb-6">Explora por marca, modelo o tipo de refacción.</p>
        <Link to="/catalog" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">Ir al catálogo</Link>
      </section>

      <section id="signup" className="bg-gray-200 py-16 text-center">
        <h3 className="text-2xl font-bold mb-4">¿Eres distribuidor?</h3>
        <p className="mb-6">Publica tus productos, recibe cotizaciones, vende al instante.</p>
        <Link to="/signup" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">Registrarse</Link>
      </section>

      <footer className="bg-black text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} Apex Auto · Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default App;
