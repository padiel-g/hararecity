export type RequestStatus = "pending" | "in-progress" | "resolved" | "rejected"

export type RequestCategory =
  | "water"
  | "healthcare"
  | "education"
  | "infrastructure"
  | "sanitation"
  | "electricity"
  | "other"

export type Department =
  | "education"
  | "health"
  | "engineering-infrastructure"
  | "social-services-housing"
  | "zesa"
  | "general"

export interface ServiceRequest {
  id: string
  citizenName: string
  citizenPhone: string
  citizenEmail?: string
  category: RequestCategory
  title: string
  description: string
  location: string
  status: RequestStatus
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  assignedTo?: string
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "citizen" | "admin" | "staff"
  phone: string
  department?: Department
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  department: Department
  departmentName: string
  authorId: string
  authorName: string
  priority: "low" | "medium" | "high" | "urgent"
  imageUrl?: string
  imageName?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  isActive: boolean
}

export interface PerformanceMetrics {
  totalRequests: number
  pendingRequests: number
  inProgressRequests: number
  resolvedRequests: number
  rejectedRequests: number
  averageResolutionTime: number
  requestsByCategory: Record<RequestCategory, number>
  monthlyTrends: {
    month: string
    requests: number
    resolved: number
  }[]
  communityImpactScore: number
  improvementRate: number
  departmentPerformance: {
    department: string
    resolved: number
    pending: number
    avgResolutionDays: number
  }[]
  announcementEngagement: {
    totalAnnouncements: number
    activeAnnouncements: number
    byDepartment: Record<Department, number>
  }
}
