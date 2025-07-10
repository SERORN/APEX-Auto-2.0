
import React, { useState, useMemo } from 'react';
import { SelectedVehicle } from '../types';
import { VEHICLE_DATA } from '../data/vehicles';
import { ChevronDownIcon, CarIcon, XIcon } from './icons';
import { useSettings } from '../context/SettingsContext';

interface VehicleSelectorProps {
  onVehicleSelect: (vehicle: SelectedVehicle | null) => void;
  selectedVehicle: SelectedVehicle | null;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onVehicleSelect, selectedVehicle }) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [version, setVersion] = useState('');
  const { t } = useSettings();

  const handleReset = () => {
    setBrand('');
    setModel('');
    setYear('');
    setVersion('');
    onVehicleSelect(null);
  };
  
  const models = useMemo(() => {
    if (!brand) return [];
    return VEHICLE_DATA.find(v => v.brand === brand)?.models || [];
  }, [brand]);

  const years = useMemo(() => {
    if (!model) return [];
    return models.find(m => m.name === model)?.years || [];
  }, [model, models]);

  const versions = useMemo(() => {
    if (!model) return [];
    return models.find(m => m.name === model)?.versions || [];
  }, [model, models]);

  const handleFindParts = () => {
    if (brand && model && year && version) {
      onVehicleSelect({ brand, model, year, version });
    }
  };

  if (selectedVehicle) {
    return (
      <div className="bg-navy-light p-4 rounded-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <CarIcon className="w-8 h-8 text-brand-primary" />
          <div>
            <p className="font-bold text-lg text-white">{`${selectedVehicle.brand} ${selectedVehicle.model}`}</p>
            <p className="text-sm text-metal-300">{`${t('vehiculo_seleccionado', 'Tu Vehículo')}: ${selectedVehicle.year} - ${selectedVehicle.version}`}</p>
          </div>
        </div>
        <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full transition-colors duration-200">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-navy-light p-6 rounded-lg shadow-2xl border border-navy">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CarIcon /> {t('find_parts_title', 'Encuentra Partes para tu Vehículo')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Select Brand */}
        <div className="relative">
          <select value={brand} onChange={e => { setBrand(e.target.value); setModel(''); setYear(''); setVersion(''); }} className="w-full bg-navy border border-metal-500 text-white rounded-md p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary">
            <option value="">{t('marca', 'Marca')}</option>
            {VEHICLE_DATA.map(v => <option key={v.brand} value={v.brand}>{v.brand}</option>)}
          </select>
          <ChevronDownIcon className="w-5 h-5 text-metal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
        </div>

        {/* Select Model */}
        <div className="relative">
          <select value={model} onChange={e => { setModel(e.target.value); setYear(''); setVersion(''); }} disabled={!brand} className="w-full bg-navy border border-metal-500 text-white rounded-md p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">{t('modelo', 'Modelo')}</option>
            {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
          <ChevronDownIcon className="w-5 h-5 text-metal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
        </div>

        {/* Select Year */}
        <div className="relative">
          <select value={year} onChange={e => setYear(e.target.value)} disabled={!model} className="w-full bg-navy border border-metal-500 text-white rounded-md p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">{t('ano', 'Año')}</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDownIcon className="w-5 h-5 text-metal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
        </div>

        {/* Select Version */}
        <div className="relative">
          <select value={version} onChange={e => setVersion(e.target.value)} disabled={!year} className="w-full bg-navy border border-metal-500 text-white rounded-md p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">{t('version', 'Versión')}</option>
            {versions.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <ChevronDownIcon className="w-5 h-5 text-metal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
        </div>
        
        <button onClick={handleFindParts} disabled={!brand || !model || !year || !version} className="bg-brand-primary text-white font-bold rounded-md hover:bg-orange-500 transition-colors duration-300 disabled:bg-metal-500 disabled:cursor-not-allowed">
          {t('buscar', 'Buscar')}
        </button>
      </div>
    </div>
  );
};

export default VehicleSelector;
