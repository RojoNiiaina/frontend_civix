'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertCircle,
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Search,
  Trash2,
  User,
  Plus,
} from 'lucide-react'
import useUsers from '@/hooks/useUser'
import { AddAgentDialog } from '@/components/add-agent-dialog'

export default function ManageAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false)
  const { data: users = [], isLoading, error, deleteUser } = useUsers()

  // Filter only agents
  const agents = Array.isArray(users) ? users.filter((user) => user.role === 'agent') : []
  const filteredAgents = agents.filter((agent) =>
    agent.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteAgent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      deleteUser(id)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/agent">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Manage Agents</h1>
              <p className="text-sm text-muted-foreground">
                Manage and oversee municipal agents ({filteredAgents.length})
              </p>
            </div>
          </div>
          <AddAgentDialog />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
            <h1>Nombre des agents: {users?.filter((user) => user.role === 'agent').length}</h1>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-semibold text-destructive">Error loading agents</p>
                <p className="text-sm text-destructive/80">
                  {error instanceof Error ? error.message : 'Failed to fetch agents from server'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-24 pt-6" />
              </Card>
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <User className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="mb-2 text-lg font-semibold">No agents found</p>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Start by adding your first agent'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsAddAgentOpen(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First Agent
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={agent.photo || "/placeholder.svg"} alt={agent.nom} />
                        <AvatarFallback className="bg-primary/10 text-lg font-bold">
                          {agent.nom
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{agent.nom}</h3>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {agent.email}
                        </p>
                        {agent.telephone && (
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {agent.telephone}
                          </p>
                        )}
                        {agent.cin && (
                          <p className="text-xs text-muted-foreground">
                            CIN: {agent.cin}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="w-fit">
                        {agent.statut || 'Active'}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
