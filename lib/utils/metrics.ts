import type { ServiceRequest, PerformanceMetrics, RequestCategory, Department } from "../types"
import { storage } from "../storage"

export function calculateMetrics(requests: ServiceRequest[]): PerformanceMetrics {
  const totalRequests = requests.length
  const pendingRequests = requests.filter((r) => r.status === "pending").length
  const inProgressRequests = requests.filter((r) => r.status === "in-progress").length
  const resolvedRequests = requests.filter((r) => r.status === "resolved").length
  const rejectedRequests = requests.filter((r) => r.status === "rejected").length

  // Calculate average resolution time
  const resolvedWithTime = requests.filter((r) => r.status === "resolved" && r.resolvedAt)
  const totalResolutionTime = resolvedWithTime.reduce((sum, r) => {
    const created = new Date(r.createdAt).getTime()
    const resolved = new Date(r.resolvedAt!).getTime()
    return sum + (resolved - created)
  }, 0)
  const averageResolutionTime =
    resolvedWithTime.length > 0
      ? totalResolutionTime / resolvedWithTime.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

  // Requests by category
  const requestsByCategory: Record<RequestCategory, number> = {
    water: 0,
    roads: 0,
    health: 0,
    education: 0,
    electricity: 0,
    waste: 0,
    environment: 0,
    infrastructure: 0,
    "public-safety": 0,
    general: 0,
  }
  requests.forEach((r) => {
    requestsByCategory[r.category]++
  })

  // Monthly trends (last 6 months)
  const monthlyTrends = generateMonthlyTrends(requests)

  const resolutionRate = totalRequests > 0 ? (resolvedRequests / totalRequests) * 100 : 0
  const speedScore = averageResolutionTime > 0 ? Math.max(0, 100 - averageResolutionTime * 5) : 50
  const activityScore = Math.min(100, (totalRequests / 10) * 20)
  const communityImpactScore = Math.round(resolutionRate * 0.5 + speedScore * 0.3 + activityScore * 0.2)

  const improvementRate = calculateImprovementRate(monthlyTrends)

  const departmentPerformance = calculateDepartmentPerformance(requests)

  const announcementEngagement = calculateAnnouncementEngagement()

  return {
    totalRequests,
    pendingRequests,
    inProgressRequests,
    resolvedRequests,
    rejectedRequests,
    averageResolutionTime,
    requestsByCategory,
    monthlyTrends,
    communityImpactScore,
    improvementRate,
    departmentPerformance,
    announcementEngagement,
  }
}

function generateMonthlyTrends(requests: ServiceRequest[]) {
  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString("default", { month: "short", year: "numeric" })

    const monthRequests = requests.filter((r) => {
      const requestDate = new Date(r.createdAt)
      return requestDate.getMonth() === date.getMonth() && requestDate.getFullYear() === date.getFullYear()
    })

    const resolved = monthRequests.filter((r) => r.status === "resolved").length

    months.push({
      month: monthName,
      requests: monthRequests.length,
      resolved,
    })
  }

  return months
}

function calculateImprovementRate(monthlyTrends: { month: string; requests: number; resolved: number }[]): number {
  if (monthlyTrends.length < 2) return 0

  const lastMonth = monthlyTrends[monthlyTrends.length - 1]
  const previousMonth = monthlyTrends[monthlyTrends.length - 2]

  const lastMonthRate = lastMonth.requests > 0 ? (lastMonth.resolved / lastMonth.requests) * 100 : 0
  const previousMonthRate = previousMonth.requests > 0 ? (previousMonth.resolved / previousMonth.requests) * 100 : 0

  return lastMonthRate - previousMonthRate
}

function calculateDepartmentPerformance(requests: ServiceRequest[]) {
  const departmentMap: Record<string, { resolved: number; pending: number; totalDays: number; count: number }> = {}

  // Map categories to departments
  const categoryToDepartment: Record<RequestCategory, string> = {
    water: "Engineering",
    roads: "Engineering",
    health: "Health",
    education: "Education",
    electricity: "ZESA",
    waste: "Engineering",
    environment: "Environmental Services",
    infrastructure: "Engineering",
    "public-safety": "Public Safety",
    general: "General Services",
  }

  requests.forEach((request) => {
    const dept = categoryToDepartment[request.category]
    if (!departmentMap[dept]) {
      departmentMap[dept] = { resolved: 0, pending: 0, totalDays: 0, count: 0 }
    }

    if (request.status === "resolved") {
      departmentMap[dept].resolved++
      if (request.resolvedAt) {
        const days =
          (new Date(request.resolvedAt).getTime() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        departmentMap[dept].totalDays += days
        departmentMap[dept].count++
      }
    } else if (request.status === "pending") {
      departmentMap[dept].pending++
    }
  })

  return Object.entries(departmentMap).map(([department, data]) => ({
    department,
    resolved: data.resolved,
    pending: data.pending,
    avgResolutionDays: data.count > 0 ? Math.round((data.totalDays / data.count) * 10) / 10 : 0,
  }))
}

function calculateAnnouncementEngagement() {
  const announcements = storage.getAnnouncements()
  const activeAnnouncements = storage.getActiveAnnouncements()

  const byDepartment: Record<Department, number> = {
    education: 0,
    health: 0,
    "engineering-infrastructure": 0,
    "social-services-housing": 0,
    zesa: 0,
    general: 0,
  }

  announcements.forEach((announcement) => {
    if (announcement.department) {
      byDepartment[announcement.department]++
    }
  })

  return {
    totalAnnouncements: announcements.length,
    activeAnnouncements: activeAnnouncements.length,
    byDepartment,
  }
}
