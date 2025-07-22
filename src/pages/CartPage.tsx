
import React, { useMemo, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import type { CartItem } from '../types';

const CartPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { cartItems, clearCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // Calcular subtotal y total con useMemo
  const itemsWithSubtotal = useMemo(() =>
    cartItems.map(item => ({ ...item, subtotal: item.price * item.quantity })),
    [cartItems]
  );
  const total = useMemo(() =>
    itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0),
    [itemsWithSubtotal]
  );

  // Handlers con validación y toast
  const handleRemove = (id: number | string) => {
    try {
      removeItem(id);
      toast.success('Producto eliminado del carrito');
    } catch (e) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleClear = () => {
    try {
      clearCart();
      toast.success('Carrito vaciado');
    } catch (e) {
      toast.error('Error al vaciar carrito');
    }
  };

  const handleUpdateQty = (id: number | string, qty: number) => {
    if (qty < 1) return;
    try {
      updateQuantity(id, qty);
    } catch (e) {
      toast.error('Error al actualizar cantidad');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 min-h-screen flex flex-col" aria-label="Carrito de compras">
      <h1 className="text-2xl font-bold mb-4 text-center">Tu carrito</h1>
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <span className="text-4xl mb-4" aria-hidden>🛒</span>
          <p className="mb-4">Tu carrito está vacío</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate('/')}
            aria-label="Volver a comprar"
          >
            Volver a comprar
          </button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {itemsWithSubtotal.map((item: CartItem & { subtotal: number }) => (
              <li key={item.id} className="flex items-center gap-3 py-4">
                <img
                  src={(item as any).image_url || (item as any).imageUrl || 'https://placehold.co/64x64'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" title={item.name}>{item.name}</div>
                  <div className="text-xs text-gray-500">${item.price} c/u</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      aria-label="Disminuir cantidad"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-2 text-sm" aria-live="polite">{item.quantity}</span>
                    <button
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-sm">${item.subtotal}</span>
                  <button
                    className="mt-2 text-red-500 hover:bg-red-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold">${total}</span>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleClear}
              aria-label="Vaciar carrito"
            >
              Vaciar carrito
            </button>
            <button
              className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => navigate('/checkout')}
              aria-label="Ir a pagar"
            >
              Ir a pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
