"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import NavBar from "@/components/NavBar"
import { useConversations } from "@/hooks/useChat"
import useMessages from "@/hooks/useMessages"
import useAuth from "@/hooks/useAuth"
import { Message, Conversation } from "@/lib/utils"
import { NewConversationDialog } from "@/components/new-conversation-dialog"
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Smile,
  Mic,
  Loader2,
  Users,
  Image,
  AlertCircle,
} from "lucide-react"

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messagesHook = useMessages()
  const allMessages = messagesHook.messages || []
  const messagesLoading = messagesHook.isLoading
  const messagesError = messagesHook.error

  useEffect(() => {
    allMessages
  })


  console.log('ChatPage - selectedConversation:', selectedConversation)

  const { conversations, loading: conversationsLoading, error: conversationsError } = useConversations()
  const { user } = useAuth()

  const filteredConversations = conversations.filter(conv =>
    conv.user.nom.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((conv, index, self) => 
    // Déduplication par ID pour éviter les conversations en double
    self.findIndex(c => c.id === conv.id) === index
  )

  const filteredMessages = selectedConversation?.id === 0 
    ? allMessages.filter(msg => msg.recipient === null)
    : selectedConversation 
      ? allMessages.filter(msg => 
          msg.recipient !== null && (
            msg.recipient?.id === selectedConversation.id || msg.sender?.id === selectedConversation.id
          )
        )
      : []

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedConversation && !isSending && !messagesHook.isSending) {
      setIsSending(true)
      try {
        // Si c'est le groupe (id: 0), envoyer sans recipient
        const recipientId = selectedConversation.id === 0 ? null : selectedConversation.id
        const success = await messagesHook.sendMessage({ content: messageInput, recipient: recipientId })
        if (success) {
          setMessageInput("")
          scrollToBottom()
          // Rafraîchir les messages après envoi
          messagesHook.refetchMessages()
        }
      } finally {
        setIsSending(false)
      }
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedConversation && !isSending && !messagesHook.isSending) {
      setIsSending(true)
      try {
        // Si l'utilisateur a tapé du texte, on n'envoie pas l'image
        if (messageInput.trim()) {
          alert('Veuillez envoyer le texte séparément de l\'image.')
          return
        }
        
        // Envoyer seulement l'image avec un contenu par défaut
        const messageText = '📷'
        const recipientId = selectedConversation.id === 0 ? null : selectedConversation.id
        const success = await messagesHook.sendMessageWithImage({ content: messageText, recipient: recipientId, image: file })
        if (success) {
          setMessageInput("")
          scrollToBottom()
          // Rafraîchir les messages après envoi d'image
          messagesHook.refetchMessages()
        }
      } catch (error) {
        console.error('Error sending image:', error)
        alert('Impossible d\'envoyer l\'image. Veuillez réessayer.')
      } finally {
        setIsSending(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [filteredMessages])

  const formatTime = (dateString: string) => {
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

  const isMessageFromMe = (message: Message) => {
    const currentUserId = user?.id || 0
    // Vérification de sécurité pour éviter les erreurs si sender est undefined
    return message.sender?.id === currentUserId
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Liste des conversations */}
        <div className="w-full md:w-1/3 border-r border-border bg-muted/30">
          {/* Header de la liste */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : conversationsError ? (
              <div className="p-4 text-center text-red-500">
                Erreur: {conversationsError}
              </div>
            ) : (
              <>
                {filteredConversations.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune conversation trouvée
                  </div>
                )}
                
                {filteredConversations.map((conversation) => (
                  <div
                    key={`conversation-${conversation.id}-${conversation.id === 0 ? 'group' : 'private'}`}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`flex cursor-pointer items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="relative">
                      {conversation.id === 0 ? (
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-foreground" />
                        </div>
                      ) : (
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={conversation.user.photo ? 
                              (conversation.user.photo.startsWith('http') ? conversation.user.photo : `http://localhost:8000${conversation.user.photo}`) 
                              : undefined} 
                            alt={conversation.user.nom} 
                          />
                          <AvatarFallback>{conversation.user.nom.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                      )}
                      {conversation.isOnline && conversation.id !== 0 && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.user.nom}</p>
                        <span className="text-xs text-muted-foreground">
                          {conversation.lastMessage ? formatTime(conversation.lastMessage.created_at) : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.content || "Aucun message"}
                        </p>
                        <div className="flex items-center gap-1">
                          {conversation.id === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Groupe
                            </Badge>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
            
          {/* Bouton nouvelle conversation */}
          <div className="p-4 border-t border-border">
            <NewConversationDialog onSelectConversation={setSelectedConversation} />
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de la conversation */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-background">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {selectedConversation.id === 0 ? (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-foreground" />
                      </div>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={selectedConversation.user.photo ? 
                            (selectedConversation.user.photo.startsWith('http') ? selectedConversation.user.photo : `http://localhost:8000${selectedConversation.user.photo}`) 
                            : undefined} 
                          alt={selectedConversation.user.nom} 
                        />
                        <AvatarFallback>{selectedConversation.user.nom.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                    )}
                    {selectedConversation.isOnline && selectedConversation.id !== 0 && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedConversation.user.nom}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.id === 0 
                        ? "Discussion de groupe publique" 
                        : selectedConversation.isOnline ? "En ligne" : "Hors ligne"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedConversation.id === 0 ? (
                    <Badge variant="secondary" className="text-xs">
                      Groupe
                    </Badge>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                { filteredMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-muted-foreground">Aucun message dans cette conversation</p>
                      <p className="text-sm text-muted-foreground mt-1">Soyez le premier à commencer la conversation !</p>
                    </div>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div key={message.id} className={`flex ${isMessageFromMe(message) ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md ${isMessageFromMe(message) ? "order-2" : "order-1"}`}>
                        {/* Afficher le nom de l'expéditeur pour les messages de groupe */}
                        {selectedConversation?.id === 0 && !isMessageFromMe(message) && message.sender && (
                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                            {message.sender.nom}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isMessageFromMe(message)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          
                          {/* Affichage de l'image si elle existe */}
                          {message.image && (
                            <img 
                              src={message.image.startsWith('http') ? message.image : `http://localhost:8000${message.image}`}
                              alt="Image partagée"
                              className="mt-2 rounded-lg max-w-xs h-auto"
                              style={{ maxHeight: '200px' }}
                            />
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMessageFromMe(message) ? "justify-end" : "justify-start"}`}>
                          <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                          {isMessageFromMe(message) && (
                            <span className="text-xs text-muted-foreground">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSending || messagesHook.isSending}
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Écrire un message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      className="pr-10"
                      disabled={isSending || messagesHook.isSending}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" disabled={isSending || messagesHook.isSending}>
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon" 
                    disabled={!messageInput.trim() || isSending || messagesHook.isSending}
                  >
                    {(isSending || messagesHook.isSending) ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}