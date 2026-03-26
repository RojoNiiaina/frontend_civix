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
import { Plus, Upload, MapPin, Camera, X } from "lucide-react"
import useReports from "@/hooks/useReports"

export function FloatingCreateButton() {
  const [open, setOpen] = useState(false)
  const { addReport, isAdding } = useReports()
  
  const [formData, setFormData] = useState({
    description: "",
    lieu: "",
    image: null as File | null,
    image1: null as File | null,
    image2: null as File | null,
  })
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }
  
  const handleSubmit = () => {
    if (!formData.description) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }
    
    const reportData = {
      description: formData.description,
      lieu: formData.lieu,
      image: formData.image || undefined,
      image1: formData.image1 || undefined,
      image2: formData.image2 || undefined,
    }
    
    addReport(reportData, {
      onSuccess: () => {
        setOpen(false)
        setFormData({
          description: "",
          lieu: "",
          image: null,
          image1: null,
          image2: null,
        })
      },
      onError: (error) => {
        console.error("Failed to create report:", error)
        alert("Échec de la création du rapport. Veuillez réessayer.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-40 lg:hidden h-14 w-14 rounded-full p-0 shadow-2xl transition-all hover:scale-110 hover:shadow-xl bg-primary hover:bg-primary/90"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Créer un nouveau rapport</DialogTitle>
          <DialogDescription className="text-base">
            Signalez un problème civique dans votre communauté.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-6">
          <div className="space-y-2">
            <Label htmlFor="description-mobile" className="text-sm font-semibold">
              Description *
            </Label>
            <Textarea
              id="description-mobile"
              placeholder="Décrivez le problème..."
              rows={5}
              className="resize-none text-base"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Photos</Label>
            <p className="text-xs text-muted-foreground">Ajoutez jusqu'à 3 photos</p>
            {[{ field: 'image', label: 'Photo 1' }, { field: 'image1', label: 'Photo 2' }, { field: 'image2', label: 'Photo 3' }].map(({ field, label }) => (
              <div key={field} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 bg-muted/50" 
                    type="button" 
                    onClick={() => document.getElementById(`${field}-upload-mobile`)?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Photo
                  </Button>
                  <input
                    id={`${field}-upload-mobile`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                  />
                </div>
                {formData[field as keyof typeof formData] && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                    <img
                      src={URL.createObjectURL(formData[field as keyof typeof formData] as File)}
                      alt={`${label} preview`}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 rounded-full"
                      onClick={() => handleFileChange(field, null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-mobile" className="text-sm font-semibold">
              Lieu *
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="lieu-mobile"
                className="h-11 flex-1" 
                placeholder="Votre lieu" 
                value={formData.lieu}
                onChange={(e) => handleInputChange("lieu", e.target.value)}
              />
              <Button variant="outline" size="icon" type="button" className="h-11 w-11 bg-transparent">
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="h-11 px-6" disabled={isAdding}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="h-11 px-8 font-semibold" disabled={isAdding}>
            {isAdding ? "Soumission..." : "Soumettre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
