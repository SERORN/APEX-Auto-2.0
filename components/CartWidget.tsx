import React, { useState } from 'react';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const isMobile = () => window.innerWidth < 640;

const CartWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { cartItems, totalQuantity, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleOpen = () => {
    if (isMobile()) {
      navigate('/carrito');
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      {/* Icono de carrito con badge */}
      <button
        className="relative p-2 rounded hover:bg-gray-100 transition"
        onClick={handleOpen}
        aria-label="Ver carrito"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">
            {totalQuantity}
          </span>
        )}
      </button>

      {/* Modal lateral */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
          />
          {/* Panel lateral */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md sm:w-96 bg-white shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Tu carrito</h2>
              <button onClick={() => setOpen(false)} aria-label="Cerrar">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-16">Tu carrito está vacío</div>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex items-center gap-3 border-b pb-3">
                      <div className="flex-1">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-500">${item.price} c/u</div>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id, Number(e.target.value))}
                            className="w-16 border rounded px-2 py-1 text-sm"
                          />
                          <span className="text-xs text-gray-400">x</span>
                          <span className="text-sm font-medium">${item.price * item.quantity}</span>
                        </div>
                      </div>
                      <button
                        className="p-2 text-red-500 hover:bg-red-100 rounded"
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold">${totalPrice}</span>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                disabled={cartItems.length === 0}
                onClick={() => {
                  setOpen(false);
                  navigate('/checkout');
                }}
              >
                Ir a pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartWidget;
