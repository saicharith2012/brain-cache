/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_title_userId_key" ON "Tag"("title", "userId");
