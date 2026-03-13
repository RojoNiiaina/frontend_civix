import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { LiveMessage, LiveStream, LiveViewer } from '@/lib/utils'
import api from '@/lib/api'

const API_BASE = '/live'

export function useLive() {
  const { token } = useAuth()
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [activeStreams, setActiveStreams] = useState<LiveStream[]>([])
  const [myStreams, setMyStreams] = useState<LiveStream[]>([])
  const [messages, setMessages] = useState<LiveMessage[]>([])
  const [viewers, setViewers] = useState<LiveViewer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create live API instance with base URL
  const liveApi = {
    get: (url: string, config?: any) => api.get(`/live${url}`, config),
    post: (url: string, data?: any, config?: any) => api.post(`/live${url}`, data, config),
  }

  // Fetch all streams
  const fetchStreams = async () => {
    try {
      setLoading(true)
      const response = await liveApi.get('/streams/')
      setStreams(response.data.results || response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch active streams
  const fetchActiveStreams = async () => {
    try {
      const response = await liveApi.get('/streams/active_streams/')
      setActiveStreams(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  // Fetch my streams
  const fetchMyStreams = async () => {
    try {
      const response = await liveApi.get('/streams/my_streams/')
      setMyStreams(response.data.results || response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  // Create a new stream
  const createStream = async (streamData: { title: string; description?: string }) => {
    try {
      setLoading(true)
      console.log('DEBUG: Creating stream with data:', streamData)
      const response = await liveApi.post('/streams/', streamData)
      console.log('DEBUG: Stream created successfully:', response.data)
      setStreams(prev => [response.data, ...prev])
      return response.data
    } catch (err) {
      console.error('DEBUG: Error creating stream:', err)
      if (err instanceof Error && 'response' in err) {
        console.error('DEBUG: Error response:', (err as any).response)
      }
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Start a stream
  const startStream = async (streamId: number) => {
    try {
      await liveApi.post(`/streams/${streamId}/start_stream/`)
      await fetchStreams()
      await fetchActiveStreams()
      await fetchMyStreams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  // End a stream
  const endStream = async (streamId: number) => {
    try {
      await liveApi.post(`/streams/${streamId}/end_stream/`)
      await fetchStreams()
      await fetchActiveStreams()
      await fetchMyStreams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  // Fetch messages for a stream
  const fetchMessages = async (streamId: number) => {
    try {
      const response = await liveApi.get('/messages/stream_messages/', {
        params: { stream_id: streamId }
      })
      setMessages(response.data.results || response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  // Send a message to a stream
  const sendMessage = async (streamId: number, content: string) => {
    try {
      const response = await liveApi.post('/messages/', {
        stream: streamId,
        content
      })
      setMessages(prev => [response.data, ...prev])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  // Join a stream
  const joinStream = async (streamId: number) => {
    try {
      await liveApi.post(`/viewers/${streamId}/join_stream/`)
      await fetchStreams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  // Leave a stream
  const leaveStream = async (streamId: number) => {
    try {
      await liveApi.post(`/viewers/${streamId}/leave_stream/`)
      await fetchStreams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  // Fetch viewers for a stream
  const fetchViewers = async (streamId: number) => {
    try {
      const response = await liveApi.get('/viewers/', {
        params: { stream: streamId }
      })
      setViewers(response.data.results || response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  // Initialize data
  useEffect(() => {
    if (token) {
      fetchStreams()
      fetchActiveStreams()
      fetchMyStreams()
    }
  }, [token])

  return {
    streams,
    activeStreams,
    myStreams,
    messages,
    viewers,
    loading,
    error,
    fetchStreams,
    fetchActiveStreams,
    fetchMyStreams,
    createStream,
    startStream,
    endStream,
    fetchMessages,
    sendMessage,
    joinStream,
    leaveStream,
    fetchViewers,
  }
}
