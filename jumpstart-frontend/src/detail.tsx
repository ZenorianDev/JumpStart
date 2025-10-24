// app/detail/page.tsx
'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function DetailPage() {
  const [recs, setRecs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content/recs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        // backend returns { recommendations: [...] } or array
        setRecs(res.data.recommendations || res.data || [])
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Recommended for you</h1>
      {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {recs.map(r => (
          <div key={r.id} className="border rounded p-4 bg-white">
            <h2 className="font-semibold">{r.title}</h2>
            <p className="text-sm mt-2">{r.body?.slice(0, 120)}{r.body?.length > 120 ? '...' : ''}</p>
          </div>
        ))}
        {!loading && recs.length === 0 && <p className="text-sm text-gray-500">No recommendations yet — add interests or explore content.</p>}
      </div>
    </div>
  )
}
