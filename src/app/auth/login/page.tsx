'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/domains/auth/slices/auth.slice'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useAuthStore()
  const router = useRouter()

  const handleLogin = async () => {
    if (email && password) {
      // Mock token logic
      setToken('mock-token-123')
      router.push('/dashboard/employee')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-lg font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  )
}