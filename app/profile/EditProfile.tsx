'use client'

import React from "react"

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAuth from '@/hooks/useAuth'
import useUsers from "@/hooks/useUser"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

import { usersAPI } from "@/lib/api"

export default function EditProfile({ open, onOpenChange }: EditProfileDialogProps) {
    const { user } = useAuth()
  const [formData, setFormData] = useState(() => ({
    id: user?.id || "",
    nom: user?.nom || "",
    email: user?.email || "",
    cin: user?.cin || "",
    telephone: user?.telephone || "",
    photo: user?.photo || "",
  }))
  const [previewImage, setPreviewImage] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { updateUser } = useUsers()

  React.useEffect(() => {
    setFormData({
      id: user?.id || "",
      nom: user?.nom || "",
      email: user?.email || "",
      cin: user?.cin || "",
      telephone: user?.telephone || "",
      photo: user?.photo || "",
    })
    setPreviewImage(user?.photo || "")
  }, [user, open])
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewImage(URL.createObjectURL(file)) // plus rapide que base64
    setSelectedFile(file)
  }


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const fd = new FormData();
        fd.append('nom', formData.nom);
        fd.append('email', formData.email);
        fd.append('cin', formData.cin);
        fd.append('telephone', formData.telephone);
        if (selectedFile) {
          fd.append('photo', selectedFile);
        }
        updateUser({ id: Number(formData.id), formData: fd }, {
          onSuccess: () => {
            setIsLoading(false);
            onOpenChange(false);
          },
          onError: (error: any) => {
            setIsLoading(false);
            console.error("Failed to update user:", error);
            alert("Failed to update user. Please try again.");
          }
        });
      } catch (err) {
        setIsLoading(false);
        alert("Erreur lors de la préparation de la requête.");
      }
    };

  const getImageUrl = () => {
    if (!formData.photo) return null
    // Si l'photo commence par http, c'est déjà une URL complète (retournée par le serializer)
    if (formData.photo.startsWith('http://') || formData.photo.startsWith('https://')) {
      return formData.photo
    }
    // Si l'formData.photo commence par /media/, c'est une URL relative du backend Django
    if (formData.photo.startsWith('/media/')) {
      return `http://localhost:8000${formData.photo}`
    }
    // Sinon, essayer de construire l'URL complète
    return `http://localhost:8000/media/${formData.photo}`
  }

  const imageUrl = getImageUrl()
  const testImageUrl = "http://localhost:8000/media/account.jpg" // URL statique de test - maintenant directement dans reports/
  
  // Utiliser l'URL de test pour déboguer, ou l'URL réelle si disponible
  const displayImageUrl = imageUrl || testImageUrl
  

const fields = [
  { id: 'nom', label: 'Nom complet', type: 'text' },
  { id: 'email', label: 'Adresse Email', type: 'email' },
  { id: 'cin', label: 'CIN', type: 'text' },
  { id: 'telephone', label: 'Téléphone', type: 'tel' },
]



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and profile picture
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            {
              displayImageUrl ? (
                <img 
                  src={displayImageUrl || "/placeholder.svg"} 
                  alt={"Profile image"} 
                  className="w-24 h-24 object-cover transition-transform duration-300 hover:scale-105 rounded-full"
                  onError={(e) => {
                  console.error("Erreur de chargement d'image:", displayImageUrl, e);
                  }}
                  onLoad={() => {
                  console.log("Image chargée avec succès:", displayImageUrl);
                  }}
                />
              ):(
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={previewImage || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-lg font-bold">
                    {formData.nom
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              )
            }
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    Change Photo
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Name Field */}
          {fields.map(f => (
            <div key={f.id} className="space-y-2">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                type={f.type}
                placeholder={`Enter your ${f.label.toLowerCase()}`}
                value={formData[f.id as keyof typeof formData]}
                onChange={(e) => handleInputChange(e, f.id)}
                disabled={isLoading}
              />
            </div>
          ))}

          {/* Dialog Footer */}
          <DialogFooter className="mt-6 gap-6 sm:gap-0">
            <form onSubmit={handleSubmit}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
