import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MapPin, Search, Settings, Map } from "lucide-react"
import { ReportCard } from "@/components/report-card"
import { CreateReportDialog } from "@/components/create-report-dialog"

export default function FeedPage() {
  const mockReports = [
    {
      author: { name: "Sarah Johnson", avatar: "/professional-woman.png" },
      category: "Infrastructure",
      title: "Pothole on Main Street causing traffic issues",
      description: "Large pothole near the intersection of Main St and 5th Ave. Multiple vehicles have been damaged.",
      image: "/pothole-road.jpg",
      location: "Main St & 5th Ave",
      status: "in-progress" as const,
      votes: 24,
      comments: 8,
      timeAgo: "2 hours ago",
    },
    {
      author: { name: "Michael Chen", avatar: "/professional-man.png" },
      category: "Sanitation",
      title: "Overflowing trash bins in Central Park",
      description: "The trash bins near the playground are overflowing. Needs immediate attention.",
      image: "/trash-bins-park.jpg",
      location: "Central Park, Zone B",
      status: "pending" as const,
      votes: 18,
      comments: 5,
      timeAgo: "4 hours ago",
    },
    {
      author: { name: "Emily Rodriguez", avatar: "/professional-woman.png" },
      category: "Public Safety",
      title: "Broken streetlight creating safety hazard",
      description: "Streetlight has been out for a week, making the area very dark at night.",
      location: "Oak Avenue",
      status: "resolved" as const,
      votes: 32,
      comments: 12,
      timeAgo: "1 day ago",
    },
    {
      author: { name: "David Park", avatar: "/professional-man.png" },
      category: "Environment",
      title: "Illegal dumping near residential area",
      description: "Construction waste has been dumped near the residential zone. Environmental concern.",
      image: "/illegal-dumping.jpg",
      location: "Elm Street",
      status: "pending" as const,
      votes: 15,
      comments: 6,
      timeAgo: "5 hours ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
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
              <Input type="search" placeholder="Search reports..." className="w-full pl-9 bg-secondary/50" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/map">
              <Button variant="ghost" size="icon">
                <Map className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">JD</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6 space-y-4">
              {mockReports.map((report, index) => (
                <ReportCard key={index} {...report} />
              ))}
            </TabsContent>
            <TabsContent value="pending" className="mt-6 space-y-4">
              {mockReports
                .filter((r) => r.status === "pending")
                .map((report, index) => (
                  <ReportCard key={index} {...report} />
                ))}
            </TabsContent>
            <TabsContent value="in-progress" className="mt-6 space-y-4">
              {mockReports
                .filter((r) => r.status === "in-progress")
                .map((report, index) => (
                  <ReportCard key={index} {...report} />
                ))}
            </TabsContent>
            <TabsContent value="resolved" className="mt-6 space-y-4">
              {mockReports
                .filter((r) => r.status === "resolved")
                .map((report, index) => (
                  <ReportCard key={index} {...report} />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Floating Action Button */}
      <CreateReportDialog />
    </div>
  )
}
