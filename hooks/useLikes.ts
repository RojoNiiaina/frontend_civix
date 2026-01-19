// hooks/useLikes.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function useLikes() {
  const queryClient = useQueryClient();

  // Mutation pour liker/unliker un report
  const toggleLikeMutation = useMutation({
    mutationFn: async (reportId: number) => {
      const res = await axios.post(
        `${API_URL}/reports/${reportId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // Rafraîchir les reports après un like/unlike
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  return {
    toggleLike: toggleLikeMutation.mutate,
    isToggling: toggleLikeMutation.isPending,
    error: toggleLikeMutation.error,
  };
}
