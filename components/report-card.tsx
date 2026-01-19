"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share2, MapPin, MoreVertical, Send } from "lucide-react"
import Image from "next/image"

import type { ReportStatus } from "@/lib/utils"
import { Report } from "@/lib/utils"
import { User } from "@/lib/utils"
import useLikes from "@/hooks/useLikes"
import useComments from "@/hooks/useComments"

export function ReportCard({
  id,
  user : User,
  description,
  image,
  lieu,
  like_count,
  is_liked,
}: Report) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const { toggleLike, isToggling } = useLikes()
  const { data: comments, addComment, isAdding } = useComments(id)
  const statusColors = {
    pending: "bg-amber-500 text-white",
    "in-progress": "bg-blue-500 text-white",
    resolved: "bg-emerald-500 text-white",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const statusConfig: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  en_attente: {
    label: "En attente",
    className: "bg-amber-500 text-white",
  },
  en_cours: {
    label: "En cours",
    className: "bg-blue-500 text-white",
  },
  resolu: {
    label: "Résolu",
    className: "bg-emerald-500 text-white",
  },
  rejete: {
    label: "Rejeté",
    className: "bg-rose-500 text-white",
  },
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

  const imageUrl = getImageUrl()
  
  // URL statique de test - À remplacer par imageUrl après test
  // Exemples d'images disponibles : account.jpg (racine) ou reports/agrinova.PNG (ancien chemin)
  const testImageUrl = "http://localhost:8000/media/account.jpg" // URL statique de test - maintenant directement dans reports/
  
  // Utiliser l'URL de test pour déboguer, ou l'URL réelle si disponible
  const displayImageUrl = imageUrl || testImageUrl
  
  console.log("Image URL:", imageUrl, "Display URL:", displayImageUrl)

  return (
    !image ? (
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                {/* <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} /> */}
                {/* <AvatarFallback className="bg-primary/10 text-primary">{getInitials(author.name)}</AvatarFallback> */}
              </Avatar>
              <div>
                <p className="font-semibold leading-tight">{User.nom}</p>
                {/* <p className="text-xs text-muted-foreground">{timeAgo}</p> */}
              </div>
            </div>
           
          </div>

          <div className="space-y-2">
            {/* <h3 className="text-lg font-bold leading-snug">{title}</h3> */}
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{lieu}</span>
            </div>
            {/* <Badge className={` font-semibold`}>
              {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge> */}
          </div>

          <div className="flex items-center gap-2 border-t pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex-1 gap-2 ${is_liked ? 'text-red-500' : ''}`}
              onClick={() => toggleLike(id)}
              disabled={isToggling}
            >
              <Heart className={`h-4 w-4 ${is_liked ? 'fill-current' : ''}`} />
              <span>{like_count || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comments?.length || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Comments Section */}
        {showComments && (
          <div className="border-t p-4 space-y-4">
            <h3 className="font-semibold">Commentaires ({comments?.length || 0})</h3>
            
            {/* Comment Form */}
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un commentaire..."
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
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {comment.user?.nom?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.user?.nom || 'Utilisateur'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{comment.contenu}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun commentaire pour le moment
                </p>
              )}
            </div>
          </div>
        )}
      </Card>
    )
    : (
    <Card className="group relative overflow-hidden border-none bg-card shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* Image Section - Full bleed */}
      {displayImageUrl && ( // Afficher si on a une URL d'image
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          {/* Test avec img standard pour déboguer */}
          <img 
            src={displayImageUrl} 
            alt={description || "Report image"} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              console.error("Erreur de chargement d'image:", displayImageUrl, e);
            }}
            onLoad={() => {
              console.log("Image chargée avec succès:", displayImageUrl);
            }}
          />
          {/* Version Next.js Image (commentée pour test) */}
          {/* <Image 
            src={testImageUrl}
            alt={description || "Report image"} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          /> */}

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Status Badge */}
          {/* <Badge className={`absolute right-4 top-4 px-3 py-1.5 font-semibold shadow-lg `}>
            {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge> */}

          {/* Floating Action Buttons - TikTok style */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-4">
            <button 
              onClick={() => toggleLike(id)}
              disabled={isToggling}
              className="flex flex-col items-center gap-1 transition-transform hover:scale-110 disabled:opacity-50"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg ${is_liked ? 'text-red-500' : 'text-foreground'}`}>
                <Heart className={`h-5 w-5 ${is_liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-lg">{like_count || 0}</span>
            </button>

            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
                <MessageCircle className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-lg">{comments?.length || 0}</span>
            </button>

            <button className="transition-transform hover:scale-110">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
                <Share2 className="h-5 w-5 text-foreground" />
              </div>
            </button>
          </div>

            {/* Trois points pour le menu contextuel */}
          <div className="absolute top-0 right-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-500/20">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            {/* Author Info */}
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-11 w-11 border-2 border-white shadow-lg">
                {/* <AvatarImage src={user.avatar || "/placeholder.svg"} alt={author.name} /> */}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {/* {getInitials(user.name)} */}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold leading-tight drop-shadow-lg">{User.nom}</p>
                <p className="text-xs text-white/90 drop-shadow-lg">{User.nom}</p>
              </div>
             
            </div>

            {/* Title and Description */}
            <div className="mb-2 space-y-1">
              {/* <h3 className="text-pretty text-lg font-bold leading-snug drop-shadow-lg">{title}</h3> */}
              <p className="text-pretty text-sm leading-relaxed text-white/95 drop-shadow-lg line-clamp-2">
                {description}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-white/95">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium drop-shadow-lg">{lieu}</span>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="border-t p-4 space-y-4">
          <h3 className="font-semibold">Commentaires ({comments?.length || 0})</h3>
          
          {/* Comment Form */}
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un commentaire..."
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
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {comment.user?.nom?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.user?.nom || 'Utilisateur'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{comment.contenu}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun commentaire pour le moment
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
    )
  )
}
