"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Target, Users, ArrowUp, ArrowDown } from "lucide-react"

export function AgentStatsCard() {
  const stats = {
    totalReports: 24,
    resolvedToday: 8,
    avgResolutionTime: "2.5h",
    pendingHigh: 3,
    performanceScore: 87,
    weeklyTrend: 12,
    agentRank: 3,
    totalAgents: 12
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Mes Performances
            </CardTitle>
            <CardDescription className="mt-1">Aperçu de votre activité aujourd'hui</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Rank #{stats.agentRank}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalReports}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total rapports</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+12%</span>
            </div>
          </div>
          <div className="text-center p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl border border-green-200/50 dark:border-green-800/30">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.resolvedToday}</div>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">Résolus aujourd'hui</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+8%</span>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium">Temps moyen</span>
                <p className="text-xs text-muted-foreground">Réponse par rapport</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-background">
              {stats.avgResolutionTime}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-200/30 dark:border-orange-800/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Urgents en attente</span>
                <p className="text-xs text-orange-600 dark:text-orange-400">Nécessite attention</p>
              </div>
            </div>
            <Badge variant="destructive" className="bg-orange-500/10 text-orange-700 border-orange-200/50 dark:bg-orange-500/20 dark:text-orange-300">
              {stats.pendingHigh}
            </Badge>
          </div>
        </div>

        {/* Performance Score */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Score de performance</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">{stats.performanceScore}%</span>
              <ArrowUp className="h-3 w-3 text-green-500" />
            </div>
          </div>
          <Progress value={stats.performanceScore} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground mt-2">Au-dessus de la moyenne de l'équipe</p>
        </div>

        {/* Team Comparison */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Position dans l'équipe</span>
            </div>
            <span className="text-sm text-muted-foreground">#{stats.agentRank} / {stats.totalAgents}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all"
                style={{ width: `${(stats.agentRank / stats.totalAgents) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="outline" className="w-full">
          Voir le détail des performances
        </Button>
      </CardContent>
    </Card>
  )
}
