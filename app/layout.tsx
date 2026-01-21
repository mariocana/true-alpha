import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from './providers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrueAlpha | Reputation-Based Social Trading',
  description: 'Trade signals verified by on-chain reputation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
