// src/app/interests/page.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import InterestCard from '@/components/ui/InterestCard'
import { INTERESTS, CONTENTS } from '@/lib/contents'
import { scoreContentsForInterests } from '@/utils/personalize'
import type { ContentItem } from '@/lib/contents'
import Image from 'next/image'

const LS_KEY = 'jumpstart_interests'
const REC_KEY = 'jumpstart_recs'

export default function InterestSelectionPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [preview, setPreview] = useState<ContentItem[]>([])
  const [analyzing, setAnalyzing] = useState(false)

  // load from localStorage on mount (defer to avoid sync setState in effect)
  useEffect(() => {
    requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (raw) setSelected(JSON.parse(raw) as string[])
      } catch {
        /* ignore */
      }
    })
  }, [])

  // update preview when selection changes
  useEffect(() => {
    const recs = scoreContentsForInterests(CONTENTS, selected)
    setPreview(recs.slice(0, 12))
  }, [selected])

  function toggleInterest(i: string) {
    setSelected(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))
  }

  function continueToDashboard() {
    // save selection
    localStorage.setItem(LS_KEY, JSON.stringify(selected))
    // compute and cache rec ids
    const recs = scoreContentsForInterests(CONTENTS, selected).map(r => r.id)
    localStorage.setItem(REC_KEY, JSON.stringify(recs))
    // show small "AI analyzing" experience then navigate
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      router.push('/dashboard')
    }, 900) // quick animation; adjust as desired
  }

  function resetAll() {
    localStorage.removeItem(LS_KEY)
    localStorage.removeItem(REC_KEY)
    setSelected([])
    setPreview(scoreContentsForInterests(CONTENTS, []))
  }

  const selectedCount = selected.length

  // suggested helper to show top interest preview images (for header)
  const headerPreview = useMemo(() => {
    // pick up to 4 items from preview
    return preview.slice(0, 4)
  }, [preview])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-700 text-white flex items-center justify-center font-bold">JS</div>
            <div className="font-semibold">JumpStart</div>
          </div>
          <div className="text-sm text-gray-600">Choose What Interests You — we&apos;ll personalize the feed</div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/')} className="text-sm text-gray-700 hover:underline">
              Home
            </button>
            <button onClick={resetAll} className="text-sm text-red-600">Reset</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Choose What Interest You</h1>
          <p className="text-sm text-gray-600">We&apos;ll personalize what you see — pick a few favorites to get started.</p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {headerPreview.map(p => (
                <div key={p.id} className="w-14 h-14 rounded overflow-hidden ring-2 ring-white shadow-sm">
                  <Image src={p.image} alt={p.title} width={56} height={56} className="object-cover" />
                </div>
              ))}
            </div>

            <div>
              <div className="text-sm text-gray-700">Selected</div>
              <div className="text-lg font-semibold">{selectedCount} interest{selectedCount !== 1 ? 's' : ''}</div>
            </div>

            <div className="ml-auto flex gap-3">
              <button
                disabled={selected.length === 0}
                onClick={continueToDashboard}
                className={`px-4 py-2 rounded-md text-white ${selected.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                Save & Continue
              </button>
              <button onClick={() => { localStorage.setItem(LS_KEY, JSON.stringify(selected)); router.push('/dashboard') }} className="px-4 py-2 rounded-md border">Skip</button>
            </div>
          </div>
        </section>

        {/* Masonry-style grid using CSS columns to mimic Pinterest */}
        <section>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {INTERESTS.map((label) => {
              const exampleImage = CONTENTS.find(c => c.tags.includes(label))?.image
              const isActive = selected.includes(label)
              return (
                <InterestCard
                  key={label}
                  id={label}
                  label={label}
                  image={exampleImage}
                  active={isActive}
                  onToggle={toggleInterest}
                />
              )
            })}
          </div>
        </section>

        {/* Quick preview of personalized content (cards) */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-3">Preview recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.slice(0, 6).map(item => (
              <article key={item.id} className="bg-white rounded shadow overflow-hidden">
                <div className="relative h-40">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.tags.join(' • ')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* small analyzing overlay */}
      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="mb-3 font-semibold">Analyzing your interests...</div>
            <div className="w-48 h-2 bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-indigo-600 animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
