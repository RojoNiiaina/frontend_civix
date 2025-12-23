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

export default function FeedPage() {
  const mockReports = [
    {
      author: { name: "Sarah Johnson", avatar: "/professional-woman.png" },
      category: "Infrastructure",
      title: "Pothole on Main Street causing traffic issues",
      description: "Large pothole near the intersection of Main St and 5th Ave. Multiple vehicles have been damaged.",
      image: "https://i.pinimg.com/736x/d5/18/91/d518910660980f3b6115102f9a7ecdbb.jpg",
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
      image: "https://i.pinimg.com/736x/d5/18/91/d518910660980f3b6115102f9a7ecdbb.jpg",
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
      image: "https://i.pinimg.com/736x/d5/18/91/d518910660980f3b6115102f9a7ecdbb.jpg",
      location: "Elm Street",
      status: "pending" as const,
      votes: 15,
      comments: 6,
      timeAgo: "5 hours ago",
    },
  ]

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
                  value="pending"
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
              {mockReports.map((report, index) => (
                <div key={index} className="mb-4">
                  <ReportCard {...report} />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="pending" className="mt-0 space-y-0">
              {mockReports
                .filter((r) => r.status === "pending")
                .map((report, index) => (
                  <div key={index} className="mb-4">
                    <ReportCard {...report} />
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="in-progress" className="mt-0 space-y-0">
              {mockReports
                .filter((r) => r.status === "in-progress")
                .map((report, index) => (
                  <div key={index} className="mb-4">
                    <ReportCard {...report} />
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="resolved" className="mt-0 space-y-0">
              {mockReports
                .filter((r) => r.status === "resolved")
                .map((report, index) => (
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
