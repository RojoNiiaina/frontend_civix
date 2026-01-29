'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Facebook,
  Send,
  MessageCircle,
  Instagram,
  Link2,
  Copy,
} from 'lucide-react'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  url?: string
}

export function ShareDialog({
  open,
  onOpenChange,
  title,
  description,
  url = typeof window !== 'undefined' ? window.location.href : '',
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `${title} - ${description}`

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-100 hover:text-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-100 hover:text-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'hover:bg-sky-100 hover:text-sky-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'hover:bg-pink-100 hover:text-pink-600',
      url: `https://instagram.com/?url=${encodeURIComponent(url)}`,
      external: true,
    },
  ]

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Share this report on your favorite social media platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Media Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {shareLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Button
                  key={link.name}
                  variant="outline"
                  className={`h-20 flex-col gap-2 transition-all ${link.color}`}
                  onClick={() => handleShare(link.url)}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs font-medium">{link.name}</span>
                </Button>
              )
            })}
          </div>

          {/* Copy Link Section */}
          <div className="border-t pt-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Or copy the link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="gap-2 bg-transparent"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
