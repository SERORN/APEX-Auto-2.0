
import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const { t, formatCurrency } = useSettings();

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="bg-navy-light rounded-lg overflow-hidden shadow-lg border border-navy hover:border-brand-primary transition-all duration-300 flex flex-col relative">
      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {t('agotado', 'Agotado')}
        </div>
      )}
      <div className="relative">
        <img className={`w-full h-48 object-cover ${isOutOfStock ? 'filter grayscale' : ''}`} src={product.imageUrl} alt={product.name} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white" title={t(`${product.sku}_name`, product.name)}>
          {t(`${product.sku}_name`, product.name)}
        </h3>
        <p className="text-sm text-metal-400 mb-2">SKU: {product.sku}</p>
        <p className="text-xs text-metal-300 flex-grow mb-4">{t(`${product.sku}_desc`, product.description)}</p>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-2xl font-semibold text-brand-primary">{formatCurrency(product.price)}</p>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors disabled:bg-metal-500 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? t('agotado', 'Agotado') : t('agregar', 'Agregar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
