// app/page.tsx
'use client'
import Link from 'next/link'
import { useRef } from 'react'

export default function Landing() {
  const exploreRef = useRef<HTMLDivElement | null>(null)
  const scrollExplore = () => exploreRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-neutral-900 text-white">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-xl font-bold">JumpStart</div>
        <div className="space-x-3">
          <Link href="/login" className="px-3 py-1 bg-white text-black rounded">Login</Link>
          <Link href="/signup" className="px-3 py-1 border border-white rounded">Sign up</Link>
        </div>
      </nav>

      <section className="py-20 px-8 text-center">
        <h1 className="text-5xl font-extrabold">JumpStart</h1>
        <p className="mt-4 text-lg">AI Personalization — get content recommended for you</p>
        <div className="mt-8 space-x-4">
          <Link href="/signup" className="px-6 py-3 bg-indigo-500 rounded">Get Started</Link>
          <button onClick={scrollExplore} className="px-6 py-3 border rounded">Explore More</button>
        </div>
      </section>

      <div ref={exploreRef} className="bg-white text-black p-12">
        <h2 className="text-2xl font-semibold">Explore</h2>
        <p className="mt-2">Discover curated content across interests. Scroll, explore, and sign up to personalize recommendations.</p>
      </div>

      <footer className="p-6 text-center text-sm text-gray-300">© JumpStart</footer>
    </main>
  )
}
