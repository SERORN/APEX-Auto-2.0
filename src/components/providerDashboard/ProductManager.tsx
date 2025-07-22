import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Papa, { ParseResult } from 'papaparse';

// Tipo para producto extraído del CSV
export interface ProductCSVItem {
  sku: string;
  nombre: string;
  descripcion: string;
  precio: string;
  moneda: string;
  stock: string;
  marca: string;
  modelo: string;
  año: string;
  categoria: string;
  imagenURL: string;
}

// TODO: Agregar edición de producto, activar/inactivar, filtrado avanzado, paginación, etc.

const REQUIRED_FIELDS: (keyof ProductCSVItem)[] = ['sku', 'nombre', 'precio', 'stock'];
const CSV_COLUMNS: (keyof ProductCSVItem)[] = ['sku', 'nombre', 'descripcion', 'precio', 'moneda', 'stock', 'marca', 'modelo', 'año', 'categoria', 'imagenURL'];

function validateRow(row: ProductCSVItem, index: number): string[] {
  const errors: string[] = [];
  REQUIRED_FIELDS.forEach(field => {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push(`Línea ${index + 2}: El campo "${field}" es obligatorio.`);
    }
  });
  if (row['precio'] && isNaN(Number(row['precio']))) {
    errors.push(`Línea ${index + 2}: El campo "precio" debe ser numérico.`);
  }
  if (row['stock'] && isNaN(Number(row['stock']))) {
    errors.push(`Línea ${index + 2}: El campo "stock" debe ser numérico.`);
  }
  return errors;
}

const ProductManager: React.FC = () => {
  const [csvData, setCsvData] = useState<ProductCSVItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setProviderId(data?.user?.id ?? null);
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotification(null);
    setErrors([]);
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<ProductCSVItem>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<ProductCSVItem>) => {
        const rows = results.data;
        const newErrors: string[] = [];
        // Validar encabezados
        const headers = results.meta.fields || [];
        const missingHeaders = CSV_COLUMNS.filter(col => !headers.includes(col));
        if (missingHeaders.length > 0) {
          setErrors([`Encabezados faltantes o incorrectos: ${missingHeaders.join(', ')}`]);
          setCsvData([]);
          setNotification({ type: 'error', message: `El archivo CSV no tiene los encabezados requeridos: ${missingHeaders.join(', ')}` });
          return;
        }
        rows.forEach((row: ProductCSVItem, idx: number) => {
          newErrors.push(...validateRow(row, idx));
        });
        if (newErrors.length > 0) {
          setErrors(newErrors);
          setCsvData([]);
        } else {
          setCsvData(rows);
        }
      },
    });
  };

  const handleSaveProducts = async () => {
    if (!providerId) {
      setNotification({ type: 'error', message: 'No se detectó proveedor autenticado.' });
      return;
    }
    setLoading(true);
    setNotification(null);
    try {
      const upsertData = csvData.map(row => ({
        sku: row.sku,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: Number(row.precio),
        moneda: row.moneda || 'MXN',
        stock: Number(row.stock),
        marca: row.marca,
        modelo: row.modelo,
        año: row.año,
        categoria: row.categoria,
        imagenURL: row.imagenURL,
        provider_id: providerId,
      }));
      const { error } = await supabase.from('products').upsert(upsertData, { onConflict: 'sku,provider_id' });
      if (error) {
        setNotification({ type: 'error', message: `Error al guardar productos: ${error.message}` });
      } else {
        setNotification({ type: 'success', message: 'Productos guardados/actualizados correctamente.' });
        setCsvData([]);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: `Error inesperado: ${err.message}` });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos (Carga CSV)</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 block"
      />
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Errores en el archivo:</h3>
          <ul className="list-disc pl-5">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
      {csvData.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Vista previa de productos:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  {CSV_COLUMNS.map(col => <th key={col} className="border px-2 py-1 bg-gray-100">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, idx) => (
                  <tr key={idx}>
                    {CSV_COLUMNS.map(col => <td key={col} className="border px-2 py-1">{row[col]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleSaveProducts}
            disabled={loading}
            className="mt-4 bg-brand-primary text-white font-bold py-2 px-6 rounded hover:bg-brand-primary-hover transition disabled:bg-gray-300"
          >
            {loading ? 'Guardando...' : 'Guardar productos'}
          </button>
        </div>
      )}
      {notification && (
        <div className={`mt-4 p-3 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}
      {/* TODO: Agregar edición de producto, activar/inactivar, filtrado, paginación, etc. */}
    </div>
  );
};

export default ProductManager;
