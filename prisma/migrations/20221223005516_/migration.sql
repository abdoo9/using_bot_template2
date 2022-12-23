-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "chats"("chat_id") ON DELETE SET NULL ON UPDATE CASCADE;
