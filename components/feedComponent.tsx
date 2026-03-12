"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, MapPin, Search, Settings, Map, Menu, User, LogOut, Plus, Grid, List } from "lucide-react"
import { ReportCard } from "@/components/report-card"
import { CreateReportDialog } from "@/components/create-report-dialog"
import { LogoutDialog } from "@/components/logout-dialog"
import { FeedSidebarLeft } from "@/components/feed-sidebar-left"
import { FeedSidebarRight } from "@/components/feed-sidebar-right"
import useReports from "@/hooks/useReports"
import { useEffect, useState } from "react"
import NavBar from "./NavBar"
import { FloatingCreateButton } from "./floating-create-button"
import { cn } from "@/lib/utils"

export default function FeedComponent() {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useReports()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Floating Action Button - Mobile */}
      <FloatingCreateButton />

      {/* Main Layout Grid */}
      <div className="flex gap-6 px-4 lg:px-6 xl:px-8">
        {/* Left Sidebar - Hidden on mobile */}
        <div className={cn(
          "hidden lg:block transition-all duration-300 shrink-0",
          showLeftSidebar ? "w-72" : "w-0"
        )}>
          <div className="sticky top-20">
            <FeedSidebarLeft />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Actions */}
          <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border/50 mb-6">
            <div className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl sm:text-2xl font-bold">Fil d'actualités</h1>
                  {/* <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div> */}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                  <div className="hidden lg:block">
                    <CreateReportDialog />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Erreur lors du chargement des publications</p>
              </div>
            ) : (
              <div className={cn(
                "space-y-6",
                // viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              )}>
                {reports.filter(report => report.statut === 'approuve').map((report, index) => (
                  <div key={index} className="feed-item-enter">
                    <ReportCard {...report} />
                  </div>
                ))}
              </div>
            )}

            {reports.filter(report => report.statut === 'approuve').length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-muted-foreground text-lg">Aucune publication à afficher</p>
                  <div className="hidden lg:block">
                    <CreateReportDialog />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Hidden on tablet and mobile */}
        <div className={cn(
          "hidden xl:block transition-all duration-300 shrink-0",
          showRightSidebar ? "w-80" : "w-0"
        )}>
          <div className="sticky top-20">
            <FeedSidebarRight />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlays */}
      {showLeftSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        >
          <div 
            className="fixed left-0 top-0 h-full w-72 bg-background z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 pt-20">
              <FeedSidebarLeft />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
