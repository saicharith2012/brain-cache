-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "link" DROP NOT NULL;

-- CreateTable
CREATE TABLE "NoteContent" (
    "id" TEXT NOT NULL,
    "contentData" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "NoteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentContent" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "DocumentContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NoteContent_contentId_key" ON "NoteContent"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentContent_contentId_key" ON "DocumentContent"("contentId");

-- AddForeignKey
ALTER TABLE "NoteContent" ADD CONSTRAINT "NoteContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentContent" ADD CONSTRAINT "DocumentContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
