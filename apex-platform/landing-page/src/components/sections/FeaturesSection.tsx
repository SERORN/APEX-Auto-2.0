import React from 'react'
import { CreditCard, TrendingUp, Shield, Users, Zap, Globe, Lock, Clock } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: 'Factoraje Inteligente',
      description: 'Convierte tus facturas pendientes en efectivo inmediato con nuestro sistema automatizado de factoraje.',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Líneas de Crédito',
      description: 'Accede a capital de trabajo flexible con tasas competitivas y aprobación en 48 horas.',
      color: 'text-green-500'
    },
    {
      icon: Shield,
      title: 'CFDI Automático',
      description: 'Genera facturas SAT-compliant automáticamente con firma digital y timbrado fiscal.',
      color: 'text-purple-500'
    },
    {
      icon: Users,
      title: 'Marketplace B2B',
      description: 'Conecta con proveedores y distribuidores en el ecosistema automotriz más grande de México.',
      color: 'text-orange-500'
    },
    {
      icon: Zap,
      title: 'Procesamiento Rápido',
      description: 'Automatización completa desde la solicitud hasta el desembolso en minutos, no días.',
      color: 'text-yellow-500'
    },
    {
      icon: Globe,
      title: 'Integración Total',
      description: 'Conecta con Amazon, Google Shopping, ERPs y más de 50 sistemas empresariales.',
      color: 'text-cyan-500'
    },
    {
      icon: Lock,
      title: 'Seguridad Bancaria',
      description: 'Encriptación de grado militar y cumplimiento PCI DSS para proteger tu información.',
      color: 'text-red-500'
    },
    {
      icon: Clock,
      title: 'Disponible 24/7',
      description: 'Plataforma siempre activa con soporte técnico y financiero las 24 horas del día.',
      color: 'text-indigo-500'
    }
  ]

  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tecnología Financiera
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              de Vanguardia
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Herramientas financieras integrales diseñadas específicamente para el ecosistema 
            automotriz mexicano, con la tecnología más avanzada del mercado.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2.5B+</div>
            <div className="text-slate-400">Financiamiento Procesado</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">15,000+</div>
            <div className="text-slate-400">Empresas Conectadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">98.5%</div>
            <div className="text-slate-400">Tasa de Aprobación</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
            <div className="text-slate-400">Tiempo Promedio</div>
          </div>
        </div>
      </div>
    </section>
  )
}
