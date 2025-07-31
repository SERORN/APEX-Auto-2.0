import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Users, CreditCard } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8">
            <Shield className="w-4 h-4 mr-2" />
            Plataforma Fintech Integral para México
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Apex Platform
            </span>
            <br />
            <span className="text-white">
              Tu Aliado Financiero
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Factoraje, líneas de crédito, CFDI y marketplace de autopartes. 
            Todo integrado en una sola plataforma para hacer crecer tu negocio.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Factoraje</p>
              <p className="text-slate-400 text-sm">Adelanta tus facturas</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Crédito</p>
              <p className="text-slate-400 text-sm">Líneas flexibles</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">CFDI</p>
              <p className="text-slate-400 text-sm">Facturación SAT</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Marketplace</p>
              <p className="text-slate-400 text-sm">Autopartes B2B</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
            >
              Ver Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-slate-400 text-sm mb-4">Confiado por empresas líderes en México</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-white font-bold text-lg">AUTOPARTES+</div>
              <div className="text-white font-bold text-lg">FINTECH MX</div>
              <div className="text-white font-bold text-lg">SAT READY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
    </section>
  )
}
