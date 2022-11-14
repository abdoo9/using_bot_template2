/*
  Warnings:

  - A unique constraint covering the columns `[message_id,source_id,bot_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "messages_message_id_source_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "messages_message_id_source_id_bot_id_key" ON "messages"("message_id", "source_id", "bot_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
