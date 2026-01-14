"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard")
          },
        }
      )

      if (error) 
        {
        setError(error.message || "Login failed")
      }
    } catch (err) 
    {
      setError("An error occurred during login")
    } finally
     {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#c9dfd3" }}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-2">TodoFlow</h1>
        <p className="text-green-800 opacity-80">Manage your tasks with ease</p>
      </div>
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Login to your account to continue</CardDescription>
          </CardHeader>


          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
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
                    autoComplete="current-password"
                    className="bg-white/50 border-green-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white shadow-md transition-all hover:scale-[1.02]" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-green-900/70">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="underline underline-offset-4 font-bold text-green-800 hover:text-green-950">
                  Sign up 
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
