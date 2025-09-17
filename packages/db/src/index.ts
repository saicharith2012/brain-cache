import pkg from "./generated/prisma/client.js";

const { PrismaClient, ContentType } = pkg;
type Content = pkg.Content;

const prismaClientSingleton = () => {
  return new PrismaClient();
};
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;
export { ContentType };
export type { Content };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
