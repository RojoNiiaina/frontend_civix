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
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavBar />
      

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link href="/agent/manage">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Ajouter un agent
            </Button>
          </Link>
          <Link href="/agent/citizen">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Gestion des citoyens
            </Button>
          </Link>
        </div>
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nouvelle publication</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newReports}</div>
              <p className="text-xs text-muted-foreground">En attente de traitement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Publication approuvée</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approuve}</div>
              <p className="text-xs text-muted-foreground">Publication approuvée</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temps de réponse moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">15% faster this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-3 border-b border-border/40">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger
                  value="approuve"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Approuvé
                </TabsTrigger>
                <TabsTrigger
                  value="en_attente"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  En attente
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="approuve" className="mt-0 space-y-0">
              {reports.filter(report => report.statut === 'approuve').map((report, index) => (
                <div key={index} className="mb-4">
                  <ReportCard {...report} />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="en_attente" className="mt-0 space-y-0">
              {reports.filter(report => report.statut === 'en_attente').map((report, index) => (
                <div key={index} className="mb-4">
                  <ReportCard {...report} />
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Activity Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Report Resolved</p>
                    <p className="text-xs text-muted-foreground">Streetlight issue on Oak Ave</p>
                    <p className="text-xs text-muted-foreground">5 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Status Updated</p>
                    <p className="text-xs text-muted-foreground">Pothole repair in progress</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">New High Priority</p>
                    <p className="text-xs text-muted-foreground">Illegal dumping reported</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Community Support</p>
                    <p className="text-xs text-muted-foreground">24 votes on trash bin issue</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
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
