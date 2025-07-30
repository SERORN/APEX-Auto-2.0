/**
 * Servicio de integración con Facturama para generación de CFDI
 * Este es un mock/simulación del servicio real de Facturama
 * En producción, aquí irían las llamadas reales a la API de Facturama
 */

export interface CFDIData {
  issuer: {
    rfc: string;
    name: string;
    fiscalRegime: string;
  };
  receiver: {
    rfc: string;
    name: string;
    email: string;
    cfdiUse: string;
    fiscalRegime: string;
  };
  invoice: {
    series: string;
    folio: string;
    date: string;
    paymentMethod: string;
    paymentForm: string;
    currency: string;
    exchangeRate: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  items: Array<{
    key: number;
    productCode: string;
    unit: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxes: Array<{
      type: string;
      rate: number;
      amount: number;
    }>;
  }>;
  additionalData?: Record<string, unknown>;
}

export interface CFDIResult {
  uuid: string;
  xmlUrl: string;
  pdfUrl: string;
  status: 'active' | 'cancelled' | 'pending';
  fiscalDigitalSeal: string;
  satCertificateNumber: string;
  issueDate: Date;
  qrCode: string;
}

export interface CFDIStatus {
  uuid: string;
  status: 'active' | 'cancelled' | 'pending';
  satStatus: 'valid' | 'cancelled' | 'not_found' | 'unknown';
  issueDate: Date;
  cancellationDate?: Date;
  validationErrors?: string[];
}

export interface CancellationResult {
  uuid: string;
  status: 'cancelled';
  cancellationDate: Date;
  satAcknowledgment: string;
}

export class FacturamaService {
  private apiUrl: string;
  private username: string;
  private password: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.apiUrl = process.env.FACTURAMA_API_URL || 'https://apisandbox.facturama.mx';
    this.username = process.env.FACTURAMA_USERNAME || 'pruebas';
    this.password = process.env.FACTURAMA_PASSWORD || 'pruebas2011';
    this.environment = (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production';
  }

  /**
   * Genera un CFDI usando la API de Facturama
   */
  async generateCFDI(cfdiData: CFDIData): Promise<CFDIResult> {
    try {
      // Validar datos de entrada
      this.validateCFDIData(cfdiData);

      // En producción aquí iría la llamada real a Facturama:
      // const response = await this.makeAPICall('POST', '/api/invoices', cfdiData);
      
      // SIMULACIÓN para desarrollo
      const mockResult = this.simulateFacturamaResponse(cfdiData);
      
      // Simular delay de la API real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockResult;

    } catch (error) {
      console.error('Error generando CFDI:', error);
      throw new Error(`Error en Facturama: ${(error as Error).message}`);
    }
  }

  /**
   * Consulta el estado de un CFDI existente
   */
  async getCFDIStatus(uuid: string): Promise<CFDIStatus> {
    try {
      if (!uuid) {
        throw new Error('UUID es requerido');
      }

      // En producción: const response = await this.makeAPICall('GET', `/api/invoices/${uuid}/status`);
      
      // SIMULACIÓN para desarrollo
      const mockStatus = this.simulateStatusResponse(uuid);
      
      // Simular delay de la API real
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockStatus;

    } catch (error) {
      console.error('Error consultando estado CFDI:', error);
      throw new Error(`Error consultando estado: ${(error as Error).message}`);
    }
  }

  /**
   * Cancela un CFDI existente
   */
  async cancelCFDI(uuid: string, reason: string = '02'): Promise<CancellationResult> {
    try {
      if (!uuid) {
        throw new Error('UUID es requerido');
      }

      // Validar motivo de cancelación (códigos SAT)
      const validReasons = ['01', '02', '03', '04'];
      if (!validReasons.includes(reason)) {
        throw new Error('Motivo de cancelación inválido');
      }

      // En producción: const response = await this.makeAPICall('DELETE', `/api/invoices/${uuid}`, { reason });
      
      // SIMULACIÓN para desarrollo
      const mockCancellation = this.simulateCancellationResponse(uuid);
      
      // Simular delay de la API real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return mockCancellation;

    } catch (error) {
      console.error('Error cancelando CFDI:', error);
      throw new Error(`Error en cancelación: ${(error as Error).message}`);
    }
  }

