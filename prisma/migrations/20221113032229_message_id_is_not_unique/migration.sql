/*
  Warnings:

  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[message_id,source_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "messages_message_id_source_id_key" ON "messages"("message_id", "source_id");
