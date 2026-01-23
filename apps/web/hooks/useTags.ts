import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "actions/content";

export const useTags = (userId: string) => {
    return useQuery({
        queryKey: ["tags"],
        enabled: !!userId,
        queryFn: async () => {
          const response = await getAllTags(userId!);
    
          if (!response.success) {
            throw new Error(response.error);
          }
    
          return response.tags;
        },
      });
}