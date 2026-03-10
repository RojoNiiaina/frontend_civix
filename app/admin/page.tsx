"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, CheckCircle2, Clock, TrendingUp, Loader2 } from "lucide-react"
import useReports from "@/hooks/useReports"
import useUsers from "@/hooks/useUser"
import useAdminStats from "@/hooks/useAdminStats"
import { useRouter } from "next/navigation"


export default function AdminDashboard() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: reports, isLoading: reportsLoading } = useReports();
  const { data: users, isLoading: usersLoading } = useUsers();

  // Stats dynamiques calculées depuis les hooks
  const dynamicStats = stats ? [
    { 
      title: "Total Utilisateurs", 
      value: stats.totalUsers.toLocaleString(), 
      change: `+${stats.userGrowth}%`, 
      icon: Users, 
      trend: "up" 
    },
    { 
      title: "Total Signalements", 
      value: stats.totalReports.toLocaleString(), 
      change: `+${stats.reportGrowth}%`, 
      icon: FileText, 
      trend: "up" 
    },
    { 
      title: "Résolus", 
      value: stats.resolvedReports.toLocaleString(), 
      change: `+${stats.resolvedGrowth}%`, 
      icon: CheckCircle2, 
      trend: "up" 
    },
    { 
      title: "En Attente", 
      value: stats.pendingReports.toLocaleString(), 
      change: `${stats.pendingGrowth}%`, 
      icon: Clock, 
      trend: stats.pendingGrowth >= 0 ? "up" : "down" 
    },
  ] : [];

  // Récents rapports (limités aux 5 premiers)
  const recentReports = reports?.slice(0, 5).map(report => ({
    id: `RPT-${String(report.id).padStart(3, '0')}`,
    title: report.description.substring(0, 50) + (report.description.length > 50 ? '...' : ''),
    category: "Signalement", // À adapter selon vos catégories
    status: report.statut === "en_attente" ? "en-attente" : 
            report.statut === "en_cours" ? "en-cours" : 
            report.statut === "resolu" ? "résolu" : report.statut,
    priority: "moyenne", // À adapter selon votre logique
    votes: report.like_count,
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en-attente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "en-cours":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "résolu":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "haute":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "moyenne":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "basse":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {(statsLoading || reportsLoading || usersLoading) && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Chargement des données...</span>
        </div>
      )}

      {/* Error State */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Erreur lors du chargement des statistiques</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className={`h-3 w-3 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                <span>du mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu de l'Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Signalements Soumis</span>
                <span className="text-sm font-semibold">{stats?.submittedReports.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[78%] bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Votes Communautaires</span>
                <span className="text-sm font-semibold">{stats?.communityVotes.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[92%] bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Commentaires Publiés</span>
                <span className="text-sm font-semibold">{stats?.publishedComments.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[65%] bg-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métriques de Résolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temps Moyen de Résolution</span>
                <span className="text-sm font-semibold">{stats?.avgResolutionTime} jours</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[45%] bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de Résolution</span>
                <span className="text-sm font-semibold">{stats?.resolutionRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[94%] bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction Citoyenne</span>
                <span className="text-sm font-semibold">{stats?.citizenSatisfaction} / 5.0</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[96%] bg-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Signalements Récents</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/admin/reports')}
            >
              Voir Tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-xs">{report.id}</TableCell>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {report.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.votes}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/reports/${report.id}`)}
                      >
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun signalement récent
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
