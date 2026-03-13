import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageSquare, 
  Users, 
  Ban, 
  Volume2, 
  VolumeX,
  Pin,
  Trash2,
  MoreHorizontal
} from 'lucide-react'

interface ChatMessage {
  id: string
  author: string
  content: string
  timestamp: Date
  isAgent?: boolean
  isModerated?: boolean
  isPinned?: boolean
}

interface ChatViewer {
  id: string
  name: string
  isMuted?: boolean
  isBanned?: boolean
}

interface LiveChatProps {
  messages: ChatMessage[]
  viewers: ChatViewer[]
  onSendMessage: (message: string) => void
  onModerateMessage: (messageId: string) => void
  onPinMessage: (messageId: string) => void
  onDeleteMessage: (messageId: string) => void
  onMuteViewer: (viewerId: string) => void
  onBanViewer: (viewerId: string) => void
  currentMessage: string
  setCurrentMessage: (message: string) => void
}

export function LiveChat({
  messages,
  viewers,
  onSendMessage,
  onModerateMessage,
  onPinMessage,
  onDeleteMessage,
  onMuteViewer,
  onBanViewer,
  currentMessage,
  setCurrentMessage
}: LiveChatProps) {
  const [showViewerList, setShowViewerList] = useState(false)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentMessage.trim()) {
        onSendMessage(currentMessage)
        setCurrentMessage('')
      }
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5" />
            Chat Live
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowViewerList(!showViewerList)}
              className="flex items-center gap-1"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">{viewers.length}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Pinned Messages */}
        {messages.some(msg => msg.isPinned) && (
          <div className="border-b bg-yellow-50 dark:bg-yellow-900/20 p-3">
            <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Messages épinglés
            </div>
            {messages.filter(msg => msg.isPinned).map(msg => (
              <div key={msg.id} className="text-sm mb-2">
                <span className="font-medium">{msg.author}:</span> {msg.content}
              </div>
            ))}
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`group flex gap-3 ${msg.isAgent ? 'justify-end' : 'justify-start'}`}>
                {!msg.isAgent && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs">{msg.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-xs lg:max-w-md ${msg.isAgent ? 'order-first' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{msg.author}</span>
                    {msg.isAgent && (
                      <Badge variant="secondary" className="text-xs">Agent</Badge>
                    )}
                    {msg.isPinned && (
                      <Pin className="w-3 h-3 text-yellow-600" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  
                  <div className={`rounded-lg p-3 relative ${
                    msg.isAgent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } ${msg.isModerated ? 'opacity-50' : ''}`}>
                    <p className="text-sm break-words">{msg.content}</p>
                    
                    {/* Moderation Controls */}
                    {!msg.isAgent && (
                      <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 bg-background"
                          onClick={() => onPinMessage(msg.id)}
                        >
                          <Pin className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 bg-background"
                          onClick={() => onModerateMessage(msg.id)}
                        >
                          <Ban className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 bg-background"
                          onClick={() => onDeleteMessage(msg.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.isAgent && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">AM</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Viewer List */}
        {showViewerList && (
          <div className="border-t p-3">
            <div className="text-sm font-medium mb-2">Spectateurs ({viewers.length})</div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{viewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{viewer.name}</span>
                      {viewer.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
                      {viewer.isBanned && <Ban className="w-3 h-3 text-destructive" />}
                    </div>
                    <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onMuteViewer(viewer.id)}
                      >
                        {viewer.isMuted ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onBanViewer(viewer.id)}
                      >
                        <Ban className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tapez votre message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={() => {
              if (currentMessage.trim()) {
                onSendMessage(currentMessage)
                setCurrentMessage('')
              }
            }}>
              Envoyer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
