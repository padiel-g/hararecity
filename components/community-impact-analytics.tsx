"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, CheckCircle2, Clock, Target, Award, BarChart3 } from "lucide-react"
import type { PerformanceMetrics } from "@/lib/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"

interface CommunityImpactAnalyticsProps {
  metrics: PerformanceMetrics
}

export function CommunityImpactAnalytics({ metrics }: CommunityImpactAnalyticsProps) {
  const resolutionRate =
    metrics.totalRequests > 0 ? ((metrics.resolvedRequests / metrics.totalRequests) * 100).toFixed(1) : 0

  const improvementTrend = metrics.improvementRate >= 0

  // Department performance radar data
  const radarData = metrics.departmentPerformance.map((dept) => ({
    department: dept.department,
    efficiency: dept.resolved > 0 ? Math.min(100, (dept.resolved / (dept.resolved + dept.pending)) * 100) : 0,
    speed: dept.avgResolutionDays > 0 ? Math.max(0, 100 - dept.avgResolutionDays * 2) : 0,
  }))

  return (
    <div className="space-y-6">
      {/* Community Impact Score */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-6 w-6 text-primary" />
            Community Impact Score
          </CardTitle>
          <CardDescription>Overall effectiveness of service delivery to the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="text-7xl font-bold text-primary">{metrics.communityImpactScore}</div>
              <div className="text-center text-sm text-muted-foreground mt-2">out of 100</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-background rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{resolutionRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">Resolution Rate</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <div className="text-2xl font-bold text-[#16803C]">{metrics.averageResolutionTime.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">Avg Days to Resolve</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalRequests}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Requests</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <div className="flex items-center justify-center gap-1">
                <div className={`text-2xl font-bold ${improvementTrend ? "text-green-600" : "text-orange-600"}`}>
                  {Math.abs(metrics.improvementRate).toFixed(1)}%
                </div>
                {improvementTrend ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Monthly Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Department Performance Analysis
          </CardTitle>
          <CardDescription>Comparing efficiency across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="resolved" fill="#16803C" name="Resolved" />
              <Bar dataKey="pending" fill="#7BC48A" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Efficiency Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Department Efficiency Radar</CardTitle>
            <CardDescription>Multi-dimensional performance view</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="department" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Efficiency" dataKey="efficiency" stroke="#16803C" fill="#16803C" fillOpacity={0.6} />
                <Radar name="Speed" dataKey="speed" stroke="#0B5D2A" fill="#0B5D2A" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Announcement Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Engagement
            </CardTitle>
            <CardDescription>Announcements and community reach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Total Announcements</div>
                  <div className="text-2xl font-bold">{metrics.announcementEngagement.totalAnnouncements}</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Currently Active</div>
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.announcementEngagement.activeAnnouncements}
                  </div>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">By Department</div>
                {Object.entries(metrics.announcementEngagement.byDepartment).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{dept.replace("-", " ")}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Key Community Improvements
          </CardTitle>
          <CardDescription>Measurable impact on community service delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Service Accessibility</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Citizens can now submit and track requests 24/7 from any device, reducing the need for physical
                    visits.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Transparency & Accountability</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Real-time tracking and status updates ensure transparency in service delivery processes.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Faster Response Times</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Average resolution time of {metrics.averageResolutionTime.toFixed(1)} days shows improved efficiency
                    in addressing community needs.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Community Communication</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {metrics.announcementEngagement.activeAnnouncements} active announcements keep the community
                    informed about important updates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
