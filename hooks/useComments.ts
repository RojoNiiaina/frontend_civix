// hooks/useComments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Comment } from "@/lib/utils";

const API_URL = "http://localhost:8000/api";

export default function useComments(reportId?: number) {
  const queryClient = useQueryClient();

  // 📌 1. Query : récupérer les commentaires d'un report
  const commentsQuery = useQuery<Comment[]>({
    queryKey: ["comments", reportId],
    queryFn: async () => {
      if (!reportId) return [];
      const res = await axios.get(`${API_URL}/comments/?report_id=${reportId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
    enabled: !!reportId,
  });

  // 📌 2. Ajouter un commentaire
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!reportId) throw new Error("reportId is required");
      const res = await axios.post(
        `${API_URL}/comments/`,
        { content, report_id: reportId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reportId] });
    },
  });

  // 📌 3. Supprimer un commentaire
  const deleteCommentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`${API_URL}/comments/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reportId] });
    },
  });

  return {
    data: commentsQuery.data,
    isLoading: commentsQuery.isPending,
    error: commentsQuery.error,

    addComment: addCommentMutation.mutate,
    isAdding: addCommentMutation.isPending,
    addError: addCommentMutation.error,

    deleteComment: deleteCommentMutation.mutate,
    isDeleting: deleteCommentMutation.isPending,
    deleteError: deleteCommentMutation.error,
  };
}
