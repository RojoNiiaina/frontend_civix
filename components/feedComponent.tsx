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
import { Bell, MapPin, Search, Settings, Map, Menu, User, LogOut } from "lucide-react"
import { ReportCard } from "@/components/report-card"
import { CreateReportDialog } from "@/components/create-report-dialog"
import { LogoutDialog } from "@/components/logout-dialog"
import useReports from "@/hooks/useReports"
import { useEffect, useState } from "react"

export default function FeedComponent() {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useReports()


  const okey = () => {
    alert(localStorage.getItem("token"))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CIVIX</span>
          </Link>

        

          <div className="flex items-center gap-2">
            <Button  variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex w-full cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/map" className="flex w-full cursor-pointer items-center">
                    <Map className="mr-2 h-4 w-4" />
                    <span>Map View</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="relative">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutDialog/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      

      <div className="container mx-auto px-0 py-0 md:px-4 md:py-4">
        <div className="mx-auto max-w-xl">
          <Tabs defaultValue="all" className="w-full">
            <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b border-border/40">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="en_attente"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Resolved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0 space-y-0">
              {reports.map((report, index) => (
                <div key={index} className="mb-4">
                  <ReportCard {...report} />
                </div>
              ))}
            </TabsContent>
            
            
            
          </Tabs>
        </div>
      </div>

      <CreateReportDialog />
    </div>
  )
}
