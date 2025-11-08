"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Megaphone, Calendar, Building2, AlertCircle, Trash2 } from "lucide-react"
import type { Announcement } from "@/lib/types"
import { storage } from "@/lib/storage"
import { auth } from "@/lib/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
}

export function AnnouncementsList({ showAdminControls = false }: { showAdminControls?: boolean }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const currentUser = auth.getCurrentUser()

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = () => {
    const allAnnouncements = storage.getActiveAnnouncements()
    setAnnouncements(allAnnouncements)
  }

  const handleDelete = (id: string) => {
    storage.deleteAnnouncement(id)
    loadAnnouncements()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (announcements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No announcements at this time</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => {
        const canDelete = showAdminControls && currentUser?.id === announcement.authorId

        return (
          <Card key={announcement.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {announcement.departmentName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(announcement.createdAt)}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={PRIORITY_COLORS[announcement.priority]} variant="outline">
                    {announcement.priority}
                  </Badge>
                  {canDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this announcement? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(announcement.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {announcement.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border">
                  <img
                    src={announcement.imageUrl || "/placeholder.svg"}
                    alt={announcement.title}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{announcement.content}</p>
              {announcement.expiresAt && (
                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Expires on {formatDate(announcement.expiresAt)}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
