/*
  Warnings:

  - You are about to drop the column `by_bot_admin` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dest_id,dest_message_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_dest_id_fkey";

-- DropIndex
DROP INDEX "messages_dest_id_dest_message_id_bot_id_key";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "by_bot_admin",
ADD COLUMN     "from_admin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "messages_dest_id_dest_message_id_key" ON "messages"("dest_id", "dest_message_id");
