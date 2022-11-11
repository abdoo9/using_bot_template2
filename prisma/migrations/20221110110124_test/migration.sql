-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGINT NOT NULL,
    "language_code" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "user_is_deactivated" BOOLEAN NOT NULL DEFAULT false,
    "chat_not_found" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "bots" (
    "bot_id" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "bot_info" JSONB NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "group_id" BIGINT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bots_pkey" PRIMARY KEY ("bot_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" BIGINT NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "source_id" BIGINT NOT NULL,
    "dest_id" BIGINT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "user_bots" (
    "user_id" BIGINT NOT NULL,
    "bot_id" BIGINT NOT NULL,
    "user_is_banned" BOOLEAN NOT NULL DEFAULT false,
    "bot_is_blocked" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "bots_token_key" ON "bots"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_bots_user_id_bot_id_key" ON "user_bots"("user_id", "bot_id");

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_dest_id_fkey" FOREIGN KEY ("dest_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_bots" ADD CONSTRAINT "user_bots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_bots" ADD CONSTRAINT "user_bots_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bots"("bot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
