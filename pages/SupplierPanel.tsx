import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupplierPanel() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('products').insert([{
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image_url: product.image_url
    }]);

    if (error) setMessage('Error al publicar producto');
    else {
      setMessage('Producto publicado exitosamente');
      setProduct({ name: '', description: '', price: '', image_url: '' });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Publicar nuevo producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nombre"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="description"
          placeholder="Descripción"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="image_url"
          placeholder="URL de la imagen"
          value={product.image_url}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Publicar producto
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
