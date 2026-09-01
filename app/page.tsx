"use client"

import { useEffect, useState } from "react"
import { RequestForm } from "@/components/request-form"
import { TrackRequest } from "@/components/track-request"
import { AnnouncementsList } from "@/components/announcements-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { storage } from "@/lib/storage"
import { auth } from "@/lib/auth"
import { Building2, FileText, Search, LogIn, Megaphone } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true)
    storage.initializeDemoData()
    setIsAuthenticated(auth.isAuthenticated())
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-[#0B5D2A] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Harare City Council</h1>
            </div>
            <p className="text-xl font-semibold text-emerald-50">Smart Citizen Services</p>
            <p className="text-lg text-emerald-50/90 max-w-2xl mx-auto">
              Submit requests, monitor municipal services, and help improve the delivery of essential civic services for
              Harare residents.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <>
                  <Link href="/admin">
                    <Button variant="secondary" size="lg" className="bg-white text-[#0B5D2A] hover:bg-emerald-50">
                      <Building2 className="h-5 w-5 mr-2" />
                      Department Dashboard
                    </Button>
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <Link href="/login">
                  <Button variant="secondary" size="lg" className="bg-white text-[#0B5D2A] hover:bg-emerald-50">
                    <LogIn className="h-5 w-5 mr-2" />
                    Staff Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="announcements" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="submit" className="gap-2">
              <FileText className="h-4 w-4" />
              Submit Request
            </TabsTrigger>
            <TabsTrigger value="track" className="gap-2">
              <Search className="h-4 w-4" />
              Track Request
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Community Announcements</h2>
                <p className="text-muted-foreground">
                  Stay informed with the latest updates from Harare City Council departments
                </p>
              </div>
              <AnnouncementsList />
            </div>
          </TabsContent>

          <TabsContent value="submit">
            <RequestForm />
          </TabsContent>

          <TabsContent value="track">
            <TrackRequest />
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold">Submit Request</h3>
              <p className="text-sm text-muted-foreground">
                Fill out the form with details about your service request or issue
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold">Get Tracking ID</h3>
              <p className="text-sm text-muted-foreground">Receive a unique ID to track your request status anytime</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Monitor updates and receive notifications on your request</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
