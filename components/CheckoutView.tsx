
import React, { useState } from 'react';
import { View } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { LockClosedIcon } from './icons';

const InputField = ({ id, label, ...props }: { id: string; label: string; [key: string]: any }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <input id={id} {...props} className="w-full bg-background border border-border-color text-text-primary rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary" />
  </div>
);

interface CheckoutViewProps {
  onNavigate: (view: View) => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const { dispatch } = useCart();
  const { t } = useSettings();
  const [isGuest, setIsGuest] = useState(true);
  const [formState, setFormState] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    country: 'México',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- BACKEND INTEGRATION POINT ---
    // This is where you would integrate a real payment gateway.
    console.log('Simulating payment with data:', formState);
    dispatch({ type: 'CLEAR_CART' });
    onNavigate('confirmation');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-text-primary mb-8">{t('checkout_title', 'Checkout')}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 bg-background border border-border-color p-8 rounded-lg shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-text-primary border-b-2 border-border-color pb-3">{t('contact_shipping_info', 'Información de Contacto y Envío')}</h2>
          <div className="flex gap-2 bg-panel p-2 rounded-lg">
            <button type="button" onClick={() => setIsGuest(true)} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${isGuest ? 'bg-brand-primary text-white shadow' : 'bg-transparent text-text-secondary hover:bg-gray-200'}`}>{t('guest_checkout', 'Comprar como Invitado')}</button>
            <button type="button" onClick={() => setIsGuest(false)} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${!isGuest ? 'bg-brand-primary text-white shadow' : 'bg-transparent text-text-secondary hover:bg-gray-200'}`}>{t('login', 'Iniciar Sesión')}</button>
          </div>
          
          <InputField id="email" name="email" label={t('email', 'Correo Electrónico')} type="email" value={formState.email} onChange={handleInputChange} required />
          {!isGuest && (
             <InputField id="password" name="password" label={t('password', 'Contraseña')} type="password" required />
          )}
          <InputField id="name" name="name" label={t('full_name', 'Nombre Completo')} type="text" value={formState.name} onChange={handleInputChange} required />
          <InputField id="address" name="address" label={t('address', 'Dirección')} type="text" value={formState.address} onChange={handleInputChange} required />
          <div className="grid grid-cols-2 gap-4">
            <InputField id="city" name="city" label={t('city', 'Ciudad')} type="text" value={formState.city} onChange={handleInputChange} required />
            <InputField id="zip" name="zip" label={t('zip_code', 'Código Postal')} type="text" value={formState.zip} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="lg:col-span-2 bg-background border border-border-color p-8 rounded-lg shadow-sm space-y-6 h-fit">
          <h2 className="text-2xl font-bold text-text-primary border-b-2 border-border-color pb-3">{t('payment_billing', 'Pago y Facturación')}</h2>
          <p className="text-text-secondary text-sm">{t('simulation_notice', 'Esta es una simulación. No introduzcas datos reales.')}</p>
          <InputField id="cardName" name="cardName" label={t('card_name', 'Nombre en la Tarjeta')} type="text" value={formState.cardName} onChange={handleInputChange} required />
          <InputField id="cardNumber" name="cardNumber" label={t('card_number', 'Número de Tarjeta')} type="text" placeholder="**** **** **** ****" value={formState.cardNumber} onChange={handleInputChange} required />
          <div className="grid grid-cols-2 gap-4">
            <InputField id="cardExpiry" name="cardExpiry" label={t('card_expiry', 'Expiración (MM/AA)')} type="text" placeholder="MM/AA" value={formState.cardExpiry} onChange={handleInputChange} required />
            <InputField id="cardCVC" name="cardCVC" label={t('card_cvc', 'CVC')} type="text" placeholder="***" value={formState.cardCVC} onChange={handleInputChange} required />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-success text-white font-bold py-3 text-lg rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <LockClosedIcon className="w-5 h-5"/>
              {t('pay_order', 'Pagar y Realizar Pedido')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutView;