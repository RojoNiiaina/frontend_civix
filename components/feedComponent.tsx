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
import { Bell, MapPin, Search, Settings, Map, Menu, User, LogOut, Plus, Grid, List, MessageCircle } from "lucide-react"
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
import { User as Users} from "@/lib/utils"

export default function FeedComponent() {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useReports()

  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)



  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Floating Action Button - Mobile */}
      <FloatingCreateButton />

      {/* Main Layout */}
      <div className="relative min-h-screen">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-20 right-4 z-40 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="bg-background shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="bg-background shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        <div className=" flex gap-4 lg:gap-6 px-4 lg:px-6 xl:px-8">
          {/* Left Sidebar */}
          <div className={cn(
            "fixed lg:sticky lg:top-14 transition-all duration-300 z-30 h-full bg-background lg:bg-transparent border-r lg:border-r-0",
            showLeftSidebar ? "left-0 w-72" : "-left-80 w-72",
            "lg:w-72 xl:w-80 lg:self-start"
          )}>
            <div className="h-screen lg:h-auto lg:block overflow-y-auto p-4 lg:py-4">
              <div className="lg:hidden flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filtres</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLeftSidebar(false)}
                >
                  ×
                </Button>
              </div>
              <FeedSidebarLeft />
            </div>
          </div>

          {/* Overlay for mobile */}
          {showLeftSidebar && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-20"
              onClick={() => setShowLeftSidebar(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="sticky top-14 z-10 bg-white backdrop-blur border-b border-border/50">
              <div className="py-2 mb-2">
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg lg:text-xl font-bold">Fil d'actualités</h1>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Desktop Create Button */}
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
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Erreur lors du chargement des publications</p>
                </div>
              ) : (
                <div className="space-y-6 ">
                  {reports.filter(report => report.statut === 'approuve').map((report, index) => (
                    <div key={index} className="feed-item-enter">
                      <ReportCard {...report} />
                    </div>
                  ))}
                </div>
              )}

              {reports.filter(report => report.statut === 'approuve').length === 0 && !isLoading && (
                <div className="text-center py-20">
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

          {/* Right Sidebar */}
          <div className={cn(
            "fixed lg:sticky lg:top-14 transition-all duration-300 z-30 h-full bg-background lg:bg-transparent border-l lg:border-l-0",
            showRightSidebar ? "right-0 w-80" : "-right-96 w-80",
            "lg:w-80 xl:w-96 lg:self-start"
          )}>
            <div className="h-screen lg:h-auto overflow-y-auto p-4 lg:py-4">
              <div className="lg:hidden flex justify-between items-center mb-4">
                <h3 className="font-semibold">Discussions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRightSidebar(false)}
                >
                  ×
                </Button>
              </div>
              <FeedSidebarRight />
            </div>
          </div>

          {/* Overlay for mobile right sidebar */}
          {showRightSidebar && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-20"
              onClick={() => setShowRightSidebar(false)}
            />
          )}
        </div>
      </div>

    </div>
  )
}
