"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, MapPin } from "lucide-react"

export function CreateReportDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full p-0 shadow-lg md:h-auto md:w-auto md:rounded-lg md:px-6"
        >
          <Plus className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">New Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
          <DialogDescription>
            Report a civic issue in your community. Include as much detail as possible.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Brief description of the issue" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="safety">Public Safety</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the issue..."
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="w-full bg-transparent" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload a photo to help identify the issue</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center gap-2">
              <Input id="location" placeholder="Auto-detected via GPS" disabled />
              <Button variant="outline" size="icon" type="button">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
