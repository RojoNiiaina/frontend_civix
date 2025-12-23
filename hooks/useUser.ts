// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "../lib/utils";

export default function useUsers() {
  const queryClient = useQueryClient();

  // 📌 1. Query : récupérer la liste des users
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/users/");
      return res.data;
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

  // 📌 4. Mutation : modifier un user
  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: { id: number; nom: string; email: string }) => {
      const res = await axios.put(
        `http://localhost:8000/api/users/${updatedUser.id}/`,
        { nom: updatedUser.nom, email: updatedUser.email }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    // Query
    data: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,

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
