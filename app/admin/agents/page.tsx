"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus, MoreHorizontal, Users, UserCheck, Shield, Filter, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { useState } from "react"
import { AddAgentDialog } from "@/components/add-agent-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AgentsPage() {
  const { users, loading, error, refetch, handleStatusToggle, handleDeleteUser, handlePromoteToAdmin } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleAgentAdded = () => {
    refetch()
  }

  const handleStatusToggleWithConfirm = async (userId: number, currentStatus: string) => {
    await handleStatusToggle(userId, currentStatus)
  }

  const handleDeleteUserWithConfirm = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      await handleDeleteUser(userId)
    }
  }

  const handlePromoteToAdminWithConfirm = async (userId: number, userName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir nommer ${userName} en tant qu'administrateur ?`)) {
      await handlePromoteToAdmin(userId)
    }
  }

  // Filtrer les utilisateurs localement - n'afficher que les agents
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const isAgent = user.role === 'agent'
    const matchesStatus = statusFilter === 'all' || user.statut === statusFilter
    
    return isAgent && matchesSearch && matchesStatus
  })

  // Statistiques - uniquement pour les agents
  const agentUsers = users.filter(u => u.role === 'agent')
  const stats = {
    totalAgents: agentUsers.length,
    activeAgents: agentUsers.filter(u => u.statut === 'active').length,
    inactiveAgents: agentUsers.filter(u => u.statut === 'inactive').length,
    suspendedAgents: agentUsers.filter(u => u.statut === 'suspendu').length
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "agent":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "user":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      case "suspendu":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Utilisateurs</h2>
            <p className="text-muted-foreground">Chargement des utilisateurs...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Utilisateurs</h2>
            <p className="text-red-500">Erreur: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Agents</h2>
          <p className="text-muted-foreground">Gérer les agents et permissions de la plateforme</p>
        </div>
        <AddAgentDialog onAgentAdded={handleAgentAdded} />
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Agents</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.totalAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Agents Actifs</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.activeAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Agents Inactifs</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.inactiveAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Agents Suspendus</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.suspendedAgents}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agents ({filteredUsers.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Rechercher des agents..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Aucun agent trouvé pour les filtres appliqués' 
                      : 'Aucun agent disponible'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photo } alt={user.nom} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                        {user.role === "user"? "citoyen" : user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.telephone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(user.statut)}`}>
                        {user.statut}
                      </Badge> 
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePromoteToAdminWithConfirm(user.id, user.nom)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Nommer en tant qu'Admin
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleStatusToggleWithConfirm(user.id, user.statut)}
                          >
                            {user.statut === 'active' ? (
                              <>
                                <ToggleLeft className="h-4 w-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUserWithConfirm(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
