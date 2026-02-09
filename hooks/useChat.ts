import { useState, useEffect, useRef } from "react"
import { chatAPI, usersAPI } from "@/lib/api"
import { Message, Conversation, User } from "@/lib/utils"

export function useMessages(userId?: number) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // Toujours récupérer tous les messages comme dans la version mobile
    const fetchAllMessages = async () => {
      try {
        // setLoading(true)
        const response = await chatAPI.getMessages() // Appel sans userId pour tous les messages
        console.log('Messages API response:', response.data)
        setMessages(response.data.results || response.data)
      } catch (err: any) {
        console.error('Error fetching messages:', err)
        setError(err.response?.data?.message || "Failed to fetch messages")
        setMessages([]) // S'assurer que messages est toujours un tableau
      } finally {
        setLoading(false)
      }
    }

    fetchAllMessages()
  }, []) // Plus de dépendance à userId

  const sendMessage = async (content: string, recipientId?: number | null) => {
    try {
      setIsSending(true)
      // Si recipientId est 0 ou undefined, c'est un message de groupe
      const response = await chatAPI.sendMessage({ 
        content, 
        recipient: recipientId && recipientId !== 0 ? recipientId : null 
      })
      const newMessage = response.data
      setMessages(prev => [...prev, newMessage])
      return newMessage
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message")
      return null
    } finally {
      setIsSending(false)
    }
  }

  const sendMessageWithImage = async (content: string, image: File, recipientId?: number | null) => {
    try {
      setIsSending(true)
      
      // Créer FormData pour l'upload d'image
      const formData = new FormData()
      formData.append('content', content)
      formData.append('recipient', (recipientId && recipientId !== 0 ? recipientId.toString() : ''))
      formData.append('image', image)

      const response = await chatAPI.sendMessageWithImage(formData)
      const newMessage = response.data
      setMessages(prev => [...prev, newMessage])
      return newMessage
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message with image")
      return null
    } finally {
      setIsSending(false)
    }
  }

  // Fonctions de filtrage comme dans la version mobile
  const getPrivateMessages = (userId: number) => {
    if (!Array.isArray(messages)) return []
    return messages.filter(
      (msg) =>
        (msg.recipient?.id === userId || msg.sender?.id === userId)
    )
  }

  const getGlobalMessages = () => {
    if (!Array.isArray(messages)) return []
    return messages.filter(
      (msg) => msg.recipient === null
    )
  }

  // Filtrer les messages selon userId
  const filteredMessages = !userId || userId === 0 
    ? getGlobalMessages()
    : getPrivateMessages(userId)

  console.log('Original messages:', messages)
  console.log('Filtered messages:', filteredMessages)
  console.log('UserId:', userId)

  return {
    messages: filteredMessages,
    allMessages: messages, // Pour debug si besoin
    loading,
    error,
    sendMessage,
    sendMessageWithImage,
    isSending,
    getPrivateMessages,
    getGlobalMessages,
    refetch: () => {
      // setLoading(true)
      chatAPI.getMessages()
        .then(response => setMessages(response.data.results || response.data))
        .catch(err => {
          setError(err.response?.data?.message || "Failed to fetch messages")
          setMessages([]) // S'assurer que messages est toujours un tableau
        })
        .finally(() => setLoading(false))
    }
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // setLoading(true)
        const response = await chatAPI.getConversations()
        const privateConversations = response.data
        
        // Ajouter la conversation de groupe Civix
        const groupConversation: Conversation = {
          id: 0,
          user: {
            id: 0,
            nom: "Groupe Civix",
            email: "group@civix.com",
            role: "agent",
            statut: "actif",
            photo: undefined,
          },
          lastMessage: undefined,
          unreadCount: 0,
          isOnline: true,
        }
        
        // Mettre le groupe en premier, puis les conversations privées
        setConversations([groupConversation, ...privateConversations])
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch conversations")
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  return {
    conversations,
    loading,
    error,
    refetch: () => {
      // setLoading(true)
      chatAPI.getConversations()
        .then(response => {
          const privateConversations = response.data
          
          // Ajouter la conversation de groupe Civix
          const groupConversation: Conversation = {
            id: 0,
            user: {
              id: 0,
              nom: "Groupe Civix",
              email: "group@civix.com",
              role: "agent",
              statut: "actif",
              photo: undefined,
            },
            lastMessage: undefined,
            unreadCount: 0,
            isOnline: true,
          }
          
          setConversations([groupConversation, ...privateConversations])
        })
        .catch(err => setError(err.response?.data?.message || "Failed to fetch conversations"))
        .finally(() => setLoading(false))
    }
  }
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // setLoading(true)
        const response = await usersAPI.getAll()
        
        // Filtrer pour exclure l'utilisateur actuel et ne montrer que les utilisateurs actifs
        const currentUserId = parseInt(localStorage.getItem('userId') || '0')
        const filteredUsers = response.data.filter((user: User) => 
          user.id !== currentUserId && 
          user.statut === 'actif' &&
          user.role !== 'admin'
        )

        setUsers(filteredUsers)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    refetch: () => {
      // setLoading(true)
      usersAPI.getAll()
        .then(response => {
          const currentUserId = parseInt(localStorage.getItem('userId') || '0')
          const filteredUsers = response.data.filter((user: User) => 
            user.id !== currentUserId && 
            user.statut === 'actif' &&
            user.role !== 'admin'
          )
          setUsers(filteredUsers)
        })
        .catch(err => setError(err.response?.data?.message || "Failed to fetch users"))
        .finally(() => setLoading(false))
    }
  }
}
