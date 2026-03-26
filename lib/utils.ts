import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Construit l'URL complète pour la photo de profil d'un utilisateur
 */
export function getProfileImageUrl(photo?: string): string | null {
  if (!photo) return null
  // Si l'image commence par http, c'est déjà une URL complète (retournée par le serializer)
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }
  // Si l'image commence par /media/, c'est une URL relative du backend Django
  if (photo.startsWith('/media/')) {
    return `http://localhost:8000${photo}`
  }
  // Sinon, essayer de construire l'URL complète
  return `http://localhost:8000/media/${photo}`
}

// lib/utils/models.ts

export type statutUser = "user" | "agent" | "admin"

export interface User {
  id: number;
  nom: string;
  email: string;
  role: statutUser;
  statut?: string;
  date_inscription?: string; // ISO string
  cin?: string;
  telephone?: string;
  photo?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string; // ISO string
}

export type ReportStatus = "en_attente" | "en_cours" | "resolu" | "rejete" | "approuve";

export interface Report {
  id: number;
  user: User;
  description: string;
  lieu: string;
  image?: string; // URL
  image1?: string;
  image2?: string;
  image_url?: string; // Generated URL from backend
  image1_url?: string; // Generated URL from backend
  image2_url?: string; // Generated URL from backend
  like: number;
  statut: ReportStatus;
  like_count: number;
  is_liked: boolean;
  created_at: string; // ISO string
}

export interface Notification {
  id: number;
  message: string;
  lu: boolean; // "lu" comme dans la version mobile
  created_at: string;
  user?: User; // Utilisateur qui a déclenché la notification
  report?: number; // ID du rapport concerné
}

export interface Comment {
  id: number;
  report: number; // report ID
  user: User;
  contenu: string; // Note: backend utilise "contenu" pas "content"
  created_at: string;
}

export interface Message {
  id: number;
  sender: User;
  recipient?: User;
  content: string;
  image?: string;
  created_at: string;
  is_read?: boolean;
}

export interface Conversation {
  id: number;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
  isOnline?: boolean;
}

export interface LiveStream {
  id: number
  title: string
  description: string
  streamer: number
  streamer_name: string
  streamer_photo?: string
  stream_key: string
  thumbnail?: string
  status: 'pending' | 'live' | 'ended' | 'cancelled'
  started_at?: string
  ended_at?: string
  viewer_count: number
  max_viewers: number
  created_at: string
  updated_at: string
  duration?: string
}

export interface LiveMessage {
  id: number
  stream: number
  user: number
  user_name: string
  user_photo_url?: string
  content: string
  created_at: string
}

export interface LiveViewer {
  id: number
  stream: number
  user?: number
  user_name?: string
  session_id: string
  joined_at: string
  left_at?: string
}
