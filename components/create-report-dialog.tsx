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
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 rounded-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Nouveau rapport</span>
          <span className="sm:hidden">+</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Créer un nouveau rapport</DialogTitle>
          <DialogDescription className="text-base">
            Signalez un problème civique dans votre communauté. Incluez autant de détails que possible pour aider à le résoudre rapidement.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Fournissez des informations détaillées sur le problème..."
              rows={5}
              className="resize-none text-base"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Photos
            </Label>
            <p className="text-xs text-muted-foreground">Ajoutez jusqu'à 3 photos pour aider à identifier et résoudre le problème plus rapidement</p>
            
            {[{ field: 'image', label: 'Photo 1' }, { field: 'image1', label: 'Photo 2' }, { field: 'image2', label: 'Photo 3' }].map(({ field, label }) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={`${field}-upload`} className="text-xs font-medium text-muted-foreground">
                  {label}
                </Label>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 bg-muted/50" 
                    type="button" 
                    onClick={() => document.getElementById(`${field}-upload`)?.click()}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Prendre une photo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 bg-muted/50" 
                    type="button" 
                    onClick={() => document.getElementById(`${field}-upload`)?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Télécharger
                  </Button>
                  <input
                    id={`${field}-upload`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                  />
                </div>
                {formData[field as keyof typeof formData] && (
                  <div className="relative mt-3">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                      <img
                        src={URL.createObjectURL(formData[field as keyof typeof formData] as File)}
                        alt={`${label} preview`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full"
                        onClick={() => handleFileChange(field, null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {(formData[field as keyof typeof formData] as File).name} ({((formData[field as keyof typeof formData] as File).size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">
              Lieu *
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="lieu"
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
            {isAdding ? "Soumission..." : "Soumettre le rapport"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
