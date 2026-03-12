"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Activity } from "lucide-react"

export function HeatmapCard() {
  const hotspots = [
    { zone: "Centre-ville", reports: 12, trend: "up", change: "+25%" },
    { zone: "Parc Central", reports: 8, trend: "down", change: "-10%" },
    { zone: "Zone Industrielle", reports: 6, trend: "up", change: "+15%" },
    { zone: "Résidentiel Nord", reports: 4, trend: "stable", change: "0%" }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-red-500" />
      case "down": return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />
      default: return <Activity className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-red-600 bg-red-50 dark:bg-red-950/20"
      case "down": return "text-green-600 bg-green-50 dark:bg-green-950/20"
      default: return "text-muted-foreground bg-muted/30"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Zones à surveiller
        </CardTitle>
        <CardDescription>Concentration des rapports par secteur</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {hotspots.map((zone, index) => (
            <div key={zone.zone} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{zone.zone}</span>
                  <Badge variant="outline" className="text-xs">
                    {zone.reports} rapports
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(zone.trend)}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(zone.trend)}`}>
                    {zone.change} cette semaine
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Zone critique (&gt;10 rapports)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Zone à surveiller (5-10 rapports)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Zone stable (&lt;5 rapports)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
