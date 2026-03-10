"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, Settings, BarChart3, Shield, MapPin, Tag } from "lucide-react"
import Image from "next/image"
import { LogoutDialog } from "@/components/logout-dialog"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Citoyens" },
    { href: "/admin/agents", icon: Shield, label: "Agents" },
    { href: "/admin/reports", icon: FileText, label: "Signalements" },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/admin/settings", icon: Settings, label: "Paramètre" },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
            <Image src="/logo/logo_un.png" alt="logo" className="" width={20} height={20}/>
          </div>
          <div>
            <span className="text-lg font-bold">CIVIX</span>
            <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">Admin</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3 cursor-pointer", isActive && "bg-primary/10 text-primary")}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-4">
        <LogoutDialog />
      </div>
    </div>
  )
}
