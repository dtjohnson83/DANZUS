import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DANZUS Holdings',
  description: 'Danzus builds quietly.',
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
