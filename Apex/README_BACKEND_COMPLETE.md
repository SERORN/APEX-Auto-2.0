# 🚀 APEX - Backend Fintech Completamente Modular

## 📋 Resumen del Proyecto

**Apex** es una plataforma híbrida de fintech + autopartes que ha sido migrada completamente desde ToothPick (dental) hacia un ecosistema financiero y automotriz moderno y escalable.

## 🏗️ Arquitectura del Backend

### Base de Datos: MongoDB Atlas + Mongoose
- **Conexión**: MongoDB Atlas con configuración para entornos development/production
- **ODM**: Mongoose con TypeScript para type safety completo
- **Índices**: Optimizados para consultas frecuentes (userId, status, date)

### 📊 Modelos de Datos

#### 1. User Model (`/models/User.ts`)
```typescript
interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'provider' | 'distributor' | 'admin';
  fiscalData: {
    rfc: string;
    businessName: string;
    address: string;
    fiscalRegime: string;
  };
  creditScore: number;
  isActive: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  kycData: {
    identityDocumentUrl: string;
    proofOfAddressUrl: string;
    verificationDate: Date;
  };
}
```

#### 2. Wallet Model (`/models/Wallet.ts`)
```typescript
interface IWallet {
  userId: ObjectId;
  balance: number;
  cashbackAvailable: number;
  frozenBalance: number;
  creditLimit: number;
  usedCredit: number;
  transactions: ObjectId[];
  currency: 'MXN' | 'USD';
  isActive: boolean;
}
```

#### 3. Transaction Model (`/models/Transaction.ts`)
```typescript
interface ITransaction {
  fromUser?: ObjectId;
  toUser?: ObjectId;
  amount: number;
  type: 'pago' | 'cashback' | 'retiro' | 'compra' | 'deposito' | 'transferencia' | 'credito' | 'pago_credito';
  status: 'pendiente' | 'completado' | 'fallido' | 'cancelado';
  description: string;
  reference?: string;
  metadata?: {
    orderId?: string;
    invoiceId?: string;
    partnerId?: string;
    fees?: number;
  };
}
```

#### 4. Invoice Model (`/models/Invoice.ts`)
```typescript
interface IInvoice {
  invoiceNumber: string;
  customerId: ObjectId;
  providerId: ObjectId;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: 'MXN' | 'USD';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  cfdiData?: {
    uuid: string;
    xmlUrl: string;
    pdfUrl: string;
    fiscalDigitalSeal: string;
  };
}
```

#### 5. CreditLine Model (`/models/CreditLine.ts`)
```typescript
interface ICreditLine {
  userId: ObjectId;
  partnerId: string;
  creditLimit: number;
  availableCredit: number;
  interestRate: number;
  paymentTermDays: number;
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'cancelled';
  approvalData: {
    creditScore: number;
    monthlyIncome: number;
    approvedAt: Date;
    approvedBy: string;
  };
}
```

## 🔌 API Endpoints Fintech

### 1. `/api/fintech/request-factoring` 
**Métodos**: POST, GET
- **POST**: Solicitar factoraje de facturas
- **GET**: Consultar estado de solicitudes de factoraje
- **Integración**: Konfío (simulado)

```bash
# Ejemplo de solicitud de factoraje
POST /api/fintech/request-factoring
{
  "invoiceId": "64a1b2c3d4e5f6789abc1234",
  "requestedAmount": 45000,
  "paymentTermDays": 30,
  "clientType": "corporate"
}
```

### 2. `/api/fintech/request-credit`
**Métodos**: POST, GET  
- **POST**: Solicitar línea de crédito BNPL
- **GET**: Consultar líneas de crédito activas
- **Integración**: Kueski (simulado)

```bash
# Ejemplo de solicitud de crédito
POST /api/fintech/request-credit
{
  "requestedAmount": 25000,
  "paymentTermMonths": 12,
  "monthlyIncome": 35000,
  "purpose": "working_capital"
}
```

