import { ShippingStatus } from '../../../types';

export interface Order {
  id: string;
  cliente: string;
  estado: ShippingStatus;
  total: number;
  carrier?: string;
  tracking_number?: string;
  shipping_status: ShippingStatus;
  fecha_envio?: string;
  fecha_entrega?: string;
}
