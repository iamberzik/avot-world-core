/*
  Warnings:

  - You are about to drop the `template_layer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "template_layer" DROP CONSTRAINT "template_layer_template_id_fkey";

-- DropTable
DROP TABLE "template_layer";

-- DropEnum
DROP TYPE "layer_type";
