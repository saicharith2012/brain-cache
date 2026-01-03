import prisma from "@repo/db/client";
import random from "../lib/utils/random";
import { ContentWithTags } from "types/global";

export async function createLink(share: boolean, userId: string) {
  try {
    // if there link exists already, return it. Else create a new link.
    const existingLink = await prisma.link.findFirst({
      where: {
        userId,
      },
    });

    if (share) {
      if (existingLink) {
        return {
          success: true,
          link: existingLink.hash,
        };
      } else {
        const hash = random(15);
        const link = await prisma.link.create({
          data: {
            hash,
            userId,
          },
        });

        return {
          link: link.hash,
        };
      }
    } else {
      // delete existing link
      if (existingLink) {
        await prisma.link.delete({
          where: {
            id: existingLink.id,
          },
        });

        return { success: true, message: "removed link." };
      }
    }
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while fetching share link."}`,
    };
  }
}

export async function shareLink(hash: string): Promise<
  | {
      success: true;
      contents: ContentWithTags[]
      username: string;
    }
  | { error: string }
> {
  try {
    const link = await prisma.link.findFirst({
      where: {
        hash,
      },
    });

    if (!link) {
      throw new Error("Invalid URL.");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: link.userId,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const contents = await prisma.content.findMany({
      where: {
        userId: user.id,
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
      throw new Error("Error while fetching content.");
    }

    return {
      success: true,
      contents,
      username: user.username || "null",
    };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while fetching shared content."}`,
    };
  }
}
