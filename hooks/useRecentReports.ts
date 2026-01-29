// hooks/useRecentReports.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Report } from "@/lib/utils";

const api = "http://localhost:8000/api";

type RecentReportsParams = {
  statut?: string; // e.g. "en_attente" | "en_cours" | "resolu" | "rejete" | "all"
  limit?: number;
};

export default function useRecentReports(params: RecentReportsParams = {}) {
  const { statut = "en_attente", limit = 10 } = params;

  return useQuery<Report[]>({
    queryKey: ["recent-reports", statut, limit],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/reports/`, {
        params: {
          ordering: "-created_at",
          ...(statut && statut !== "all" ? { statut } : {}),
          page_size: limit,
        },
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data.results ?? res.data;
    },
  });
}