### 3. `/api/fintech/wallet`
**Métodos**: GET, POST, PATCH
- **GET**: Obtener estado del wallet del usuario
- **POST**: Agregar saldo/cashback (administración/pruebas)
- **PATCH**: Operaciones específicas (usar crédito, pagar crédito, usar cashback)

```bash
# Ejemplo de operación de wallet
PATCH /api/fintech/wallet
{
  "operation": "use_credit",
  "amount": 5000,
  "creditLineId": "64a1b2c3d4e5f6789abc5678"
}
```

### 4. `/api/fintech/generate-cfdi`
**Métodos**: POST, GET, DELETE
- **POST**: Generar factura CFDI (SAT México)
- **GET**: Consultar estado de CFDI existente
- **DELETE**: Cancelar CFDI
- **Integración**: Facturama (simulado)

```bash
# Ejemplo de generación de CFDI
POST /api/fintech/generate-cfdi
{
  "invoiceId": "64a1b2c3d4e5f6789abc9999",
  "clientData": {
    "name": "Empresa Cliente SA",
    "rfc": "ECL010101ABC",
    "email": "cliente@empresa.com",
    "fiscalRegime": "601"
  },
  "paymentMethod": "PUE",
  "cfdiUse": "G03"
}
```

## 🤝 Integraciones con Partners

### 1. Konfío (`/lib/partners/konfio.ts`)
**Propósito**: Factoraje de facturas  
**Características**:
- Simulación completa del flujo de factoraje
- Scoring crediticio automático
- Comisión del 2.5% base + risk premium
- Webhook simulation para cambios de estado
- Configuración flexible de términos

```typescript
interface FactoringRequest {
  invoiceData: {
    amount: number;
    issueDate: Date;
    dueDate: Date;
  };
  clientData: {
    rfc: string;
    creditScore: number;
    monthlyRevenue: number;
  };
  requestedAmount: number;
  paymentTermDays: number;
}
```

### 2. Kueski (`/lib/partners/kueski.ts`)
**Propósito**: Líneas de crédito BNPL  
**Características**:
- Scoring crediticio avanzado
- Tasas de interés dinámicas (8-25% según score)
- Múltiples términos de pago (6-36 meses)
- Simulación de bureau crediticio
- Gestión completa del ciclo de vida del crédito

```typescript
interface CreditRequest {
  userData: {
    monthlyIncome: number;
    creditScore: number;
    employmentStatus: string;
  };
  requestedAmount: number;
  paymentTermMonths: number;
  purpose: 'working_capital' | 'inventory' | 'equipment';
}
```

### 3. Facturama (`/lib/partners/facturama.ts`)
**Propósito**: Generación y gestión de CFDI (SAT México)  
**Características**:
- Generación completa de CFDI 4.0
- Validación SAT en tiempo real
- Cancelación de facturas
- Descarga de XML/PDF
- Códigos y catálogos SAT actualizados

```typescript
interface CFDIData {
  issuer: {
    rfc: string;
    name: string;
    fiscalRegime: string;
  };
  receiver: {
    rfc: string;
    name: string;
    cfdiUse: string;
  };
  items: CFDIItem[];
  paymentMethod: string;
  currency: string;
}
```

## 🔐 Seguridad y Autenticación

### NextAuth.js Configuration
- **Providers**: Credentials, Google, GitHub
- **JWT**: Tokens seguros con rotación automática
- **Session**: Gestión de sesiones servidor y cliente
- **Roles**: Sistema multi-rol (customer, provider, distributor, admin)

### Middleware de Seguridad
```typescript
// Todas las rutas /api/fintech/* requieren autenticación
const session = await getServerSession();
if (!session?.user) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
```

## 🧪 Testing y Desarrollo

### Variables de Entorno Requeridas
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apex

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Partners (simulados en desarrollo)
KONFIO_API_KEY=mock-api-key
KUESKI_CLIENT_ID=mock-client-id
FACTURAMA_USERNAME=pruebas
FACTURAMA_PASSWORD=pruebas2011

