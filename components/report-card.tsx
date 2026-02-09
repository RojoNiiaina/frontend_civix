"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share2, MapPin, MoreVertical, Send, Edit2, Copy, Flag, Trash2, BadgeCheck, Ban} from "lucide-react"
import Image from "next/image"

import type { ReportStatus } from "@/lib/utils"
import { Report } from "@/lib/utils"
import { User } from "@/lib/utils"
import useLikes from "@/hooks/useLikes"
import useComments from "@/hooks/useComments"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import useAuth from "@/hooks/useAuth"
import useReports from "@/hooks/useReports"
import { ShareDialog } from "./share-dialog"
import { title } from "process"
import Link from "next/link"
import useNotifications from "@/hooks/useNotifications"

export function ReportCard({
  id,
  user : User,
  description,
  image,
  lieu,
  like_count,
  is_liked,
  statut,
}: Report) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const { toggleLike, isToggling } = useLikes()
  const { data: comments, addComment, isAdding } = useComments(id)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const {CreateNotification} = useNotifications()


  const {approuveReport} = useReports()

  const { user } = useAuth()
  const isAgent = user?.role === 'agent'
  
  // Handlers pour le menu
  const Approuver = () => {
    approuveReport({id: Number(id)}, {
      onSuccess: () => {
        alert('Report approuvé avec succès')
      },
      onError: () => {
        alert("Échec de l'approuvement du rapport. Veuillez réessayer.")
      }
    })
  }

  const handleDelete = () => {
    console.log("[v0] Supprimer la publication:", id)
    // À implémenter : ouvrir un dialog de confirmation et supprimer
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}?report=${id}`
    navigator.clipboard.writeText(url)
    console.log("[v0] Lien copié:", url)
    // Vous pouvez ajouter un toast pour confirmer la copie
  }



  // Construire l'URL complète de l'image
  const getImageUrl = () => {
    if (!image) return null
    // Si l'image commence par http, c'est déjà une URL complète (retournée par le serializer)
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    // Si l'image commence par /media/, c'est une URL relative du backend Django
    if (image.startsWith('/media/')) {
      return `http://localhost:8000${image}`
    }
    // Sinon, essayer de construire l'URL complète
    return `http://localhost:8000/media/${image}`
  }

  const getProfileImageUrl = () => {
    if (!User?.photo) return null
    // Si l'image commence par http, c'est déjà une URL complète (retournée par le serializer)
    if (User.photo.startsWith('http://') || User.photo.startsWith('https://')) {
      return User.photo
    }
    // Si l'image commence par /media/, c'est une URL relative du backend Django
    if (User.photo.startsWith('/media/')) {
      return `http://localhost:8000${User.photo}`
    }
    // Sinon, essayer de construire l'URL complète
    return `http://localhost:8000/media/${User.photo}`
  }

  const profileImageUrl = getProfileImageUrl() 

  const imageUrl = getImageUrl()
  
  // URL statique de test - À remplacer par imageUrl après test
  // Exemples d'images disponibles : account.jpg (racine) ou reports/agrinova.PNG (ancien chemin)
  const testImageUrl = "http://localhost:8000/media/account.jpg" // URL statique de test - maintenant directement dans reports/
  
  // Utiliser l'URL de test pour déboguer, ou l'URL réelle si disponible
  const displayImageUrl = imageUrl || testImageUrl
  
  console.log("Image URL:", imageUrl, "Display URL:", displayImageUrl)

  return (
    !image ?(
      <Card className="w-full overflow-hidden bg-card border-0 shadow-md hover:shadow-lg transition-shadow duration-300 -gap-6">
        {/* Header Section - Author Info */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={User.photo ? 
                (User.photo.startsWith('http') ? User.photo : `http://localhost:8000${User.photo}`) 
                : `http://localhost:8000/media/users/photos/user.png`} 
                alt={User.nom} 
              />
            </Avatar>
            
            <div className="flex-1">
              <p className="font-semibold flex items-center gap-2 text-sm leading-tight">
                <Link href={`profile/${User.id}`} className="hover:border-b hover:border-gray-800 pb-0">
                  {User.nom} 
                </Link>
                {User.role === "agent" && 
                  <span className="text-xs">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                  </span>
                }
              </p>
              <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {
                  statut !== 'approuve' &&
                  <div>
                    <DropdownMenuItem onClick={Approuver} className="gap-2 hover:bg-muted hover:text-foreground">
                      <Edit2 className="h-4 w-4" />
                      <span>Approuver la publication</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator /> 
                    <DropdownMenuItem onClick={handleCopyLink} className="gap-2 hover:bg-muted hover:text-foreground">
                      <Copy className="h-4 w-4" />
                      <span>Rejeter la publication</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                }
                {
                  user?.id === User.id &&
                  <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer la publication</span>
                  </DropdownMenuItem>
                }
                {
                  statut === 'approuve' &&
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2 ">
                    <Copy className="h-4 w-4" />
                    <span>Copier le lien</span>
                  </DropdownMenuItem>
                }
              </DropdownMenuContent>
            </DropdownMenu>
          
          
        </div>

        {/* Description Section */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-end gap-0.5 text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">{lieu}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{description}</p>
        </div>

      
        {/* Actions Section - Facebook Style */}
        <div className="px-4 py-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted ${is_liked ? 'text-red-500 hover:text-red-600' : ''}`}
              onClick={() => toggleLike(id)}
              disabled={isToggling}
            >
              <Heart className={`h-4 w-4 ${is_liked ? 'fill-current' : ''}`} />
              <span className="text-xs">{like_count || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments?.length || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsShareOpen(true)}
              size="sm" 
              className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Partager</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-border p-4 space-y-4 bg-muted/30">
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
                    </Avatar>
                    <div className="flex-1 bg-muted rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.user?.nom || 'Utilisateur'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{comment.contenu}</p>
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
            <div className="flex gap-2 pt-2 border-t border-border">
              <Input
                placeholder="Ajouter un commentaire..."
                className="text-sm"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    addComment(commentText)
                    setCommentText("")
                  }
                }}
              />
              <Button 
                onClick={() => {
                  if (commentText.trim()) {
                    addComment(commentText)
                    setCommentText("")
                  }
                }}
                disabled={isAdding || !commentText.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          title={title}
          description={description}
        />
      </Card>
    ) : 
    <Card className="w-full overflow-hidden bg-card border-0 shadow-md hover:shadow-lg transition-shadow duration-300 -gap-6">
      {/* Header Section - Author Info */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={User.photo ? 
              (User.photo.startsWith('http') ? User.photo : `http://localhost:8000${User.photo}`) 
              : `http://localhost:8000/media/users/photos/user.png`} 
              alt={User.nom} 
            />
          </Avatar>
          <div className="flex-1">
           <p className="font-semibold flex items-center gap-2 text-sm leading-tight">
                <Link href={`profile/${User.id}`} className="hover:border-b hover:border-gray-800 pb-0">
                  {User.nom} 
                </Link>
                {User.role === "agent" && 
                  <span className="text-xs">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                  </span>
                }
              </p>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {
              statut !== 'approuve' &&
              user?.role === 'agent' &&
                <div>
                  <DropdownMenuItem onClick={Approuver} className="gap-2 hover:bg-muted hover:text-foreground">
                    <Edit2 className="h-4 w-4" />
                    <span>Approuver la publication</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator /> 
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2 hover:bg-muted hover:text-foreground">
                    <Copy className="h-4 w-4" />
                    <span>Refuser la publication</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                }
                {
                  user?.id === User.id &&
                  <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer la publication</span>
                  </DropdownMenuItem>
                }
                {
                  statut === 'approuve' &&
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2 ">
                    <Copy className="h-4 w-4" />
                    <span>Copier le lien</span>
                  </DropdownMenuItem>
                }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description Section */}
      <div className="px-4 ">
        <div className="flex items-center justify-end gap-0.5 text-muted-foreground mt-2">
          <MapPin className="h-4 w-4" />
          <span className="text-xs">{lieu}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{description}</p>
      </div>

      {/* Image Section - Horizontal */}
      {displayImageUrl && (
        <div className="relative w-full bg-muted overflow-hidden">
          <img 
            src={displayImageUrl || "/placeholder.svg"} 
            alt={description || "Image du rapport"} 
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              console.error("Erreur de chargement d'image:", displayImageUrl, e);
            }}
            onLoad={() => {
              console.log("Image chargée avec succès:", displayImageUrl);
            }}
          />
        </div>
      )}

      {/* Actions Section - Facebook Style */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted ${is_liked ? 'text-red-500 hover:text-red-600' : ''}`}
            onClick={() => toggleLike(id)}
            disabled={isToggling}
          >
            <Heart className={`h-4 w-4 ${is_liked ? 'fill-current' : ''}`} />
            <span className="text-xs">{like_count || 0}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments?.length || 0}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setIsShareOpen(true)}
            size="sm" 
            className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Partager</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/30">
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
                  </Avatar>
                  <div className="flex-1 bg-muted rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.user?.nom || 'Utilisateur'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{comment.contenu}</p>
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
          <div className="flex gap-2 pt-2 border-t border-border">
            <Input
              placeholder="Ajouter un commentaire..."
              className="text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  addComment(commentText)
                  setCommentText("")
                }
              }}
            />
            <Button 
              onClick={() => {
                if (commentText.trim()) {
                  addComment(commentText)
                  setCommentText("")
                }
              }}
              disabled={isAdding || !commentText.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        title={title}
        description={description}
      />
    </Card>
  )
}
