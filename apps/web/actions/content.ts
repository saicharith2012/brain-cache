"use server";
import {
  VideoTweetLinkData,
  videoTweetLinkSchema,
} from "@repo/common/config";
import prisma from "@repo/db/client";
import {
  ActionError,
  AddDocumentResponse,
  GetAllDocumentsResponse,
  GetAllTagsResponse,
} from "../types/global";
import getTagColor from "../lib/utils/getTagColor";


export async function addVideoTweetLink(data: VideoTweetLinkData, userId: string):Promise<AddDocumentResponse | ActionError> {
  try {
    const parsedData = videoTweetLinkSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: parsedData.error.issues[0]?.message || ""};
    }

    const { link, type, title, tags } = parsedData.data;

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
      },
    });

    if (!content) {
      throw new Error("Error while creating a new document.");
    }

    // return response
    return { success: true, message: "Document successfully added." };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while creating a new document"}`,
    };
  }
}

export async function getAllDocuments(
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

export async function deleteDocument(docId: string) {
  try {
    await prisma.content.delete({
      where: {
        id: docId,
      },
    });

    return { success: true, message: "Document successfully deleted." };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while deleting document."}`,
    };
  }
}
