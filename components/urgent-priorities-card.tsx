"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, ArrowRight, Flame, Shield } from "lucide-react"

export function UrgentPrioritiesCard() {
  const urgentReports = [
    {
      id: "R-2024-089",
      type: "Déchet illégal",
      location: "Parc Central",
      time: "Il y a 15 min",
      priority: "high",
      severity: "critical",
      impact: "high"
    },
    {
      id: "R-2024-087", 
      type: "Lanterneaux cassés",
      location: "Avenue Oak",
      time: "Il y a 1h",
      priority: "high",
      severity: "medium",
      impact: "medium"
    },
    {
      id: "R-2024-085",
      type: "Poubelle vandalisée",
      location: "Rue Maple",
      time: "Il y a 2h",
      priority: "medium",
      severity: "low",
      impact: "medium"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      default: return "secondary"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Urgent"
      case "medium": return "Moyen"
      default: return "Normal"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <Flame className="h-3 w-3 text-red-500" />
      case "medium": return <AlertTriangle className="h-3 w-3 text-orange-500" />
      default: return <Shield className="h-3 w-3 text-blue-500" />
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Priorités Urgentes
            </CardTitle>
            <CardDescription className="mt-1">Rapports nécessitant une attention immédiate</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">3 actifs</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {urgentReports.map((report, index) => (
          <div 
            key={report.id} 
            className={`group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50 ${
              report.priority === 'high' ? 'border-red-200/50 bg-red-50/30 dark:border-red-800/30 dark:bg-red-950/10' : ''
            }`}
          >
            {/* Priority Indicator */}
            {report.priority === 'high' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
            )}
            
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                report.priority === 'high' 
                  ? 'bg-red-100 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30' 
                  : 'bg-orange-100 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/30'
              }`}>
                {getSeverityIcon(report.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold truncate">{report.type}</span>
                      <Badge 
                        variant={getPriorityColor(report.priority)} 
                        className="text-xs shrink-0"
                      >
                        {getPriorityLabel(report.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{report.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Impact Level */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Impact:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 w-4 rounded-full ${
                          report.impact === 'high' && level <= 3
                            ? 'bg-red-500'
                            : report.impact === 'medium' && level <= 2
                            ? 'bg-orange-500'
                            : report.impact === 'low' && level === 1
                            ? 'bg-blue-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">1</div>
            <div className="text-xs text-muted-foreground">Critique</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">1</div>
            <div className="text-xs text-muted-foreground">Haute</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">1</div>
            <div className="text-xs text-muted-foreground">Moyenne</div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-2">
          Voir toutes les priorités
        </Button>
      </CardContent>
    </Card>
  )
}
