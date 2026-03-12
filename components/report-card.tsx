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
import { ReportDetailDialog } from "./report-detail-dialog"
import { title } from "process"
import Link from "next/link"
import useNotifications from "@/hooks/useNotifications"

export function ReportCard({
  id,
  user : User,
  description,
  image,
  image1,
  image2,
  image_url,
  image1_url,
  image2_url,
  lieu,
  like_count,
  is_liked,
  statut,
}: Report) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { toggleLike, isToggling } = useLikes()
  const { data: comments, addComment, isAdding } = useComments(id)



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
  const getImageUrl = (imageField: string | null | undefined) => {
    if (!imageField) return null
    // Si l'image commence par http, c'est déjà une URL complète (retournée par le serializer)
    if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
      return imageField
    }
    // Si l'image commence par /media/, c'est une URL relative du backend Django
    if (imageField.startsWith('/media/')) {
      return `http://localhost:8000${imageField}`
    }
    // Sinon, essayer de construire l'URL complète
    return `http://localhost:8000/media/${imageField}`
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

  const imageUrl = image_url || getImageUrl(image)
  const image1Url = image1_url || getImageUrl(image1)
  const image2Url = image2_url || getImageUrl(image2)
  
  // Collecter toutes les images disponibles
  const allImages = [imageUrl, image1Url, image2Url].filter(url => url !== null)
  
  // URL statique de test - À remplacer par imageUrl après test
  // Exemples d'images disponibles : account.jpg (racine) ou reports/agrinova.PNG (ancien chemin)
  const testImageUrl = "http://localhost:8000/media/account.jpg" // URL statique de test - maintenant directement dans reports/
  
  // Utiliser l'URL de test pour déboguer, ou les URLs réelles si disponibles
  const displayImages = allImages.length > 0 ? allImages : [testImageUrl]
  
  console.log("Images URLs:", { imageUrl, image1Url, image2Url, allImages, displayImages })

  return (
    <>
      {allImages.length === 0 ? (
        <Card 
          className="w-full overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          onClick={() => setIsDetailOpen(true)}
        >
        {/* Header Section - Author Info */}
        <div className="p-4 flex items-start justify-between bg-linear-to-r from-background/50 to-background" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage 
                  src={User.photo ? 
                  (User.photo.startsWith('http') ? User.photo : `http://localhost:8000${User.photo}`) 
                  : `http://localhost:8000/media/users/photos/user.png`} 
                  alt={User.nom} 
                />
              </Avatar>
              {User.role === "agent" && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <BadgeCheck className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="font-semibold flex items-center gap-2 text-base leading-tight">
                <Link href={user?.id === User.id ? "profile" : `profile/${User.id}`} className="hover:text-primary transition-colors hover:border-b hover:border-primary pb-0">
                  {User.nom} 
                </Link>
                {User.role === "agent" && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                    Agent vérifié
                  </Badge>
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date().toLocaleDateString()}</span>
                {statut === 'approuve' && (
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                    Approuvé
                  </Badge>
                )}
              </div>
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
          <div className="flex items-center gap-2 text-muted-foreground mt-3 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{lieu}</span>
          </div>
          <p className="text-base text-foreground leading-relaxed whitespace-pre-line">{description}</p>
        </div>

      
        {/* Actions Section - Enhanced Design */}
        <div className="px-4 py-3 border-t border-border/50 bg-linear-to-r from-muted/20 to-background" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 ${is_liked ? 'text-red-500 hover:text-red-600' : ''}`}
              onClick={() => toggleLike(id)}
              disabled={isToggling}
            >
              <Heart className={`h-5 w-5 ${is_liked ? 'fill-current scale-110' : ''}`} />
              <span className="text-sm font-medium">{like_count || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{comments?.length || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsShareOpen(true)}
              size="sm" 
              className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">Partager</span>
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
        <Card 
          className="w-full overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          onClick={() => setIsDetailOpen(true)}
        >
      {/* Header Section - Author Info */}
      <div className="p-4 flex items-start justify-between bg-linear-to-r from-background/50 to-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage 
                src={User.photo ? 
                (User.photo.startsWith('http') ? User.photo : `http://localhost:8000${User.photo}`) 
                : `http://localhost:8000/media/users/photos/user.png`} 
                alt={User.nom} 
              />
            </Avatar>
            {User.role === "agent" && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                <BadgeCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
           <p className="font-semibold flex items-center gap-2 text-base leading-tight">
                <Link href={user?.id === User.id ? "profile" : `profile/${User.id}`}  className="hover:text-primary transition-colors hover:border-b hover:border-primary pb-0">
                  {User.nom} 
                </Link>
                {User.role === "agent" && 
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                    Agent vérifié
                  </Badge>
                }
              </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date().toLocaleDateString()}</span>
              {statut === 'approuve' && (
                <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                  Approuvé
                </Badge>
              )}
            </div>
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
        <div className="flex items-center gap-2 text-muted-foreground mt-3 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{lieu}</span>
        </div>
        <p className="text-base text-foreground leading-relaxed whitespace-pre-line">{description}</p>
      </div>

      {/* Image Gallery Section */}
      {displayImages.length > 0 && (
        <div className="relative w-full bg-muted overflow-hidden">
          <div className="relative">
            <img 
              src={displayImages[0] || "/placeholder.svg"} 
              alt={description || "Image du rapport"} 
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
              onError={(e) => {
                console.error("Erreur de chargement d'image:", displayImages[0], e);
              }}
              onLoad={() => {
                console.log("Image chargée avec succès:", displayImages[0]);
              }}
              onClick={(e) => {
                e.stopPropagation()
                // Ouvrir le dialog de détails de la publication
                setIsDetailOpen(true)
              }}
            />
            
            {/* Badge pour images supplémentaires */}
            {displayImages.length > 1 && (
              <div 
                className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-black/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  // Ouvrir le dialog de détails de la publication
                  setIsDetailOpen(true)
                }}
              >
                +{displayImages.length - 1}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions Section - Enhanced Design */}
      <div className="px-4 py-3 border-t border-border/50 bg-linear-to-r from-muted/20 to-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 ${is_liked ? 'text-red-500 hover:text-red-600' : ''}`}
            onClick={() => toggleLike(id)}
            disabled={isToggling}
          >
            <Heart className={`h-5 w-5 ${is_liked ? 'fill-current scale-110' : ''}`} />
            <span className="text-sm font-medium">{like_count || 0}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{comments?.length || 0}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setIsShareOpen(true)}
            size="sm" 
            className="flex-1 gap-2 justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">Partager</span>
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
    }
      
      {/* Report Detail Dialog */}
      <ReportDetailDialog
        report={{
          id,
          user: User,
          description,
          lieu,
          like_count,
          is_liked,
          statut,
          created_at: new Date().toISOString(),
          image,
          image1,
          image2,
          image_url,
          image1_url,
          image2_url,
          like: 0
        }}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  )
}
