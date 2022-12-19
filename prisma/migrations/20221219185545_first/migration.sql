-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "BotType" AS ENUM ('OWNER_OWNED_MAKER', 'USER_OWNED_MAKER', 'REGULAR');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('private', 'group', 'supergroup', 'channel');

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGINT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "first_name" TEXT NOT NULL DEFAULT 'first_name',
    "last_name" TEXT,
    "username" VARCHAR(32),
    "language_code" CHAR(2),
    "user_is_deactivated" BOOLEAN NOT NULL DEFAULT false,
    "chat_not_found" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "chats" (
    "chat_id" BIGINT NOT NULL,
    "title" TEXT,
    "username" VARCHAR(32),
    "owner_id" BIGINT,
    "type" "ChatType" NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "bots" (
    "bot_id" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "owner_id" BIGINT NOT NULL DEFAULT 527340500,
    "group_id" BIGINT,
    "first_name" VARCHAR(210) NOT NULL DEFAULT 'bot_name',
    "username" VARCHAR(32) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" "BotType" NOT NULL DEFAULT 'REGULAR',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bots_pkey" PRIMARY KEY ("bot_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "source_message_id" INTEGER NOT NULL,
    "dest_message_id" INTEGER NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "source_id" BIGINT NOT NULL,
    "dest_id" BIGINT NOT NULL,
    "group_id" BIGINT,
    "text" VARCHAR(4096),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "user_id" BIGINT NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "user_is_banned" BOOLEAN NOT NULL DEFAULT false,
    "bot_is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "replies" (
    "trigger" TEXT NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "message_id" INTEGER NOT NULL,
    "chat_id" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "bots_token_key" ON "bots"("token");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_bot_id_key" ON "subscriptions"("user_id", "bot_id");

-- CreateIndex
CREATE UNIQUE INDEX "replies_trigger_bot_id_key" ON "replies"("trigger", "bot_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "chats"("chat_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
