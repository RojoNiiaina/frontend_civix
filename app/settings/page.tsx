import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft } from "lucide-react"
import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/feed" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CIVIX</span>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <SettingsPage />
        </div>
      </div>
    </div>
  )
}
