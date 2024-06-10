-- AlterEnum
ALTER TYPE "language" ADD VALUE 'UZ';

-- AlterTable
ALTER TABLE "occupation" ADD COLUMN     "titleUz" TEXT;

-- AlterTable
ALTER TABLE "status" ADD COLUMN     "titleUz" TEXT;
