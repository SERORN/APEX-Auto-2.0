import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(0)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: '¿Qué es Apex Platform y cómo funciona?',
          answer: 'Apex Platform es una solución fintech integral que combina factoraje, líneas de crédito, facturación CFDI y marketplace B2B para empresas del sector automotriz. Funciona como una plataforma única donde puedes gestionar todas tus necesidades financieras y comerciales desde un solo lugar.'
        },
        {
          question: '¿Qué documentos necesito para registrarme?',
          answer: 'Para registrarte necesitas: RFC activo, Acta constitutiva, Comprobante de domicilio fiscal, Estados financieros de los últimos 2 años, Constancia de situación fiscal actualizada, y una cuenta bancaria empresarial activa.'
        },
        {
          question: '¿Cuánto tiempo toma la aprobación?',
          answer: 'El proceso de verificación inicial toma entre 24-48 horas. Una vez aprobado tu perfil, las solicitudes de factoraje se procesan en menos de 4 horas y las líneas de crédito en máximo 48 horas hábiles.'
        }
      ]
    },
    {
      category: 'Factoraje',
      questions: [
        {
          question: '¿Qué porcentaje de adelanto ofrecen en factoraje?',
          answer: 'Ofrecemos adelantos del 70% al 90% del valor de la factura, dependiendo del perfil crediticio de tu empresa y del cliente pagador. Para clientes con historial comprobado, podemos llegar hasta el 95%.'
        },
        {
          question: '¿Qué facturas son elegibles para factoraje?',
          answer: 'Aceptamos facturas emitidas a empresas (B2B) con vencimiento de 30 a 90 días, que cumplan con todos los requisitos fiscales y SAT. Las facturas deben ser de clientes con buen historial crediticio y estar debidamente timbradas.'
        },
        {
          question: '¿Cuáles son las tasas de factoraje?',
          answer: 'Nuestras tasas van desde 1.8% hasta 3.5% mensual, dependiendo del riesgo del cliente pagador, el plazo de la factura y tu historial con nosotros. Clientes premium pueden acceder a tasas preferenciales desde 1.5%.'
        }
      ]
    },
    {
      category: 'Líneas de Crédito',
      questions: [
        {
          question: '¿Qué montos manejan en líneas de crédito?',
          answer: 'Ofrecemos líneas desde $100,000 MXN para PyMEs hasta $50 millones MXN para grandes empresas. El monto se determina basado en tus estados financieros, flujo de caja y historial crediticio.'
        },
        {
          question: '¿Requieren garantías para la línea de crédito?',
          answer: 'Para líneas menores a $5M MXN generalmente no requerimos garantías reales, solo aval solidario. Para montos mayores evaluamos caso por caso y podríamos solicitar garantías hipotecarias o prendarias.'
        },
        {
          question: '¿Cómo funcionan los pagos de la línea de crédito?',
          answer: 'Ofrecemos pagos flexibles: solo intereses durante los primeros 6 meses, pagos fijos mensuales, o pagos variables según tu flujo de caja estacional. Puedes prepagar sin penalización.'
        }
      ]
    },
    {
      category: 'Marketplace',
      questions: [
        {
          question: '¿Cuáles son las comisiones del marketplace?',
          answer: 'Cobramos 5.5% en transacciones B2B (distribuidor-proveedor) y 8.5% en transacciones B2C (cliente final). Clientes Enterprise pueden negociar comisiones preferenciales. Sin costos de listado o membresía.'
        },
        {
          question: '¿Cómo funciona la logística de envíos?',
          answer: 'Tenemos acuerdos con DHL, FedEx, Estafeta y más de 15 paqueterías. Calculamos automáticamente la opción más económica y rápida. Ofrecemos envío gratuito en compras mayores a $10,000 MXN.'
        },
        {
          question: '¿Puedo integrar mi ERP existente?',
          answer: 'Sí, ofrecemos integraciones con más de 50 sistemas: SAP, Oracle, Contpaq, Aspel, y muchos más. También tenemos API REST completa para integraciones customizadas. El setup inicial es gratuito.'
        }
      ]
    },
    {
      category: 'Facturación CFDI',
      questions: [
        {
          question: '¿El sistema CFDI cumple con todas las regulaciones SAT?',
          answer: 'Sí, nuestro sistema está 100% actualizado con las últimas disposiciones del SAT. Generamos CFDIs 4.0, manejamos complementos de pagos, nómina, y todos los addendas requeridos. Tenemos certificación PAC.'
        },
        {
          question: '¿Puedo cancelar facturas ya emitidas?',
          answer: 'Sí, puedes cancelar facturas directamente desde la plataforma siguiendo el proceso oficial del SAT. También manejamos sustitución de facturas y emisión de complementos automáticamente.'
        },
        {
          question: '¿Generan reportes fiscales automáticos?',
          answer: 'Sí, generamos automáticamente: DIOT, declaraciones mensuales y anuales, reporte de facturas emitidas/recibidas, balanza de comprobación, y todos los reportes que requiere tu contador.'
        }
      ]
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Preguntas
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Frecuentes
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros servicios financieros 
            y cómo pueden ayudar a tu empresa.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  const isOpen = openFAQ === globalIndex
                  
                  return (
                    <div
                      key={faqIndex}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors"
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <span className="text-white font-medium pr-4">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4 border-t border-white/10">
                          <div className="pt-4 text-slate-300 leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de expertos está listo para resolver cualquier duda específica 
            sobre tu caso y ayudarte a encontrar la mejor solución financiera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Hablar con un Experto
            </button>
            <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-colors">
              Enviar Mensaje
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
