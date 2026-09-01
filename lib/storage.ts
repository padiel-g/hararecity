import type { ServiceRequest, User, Announcement } from "./types"

const REQUESTS_KEY = "smart_village_requests"
const USERS_KEY = "smart_village_users"
const CURRENT_USER_KEY = "smart_village_current_user"
const ANNOUNCEMENTS_KEY = "smart_village_announcements"

export const storage = {
  // Service Requests
  getRequests: (): ServiceRequest[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(REQUESTS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveRequests: (requests: ServiceRequest[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  },

  addRequest: (request: ServiceRequest) => {
    const requests = storage.getRequests()
    requests.push(request)
    storage.saveRequests(requests)
  },

  updateRequest: (id: string, updates: Partial<ServiceRequest>) => {
    const requests = storage.getRequests()
    const index = requests.findIndex((r) => r.id === id)
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates, updatedAt: new Date().toISOString() }
      storage.saveRequests(requests)
    }
  },

  getRequestById: (id: string): ServiceRequest | undefined => {
    return storage.getRequests().find((r) => r.id === id)
  },

  // Users
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveUsers: (users: User[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(CURRENT_USER_KEY)
    return data ? JSON.parse(data) : null
  },

  setCurrentUser: (user: User | null) => {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  },

  // Announcements
  getAnnouncements: (): Announcement[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(ANNOUNCEMENTS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveAnnouncements: (announcements: Announcement[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements))
  },

  addAnnouncement: (announcement: Announcement) => {
    const announcements = storage.getAnnouncements()
    announcements.unshift(announcement)
    storage.saveAnnouncements(announcements)
  },

  updateAnnouncement: (id: string, updates: Partial<Announcement>) => {
    const announcements = storage.getAnnouncements()
    const index = announcements.findIndex((a) => a.id === id)
    if (index !== -1) {
      announcements[index] = { ...announcements[index], ...updates, updatedAt: new Date().toISOString() }
      storage.saveAnnouncements(announcements)
    }
  },

  deleteAnnouncement: (id: string) => {
    const announcements = storage.getAnnouncements()
    const filtered = announcements.filter((a) => a.id !== id)
    storage.saveAnnouncements(filtered)
  },

  getActiveAnnouncements: (): Announcement[] => {
    const announcements = storage.getAnnouncements()
    const now = new Date()
    return announcements.filter((a) => {
      if (!a.isActive) return false
      if (a.expiresAt && new Date(a.expiresAt) < now) return false
      return true
    })
  },

  // Initialize with demo data
  initializeDemoData: () => {
    const requests = storage.getRequests()
    if (requests.length === 0) {
      const demoRequests: ServiceRequest[] = [
        {
          id: "1",
          citizenName: "John Moyo",
          citizenPhone: "+263771234567",
          category: "water",
          title: "Water supply disruption in Borrowdale",
          description: "No water supply for the past 3 days in Borrowdale West",
          location: "Borrowdale, Harare",
          status: "in-progress",
          priority: "high",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: "Water & Sewerage Department",
        },
        {
          id: "2",
          citizenName: "Grace Ncube",
          citizenPhone: "+263772345678",
          category: "health",
          title: "Clinic needs medical supplies",
          description: "The local clinic is running low on essential medical supplies",
          location: "Mbare, Harare",
          status: "resolved",
          priority: "medium",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: "Health Services Department",
        },
      ]
      storage.saveRequests(demoRequests)
    }

    const users = storage.getUsers()
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: "admin1",
          name: "Admin User",
          email: "admin@harare.gov.zw",
          role: "admin",
          phone: "+263771111111",
          createdAt: new Date().toISOString(),
        },
      ]
      storage.saveUsers(demoUsers)
    }

    const announcements = storage.getAnnouncements()
    if (announcements.length === 0) {
      const demoAnnouncements: Announcement[] = [
        {
          id: "1",
          title: "Water Supply Alert",
          content: "Water supply disruption in Budirio 2",
          isActive: true,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      storage.saveAnnouncements(demoAnnouncements)
    }
  },
}
