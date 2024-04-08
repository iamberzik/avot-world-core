/*
  Warnings:

  - The primary key for the `bot_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `bot_user_id` column on the `request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `occupation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `status` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "request" DROP CONSTRAINT "request_bot_user_id_fkey";

-- AlterTable
ALTER TABLE "bot_user" DROP CONSTRAINT "bot_user_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "bot_user_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "request" DROP COLUMN "bot_user_id",
ADD COLUMN     "bot_user_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "occupation_code_key" ON "occupation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "status_code_key" ON "status"("code");

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_bot_user_id_fkey" FOREIGN KEY ("bot_user_id") REFERENCES "bot_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