  /**
   * Valida los datos del CFDI antes de enviar a Facturama
   */
  private validateCFDIData(cfdiData: CFDIData): void {
    // Validar emisor
    if (!cfdiData.issuer?.rfc || !cfdiData.issuer?.name) {
      throw new Error('Datos del emisor incompletos');
    }

    // Validar receptor
    if (!cfdiData.receiver?.rfc || !cfdiData.receiver?.name) {
      throw new Error('Datos del receptor incompletos');
    }

    // Validar RFC format (básico)
    const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    if (!rfcPattern.test(cfdiData.issuer.rfc)) {
      throw new Error('RFC del emisor inválido');
    }
    if (!rfcPattern.test(cfdiData.receiver.rfc)) {
      throw new Error('RFC del receptor inválido');
    }

    // Validar items
    if (!cfdiData.items || cfdiData.items.length === 0) {
      throw new Error('Debe incluir al menos un item');
    }

    // Validar totales
    const calculatedSubtotal = cfdiData.items.reduce((sum, item) => sum + item.amount, 0);
    const tolerance = 0.01;
    
    if (Math.abs(calculatedSubtotal - cfdiData.invoice.subtotal) > tolerance) {
      throw new Error('El subtotal no coincide con la suma de los items');
    }

    // Validar moneda
    const validCurrencies = ['MXN', 'USD', 'EUR'];
    if (!validCurrencies.includes(cfdiData.invoice.currency)) {
      throw new Error('Moneda no válida');
    }

    // Validar forma de pago
    const validPaymentForms = ['01', '02', '03', '04', '05', '06', '08', '12', '13', '14', '15', '17', '23', '24', '25', '26', '27', '28', '29', '30', '99'];
    if (!validPaymentForms.includes(cfdiData.invoice.paymentForm)) {
      throw new Error('Forma de pago no válida');
    }
  }

  /**
   * Simula la respuesta de Facturama para desarrollo
   */
  private simulateFacturamaResponse(cfdiData: CFDIData): CFDIResult {
    const uuid = this.generateMockUUID();
    
    // Generar sello digital fiscal mock
    const fiscalSeal = this.generateMockSeal();
    const satCertificate = this.generateMockCertificateNumber();
    
    return {
      uuid,
      xmlUrl: `https://sandbox.facturama.mx/downloads/xml/${uuid}.xml`,
      pdfUrl: `https://sandbox.facturama.mx/downloads/pdf/${uuid}.pdf`,
      status: 'active',
      fiscalDigitalSeal: fiscalSeal,
      satCertificateNumber: satCertificate,
      issueDate: new Date(),
      qrCode: `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${uuid}&re=${cfdiData.issuer.rfc}&rr=${cfdiData.receiver.rfc}&tt=${cfdiData.invoice.total.toFixed(6)}&fe=${fiscalSeal.substring(0, 8)}`
    };
  }

  /**
   * Simula respuesta de consulta de estado
   */
  private simulateStatusResponse(uuid: string): CFDIStatus {
    // Simular diferentes estados basados en el UUID
    const lastChar = uuid.slice(-1);
    let status: 'active' | 'cancelled' | 'pending' = 'active';
    let satStatus: 'valid' | 'cancelled' | 'not_found' | 'unknown' = 'valid';
    
    if (['0', '1', '2'].includes(lastChar)) {
      status = 'cancelled';
      satStatus = 'cancelled';
    } else if (['8', '9'].includes(lastChar)) {
      status = 'pending';
      satStatus = 'unknown';
    }
    
    return {
      uuid,
      status,
      satStatus,
      issueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Hasta 30 días atrás
      cancellationDate: status === 'cancelled' ? new Date() : undefined,
      validationErrors: status === 'pending' ? ['Validación en proceso por el SAT'] : undefined
    };
  }

