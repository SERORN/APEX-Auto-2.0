
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Language, Currency } from '../types';
import { enTranslations } from '../i18n/locales';

// --- Configuración ---
const EXCHANGE_RATE_USD_TO_MXN = 18.50; // Tasa de cambio simulada

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string, defaultValue: string) => string;
  formatCurrency: (priceInMxn: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');
  const [currency, setCurrency] = useState<Currency>('mxn');

  const t = useCallback((key: string, defaultValue: string): string => {
    if (language === 'en') {
      return enTranslations[key] || defaultValue;
    }
    return defaultValue;
  }, [language]);

  const formatCurrency = useCallback((priceInMxn: number): string => {
    if (currency === 'usd') {
      const priceInUsd = priceInMxn / EXCHANGE_RATE_USD_TO_MXN;
      return priceInUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    return priceInMxn.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  }, [currency]);

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    formatCurrency,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
