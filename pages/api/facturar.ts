// API Route para facturación CFDI automática con Facturama (sandbox)
// TODO: implementar como Edge Function para mayor seguridad
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const FACTURAMA_USER = 'demo@facturama.mx';
const FACTURAMA_PASS = 'demo123';
const FACTURAMA_API = 'https://apisandbox.facturama.mx/api-lite/';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { cart, fiscal, orderId } = req.body;
  if (!cart || !fiscal || !orderId) return res.status(400).json({ error: 'Datos incompletos' });

  // Obtener email del usuario autenticado (receptor)
  let userEmail = null;
  try {
    const { data: { user } } = await supabase.auth.getUser(req.headers['authorization']?.replace('Bearer ', ''));
    userEmail = user?.email || null;
  } catch (e) {
    userEmail = null;
  }
  // Permitir override desde el frontend si se desea
  if (fiscal.email) userEmail = fiscal.email;

  // Validar RFC
  const rfcRegex = /^[A-Z&Ññ]{3,4}\d{6}[A-Z0-9]{3}$/;
  if (!rfcRegex.test(fiscal.rfc)) return res.status(400).json({ error: 'RFC inválido' });

  // Convertir productos a conceptos CFDI
  const conceptos = cart.map((item: any) => ({
    ClaveProdServ: '01010101', // genérico
    Cantidad: item.quantity,
    ClaveUnidad: 'H87', // pieza
    Unidad: 'Pieza',
    Descripcion: item.name.replace(/[^\w\s.,-]/g, ''), // evitar caracteres ilegales
    ValorUnitario: item.price,
    Importe: item.price * item.quantity,
    Impuestos: [{
      Base: item.price * item.quantity,
      Impuesto: '002', // IVA
      TipoFactor: 'Tasa',
      TasaOCuota: 0.16,
      Importe: (item.price * item.quantity) * 0.16
    }]
  }));

  // Datos de factura
  const factura = {
    Serie: 'A',
    Folio: String(orderId),
    Fecha: new Date().toISOString(),
    FormaPago: '03', // transferencia
    MetodoPago: 'PUE',
    TipoDeComprobante: 'I',
    LugarExpedicion: '64000',
    Emisor: {
      // TODO: obtener datos reales del proveedor desde Supabase
      Nombre: 'Proveedor Demo',
      Rfc: 'AAA010101AAA',
      RegimenFiscal: '601'
    },
    Receptor: {
      Nombre: fiscal.name,
      Rfc: fiscal.rfc,
      UsoCFDI: fiscal.usoCfdi
    },
    Conceptos: conceptos
  };

  // Timbrar CFDI con Facturama
  try {
    const resp = await fetch(FACTURAMA_API + 'cfdi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(FACTURAMA_USER + ':' + FACTURAMA_PASS).toString('base64')
      },
      body: JSON.stringify(factura)
    });
    const data = await resp.json();
    if (!resp.ok || !data.Pdf || !data.Id) {
      return res.status(500).json({ error: data.Message || 'Error al timbrar CFDI' });
    }
    // Guardar factura_url en Supabase
    await supabase.from('orders').update({ factura_url: data.Pdf }).eq('id', orderId);

    // Enviar CFDI por email usando Facturama
    let emailSent = false;
    let emailError = null;
    if (userEmail) {
      try {
        const emailResp = await fetch(FACTURAMA_API + `cfdis/${data.Id}/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(FACTURAMA_USER + ':' + FACTURAMA_PASS).toString('base64')
          },
          body: JSON.stringify({ email: userEmail })
        });
        if (emailResp.ok) {
          emailSent = true;
        } else {
          emailError = await emailResp.text();
        }
      } catch (e) {
        emailError = e.message;
      }
    }
    // TODO: Soporte para envío SMTP propio en vez de Facturama

    return res.status(200).json({ factura_url: data.Pdf, emailSent, emailError, message: emailSent ? 'La factura también fue enviada a tu correo.' : undefined });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error inesperado' });
  }
}
