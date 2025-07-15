
import React from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ShoppingCartIcon, UserIcon } from './icons';
import { Language, Currency } from '../types';

import { AppView } from '../App';
interface HeaderProps {
  onNavigate: (view: AppView) => void;
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
          <button
            className="flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded-md"
            onClick={() => onNavigate('home')}
            aria-label={t('ir_inicio', 'Ir a la página de inicio')}
          >
            <h1 className="text-3xl font-black text-text-primary tracking-tighter">
              AP<span className="text-brand-primary">X</span>
            </h1>
          </button>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4 md:gap-6">
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
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded-md"
              aria-label={t('ver_carrito', 'Ver carrito de compras')}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden md:block">{t('carrito', 'Carrito')}</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" aria-label={t('articulos_en_carrito', `Artículos en carrito: ${itemCount}`)}>
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
         {/* Mobile settings */}
         <div className="md:hidden flex items-center justify-center gap-4 pb-3">
            <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg">
              <LanguageButton lang="es" label="ES" />
              <LanguageButton lang="en" label="EN" />
            </div>
            <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg">
              <CurrencyButton curr="mxn" label="MXN" />
              <CurrencyButton curr="usd"label="USD" />
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
