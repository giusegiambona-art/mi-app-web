import type { Metadata } from 'next'
import { initializeDatabase } from '@/lib/init-db'

// Inicializar BD cuando el servidor inicia
initializeDatabase();

export const metadata: Metadata = {
  title: 'Pizzería Online - Precios en €',
  description: 'Pide tus pizzas favoritas por WhatsApp - Precios en euros',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}