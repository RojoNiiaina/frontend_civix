import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils/models.ts

export interface User {
  id: number;
  nom: string;
  email: string;
  role?: string;
  statut?: string;
  date_inscription?: string; // ISO string
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string; // ISO string
}

export type ReportStatus = "pending" | "in_progress" | "resolved";
export type ReportPriority = "low" | "medium" | "high";

export interface Report {
  id: number;
  user: User;
  category: Category;
  category_id?: number; // utile pour les créations
  description: string;
  image?: string; // URL
  latitude?: string;
  longitude?: string;
  statut: ReportStatus;
  priorite: ReportPriority;
  created_at: string; // ISO string
}

export interface Notification {
  id: number;
  message: string;
  user_id: number;
  read: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  report_id: number;
  user: User;
  content: string;
  created_at: string;
}
