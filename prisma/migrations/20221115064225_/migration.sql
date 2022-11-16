/*
  Warnings:

  - A unique constraint covering the columns `[dest_id,dest_message_id,source_id,bot_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source_message_id,dest_message_id,source_id,bot_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "messages_dest_id_dest_message_id_key";

-- DropIndex
DROP INDEX "messages_source_message_id_source_id_bot_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "messages_dest_id_dest_message_id_source_id_bot_id_key" ON "messages"("dest_id", "dest_message_id", "source_id", "bot_id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_source_message_id_dest_message_id_source_id_bot_id_key" ON "messages"("source_message_id", "dest_message_id", "source_id", "bot_id");
