'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      toast.error(' كلمة السر غلط!')
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex justify-center items-center min-h-screen  bg-gray-50">
  <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center">
    <h1 className="text-[#4c3f2d] font-bold text-xl mb-6 text-center">
      ادخل كلمة المرور للتعديل
    </h1>
    
    <Input
      type="password"
      placeholder="أدخل كلمة السر"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="mb-4 text-right py-5"
    />

    <Button 
      className="bg-[#613829] hover:bg-[#563224] w-full py-6 text-gray-50 text-lg rounded-xl transition-all duration-300"
      type="submit"
    >
      دخول
    </Button>
  </div>
</form>

  )
}