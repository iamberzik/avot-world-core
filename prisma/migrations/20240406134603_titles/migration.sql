/*
  Warnings:

  - You are about to drop the column `titles` on the `occupation` table. All the data in the column will be lost.
  - You are about to drop the column `titles` on the `status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "occupation" DROP COLUMN "titles",
ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "titleRu" TEXT;

-- AlterTable
ALTER TABLE "status" DROP COLUMN "titles",
ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "titleRu" TEXT;
