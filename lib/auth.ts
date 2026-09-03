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
    email: "education@harare.gov.zw",
    password: "edu123",
    role: "admin" as const,
    department: "education" as Department,
    name: "Education Department Admin",
  },
  {
    email: "health@harare.gov.zw",
    password: "health123",
    role: "admin" as const,
    department: "health" as Department,
    name: "Health Department Admin",
  },
  {
    email: "engineering@harare.gov.zw",
    password: "eng123",
    role: "admin" as const,
    department: "engineering-infrastructure" as Department,
    name: "Engineering & Infrastructure Admin",
  },
  {
    email: "social@harare.gov.zw",
    password: "social123",
    role: "admin" as const,
    department: "social-services-housing" as Department,
    name: "Social Services & Housing Admin",
  },
  {
    email: "zesa@harare.gov.zw",
    password: "zesa123",
    role: "admin" as const,
    department: "zesa" as Department,
    name: "ZESA Admin",
  },
  {
    email: "admin@harare.gov.zw",
    password: "admin123",
    role: "admin" as const,
    department: "general" as Department,
    name: "General Admin",
  },
]

const DEMO_STAFF = {
  email: "staff@harare.gov.zw",
  password: "staff123",
  role: "staff" as const,
}

export const auth = {
  login: (credentials: LoginCredentials): User | null => {
    // Check demo admins
    const demoAdmin = DEMO_ADMINS.find(
      (admin) => admin.email === credentials.email && admin.password === credentials.password,
    )

    if (demoAdmin) {
      const user: User = {
        id: `admin-${demoAdmin.department}`,
        name: demoAdmin.name,
        email: demoAdmin.email,
        role: demoAdmin.role,
        department: demoAdmin.department,
        phone: "+263771111111",
        createdAt: new Date().toISOString(),
      }
      storage.setCurrentUser(user)
      return user
    }

    // Check demo staff
    if (credentials.email === DEMO_STAFF.email && credentials.password === DEMO_STAFF.password) {
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
    const user = users.find((u) => u.email === credentials.email)

    if (user) {
      // In a real app, we'd verify password hash
      // For demo, we'll accept any password for registered users
      storage.setCurrentUser(user)
      return user
    }

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
    storage.setCurrentUser(null)
  },

  getCurrentUser: (): User | null => {
    return storage.getCurrentUser()
  },

  isAuthenticated: (): boolean => {
    return storage.getCurrentUser() !== null
  },

  hasRole: (role: User["role"] | User["role"][]): boolean => {
    const user = storage.getCurrentUser()
    if (!user) {
      return false
    }

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  },
}
