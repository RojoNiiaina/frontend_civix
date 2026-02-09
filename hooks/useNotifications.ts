// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Notification } from "@/lib/utils";

const API_URL = "http://localhost:8000/api";

export default function useNotifications() {
  const queryClient = useQueryClient();

  // 📌 1. Récupérer notifications (même structure que mobile)
  const notificationsQuery = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data);
      return res.data.results || res.data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes comme mobile
  });

  // 📌 2. Marquer comme lu (même API que mobile)
  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${API_URL}/notifications/${id}/`, { lu: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 📌 3. Supprimer une notification (même API que mobile)
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/notifications/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 📌 4. Marquer toutes comme lues (même API que mobile)
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${API_URL}/notifications/mark-all-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    loading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,

    markRead: markReadMutation.mutate,
    isMarking: markReadMutation.isPending,
    markError: markReadMutation.error,

    deleteNotification: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    markAllAsRead: markAllReadMutation.mutate,
    isMarkingAll: markAllReadMutation.isPending,
    markAllError: markAllReadMutation.error,
  };
}
