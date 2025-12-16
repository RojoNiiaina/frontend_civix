"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, CheckCircle2, MessageCircle, Heart, AlertCircle } from "lucide-react"

export function NotificationBell() {
  const [unreadCount] = useState(3)

  const notifications = [
    {
      id: 1,
      type: "comment",
      title: "New comment on your report",
      message: "Sarah Johnson commented on 'Pothole on Main Street'",
      time: "5 mins ago",
      unread: true,
    },
    {
      id: 2,
      type: "status",
      title: "Status updated",
      message: "Your report 'Broken streetlight' has been resolved",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "vote",
      title: "Community support",
      message: "Your report received 10 new votes",
      time: "2 hours ago",
      unread: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle className="h-4 w-4" />
      case "status":
        return <CheckCircle2 className="h-4 w-4" />
      case "vote":
        return <Heart className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                Mark all read
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-3 rounded-lg p-3 transition-colors hover:bg-accent ${
                  notification.unread ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-snug">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {notification.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
