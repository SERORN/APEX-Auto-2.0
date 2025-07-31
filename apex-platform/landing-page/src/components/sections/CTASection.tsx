import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transforma tu Negocio
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Hoy Mismo
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Únete a más de 15,000 empresas que ya crecen con Apex Platform. 
              Factoraje, crédito y marketplace en una sola plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                Agendar Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">100% Seguro</h3>
                <p className="text-slate-300">Encriptación bancaria y cumplimiento PCI DSS</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Setup Rápido</h3>
                <p className="text-slate-300">Implementación completa en menos de 48 horas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ROI Garantizado</h3>
                <p className="text-slate-300">Mejora tu flujo de caja desde el primer día</p>
              </div>
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-2 border-green-500/30 rounded-3xl p-8 mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Oferta Limitada
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Primeros 3 Meses Sin Comisiones
            </h3>
            <p className="text-xl text-slate-300 mb-6">
              Para nuevos clientes que se registren este mes. Incluye factoraje, 
              marketplace y facturación CFDI sin costo adicional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Aprovechar Oferta
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="text-slate-400 text-sm flex items-center justify-center">
                * Válido hasta fin de mes. Términos y condiciones aplican.
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Llámanos</h4>
              <p className="text-slate-300 mb-1">+52 (55) 1234-5678</p>
              <p className="text-slate-400 text-sm">Lun-Vie 9:00 AM - 7:00 PM</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Escríbenos</h4>
              <p className="text-slate-300 mb-1">contacto@apex.com.mx</p>
              <p className="text-slate-400 text-sm">Respuesta en menos de 2 horas</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Visítanos</h4>
              <p className="text-slate-300 mb-1">Polanco, CDMX</p>
              <p className="text-slate-400 text-sm">Cita previa requerida</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
    </section>
  )
}
