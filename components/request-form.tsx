"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RequestCategory, ServiceRequest } from "@/lib/types"
import { storage } from "@/lib/storage"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const categories: { value: RequestCategory; label: string }[] = [
  { value: "water", label: "Water Supply" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "sanitation", label: "Sanitation" },
  { value: "electricity", label: "Electricity" },
  { value: "other", label: "Other" },
]

export function RequestForm() {
  const [formData, setFormData] = useState({
    citizenName: "",
    citizenPhone: "",
    citizenEmail: "",
    category: "" as RequestCategory,
    title: "",
    description: "",
    location: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [requestId, setRequestId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const newRequest: ServiceRequest = {
        id: `REQ-${Date.now()}`,
        ...formData,
        status: "pending",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      storage.addRequest(newRequest)
      setRequestId(newRequest.id)
      setSubmitStatus("success")

      // Reset form
      setFormData({
        citizenName: "",
        citizenPhone: "",
        citizenEmail: "",
        category: "" as RequestCategory,
        title: "",
        description: "",
        location: "",
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Service Request</CardTitle>
        <CardDescription>Report issues or request services from your local authorities</CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Request submitted successfully! Your tracking ID is: <strong>{requestId}</strong>
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Failed to submit request. Please try again.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="citizenName">Full Name *</Label>
            <Input
              id="citizenName"
              required
              value={formData.citizenName}
              onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="citizenPhone">Phone Number *</Label>
            <Input
              id="citizenPhone"
              type="tel"
              required
              value={formData.citizenPhone}
              onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
              placeholder="+263771234567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="citizenEmail">Email (Optional)</Label>
            <Input
              id="citizenEmail"
              type="email"
              value={formData.citizenEmail}
              onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              required
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as RequestCategory })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about the issue"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Mkoba 5, Gweru"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
