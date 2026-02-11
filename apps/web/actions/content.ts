"use server";
import {
  docMetadataSchema,
  DocMetadataSchema,
  noteSchema,
  NoteSchema,
  VideoTweetLinkData,
  videoTweetLinkSchema,
} from "@repo/common/config";
import { ContentType } from "@repo/common/config";
import prisma from "@repo/db/client";
import {
  ActionError,
  AddDocumentMemoryResponse,
  AddNoteMemoryResponse,
  AddVideoTweetLinkMemoryResponse,
  DeleteMemoryResponse,
  GetAllMemoriesResponse,
  GetAllTagsResponse,
} from "../types/global";
import getTagColor from "../lib/utils/getTagColor";
import { deleteDocumentFromS3 } from "./generatePresignedUrls";
import { deleteEmbeddings } from "./ingestion";

export async function addVideoTweetLinkMemory(
  data: VideoTweetLinkData,
  userId: string,
): Promise<AddVideoTweetLinkMemoryResponse> {
  try {
    const parsedData = videoTweetLinkSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { link, type, title, tags } = parsedData.data;

    const finalTags = await tagCreation(tags, userId);

    // create the content along with entries in the ContentTag table
    const memory = await prisma.content.create({
      data: {
        title,
        link,
        type,
        userId,
        contentTags: {
          createMany: {
            data: finalTags.map((tag) => ({ tagId: tag.id })),
          },
        },
        ContentEmbedding: {
          create: {
            status: "pending",
          },
        },
      },
    });

    if (!memory) {
      throw new Error("Error while creating a new document.");
    }

    // return response
    return { success: true, message: "Document successfully added.", memory };
  } catch (error) {
    return {
      success: false,
      error: `${error instanceof Error ? error.message : "Error while creating a new document"}`,
    };
  }
}

export async function addNoteMemory(
  data: NoteSchema,
  userId: string,
): Promise<AddNoteMemoryResponse> {
  try {
    const parsedData = noteSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { content, type, tags } = parsedData.data;

    const finalTags = await tagCreation(tags, userId);

    const memory = await prisma.content.create({
      data: {
        type,
        userId,
        contentTags: {
          createMany: {
            data: finalTags.map((tag) => ({ tagId: tag.id })),
          },
        },
        note: {
          create: {
            contentData: content,
          },
        },
        ContentEmbedding: {
          create: {
            status: "pending",
          },
        },
      },
    });

    if (!memory) {
      throw new Error("Error while creating a new note.");
    }

    return {
      success: true,
      message: "Document successfully added.",
      memory,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error while creating new note.",
    };
  }
}

export async function addDocumentMemory(
  data: DocMetadataSchema,
  userId: string,
  key: string,
): Promise<AddDocumentMemoryResponse> {
  try {
    const parsedData = docMetadataSchema.safeParse(data);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { type, fileType, title, tags } = parsedData.data;

    const finalTags = await tagCreation(tags, userId);

    const memory = await prisma.content.create({
      data: {
        type,
        title,
        userId,
        contentTags: {
          createMany: {
            data: finalTags.map((tag) => ({ tagId: tag.id })),
          },
        },
        document: {
          create: {
            filePath: key,
            fileType: fileType,
          },
        },
        ContentEmbedding: {
          create: {
            status: "pending",
          },
        },
      },
    });

    if (!memory) {
      throw new Error("Error while saving document metadata to the db.");
    }

    return {
      success: true,
      message: "Added the document successfully.",
      memory,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error while uploading document.",
    };
  }
}

// On the go tag creation logic
async function tagCreation(tags: string[], userId: string) {
  // check for the tags that already exist
  const existingTags = await prisma.tag.findMany({
    where: {
      title: { in: tags },
      userId,
    },
  });

  const existingTagNames = new Set(existingTags.map((tag) => tag.title));

  // create the missing ones
  const missingTagNames = tags?.filter(
    (tagName) => !existingTagNames.has(tagName),
  );

  await prisma.tag.createMany({
    data:
      missingTagNames?.map((title) => ({
        title,
        userId,
        color: getTagColor(),
      })) ?? [],
  });

  // fetch all the relevant tags again
  const finalTags = await prisma.tag.findMany({
    where: {
      title: { in: tags },
      userId,
    },
  });

  return finalTags;
}

export async function getAllMemories(
  userId: string,
): Promise<GetAllMemoriesResponse> {
  try {
    const memories = await prisma.content.findMany({
      where: {
        userId,
      },
      include: {
        contentTags: {
          select: {
            tag: {
              select: {
                title: true,
                color: true,
              },
            },
          },
        },
        note: {
          select: {
            contentData: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!memories) {
      throw new Error("Error while fetching memories.");
    }

    return {
      success: true,
      message: "all memories successfully fetched.",
      memories,
    };
  } catch (error) {
    return {
      success: false,
      error: `${error instanceof Error ? error.message : "Error while fetching memories."}`,
    };
  }
}

export async function getAllTags(userId: string): Promise<GetAllTagsResponse> {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        color: true,
      },
    });

    return {
      success: true,
      message: "successfully fetched tags.",
      tags,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error while fetching tags.",
    };
  }
}

export async function deleteMemory(
  memoryId: string,
): Promise<DeleteMemoryResponse> {
  try {
    const memory = await prisma.content.findUnique({
      where: {
        id: memoryId,
      },
      include: {
        document: {
          select: {
            filePath: true,
          },
        },
      },
    });

    if (!memory) {
      throw new Error("Memory not found.");
    }

    if (memory?.type === ContentType.document && memory.document?.filePath) {
      const response1 = await deleteDocumentFromS3(memory?.document?.filePath);

      if (!response1.success) {
        throw new Error((response1 as ActionError).error);
      }
    }

    const response2 = await deleteEmbeddings(memoryId);

    if (!response2.success) {
      throw new Error((response2 as ActionError).error);
    }

    await prisma.content.delete({
      where: {
        id: memoryId,
      },
    });

    return { success: true, message: "Deleted memory successfully." };
  } catch (error) {
    return {
      success: false,
      error: `${error instanceof Error ? error.message : "Error while deleting document."}`,
    };
  }
}
