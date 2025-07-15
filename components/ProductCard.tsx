
import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const { t } = useSettings();

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const precioFinal = Math.round(product.price * 1.10 * 100) / 100;
  return (
    <article className="bg-[#F7FAFC] border border-[#EDF2F7] rounded-xl shadow-sm p-5 flex flex-col items-center transition hover:shadow-md relative group min-h-[370px]" role="region" aria-label={t(`${product.sku}_name`, product.name)} tabIndex={0}>
      {isOutOfStock && (
        <div className="absolute top-3 right-3 bg-[#E53E3E] text-white text-xs font-bold px-2 py-1 rounded z-10" aria-label={t('agotado', 'Agotado')}>
          {t('agotado', 'Agotado')}
        </div>
      )}
      <div className="w-32 h-32 flex items-center justify-center mb-4 bg-white rounded-lg border border-[#EDF2F7] overflow-hidden">
        <img src={product.imageUrl} alt={t(`${product.sku}_name`, product.name)} className={`max-w-full max-h-full object-contain transition-transform duration-300 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`} />
      </div>
      <h3 className="text-base font-bold text-[#2D3748] text-center mb-1 line-clamp-2 min-h-[2.5em]" title={t(`${product.sku}_name`, product.name)}>
        {t(`${product.sku}_name`, product.name)}
      </h3>
      <p className="text-xs text-[#A0AEC0] mb-1">SKU: {product.sku}</p>
      <p className="text-xs text-[#A0AEC0] flex-grow mb-2">{t(`${product.sku}_desc`, product.description)}</p>
      <span className="text-[#E53E3E] font-extrabold text-xl mb-2" aria-label={t('precio', 'Precio') + ': $' + precioFinal}>${precioFinal}</span>
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="w-full bg-[#2B6CB0] hover:bg-[#3182CE] text-white font-semibold py-2 rounded-lg transition-colors duration-200 text-base mt-2 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#2B6CB0]"
        aria-label={isOutOfStock ? t('agotado', 'Agotado') : t('agregar', 'Agregar al carrito')}
      >
        {isOutOfStock ? t('agotado', 'Agotado') : t('agregar', 'Agregar al carrito')}
      </button>
    </article>
  );
};

export default ProductCard;