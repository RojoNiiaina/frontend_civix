"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, MapPin, X, Calendar, User as UserIcon, Send, Edit2, Copy, Flag, Trash2, BadgeCheck, Ban, MoreVertical } from "lucide-react"
import Image from "next/image"
import type { Report } from "@/lib/utils"
import useLikes from "@/hooks/useLikes"
import useComments from "@/hooks/useComments"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import useAuth from "@/hooks/useAuth"
import useReports from "@/hooks/useReports"
import { ShareDialog } from "./share-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface ReportDetailDialogProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDetailDialog({ report, open, onOpenChange }: ReportDetailDialogProps) {
  const [commentText, setCommentText] = useState("")
  const [isShareOpen, setIsShareOpen] = useState(false)
  const { toggleLike, isToggling } = useLikes()
  const { data: comments, addComment, isAdding } = useComments(report?.id || 0)
  const { user } = useAuth()
  const { approuveReport } = useReports()
  
  const isAgent = user?.role === 'agent'
  const isOwner = user?.id === report?.user?.id

  const handleLike = () => {
    if (report) {
      toggleLike(report.id)
    }
  }

  const handleAddComment = () => {
    if (commentText.trim() && report) {
      addComment(commentText)
      setCommentText("")
    }
  }

  const handleApprouver = () => {
    if (report) {
      approuveReport({ id: Number(report.id) }, {
        onSuccess: () => {
          alert('Report approuvé avec succès')
        },
        onError: () => {
          alert("Échec de l'approuvement du rapport. Veuillez réessayer.")
        }
      })
    }
  }

  const handleCopyLink = () => {
    if (report) {
      const url = `${window.location.origin}?report=${report.id}`
      navigator.clipboard.writeText(url)
      console.log("Lien copié:", url)
    }
  }

  const handleDelete = () => {
    if (report) {
      console.log("Supprimer la publication:", report.id)
      // À implémenter : ouvrir un dialog de confirmation et supprimer
    }
  }

  const getProfileImageUrl = () => {
    if (!report?.user?.photo) return null
    if (report.user.photo.startsWith('http://') || report.user.photo.startsWith('https://')) {
      return report.user.photo
    }
    if (report.user.photo.startsWith('/media/')) {
      return `http://localhost:8000${report.user.photo}`
    }
    return `http://localhost:8000/media/${report.user.photo}`
  }

  // Utiliser directement les URLs du backend sans redirection
  const allImages = [
    report?.image_url || report?.image,
    report?.image1_url || report?.image1,
    report?.image2_url || report?.image2
  ].filter(url => url !== null && url !== undefined)

  const profileImageUrl = getProfileImageUrl()

  if (!report) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Détails du rapport</DialogTitle>
              
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header - Author Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={profileImageUrl || `http://localhost:8000/media/users/photos/user.png`} 
                    alt={report.user?.nom} 
                  />
                  <AvatarFallback>
                    <UserIcon className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-semibold flex items-center gap-2 text-base">
                    {report.user?.nom}
                    {report.user?.role === "agent" && 
                      <span className="text-sm">
                        <BadgeCheck className="h-4 w-4 text-green-500" />
                      </span>
                    }
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(report.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <Badge 
                variant={report.statut === 'approuve' ? 'default' : 
                        report.statut === 'en_cours' ? 'secondary' :
                        report.statut === 'resolu' ? 'default' :
                        report.statut === 'rejete' ? 'destructive' : 'outline'}
                className="ml-4"
              >
                {report.statut === 'en_attente' && 'En attente'}
                {report.statut === 'approuve' && 'Approuvé'}
                {report.statut === 'en_cours' && 'En cours'}
                {report.statut === 'resolu' && 'Résolu'}
                {report.statut === 'rejete' && 'Rejeté'}
              </Badge>
            </div>

            {/* Actions Menu */}
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {report.statut !== 'approuve' && isAgent && (
                    <div>
                      <DropdownMenuItem onClick={handleApprouver} className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        <span>Approuver</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
                        <Copy className="h-4 w-4" />
                        <span>Rejeter</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                  )}
                  {isOwner && (
                    <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
                    <Copy className="h-4 w-4" />
                    <span>Copier le lien</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Location */}
            {report.lieu && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{report.lieu}</span>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-base leading-relaxed whitespace-pre-line">
                {report.description}
              </p>
            </div>

            {/* Images Gallery */}
            {allImages.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Images</h3>
                {allImages.length === 1 ? (
                  <div className="relative w-full overflow-hidden rounded-lg border">
                    <img
                      src={allImages[0]}
                      alt="Image du rapport"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                ) : (
                  <div className={`grid gap-2 ${
                    allImages.length === 2 ? 'grid-cols-2' : 
                    allImages.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                  }`}>
                    {allImages.map((imageUrl, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg border cursor-pointer group">
                        <img
                          src={imageUrl}
                          alt={`Image ${index + 1} du rapport`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interaction Stats */}
            <div className="flex items-center gap-6 py-4 border-y">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-semibold">{report.like_count || 0}</span>
                <span className="text-muted-foreground">likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">{comments?.length || 0}</span>
                <span className="text-muted-foreground">commentaires</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant={report.is_liked ? "default" : "outline"}
                onClick={handleLike}
                disabled={isToggling}
                className="flex-1 gap-2"
              >
                <Heart className={`h-4 w-4 ${report.is_liked ? 'fill-current' : ''}`} />
                {report.is_liked ? 'Liké' : 'Liker'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsShareOpen(true)}
                className="flex-1 gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Commentaires</h3>
              
              {/* Comments List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={comment.user?.photo ? 
                          (comment.user.photo.startsWith('http') ? comment.user.photo : `http://localhost:8000${comment.user.photo}`) 
                          : `http://localhost:8000/media/users/photos/user.png`} 
                          alt={comment.user?.nom} 
                        />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.user?.nom || 'Utilisateur'}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.contenu}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun commentaire pour le moment
                  </p>
                )}
              </div>

              {/* Comment Form */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 min-h-[60px] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={isAdding || !commentText.trim()}
                  size="icon"
                  className="h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        title={`Rapport de ${report.user?.nom}`}
        description={report.description}
      />
    </>
  )
}
