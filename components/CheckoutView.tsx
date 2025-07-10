import React, { useState } from 'react';
import { View } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

const InputField = ({ id, label, ...props }: { id: string; label: string; [key: string]: any }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-metal-300 mb-1">{label}</label>
    <input id={id} {...props} className="w-full bg-navy border border-metal-500 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
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
    // 1. Send `formState` and cart contents to your backend server.
    // 2. Your backend processes the payment with a provider like Stripe or PayPal.
    // 3. If payment is successful, your backend should confirm.
    // 4. On confirmation, clear the cart and navigate to the confirmation page.
    // 5. If payment fails, show an error message to the user.
    // The code below is the current simulation.
    console.log('Simulating payment with data:', formState);
    dispatch({ type: 'CLEAR_CART' });
    onNavigate('confirmation');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-8">{t('checkout_title', 'Checkout')}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-navy-light p-8 rounded-lg shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-white border-b-2 border-brand-primary pb-2">{t('contact_shipping_info', 'Información de Contacto y Envío')}</h2>
          <div className="flex gap-4 bg-navy p-3 rounded-lg">
            <button type="button" onClick={() => setIsGuest(true)} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${isGuest ? 'bg-brand-primary text-white' : 'bg-transparent text-metal-300 hover:bg-navy-dark'}`}>{t('guest_checkout', 'Comprar como Invitado')}</button>
            <button type="button" onClick={() => setIsGuest(false)} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${!isGuest ? 'bg-brand-primary text-white' : 'bg-transparent text-metal-300 hover:bg-navy-dark'}`}>{t('login', 'Iniciar Sesión')}</button>
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

        <div className="bg-navy-light p-8 rounded-lg shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-white border-b-2 border-brand-primary pb-2">{t('payment_billing', 'Pago y Facturación')}</h2>
          <p className="text-metal-400 text-sm">{t('simulation_notice', 'Esta es una simulación. No introduzcas datos reales.')}</p>
          <InputField id="cardName" name="cardName" label={t('card_name', 'Nombre en la Tarjeta')} type="text" value={formState.cardName} onChange={handleInputChange} required />
          <InputField id="cardNumber" name="cardNumber" label={t('card_number', 'Número de Tarjeta')} type="text" placeholder="**** **** **** ****" value={formState.cardNumber} onChange={handleInputChange} required />
          <div className="grid grid-cols-2 gap-4">
            <InputField id="cardExpiry" name="cardExpiry" label={t('card_expiry', 'Expiración (MM/AA)')} type="text" placeholder="MM/AA" value={formState.cardExpiry} onChange={handleInputChange} required />
            <InputField id="cardCVC" name="cardCVC" label={t('card_cvc', 'CVC')} type="text" placeholder="***" value={formState.cardCVC} onChange={handleInputChange} required />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 text-lg rounded-md hover:bg-orange-500 transition-colors">
              {t('pay_order', 'Pagar y Realizar Pedido')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutView;