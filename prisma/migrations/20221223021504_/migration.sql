-- DropForeignKey
ALTER TABLE "bot_chats" DROP CONSTRAINT "bot_chats_chat_id_fkey";

-- AddForeignKey
ALTER TABLE "bot_chats" ADD CONSTRAINT "bot_chats_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;
