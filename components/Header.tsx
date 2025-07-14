import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { View } from '../types';
import ApexChat from './ApexChat';

interface HeaderProps {
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { cart } = useCart();
  const { settings, setLanguage } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-background shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('home')} className="flex items-center space-x-2 text-2xl font-bold text-text-primary">
              <img src="/logo.svg" alt="Apex Auto" className="h-8 w-auto" />
              <span>Apex Auto</span>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <nav className="flex space-x-6">
              <button onClick={() => onNavigate('home')} className="text-text-secondary hover:text-text-primary transition-colors duration-200">{settings.t('nav_home', 'Home')}</button>
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">{settings.t('nav_parts', 'Parts')}</button>
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">{settings.t('nav_about', 'About Us')}</button>
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">{settings.t('nav_contact', 'Contact')}</button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <ApexChat />
            </div>
            <button onClick={() => onNavigate('cart')} className="relative text-text-secondary hover:text-text-primary transition-colors duration-200">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <div className="hidden md:block">
              <select
                value={settings.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-background border border-border-color rounded-md px-2 py-1 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-secondary hover:text-text-primary"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border-color">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-hover">{settings.t('nav_home', 'Home')}</button>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-hover">{settings.t('nav_parts', 'Parts')}</button>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-hover">{settings.t('nav_about', 'About Us')}</button>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-hover">{settings.t('nav_contact', 'Contact')}</button>
            <div className="border-t border-border-color my-2"></div>
            <div className="px-3 py-2">
              <ApexChat />
            </div>
            <div className="px-3 py-2">
              <select
                value={settings.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-background border border-border-color rounded-md px-2 py-1 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
