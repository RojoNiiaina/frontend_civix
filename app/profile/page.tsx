"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Award, FileText, Heart, Loader2 } from "lucide-react"
import { ReportCard } from "@/components/report-card"
import useMyReports from "@/hooks/useMyReports"
import useAuth from "@/hooks/useAuth"
import EditProfile from "./EditProfile"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, isLoadingUser, userError } = useAuth()
  const reportsHook = useMyReports()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()

  if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Aucun utilisateur connecté.</p>
          <Button onClick={() => router.replace('/login')}>login</Button>
        </div>
      )
  }
  const { id, nom, email, role, statut, date_inscription, photo } = user

  const getImageUrl = () => {
    if (!photo) return null
    // Si l'photo commence par http, c'est déjà une URL complète (retournée par le serializer)
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo
    }
    // Si l'photo commence par /media/, c'est une URL relative du backend Django
    if (photo.startsWith('/media/')) {
      return `http://localhost:8000${photo}`
    }
    // Sinon, essayer de construire l'URL complète
    return `http://localhost:8000/media/${photo}`
  }

  const imageUrl = getImageUrl()
  const testImageUrl = "http://localhost:8000/media/account.jpg" // URL statique de test - maintenant directement dans reports/
  
  // Utiliser l'URL de test pour déboguer, ou l'URL réelle si disponible
  const displayImageUrl = imageUrl || testImageUrl
  
  

  const joinDate =
    date_inscription ? new Date(date_inscription) : null
  const formattedJoinDate = joinDate
    ? joinDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : null
  const userStats = {
    reportsSubmitted: 12,
    reportsResolved: 8,
    communitySupport: 156,
    reputationScore: 342,
  }

  const {
    data: reports = [],
    isLoading,
    error,
  } = reportsHook

  // Trier les publications par date décroissante (plus récentes en premier)
  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.created_at || 0)
    const dateB = new Date(b.created_at || 0)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/feed" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/logo/logo_civix.png" alt="logo_civix" className="rounded-xl" width={40} height={40}/>
            <span className="text-xl font-bold">CIVIX</span>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-3xl">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div>
                  {
                    !displayImageUrl ? (
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photo} alt={nom} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">{nom ? nom[0] : "U"}</AvatarFallback>
                      </Avatar>
                    ): (
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
                    )
                  }
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="mb-1 text-2xl font-bold">{nom}</h1>
                  <p className="mb-3 text-muted-foreground">
                    {formattedJoinDate ? `membre depuis ${formattedJoinDate}` : "Member"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge variant="outline" className="gap-1 bg-blue-200">
                      <Award className="h-3 w-3" />
                      {user.role === "user" ? "Citoyen": "Agent"}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {userStats.reputationScore} reputation
                    </Badge>
                  </div>
                </div>
                <Button className="sm:mt-4 font-semibold" onClick={() => setIsEditDialogOpen(true)}>Modifier le profil</Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tabs */}
          <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reports">Mes publications</TabsTrigger>
              <TabsTrigger value="approuve">Approuvée</TabsTrigger>
              <TabsTrigger value="en_attente">En attente</TabsTrigger>
              <TabsTrigger value="rejete">Refusée</TabsTrigger>
            </TabsList>
            <div className="h-[600px] overflow-y-auto">
            <TabsContent value="reports" className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-red-500">Erreur lors du chargement de vos publications.</p>
                </div>
              ) : sortedReports.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune publication</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous n'avez pas encore créé de publication.
                  </p>
                </div>
              ) : (
                sortedReports.map((report, index) => (
                  <ReportCard key={report.id || index} {...report} />
                ))
              )}
            </TabsContent>
            <TabsContent value="approuve" className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-red-500">Erreur lors du chargement de vos publications.</p>
                </div>
              ) : sortedReports.filter(report => report.statut === 'approuve').length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune publication approuvée</h3>
                </div>
              ) : (
                sortedReports.filter(report => report.statut === 'approuve').map((report, index) => (
                <div key={index} className="mb-4">
                  <ReportCard {...report} />
                </div>
              ))
              )}
            </TabsContent>
            <TabsContent value="en_attente" className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-red-500">Erreur lors du chargement de vos publications.</p>
                </div>
              ) : sortedReports.filter(report => report.statut === 'en_attente').length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune publication en attente de validation</h3>
                </div>
              ) : (
                sortedReports.filter(report => report.statut === 'en_attente').map((report, index) => (
                <div key={index} className="mb-4">
                  <ReportCard {...report} />
                </div>
              ))
              )}
            </TabsContent>
            <TabsContent value="rejete" className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-red-500">Erreur lors du chargement de vos publications.</p>
                </div>
              ) : sortedReports.filter(report => report.statut === 'rejete').length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune publication réjetée</h3>
                </div>
              ) : (
                sortedReports.filter(report => report.statut === 'rejete').map((report, index) => (
                  <div key={index} className="mb-4">
                    <ReportCard {...report} />
                  </div>
              ))
              )}
            </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <EditProfile
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  )
}
