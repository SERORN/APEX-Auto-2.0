# 🚀 Apex - Plataforma Fintech + Autopartes

Plataforma moderna que combina servicios financieros (factoraje, crédito BNPL, facturación CFDI) con marketplace de autopartes, construida con Next.js 15 y MongoDB.

## ✨ Características Principales

- 💰 **Wallet Digital** - Gestión completa de saldos, cashback y créditos
- 📊 **Factoraje** - Adelanto de facturas con integración Konfío
- 💳 **Crédito BNPL** - Líneas de crédito flexibles con Kueski
- 🧾 **CFDI México** - Generación automática de facturas SAT
- 🔐 **Autenticación** - Sistema multi-rol con NextAuth.js
- 📱 **Responsive** - Diseño adaptable con Tailwind CSS

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15.4.3 + React 19 + TypeScript
- **Backend**: MongoDB + Mongoose + Next.js API Routes
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS 4 + Radix UI
- **Despliegue**: Vercel Ready

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- MongoDB Atlas account
- Variables de entorno configuradas

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd apex
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
apex/
├── app/                    # App Router (Next.js 15)
│   ├── api/fintech/       # APIs REST del backend
│   └── [locale]/          # Rutas internacionalizadas
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y servicios
│   ├── db.ts             # Conexión MongoDB
│   └── partners/         # Integraciones fintech
├── models/               # Modelos Mongoose
├── public/               # Assets estáticos
└── scripts/              # Scripts de utilidad
```

## 🔧 Comandos Disponibles

```bash
npm run dev         # Desarrollo con Turbopack
npm run build       # Build de producción  
npm run start       # Servidor de producción
npm run lint        # Linting con ESLint
```

## 🌐 APIs del Backend

### Fintech Endpoints

- `GET/POST/PATCH /api/fintech/wallet` - Gestión de billeteras
- `GET/POST /api/fintech/request-factoring` - Factoraje de facturas  
- `GET/POST /api/fintech/request-credit` - Líneas de crédito BNPL
- `GET/POST/DELETE /api/fintech/generate-cfdi` - Facturas CFDI

Ver documentación completa: [`README_BACKEND_COMPLETE.md`](./README_BACKEND_COMPLETE.md)

## 🔐 Variables de Entorno

Configura estas variables en `.env.local`:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication  
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Partners Fintech
KONFIO_API_KEY=your-api-key
KUESKI_CLIENT_ID=your-client-id  
FACTURAMA_USERNAME=your-username

# Company Data (for CFDI)
COMPANY_RFC=your-rfc
COMPANY_NAME=your-company-name
```

Ver todas las variables: [`.env.example`](./.env.example)

## 📊 Base de Datos

### Modelos Principales
- **User** - Usuarios con KYC y scoring crediticio
- **Wallet** - Billeteras digitales con crédito
- **Transaction** - Historial de transacciones  
- **Invoice** - Facturas con CFDI
- **CreditLine** - Líneas de crédito BNPL

## 🚀 Despliegue en Vercel

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "Deploy ready"
   git push origin main
   ```

2. **Conectar en Vercel**
   - Importar proyecto desde GitHub
   - Configurar variables de entorno
   - Deploy automático

3. **Configurar MongoDB**
   - Whitelist IPs de Vercel
   - Actualizar NEXTAUTH_URL

## 🧪 Testing

```bash
# Test APIs manualmente
node scripts/test-apis.js

# Verificar build
npm run build && npm start
```

## 📝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

- 📖 **Documentación**: [README_BACKEND_COMPLETE.md](./README_BACKEND_COMPLETE.md)
- 🐛 **Issues**: GitHub Issues
- 💬 **Contacto**: [tu-email@apex.com]

## 📄 Licencia

Este proyecto es privado y propietario.

---

**Desarrollado con ❤️ por el equipo Apex**
