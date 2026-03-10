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

  const handleStatusToggle = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (response.ok) {
        await refetch()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating user status:', error)
      return false
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await refetch()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  const handlePromoteToAdmin = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'admin' }),
      })

      if (response.ok) {
        await refetch()
        return true
      }
      return false
    } catch (error) {
      console.error('Error promoting user to admin:', error)
      return false
    }
  }

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
          throw new Error(`Failed to fetch users: ${response.status}`)
        }

        const data = await response.json()
        
        // Récupérer tous les utilisateurs sans filtre préalable
        const usersArray = data.results || data
        
        setUsers(Array.isArray(usersArray) ? usersArray : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token])

  const refetch = async () => {
    if (!token) return

    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const data = await response.json()
      
      const usersArray = data.results || data
      
      setUsers(Array.isArray(usersArray) ? usersArray : [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    error,
    refetch,
    handleStatusToggle,
    handleDeleteUser,
    handlePromoteToAdmin
  }
}
