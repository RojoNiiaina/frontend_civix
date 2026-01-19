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

export default function ProfilePage() {
  const { user, isLoadingUser, userError } = useAuth()
  const reportsHook = useMyReports()

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (userError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Impossible de charger votre profil.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Aucun utilisateur connecté.</p>
      </div>
    )
  }

  const { id, nom, email, role, statut, date_inscription } = user

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
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
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="John Doe" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="mb-1 text-2xl font-bold">{nom}</h1>
                  <p className="mb-3 text-muted-foreground">
                    {formattedJoinDate ? `Joined ${formattedJoinDate}` : "Member"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <Award className="h-3 w-3" />
                      Active Contributor
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {userStats.reputationScore} reputation
                    </Badge>
                  </div>
                </div>
                <Button>Edit Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Award className="h-4 w-4" />
                  Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Award className="h-4 w-4" />
                  Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Tabs */}
          <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">My Reports</TabsTrigger>
              <TabsTrigger value="supported">Supported</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="reports" className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-red-500">Erreur lors du chargement de vos publications.</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune publication</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous n'avez pas encore créé de publication.
                  </p>
                </div>
              ) : (
                reports.map((report, index) => (
                  <ReportCard key={report.id || index} {...report} />
                ))
              )}
            </TabsContent>
            <TabsContent value="supported" className="mt-6">
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No supported reports yet</h3>
                <p className="text-sm text-muted-foreground">
                  Support reports in your community to show your engagement
                </p>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">Created a new report</span> - Pothole on Main Street
                        </p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
