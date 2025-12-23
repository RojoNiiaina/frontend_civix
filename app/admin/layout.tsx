import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import AuthGuard from "@/components/auth/AuthGuard"
import AdminGuard from "@/components/auth/AdminGuard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminGuard>
        <div className="flex h-screen bg-background">
          <AdminSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
              <div>
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your civic platform</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/admin-avatar.png" alt="Admin" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">AD</AvatarFallback>
                </Avatar>
              </div>
            </header>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </AdminGuard>
    </AuthGuard>
  )
}
