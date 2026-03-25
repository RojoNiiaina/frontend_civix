import { useState, useEffect, useRef } from 'react'

export interface WebRTCConfig {
  iceServers?: RTCIceServer[]
  videoConstraints?: MediaStreamConstraints
  audioConstraints?: MediaStreamConstraints
}

export function useWebRTC(config: WebRTCConfig = {}) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [connectionState, setConnectionState] = useState<'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed'>('new')
  const [error, setError] = useState<string | null>(null)
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const defaultConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      ...config.iceServers || []
    ]
  }

  const defaultVideoConstraints: MediaStreamConstraints = {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: 'user'
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100
    }
  }

  // Initialize peer connection
  const initializePeerConnection = () => {
    try {
      const pc = new RTCPeerConnection(defaultConfig)
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to signaling server
          console.log('ICE candidate:', event.candidate)
          // TODO: Send to signaling server
        }
      }

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState as any)
        console.log('Connection state:', pc.connectionState)
      }

      pc.ontrack = (event) => {
        console.log('Received remote track:', event.track)
        const stream = event.streams[0]
        setRemoteStream(stream)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
      }

      peerConnectionRef.current = pc
      return pc
    } catch (err) {
      setError('Failed to initialize peer connection')
      console.error('Peer connection error:', err)
      return null
    }
  }

  // Start local stream
  const startLocalStream = async () => {
    try {
      // Initialize peer connection first
      const pc = initializePeerConnection()
      if (!pc) {
        throw new Error('Failed to initialize peer connection')
      }

      const stream = await navigator.mediaDevices.getUserMedia(
        config.videoConstraints || defaultVideoConstraints
      )
      
      setLocalStream(stream)
      setIsStreaming(true)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })

      return stream
    } catch (err) {
      setError('Failed to access camera/microphone')
      console.error('Media access error:', err)
      throw err
    }
  }

  // Stop local stream
  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    setIsStreaming(false)
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
  }

  // Create offer (for streamer)
  const createOffer = async () => {
    let pc = peerConnectionRef.current
    if (!pc) {
      pc = initializePeerConnection()
      if (!pc) return null
    }

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })
      
      await pc.setLocalDescription(offer)
      console.log('Created offer:', offer)
      
      // TODO: Send offer to signaling server
      return offer
    } catch (err) {
      setError('Failed to create offer')
      console.error('Offer error:', err)
      return null
    }
  }

  // Create answer (for viewer)
  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    let pc = peerConnectionRef.current
    if (!pc) {
      pc = initializePeerConnection()
      if (!pc) return null
    }

    try {
      await pc.setRemoteDescription(offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      
      console.log('Created answer:', answer)
      
      // TODO: Send answer to signaling server
      return answer
    } catch (err) {
      setError('Failed to create answer')
      console.error('Answer error:', err)
      return null
    }
  }

  // Handle remote description
  const handleRemoteDescription = async (description: RTCSessionDescriptionInit) => {
    const pc = peerConnectionRef.current
    if (!pc) return

    try {
      await pc.setRemoteDescription(description)
      console.log('Set remote description:', description.type)
    } catch (err) {
      setError('Failed to set remote description')
      console.error('Remote description error:', err)
    }
  }

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionRef.current
    if (!pc) return

    try {
      await pc.addIceCandidate(candidate)
      console.log('Added ICE candidate')
    } catch (err) {
      console.error('ICE candidate error:', err)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return videoTrack.enabled
      }
    }
    return false
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return audioTrack.enabled
      }
    }
    return false
  }

  // Get video/audio states
  const getVideoState = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      return videoTrack?.enabled || false
    }
    return false
  }

  const getAudioState = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      return audioTrack?.enabled || false
    }
    return false
  }

  // Cleanup
  const cleanup = () => {
    stopLocalStream()
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    setRemoteStream(null)
    setConnectionState('new')
    setError(null)
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  // Auto-cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [])

  return {
    localStream,
    remoteStream,
    isStreaming,
    connectionState,
    error,
    
    // Refs for video elements
    localVideoRef,
    remoteVideoRef,
    
    // Methods
    initializePeerConnection,
    startLocalStream,
    stopLocalStream,
    createOffer,
    createAnswer,
    handleRemoteDescription,
    handleIceCandidate,
    toggleVideo,
    toggleAudio,
    getVideoState,
    getAudioState,
    cleanup
  }
}
