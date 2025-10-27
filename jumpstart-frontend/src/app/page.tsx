// src/app/page.tsx
'use client'

import React, { useRef } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'

export default function LandingPage() {
  const router = useRouter();
  const exploreRef = useRef<HTMLDivElement>(null);

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-black text-white relative">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Optimized Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/jumpstart-hero.png"
            alt="Hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">JumpStart</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Get Started to Experience JumpStart with AI Personalization
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/interests")}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Get Experience
            </button>
            <button
              onClick={scrollToExplore}
              className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition"
            >
              Explore More
            </button>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section
        id="explore"
        ref={exploreRef}
        className="py-20 px-6 md:px-16 bg-white text-black"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Explore with AI</h2>
            <p className="text-gray-700 mb-6">
              JumpStart uses AI to curate content based on your preferences.
              From fitness to design, travel to AI tech, discover recommendations
              crafted uniquely for you.
            </p>
            <button
              onClick={() => router.push("/interests")}
              className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Explore Interests
            </button>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-[300px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/explore-preview.png"
                alt="Explore Preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}