# Company Data (para CFDI)
COMPANY_RFC=AAA010101AAA
COMPANY_NAME=Apex Fintech & Automotive
COMPANY_FISCAL_REGIME=601
```

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Desarrollo con Turbopack
npm run dev

# Build de producción
npm run build

# Linting
npm run lint

# Testing (configurado con Jest)
npm run test
```

## 📦 Estructura de Archivos Backend

```
tooth-pick/
├── models/                    # Mongoose models
│   ├── User.ts
│   ├── Wallet.ts
│   ├── Transaction.ts
│   ├── Invoice.ts
│   └── CreditLine.ts
├── app/api/fintech/          # API routes
│   ├── request-factoring/
│   │   └── route.ts
│   ├── request-credit/
│   │   └── route.ts
│   ├── wallet/
│   │   └── route.ts
│   └── generate-cfdi/
│       └── route.ts
├── lib/
│   ├── db.ts                 # MongoDB connection
│   └── partners/             # Partner integrations
│       ├── konfio.ts
│       ├── kueski.ts
│       └── facturama.ts
├── middleware.ts             # NextAuth middleware
└── next.config.ts           # Next.js configuration
```

## 🎯 Casos de Uso Principales

### 1. Flujo de Factoraje
1. Usuario sube factura al sistema
2. Sistema valida datos y calcula scoring
3. Envía solicitud a Konfío
4. Konfío evalúa y aprueba/rechaza
5. Si aprueba, fondos se depositan en wallet
6. Sistema actualiza estado y notifica usuario

### 2. Flujo de Crédito BNPL
1. Usuario solicita línea de crédito
2. Sistema colecta datos financieros
3. Envía solicitud a Kueski
4. Kueski hace scoring y determina términos
5. Usuario acepta términos
6. Línea de crédito activada en wallet

### 3. Flujo de Facturación CFDI
1. Usuario crea factura en sistema
2. Completa datos fiscales del cliente
3. Sistema envía a Facturama para timbrado
4. SAT valida y regresa UUID
5. Sistema genera PDF/XML descargables
6. Cliente recibe factura por email

## 📊 Métricas y Monitoreo

### KPIs del Sistema
- **Factoraje**: Volumen procesado, tasa de aprobación, tiempo promedio
- **Crédito**: Líneas activas, utilización promedio, morosidad
- **Facturación**: CFDIs generados, tasa de éxito, tiempo de procesamiento
- **Wallet**: Transacciones diarias, saldo promedio, cashback otorgado

### Logging y Debugging
```typescript
// Todos los endpoints incluyen logging detallado
console.error('Error en operación:', error);
return NextResponse.json({
  error: 'Error interno del servidor',
  details: process.env.NODE_ENV === 'development' ? error.message : undefined
});
```

## 🚀 Deployment

### Vercel Configuration
```json
{
  "builds": [
    {
      "src": "next.config.ts",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### Variables de Producción
- Todas las variables de entorno deben configurarse en Vercel
- MongoDB Atlas con IP whitelist para Vercel
- NextAuth configurado con dominio de producción
- Partners configurados con credenciales reales

## 🔄 Próximos Pasos

### Fase 1: Core Funcional ✅
- [x] Modelos de datos completos
- [x] APIs REST funcionales  
- [x] Integraciones partner simuladas
- [x] Autenticación y seguridad

### Fase 2: Mejoras (Próximo)
- [ ] Tests unitarios e integración
- [ ] Rate limiting y throttling
- [ ] Webhooks reales de partners
- [ ] Dashboard de administración
- [ ] Reportes y analytics

### Fase 3: Escalabilidad
- [ ] Microservicios
- [ ] Queue system (Redis/Bull)
- [ ] Caching strategies
- [ ] Load balancing
- [ ] Monitoring avanzado

---

## 📞 Soporte Técnico

Para dudas sobre la implementación o deployment, revisar:
1. Logs en `/api/fintech/*` endpoints
2. Variables de entorno configuradas
3. Estado de conexión MongoDB
4. Configuración NextAuth

**Autor**: GitHub Copilot  
**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024
