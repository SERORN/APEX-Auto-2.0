import React from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Star, Zap } from 'lucide-react'

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'Gratis',
      period: '',
      description: 'Perfect para comenzar a usar la plataforma',
      features: [
        'Hasta 5 facturas CFDI/mes',
        'Acceso básico al marketplace',
        'Soporte por email',
        'Dashboard básico',
        'Integración con 1 ERP'
      ],
      limitations: [
        'Sin factoraje disponible',
        'Sin líneas de crédito',
        'Comisiones estándar 8.5%'
      ],
      cta: 'Comenzar Gratis',
      popular: false,
      gradient: 'from-slate-600 to-slate-700'
    },
    {
      name: 'Business',
      price: '$2,999',
      period: '/mes',
      description: 'Ideal para empresas en crecimiento',
      features: [
        'CFDI ilimitados',
        'Factoraje hasta $500K MXN',
        'Línea de crédito $1M MXN',
        'Comisiones preferenciales 5.5%',
        'Marketplace completo',
        'Integraciones ilimitadas',
        'Soporte prioritario',
        'Analytics avanzado',
        'API personalizada'
      ],
      limitations: [],
      cta: 'Solicitar Demo',
      popular: true,
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      period: '',
      description: 'Solución completa para grandes empresas',
      features: [
        'Todo lo de Business',
        'Factoraje ilimitado',
        'Líneas de crédito $50M+',
        'Comisiones negociables',
        'Gerente de cuenta dedicado',
        'SLA 99.9% garantizado',
        'Soporte 24/7',
        'Integraciones custom',
        'White-label disponible',
        'Training especializado'
      ],
      limitations: [],
      cta: 'Contactar Ventas',
      popular: false,
      gradient: 'from-purple-600 to-pink-600'
    }
  ]

  const additionalServices = [
    {
      service: 'Factoraje',
      starter: 'No disponible',
      business: '1.8% - 2.5% mensual',
      enterprise: 'Tasas preferenciales'
    },
    {
      service: 'Líneas de Crédito',
      starter: 'No disponible',
      business: 'Hasta $1M MXN',
      enterprise: 'Sin límite'
    },
    {
      service: 'Comisiones Marketplace',
      starter: '8.5% (B2C)',
      business: '5.5% (B2B)',
      enterprise: 'Negociables'
    },
    {
      service: 'Soporte Técnico',
      starter: 'Email (48h)',
      business: 'Email + Chat (4h)',
      enterprise: '24/7 + Teléfono'
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Planes que Crecen
            <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Contigo
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Desde startups hasta grandes corporativos, tenemos el plan perfecto 
            para impulsar tu crecimiento financiero.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 scale-105' 
                  : 'bg-white/5 border border-white/10'
              } backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Más Popular
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-400 line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                } transition-all duration-300`}
                size="lg"
              >
                {plan.cta}
                {plan.popular && <Zap className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Comparación Detallada de Servicios
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-white font-semibold">Servicio</th>
                  <th className="text-center py-4 text-white font-semibold">Starter</th>
                  <th className="text-center py-4 text-white font-semibold">Business</th>
                  <th className="text-center py-4 text-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {additionalServices.map((service, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-4 text-slate-300 font-medium">{service.service}</td>
                    <td className="py-4 text-center text-slate-400">{service.starter}</td>
                    <td className="py-4 text-center text-blue-300">{service.business}</td>
                    <td className="py-4 text-center text-purple-300">{service.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Quick */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">¿Tienes dudas?</h3>
          <p className="text-slate-300 mb-6">
            Nuestro equipo comercial está listo para ayudarte a elegir el plan perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Agendar Llamada
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Ver FAQ Completo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
