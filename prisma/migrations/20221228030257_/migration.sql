-- AlterTable
ALTER TABLE "bot_chats" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "replies" ALTER COLUMN "updated_at" DROP DEFAULT;
