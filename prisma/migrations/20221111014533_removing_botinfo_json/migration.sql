-- AlterTable
ALTER TABLE "bots" ADD COLUMN     "can_join_groups" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_read_all_group_messages" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "supports_inline_queries" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT;
