
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
    <div className="bg-background rounded-lg overflow-hidden shadow-md border border-border-color hover:shadow-xl transition-all duration-300 flex flex-col relative group">
      {isOutOfStock && (
        <div className="absolute top-3 right-3 bg-danger text-white text-xs font-bold px-2 py-1 rounded z-10">
          {t('agotado', 'Agotado')}
        </div>
      )}
      <div className="relative overflow-hidden">
        <img className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'filter grayscale' : ''}`} src={product.imageUrl} alt={product.name} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-text-primary leading-tight" title={t(`${product.sku}_name`, product.name)}>
          {t(`${product.sku}_name`, product.name)}
        </h3>
        <p className="text-sm text-text-secondary mb-2">SKU: {product.sku}</p>
        <p className="text-sm text-text-secondary flex-grow mb-4">{t(`${product.sku}_desc`, product.description)}</p>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(product.price)}</p>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? t('agotado', 'Agotado') : t('agregar', 'Agregar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;