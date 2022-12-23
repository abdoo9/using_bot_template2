-- AlterTable
ALTER TABLE "bot_chats" ADD COLUMN     "can_invite_users" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT;
