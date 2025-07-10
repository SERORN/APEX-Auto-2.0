
import { Product } from '../types';

// =================================================================================
// ARCHIVO DE INVENTARIO DE PRODUCTOS
// =================================================================================
// El personal puede editar este archivo para actualizar el inventario.
// - 'stock': Representa la cantidad disponible del producto.
//   Si 'stock' es 0, el producto aparecerá como "Agotado" en la tienda.
// - Los precios ('price') están en la moneda base (MXN) y se convertirán
//   dinámicamente a USD si el usuario selecciona esa moneda.
// =================================================================================

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    sku: 'BPT-001',
    name: 'Pastillas de Freno de Cerámica Premium',
    description: 'Pastillas de freno de alto rendimiento para una frenada superior y silenciosa.',
    price: 1150.00,
    imageUrl: 'https://picsum.photos/seed/BPT-001/400/400',
    brand: 'DuraBrake',
    stock: 15,
    compatibility: [
      { brand: 'Toyota', model: 'Camry', years: [2021, 2022, 2023] },
      { brand: 'Honda', model: 'Accord', years: [2020, 2021, 2022] },
    ],
  },
  {
    id: 2,
    sku: 'AF-H2O',
    name: 'Filtro de Aire de Motor',
    description: 'Filtro de aire de alta calidad que mejora el rendimiento y la eficiencia del combustible.',
    price: 450.50,
    imageUrl: 'https://picsum.photos/seed/AF-H2O/400/400',
    brand: 'PureFlow',
    stock: 0, // <-- Producto agotado
    compatibility: [
      { brand: 'Ford', model: 'F-150', years: [2021, 2022, 2023] },
      { brand: 'Chevrolet', model: 'Silverado', years: [2022, 2023] },
    ],
  },
  {
    id: 3,
    sku: 'SP-IRID-X',
    name: 'Bujía de Iridio',
    description: 'Bujía de larga duración para un encendido consistente y una mejor economía de combustible.',
    price: 250.00,
    imageUrl: 'https://picsum.photos/seed/SP-IRID-X/400/400',
    brand: 'IgniteMax',
    stock: 120,
    compatibility: [
      { brand: 'Toyota', model: 'Corolla', years: [2020, 2021, 2022] },
      { brand: 'Honda', model: 'Civic', years: [2021, 2022, 2023] },
    ],
  },
  {
    id: 4,
    sku: 'OIL-SYN-5W30',
    name: 'Aceite de Motor Sintético 5W-30',
    description: 'Aceite de motor totalmente sintético para máxima protección y rendimiento.',
    price: 850.00,
    imageUrl: 'https://picsum.photos/seed/OIL-SYN-5W30/400/400',
    brand: 'Mobil 1',
    stock: 40,
    compatibility: [], // Universal
  },
  {
    id: 5,
    sku: 'ROT-DR-F150',
    name: 'Disco de Freno Delantero',
    description: 'Disco de freno de repuesto directo para Ford F-150. Ventilación de alto rendimiento.',
    price: 1800.00,
    imageUrl: 'https://picsum.photos/seed/ROT-DR-F150/400/400',
    brand: 'StopPerfect',
    stock: 12,
    compatibility: [
      { brand: 'Ford', model: 'F-150', years: [2021, 2022, 2023] },
    ],
  },
  {
    id: 6,
    sku: 'WBL-RAV4',
    name: 'Limpiaparabrisas (Juego de 2)',
    description: 'Limpiaparabrisas para todas las estaciones que garantizan una visión clara.',
    price: 450.00,
    imageUrl: 'https://picsum.photos/seed/WBL-RAV4/400/400',
    brand: 'ClearView',
    stock: 55,
    compatibility: [
      { brand: 'Toyota', model: 'RAV4', years: [2022, 2023] },
      { brand: 'Honda', model: 'CR-V', years: [2023, 2024] },
    ],
  },
  {
    id: 7,
    sku: 'BAT-AGM-H6',
    name: 'Batería AGM H6',
    description: 'Batería de alto rendimiento con tecnología AGM para una potencia de arranque fiable.',
    price: 3800.00,
    imageUrl: 'https://picsum.photos/seed/BAT-AGM-H6/400/400',
    brand: 'VoltEdge',
    stock: 8,
    compatibility: [
        { brand: 'Ford', model: 'Mustang', years: [2022, 2023, 2024] },
        { brand: 'Chevrolet', model: 'Equinox', years: [2021, 2022, 2023] },
    ],
  },
   {
    id: 8,
    sku: 'COOL-TYT',
    name: 'Refrigerante Súper Larga Vida 50/50',
    description: 'Refrigerante pre-diluido para vehículos Toyota. Protege contra la corrosión.',
    price: 550.00,
    imageUrl: 'https://picsum.photos/seed/COOL-TYT/400/400',
    brand: 'OEM Toyota',
    stock: 25,
    compatibility: [
        { brand: 'Toyota', model: 'Corolla', years: [2020, 2021, 2022] },
        { brand: 'Toyota', model: 'Camry', years: [2021, 2022, 2023] },
        { brand: 'Toyota', model: 'RAV4', years: [2022, 2023] },
    ],
  },
];
