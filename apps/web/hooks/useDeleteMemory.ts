import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemory } from "actions/content";
import { queryKeys } from "lib/queryKeys";

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
        memoryId
    }: {
      memoryId: string
    }) => {
      const response = await deleteMemory(memoryId);
      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories });
    },
  });
}