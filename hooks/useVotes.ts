// hooks/useVotes.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function useVotes() {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (payload: { report_id: number; type: "upvote" | "downvote" }) => {
      const res = await axios.post(`${API_URL}/votes/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["comments", variables.report_id] });
    },
  });

  return {
    vote: voteMutation.mutate,
    isVoting: voteMutation.isPending,
    voteError: voteMutation.error,
  };
}
