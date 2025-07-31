import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Apex - Plataforma Fintech & Autopartes',
  description: 'Servicios financieros y marketplace de autopartes integrados',
  keywords: 'fintech, autopartes, factoraje, crédito, CFDI, México',
  authors: [{ name: 'Apex Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Apex - Plataforma Fintech & Autopartes',
    description: 'Servicios financieros y marketplace de autopartes integrados',
    url: 'https://apex.com.mx',
    siteName: 'Apex',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apex Platform',
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
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
