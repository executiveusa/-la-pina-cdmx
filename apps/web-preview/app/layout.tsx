import type { Metadata } from 'next'
import './globals.css'
import { TabNav } from '@/components/TabNav'

export const metadata: Metadata = {
  title: 'La Piña - Women\'s Health & Wellness',
  description: 'Track your cycle, symptoms, and wellness with luxury care',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="preload"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neutral-0 text-neutral-900">
        <div className="min-h-screen w-full flex flex-col pb-24 md:pb-0">
          <main className="flex-1 w-full">
            {children}
          </main>
          <TabNav />
        </div>
      </body>
    </html>
  )
}
