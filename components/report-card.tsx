import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, MapPin, MoreVertical } from "lucide-react"
import Image from "next/image"

interface ReportCardProps {
  author: {
    name: string
    avatar?: string
  }
  category: string
  title: string
  description: string
  image?: string
  location: string
  status: "pending" | "in-progress" | "resolved"
  votes: number
  comments: number
  timeAgo: string
}

export function ReportCard({
  author,
  category,
  title,
  description,
  image,
  location,
  status,
  votes,
  comments,
  timeAgo,
}: ReportCardProps) {
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

  return (
    <Card className="group relative overflow-hidden border-none bg-card shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* Image Section - Full bleed */}
      {image && (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Status Badge */}
          <Badge className={`absolute right-4 top-4 px-3 py-1.5 font-semibold shadow-lg ${statusColors[status]}`}>
            {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="absolute left-4 top-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 font-medium shadow-lg"
          >
            {category}
          </Badge>

          {/* Floating Action Buttons - TikTok style */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-4">
            <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
                <Heart className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-lg">{votes}</span>
            </button>

            <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
                <MessageCircle className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-lg">{comments}</span>
            </button>

            <button className="transition-transform hover:scale-110">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
                <Share2 className="h-5 w-5 text-foreground" />
              </div>
            </button>
          </div>

          {/* Content Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            {/* Author Info */}
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-11 w-11 border-2 border-white shadow-lg">
                <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold leading-tight drop-shadow-lg">{author.name}</p>
                <p className="text-xs text-white/90 drop-shadow-lg">{timeAgo}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Title and Description */}
            <div className="mb-2 space-y-1">
              <h3 className="text-pretty text-lg font-bold leading-snug drop-shadow-lg">{title}</h3>
              <p className="text-pretty text-sm leading-relaxed text-white/95 drop-shadow-lg line-clamp-2">
                {description}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-white/95">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium drop-shadow-lg">{location}</span>
            </div>
          </div>
        </div>
      )}

      {/* No Image Variant */}
      {!image && (
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold leading-tight">{author.name}</p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {category}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold leading-snug">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{location}</span>
            </div>
            <Badge className={`${statusColors[status]} font-semibold`}>
              {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 border-t pt-4">
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Heart className="h-4 w-4" />
              <span>{votes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
