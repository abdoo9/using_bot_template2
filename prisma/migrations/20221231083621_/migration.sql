/*
  Warnings:

  - The `status` column on the `bot_chats` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `chat_subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('creator', 'administrator', 'member', 'restricted', 'left', 'kicked');

-- DropForeignKey
ALTER TABLE "chat_subscription" DROP CONSTRAINT "chat_subscription_bot_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_subscription" DROP CONSTRAINT "chat_subscription_user_id_fkey";

-- AlterTable
ALTER TABLE "bot_chats" DROP COLUMN "status",
ADD COLUMN     "status" "Status";

-- DropTable
DROP TABLE "chat_subscription";

-- CreateTable
CREATE TABLE "chat_members" (
    "user_id" BIGINT NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "status" "Status" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_members_user_id_bot_id_key" ON "chat_members"("user_id", "bot_id");

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "chats"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
