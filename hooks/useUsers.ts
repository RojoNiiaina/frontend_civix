import { useState, useEffect } from "react"
import useAuth from "./useAuth"

const API_BASE_URL = "http://localhost:8000/api"

export interface User {
  id: number
  email: string
  nom: string
  photo?: string
  role: string
  statut: string
  telephone?: string
  cin?: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return

    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/users/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        
        // Filtrer pour exclure l'utilisateur actuel et ne montrer que les utilisateurs actifs
        const currentUserId = parseInt(localStorage.getItem('userId') || '0')
        const filteredUsers = data.filter((user: User) => 
          user.id !== currentUserId && 
          user.statut === 'actif' &&
          user.role !== 'admin' // Optionnel: exclure les admins
        )

        setUsers(filteredUsers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token])

  return {
    users,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      // Trigger refetch
    }
  }
}
