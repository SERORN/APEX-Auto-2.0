
import React from 'react';
import { View } from '../types';
import { useSettings } from '../context/SettingsContext';

interface ConfirmationViewProps {
  onNavigate: (view: View) => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({ onNavigate }) => {
  const { t } = useSettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
      <div className="bg-background border border-border-color p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
        <svg className="w-20 h-20 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-4xl font-bold text-text-primary mb-2">{t('thank_you', '¡Gracias por tu compra!')}</h1>
        <p className="text-lg text-text-secondary mb-8">{t('order_confirmation', 'Tu pedido ha sido realizado con éxito. Hemos enviado una confirmación a tu correo electrónico.')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:bg-brand-primary-hover transition-colors"
          >
            {t('continue_shopping', 'Seguir Comprando')}
          </button>
          <button
            onClick={() => alert(t('invoice_alert', 'Función de facturación simulada. ¡La factura se ha descargado!'))}
            className="w-full sm:w-auto bg-subtle border border-border-color text-text-secondary font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
          >
            {t('download_invoice', 'Descargar Factura')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationView;