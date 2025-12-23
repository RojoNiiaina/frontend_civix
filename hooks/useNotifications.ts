// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Notification } from "../lib/utils";

const API_URL = "http://localhost:8000/api";

export default function useNotifications() {
  const queryClient = useQueryClient();

  // 📌 1. Récupérer notifications
  const notificationsQuery = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
  });

  // 📌 2. Marquer comme lu
  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.patch(`${API_URL}/notifications/${id}/`, { read: true }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    data: notificationsQuery.data,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,

    markRead: markReadMutation.mutate,
    isMarking: markReadMutation.isPending,
    markError: markReadMutation.error,
  };
}
