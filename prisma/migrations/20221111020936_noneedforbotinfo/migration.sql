-- AlterTable
ALTER TABLE "bots" ALTER COLUMN "can_join_groups" SET DEFAULT true,
ALTER COLUMN "can_read_all_group_messages" SET DEFAULT true,
ALTER COLUMN "supports_inline_queries" SET DEFAULT true;
