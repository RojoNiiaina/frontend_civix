import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Settings,
  Maximize2,
  Minimize2,
  Camera,
  Volume2
} from 'lucide-react'

interface StreamControlsProps {
  isVideoOn: boolean
  isAudioOn: boolean
  isScreenSharing: boolean
  isLive: boolean
  onToggleVideo: () => void
  onToggleAudio: () => void
  onToggleScreenShare: () => void
  onStartStream: () => void
  onStopStream: () => void
  onOpenSettings: () => void
  viewerCount?: number
  duration?: string
}

export function StreamControls({
  isVideoOn,
  isAudioOn,
  isScreenSharing,
  isLive,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onStartStream,
  onStopStream,
  onOpenSettings,
  viewerCount = 0,
  duration = '00:00:00'
}: StreamControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          Contrôles du Stream
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Media Controls */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Contrôles média</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="sm"
              onClick={onToggleVideo}
              className="flex items-center gap-2"
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              <span className="text-xs">Caméra</span>
            </Button>
            
            <Button
              variant={isAudioOn ? "default" : "destructive"}
              size="sm"
              onClick={onToggleAudio}
              className="flex items-center gap-2"
            >
              {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span className="text-xs">Micro</span>
            </Button>
            
            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              onClick={onToggleScreenShare}
              className="flex items-center gap-2"
            >
              {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
              <span className="text-xs">Partage écran</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="flex items-center gap-2"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="text-xs">Plein écran</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Stream Control */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Contrôle du stream</div>
          {!isLive ? (
            <Button 
              onClick={onStartStream} 
              className="w-full bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
              Commencer le live
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                variant="destructive" 
                onClick={onStopStream}
                className="w-full flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                Terminer le live
              </Button>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span>EN DIRECT</span>
                </div>
                <div className="text-muted-foreground">{duration}</div>
              </div>
              
              {viewerCount > 0 && (
                <div className="text-sm text-muted-foreground">
                  {viewerCount} spectateur{viewerCount > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Quick Settings */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Paramètres rapides</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Qualité vidéo</span>
              <select className="text-sm border rounded px-2 py-1 bg-background">
                <option>1080p HD</option>
                <option>720p</option>
                <option>480p</option>
                <option>360p</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Microphone</span>
              <select className="text-sm border rounded px-2 py-1 bg-background">
                <option>Micro par défaut</option>
                <option>Casque USB</option>
                <option>Webcam Mic</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Caméra</span>
              <select className="text-sm border rounded px-2 py-1 bg-background">
                <option>Caméra par défaut</option>
                <option>Caméra HD Pro</option>
                <option>Webcam intégrée</option>
              </select>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={onOpenSettings}
        >
          <Settings className="w-4 h-4 mr-2" />
          Paramètres avancés
        </Button>
      </CardContent>
    </Card>
  )
}
