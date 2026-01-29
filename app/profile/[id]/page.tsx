"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Award, FileText, Loader2 } from "lucide-react"
import { ReportCard } from "@/components/report-card"
import useMyReports from "@/hooks/useMyReports"
import useAuth from "@/hooks/useAuth"
import EditProfile from "../EditProfile"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useUser from "@/hooks/useUser"
import React from "react"
import useReports from "@/hooks/useReports"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProfileUser({ params }: PageProps) {
  // ✅ unwrap Promise params
  const { id } = React.use(params)

  const { user } = useAuth()
  const reportsHook = useReports()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()

  const { ProfileUser } = useUser() // ✅ camelCase
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (!id) return

    ProfileUser(Number(id), {
      onSuccess: (data: any) => {
        setProfileData(data)
        setIsLoadingProfile(false)
      },
      onError: () => {
        setIsLoadingProfile(false)
      },
    })
  }, [id, ProfileUser])

  /* ---------------- AUTH GUARDS ---------------- */

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Aucun utilisateur connecté.</p>
        <Button onClick={() => router.replace("/login")}>Login</Button>
      </div>
    )
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Utilisateur non trouvé.</p>
        <Button onClick={() => router.replace("/feed")}>Retour</Button>
      </div>
    )
  }

  /* ---------------- DATA ---------------- */

  const { nom, role, date_inscription, photo } = profileData

  const getImageUrl = () => {
    if (!photo) return null
    if (photo.startsWith("http")) return photo
    if (photo.startsWith("/media/")) return `http://localhost:8000${photo}`
    return `http://localhost:8000/media/${photo}`
  }

  const displayImageUrl = getImageUrl()

  const joinDate = date_inscription ? new Date(date_inscription) : null
  const formattedJoinDate = joinDate
    ? joinDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null

  const {
    data: reports = [],
    isLoading,
    error,
  } = reportsHook

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/feed" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CIVIX</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-3xl">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div>
                  {displayImageUrl ? (
                    <img
                      src={displayImageUrl}
                      alt="Profile"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  ) : (
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {nom?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="mb-1 text-2xl font-bold">{nom}</h1>
                  <p className="mb-3 text-muted-foreground">
                    {formattedJoinDate ? `Inscrit ${formattedJoinDate}` : "Membre"}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge variant="outline" className="gap-1 bg-blue-200">
                      <Award className="h-3 w-3" />
                      {role === "user" ? "Citoyen" : "Agent"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="reports">Publications approuvée(s)</TabsTrigger>
            </TabsList>

            {/* All */}
            <TabsContent value="reports" className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <p className="text-red-500 text-center">Erreur chargement</p>
              ) : reports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto mb-4 h-12 w-12" />
                  <p>Aucune publication</p>
                </div>
              ) : (
                reports
                .filter((r: any) => r.statut === "approuve" && r.user.id === Number(id))
                .map((report: any) => (
                  <ReportCard key={report.id} {...report} />
                ))
              )}
            </TabsContent>

           
          </Tabs>
        </div>
      </div>

      <EditProfile open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </div>
  )
}
