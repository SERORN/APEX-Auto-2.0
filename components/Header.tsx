
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ShoppingCartIcon, UserIcon } from './icons';
import CartWidget from './CartWidget';
import { Language, Currency } from '../types';

import { View } from '../types';
interface HeaderProps {
  onNavigate: (view: View) => void;
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLogout }) => {
  const { state } = useCart();
  const { language, setLanguage, currency, setCurrency, t } = useSettings();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const LanguageButton = ({ lang, label }: { lang: Language, label: string }) => (
    <button
      onClick={() => setLanguage(lang)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${language === lang ? 'bg-blue-100 text-brand-primary font-semibold' : 'text-text-secondary hover:bg-gray-100'}`}
      aria-pressed={language === lang}
      aria-label={t('cambiar_idioma', `Cambiar idioma a ${label}`)}
      tabIndex={0}
    >
      {label}
    </button>
  );

  const CurrencyButton = ({ curr, label }: { curr: Currency, label: string }) => (
    <button
      onClick={() => setCurrency(curr)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${currency === curr ? 'bg-blue-100 text-brand-primary font-semibold' : 'text-text-secondary hover:bg-gray-100'}`}
      aria-pressed={currency === curr}
      aria-label={t('cambiar_moneda', `Cambiar moneda a ${label}`)}
      tabIndex={0}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-background shadow-md sticky top-0 z-50" role="banner" aria-label={t('header', 'Barra de navegación principal')}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-black text-text-primary tracking-tighter hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded-md flex items-center"
            aria-label={t('ir_inicio', 'Ir a la página de inicio')}
          >
            AP<span className="text-brand-primary">X</span>
          </Link>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Mis pedidos link for authenticated users (desktop) */}
            {user && (
              <Link
                to="/mis-pedidos"
                className="text-text-secondary hover:text-brand-primary font-medium transition-colors duration-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B6CB0]"
                aria-label={t('mis_pedidos', 'Ver mis pedidos')}
              >
                {t('mis_pedidos', 'Mis pedidos')}
              </Link>
            )}
            <div className="hidden md:flex items-center gap-1 bg-subtle p-1 rounded-lg">
              <LanguageButton lang="es" label="ES" />
              <LanguageButton lang="en" label="EN" />
            </div>
            <div className="hidden md:flex items-center gap-1 bg-subtle p-1 rounded-lg">
              <CurrencyButton curr="mxn" label="MXN" />
              <CurrencyButton curr="usd" label="USD" />
            </div>

            {user ? (
              <button
                className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded-md"
                onClick={onLogout}
                aria-label={t('logout', 'Cerrar sesión')}
              >
                <UserIcon className="h-6 w-6" />
                <span className="hidden md:block">{t('logout', 'Cerrar sesión')}</span>
              </button>
            ) : (
              <button
                className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded-md"
                onClick={() => onNavigate('login')}
                aria-label={t('mi_cuenta', 'Mi Cuenta')}
              >
                <UserIcon className="h-6 w-6" />
                <span className="hidden md:block">{t('mi_cuenta', 'Mi Cuenta')}</span>
              </button>
            )}
            <CartWidget />
          </div>
        </div>
         {/* Mobile settings */}
         <div className="md:hidden flex flex-col items-center gap-4 pb-3">
            {/* Mis pedidos link for authenticated users (mobile) */}
            {user && (
              <Link to="/mis-pedidos" className="mt-2 block text-text-secondary font-semibold text-center px-4 py-2 rounded hover:bg-blue-100 transition">
                {t('mis_pedidos', 'Mis pedidos')}
              </Link>
            )}
            <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg">
              <LanguageButton lang="es" label="ES" />
              <LanguageButton lang="en" label="EN" />
            </div>
            <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg">
              <CurrencyButton curr="mxn" label="MXN" />
              <CurrencyButton curr="usd" label="USD" />
            </div>
            {/* Panel del Proveedor solo si el usuario es proveedor */}
            {window.localStorage.getItem('user_role') === 'provider' && (
              <Link to="/proveedor/dashboard" className="mt-2 block text-brand-primary font-semibold text-center px-4 py-2 rounded hover:bg-blue-100 transition">
                Panel del Proveedor
              </Link>
            )}
          </div>
      </div>
    </header>
  );
};

export default Header;
