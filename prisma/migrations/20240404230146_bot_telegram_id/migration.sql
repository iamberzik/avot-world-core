/*
  Warnings:

  - The primary key for the `bot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bot_user" DROP CONSTRAINT "bot_user_bot_id_fkey";

-- DropForeignKey
ALTER TABLE "status" DROP CONSTRAINT "status_bot_id_fkey";

-- DropForeignKey
ALTER TABLE "template" DROP CONSTRAINT "template_bot_id_fkey";

-- DropIndex
DROP INDEX "bot_telegram_id_key";

-- AlterTable
ALTER TABLE "bot" DROP CONSTRAINT "bot_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "bot_pkey" PRIMARY KEY ("telegram_id");

-- AlterTable
ALTER TABLE "bot_user" ALTER COLUMN "bot_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "status" ALTER COLUMN "bot_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "template" ALTER COLUMN "bot_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "status" ADD CONSTRAINT "status_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("telegram_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_user" ADD CONSTRAINT "bot_user_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("telegram_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "template_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("telegram_id") ON DELETE CASCADE ON UPDATE CASCADE;
