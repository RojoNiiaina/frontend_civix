"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useReports from "@/hooks/useReports"
import useAuth from "@/hooks/useAuth"
import NavBar from "@/components/NavBar"
import { AgentStatsCard } from "@/components/agent-stats-card"
import { UrgentPrioritiesCard } from "@/components/urgent-priorities-card"
import { HeatmapCard } from "@/components/heatmap-card"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  TrendingUp,
  Users,
  LogOut,
  MapIcon,
  Activity,
  Target,
  BarChart3,
  Calendar,
  Filter,
  MoreVertical,
} from "lucide-react"
import useRecentReports from "@/hooks/useRecentReports"
import { ReportCard } from "@/components/report-card"
import { AddAgentDialog } from "@/components/add-agent-dialog"

export default function AgentDashboard() {
  const { data: reports = [], isLoading, error } = useReports()
  const stats = {
    newReports: reports.filter(report => report.statut === 'en_attente').length,
    approuve: reports.filter(report => report.statut === 'approuve').length,
    avgResponseTime: "2.4 hrs",
    totalReports: reports.length,
    resolutionRate: 87,
    activeAgents: 12,
    avgResolutionTime: "2.5h",
    weeklyTrend: 15
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavBar />
      

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord Agent</h1>
              <p className="text-muted-foreground">Vue d'ensemble des activités et performances</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/agent/live">
                <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Users className="h-4 w-4" />
                  Live vidéo
                </Button>
              </Link>
              <Link href="/agent/manage">
                <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Users className="h-4 w-4" />
                  Liste des agents
                </Button>
              </Link>
              <Link href="/agent/citizen">
                <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Users className="h-4 w-4" />
                  Citoyens
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors relative">
                  <Bell className="h-4 w-4" />
                  Messages
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-background">
                    3
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* KPI Cards Section */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.newReports}</div>
              <p className="text-sm font-medium text-foreground">Nouveaux signalements</p>
              <p className="text-xs text-muted-foreground mt-1">En attente de traitement</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.approuve}</div>
              <p className="text-sm font-medium text-foreground">Signalements approuvés</p>
              <p className="text-xs text-muted-foreground mt-1">Traitées avec succès</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>-15%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.avgResponseTime}</div>
              <p className="text-sm font-medium text-foreground">Temps de réponse moyen</p>
              <p className="text-xs text-muted-foreground mt-1">Amélioration cette semaine</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <BarChart3 className="h-3 w-3" />
                  <span>{stats.resolutionRate}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.resolutionRate}%</div>
              <p className="text-sm font-medium text-foreground">Taux de résolution</p>
              <p className="text-xs text-muted-foreground mt-1">Performance globale</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* Left Column - Performance Stats */}
          <div className="xl:col-span-4">
            <AgentStatsCard />
          </div>

          {/* Center Column - Reports Management */}
          <div className="xl:col-span-5">
            <Card className="h-full border shadow-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Gestion des signalements
                    </CardTitle>
                    <CardDescription className="mt-1">Suivi et traitement des rapports citoyens</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Période
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <div className="p-6">
                <Tabs defaultValue="approuve">
                  <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mb-4">
                    <TabsList className="grid w-full grid-cols-3 h-10">
                      <TabsTrigger
                        value="approuve"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                      >
                        Approuvés ({reports.filter(r => r.statut === 'approuve').length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="en_attente"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                      >
                        En attente ({reports.filter(r => r.statut === 'en_attente').length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejete"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                      >
                        Rejetées ({reports.filter(r => r.statut === 'rejete').length})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="xl:h-[600px] h-[600px] overflow-y-auto space-y-3">
                    <TabsContent value="approuve" className="mt-0">
                      {reports.filter(report => report.statut === 'approuve').length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Aucun signalement approuvé</p>
                        </div>
                      ) : (
                        reports.filter(report => report.statut === 'approuve').map((report, index) => (
                          <div key={index}>
                            <ReportCard {...report} />
                          </div>
                        ))
                      )}
                    </TabsContent>
                    <TabsContent value="en_attente" className="mt-0">
                      {reports.filter(report => report.statut === 'en_attente').length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Aucun signalement en attente</p>
                        </div>
                      ) : (
                        reports.filter(report => report.statut === 'en_attente').map((report, index) => (
                          <div key={index}>
                            <ReportCard {...report} />
                          </div>
                        ))
                      )}
                    </TabsContent>
                    <TabsContent value="rejete" className="mt-0">
                      {reports.filter(report => report.statut === 'rejete').length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Aucun signalement rejeté</p>
                        </div>
                      ) : (
                        reports.filter(report => report.statut === 'rejete').map((report, index) => (
                          <div key={index}>
                            <ReportCard {...report} />
                          </div>
                        ))
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Right Column - Activity and Priorities */}
          <div className="xl:col-span-3 space-y-6">
            {/* <UrgentPrioritiesCard /> */}
            
            <Card className="border shadow-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Activité récente
                </CardTitle>
                <CardDescription>Dernières mises à jour du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Rapport résolu</p>
                    <p className="text-xs text-muted-foreground">Problème de lanterneaux sur Oak Ave</p>
                    <p className="text-xs text-muted-foreground">Il y a 5 minutes</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Mise à jour de statut</p>
                    <p className="text-xs text-muted-foreground">Réparation de poubelle en cours</p>
                    <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-800/30">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Nouveau cas urgent</p>
                    <p className="text-xs text-muted-foreground">Déchet illégal signalé</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Soutien communautaire</p>
                    <p className="text-xs text-muted-foreground">24 votes sur le problème des poubelles</p>
                    <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
