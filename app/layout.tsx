import './globals.css'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'

export const metadata: Metadata = {
  title: {
    default: 'Pirografía CT · Arte en madera',
    template: '%s · Pirografía CT'
  },
  description: 'Pirograbados artísticos a mano. Retratos, logos, decoración. Pedí tu pieza por WhatsApp.',
  icons: {
    icon: '/brand/logo-mark.png'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="grain min-h-screen">
        <div className="min-h-screen bg-grid-fade">
          <HeaderBar />
          <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-8">
            {children}
          </main>
          <FooterBar />
        </div>
      </body>
    </html>
  )
}
