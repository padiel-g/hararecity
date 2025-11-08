"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import type { ServiceRequest } from "@/lib/types"
import { Search, Calendar, MapPin, User, Phone } from "lucide-react"

const statusColors = {
  pending: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  resolved: "bg-green-500",
  rejected: "bg-red-500",
}

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
}

export function TrackRequest() {
  const [requestId, setRequestId] = useState("")
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = () => {
    const found = storage.getRequestById(requestId)
    if (found) {
      setRequest(found)
      setNotFound(false)
    } else {
      setRequest(null)
      setNotFound(true)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Track Your Request</CardTitle>
        <CardDescription>Enter your request ID to check the status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="requestId">Request ID</Label>
            <Input
              id="requestId"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="REQ-1234567890"
            />
          </div>
          <Button onClick={handleSearch} className="mt-8">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {notFound && (
          <div className="text-center py-8 text-muted-foreground">
            Request not found. Please check your ID and try again.
          </div>
        )}

        {request && (
          <div className="space-y-4 border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{request.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
              </div>
              <Badge className={statusColors[request.status]}>{statusLabels[request.status]}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{request.citizenName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{request.citizenPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{request.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {request.assignedTo && (
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <span className="font-medium">Assigned to:</span> {request.assignedTo}
                </p>
              </div>
            )}

            {request.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {request.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
