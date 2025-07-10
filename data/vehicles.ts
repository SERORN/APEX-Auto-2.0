
import { Vehicle } from '../types';

export const VEHICLE_DATA: Vehicle[] = [
  {
    brand: 'Toyota',
    models: [
      { name: 'Corolla', years: [2022, 2021, 2020], versions: ['LE', 'XSE'] },
      { name: 'Camry', years: [2023, 2022, 2021], versions: ['SE', 'XLE', 'TRD'] },
      { name: 'RAV4', years: [2023, 2022], versions: ['LE', 'XLE Premium', 'Adventure'] },
    ],
  },
  {
    brand: 'Ford',
    models: [
      { name: 'F-150', years: [2023, 2022, 2021], versions: ['XL', 'XLT', 'Lariat'] },
      { name: 'Mustang', years: [2024, 2023, 2022], versions: ['EcoBoost', 'GT', 'Mach 1'] },
      { name: 'Explorer', years: [2022, 2021], versions: ['Base', 'XLT', 'Limited'] },
    ],
  },
  {
    brand: 'Honda',
    models: [
      { name: 'Civic', years: [2023, 2022, 2021], versions: ['Sport', 'EX-L', 'Touring'] },
      { name: 'Accord', years: [2022, 2021, 2020], versions: ['LX', 'Sport SE'] },
      { name: 'CR-V', years: [2024, 2023], versions: ['LX', 'EX', 'EX-L'] },
    ],
  },
  {
    brand: 'Chevrolet',
    models: [
      { name: 'Silverado', years: [2023, 2022], versions: ['WT', 'Custom', 'LT'] },
      { name: 'Equinox', years: [2023, 2022, 2021], versions: ['LS', 'LT', 'RS'] },
    ]
  }
];
