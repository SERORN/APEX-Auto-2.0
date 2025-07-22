
// TODO: MIGRAR este endpoint a una Edge Function para producción si se requiere mayor seguridad y performance.

import { createClient, User } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import axios from 'axios';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FACTURAMA_USER = process.env.FACTURAMA_USER;
const FACTURAMA_PASS = process.env.FACTURAMA_PASS;
const FACTURAMA_API = 'https://apisandbox.facturama.mx';

// Middleware de autenticación y tipado
async function requireAuth(req: Request & { user?: User }, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.toString().replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'No autorizado' });
  req.user = data.user;
  next();
}

// Tipado de body
interface ResendBody {
  orderId: string;
  email?: string;
}

router.post('/resend', requireAuth, async (req: Request & { user?: User, body: ResendBody }, res: Response) => {
  const { orderId, email: newEmail } = req.body;
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Falta orderId o es inválido.' });
  }
  if (newEmail && typeof newEmail !== 'string') {
    return res.status(400).json({ error: 'El email debe ser un string.' });
  }

  // 1. Obtener datos de la orden y CFDI
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, user_id, provider_id, factura_url, factura_uuid, email')
    .eq('id', orderId)
    .single();
  if (error || !order) {
    return res.status(404).json({ error: 'Orden no encontrada.' });
  }

  // 2. Validar factura_url y uuid
  if (!order.factura_url || !order.factura_uuid) {
    return res.status(400).json({ error: 'La orden no tiene CFDI generado.' });
  }

  // 3. Validar permisos: dueño o proveedor
  const userId = req.user?.id;
  if (!userId || (order.user_id !== userId && order.provider_id !== userId)) {
    return res.status(403).json({ error: 'No tienes permiso para esta orden.' });
  }

  // 4. Reenviar factura usando Facturama
  try {
    const emailToSend = newEmail || order.email;
    if (!emailToSend) {
      return res.status(400).json({ error: 'No hay email para enviar.' });
    }
    await axios.post(
      `${FACTURAMA_API}/2/cfdis/${order.factura_uuid}/email`,
      { email: emailToSend },
      {
        auth: { username: FACTURAMA_USER, password: FACTURAMA_PASS },
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.status(200).json({ message: 'Factura reenviada con éxito.', email: emailToSend });
  } catch (err: any) {
    // Manejo robusto de error
    const details = err?.response?.data || err?.message || 'Error desconocido';
    return res.status(500).json({ error: 'Error al reenviar factura', details });
  }
});

export default router;
