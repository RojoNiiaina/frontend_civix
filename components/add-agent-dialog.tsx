'use client'

import React from "react"

import { useState } from 'react'
import { Plus } from 'lucide-react'
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

interface AddAgentDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (data: {
    id: string,
    nom: string,
    email: string,
    role: string,
    statut: string,
    date_inscription: string,
    cin: string,
    telephone: string,
    photo: string,
  }) => void ,
}

export function AddAgentDialog({ open, onOpenChange, onSubmit }: AddAgentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    email: "",
    role: "agent",
    statut: "",
    date_inscription: "",
    cin: "",
    telephone: "",
    photo: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      department: value,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.nom || !formData.email || !formData.role || !formData.statut) {
      console.log('[v0] All fields are required')
      return
    }

    setIsLoading(true)
    try {
      onSubmit?.(formData)
      setFormData({
        id: "",
        nom: "",
        email: "",
        role: "agent",
        statut: "",
        date_inscription: "",
        cin: "",
        telephone: "",
        photo: "",
      })
      setIsOpen(false)
      console.log('[v0] Agent added:', formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel agent</DialogTitle>
          <DialogDescription>
            Create a new municipal agent account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter agent name"
              value={formData.nom}
              onChange={(e) => handleInputChange(e, 'nom')}
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              disabled={isLoading}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.telephone}
              onChange={(e) => handleInputChange(e, 'telephone')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cin">Numéro CIN</Label>
            <Input
              id="cin"
              type="tel"
              placeholder="CIN"
              value={formData.cin}
              onChange={(e) => handleInputChange(e, 'cin')}
              disabled={isLoading}
            />
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="mt-6 gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? 'Adding...' : 'Add Agent'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
