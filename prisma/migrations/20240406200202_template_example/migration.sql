/*
  Warnings:

  - You are about to drop the column `example` on the `template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "template" DROP COLUMN "example",
ADD COLUMN     "example_en" TEXT,
ADD COLUMN     "example_ru" TEXT;
