
import React from 'react';
import { Product, SelectedVehicle } from '../types';
import VehicleSelector from './VehicleSelector';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons';
import { useSettings } from '../context/SettingsContext';

interface HomeViewProps {
  products: Product[];
  onVehicleSelect: (vehicle: SelectedVehicle | null) => void;
  selectedVehicle: SelectedVehicle | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ products, onVehicleSelect, selectedVehicle, searchQuery, setSearchQuery }) => {
  const { t } = useSettings();
  
  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <VehicleSelector onVehicleSelect={onVehicleSelect} selectedVehicle={selectedVehicle} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('buscar_placeholder', 'Buscar por nombre de producto o SKU...')}
            className="w-full bg-background border border-border-color text-text-primary rounded-lg p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary text-lg"
          />
          <SearchIcon className="w-6 h-6 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-text-primary mb-6">
          {selectedVehicle ? t('partes_compatibles', 'Partes Compatibles') : t('todos_los_productos', 'Todos los Productos')}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-subtle rounded-lg">
            <h3 className="text-2xl font-bold text-text-primary">{t('no_productos', 'No se encontraron productos')}</h3>
            <p className="text-text-secondary mt-2">{t('no_productos_desc', 'Intenta ajustar tu búsqueda o selección de vehículo.')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeView;