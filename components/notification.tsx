"use client"

import { useState, useEffect } from "react"
import { Bell, X, Heart, MessageCircle, Users, MapPin, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useAuth from "@/hooks/useAuth"
import useNotifications from "@/hooks/useNotifications"
import { Notification } from "@/lib/utils"

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { notifications, loading, markRead, markAllAsRead, deleteNotification } = useNotifications()

  const unreadCount = notifications.filter((n: Notification) => !n.lu).length

  const getNotificationIcon = (notification: Notification) => {
    // Déterminer le type basé sur le message ou d'autres propriétés
    const message = notification.message.toLowerCase()
    if (message.includes('aimé') || message.includes('like')) {
      return <Heart className="h-4 w-4 text-red-500" />
    }
    if (message.includes('commenté') || message.includes('comment')) {
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    }
    if (message.includes('approuvé') || message.includes('approuve')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (message.includes('près') || message.includes('proximité')) {
      return <MapPin className="h-4 w-4 text-orange-500" />
    }
    if (message.includes('tendance') || message.includes('populaire')) {
      return <TrendingUp className="h-4 w-4 text-indigo-500" />
    }
    return <Bell className="h-4 w-4 text-gray-500" />
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours} h`
    if (diffDays < 7) return `Il y a ${diffDays} j`
    return date.toLocaleDateString('fr-FR')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.lu) {
      markRead(notification.id)
    }
    // Navigation vers le rapport si disponible
    if (notification.report) {
      window.location.href = `/feed#report-${notification.report}`
    }
    setIsOpen(false)
  }

  const handleDismiss = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    deleteNotification(id)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <Card 
            className="absolute right-0 top-14 z-50 w-96 max-h-[80vh] shadow-lg"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur le panel
          >
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Aucune notification</p>
                    <p className="text-sm text-muted-foreground">
                      Vous serez notifié des nouvelles activités ici
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification: Notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.lu ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className="shrink-0 mt-1">
                            {notification.user ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage 
                                  src={notification.user.photo} 
                                  alt={notification.user.nom} 
                                />
                                <AvatarFallback className="text-xs">
                                  {notification.user.nom.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                {getNotificationIcon(notification)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {notification.user ? notification.user.nom : 'Système'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                {notification.report && (
                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                    📍 Rapport #{notification.report}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {!notification.lu && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDismiss(e, notification.id)}
                                  className="h-6 w-6 shrink-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimestamp(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      window.location.href = "/notifications"
                      setIsOpen(false)
                    }}
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}