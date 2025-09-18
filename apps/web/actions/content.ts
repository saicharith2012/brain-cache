"use server";
import {
  docMetadataSchema,
  DocMetadataSchema,
  noteSchema,
  NoteSchema,
  VideoTweetLinkData,
  videoTweetLinkSchema,
} from "@repo/common/config";
import prisma, { ContentType } from "@repo/db/client";
import {
  ActionError,
  AddDocumentMemoryResponse,
  AddNoteMemoryResponse,
  AddVideoTweetLinkMemoryResponse,
  GetAllDocumentsResponse,
  GetAllTagsResponse,
} from "../types/global";
import getTagColor from "../lib/utils/getTagColor";
import { deleteDocumentFromS3 } from "./generatePresignedUrls";
import { deleteEmbeddings } from "./ingestion";

export async function addVideoTweetLink(
  data: VideoTweetLinkData,
  userId: string
): Promise<AddVideoTweetLinkMemoryResponse | ActionError> {
  try {
    const parsedData = videoTweetLinkSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: parsedData.error.issues[0]?.message || "" };
    }

    const { link, type, title, tags } = parsedData.data;

    const finalTags = await tagCreation(tags, userId);

    // create the content along with entries in the ContentTag table
    const content = await prisma.content.create({
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

    if (!content) {
      throw new Error("Error while creating a new document.");
    }

    // return response
    return { success: true, message: "Document successfully added.", content };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while creating a new document"}`,
    };
  }
}

export async function addNote(
  data: NoteSchema,
  userId: string
): Promise<AddNoteMemoryResponse | ActionError> {
  try {
    const parsedData = noteSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: parsedData.error.issues[0]?.message || "" };
    }

    const { content, type, tags } = parsedData.data;

    const finalTags = await tagCreation(tags, userId);

    const noteMemory = await prisma.content.create({
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

    if (!noteMemory) {
      throw new Error("Error while creating a new note.");
    }

    return {
      success: true,
      message: "Document successfully added.",
      noteMemory,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error while creating new note.",
    };
  }
}

export async function addDocument(
  data: DocMetadataSchema,
  userId: string,
  key: string
): Promise<AddDocumentMemoryResponse | ActionError> {
  try {
    const parsedData = docMetadataSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: parsedData.error.issues[0]?.message || "" };
    }

    const { type, fileType, title, tags } = parsedData.data;

    const finalTags = await tagCreation(tags, userId);

    const content = await prisma.content.create({
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

    if (!content) {
      throw new Error("Error while saving document metadata to the db.");
    }

    return {
      success: true,
      message: "Added the document successfully.",
      content,
    };
  } catch (error) {
    return {
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
    (tagName) => !existingTagNames.has(tagName)
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

export async function getAllContents(
  userId: string
): Promise<GetAllDocumentsResponse | ActionError> {
  try {
    const contents = await prisma.content.findMany({
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

    if (!contents) {
      throw new Error("Error while fetching documents.");
    }

    return {
      success: true,
      message: "all documents successfully fetched.",
      contents,
    };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while fetching documents."}`,
    };
  }
}

export async function getAllTags(
  userId: string
): Promise<GetAllTagsResponse | ActionError> {
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
      error:
        error instanceof Error ? error.message : "Error while fetching tags.",
    };
  }
}

export async function deleteContent(memoryId: string) {
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

    if (memory?.type === ContentType.document && memory.document?.filePath) {
      const response1 = await deleteDocumentFromS3(memory?.document?.filePath);

      if ((response1 as ActionError).error) {
        throw new Error((response1 as ActionError).error);
      }
    }

    const response2 = await deleteEmbeddings(memoryId);

    if ((response2 as ActionError).error) {
      throw new Error((response2 as ActionError).error);
    }

    await prisma.content.delete({
      where: {
        id: memoryId,
      },
    });

    return { success: true, message: "Document successfully deleted." };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while deleting document."}`,
    };
  }
}
