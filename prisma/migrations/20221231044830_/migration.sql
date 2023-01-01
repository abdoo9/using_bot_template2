-- CreateTable
CREATE TABLE "chat_subscription" (
    "user_id" BIGINT NOT NULL,
    "bot_id" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_subscription_user_id_bot_id_key" ON "chat_subscription"("user_id", "bot_id");

-- AddForeignKey
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "chats"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
