import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload,
  Activity,
  AlertTriangle
} from 'lucide-react'

interface StreamStatusProps {
  isStreaming: boolean
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
  bitrate?: number
  fps?: number
  droppedFrames?: number
  viewers?: number
}

export function StreamStatus({ 
  isStreaming, 
  connectionQuality, 
  bitrate = 0, 
  fps = 0, 
  droppedFrames = 0,
  viewers = 0
}: StreamStatusProps) {
  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-yellow-600'
      case 'poor': return 'text-orange-600'
      case 'disconnected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getQualityText = () => {
    switch (connectionQuality) {
      case 'excellent': return 'Excellente'
      case 'good': return 'Bonne'
      case 'poor': return 'Faible'
      case 'disconnected': return 'Déconnectée'
      default: return 'Inconnue'
    }
  }

  const getQualityProgress = () => {
    switch (connectionQuality) {
      case 'excellent': return 100
      case 'good': return 75
      case 'poor': return 40
      case 'disconnected': return 0
      default: return 0
    }
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {connectionQuality === 'disconnected' ? (
              <WifiOff className={`w-4 h-4 ${getQualityColor()}`} />
            ) : (
              <Wifi className={`w-4 h-4 ${getQualityColor()}`} />
            )}
            <span className="font-medium">Connexion</span>
          </div>
          <Badge variant={connectionQuality === 'excellent' ? 'default' : 'secondary'}>
            {getQualityText()}
          </Badge>
        </div>

        <Progress value={getQualityProgress()} className="h-2" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Débit:</span>
            <span className="font-medium">{bitrate} kbps</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">FPS:</span>
            <span className="font-medium">{fps}</span>
          </div>
        </div>

        {droppedFrames > 0 && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <AlertTriangle className="w-4 h-4" />
            <span>{droppedFrames} images perdues</span>
          </div>
        )}

        {isStreaming && (
          <div className="text-sm text-muted-foreground">
            <span>{viewers} spectateurs connectés</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
