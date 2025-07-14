import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupplierPanel: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [years, setYears] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { error } = await supabase.from('products').insert([
      {
        name,
        price: parseFloat(price),
        compatibility: [{ brand, model, years: years.split(',').map(y => parseInt(y.trim(), 10)) }]
      }
    ]);
    if (error) setMessage('Error al publicar producto');
    else setMessage('Producto publicado');
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Publicar producto</h2>
      <form onSubmit={handlePublish}>
        <input className="w-full mb-2 p-2 border rounded" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" placeholder="Precio" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" placeholder="Marca" value={brand} onChange={e => setBrand(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" placeholder="Modelo" value={model} onChange={e => setModel(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" placeholder="Años (ej: 2010,2011)" value={years} onChange={e => setYears(e.target.value)} required />
        {message && <div className="mb-2 text-green-600">{message}</div>}
        <button className="w-full bg-blue-700 text-white py-2 rounded" type="submit">Publicar</button>
      </form>
    </div>
  );
};

export default SupplierPanel;
