import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message } from "@/lib/utils";
import api from "@/lib/api";


export default function useMessages() {
  const queryClient = useQueryClient();

  const getToken = async () => await localStorage.getItem("token");

  /**
   * ===============================
   * 📌 LISTE DES MESSAGES
   * - messages globaux
   * - messages privés (envoyés + reçus)
   * ===============================
   */
  const messagesQuery = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const token = await getToken();
      const res = await api.get("/chat/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.results || res.data;
    },
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });

  /**
   * ===============================
   * 📌 ENVOYER UN MESSAGE
   * - global : recipient = null
   * - privé : recipient = userId
   * ===============================
   */
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      content,
      recipient,
    }: {
      content: string;
      recipient?: number | null;
    }) => {
      const token = await getToken();
      const res = await api.post(
        "/chat/create/",
        { content, recipient: recipient ?? null },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.refetchQueries({ queryKey: ["messages"] });
    },
  });

  /**
   * ===============================
   * 📌 ENVOYER UN MESSAGE AVEC IMAGE
   * ===============================
   */
  const sendMessageWithImageMutation = useMutation({
    mutationFn: async ({
      content,
      recipient,
      image,
    }: {
      content: string;
      recipient?: number | null;
      image: File | null;
    }) => {
      const token = await getToken();
      
      // Créer FormData pour l'upload d'image
      const formData = new FormData();
      formData.append('content', content);
      formData.append('recipient', recipient?.toString() || '');
      
      // Ajouter l'image
      if (image) {
        formData.append('image', image);
      }

      const res = await api.post(
        "/chat/create/",
        formData,
        {
          headers: {
            ...token ? { Authorization: `Bearer ${token}` } : {},
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.refetchQueries({ queryKey: ["messages"] });
    },
  });

  /**
   * ===============================
   * 📌 MESSAGES PRIVÉS AVEC UN USER
   * (filtrage côté frontend)
   * ===============================
   */
  const getPrivateMessages = (userId: number) => {
    return messagesQuery.data?.filter(
      (msg) =>
        msg.recipient?.id === userId || msg.sender?.id === userId
    );
  };

  /**
   * ===============================
   * 📌 MESSAGES GLOBAUX
   * ===============================
   */
  const getGlobalMessages = () => {
    return messagesQuery.data?.filter(
      (msg) => msg.recipient === null
    );
  };

  return {
    /* Query */
    messages: messagesQuery.data,
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,

    /* Helpers */
    getPrivateMessages,
    getGlobalMessages,
    refetchMessages: messagesQuery.refetch,

    /* Mutations */
    sendMessage: sendMessageMutation.mutateAsync,
    sendMessageWithImage: sendMessageWithImageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending || sendMessageWithImageMutation.isPending,
    sendError: sendMessageMutation.error || sendMessageWithImageMutation.error,
  };
}
