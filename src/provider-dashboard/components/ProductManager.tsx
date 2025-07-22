
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Search, AlertCircle, ImageOff, Download } from 'lucide-react';
import Papa from 'papaparse';

interface Product {
  id?: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  provider_id?: string;
  image_url?: string;
}

const initialForm: Product = {
  name: '',
  sku: '',
  price: 0,
  description: '',
  stock: 0,
  category: '',
  image_url: '',
};

const ProductManager: React.FC = () => {
  // TODO: exportar en Excel en el futuro
  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    // Simple toast con Tailwind (puedes reemplazar por tu sistema de notificaciones)
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
  }

  const handleExportCSV = () => {
    try {
      const exportData = filteredProducts.map(p => ({
        id: p.id || '',
        name: p.name,
        sku: p.sku,
        price: p.price,
        stock: p.stock,
        category: p.category,
        image_url: p.image_url || ''
      }));
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'productos_exportados.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Archivo CSV exportado con éxito.', 'success');
    } catch (err) {
      showToast('Error al exportar CSV.', 'error');
    }
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'out'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  // Filtros de precio
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Filtrado de productos
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (filterStatus === 'available') matchesStatus = product.stock > 0;
    if (filterStatus === 'out') matchesStatus = product.stock === 0;
    let matchesCategory = true;
    if (filterCategory !== 'all') {
      if (filterCategory === '__none__') {
        matchesCategory = !product.category;
      } else {
        matchesCategory = product.category === filterCategory;
      }
    }
    // Filtro de rango de precios
    let matchesMin = true;
    let matchesMax = true;
    const min = minPrice !== '' ? parseFloat(minPrice) : undefined;
    const max = maxPrice !== '' ? parseFloat(maxPrice) : undefined;
    if (min !== undefined && !isNaN(min)) matchesMin = product.price >= min;
    if (max !== undefined && !isNaN(max)) matchesMax = product.price <= max;
    // Si min > max, ignora el filtro de precio
    if (min !== undefined && max !== undefined && min > max) {
      return matchesSearch && matchesStatus && matchesCategory;
    }
    return matchesSearch && matchesStatus && matchesCategory && matchesMin && matchesMax;
  });
  const [form, setForm] = useState<Product>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<{[id: string]: boolean}>({});

  // Obtener usuario autenticado
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (data?.user) {
        setUserId(data.user.id);
        // Obtener rol del usuario (ajusta según tu modelo de roles)
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        setUserRole(profile?.role || null);
      } else setError('Debes iniciar sesión como proveedor.');
    });
  }, []);
  // Eliminar producto
  const deleteProduct = async (productId: string) => {
    setDeleteLoading(prev => ({ ...prev, [productId]: true }));
    setError(null);
    setSuccess(null);
    const { error: delError } = await supabase.from('products').delete().eq('id', productId).eq('provider_id', userId);
    if (delError) {
      setError('Error al eliminar: ' + delError.message);
    } else {
      setSuccess('Producto eliminado con éxito.');
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
    setDeleteLoading(prev => ({ ...prev, [productId]: false }));
  };

  // Traer productos del proveedor
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('provider_id', userId)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProducts(data || []);
        setLoading(false);
      });
  }, [userId]);

  // Validar campos
  const validate = (p: Product) => {
    if (!p.name) return 'El nombre es obligatorio.';
    if (!p.sku) return 'El SKU es obligatorio.';
    if (p.price <= 0) return 'El precio debe ser mayor a 0.';
    if (p.stock < 0) return 'El stock no puede ser negativo.';
    if (!p.category) return 'La categoría es obligatoria.';
    return null;
  };

  // Guardar producto (crear o editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validation = validate(form);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
  const upsertData = { ...form, provider_id: userId, image_url: form.image_url };
    const { error: upsertError } = await supabase.from('products').upsert(upsertData);
    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSuccess(editingId ? 'Producto actualizado.' : 'Producto creado.');
      setForm(initialForm);
      setEditingId(null);
      // Refrescar productos
      const { data } = await supabase.from('products').select('*').eq('provider_id', userId);
      setProducts(data || []);
    }
    setLoading(false);
  };

  // Editar producto
  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product.id || null);
  };

  // Cancelar edición
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>
      <form onSubmit={handleSave} className="bg-white rounded shadow p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="SKU" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Precio" type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
          <input className="border p-2 rounded" placeholder="Stock" type="number" min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
          <input className="border p-2 rounded" placeholder="Categoría" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="URL de imagen (opcional)" value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
        </div>
        <textarea className="border p-2 rounded w-full" placeholder="Descripción" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" disabled={loading}>{editingId ? 'Actualizar' : 'Crear'}</button>
          {editingId && <button type="button" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={handleCancel}>Cancelar</button>}
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && <div className="text-green-600 font-semibold">{success}</div>}
      </form>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <h3 className="text-xl font-bold">Productos existentes</h3>
        <button
          type="button"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          onClick={handleExportCSV}
          disabled={filteredProducts.length === 0}
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>
      {/* Filtros de búsqueda y estado */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-stretch sm:items-end">
        <div className="relative flex-1">
          <input
            type="text"
            className="border p-2 rounded w-full pl-10"
            placeholder="Buscar por nombre o SKU"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <select
          className="border p-2 rounded w-full sm:w-48"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
        >
          <option value="all">Todos</option>
          <option value="available">Disponibles</option>
          <option value="out">Agotados</option>
        </select>
        <select
          className="border p-2 rounded w-full sm:w-48"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {Array.from(new Set(products.map(p => p.category || '__none__'))).map(cat =>
            cat === '__none__'
              ? <option key={cat} value="__none__">Sin categoría</option>
              : <option key={cat} value={cat}>{cat}</option>
          )}
        </select>
        <input
          type="number"
          className="border p-2 rounded w-full sm:w-32"
          placeholder="Precio mínimo"
          min={0}
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded w-full sm:w-32"
          placeholder="Precio máximo"
          min={0}
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
        {(minPrice !== '' || maxPrice !== '') && (
          <button
            type="button"
            className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300 whitespace-nowrap"
            onClick={() => { setMinPrice(''); setMaxPrice(''); }}
          >
            Reset precio
          </button>
        )}
      </div>
      {/* Si minPrice > maxPrice, mostrar advertencia */}
      {minPrice !== '' && maxPrice !== '' && parseFloat(minPrice) > parseFloat(maxPrice) && (
        <div className="text-yellow-600 font-medium mb-2">El precio mínimo no puede ser mayor que el máximo.</div>
      )}
      <div className="overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No se encontraron resultados</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left w-16">Imagen</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Categoría</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <ImageOff className="w-8 h-8 text-gray-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.sku}</td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">
                    {product.stock === 0 ? (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Agotado
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="text-yellow-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {product.stock} unidades
                      </span>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm" onClick={() => handleEdit(product)}>Editar</button>
                    {userRole === 'provider' && (
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm flex items-center gap-1 disabled:opacity-60"
                        title="Eliminar producto"
                        disabled={!!deleteLoading[product.id!]} 
                        onClick={async () => {
                          if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
                            await deleteProduct(product.id!);
                          }
                        }}
                      >
                        {deleteLoading[product.id!] ? (
                          <span className="animate-pulse">Eliminando...</span>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </>
                        )}
                      </button>
                    )}
                    {/* TODO: eliminación masiva o mover a papelera */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
