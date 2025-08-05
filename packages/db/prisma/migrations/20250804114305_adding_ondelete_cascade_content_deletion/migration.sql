-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_contentId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "title" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