  /**
   * Simula respuesta de cancelación
   */
  private simulateCancellationResponse(uuid: string): CancellationResult {
    return {
      uuid,
      status: 'cancelled',
      cancellationDate: new Date(),
      satAcknowledgment: `ACK${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
  }

  /**
   * Genera un UUID mock para pruebas
   */
  private generateMockUUID(): string {
    const chars = '0123456789ABCDEF';
    const sections = [8, 4, 4, 4, 12];
    
    return sections.map(length => 
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    ).join('-');
  }

  /**
   * Genera un sello digital fiscal mock
   */
  private generateMockSeal(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/';
    return Array.from({ length: 344 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  /**
   * Genera un número de certificado SAT mock
   */
  private generateMockCertificateNumber(): string {
    return '30001000000500003416';
  }

  /**
   * Método para hacer llamadas reales a la API (para producción)
   */
  private async makeAPICall(method: string, endpoint: string, data?: unknown): Promise<unknown> {
    const url = `${this.apiUrl}${endpoint}`;
    const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Configuración para diferentes ambientes
export const FacturamaConfig = {
  sandbox: {
    apiUrl: 'https://apisandbox.facturama.mx',
    username: 'pruebas',
    password: 'pruebas2011'
  },
  production: {
    apiUrl: 'https://api.facturama.mx',
    username: process.env.FACTURAMA_PROD_USERNAME || '',
    password: process.env.FACTURAMA_PROD_PASSWORD || ''
  }
};

// Catálogos SAT para validación
export const SATCatalogs = {
  paymentMethods: {
    'PUE': 'Pago en una sola exhibición',
    'PPD': 'Pago en parcialidades o diferido'
  },
  paymentForms: {
    '01': 'Efectivo',
    '02': 'Cheque nominativo',
    '03': 'Transferencia electrónica de fondos',
    '04': 'Tarjeta de crédito',
    '05': 'Monedero electrónico',
    '06': 'Dinero electrónico',
    '08': 'Vales de despensa',
    '12': 'Dación en pago',
    '13': 'Pago por subrogación',
    '14': 'Pago por consignación',
    '15': 'Condonación',
    '17': 'Compensación',
    '23': 'Novación',
    '24': 'Confusión',
    '25': 'Remisión de deuda',
    '26': 'Prescripción o caducidad',
    '27': 'A satisfacción del acreedor',
    '28': 'Tarjeta de débito',
    '29': 'Tarjeta de servicios',
    '30': 'Aplicación de anticipos',
    '99': 'Por definir'
  },
  cfdiUses: {
    'G01': 'Adquisición de mercancías',
    'G02': 'Devoluciones, descuentos o bonificaciones',
    'G03': 'Gastos en general',
    'I01': 'Construcciones',
    'I02': 'Mobiliario y equipo de oficina por inversiones',
    'I03': 'Equipo de transporte',
    'I04': 'Equipo de computo y accesorios',
    'I05': 'Dados, troqueles, moldes, matrices y herramental',
    'I06': 'Comunicaciones telefónicas',
    'I07': 'Comunicaciones satelitales',
    'I08': 'Otra maquinaria y equipo',
    'D01': 'Honorarios médicos, dentales y gastos hospitalarios',
    'D02': 'Gastos médicos por incapacidad o discapacidad',
    'D03': 'Gastos funerales',
    'D04': 'Donativos',
    'D05': 'Intereses reales efectivamente pagados por créditos hipotecarios',
    'D06': 'Aportaciones voluntarias al SAR',
    'D07': 'Primas por seguros de gastos médicos',
    'D08': 'Gastos de transportación escolar obligatoria',
    'D09': 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones',
    'D10': 'Pagos por servicios educativos',
    'P01': 'Por definir'
  },
  currencies: {
    'MXN': 'Peso Mexicano',
    'USD': 'Dólar americano',
    'EUR': 'Euro'
  }
};
