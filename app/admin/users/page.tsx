import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, MoreHorizontal } from "lucide-react"

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "citizen",
      reports: 12,
      reputation: 342,
      joinedDate: "Feb 2024",
      status: "active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@example.com",
      role: "citizen",
      reports: 8,
      reputation: 218,
      joinedDate: "Jan 2024",
      status: "active",
    },
    {
      id: 3,
      name: "Agent Smith",
      email: "agent.smith@city.gov",
      role: "agent",
      reports: 156,
      reputation: 1842,
      joinedDate: "Dec 2023",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      role: "citizen",
      reports: 15,
      reputation: 428,
      joinedDate: "Mar 2024",
      status: "active",
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "agent":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "citizen":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage platform users and permissions</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search users..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/user-${user.id}.png`} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.reports}</TableCell>
                  <TableCell>{user.reputation}</TableCell>
                  <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
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
