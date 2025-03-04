"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/app/context/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientBackground } from "@/components/gradient-background"
import { toast } from "@/components/ui/use-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Destructure both login and user from your context.
  const { login, user } = useUser()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const loggedInUser = await login(email, password)
      console.log(loggedInUser)
      if (loggedInUser.role === "Admin") {
        router.push("/admin")
      } else if (loggedInUser.role === "Employee") {
        router.push("/employee")
      } else {
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <GradientBackground />
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>
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
        </div>
      </div>
    </div>
  )
}
