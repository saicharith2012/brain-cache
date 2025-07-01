import prisma, { Content } from "@repo/db/client";
import random from "../utils/random";

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
  | { success: true; content: (Content & { contentTags: { tag: { title: string } }[] })[]; username: string }
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

    const content = await prisma.content.findMany({
      where: {
        userId: user.id,
      },

      include: {
        contentTags: {
          select: {
            tag: {
              select: { title: true },
            },
          },
        },
      },
    });

    if (!content) {
      throw new Error("Error while fetching content.");
    }

    return {
      success: true,
      content,
      username: user.username,
    };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "Error while fetching shared content."}`,
    };
  }
}
