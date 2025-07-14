
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
      <h1 className="text-4xl font-bold text-text-primary mb-8">{t('cart_title', 'Tu Carrito de Compras')}</h1>
      {state.items.length === 0 ? (
        <div className="text-center py-16 bg-subtle rounded-lg border border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">{t('cart_empty', 'Tu carrito está vacío')}</h2>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:bg-brand-primary-hover transition-colors"
          >
            {t('continue_shopping', 'Continuar Comprando')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-background rounded-lg shadow-md border border-border-color p-6 space-y-4">
            {state.items.map(item => (
              <div key={item.id} className="flex items-start sm:items-center gap-4 border-b border-border-color pb-4 last:border-b-0 flex-col sm:flex-row">
                <img src={item.imageUrl} alt={t(`${item.sku}_name`, item.name)} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-text-primary">{t(`${item.sku}_name`, item.name)}</h3>
                  <p className="text-sm text-text-secondary">SKU: {item.sku}</p>
                  <p className="text-lg font-semibold text-brand-primary sm:hidden mt-1">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                    className="w-16 bg-subtle border border-border-color text-text-primary rounded-md p-2 text-center"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button onClick={() => handleRemoveItem(item.id)} className="text-text-secondary hover:text-danger p-1 rounded-full">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="w-24 text-right hidden sm:block">
                  <p className="text-lg font-bold text-text-primary">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-subtle rounded-lg p-6 h-fit border border-border-color">
            <h2 className="text-2xl font-bold text-text-primary mb-4 border-b border-border-color pb-2">{t('order_summary', 'Resumen del Pedido')}</h2>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('subtotal', 'Subtotal')}:</span>
                <span className="font-semibold text-text-primary">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('shipping', 'Envío')}:</span>
                <span className="font-semibold text-success">{t('free', 'Gratis')}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-border-color mt-4">
                <span className="text-text-primary">{t('total', 'Total')}:</span>
                <span className="text-brand-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('checkout')}
              className="mt-6 w-full bg-brand-primary text-white font-bold py-3 rounded-md hover:bg-brand-primary-hover transition-colors"
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