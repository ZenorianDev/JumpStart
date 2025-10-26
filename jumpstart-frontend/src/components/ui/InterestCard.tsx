// src/components/InterestCard.tsx
'use client'
import Image from 'next/image'
import React from 'react'

type Props = {
  id: string
  label: string
  image?: string
  active?: boolean
  onToggle: (id: string) => void
}

export default function InterestCard({ id, label, image, active = false, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(label)}
      aria-pressed={active}
      className={`mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-sm transform transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        active ? 'ring-4 ring-indigo-200' : ''
      }`}
    >
      <div className="relative w-full h-44 bg-gray-100">
        {image ? (
          <Image src={image} alt={label} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-3 bg-white text-sm text-gray-700">{label}</div>
    </button>
  )
}
