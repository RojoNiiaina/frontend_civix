import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
