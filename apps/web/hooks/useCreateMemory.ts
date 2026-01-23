import { DocMetadataSchema, NoteSchema, VideoTweetLinkData } from "@repo/common/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocumentMemory, addNoteMemory, addVideoTweetLinkMemory } from "actions/content";
import { queryKeys } from "lib/queryKeys";

export function useCreateVTKMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      userId,
    }: {
      data: VideoTweetLinkData;
      userId: string;
    }) => {
      const response = await addVideoTweetLinkMemory(data, userId);
      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories });

      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

export function useCreateNoteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      userId,
    }: {
      data: NoteSchema;
      userId: string;
    }) => {
      const response = await addNoteMemory(data, userId);
      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories });

      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

export function useCreateDocumentMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      userId,
      key
    }: {
      data: DocMetadataSchema;
      userId: string;
      key: string
    }) => {
      const response = await addDocumentMemory(data, userId, key);
      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories });

      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}


