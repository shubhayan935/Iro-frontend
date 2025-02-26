"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "./context/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useUser()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd validate the email and check if it's an admin
    const isAdmin = email.endsWith("@admin.com")
    setUser({ email, isAdmin })
    router.push(isAdmin ? "/admin" : "/employee")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-red.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/10 text-white"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 border-white/10 text-white hover:bg-white/10">
              Google
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-white hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}