/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import { Ubuntu, Playpen_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/utils/cn'
import Script from 'next/script'

const inter = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ['greek']
})

const playpenSans = Playpen_Sans({
  weight: ['200', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-playful'
})

export const metadata: Metadata = {
  title: '404 | In Dev Mined',
  description: '404 Page not found',
  applicationName: 'InDevMined',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InDevMined'
  },
  other: {
    'mobile-web-app-capable': 'yes'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning={true}
        className={cn(
          inter.className,
          'bg-background',
          'dark',
          playpenSans.variable
        )}
      >
        {children}
      </body>
      <Script src='https://scripts.simpleanalyticscdn.com/latest.js' />
    </html>
  )
}
