import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Apex - Plataforma Fintech & Autopartes Líder en México',
  description: 'La plataforma más completa de servicios financieros y marketplace de autopartes. Factoraje, crédito BNPL, CFDI automático y más de 100,000 autopartes disponibles.',
  keywords: [
    'fintech',
    'autopartes',
    'factoraje',
    'crédito BNPL',
    'CFDI',
    'marketplace autopartes',
    'servicios financieros México',
    'refacciones automotrices',
    'financiamiento empresarial'
  ].join(', '),
  authors: [{ name: 'Apex Team', url: 'https://apex.com.mx' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Apex - Plataforma Fintech & Autopartes',
    description: 'Servicios financieros y marketplace de autopartes integrados para empresas mexicanas',
    url: 'https://apex.com.mx',
    siteName: 'Apex',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apex - Plataforma Fintech & Autopartes',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex - Plataforma Fintech & Autopartes',
    description: 'Servicios financieros y marketplace de autopartes integrados',
    images: ['/og-image.jpg'],
    creator: '@ApexMexico',
  },
  alternates: {
    canonical: 'https://apex.com.mx',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "Apex Fintech & Automotive",
              "description": "Plataforma integral de servicios financieros y marketplace de autopartes",
              "url": "https://apex.com.mx",
              "logo": "https://apex.com.mx/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+52-55-1234-5678",
                "contactType": "Customer Service",
                "availableLanguage": "Spanish"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Revolución 123",
                "addressLocality": "Ciudad de México",
                "addressCountry": "MX"
              },
              "serviceType": ["Factoraje", "Crédito BNPL", "CFDI", "Marketplace Autopartes"],
              "areaServed": "Mexico"
            })
          }}
        />
      </body>
    </html>
  )
}
