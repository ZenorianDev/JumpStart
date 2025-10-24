// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JumpStart',
  description: 'AI-personalized content'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-slate-50'}>{children}</body>
    </html>
  )
}
