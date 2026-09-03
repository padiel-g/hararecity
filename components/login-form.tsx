"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { auth } from "@/lib/auth"

export function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Login attempt started")

    try {
      const user = auth.login(formData)

      if (user) {
        // Small delay to ensure state is saved
        await new Promise((resolve) => setTimeout(resolve, 100))

        const redirectPath = user.role === "admin" || user.role === "staff" ? "/admin" : "/"
        router.push(redirectPath)
        router.refresh()
      } else {
        console.log("[v0] Login failed")
        setError("Invalid email or password.")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Department Login</CardTitle>
        <CardDescription>Sign in with your department credentials to access the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-500 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="education@harare.gov.zw"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-medium mb-2 text-blue-900">Authorized Access Only</p>
          <p className="text-xs text-blue-800 leading-relaxed">
            Department accounts are restricted to authorized Harare City Council personnel. 
            If you require access, please contact the system administrator.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
