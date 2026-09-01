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
    console.log("[v0] Email:", formData.email)
    console.log("[v0] Password length:", formData.password.length)

    try {
      console.log("[v0] Calling auth.login...")
      const user = auth.login(formData)
      console.log("[v0] Login result:", user ? "Success" : "Failed")

      if (user) {
        console.log("[v0] User details:", {
          id: user.id,
          name: user.name,
          role: user.role,
          department: user.department,
        })

        const redirectPath = user.role === "admin" || user.role === "staff" ? "/admin" : "/"
        console.log("[v0] Redirecting to:", redirectPath)

        // Small delay to ensure state is saved
        await new Promise((resolve) => setTimeout(resolve, 100))

        router.push(redirectPath)
        router.refresh()
      } else {
        console.log("[v0] Login failed: Invalid credentials")
        setError("Invalid email or password. Please check your credentials and try again.")
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

        <div className="mt-6 p-4 bg-[#EAF6EE] border border-[#DDE7E0] rounded-xl">
          <p className="text-sm font-medium mb-3 text-[#1e40af]">Department Login Credentials:</p>
          <div className="text-xs space-y-2 text-[#1F2937]">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <p className="font-medium">Education:</p>
              <p>education@harare.gov.zw / edu123</p>

              <p className="font-medium">Health:</p>
              <p>health@harare.gov.zw / health123</p>

              <p className="font-medium">Engineering:</p>
              <p>engineering@harare.gov.zw / eng123</p>

              <p className="font-medium">Social Services:</p>
              <p>social@harare.gov.zw / social123</p>

              <p className="font-medium">ZESA:</p>
              <p>zesa@harare.gov.zw / zesa123</p>

              <p className="font-medium">General Admin:</p>
              <p>admin@harare.gov.zw / admin123</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
