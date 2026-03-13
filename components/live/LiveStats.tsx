import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Clock,
  MessageSquare,
  Activity,
  BarChart3,
  UserPlus,
  Heart
} from 'lucide-react'

interface LiveStatsProps {
  isLive: boolean
  viewerCount: number
  peakViewers: number
  totalViews: number
  duration: string
  messageCount: number
  engagementRate: number
  reactions: {
    like: number
    love: number
    laugh: number
    wow: number
  }
  viewerHistory: Array<{
    time: string
    viewers: number
  }>
}

export function LiveStats({
  isLive,
  viewerCount,
  peakViewers,
  totalViews,
  duration,
  messageCount,
  engagementRate,
  reactions,
  viewerHistory
}: LiveStatsProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'viewers' | 'engagement'>('overview')

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Statistiques du Live
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedTab === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('overview')}
            >
              Aperçu
            </Button>
            <Button
              variant={selectedTab === 'viewers' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('viewers')}
            >
              Spectateurs
            </Button>
            <Button
              variant={selectedTab === 'engagement' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('engagement')}
            >
              Engagement
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <Badge variant={isLive ? 'destructive' : 'secondary'}>
                    {isLive ? 'EN DIRECT' : 'HORS LIGNE'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <span className="font-medium">{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Messages</span>
                  <span className="font-medium">{messageCount}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Spectateurs actuels</span>
                  <span className="font-medium">{viewerCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pic de spectateurs</span>
                  <span className="font-medium">{peakViewers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vues totales</span>
                  <span className="font-medium">{totalViews}</span>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'viewers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Spectateurs actuels</span>
                </div>
                <span className="text-2xl font-bold">{viewerCount}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pic aujourd'hui</span>
                  <span className="font-medium">{peakViewers}</span>
                </div>
                <Progress value={(viewerCount / peakViewers) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">Historique des spectateurs</div>
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {viewerHistory.slice(-10).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{entry.time}</span>
                        <span className="font-medium">{entry.viewers}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {selectedTab === 'engagement' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux d'engagement</span>
                  <span className="font-medium">{engagementRate}%</span>
                </div>
                <Progress value={engagementRate} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Réactions ({totalReactions})</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <span>👍</span>
                      <span className="text-sm">Like</span>
                    </div>
                    <span className="font-medium">{reactions.like}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <span>❤️</span>
                      <span className="text-sm">Love</span>
                    </div>
                    <span className="font-medium">{reactions.love}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <span>😄</span>
                      <span className="text-sm">Laugh</span>
                    </div>
                    <span className="font-medium">{reactions.laugh}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <span>😮</span>
                      <span className="text-sm">Wow</span>
                    </div>
                    <span className="font-medium">{reactions.wow}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Messages par spectateur</span>
                  <span className="font-medium">
                    {viewerCount > 0 ? (messageCount / viewerCount).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Réactions par spectateur</span>
                  <span className="font-medium">
                    {viewerCount > 0 ? (totalReactions / viewerCount).toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
