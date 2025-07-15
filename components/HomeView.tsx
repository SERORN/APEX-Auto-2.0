
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
     const [brand, setBrand] = React.useState('');
     const [model, setModel] = React.useState('');
     const [year, setYear] = React.useState('');
     
     const filteredProducts = products.filter(product => {
         return (
             (brand ? product.brand === brand : true)
         );
     });
  
  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <VehicleSelector onVehicleSelect={onVehicleSelect} selectedVehicle={selectedVehicle} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <form className="relative flex flex-col gap-3 md:flex-row md:items-center" role="search" aria-label={t('buscar_placeholder', 'Buscar por nombre de producto o SKU...')} onSubmit={e => e.preventDefault()}>
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('buscar_placeholder', 'Buscar por nombre de producto o SKU...')}
              className="w-full bg-[#F7FAFC] border border-[#EDF2F7] text-[#2D3748] rounded-lg p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2B6CB0] text-lg transition-shadow"
              aria-label={t('buscar_placeholder', 'Buscar por nombre de producto o SKU...')}
            />
            <SearchIcon className="w-6 h-6 text-[#A0AEC0] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {/* Filtros avanzados minimalistas */}
          <div className="flex gap-2 mt-2 md:mt-0">
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder={t('filtro_marca', 'Marca')}
              className="w-28 bg-[#F7FAFC] border border-[#EDF2F7] text-[#2D3748] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] text-sm"
              aria-label={t('filtro_marca', 'Marca')}
            />
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder={t('filtro_modelo', 'Modelo')}
              className="w-28 bg-[#F7FAFC] border border-[#EDF2F7] text-[#2D3748] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] text-sm"
              aria-label={t('filtro_modelo', 'Modelo')}
            />
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder={t('filtro_anio', 'Año')}
              className="w-20 bg-[#F7FAFC] border border-[#EDF2F7] text-[#2D3748] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] text-sm"
              aria-label={t('filtro_anio', 'Año')}
            />
          </div>
        </form>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#2D3748] mb-6">
          {selectedVehicle ? t('partes_compatibles', 'Partes Compatibles') : t('todos_los_productos', 'Todos los Productos')}
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F7FAFC] border border-[#EDF2F7] rounded-xl">
            <h3 className="text-2xl font-bold text-[#2D3748]">{t('no_productos', 'No se encontraron productos')}</h3>
            <p className="text-[#A0AEC0] mt-2">{t('no_productos_desc', 'Intenta ajustar tu búsqueda o selección de vehículo.')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeView;