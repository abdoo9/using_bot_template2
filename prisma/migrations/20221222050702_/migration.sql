-- AlterTable
ALTER TABLE "bot_chats" ALTER COLUMN "canInviteUsers" DROP NOT NULL,
ALTER COLUMN "canInviteUsers" DROP DEFAULT;
