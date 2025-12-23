import { useMemo } from "react"
import useAuth from "./useAuth"

export function useRole() {
  const { user } = useAuth()
  
  const isAdmin = useMemo(() => {
    return user?.role === "admin"
  }, [user?.role])

  const isAgent = useMemo(() => {
    return user?.role === "agent"
  }, [user?.role])

  const isCitizen = useMemo(() => {
    return user?.role === "citizen" || !user?.role
  }, [user?.role])

  const hasRole = useMemo(() => {
    return (requiredRole: string) => {
      return user?.role === requiredRole
    }
  }, [user?.role])

  const hasAnyRole = useMemo(() => {
    return (roles: string[]) => {
      return roles.includes(user?.role || "")
    }
  }, [user?.role])

  return {
    isAdmin,
    isAgent,
    isCitizen,
    hasRole,
    hasAnyRole,
    currentRole: user?.role || "citizen"
  }
}
