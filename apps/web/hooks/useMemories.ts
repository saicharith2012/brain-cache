import { useQuery } from "@tanstack/react-query";
import { getAllMemories } from "actions/content";
import { queryKeys } from "lib/queryKeys";

export const useMemories = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.memories,
    enabled: !!userId,
    queryFn: async () => {
      const response = await getAllMemories(userId!);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.memories;
    },
    staleTime: 60_000,
  });
};
