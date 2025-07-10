
import React from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { View } from '../types';
import { XIcon } from './icons';

interface CartViewProps {
  onNavigate: (view: View) => void;
}

const CartView: React.FC<CartViewProps> = ({ onNavigate }) => {
  const { state, dispatch } = useCart();
  const { t, formatCurrency } = useSettings();

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Shipping is now "free"

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-8">{t('cart_title', 'Tu Carrito de Compras')}</h1>
      {state.items.length === 0 ? (
        <div className="text-center py-16 bg-navy-light rounded-lg">
          <h2 className="text-2xl font-bold text-white">{t('cart_empty', 'Tu carrito está vacío')}</h2>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:bg-orange-500 transition-colors"
          >
            {t('continue_shopping', 'Continuar Comprando')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-navy-light rounded-lg shadow-xl p-6 space-y-4">
            {state.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b border-navy pb-4 last:border-b-0">
                <img src={item.imageUrl} alt={t(`${item.sku}_name`, item.name)} className="w-24 h-24 rounded-md object-cover" />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white">{t(`${item.sku}_name`, item.name)}</h3>
                  <p className="text-sm text-metal-400">SKU: {item.sku}</p>
                  <p className="text-lg font-semibold text-brand-primary">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                    className="w-16 bg-navy border border-metal-500 text-white rounded-md p-2 text-center"
                  />
                  <button onClick={() => handleRemoveItem(item.id)} className="text-metal-400 hover:text-red-500">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="w-24 text-right">
                  <p className="text-lg font-bold text-white">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-navy-light rounded-lg shadow-xl p-6 h-fit">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy pb-2">{t('order_summary', 'Resumen del Pedido')}</h2>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-metal-300">{t('subtotal', 'Subtotal')}:</span>
                <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-metal-300">{t('shipping', 'Envío')}:</span>
                <span className="font-semibold text-green-400">{t('free', 'Gratis')}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-navy mt-4">
                <span className="text-white">{t('total', 'Total')}:</span>
                <span className="text-brand-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('checkout')}
              className="mt-6 w-full bg-brand-primary text-white font-bold py-3 rounded-md hover:bg-orange-500 transition-colors"
            >
              {t('checkout', 'Proceder al Pago')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
