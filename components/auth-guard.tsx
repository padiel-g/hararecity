"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import type { User } from "@/lib/types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: User["role"] | User["role"][]
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthGuard: checking authentication...")

    const checkAuth = () => {
      const isAuthenticated = auth.isAuthenticated()
      console.log("[v0] AuthGuard: isAuthenticated =", isAuthenticated)

      if (!isAuthenticated) {
        console.log("[v0] AuthGuard: not authenticated, redirecting to", redirectTo)
        router.push(redirectTo)
        return
      }

      if (requiredRole) {
        const hasRequiredRole = auth.hasRole(requiredRole)
        console.log("[v0] AuthGuard: hasRequiredRole =", hasRequiredRole)

        if (!hasRequiredRole) {
          console.log("[v0] AuthGuard: insufficient role, redirecting to /")
          router.push("/")
          return
        }
      }

      console.log("[v0] AuthGuard: authorization successful")
      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRole, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
