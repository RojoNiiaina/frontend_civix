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
import { Plus, Upload, MapPin, Camera, X } from "lucide-react"
import useReports from "@/hooks/useReports"

export function CreateReportDialog() {
  const [open, setOpen] = useState(false)
  const { addReport, isAdding, addError } = useReports()
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    priorite: "medium" as "low" | "medium" | "high",
    latitude: "",
    longitude: "",
    image: null as File | null,
  })
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }))
  }
  
  const handleSubmit = () => {
    if (!formData.title || !formData.category_id || !formData.description) {
      alert("Please fill in all required fields")
      return
    }
    
    const reportData = {
      description: formData.description,
      category_id: parseInt(formData.category_id),
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
      priorite: formData.priorite,
      image: formData.image || undefined,
    }
    
    addReport(reportData, {
      onSuccess: () => {
        setOpen(false)
        setFormData({
          title: "",
          category_id: "",
          description: "",
          priorite: "medium",
          latitude: "",
          longitude: "",
          image: null,
        })
      },
      onError: (error) => {
        console.error("Failed to create report:", error)
        alert("Failed to create report. Please try again.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full p-0 shadow-2xl transition-all hover:scale-110 hover:shadow-xl md:h-auto md:w-auto md:rounded-xl md:px-8 md:py-4"
        >
          <Plus className="h-7 w-7 md:mr-2" />
          <span className="hidden md:inline md:text-base md:font-semibold">New Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Report</DialogTitle>
          <DialogDescription className="text-base">
            Report a civic issue in your community. Include as much detail as possible to help resolve it quickly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Title
            </Label>
            <Input id="title" placeholder="Brief description of the issue" className="h-11 text-base" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category
            </Label>
            <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
              <SelectTrigger id="category" className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Infrastructure</SelectItem>
                <SelectItem value="2">Sanitation</SelectItem>
                <SelectItem value="3">Public Safety</SelectItem>
                <SelectItem value="4">Environment</SelectItem>
                <SelectItem value="5">Transportation</SelectItem>
                <SelectItem value="6">Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the issue..."
              rows={5}
              className="resize-none text-base"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo" className="text-sm font-semibold">
              Photo
            </Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex-1 h-12 bg-muted/50" type="button" onClick={() => document.getElementById('photo-upload')?.click()}>
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
              <Button variant="outline" className="flex-1 h-12 bg-muted/50" type="button" onClick={() => document.getElementById('photo-upload')?.click()}>
                <Upload className="mr-2 h-5 w-5" />
                Upload
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>
            <p className="text-xs text-muted-foreground">Add a photo to help identify and resolve the issue faster</p>
            {formData.image && (
              <div className="relative mt-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Selected image"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full"
                    onClick={() => handleFileChange(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formData.image.name} ({(formData.image.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">
              Location
            </Label>
            <div className="flex items-center gap-3">
              <Input id="location" placeholder="Auto-detected via GPS" disabled className="h-11 flex-1" value={formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : "Auto-detected via GPS"} />
              <Button variant="outline" size="icon" type="button" className="h-11 w-11 bg-transparent">
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="h-11 px-6" disabled={isAdding}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-11 px-8 font-semibold" disabled={isAdding}>
            {isAdding ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
