// hooks/useAdminStats.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Report, User } from "../lib/utils";

const api = "http://localhost:8000/api";

interface AdminStats {
  totalUsers: number;
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  userGrowth: number;
  reportGrowth: number;
  resolvedGrowth: number;
  pendingGrowth: number;
  avgResolutionTime: number;
  resolutionRate: number;
  citizenSatisfaction: number;
  submittedReports: number;
  communityVotes: number;
  publishedComments: number;
}

export default function useAdminStats() {
  // Query pour récupérer les statistiques
  const statsQuery = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      // Récupérer les utilisateurs
      const usersRes = await axios.get(`${api}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = usersRes.data.results;

      // Récupérer les rapports
      const reportsRes = await axios.get(`${api}/reports/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reports = reportsRes.data.results;

      // Calculer les statistiques
      const totalUsers = users.length;
      const totalReports = reports.length;
      const resolvedReports = reports.filter((r: Report) => r.statut === "resolu").length;
      const pendingReports = reports.filter((r: Report) => r.statut === "en_attente").length;
      
      // Simuler les données de croissance (à remplacer par de vraies données temporelles)
      const userGrowth = 12.5;
      const reportGrowth = 8.2;
      const resolvedGrowth = 15.3;
      const pendingGrowth = -5.1;
      
      // Autres métriques
      const avgResolutionTime = 2.4;
      const resolutionRate = totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;
      const citizenSatisfaction = 4.8;
      
      // Métriques d'engagement
      const submittedReports = totalReports;
      const communityVotes = reports.reduce((sum: number, r: Report) => sum + r.like_count, 0);
      const publishedComments = 8942; // À remplacer par un vrai appel API

      return {
        totalUsers,
        totalReports,
        resolvedReports,
        pendingReports,
        userGrowth,
        reportGrowth,
        resolvedGrowth,
        pendingGrowth,
        avgResolutionTime,
        resolutionRate,
        citizenSatisfaction,
        submittedReports,
        communityVotes,
        publishedComments,
      };
    },
  });

  return {
    data: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
  };
}
