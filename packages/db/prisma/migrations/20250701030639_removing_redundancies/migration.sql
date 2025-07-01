/*
  Warnings:

  - You are about to drop the `_ContentToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ContentToTag" DROP CONSTRAINT "_ContentToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToTag" DROP CONSTRAINT "_ContentToTag_B_fkey";

-- DropTable
DROP TABLE "_ContentToTag";
