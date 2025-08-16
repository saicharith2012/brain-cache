-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('pending', 'processing', 'ready', 'failed');

-- CreateTable
CREATE TABLE "ContentEmbedding" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "status" "EmbeddingStatus" NOT NULL DEFAULT 'pending',
    "model" TEXT NOT NULL,
    "chunksCount" INTEGER NOT NULL DEFAULT 0,
    "lastIndexAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentEmbedding_contentId_key" ON "ContentEmbedding"("contentId");

-- AddForeignKey
ALTER TABLE "ContentEmbedding" ADD CONSTRAINT "ContentEmbedding_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
