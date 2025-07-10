
import React from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ShoppingCartIcon, UserIcon, CarIcon, GlobeIcon } from './icons';
import { View, Language, Currency } from '../types';

interface HeaderProps {
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { state } = useCart();
  const { language, setLanguage, currency, setCurrency, t } = useSettings();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const LanguageButton = ({ lang, label }: { lang: Language, label: string }) => (
    <button
      onClick={() => setLanguage(lang)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${language === lang ? 'bg-brand-primary text-white' : 'bg-navy-light text-metal-300 hover:bg-navy'}`}
    >
      {label}
    </button>
  );

  const CurrencyButton = ({ curr, label }: { curr: Currency, label: string }) => (
    <button
      onClick={() => setCurrency(curr)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${currency === curr ? 'bg-brand-primary text-white' : 'bg-navy-light text-metal-300 hover:bg-navy'}`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-navy shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <CarIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="text-2xl font-bold text-white">Apex Auto</h1>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-navy-dark p-1 rounded-lg">
              <LanguageButton lang="es" label="ES" />
              <LanguageButton lang="en" label="EN" />
            </div>
            <div className="hidden md:flex items-center gap-2 bg-navy-dark p-1 rounded-lg">
              <CurrencyButton curr="mxn" label="MXN" />
              <CurrencyButton curr="usd" label="USD" />
            </div>

            <button className="flex items-center gap-2 text-metal-300 hover:text-white transition-colors duration-200">
              <UserIcon className="h-6 w-6" />
              <span className="hidden md:block">{t('mi_cuenta', 'Mi Cuenta')}</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex items-center gap-2 text-metal-300 hover:text-white transition-colors duration-200"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden md:block">{t('carrito', 'Carrito')}</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
         {/* Mobile settings */}
         <div className="md:hidden flex items-center justify-center gap-4 pb-2">
            <div className="flex items-center gap-2 bg-navy-dark p-1 rounded-lg">
              <LanguageButton lang="es" label="ES" />
              <LanguageButton lang="en" label="EN" />
            </div>
            <div className="flex items-center gap-2 bg-navy-dark p-1 rounded-lg">
              <CurrencyButton curr="mxn" label="MXN" />
              <CurrencyButton curr="usd"label="USD" />
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
