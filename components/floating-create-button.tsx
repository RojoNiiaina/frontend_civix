"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateReportDialog } from "./create-report-dialog"

export function FloatingCreateButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full p-0 shadow-2xl transition-all hover:scale-110 hover:shadow-xl bg-primary hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
