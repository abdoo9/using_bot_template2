-- CreateEnum
CREATE TYPE "BotType" AS ENUM ('OWNER_OWNED_MAKER', 'USER_OWNED_MAKER', 'REGULAR');

-- AlterTable
ALTER TABLE "bots" ADD COLUMN     "type" "BotType" NOT NULL DEFAULT 'REGULAR';

-- CreateTable
CREATE TABLE "replies" (
    "id" SERIAL NOT NULL,
    "trigger" TEXT NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "text" TEXT NOT NULL,
    "parse_mode" TEXT,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "replies_trigger_bot_id_key" ON "replies"("trigger", "bot_id");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
