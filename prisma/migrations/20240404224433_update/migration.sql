/*
  Warnings:

  - The primary key for the `bot_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bot_user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "request" DROP CONSTRAINT "request_bot_user_id_fkey";

-- DropIndex
DROP INDEX "bot_user_telegram_id_key";

-- AlterTable
ALTER TABLE "bot" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "bot_user" DROP CONSTRAINT "bot_user_pkey",
DROP COLUMN "id",
ALTER COLUMN "is_active" SET DEFAULT true,
ADD CONSTRAINT "bot_user_pkey" PRIMARY KEY ("telegram_id");

-- AlterTable
ALTER TABLE "occupation" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "bot_user_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_bot_user_id_fkey" FOREIGN KEY ("bot_user_id") REFERENCES "bot_user"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;
