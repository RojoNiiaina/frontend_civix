"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle, 
  Send, 
  Search, 
  MoreVertical,
  Circle,
  Users,
  Hash,
  Bell,
  Pin,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useConversations } from "@/hooks/useChat"
import { Conversation } from "@/lib/utils"

export function FeedSidebarRight() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  const { conversations, loading, error } = useConversations()
  
  const filteredConversations = conversations.filter(conv =>
    conv.user.nom.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((conv, index, self) => 
    // Déduplication par ID pour éviter les conversations en double
    self.findIndex(c => c.id === conv.id) === index
  )
  
  const handleDiscussionClick = (conversation: Conversation) => {
    // Rediriger vers la page de chat avec l'ID de la conversation
    router.push(`/chat?userId=${conversation.id}`)
  }
  
  const formatTime = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR", { weekday: "short" })
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <Card className="bg-card border border-border/50 shadow-lg">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Active Discussions */}
      <Card className="bg-card border border-border/50 shadow-lg">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              <MessageCircle className="h-4 w-4" />
              Discussions
            </h3>
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
            </Badge>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-2 text-center text-red-500 text-xs">
                Erreur: {error}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground text-xs">
                Aucune discussion trouvée
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <Button
                  key={`conversation-${conversation.id}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDiscussionClick(conversation)}
                  className="w-full justify-start h-auto p-2 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative shrink-0">
                      {conversation.id === 0 ? (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : (
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={conversation.user.photo ? 
                              (conversation.user.photo.startsWith('http') ? conversation.user.photo : `http://localhost:8000${conversation.user.photo}`) 
                              : undefined} 
                          />
                          <AvatarFallback>{conversation.user.nom.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      {conversation.isOnline && conversation.id !== 0 && (
                        <Circle className="absolute bottom-0 right-0 h-2.5 w-2.5 fill-green-500 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate flex items-center gap-1">
                          {conversation.user.nom}
                          {conversation.user.role === "agent" && (
                            <Badge variant="secondary" className="text-xs h-4 px-1">
                              Agent
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {formatTime(conversation.lastMessage?.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[140px]">
                          {conversation.lastMessage?.content || "Aucun message"}
                        </p>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {conversation.id === 0 && (
                            <Badge variant="secondary" className="text-xs h-4 px-1">
                              Groupe
                            </Badge>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge className="h-4 w-4 p-0 text-xs bg-primary shrink-0">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
