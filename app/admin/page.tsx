import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, CheckCircle2, Clock, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "25,432", change: "+12.5%", icon: Users, trend: "up" },
    { title: "Total Reports", value: "12,584", change: "+8.2%", icon: FileText, trend: "up" },
    { title: "Resolved", value: "8,254", change: "+15.3%", icon: CheckCircle2, trend: "up" },
    { title: "Pending", value: "482", change: "-5.1%", icon: Clock, trend: "down" },
  ]

  const recentReports = [
    {
      id: "RPT-001",
      title: "Pothole on Main Street",
      category: "Infrastructure",
      status: "in-progress",
      priority: "high",
      votes: 24,
    },
    {
      id: "RPT-002",
      title: "Overflowing trash bins",
      category: "Sanitation",
      status: "pending",
      priority: "medium",
      votes: 18,
    },
    {
      id: "RPT-003",
      title: "Broken streetlight",
      category: "Public Safety",
      status: "resolved",
      priority: "high",
      votes: 32,
    },
    {
      id: "RPT-004",
      title: "Illegal dumping",
      category: "Environment",
      status: "pending",
      priority: "high",
      votes: 15,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className={`h-3 w-3 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reports Submitted</span>
                <span className="text-sm font-semibold">12,584</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[78%] bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Community Votes</span>
                <span className="text-sm font-semibold">45,231</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[92%] bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Comments Posted</span>
                <span className="text-sm font-semibold">8,942</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[65%] bg-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolution Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                <span className="text-sm font-semibold">2.4 days</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[45%] bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Resolution Rate</span>
                <span className="text-sm font-semibold">94%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[94%] bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Citizen Satisfaction</span>
                <span className="text-sm font-semibold">4.8 / 5.0</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[96%] bg-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs">{report.id}</TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {report.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.votes}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
