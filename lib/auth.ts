import type { User, Department } from "./types"
import { storage } from "./storage"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  phone: string
}

// Demo credentials for testing
const DEMO_ADMINS = [
  {
    email: "education@gweru.gov.zw",
    password: "edu123",
    role: "admin" as const,
    department: "education" as Department,
    name: "Education Department Admin",
  },
  {
    email: "health@gweru.gov.zw",
    password: "health123",
    role: "admin" as const,
    department: "health" as Department,
    name: "Health Department Admin",
  },
  {
    email: "engineering@gweru.gov.zw",
    password: "eng123",
    role: "admin" as const,
    department: "engineering-infrastructure" as Department,
    name: "Engineering & Infrastructure Admin",
  },
  {
    email: "social@gweru.gov.zw",
    password: "social123",
    role: "admin" as const,
    department: "social-services-housing" as Department,
    name: "Social Services & Housing Admin",
  },
  {
    email: "zesa@gweru.gov.zw",
    password: "zesa123",
    role: "admin" as const,
    department: "zesa" as Department,
    name: "ZESA Admin",
  },
  {
    email: "admin@gweru.gov.zw",
    password: "admin123",
    role: "admin" as const,
    department: "general" as Department,
    name: "General Admin",
  },
]

const DEMO_STAFF = {
  email: "staff@gweru.gov.zw",
  password: "staff123",
  role: "staff" as const,
}

export const auth = {
  login: (credentials: LoginCredentials): User | null => {
    console.log("[v0] auth.login called with email:", credentials.email)

    // Check demo admins
    const demoAdmin = DEMO_ADMINS.find(
      (admin) => admin.email === credentials.email && admin.password === credentials.password,
    )

    if (demoAdmin) {
      console.log("[v0] Found matching demo admin:", demoAdmin.name)
      const user: User = {
        id: `admin-${demoAdmin.department}`,
        name: demoAdmin.name,
        email: demoAdmin.email,
        role: demoAdmin.role,
        department: demoAdmin.department,
        phone: "+263771111111",
        createdAt: new Date().toISOString(),
      }
      console.log("[v0] Setting current user in storage...")
      storage.setCurrentUser(user)
      console.log("[v0] User saved to storage successfully")
      return user
    }

    // Check demo staff
    if (credentials.email === DEMO_STAFF.email && credentials.password === DEMO_STAFF.password) {
      console.log("[v0] Found matching demo staff")
      const user: User = {
        id: "staff-1",
        name: "Staff User",
        email: DEMO_STAFF.email,
        role: DEMO_STAFF.role,
        phone: "+263772222222",
        createdAt: new Date().toISOString(),
      }
      storage.setCurrentUser(user)
      return user
    }

    // Check registered users
    const users = storage.getUsers()
    console.log("[v0] Checking registered users, count:", users.length)
    const user = users.find((u) => u.email === credentials.email)

    if (user) {
      console.log("[v0] Found registered user:", user.name)
      // In a real app, we'd verify password hash
      // For demo, we'll accept any password for registered users
      storage.setCurrentUser(user)
      return user
    }

    console.log("[v0] No matching user found")
    return null
  },

  register: (data: RegisterData): User => {
    const users = storage.getUsers()

    // Check if email already exists
    if (users.some((u) => u.email === data.email)) {
      throw new Error("Email already registered")
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "citizen",
      phone: data.phone,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    storage.saveUsers(users)
    storage.setCurrentUser(newUser)

    return newUser
  },

  logout: () => {
    console.log("[v0] Logging out user")
    storage.setCurrentUser(null)
  },

  getCurrentUser: (): User | null => {
    const user = storage.getCurrentUser()
    console.log("[v0] getCurrentUser called, user:", user ? user.name : "null")
    return user
  },

  isAuthenticated: (): boolean => {
    const authenticated = storage.getCurrentUser() !== null
    console.log("[v0] isAuthenticated:", authenticated)
    return authenticated
  },

  hasRole: (role: User["role"] | User["role"][]): boolean => {
    const user = storage.getCurrentUser()
    if (!user) {
      console.log("[v0] hasRole: no user found")
      return false
    }

    if (Array.isArray(role)) {
      const hasRole = role.includes(user.role)
      console.log("[v0] hasRole check (array):", hasRole, "user role:", user.role, "required:", role)
      return hasRole
    }

    const hasRole = user.role === role
    console.log("[v0] hasRole check (single):", hasRole, "user role:", user.role, "required:", role)
    return hasRole
  },
}
