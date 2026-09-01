"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PerformanceMetrics } from "@/lib/types"

interface SimpleChartsProps {
  metrics: PerformanceMetrics
}

export function SimpleCharts({ metrics }: SimpleChartsProps) {
  const categoryData = Object.entries(metrics.requestsByCategory)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
    .filter((item) => item.value > 0)

  const maxCategoryValue = Math.max(...categoryData.map((d) => d.value), 1)

  const statusData = [
    { name: "Pending", value: metrics.pendingRequests, color: "bg-[#EAF6EE]" },
    { name: "In Progress", value: metrics.inProgressRequests, color: "bg-[#16803C]" },
    { name: "Resolved", value: metrics.resolvedRequests, color: "bg-[#1e40af]" },
    { name: "Rejected", value: metrics.rejectedRequests, color: "bg-red-500" },
  ].filter((item) => item.value > 0)

  const totalStatus = statusData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Overall system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-primary">{metrics.averageResolutionTime.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground mt-1">Average Resolution Time (days)</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {metrics.totalRequests > 0 ? ((metrics.resolvedRequests / metrics.totalRequests) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Resolution Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-[#16803C]">{metrics.totalRequests}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Requests</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Request submissions and resolutions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.monthlyTrends.map((trend, index) => {
              const maxValue = Math.max(...metrics.monthlyTrends.map((t) => Math.max(t.requests, t.resolved)), 1)
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{trend.month}</span>
                    <span className="text-muted-foreground">
                      {trend.requests} submitted, {trend.resolved} resolved
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-[#16803C] transition-all"
                          style={{ width: `${(trend.requests / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${(trend.resolved / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#16803C] rounded" />
              <span>Submitted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Resolved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Category</CardTitle>
            <CardDescription>Distribution across service categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.value} requests</span>
                  </div>
                  <div className="h-8 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(item.value / maxCategoryValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current status of all requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item, index) => {
                const percentage = totalStatus > 0 ? ((item.value / totalStatus) * 100).toFixed(1) : 0
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {item.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-8 bg-muted rounded overflow-hidden">
                      <div className={`h-full ${item.color} transition-all`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
