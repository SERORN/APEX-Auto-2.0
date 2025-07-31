import React from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, TrendingUp, FileText, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: CreditCard,
      title: 'Factoraje Empresarial',
      description: 'Convierte tus facturas pendientes en efectivo inmediato',
      features: [
        'Adelanto hasta 90% del valor de la factura',
        'Aprobación en menos de 24 horas',
        'Sin garantías adicionales requeridas',
        'Tasas desde 1.8% mensual'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: TrendingUp,
      title: 'Líneas de Crédito',
      description: 'Capital de trabajo flexible para hacer crecer tu negocio',
      features: [
        'Líneas desde $100,000 hasta $50M MXN',
        'Tasas preferenciales para autopartes',
        'Pagos flexibles según flujo de caja',
        'Renovación automática disponible'
      ],
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: FileText,
      title: 'Facturación CFDI',
      description: 'Sistema completo de facturación electrónica SAT',
      features: [
        'Generación automática de CFDI',
        'Timbrado fiscal en tiempo real',
        'Cancelación y complementos',
        'Reportes fiscales automatizados'
      ],
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace B2B',
      description: 'Plataforma de comercio para proveedores y distribuidores',
      features: [
        'Catálogo con +500,000 autopartes',
        'Comisiones competitivas (5.5% B2B)',
        'Logística integrada nationwide',
        'Financiamiento en punto de venta'
      ],
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    }
  ]

  return (
    <section id="services" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Servicios Financieros
            <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Especializados
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Soluciones financieras diseñadas específicamente para el sector automotriz mexicano, 
            desde PyMEs hasta grandes distribuidores.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {service.title}
                    </h3>
                    <p className="text-slate-300">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 transition-opacity group-hover:shadow-lg`}>
                  Solicitar Ahora
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 pointer-events-none`} />
              </div>
            )
          })}
        </div>

        {/* Integration Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Integración Total con tu Ecosistema
          </h3>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Conectamos con más de 50 sistemas: Amazon, Google Shopping, SAP, Oracle, 
            Contpaq, y todos los ERPs más utilizados en México.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Amazon', 'Google Shopping', 'SAP', 'Oracle', 'Contpaq', 'Shopify'].map((integration) => (
              <div key={integration} className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-white font-medium">{integration}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
            Ver Todas las Integraciones
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
