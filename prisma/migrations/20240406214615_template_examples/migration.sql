/*
  Warnings:

  - You are about to drop the column `example_en` on the `template` table. All the data in the column will be lost.
  - You are about to drop the column `example_ru` on the `template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "template" DROP COLUMN "example_en",
DROP COLUMN "example_ru";
