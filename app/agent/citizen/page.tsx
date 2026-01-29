'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Search, Users, Mail, FileText, Loader2 } from 'lucide-react'
import useUsers from '@/hooks/useUser'
import type { User } from '@/lib/utils'


export default function ManageCitizensPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: allUsers = [], isLoading, error } = useUsers()

  // Filter only users with role 'user' (citizens)
  const citizens = Array.isArray(allUsers) ? allUsers.filter((user) => user.role === 'user') : []

  const filteredCitizens = citizens.filter(
    (citizen) =>
      citizen.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCitizens = filteredCitizens.filter((c) => c.statut === 'active' || c.statut === 'actif')
  const inactiveCitizens = filteredCitizens.filter((c) => c.statut === 'inactive' || c.statut === 'inactif')

  const handleAction = (action: string, citizenId: number) => {
    console.log(`[v0] ${action} citizen:`, citizenId)
  }

  const CitizenCard = ({ citizen }: { citizen: User }) => {
    const isActive = citizen.statut === 'active' || citizen.statut === 'actif'
    const initials = citizen.nom
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={citizen.photo || "/placeholder.svg"} alt={citizen.nom} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{citizen.nom}</h3>
                  <Badge variant="outline" className="text-xs">
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{citizen.email}</span>
                  </div>
                  {citizen.telephone && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{citizen.telephone}</span>
                    </div>
                  )}
                  {citizen.cin && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-xs">CIN: {citizen.cin}</span>
                    </div>
                  )}
                </div>
                {citizen.date_inscription && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Joined {new Date(citizen.date_inscription).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button size="sm" variant="outline">
                View Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAction(isActive ? 'deactivate' : 'activate', citizen.id)
                }
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/agent">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Manage Citizens</h1>
            <p className="text-sm text-muted-foreground">View and manage citizen accounts</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading citizens...</span>
          </div>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">Error loading citizens: {error?.message}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && (
          <div>
            {/* Search Bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Citizens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{citizens.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeCitizens.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{inactiveCitizens.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Citizens List with Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Citizens</CardTitle>
                <CardDescription>Manage and monitor all registered citizens</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">
                      All ({filteredCitizens.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active ({activeCitizens.length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                      Inactive ({inactiveCitizens.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6 space-y-4">
                    {filteredCitizens.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-12 text-center">
                        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="font-semibold">No citizens found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search</p>
                      </div>
                    ) : (
                      filteredCitizens.map((citizen) => (
                        <CitizenCard key={citizen.id} citizen={citizen} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="mt-6 space-y-4">
                    {activeCitizens.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-12 text-center">
                        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="font-semibold">No active citizens</h3>
                        <p className="text-sm text-muted-foreground">All citizens are currently inactive</p>
                      </div>
                    ) : (
                      activeCitizens.map((citizen) => (
                        <CitizenCard key={citizen.id} citizen={citizen} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="inactive" className="mt-6 space-y-4">
                    {inactiveCitizens.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-12 text-center">
                        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="font-semibold">No inactive citizens</h3>
                        <p className="text-sm text-muted-foreground">All citizens are currently active</p>
                      </div>
                    ) : (
                      inactiveCitizens.map((citizen) => (
                        <CitizenCard key={citizen.id} citizen={citizen} />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
