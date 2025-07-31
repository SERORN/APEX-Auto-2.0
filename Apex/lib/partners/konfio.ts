/**
 * Partner de Factoring: Konfío
 * Módulo mock para simular integración con Konfío para factoring de facturas
 */

export interface FactoringRequest {
  invoiceId: string;
  userId: string;
  amount: number;
  currency: string;
  dueDate: Date;
  clientInfo: {
    name: string;
    rfc: string;
    email: string;
    address: string;
  };
  userCreditScore: number;
  userKycStatus: boolean;
  invoiceAge: number; // días desde creación
}

export interface FactoringResponse {
  status: 'aprobado' | 'rechazado' | 'pendiente';
  partnerName: string;
  anticipatedAmount: number;
  feePercentage: number;
  processingTime: string;
  message: string;
  conditions?: string[];
  rejectReason?: string;
}

/**
 * Simula solicitud de factoring a Konfío
 */
export async function requestFactoring(request: FactoringRequest): Promise<FactoringResponse> {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const {
    amount,
    currency,
    dueDate,
    userCreditScore,
    userKycStatus,
    invoiceAge
  } = request;

  // Validaciones básicas de Konfío
  if (!userKycStatus) {
    return {
      status: 'rechazado',
      partnerName: 'Konfío',
      anticipatedAmount: 0,
      feePercentage: 0,
      processingTime: 'Inmediato',
      message: 'KYC incompleto. Completa tu verificación para continuar.',
      rejectReason: 'kyc_incomplete'
    };
  }

  if (amount < 5000) {
    return {
      status: 'rechazado',
      partnerName: 'Konfío',
      anticipatedAmount: 0,
      feePercentage: 0,
      processingTime: 'Inmediato',
      message: 'Monto mínimo de factoring: $5,000 MXN',
      rejectReason: 'amount_too_low'
    };
  }

  if (userCreditScore < 650) {
    return {
      status: 'rechazado',
      partnerName: 'Konfío',
      anticipatedAmount: 0,
      feePercentage: 0,
      processingTime: 'Inmediato',
      message: 'Score de crédito insuficiente para factoring automático.',
      rejectReason: 'low_credit_score'
    };
  }

  // Calcular días hasta vencimiento
  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 5) {
    return {
      status: 'rechazado',
      partnerName: 'Konfío',
      anticipatedAmount: 0,
      feePercentage: 0,
      processingTime: 'Inmediato',
      message: 'La factura debe tener al menos 5 días hasta vencimiento.',
      rejectReason: 'due_date_too_close'
    };
  }

  if (invoiceAge > 30) {
    return {
      status: 'rechazado',
      partnerName: 'Konfío',
      anticipatedAmount: 0,
      feePercentage: 0,
      processingTime: 'Inmediato',
      message: 'La factura no puede tener más de 30 días de antigüedad.',
      rejectReason: 'invoice_too_old'
    };
  }

  // Calcular comisión basada en riesgo
  let feePercentage = 2.5; // Base 2.5%

  // Ajustes por score de crédito
  if (userCreditScore >= 750) {
    feePercentage -= 0.5; // Descuento por buen score
  } else if (userCreditScore < 700) {
    feePercentage += 0.5; // Incremento por score regular
  }

  // Ajustes por tiempo hasta vencimiento
  if (daysUntilDue > 60) {
    feePercentage += 0.3; // Más riesgo = más comisión
  } else if (daysUntilDue < 15) {
    feePercentage -= 0.2; // Menos riesgo = menos comisión
  }

  // Ajustes por monto
  if (amount > 50000) {
    feePercentage -= 0.2; // Descuento por volumen
  }

  // Simular probabilidad de aprobación (85% de éxito si pasa validaciones)
  const isApproved = Math.random() > 0.15;

  if (!isApproved) {
    return {
      status: 'pendiente',
      partnerName: 'Konfío',
      anticipatedAmount: 0,
      feePercentage: 0,
      processingTime: '24-48 horas',
      message: 'Tu solicitud requiere revisión manual. Te contactaremos pronto.',
      conditions: ['Revisión manual requerida', 'Validación adicional de documentos']
    };
  }

  // Calcular monto anticipado
  const commission = amount * (feePercentage / 100);
  const anticipatedAmount = amount - commission;

  return {
    status: 'aprobado',
    partnerName: 'Konfío',
    anticipatedAmount: Math.round(anticipatedAmount * 100) / 100,
    feePercentage: Math.round(feePercentage * 100) / 100,
    processingTime: '2-4 horas',
    message: `¡Aprobado! Recibirás $${anticipatedAmount.toLocaleString('es-MX')} ${currency}`,
    conditions: [
      'El monto se deposita en 2-4 horas hábiles',
      'Konfío cobrará directamente a tu cliente al vencimiento',
      'Sin penalizaciones por pago anticipado del cliente'
    ]
  };
}

/**
 * Simula consulta de status de factoring
 */
export async function getFactoringStatus(factoringId: string): Promise<{
  id: string;
  status: 'procesando' | 'depositado' | 'cobrado' | 'vencido';
  depositedAt?: Date;
  collectedAt?: Date;
  message: string;
}> {
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simular diferentes estados
  const statuses = ['procesando', 'depositado', 'cobrado'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as any;

  const statusMessages = {
    procesando: 'Preparando transferencia bancaria',
    depositado: 'Fondos depositados en tu cuenta',
    cobrado: 'Factura cobrada exitosamente',
    vencido: 'Factura vencida - gestionando cobro'
  };

  return {
    id: factoringId,
    status: randomStatus,
    depositedAt: randomStatus === 'depositado' || randomStatus === 'cobrado' ? new Date() : undefined,
    collectedAt: randomStatus === 'cobrado' ? new Date() : undefined,
    message: statusMessages[randomStatus as keyof typeof statusMessages]
  };
}

/**
 * Simula webhook de Konfío para notificaciones
 */
export function simulateKonfioWebhook(event: 'deposit_completed' | 'collection_completed' | 'collection_failed') {
  const webhookData = {
    event,
    timestamp: new Date().toISOString(),
    data: {
      factoring_id: `konfio_${Date.now()}`,
      invoice_id: `inv_${Date.now()}`,
      amount: Math.floor(Math.random() * 50000) + 5000,
      currency: 'MXN'
    }
  };

  console.log('🔔 Konfío Webhook:', webhookData);
  return webhookData;
}

/**
 * Configuración de Konfío (simulated)
 */
export const KonfioConfig = {
  name: 'Konfío',
  type: 'factoring',
  minAmount: 5000,
  maxAmount: 500000,
  currency: ['MXN'],
  baseFeePercentage: 2.5,
  processingTime: '2-4 horas',
  requirements: [
    'KYC completo',
    'Score de crédito ≥ 650',
    'Factura con vencimiento ≥ 5 días',
    'Antigüedad de factura ≤ 30 días'
  ],
  benefits: [
    'Depósito rápido en 2-4 horas',
    'Sin garantías adicionales',
    'Cobro directo al cliente',
    'Comisiones competitivas'
  ]
};
