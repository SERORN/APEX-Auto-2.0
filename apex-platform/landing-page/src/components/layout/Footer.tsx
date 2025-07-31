import React from 'react'
import Link from 'next/link'
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Apex Platform</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-md">
              La plataforma fintech integral que transforma el sector automotriz mexicano. 
              Factoraje, crédito, CFDI y marketplace en una sola solución.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>contacto@apex.com.mx</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+52 (55) 1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Polanco, Ciudad de México</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/factoraje" className="text-slate-400 hover:text-white transition-colors">
                  Factoraje
                </Link>
              </li>
              <li>
                <Link href="/credito" className="text-slate-400 hover:text-white transition-colors">
                  Líneas de Crédito
                </Link>
              </li>
              <li>
                <Link href="/cfdi" className="text-slate-400 hover:text-white transition-colors">
                  Facturación CFDI
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-slate-400 hover:text-white transition-colors">
                  Marketplace B2B
                </Link>
              </li>
              <li>
                <Link href="/integraciones" className="text-slate-400 hover:text-white transition-colors">
                  Integraciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/nosotros" className="text-slate-400 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/carreras" className="text-slate-400 hover:text-white transition-colors">
                  Carreras
                </Link>
              </li>
              <li>
                <Link href="/prensa" className="text-slate-400 hover:text-white transition-colors">
                  Prensa
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-slate-400 hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-slate-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/documentacion" className="text-slate-400 hover:text-white transition-colors">
                  Documentación
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-slate-400 hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-slate-400 hover:text-white transition-colors">
                  Soporte
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="text-slate-400 hover:text-white transition-colors">
                  Webinars
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">Síguenos:</span>
              <div className="flex items-center gap-3">
                <Link
                  href="https://facebook.com/apexplatform"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://twitter.com/apexplatform"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://linkedin.com/company/apexplatform"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://instagram.com/apexplatform"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </Link>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link href="/privacidad" className="text-slate-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-slate-400 hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <span className="text-slate-500">
                © {currentYear} Apex Platform. Todos los derechos reservados.
              </span>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div className="text-slate-400 text-sm">
                <div className="font-semibold mb-1">PCI DSS Compliant</div>
                <div className="text-xs">Nivel 1 Certificado</div>
              </div>
              <div className="text-slate-400 text-sm">
                <div className="font-semibold mb-1">ISO 27001</div>
                <div className="text-xs">Seguridad Certificada</div>
              </div>
              <div className="text-slate-400 text-sm">
                <div className="font-semibold mb-1">SAT Autorizado</div>
                <div className="text-xs">PAC Certificado</div>
              </div>
              <div className="text-slate-400 text-sm">
                <div className="font-semibold mb-1">CNBV Supervisado</div>
                <div className="text-xs">Fintech Regulada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
