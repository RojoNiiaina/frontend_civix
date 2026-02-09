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
import NavBar from "./NavBar"

export default function FeedComponent() {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useReports()


  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      

      <div className="container mx-auto px-0 py-0 md:px-4 md:py-4">
        <div className="mx-auto max-w-xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsContent value="all" className="mt-0 space-y-0">
              {reports.filter(report => report.statut === 'approuve').map((report, index) => (
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
