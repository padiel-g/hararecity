"use client"

import { useState } from "react"
import type { ServiceRequest, RequestStatus } from "@/lib/types"
import { storage } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
}

interface RequestsTableProps {
  requests: ServiceRequest[]
  onUpdate: () => void
}

export function RequestsTable({ requests, onUpdate }: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [editData, setEditData] = useState({
    status: "" as RequestStatus,
    assignedTo: "",
    notes: "",
    priority: "" as "low" | "medium" | "high",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setEditData({
      status: request.status,
      assignedTo: request.assignedTo || "",
      notes: request.notes || "",
      priority: request.priority,
    })
    setIsDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!selectedRequest) return

    const updates: Partial<ServiceRequest> = {
      ...editData,
    }

    if (editData.status === "resolved" && selectedRequest.status !== "resolved") {
      updates.resolvedAt = new Date().toISOString()
    }

    storage.updateRequest(selectedRequest.id, updates)
    setIsDialogOpen(false)
    onUpdate()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>Manage and track all citizen service requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No requests found</div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge className={statusColors[request.status]}>{statusLabels[request.status]}</Badge>
                        <Badge className={priorityColors[request.priority]} variant="outline">
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>👤 {request.citizenName}</span>
                        <span>📞 {request.citizenPhone}</span>
                        <span>📍 {request.location}</span>
                        <span>📅 {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(request)}>
                      Edit
                    </Button>
                  </div>
                  {request.assignedTo && (
                    <div className="text-xs bg-muted px-2 py-1 rounded inline-block">
                      Assigned to: {request.assignedTo}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Request</DialogTitle>
            <DialogDescription>Update the status and details of this service request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Request ID</Label>
                <Input value={selectedRequest.id} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) => setEditData({ ...editData, status: value as RequestStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editData.priority}
                  onValueChange={(value) => setEditData({ ...editData, priority: value as "low" | "medium" | "high" })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Input
                  id="assignedTo"
                  value={editData.assignedTo}
                  onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                  placeholder="Department or staff member"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  placeholder="Add notes or updates"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Update Request</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
