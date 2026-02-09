import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, MessageCircle, Users } from "lucide-react"
import { useUsers } from "@/hooks/useChat"
import { Conversation, User } from "@/lib/utils"

interface NewConversationDialogProps {
  onSelectConversation: (conversation: Conversation) => void
}

export function NewConversationDialog({ onSelectConversation }: NewConversationDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { users, loading, error } = useUsers()

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectUser = (user: User) => {
    const conversation: Conversation = {
      id: user.id,
      user: user,
      lastMessage: undefined,
      unreadCount: 0,
      isOnline: false,
    }
    
    onSelectConversation(conversation)
    setOpen(false)
    setSearchTerm("")
  }

  const handleSelectGroupChat = () => {
    const groupConversation: Conversation = {
      id: 0, // ID spécial pour le groupe
      user: {
        id: 0,
        nom: "Groupe Civix",
        email: "group@civix.com",
        role: "agent",
        statut: "actif",
        photo: undefined,
      },
      lastMessage: undefined,
      unreadCount: 0,
      isOnline: true, // Le groupe est toujours "en ligne"
    }
    
    onSelectConversation(groupConversation)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Group chat option */}
          <div
            onClick={handleSelectGroupChat}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-2 border-primary/20 bg-primary/5"
          >
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Groupe Civix</p>
              <p className="text-sm text-muted-foreground truncate">Discussion de groupe publique</p>
            </div>
            
            <Badge variant="default" className="text-xs">
              Groupe
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                Erreur: {error}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.photo ? 
                          (user.photo.startsWith('http') ? user.photo : `http://localhost:8000${user.photo}`) 
                          : `http://localhost:8000/media/users/photos/${user.id}.png`} 
                        alt={user.nom} 
                      />
                      <AvatarFallback>{user.nom.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.nom}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
