

import { Bell, MapPin, Menu, Search, User, Settings, MessageCircle } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { LogoutDialog } from "./logout-dialog"
import useAuth from "@/hooks/useAuth"
import { NotificationDropdown } from "./notification"

export default function NavBar() {
    const { user } = useAuth()
    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo/logo_un.png" className="h-8 w-8" alt="" />
                    
                    <span className="text-xl font-bold">CIVIX</span>
                </Link>

            
                <div className="flex items-center gap-2">
                    <NotificationDropdown />

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
                                    <span>Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            {
                                user?.role !== "agent" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/chat" className="flex w-full cursor-pointer items-center">
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            <span>Messages</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            }
                            
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="flex w-full cursor-pointer items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Paramètres</span>
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
    )
}
