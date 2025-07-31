import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Shield } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">Apex Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
              Características
            </Link>
            <Link href="#services" className="text-slate-300 hover:text-white transition-colors">
              Servicios
            </Link>
            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
              Precios
            </Link>
            <Link href="#about" className="text-slate-300 hover:text-white transition-colors">
              Nosotros
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Comenzar Gratis</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/95 rounded-lg mt-2">
              <Link
                href="#features"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Características
              </Link>
              <Link
                href="#services"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Precios
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Nosotros
              </Link>
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Comenzar Gratis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
