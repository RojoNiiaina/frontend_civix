"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button,} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useLive } from '@/hooks/useLive'
import { LiveStream, LiveMessage, LiveViewer } from '@/lib/utils'
import { useWebRTC } from '@/hooks/useWebRTC'
import useAuth from '@/hooks/useAuth'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageSquare, 
  Users, 
  Eye, 
  Settings,
  Send,
  Ban,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  ArrowLeft,
  Plus
} from 'lucide-react'

interface Message {
  id: string
  author: string
  content: string
  timestamp: Date
  isAgent?: boolean
  isModerated?: boolean
}

interface Viewer {
  id: string
  name: string
  avatar?: string
  joinedAt: Date
}

interface StreamFormData {
  title: string
  description: string
}

export default function LiveEventPage() {
  const { user } = useAuth()
  const {
    myStreams,
    activeStreams,
    messages,
    viewers,
    loading,
    error,
    createStream,
    startStream,
    endStream,
    sendMessage,
    fetchMessages,
    fetchViewers,
    joinStream,
    leaveStream
  } = useLive()
  
  const activeViewerSessionIdRef = useRef<string | null>(null)

  const {
    localStream,
    remoteStream,
    isStreaming,
    connectionState,
    error: webrtcError,
    localVideoRef,
    remoteVideoRef,
    startLocalStream,
    stopLocalStream,
    createOffer,
    createAnswer,
    handleRemoteDescription,
    handleIceCandidate,
    toggleVideo,
    toggleAudio,
    getVideoState,
    getAudioState,
    cleanup
  } = useWebRTC({
    onIceCandidate: (candidate) => {
      // Send ICE candidate to signaling server (viewer-scoped)
      if (!websocket) return
      const viewerSessionId = activeViewerSessionIdRef.current
      if (!viewerSessionId) return
      websocket.send(JSON.stringify({
        type: 'webrtc_ice_candidate',
        candidate,
        viewerSessionId
      }))
    }
  })
  
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null)
  const [message, setMessage] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<StreamFormData>({
    title: '',
    description: ''
  })
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  
  // Mock data for UI when no real stream is active
  const [mockMessages, setMockMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'Marie Dubois',
      content: 'Bonjour ! Pourriez-vous nous donner plus de détails sur le nouveau projet de parc ?',
      timestamp: new Date(Date.now() - 5 * 60000),
      isAgent: false
    },
    {
      id: '2',
      author: 'Agent Municipal',
      content: 'Bonjour Marie ! Le projet de parc inclura des aires de jeux pour enfants, des espaces verts et une zone de pique-nique.',
      timestamp: new Date(Date.now() - 3 * 60000),
      isAgent: true
    },
    {
      id: '3',
      author: 'Jean Martin',
      content: 'Quand est-ce que les travaux commenceront ?',
      timestamp: new Date(Date.now() - 1 * 60000),
      isAgent: false
    }
  ])
  
  const [mockViewers] = useState<Viewer[]>([
    { id: '1', name: 'Marie Dubois', joinedAt: new Date(Date.now() - 10 * 60000) },
    { id: '2', name: 'Jean Martin', joinedAt: new Date(Date.now() - 8 * 60000) },
    { id: '3', name: 'Sophie Bernard', joinedAt: new Date(Date.now() - 5 * 60000) },
    { id: '4', name: 'Pierre Petit', joinedAt: new Date(Date.now() - 2 * 60000) }
  ])
  
  const isLive = currentStream?.status === 'live'
  const viewerCount = currentStream?.viewer_count || 0
  const displayMessages = currentStream ? messages.map((msg: LiveMessage) => ({
    id: msg.id.toString(),
    author: msg.user_name,
    content: msg.content,
    timestamp: new Date(msg.created_at),
    isAgent: msg.user_name === user?.nom,
    isModerated: false
  })) : mockMessages
  
  const displayViewers = currentStream ? viewers.map(v => ({
    id: v.id.toString(),
    name: v.user_name || `Anonymous-${v.session_id.slice(0, 8)}`,
    joinedAt: new Date(v.joined_at)
  })) : mockViewers
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // WebSocket connection for signaling
  useEffect(() => {
    if (currentStream) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const roleParam = user?.role === 'agent' ? 'role=streamer' : 'role=viewer'
      const tokenParam = token ? `token=${encodeURIComponent(token)}` : null
      const qs = [tokenParam, roleParam].filter(Boolean).join('&')
      const wsUrl = `ws://localhost:8000/ws/live/${currentStream.id}/?${qs}`
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        if (user?.role !== 'agent') {
          // Viewer announces itself to request an offer (backend will forward to streamer)
          const viewerSessionId = Math.random().toString(36).slice(2, 10)
          activeViewerSessionIdRef.current = viewerSessionId
          ws.send(JSON.stringify({ type: 'viewer_join', viewerSessionId }))
        }
      }
      
      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'chat_message':
              // Update messages through useLive hook
              await fetchMessages(currentStream.id)
              break
            
            case 'viewer_join':
              if (user?.role === 'agent' && data.viewerSessionId) {
                // Streamer: remember which viewer we're currently serving, then send offer
                activeViewerSessionIdRef.current = data.viewerSessionId
                const offer = await createOffer()
                if (offer) {
                  ws.send(JSON.stringify({
                    type: 'webrtc_offer',
                    offer,
                    viewerSessionId: data.viewerSessionId
                  }))
                }
              }
              break
              
            case 'webrtc_offer':
              if (user?.role !== 'agent') {
                // Viewer receives offer, create answer
                const answer = await createAnswer(data.offer)
                if (answer) {
                  ws.send(JSON.stringify({
                    type: 'webrtc_answer',
                    answer,
                    viewerSessionId: data.viewerSessionId
                  }))
                }
              }
              break
              
            case 'webrtc_answer':
              if (user?.role === 'agent') {
                // Streamer receives answer (viewer-scoped)
                if (!data.viewerSessionId) break
                if (data.viewerSessionId !== activeViewerSessionIdRef.current) break
                await handleRemoteDescription(data.answer)
              }
              break
              
            case 'webrtc_ice_candidate':
              // ICE candidate is viewer-scoped
              if (user?.role === 'agent') {
                if (!data.viewerSessionId) break
                if (data.viewerSessionId !== activeViewerSessionIdRef.current) break
              }
              await handleIceCandidate(data.candidate)
              break
              
            case 'stream_status':
              // Update stream status
              setCurrentStream(prev => prev ? { ...prev, status: data.status } : null)
              break
              
            case 'error':
              console.error('WebSocket error:', data.message)
              break
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason)
        if (event.code !== 1000) {
          // Unexpected close - try to reconnect after delay
          setTimeout(() => {
            if (currentStream) {
              console.log('Attempting to reconnect WebSocket...')
              // The useEffect will re-run and create a new connection
            }
          }, 3000)
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        // Show user-friendly error message
        alert('Erreur de connexion WebSocket. Veuillez vérifier que le serveur backend est en cours d\'exécution.')
      }
      
      setWebsocket(ws)
      
      return () => {
        ws.close()
      }
    }
  }, [currentStream, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])
  
  useEffect(() => {
    if (currentStream) {
      fetchMessages(currentStream.id)
      fetchViewers(currentStream.id)
      const interval = setInterval(() => {
        fetchMessages(currentStream.id)
        fetchViewers(currentStream.id)
      }, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [currentStream])

  const handleCreateStream = async () => {
    try {
      const newStream = await createStream(formData)
      setCurrentStream(newStream)
      setShowCreateForm(false)
      setFormData({ title: '', description: '' })
    } catch (error) {
      console.error('Failed to create stream:', error)
    }
  }
  
  const handleStartLive = async () => {

    
    try {
      // Create stream automatically with default values
      const defaultStreamData = {
        title: `Live Session - ${new Date().toLocaleString('fr-FR')}`,
        description: 'Session live en direct'
      }
      
      const newStream = await createStream(defaultStreamData)
      setCurrentStream(newStream)
      
      // Start WebRTC stream
      await startLocalStream()
      
      // Start stream via API
      await startStream(newStream.id)
      setCurrentStream(prev => prev ? { ...prev, status: 'live' as const } : null)
      // Offer will be created and sent when a viewer joins (message `viewer_join`)
    } catch (error) {
      console.error('Failed to start stream:', error)
    }
  }

  const handleStopLive = async () => {
    if (currentStream) {
      try {
        // Stop WebRTC stream
        stopLocalStream()
        cleanup()
        
        // End stream via API
        await endStream(currentStream.id)
        setCurrentStream(prev => prev ? { ...prev, status: 'ended' as const } : null)
        
        // Notify via WebSocket
        if (websocket) {
          websocket.send(JSON.stringify({
            type: 'stream_ended'
          }))
        }
      } catch (error) {
        console.error('Failed to end stream:', error)
      }
    }
  }

  const handleSendMessage = async () => {
    if (message.trim() && currentStream && websocket) {
      try {
        // Send message via WebSocket
        websocket.send(JSON.stringify({
          type: 'chat_message',
          content: message
        }))
        
        setMessage('')
        await fetchMessages(currentStream.id)
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    } else if (message.trim()) {
      // Fallback to mock behavior
      const newMessage: Message = {
        id: Date.now().toString(),
        author: user?.nom || 'Agent Municipal',
        content: message,
        timestamp: new Date(),
        isAgent: true
      }
      setMockMessages(prev => [...prev, newMessage])
      setMessage('')
    }
  }

  const handleModerateMessage = (messageId: string) => {
    if (currentStream) {
      // TODO: Implement moderation API call
      console.log('Moderate message:', messageId)
    } else {
      setMockMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isModerated: true }
            : msg
        )
      )
    }
  }

  const handleToggleVideo = () => {
    const newState = toggleVideo()
    setIsVideoOn(newState)
  }
  
  const handleToggleAudio = () => {
    const newState = toggleAudio()
    setIsAudioOn(newState)
  }
  
  // Update video/audio states when stream changes
  useEffect(() => {
    if (isStreaming) {
      setIsVideoOn(getVideoState())
      setIsAudioOn(getAudioState())
    }
  }, [isStreaming])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/agent">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <h1 className="text-3xl font-bold">Session Live</h1>
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                EN DIRECT
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{viewerCount}</span>
              <span>spectateurs</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>
        
      

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  {user?.role === 'agent' ? (
                    // Streamer view - local video
                    <video
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    // Viewer view - remote video
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                  )}
                  
                  {!isStreaming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <VideoOff className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg">
                          {user?.role === 'agent' ? 'Caméra désactivée' : 'En attente du stream...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStream?.status === 'ended' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="text-center text-white px-6">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                        <p className="text-2xl font-semibold mb-2">Live terminé</p>
                        <p className="text-white/80">
                          Ce live a été terminé par le diffuseur.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Live Badge Overlay */}
                  {isLive && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="bg-red-600">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        LIVE
                      </Badge>
                    </div>
                  )}

                  {/* Connection Status */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant={connectionState === 'connected' ? 'default' : 'secondary'}>
                      {connectionState}
                    </Badge>
                  </div>

                  {/* Viewer Count Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">{viewerCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isVideoOn ? "default" : "destructive"}
                      size="sm"
                      onClick={handleToggleVideo}
                      disabled={!isStreaming}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant={isAudioOn ? "default" : "destructive"}
                      size="sm"
                      onClick={handleToggleAudio}
                      disabled={!isStreaming}
                    >
                      {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    {!currentStream && (
                      <Button onClick={handleStartLive} className="bg-red-600 hover:bg-red-700">
                        <div className="w-2 h-2 bg-white rounded-full mr-2" />
                        Commencer un live
                      </Button>
                    )}
                    {currentStream && currentStream.status === 'live' && (
                      <Button variant="destructive" onClick={handleStopLive}>
                        <div className="w-2 h-2 bg-white rounded-full mr-2" />
                        Terminer le live
                      </Button>
                    )}
                    {currentStream && currentStream.status === 'ended' && (
                      <Button variant="destructive" onClick={handleStartLive}>
                        <div className="w-2 h-2 bg-white rounded-full mr-2" />
                        Commence un live
                      </Button>
                    )}
                    
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat avec les citoyens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full rounded-md border p-4">
                  <div className="space-y-3">
                    {displayMessages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.isAgent ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isAgent && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{msg.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-xs lg:max-w-md ${msg.isAgent ? 'order-first' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{msg.author}</span>
                            {msg.isAgent && (
                              <Badge variant="secondary" className="text-xs">Agent</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <div className={`rounded-lg p-3 ${
                            msg.isAgent 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          } ${msg.isModerated ? 'opacity-50' : ''}`}>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          {!msg.isAgent && !msg.isModerated && (
                            <div className="flex gap-1 mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => handleModerateMessage(msg.id)}
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Modérer
                              </Button>
                            </div>
                          )}
                        </div>
                        {msg.isAgent && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>AM</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre réponse..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Live Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques du live</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Spectateurs actuels</span>
                  <span className="font-medium">{viewerCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Durée du live</span>
                  <span className="font-medium">{currentStream?.duration || '00:00:00'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Messages envoyés</span>
                  <span className="font-medium">{displayMessages.length}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Connexion stable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">3 messages en attente de modération</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Viewers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Spectateurs actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 w-full">
                  <div className="space-y-3">
                    {displayViewers.map((viewer) => (
                      <div key={viewer.id} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{viewer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rejoint {formatTime(viewer.joinedAt)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Envoyer une annonce
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les participants
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Ban className="w-4 h-4 mr-2" />
                  Modérer le chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}