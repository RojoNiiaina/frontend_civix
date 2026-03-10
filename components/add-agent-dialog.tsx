'use client'

import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAuth from '@/hooks/useAuth'

const API_BASE_URL = "http://localhost:8000/api"

interface AddAgentDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onAgentAdded?: () => void
}

export function AddAgentDialog({ open, onOpenChange, onAgentAdded }: AddAgentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    telephone: "",
    role: "agent",
    cin: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.nom || !formData.email || !formData.password) {
      setError("Tous les champs obligatoires doivent être remplis")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la création de l'agent")
      }

      setFormData({
        nom: "",
        email: "",
        password: "",
        telephone: "",
        role: "agent",
        cin: ""
      })
      setIsOpen(false)
      onAgentAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter un agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel agent</DialogTitle>
          <DialogDescription>
            Créer un nouveau compte agent pour accéder à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nom">Nom complet</Label>
            <Input
              id="nom"
              placeholder="Entrez le nom complet"
              value={formData.nom}
              onChange={(e) => handleInputChange(e, 'nom')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Entrez l'adresse email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Entrez le mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange(e, 'password')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="Entrez le numéro de téléphone"
              value={formData.telephone}
              onChange={(e) => handleInputChange(e, 'telephone')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cin">Numéro CIN</Label>
            <Input
              id="cin"
              placeholder="Entrez le numéro CIN"
              value={formData.cin}
              onChange={(e) => handleInputChange(e, 'cin')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6 gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? 'Création...' : 'Créer l\'agent'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
