-- CreateEnum
CREATE TYPE "BotType" AS ENUM ('AVATAR', 'OTHER');

-- AlterTable
ALTER TABLE "bot" ADD COLUMN     "type" "BotType" NOT NULL DEFAULT 'AVATAR';
