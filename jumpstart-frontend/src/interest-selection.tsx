// app/interest-selection/page.tsx
'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Interest = { id: number; name: string }

export default function InterestSelection() {
  const [interests, setInterests] = useState<Interest[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const router = useRouter()

  useEffect(() => {
    // Try to fetch canonical interests; fallback to build from contents.
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content`)
      .then(res => {
        const data = res.data.data || res.data
        const interestSet = new Set<string>()
        data.forEach((c: any) => { (c.interests || []).forEach((i: any) => interestSet.add(i.name)) })
        const arr = Array.from(interestSet).map((n, i) => ({ id: i + 1, name: n }))
        if (arr.length) setInterests(arr)
        else setInterests([{ id: 1, name: 'AI' }, { id: 2, name: 'Design' }, { id: 3, name: 'Fitness' }])
      })
      .catch(() => setInterests([{ id: 1, name: 'AI' }, { id: 2, name: 'Design' }, { id: 3, name: 'Fitness' }]))
  }, [])

  const toggle = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const save = async () => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    try {
      // NOTE: backend expects interest IDs. If your interests table uses different IDs,
      // replace selected with actual ids from server. This snippet assumes sync by index.
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/interests`, { interests: selected }, { headers: { Authorization: `Bearer ${token}` } })
      router.push('/detail')
    } catch (e) { console.error(e) }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold">Choose What Interest You</h1>
      <p className="text-sm text-gray-600">We'll personalize what you want</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {interests.map(i => (
          <button key={i.id} onClick={() => toggle(i.id)} className={`p-6 rounded border shadow ${selected.includes(i.id) ? 'bg-indigo-100' : 'bg-white'}`}>
            {i.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={save} className="px-6 py-2 bg-indigo-600 text-white rounded">Save & Continue</button>
      </div>
    </div>
  )
}
