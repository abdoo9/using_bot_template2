-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('private', 'group', 'supergroup', 'channel');

-- DropIndex
DROP INDEX "messages_dest_id_dest_message_id_source_id_bot_id_key";

-- DropIndex
DROP INDEX "messages_source_message_id_dest_message_id_source_id_bot_id_key";

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "group_id" BIGINT;
