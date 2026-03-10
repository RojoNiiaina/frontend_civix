"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import useReports from "@/hooks/useReports"
import { REPORT_STATUSES, PRIORITY_LEVELS } from "@/lib/constant"

export default function ReportsPage() {
  const {
    data: reports,
    isLoading,
    error,
    deleteReport,
    approuveReport
  } = useReports()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "en_cours":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "resolu":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "rejete":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Clock className="h-4 w-4" />
      case "en_cours":
        return <AlertTriangle className="h-4 w-4" />
      case "resolu":
        return <CheckCircle className="h-4 w-4" />
      case "rejete":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = async (reportId: number, action: 'resolve' | 'reject') => {
    try {
      if (action === 'resolve') {
        // Utiliser approuveReport pour résoudre
        approuveReport({ id: reportId })
      } else {
        // Pour rejeter, on pourrait utiliser deleteReport ou une autre action
        console.log('Reject functionality not implemented in current hook')
      }
    } catch (error) {
      console.error(`Failed to ${action} report:`, error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Signalements</h2>
          <p className="text-muted-foreground">Gérer et examiner les signalements citoyens</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les Signalements</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-red-600">
              Erreur: {error?.message || 'Une erreur est survenue'}
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">Chargement des signalements...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Signaleur</TableHead>
                  <TableHead>Statut</TableHead>
                  {/* <TableHead>Priorité</TableHead> */}
                  <TableHead>Créé le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!reports || reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun signalement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-xs">#{report.id}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {report.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          Non Catégorisé
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {report.user?.nom || "Inconnu"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs gap-1 ${getStatusColor(report.statut)}`}>
                          {getStatusIcon(report.statut)}
                          {report.statut.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(report.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.statut === 'en_attente' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleStatusUpdate(report.id, 'resolve')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteReport(report.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
