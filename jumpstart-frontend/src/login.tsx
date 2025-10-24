// app/login/page.tsx
'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password })
      const token = res.data.token
      // store token (replace with cookies for production)
      localStorage.setItem('token', token)
      router.push('/interest-selection')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/5 p-8 rounded">
        <h2 className="text-xl font-bold mb-4">Welcome Back</h2>
        {error && <div className="mb-2 text-red-400">{error}</div>}
        <label className="block">Email
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 rounded bg-black/50" />
        </label>
        <label className="block mt-3">Password
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mt-1 rounded bg-black/50" />
        </label>
        <button className="mt-6 w-full px-4 py-2 bg-indigo-600 rounded">Login</button>
      </form>
    </div>
  )
}
