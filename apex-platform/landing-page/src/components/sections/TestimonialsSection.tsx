import React from 'react'
import { Star, Quote } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Carlos Mendoza',
      position: 'Director General',
      company: 'AutoPartes del Norte',
      image: '/testimonials/carlos.jpg',
      rating: 5,
      quote: 'Apex Platform transformó completamente nuestro flujo de efectivo. El factoraje nos permite crecer sin esperar 90 días por el pago de facturas.',
      stats: {
        label: 'Crecimiento en ventas',
        value: '+180%'
      }
    },
    {
      name: 'María Elena Ruiz',
      position: 'CFO',
      company: 'Distribuidora Automotriz SA',
      image: '/testimonials/maria.jpg',
      rating: 5,
      quote: 'La integración con nuestro ERP fue perfecta. Ahora generamos CFDI automáticamente y tenemos visibilidad total de nuestras operaciones.',
      stats: {
        label: 'Reducción tiempo facturación',
        value: '85%'
      }
    },
    {
      name: 'Roberto García',
      position: 'Gerente de Operaciones',
      company: 'Refacciones García Hnos',
      image: '/testimonials/roberto.jpg',
      rating: 5,
      quote: 'El marketplace nos conectó con distribuidores que jamás hubiéramos alcanzado. Nuestras ventas B2B crecieron exponencialmente.',
      stats: {
        label: 'Nuevos clientes',
        value: '+450'
      }
    },
    {
      name: 'Ana Sofía López',
      position: 'Directora Financiera',
      company: 'TallerTech Solutions',
      image: '/testimonials/ana.jpg',
      rating: 5,
      quote: 'Las líneas de crédito flexibles nos permitieron invertir en inventario sin comprometer el capital de trabajo. Excelente servicio.',
      stats: {
        label: 'Línea de crédito',
        value: '$2.5M'
      }
    },
    {
      name: 'Luis Fernando Castro',
      position: 'CEO',
      company: 'Autoservicio Integral',
      image: '/testimonials/luis.jpg',
      rating: 5,
      quote: 'La plataforma es intuitiva y el soporte técnico excepcional. Implementamos todo en menos de una semana sin interrumpir operaciones.',
      stats: {
        label: 'Tiempo de implementación',
        value: '5 días'
      }
    },
    {
      name: 'Patricia Vásquez',
      position: 'Gerente General',
      company: 'Motor Parts Express',
      image: '/testimonials/patricia.jpg',
      rating: 5,
      quote: 'Apex nos ayudó a digitalizar completamente nuestro negocio. Ahora vendemos online y tenemos acceso a financiamiento inmediato.',
      stats: {
        label: 'Ventas digitales',
        value: '70%'
      }
    }
  ]

  return (
    <section id="testimonials" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Historias de
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Éxito Comprobado
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Más de 15,000 empresas automotrices confían en Apex Platform para 
            impulsar su crecimiento y optimizar sus finanzas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4">
                <Quote className="w-8 h-8 text-blue-400/30" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Stats */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 mb-6">
                <div className="text-2xl font-bold text-white">{testimonial.stats.value}</div>
                <div className="text-sm text-slate-400">{testimonial.stats.label}</div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.position}</div>
                  <div className="text-sm text-blue-400">{testimonial.company}</div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-white/10">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-slate-400">Calificación Promedio</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">15,000+</div>
            <div className="text-slate-400">Empresas Activas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">98.5%</div>
            <div className="text-slate-400">Satisfacción Cliente</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-slate-400">Soporte Técnico</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-slate-300 mb-6">
            Únete a miles de empresas que ya transformaron sus finanzas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Ver Más Casos de Éxito
            </button>
            <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-colors">
              Solicitar Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
