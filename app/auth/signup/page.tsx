"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) 
     {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6)
      {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name: fullName,
        },
        {
          onSuccess: () => {
            router.push("/auth/signup/success")
          },
        }
      )

      if (error) 
        {
        setError(error.message || "Signup failed")
      }
    } catch (err)
    {
      setError("An error occurred during signup")
    } finally
     {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#c9dfd3" }}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-2">
            TodoFlow</h1>
        <p className="text-green-800 opacity-80">
            Join thousands managing tasks smarter</p>
      </div>
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
                Create Account
                </CardTitle>

            <CardDescription className="text-center">
                Sign up for a new account to get started
                </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="bg-white/50 border-green-100"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-white/50 border-green-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-white/50 border-green-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-white/50 border-green-100"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                </div>
                {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white shadow-md transition-all hover:scale-[1.02] mt-2" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-green-900/70">
                Already have an account?{" "}
                
                <Link href="/auth/login" className="underline underline-offset-4 font-bold text-green-800 hover:text-green-950">
                  Login here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}