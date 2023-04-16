/*
  Warnings:

  - You are about to drop the column `bot_id` on the `chat_members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,chat_id]` on the table `chat_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chat_id` to the `chat_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat_members" DROP CONSTRAINT "chat_members_bot_id_fkey";

-- DropIndex
DROP INDEX "chat_members_user_id_bot_id_key";

-- AlterTable
ALTER TABLE "chat_members" DROP COLUMN "bot_id",
ADD COLUMN     "chat_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chat_members_user_id_chat_id_key" ON "chat_members"("user_id", "chat_id");

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
