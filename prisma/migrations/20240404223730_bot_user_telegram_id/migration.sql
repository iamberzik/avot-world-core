/*
  Warnings:

  - A unique constraint covering the columns `[telegram_id]` on the table `bot_user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bot_id,telegram_id]` on the table `bot_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram_id` to the `bot_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bot_user_bot_id_id_key";

-- AlterTable
ALTER TABLE "bot_user" ADD COLUMN     "telegram_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bot_user_telegram_id_key" ON "bot_user"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "bot_user_bot_id_telegram_id_key" ON "bot_user"("bot_id", "telegram_id");
