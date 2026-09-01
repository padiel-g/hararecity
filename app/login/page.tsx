"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { auth } from "@/lib/auth"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Login page mounted, checking auth status")
    // Redirect if already logged in
    if (auth.isAuthenticated()) {
      const user = auth.getCurrentUser()
      console.log("[v0] User already authenticated:", user)
      if (user?.role === "admin" || user?.role === "staff") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 bg-[#16803C] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
              HCC
            </div>
            <span className="text-2xl font-bold text-[#1e40af]">Harare City Council</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#1F2937]">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to access the Smart Citizen Services portal</p>
        </div>

        <LoginForm />

        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
