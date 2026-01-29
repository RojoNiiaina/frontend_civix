"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import useAuth from "@/hooks/useAuth"

export default function AgentGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoadingUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoadingUser) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "agent") {
        router.push("/unauthorized") // Page d'accès refusé
      } else {
        setIsLoading(false)
      }
    }
  }, [user, isLoadingUser, router])

  if (isLoading || isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return user?.role === "agent" ? <>{children}</> : null
}
