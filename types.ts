export enum ShippingStatus {
  Pendiente = 'pendiente',
  EnTransito = 'en_transito',
  Entregado = 'entregado',
  Cancelado = 'cancelado',
}

export interface VehicleCompatibility {
  brand: string;
  model: string;
  years: number[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  brand: string;
  stock: number;
  compatibility: VehicleCompatibility[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Vehicle {
  brand: string;
  models: {
    name: string;
    years: number[];
    versions: string[];
  }[];
}

export interface SelectedVehicle {
  brand: string;
  model: string;
  year: string;
  version: string;
}

export type View = 'home' | 'cart' | 'checkout' | 'confirmation' | 'login';

export type Language = 'es' | 'en';
export type Currency = 'mxn' | 'usd';
