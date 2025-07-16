import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error fetching products:', error);
      else setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded">
          <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover mb-2" />
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-right font-bold mt-2">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
