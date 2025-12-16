"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  ArrowLeft,
  Search,
  Filter,
  Layers,
  Navigation,
  ZoomIn,
  ZoomOut,
  Heart,
  MessageCircle,
} from "lucide-react"

export default function MapPage() {
  const [selectedReport, setSelectedReport] = useState<number | null>(null)

  const reports = [
    {
      id: 1,
      title: "Pothole on Main Street",
      location: "Main St & 5th Ave",
      category: "Infrastructure",
      status: "in-progress" as const,
      votes: 24,
      comments: 8,
      lat: 40.7128,
      lng: -74.006,
    },
    {
      id: 2,
      title: "Overflowing trash bins",
      location: "Central Park, Zone B",
      category: "Sanitation",
      status: "pending" as const,
      votes: 18,
      comments: 5,
      lat: 40.7829,
      lng: -73.9654,
    },
    {
      id: 3,
      title: "Broken streetlight",
      location: "Oak Avenue",
      category: "Public Safety",
      status: "resolved" as const,
      votes: 32,
      comments: 12,
      lat: 40.7489,
      lng: -73.9692,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/feed">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">CIVIX</span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search location..." className="w-full pl-9 bg-secondary/50" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">JD</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-96 overflow-y-auto border-r border-border bg-card p-4">
          <div className="mb-4 space-y-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="safety">Public Safety</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReport === report.id ? "border-primary ring-1 ring-primary" : ""
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold leading-snug">{report.title}</CardTitle>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status === "in-progress" ? "In Progress" : report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{report.location}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {report.category}
                  </Badge>
                  <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{report.votes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{report.comments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="relative flex-1 bg-muted">
          {/* Map Placeholder */}
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Interactive Map View</h3>
              <p className="text-sm text-muted-foreground">
                Reports are displayed as markers on the map
                <br />
                Click on markers to view report details
              </p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="h-10 w-10 shadow-md">
              <Layers className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-10 w-10 shadow-md">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="h-10 w-10 shadow-md">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-10 w-10 shadow-md">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Legend */}
          <Card className="absolute bottom-4 left-4 w-64 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-xs">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-xs">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs">Resolved</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
