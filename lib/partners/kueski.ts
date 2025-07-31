/**
 * Partner de Crédito: Kueski
 * Módulo mock para simular integración con Kueski para líneas de crédito BNPL
 */

export interface CreditRequest {
  userId: string;
  userProfile: {
    name: string;
    email: string;
    creditScore: number;
    registeredAt: Date;
    kycCompleted: boolean;
    walletBalance: number;
  };
  requestDetails: {
    amount: number;
    paymentTerms: number;
    monthlyIncome: number;
    purpose: string;
  };
}

export interface CreditResponse {
  approved: boolean;
  approvedAmount?: number;
  interestRate: number;
  paymentTerms: number;
  monthlyPayment?: number;
  totalPayments?: number;
  apr: number;
  fees?: {
    originationFee: number;
    lateFee: number;
    prepaymentFee: number;
  };
  conditions?: string[];
  message: string;
  debtToIncomeRatio?: number;
  rejectReason?: string;
}

/**
 * Simula solicitud de línea de crédito BNPL a Kueski
 */
export async function requestBNPL(request: CreditRequest): Promise<CreditResponse> {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 3000));

  const {
    userProfile,
    requestDetails
  } = request;

  const {
    creditScore,
    kycCompleted,
    walletBalance,
    registeredAt
  } = userProfile;

  const {
    amount,
    paymentTerms,
    monthlyIncome
  } = requestDetails;

  // Validaciones básicas de Kueski
  if (!kycCompleted) {
    return {
      approved: false,
      interestRate: 0,
      paymentTerms: 0,
      apr: 0,
      message: 'Verificación KYC incompleta. Completa tu perfil para continuar.',
      rejectReason: 'kyc_incomplete'
    };
  }

  if (amount < 1000) {
    return {
      approved: false,
      interestRate: 0,
      paymentTerms: 0,
      apr: 0,
      message: 'Monto mínimo de línea de crédito: $1,000 MXN',
      rejectReason: 'amount_too_low'
    };
  }

  if (amount > 100000) {
    return {
      approved: false,
      interestRate: 0,
      paymentTerms: 0,
      apr: 0,
      message: 'Monto máximo de línea de crédito: $100,000 MXN',
      rejectReason: 'amount_too_high'
    };
  }

  // Verificar antigüedad mínima (30 días)
  const accountAgeMonths = (new Date().getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (accountAgeMonths < 1) {
    return {
      approved: false,
      interestRate: 0,
      paymentTerms: 0,
      apr: 0,
      message: 'Requieres al menos 30 días de antigüedad en la plataforma.',
      rejectReason: 'account_too_new'
    };
  }

  // Calcular ratio deuda-ingreso si se proporciona ingreso
  let debtToIncomeRatio = 0;
  if (monthlyIncome > 0) {
    const estimatedMonthlyPayment = calculateEstimatedPayment(amount, paymentTerms);
    debtToIncomeRatio = (estimatedMonthlyPayment / monthlyIncome) * 100;
    
    if (debtToIncomeRatio > 30) {
      return {
        approved: false,
        interestRate: 0,
        paymentTerms: 0,
        apr: 0,
        message: 'El pago mensual excede el 30% de tus ingresos declarados.',
        rejectReason: 'high_debt_to_income',
        debtToIncomeRatio
      };
    }
  }

  // Evaluación por score de crédito
  if (creditScore < 600) {
    return {
      approved: false,
      interestRate: 0,
      paymentTerms: 0,
      apr: 0,
      message: 'Score de crédito insuficiente. Mínimo requerido: 600',
      rejectReason: 'low_credit_score'
    };
  }

  // Determinar monto aprobado basado en score y otros factores
  let approvedAmount = amount;
  let baseInterestRate = 15; // Tasa base anual 15%

  // Ajustes por score de crédito
  if (creditScore >= 750) {
    baseInterestRate = 8; // Excelente score
    approvedAmount = Math.min(amount, 100000);
  } else if (creditScore >= 700) {
    baseInterestRate = 12; // Buen score
    approvedAmount = Math.min(amount, 75000);
  } else if (creditScore >= 650) {
    baseInterestRate = 18; // Score regular
    approvedAmount = Math.min(amount, 50000);
  } else {
    baseInterestRate = 25; // Score bajo pero aceptable
    approvedAmount = Math.min(amount, 25000);
  }

  // Ajustes por balance en wallet (historial en plataforma)
  if (walletBalance > 10000) {
    baseInterestRate -= 1; // Descuento por buen historial
    approvedAmount *= 1.2; // Incremento en monto aprobado
  }

  // Ajustes por antigüedad
  if (accountAgeMonths > 12) {
    baseInterestRate -= 0.5;
    approvedAmount *= 1.1;
  }

  // Límites finales
  approvedAmount = Math.min(approvedAmount, 100000);
  approvedAmount = Math.max(approvedAmount, 1000);
  
  // Redondear a miles
  approvedAmount = Math.round(approvedAmount / 1000) * 1000;

  // Simular probabilidad de aprobación final (90% si pasa todas las validaciones)
  const isApproved = Math.random() > 0.1;

  if (!isApproved) {
    return {
      approved: false,
      interestRate: 0,
      paymentTerms: 0,
      apr: 0,
      message: 'Tu solicitud requiere revisión manual. Te contactaremos en 24-48 horas.',
      rejectReason: 'manual_review_required'
    };
  }

  // Calcular términos finales
  const monthlyInterestRate = baseInterestRate / 100 / 12;
  const numberOfPayments = Math.ceil(paymentTerms / 30); // Convertir días a meses
  
  let monthlyPayment = 0;
  if (monthlyInterestRate > 0) {
    monthlyPayment = approvedAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  } else {
    monthlyPayment = approvedAmount / numberOfPayments;
  }

  const totalPayments = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayments - approvedAmount;
  const apr = (totalInterest / approvedAmount) * (365 / paymentTerms) * 100;

  // Definir comisiones
  const fees = {
    originationFee: Math.round(approvedAmount * 0.02), // 2% del monto
    lateFee: 300, // $300 por pago tardío
    prepaymentFee: 0 // Sin comisión por pago anticipado
  };

  return {
    approved: true,
    approvedAmount: Math.round(approvedAmount),
    interestRate: Math.round(baseInterestRate * 100) / 100,
    paymentTerms,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayments: Math.round(totalPayments * 100) / 100,
    apr: Math.round(apr * 100) / 100,
    fees,
    conditions: [
      'Línea de crédito renovable',
      `Pago mínimo mensual: $${Math.round(monthlyPayment * 100) / 100}`,
      'Sin penalizaciones por pago anticipado',
      'Intereses solo sobre monto utilizado',
      'Renovación automática sujeta a evaluación'
    ],
    message: `¡Felicidades! Línea de crédito aprobada por $${approvedAmount.toLocaleString('es-MX')} MXN`,
    debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100
  };
}

