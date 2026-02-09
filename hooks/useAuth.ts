// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "../lib/utils";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const API_URL = "http://localhost:8000/api";

export default function useAuth() {
    const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  // 📌 1. Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await axios.post(`${API_URL}/users/login/`, credentials);
      return res.data; // { access: "...", refresh: "..." }
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access);
      setToken(data.access);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  // 📌 2. Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear();
  };

  // 📌 3. Récupérer l'utilisateur connecté (me)
  const meQuery = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      if (!token) return null;
      const res = await api.get(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // 📌 4. Mettre à jour token au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return {
    token,
    user: meQuery.data,
    isLoadingUser: meQuery.isPending,
    userError: meQuery.error,

    // Mutations
    login: loginMutation.mutateAsync, // <-- changer mutate en mutateAsync
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Logout
    logout,
  };

}
