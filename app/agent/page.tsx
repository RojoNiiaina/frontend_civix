import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  TrendingUp,
  Users,
  LogOut,
  MapIcon,
} from "lucide-react"

export default function AgentDashboard() {
  const stats = {
    newReports: 12,
    inProgress: 8,
    resolvedToday: 15,
    avgResponseTime: "2.4 hrs",
  }

  const priorityReports = [
    {
      id: "RPT-001",
      title: "Pothole on Main Street causing traffic issues",
      category: "Infrastructure",
      location: "Main St & 5th Ave",
      priority: "high",
      votes: 24,
      timeAgo: "2 hours ago",
      reporter: "Sarah Johnson",
    },
    {
      id: "RPT-002",
      title: "Overflowing trash bins in Central Park",
      category: "Sanitation",
      location: "Central Park, Zone B",
      priority: "medium",
      votes: 18,
      timeAgo: "4 hours ago",
      reporter: "Michael Chen",
    },
    {
      id: "RPT-003",
      title: "Illegal dumping near residential area",
      category: "Environment",
      location: "Elm Street",
      priority: "high",
      votes: 15,
      timeAgo: "5 hours ago",
      reporter: "David Park",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold">CIVIX</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Agent
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/agent/map">
              <Button variant="ghost" size="icon">
                <MapIcon className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/agent-avatar.png" alt="Agent" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">AG</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newReports}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active investigations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">15% faster this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reports Queue</CardTitle>
                    <CardDescription>Manage and respond to citizen reports</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="search" placeholder="Search reports..." className="pl-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="new">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                    <TabsTrigger value="all">All Reports</TabsTrigger>
                  </TabsList>
                  <TabsContent value="new" className="space-y-4">
                    {priorityReports.map((report) => (
                      <Card key={report.id} className="transition-shadow hover:shadow-md">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {report.id}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${getPriorityColor(report.priority)}`}>
                                  {report.priority} priority
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {report.category}
                                </Badge>
                              </div>
                              <h3 className="font-semibold leading-snug">{report.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{report.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{report.votes} votes</span>
                                </div>
                                <span>{report.timeAgo}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Reported by {report.reporter}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm">Assign to Me</Button>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="assigned" className="py-6">
                    <div className="rounded-lg border border-dashed border-border p-12 text-center">
                      <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold">No assigned reports</h3>
                      <p className="text-sm text-muted-foreground">
                        Assign reports to yourself to start working on them
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="all" className="space-y-4">
                    {priorityReports.map((report) => (
                      <Card key={report.id} className="transition-shadow hover:shadow-md">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {report.id}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {report.category}
                                </Badge>
                              </div>
                              <h3 className="font-semibold leading-snug">{report.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{report.location}</span>
                                </div>
                                <span>{report.timeAgo}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Report Resolved</p>
                    <p className="text-xs text-muted-foreground">Streetlight issue on Oak Ave</p>
                    <p className="text-xs text-muted-foreground">5 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Status Updated</p>
                    <p className="text-xs text-muted-foreground">Pothole repair in progress</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">New High Priority</p>
                    <p className="text-xs text-muted-foreground">Illegal dumping reported</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Community Support</p>
                    <p className="text-xs text-muted-foreground">24 votes on trash bin issue</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
