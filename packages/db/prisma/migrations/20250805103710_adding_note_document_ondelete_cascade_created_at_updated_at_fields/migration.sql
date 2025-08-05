-- DropForeignKey
ALTER TABLE "DocumentContent" DROP CONSTRAINT "DocumentContent_contentId_fkey";

-- DropForeignKey
ALTER TABLE "NoteContent" DROP CONSTRAINT "NoteContent_contentId_fkey";

-- AlterTable
ALTER TABLE "DocumentContent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NoteContent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "NoteContent" ADD CONSTRAINT "NoteContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentContent" ADD CONSTRAINT "DocumentContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
