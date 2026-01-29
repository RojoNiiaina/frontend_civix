// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "../lib/utils";

export default function useUsers() {
  const queryClient = useQueryClient();

  // 📌 1. Query : récupérer la liste des users
  const token = localStorage.getItem("token");
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/users/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log(res.data)
      return res.data.results;
      
    },
  });

  // 📌 2. Mutation : ajouter un user
  const addUserMutation = useMutation({
    mutationFn: async (newUser: { nom: string; email: string }) => {
      const res = await axios.post("http://localhost:8000/api/users/", newUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // 📌 3. Mutation : supprimer un user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`http://localhost:8000/api/users/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // 📌 3. Mutation : supprimer un user
  const profileUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.get( 
        `http://localhost:8000/api/users/${id}/`,
        {
          headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data", // important !
        },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

const updateUserMutation = useMutation({
  mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:8000/api/users/${id}/`,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data", // important !
        },
      }
    );
    return res.data;
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
});



  return {
    // Query
    data: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,

    //Profile User
    ProfileUser : profileUserMutation.mutate,

    // Mutation add user
    addUser: addUserMutation.mutate,
    isAdding: addUserMutation.isPending,
    addError: addUserMutation.error,

    // Mutation delete user
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
    deleteError: deleteUserMutation.error,

    // Mutation update user
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    updateError: updateUserMutation.error,
  };
}
