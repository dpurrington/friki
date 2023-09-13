import type { Metadata } from 'next'
import './globals.css'

export const metadata = {
  title: 'FrikiWiki',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-gray-600">{children}</body>
    </html>
  )
}
