import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react"
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
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    resolved: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold leading-none">{author.name}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <div>
          <h3 className="mb-1 font-semibold leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        {image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">{location}</span>
          </div>
          <Badge variant="outline" className={`text-xs ${statusColors[status]}`}>
            {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{votes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
