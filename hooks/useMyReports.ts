// hooks/useMyReports.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Report } from "../lib/utils";
const api = "http://localhost:8000/api"

export default function useMyReports() {
  const queryClient = useQueryClient();

  // 📌 Query : récupérer uniquement les reports de l'utilisateur connecté
  const myReportsQuery = useQuery<Report[]>({
    queryKey: ["my-reports"],
    queryFn: async () => {
      const res = await axios.get(`${api}/reports/my_reports/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.results || res.data;
    },
  });

  return {
    data: myReportsQuery.data,
    isLoading: myReportsQuery.isLoading,
    error: myReportsQuery.error,
  };
}
