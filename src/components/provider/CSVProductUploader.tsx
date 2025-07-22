// SUGERENCIA: No se detecta uso de este componente. Considerar migrar a __migrated-components__ o eliminar si no es necesario.
import React, { useState } from 'react';

// TODO: permitir futura carga de imágenes desde ZIP, emparejando por nombre de archivo con el SKU (ej: ABC123.jpg ↔ SKU ABC123)
const REQUIRED_COLUMNS = [
  'nombre',
  'precio',
  'marca',
  'categoria',
  'imagen_url',
  'stock',
  'SKU',
  'proveedor_id'
];

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { error: 'El archivo CSV está vacío o incompleto.' };
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  if (missing.length) return { error: `Faltan columnas obligatorias: ${missing.join(', ')}` };
  const warnings: string[] = [];
  const data = lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const obj: Record<string, string | null> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    // Validar image_url si existe
    if ('imagen_url' in obj && obj['imagen_url']) {
      const url = obj['imagen_url'] as string;
      if (!/^https?:\/\//.test(url)) {
        warnings.push(`Fila ${index + 2}: URL de imagen no válida.`);
        obj['imagen_url'] = null;
      }
    }
    return obj;
  });
  return { headers, data, warnings };
}

const CSVProductUploader: React.FC = () => {
  const [products, setProducts] = useState<Array<Record<string, string | null>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = parseCSV(text);
      if (result.error) {
        setError(result.error);
        setProducts([]);
        setWarnings([]);
      } else {
        setError(null);
        setProducts(result.data);
        setWarnings(result.warnings || []);
      }
    };
    reader.readAsText(file);
  };

  // TODO: Integrar con Supabase o APIs de ERP para guardar productos

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Subir archivo CSV de productos</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {warnings.length > 0 && (
        <div className="mb-2 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-2">
          {warnings.map((w, i) => <div key={i}>{w}</div>)}
        </div>
      )}
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                {Object.keys(products[0]).map((col) => (
                  <th key={col} className="px-3 py-2 bg-blue-50 text-blue-700 border-b">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-3 py-2 border-b">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* TODO: Botón para guardar productos en Supabase o ERP */}
    </div>
  );
};

export default CSVProductUploader;
