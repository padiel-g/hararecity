"use client"

import { useEffect, useState } from "react"
import { storage } from "@/lib/storage"
import { auth } from "@/lib/auth"
import type { ServiceRequest, PerformanceMetrics } from "@/lib/types"
import { calculateMetrics } from "@/lib/utils/metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { RequestsTable } from "@/components/requests-table"
import { SimpleCharts } from "@/components/simple-charts"
import { SimpleImpactAnalytics } from "@/components/simple-impact-analytics"
import { AnnouncementForm } from "@/components/announcement-form"
import { AnnouncementsList } from "@/components/announcements-list"
import { AuthGuard } from "@/components/auth-guard"
import { UserMenu } from "@/components/user-menu"

function AdminDashboardContent() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [mounted, setMounted] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const currentUser = auth.getCurrentUser()

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [refreshKey])

  const loadData = () => {
    const allRequests = storage.getRequests()
    setRequests(allRequests)
    setMetrics(calculateMetrics(allRequests))
  }

  const handleAnnouncementSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser?.department
                  ? `${currentUser.name} - ${currentUser.department}`
                  : "Smart City e-Governance Plartform"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline">← Back to Home</Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <span className="text-2xl">📄</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">All time submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <span className="text-2xl">⏳</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <span className="text-2xl">🔄</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.inProgressRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently being handled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.resolvedRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">📋 Requests</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
            <TabsTrigger value="impact">📈 Community Impact</TabsTrigger>
            <TabsTrigger value="announcements">📢 Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <RequestsTable requests={requests} onUpdate={loadData} />
          </TabsContent>

          <TabsContent value="analytics">{metrics && <SimpleCharts metrics={metrics} />}</TabsContent>

          <TabsContent value="impact">{metrics && <SimpleImpactAnalytics metrics={metrics} />}</TabsContent>

          <TabsContent value="announcements">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <AnnouncementForm onSuccess={handleAnnouncementSuccess} />
              </div>
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-bold">Your Announcements</h2>
                  <p className="text-sm text-muted-foreground">Manage announcements from your department</p>
                </div>
                <AnnouncementsList showAdminControls={true} key={refreshKey} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole={["admin", "staff"]}>
      <AdminDashboardContent />
    </AuthGuard>
  )
}
