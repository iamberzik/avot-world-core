-- CreateEnum
CREATE TYPE "language" AS ENUM ('EN', 'RU');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('STATIC', 'ANIMATED');

-- CreateEnum
CREATE TYPE "layer_type" AS ENUM ('DEFAULT', 'PHOTO', 'LABEL', 'OCCUPATION');

-- CreateEnum
CREATE TYPE "request_type" AS ENUM ('INSIDE', 'ABOVE');

-- CreateTable
CREATE TABLE "bot" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "owner_id" INTEGER,

    CONSTRAINT "bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "titles" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "bot_id" INTEGER NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occupation" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "titles" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "status_id" INTEGER NOT NULL,

    CONSTRAINT "occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "language" "language",
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "status_id" INTEGER,
    "occupation_id" INTEGER,
    "additional" JSONB,
    "bot_id" INTEGER NOT NULL,

    CONSTRAINT "bot_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "overlaying" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "bot_id" INTEGER NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_layer" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "type" "layer_type" NOT NULL,
    "position" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "template_id" INTEGER NOT NULL,

    CONSTRAINT "template_layer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "request_type" NOT NULL,
    "template_id" INTEGER NOT NULL,
    "occupation_id" INTEGER,
    "bot_user_id" INTEGER,

    CONSTRAINT "request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_telegram_key" ON "bot"("telegram");

-- CreateIndex
CREATE UNIQUE INDEX "bot_telegram_id_key" ON "bot"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "bot_user_bot_id_id_key" ON "bot_user"("bot_id", "id");

-- AddForeignKey
ALTER TABLE "bot" ADD CONSTRAINT "bot_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD CONSTRAINT "status_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occupation" ADD CONSTRAINT "occupation_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_user" ADD CONSTRAINT "bot_user_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_user" ADD CONSTRAINT "bot_user_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "occupation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_user" ADD CONSTRAINT "bot_user_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "template_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_layer" ADD CONSTRAINT "template_layer_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_bot_user_id_fkey" FOREIGN KEY ("bot_user_id") REFERENCES "bot_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