/**
 * Función auxiliar para calcular pago estimado
 */
function calculateEstimatedPayment(amount: number, termDays: number): number {
  const months = termDays / 30;
  const estimatedRate = 0.015; // 1.5% mensual estimado
  return amount * estimatedRate * months;
}

/**
 * Simula uso de línea de crédito
 */
export async function useCreditLine(creditLineId: string, amount: number): Promise<{
  success: boolean;
  transactionId?: string;
  newBalance: number;
  remainingCredit: number;
  nextPaymentDue: Date;
  message: string;
}> {
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simular validaciones
  if (amount < 100) {
    return {
      success: false,
      newBalance: 0,
      remainingCredit: 0,
      nextPaymentDue: new Date(),
      message: 'Monto mínimo de uso: $100 MXN'
    };
  }

  // Simular éxito
  const transactionId = `kueski_tx_${Date.now()}`;
  const nextPaymentDue = new Date();
  nextPaymentDue.setDate(nextPaymentDue.getDate() + 30);

  return {
    success: true,
    transactionId,
    newBalance: amount,
    remainingCredit: Math.max(0, 50000 - amount), // Simulado
    nextPaymentDue,
    message: `Crédito utilizado exitosamente. Fondos disponibles en tu wallet.`
  };
}

/**
 * Simula pago de línea de crédito
 */
export async function makePayment(creditLineId: string, amount: number): Promise<{
  success: boolean;
  paymentId?: string;
  remainingBalance: number;
  nextPaymentDue?: Date;
  message: string;
}> {
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const paymentId = `kueski_pay_${Date.now()}`;
  
  return {
    success: true,
    paymentId,
    remainingBalance: Math.max(0, 25000 - amount), // Simulado
    nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    message: `Pago procesado correctamente. Gracias por tu puntualidad.`
  };
}

/**
 * Configuración de Kueski (simulated)
 */
export const KueskiConfig = {
  name: 'Kueski',
  type: 'bnpl_credit_line',
  minAmount: 1000,
  maxAmount: 100000,
  currency: ['MXN'],
  baseInterestRate: 15,
  minCreditScore: 600,
  minAccountAge: 30, // días
  maxDebtToIncomeRatio: 30, // porcentaje
  paymentTermOptions: [30, 60, 90, 120], // días
  features: [
    'Línea de crédito renovable',
    'Intereses solo sobre monto usado',
    'Aprobación automática en minutos',
    'Sin comisiones por pago anticipado',
    'Incrementos automáticos por buen historial'
  ],
  requirements: [
    'KYC completo',
    'Score de crédito ≥ 600',
    'Antigüedad mínima: 30 días',
    'Ratio deuda-ingreso ≤ 30%'
  ]
};
