"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Announcement, Department } from "@/lib/types"
import { storage } from "@/lib/storage"
import { auth } from "@/lib/auth"

const DEPARTMENT_NAMES: Record<Department, string> = {
  education: "Education Department",
  health: "Health Department",
  "engineering-infrastructure": "Engineering & Infrastructure",
  "social-services-housing": "Social Services & Housing",
  zesa: "ZESA",
  general: "General Administration",
}

export function AnnouncementForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [expiresIn, setExpiresIn] = useState<string>("30")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUser = auth.getCurrentUser()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!currentUser || !currentUser.department) {
      setError("You must be logged in as a department admin to post announcements")
      return
    }

    if (!title.trim() || !content.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const expiresAt = expiresIn
        ? new Date(Date.now() + Number.parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString()
        : undefined

      const announcement: Announcement = {
        id: `ann-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        department: currentUser.department,
        departmentName: DEPARTMENT_NAMES[currentUser.department],
        authorId: currentUser.id,
        authorName: currentUser.name,
        priority,
        imageUrl: imagePreview || undefined,
        imageName: imageFile?.name || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt,
        isActive: true,
      }

      storage.addAnnouncement(announcement)

      setSuccess("Announcement posted successfully!")
      setTitle("")
      setContent("")
      setPriority("medium")
      setExpiresIn("30")
      setImageFile(null)
      setImagePreview("")

      setTimeout(() => {
        setSuccess("")
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError("Failed to post announcement. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📢</span>
          Post New Announcement
        </CardTitle>
        <CardDescription>Share important updates with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <span>⚠️</span>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your announcement message..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Attach Image (Optional)</Label>
            <div className="flex flex-col gap-3">
              {!imagePreview ? (
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="w-full"
                  >
                    📤 Upload Image
                  </Button>
                </div>
              ) : (
                <div className="relative border rounded-lg p-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={handleRemoveImage}
                  >
                    ✕
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">🖼️ {imageFile?.name}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expires In (days)</Label>
              <Input
                id="expires"
                type="number"
                min="1"
                max="365"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
