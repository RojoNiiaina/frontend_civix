// hooks/useReports.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Report } from "../lib/utils";
const api = "http://localhost:8000/api"

export default function useReports() {
  const queryClient = useQueryClient();

  // 📌 1. Query : récupérer tous les reports
  const reportsQuery = useQuery<Report[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await axios.get(`${api}/reports/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.results;
    },
  });

   // 📌 2. Mutation : faire un like
  const addUserMutation = useMutation({
    mutationFn: async (newUser: { nom: string; email: string }) => {
      const res = await axios.post("http://localhost:8000/api/users/", newUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // 📌 2. Mutation : créer un report
  const addReportMutation = useMutation({
    mutationFn: async (newReport: {
      description: string;
      lieu: string;
      image?: File;
      image1?: File;
      image2?: File;
    }) => {
      const formData = new FormData();
      Object.entries(newReport).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value as string | Blob);
      });

      const res = await axios.post(`${api}/reports/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });

  // 📌 3. Mutation : supprimer un report
  const deleteReportMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`${api}/reports/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });

  // 📌 4. Mutation : mettre à jour un report
  const updateReportMutation = useMutation({
    mutationFn: async (updatedReport: {
      id: number;
      description?: string;
      lieu?: string;
    }) => {
      const res = await axios.patch(
        `${api}/reports/${updatedReport.id}/`,
        updatedReport,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });

  // 📌 4. Mutation : Appouver un report
  const ApprouveMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      try {
        const res = await axios.patch(
          `${api}/reports/${id}/approve/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });

  const RejeteMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      try {
        const res = await axios.patch(
          `${api}/reports/${id}/reject/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  })

  return {
    // Query
    data: reportsQuery.data,
    isLoading: reportsQuery.isLoading,
    isFetching: reportsQuery.isFetching,
    error: reportsQuery.error,
    refetch: reportsQuery.refetch,

    // Mutation add report
    addReport: addReportMutation.mutate,
    isAdding: addReportMutation.isPending,
    addError: addReportMutation.error,

    // Mutation delete report
    deleteReport: deleteReportMutation.mutate,
    isDeleting: deleteReportMutation.isPending,
    deleteError: deleteReportMutation.error,

    // Mutation update report
    updateReport: updateReportMutation.mutate,
    isUpdating: updateReportMutation.isPending,
    updateError: updateReportMutation.error,
    
    // Mutation approuve report
    approuveReport: ApprouveMutation.mutate,
    isApprouving: ApprouveMutation.isPending,
    approuveError: ApprouveMutation.error,

    //Mutation rejeter report
    rejeteReport : RejeteMutation.mutate,
    isRejeting: RejeteMutation.isPending,
    rejeteError : RejeteMutation.error,
  };
}
